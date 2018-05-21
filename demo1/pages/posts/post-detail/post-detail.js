var postsData = require('../../../data/postsData.js');
var appInstance = getApp();

Page({

  data: {
    isPlayingMusic: false,
    musicStart: '/images/icons/music-start.png',
    musicStop: '/images/icons/music-stop.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('获取appInstance', appInstance.globalData.g_isPlayingMusic);

    console.log('详情页--postId',options);
    // 根据postId获取详情页数据
    var curPostId = this.data.curPostId = options.id;
    var data = postsData.postsContent.filter(function(el){
      if(el.postId == curPostId) return el;
    });
    this.setData({detailInfo: data[0]});

    // var postsCollected = {
    //   0: 'true',
    //   1: 'false',
    //   2: 'true'
    // };
    var postsCollected = wx.getStorageSync('postsCollected');
    if (postsCollected){
      if (postsCollected[curPostId] == undefined){
        postsCollected[curPostId] = false;    // 报错，手动初始化为undefined为false
      }
      this.setData({ collected: postsCollected[curPostId]});
      console.log('收藏过，值是：', this.data.collected);
    }else{
      console.log('没有被收藏过', curPostId);
      var postsCollected = {};
      postsCollected[curPostId] = false;
      wx.setStorageSync('postsCollected', postsCollected);
    }

    // 只有上一次记录的是当前详情的音乐时，封面和icon才改变
    if (appInstance.globalData.g_isPlayingMusic && (appInstance.globalData.musicPostId == this.data.curPostId)){
      this.setData({ isPlayingMusic : true});
    }

    // 监听音乐播放(点击播放器的开始和暂停，同步到代码，已做封面的更换和icon的更换)
    var self = this;
    wx.onBackgroundAudioPlay(function(){
      console.log('监听音乐播放');
      self.setData({ isPlayingMusic: true});
      appInstance.globalData.g_isPlayingMusic = true;
      appInstance.globalData.musicPostId = self.data.curPostId;
      
    });

    // 监听音乐暂停
    wx.onBackgroundAudioPause(function () {
      console.log('监听音乐暂停');
      self.setData({ isPlayingMusic: false });
      appInstance.globalData.g_isPlayingMusic = false;
      appInstance.globalData.musicPostId = null;
    });

  },
  // 收藏-取消收藏文章
  collection: function(){
    var postsCollected = wx.getStorageSync('postsCollected');
    var curIsCollected = postsCollected[this.data.curPostId];
    console.log('当前文章是否被收藏',curIsCollected);
    curIsCollected = !curIsCollected; // 取反
    // 更新界面
    this.setData({ collected: curIsCollected});
    // 更新缓存
    postsCollected[this.data.curPostId] = curIsCollected;
    wx.setStorageSync('postsCollected', postsCollected);
    // 通知用户
    wx.showToast({
      title: curIsCollected ? '收藏成功' : '取消收藏',
      duration: 1000
    });

  },
  // 分享
  share: function(){
    var itemList = [
      '分享到朋友圈',
      '分享给微信好友',
      '分享到微博'
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function(res){
        console.log(res)
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '用户是否取消？现在还无法实现分享功能。',
        })
      }
    });
  },
  // 播放音乐
  music: function(){
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic){  // 只有当前是播放状态，才可以暂停
      wx.pauseBackgroundAudio();
      this.setData({ isPlayingMusic: false});
    }else{  // 否则播放
      this.setData({ isPlayingMusic: true });

      wx.playBackgroundAudio({
        dataUrl: this.data.detailInfo.music.url,
        title: this.data.detailInfo.music.title,
        coverImgUrl: this.data.detailInfo.music.coverImg 
      });
    }
    
  }

})
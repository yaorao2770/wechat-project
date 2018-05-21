// 只能使用相对路径
var postsData = require('../../data/postsData.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ lists: postsData.postsContent});

    // this.data.lists = postsData.postsContent;
    
  },

  goDetail: function(event){
    var postId = event.currentTarget.dataset.postid;
    console.log(postId);
    wx.navigateTo({
      url: './post-detail/post-detail?id=' + postId
    })
  }
})
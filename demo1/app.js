//app.js
App({
  onLaunch: function () {
    console.log('app-onLaunch');

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function(){
    console.log('app-onShow');
  },
  onHide: function () {
    console.log('app-onHide');
  },
  globalData: {
    userInfo: null,
    g_isPlayingMusic: false,  // 音乐是否在播放，记录进入详情页时,如果上一次的音乐没有停止,就继续播放（主要是UI上的变化：cover和icon）
    musicPostId: null         // 哪一个音乐正在被播放，判断上一次为关闭的音乐是否是当前页面的音乐
  }
})
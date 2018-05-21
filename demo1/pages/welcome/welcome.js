Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  goPosts: function(e){
    wx.redirectTo({
      url: '/pages/posts/post'
    });
  }
})
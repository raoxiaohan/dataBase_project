// pages/findseats/findseats.js
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
     
    },
    choose(e){
      console.log(e)
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      var app=getApp()
      var that = this
      let user_id=app.globalData.userid
      console.log(user_id)
      wx.request({
        url: 'http://127.0.0.1:8000/wx/wx_login/',
        method:'GET',
       data:{
          action:'plan_choose',
          user_id:user_id
       },
        success(result){
          console.log(result)
          that.setData({hasMore:result.data.has})
          that.setData({orderList:result.data.list})
        } 
      })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
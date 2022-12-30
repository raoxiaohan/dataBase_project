// pages/more_cou/more_cou.js
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
        var app=getApp()
        var that=this
        let user_id=app.globalData.userid
        wx.request({
            url: 'http://127.0.0.1:8000/wx/wx_login/',
            method:'GET',
           data:{
              action:'get_cou',
              user_id:1
           },
            success(result){
                console.log(result)
                
              that.setData({my_coupons:result.data.cous})
              console.log(that.data.my_coupons)
            } 
          })
    },
    receive(e){
      var app=getApp()
        var that=this
        let user_id=app.globalData.userid
      wx.request({
        url: 'http://127.0.0.1:8000/wx/wx_login/',
        method:'POST',
        header:{
				  "content-type": "application/x-www-form-urlencoded"		//使用POST方法要带上这个header
				},
       data:{
          action:'choose_cou',
          user_id:user_id,
          cou_id: e.currentTarget.id
       },
        success(){
            wx.navigateBack({
              delta: 1,
            })
        } 
      })
    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
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
// pages/login1/login1.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        play:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    },
    give: function(e){		//与服务器进行交互
        var that = this;
        console.log("执行give服务器这里了！！"),
        wx.request({
          url: 'http://127.0.0.1:8000/wx/wx_login/',	//获取服务器地址，此处为本地地址
          method: "GET",
          data:{
            action:'list_customer'
         },
         success(data){
            console.log(data.data)
            that.setData({play:data.data.retlist})
          }

        })
      }

})
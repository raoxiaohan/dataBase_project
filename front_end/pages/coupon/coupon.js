// pages/coupon/coupon.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        my_coupons:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var app=getApp()
        var that=this
        let user_id=app.globalData.userid
        console.log(user_id)
        wx.request({
            url: 'http://127.0.0.1:8000/wx/wx_login/',
            method:'GET',
           data:{
              action:'get_inf_id',
              user_id:user_id
           },
            success(result){
                console.log(result)
                console.log(result.data.coupons)
              that.setData({my_coupons:result.data.coupons})
              console.log(that.data.my_coupons)
            } 
          })
    },
    onShow:function (options){
      var app=getApp()
        var that=this
        let user_id=app.globalData.userid
        console.log(user_id)
        wx.request({
            url: 'http://127.0.0.1:8000/wx/wx_login/',
            method:'GET',
           data:{
              action:'get_inf_id',
              user_id:user_id
           },
            success(result){
                console.log(result)
                console.log(result.data.coupons)
              that.setData({my_coupons:result.data.coupons})
              console.log(that.data.my_coupons)
            } 
          })
    },
    choose(e){
        console.log(e)
        let order=e.currentTarget.dataset.order
        console.log(order)
        var that=this
        let coupon=that.data.my_coupons.filter(function(item){
            return item.id==order;
          })
        wx.setStorageSync('coupon',coupon[0]);
        wx.navigateBack({
          delta: 1,
         })
    },
    more(){
      wx.navigateTo({
        url: '/pages/more_cou/more_cou',
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
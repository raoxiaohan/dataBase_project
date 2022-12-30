// pages/test/test.js
let compose = require('../../utils/compose');
let dateFormat = require('../../utils/dateutil');
let utils = require('../../utils/utils');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        start:"",
        end:"",
        date:"",
        status:0,
        list:[],
        num:0,
        order:0

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.search_pla()
    },
    search_pla(){
        var that=this
        let productSearchParams = wx.getStorageSync('productSearchParams');
        that.setData({start:productSearchParams.AirStartCityName})
        that.setData({end:productSearchParams.AirArriveCityName})
        that.setData({date:compose(dateFormat.formatDay2, dateFormat.detimestamp)(productSearchParams.AirGoDate),})
        console.log(that.data.date)
        wx.request({
            url: 'http://127.0.0.1:8000/wx/wx_login/',
            method:'GET',
           data:{
              action:'get_plane',
              start:productSearchParams.AirStartCityName,
              end:productSearchParams.AirArriveCityName,
              date:that.data.date
           },
            success(result){
              that.setData({status:result.data.status})
              console.log(result.data.status)
              that.setData({list:result.data.list})
              console.log(result)
              that.list_plane()
            }
            
          })
          
    },
    list_plane()
    {
        var that=this
        if(that.data.status=="f"){
            console.log("aa")
            wx.redirectTo({
                url: '../verySorry/verySorry?level=1'
              })
          }
          else{
              let list = that.data.list
              that.setData({num:list.length})
              
          }
    },
    book(e)
    {
        this.setData({
            modalName: e.currentTarget.dataset.target
          })
        let order = e.currentTarget.dataset.order;
        this.setData({order:order})
        console.log(e)
        
    },
    hideModal(e) {
        this.setData({
          modalName: null
        })
      },
    choose(e){
        console.log(e)
        var order=this.data.order
        var level=e.currentTarget.dataset.order
        wx.navigateTo({
          url: `../order/order?order=${order}&level=${level}`
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
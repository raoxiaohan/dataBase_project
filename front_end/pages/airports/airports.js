// pages/airports/airports.js
var QQMapWX = require('../../qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js')
var qqmapsdk
var amapFile = require('../../amap-wx.130.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        latitude:0,
        longitude:0,
        picker: ['泉州晋江','济南遥墙','北京大兴','成都双流','厦门高崎','青岛胶东'],
        airport:"",
        city:"",
        phone:"",
        id:"",
        weather:"",
        tem:"",
        high_in_desc:"",
        low_in_desc:"",
        out_desc:"",
        city_id:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
         qqmapsdk = new QQMapWX({
            key: 'ACXBZ-RCVWQ-E3Y5M-GRN44-CYH36-HYBRB'
        });
        var that=this;
        wx.getLocation({
            success: function (res) {
              console.log(res)
                //赋值经纬度
                that.setData({
                  latitude: res.latitude,
                  longitude: res.longitude,
                })
                qqmapsdk.reverseGeocoder({
                    location: {
                     latitude: res.latitude,
                     longitude: res.longitude
                    },
                    success: function (addressRes) {
                     that.isaddressss=addressRes.result.formatted_addresses.recommend
                     console.log(that.isaddressss)
                     that.setData({
                        city:addressRes.result.address_component.city
                    })
                    that.Find_airport()
                    that.get_weather()
                    console.log(11)
                    qqmapsdk.search(
                        {
                            keyword:'飞机场',
                            region:addressRes.result.address_component.city,
                            location:`${that.data.latitude},${that.data.longitude}`,
                            success: function (res) { //搜索成功后的回调
                              console.log(res)
                                that.setData({
                                    latitude: res.data[0].location.lat,
                                   longitude: res.data[0].location.lng,
                                })
                             },
                             fail: function (res) {
                              console.log(res);
                            },
                        }
                    )
                    }
                 })
                 
              },
        })
    },
    Find_airport(e)
    {
        var that=this
        wx.request({
            url: 'http://127.0.0.1:8000/wx/wx_login/',
            method:'GET',
           data:{
              action:'get_airport',
              city:that.data.city
           },
            success(back){
                console.log(that.data.city)
              console.log(back)
              that.setData({phone:back.data.phone})
              that.setData({airport:back.data.name})
              that.setData({id:back.data.id})
            }
          })
    },
    get_weather(e)
    {   
        var that=this
        var myAmapFun = new amapFile.AMapWX({key:'e0274ece6c610e9018ad0afc06fb49f5'});
        myAmapFun.getWeather({
            city:that.data.city_id,
            success: function(data){
              console.log(data)
              that.setData({weather:data.liveData.weather})
              that.setData({tem:data.liveData.temperature})
            },
            
          })
    },
    showModal(e) {
        this.policy()
        this.setData({
          modalName: e.currentTarget.dataset.target
        })
      },
      hideModal(e) {
        this.setData({
          modalName: null
        })
      },
      policy(e)
      {
          var that=this
          wx.request({
            url: 'http://apis.juhe.cn/springTravel/query',
            data:
            {
                key:'6a540d532c281f5c50d142dd6ca3fd8f',
                from:'10001',
                to:that.data.id
            },
            header: {
                'content-type': 'application/json'
              },
              //箭头函数为了修改this指向
              success: (res) => {
                console.log(res)
                that.setData({
                  low_in_desc:res.data.result.to_info.low_in_desc
                })
                //return res.data.now.temp
              },
          })
      },
      PickerChange(e) {
        console.log(e);
        this.setData({
          index: e.detail.value
        })
        console.log(this.data.picker[this.data.index])
        var _this = this;
        //调用关键词提示接口
        qqmapsdk.getSuggestion({
          //获取输入框值并设置keyword参数
          keyword: _this.data.picker[_this.data.index], //用户输入的关键词，可设置固定值,如keyword:'KFC'
          success: function(res) {//搜索成功后的回调
            console.log(res.data[0]);
            _this.setData({latitude:res.data[0].location.lat})
            _this.setData({longitude:res.data[0].location.lng})
            _this.setData({city_id:res.data[0].adcode})
            _this.setData({city:res.data[0].city})
            _this.get_weather()
            _this.Find_airport()
          },
        });
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
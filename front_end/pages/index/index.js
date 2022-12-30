var app=getApp();
var dateFormat = require('../../utils/dateutil');
var oneDay = 1*24*60*60*1000;
Page({
  data: {
    currentIndex: '1',
    startCity: '北京',
    endCity: '成都',
    hotelCity: '上海',
    adultNum: 1,
    childNum: 0,
    rotate: -180,
    imageSrc: '/images/飞机2.jpg',
    imagewidth: 0, // 缩放后的宽
    imageheight: 0, // 缩放后的高
    toast1: {
      show: false,
      alertWarn: 'warn',
      info: ''
    },
    toast2: {
      show: false
    }
  },
  
  onLoad: function(){
    this.setData({
      FSdate: {
        date: dateFormat.formatTime(new Date(Date.now() + oneDay)),
        week: dateFormat.formatWeek(new Date(Date.now() + oneDay)),
        startday: dateFormat.formatDay(new Date(Date.now() + oneDay)),
        currentday: dateFormat.formatDay(new Date(Date.now() + oneDay))
      },
      FEdate: {
        date: dateFormat.formatTime(new Date(Date.now() + 2*oneDay)),
        week: dateFormat.formatWeek(new Date(Date.now() + 2*oneDay)),
        startday: dateFormat.formatDay(new Date(Date.now() + 2*oneDay)),
        currentday: dateFormat.formatDay(new Date(Date.now() + 2*oneDay))
      },
      HSdate: {
        date: dateFormat.formatTime(new Date(Date.now() + oneDay)),
        week: dateFormat.formatWeek(new Date(Date.now() + oneDay)),
        startday: dateFormat.formatDay(new Date(Date.now() + oneDay)),
        currentday: dateFormat.formatDay(new Date(Date.now() + oneDay))
      },
      HEdate: {
        date: dateFormat.formatTime(new Date(Date.now() + 2*oneDay)),
        week: dateFormat.formatWeek(new Date(Date.now() + 2*oneDay)),
        startday: dateFormat.formatDay(new Date(Date.now() + 2*oneDay)),
        currentday: dateFormat.formatDay(new Date(Date.now() + 2*oneDay))
      }
    })
    console.log(this.data.FSdate.currentday)
  },
  imageLoad: function (e) {
    var imageSize = this.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
  imageUtil: function (e) {
    var imageSize = {};
    var originalWidth = e.detail.width; // 图片原始宽
    var originalHeight = e.detail.height; // 图片原始高
    var originalScale = originalHeight/originalWidth; //图片高宽比
    //获取屏幕宽高
    wx.getSystemInfo({
      success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight/windowWidth;//屏幕高宽比
      if (originalScale < windowscale) { // 图片高宽比小于屏幕高宽比
        //图片缩放后的宽为屏幕宽
        imageSize.imageWidth = windowWidth;
        imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
      } else { // 图片高宽比大于屏幕高宽比
        //图片缩放后的高为屏幕高
        imageSize.imageHeight = windowHeight;
        imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
      }
    }
   })
   return imageSize;
  },
  
  ratioError: function(){
    var adultNum = this.data.adultNum;
    var childNum = this.data.childNum;
		return (adultNum*2)>=childNum;
  },

  rotate_img: function() {//旋转飞机图片
    var animation = wx.createAnimation({
      timingFunction: "ease",
      duration: 400
    })
    this.animation = animation;
    animation.rotateZ(this.data.rotate).step();
     
    this.setData({
      rotate: -1*this.data.rotate,
      startCity: this.data.endCity,
      endCity: this.data.startCity,
      animation: animation.export(),
    })

  },


  bingDateChange: function(e){//绑定选择时间的函数
    this.setData({
          FSdate: {
            date: dateFormat.formatTime(new Date(e.detail.value)),
            week: dateFormat.formatWeek(new Date(e.detail.value)),
            startday: this.data.FSdate.startday,
            currentday: dateFormat.formatDay(new Date(e.detail.value))
          },
        })
        
    },


  compareDay: function(startday,endday){
    var startSecond = new Date(startday).getTime();
    var endSecond = new Date(endday).getTime();
    if((endSecond - startSecond) > oneDay){
      return true;
    }else{
      return false;
    }
  },

  alertWarn: function(){
    var obj = {
      pointer: this,
      duration: 3000
    }
    app.toast2(obj);
  },
  searchProduct: function(){//跳转详情页
    var objParams = { //单程的params的参数
      'AirStartCityName': this.data.startCity,
      'AirArriveCityName': this.data.endCity,
      'AirGoDate': dateFormat.timestamp(this.data.FSdate.currentday),
    };
    console.log(this.data.FSdate.currentday)
    console.log(objParams.AirGoDate)
    console.log(objParams)
    wx.setStorageSync('productSearchParams', objParams);//同步缓存SearchProductList请求数据

    wx.navigateTo({
      url:'../test/test'
    })
  },
  selectCity: function(e){//选择城市 切换保存方法
    var type = e.currentTarget.dataset.type;
    var that = this;
    var url=type!=1?'../selectStartCity/selectStartCity':'../selectStartCity/selectStartCity';
    url=url+'?type='+type;
    app.globalData.cityFn = function(city,type){
      switch (type) {
        case '1':
          that.setData({
            startCity: city
          });
          break;
        case '2':
          that.setData({
            endCity: city,
          });
          break;
      }
    };

    wx.navigateTo({
      url
    })
  }
})

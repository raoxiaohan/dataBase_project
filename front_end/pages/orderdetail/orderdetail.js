let app = getApp();
let utils = require('../../utils/utils');
let loginCount = 0;

Page({
  data: {
    loading: true,
    login: true,
    status:'',
    num:'',
    order_date:'',
    order_time:'',
    price:"",
    orderId:"",
    dep_date:"",
    dep_time:"",
    dep_city:"",
    arr_time:"",
    arr_city:"",
    arr_port:"",
    dep_port:"",
    contact_name:"",
    contact_phone:"",
    pass_list: []
  },

  onLoad(params){
    this.setData({
      loading: false,
      login: true
    });
    this.orderId = params.order;
    if(params.order==0){
      wx.showModal({
        title: '警告',
        content: '该乘机人已经在该航班上预订过票了！',
        success: function (res) {
          if (res.confirm) { //这里是点击了确定以后
            wx.redirectTo({
              url: '/pages/test/test',
            })
          } else { //这里是点击了取消以后
            wx.redirectTo({
              url: '/pages/test/test',
            })
          }
        }
      })
    }
    else
    {
      this.search_order();
    // this.orderDetail();
    console.log(this.data.orderId)
    }
    
  },
  search_order(){
    var that = this
    wx.request({
      url: 'http://127.0.0.1:8000/wx/wx_login/',
      method:'GET',
     data:{
        action:'get_order_id',
        order_id: this.orderId
     },
      success(result){
        console.log(result)
        that.judge_status(result.data.status)
        console.log(that.data.status)
        that.setData({orderId:result.data.order_id})
        that.setData({order_time:result.data.order_time})
        that.setData({order_date:result.data.order_date})
        that.setData({price:result.data.price})
        console.log(that.data.status)
        that.setData({num:result.data.plane})
        that.setData({arr_city:result.data.arr_city})
        that.setData({dep_date:result.data.dep_date})
        that.setData({arr_time:result.data.arr_time})
        that.setData({dep_city:result.data.dep_city})
        that.setData({dep_time:result.data.dep_time})
        that.setData({arr_port:result.data.arr_port})
        that.setData({dep_port:result.data.dep_port})
        that.setData({contact_name:result.data.contact_name})
        that.setData({contact_phone:result.data.contact_phone})
        that.setData({pass_list:result.data.pass_list})
      } 
    })
  },
  judge_status(num){
    var that=this;
    if(num=="0")
    {
      that.setData({status:"已取消"})
    }
    if(num=="1")
    {
      that.setData({status:"待支付"})
    }
    else
    {
      that.setData({status:"已支付"})
    }
  },
  orderDetail(){
    app.globalData.afterLogin.then(() => {
      app.post(`api/Order/GetOrderAppView`,{
        OrderID: this.orderId
      }).then((data) => {
        if(data.Code == 4){
          if(loginCount < 3){
            app.login().then(() => {
              this.orderDetail();
            })
            loginCount++;
          }else{
            this.setData({
              login: false,
              loading: false
            });
            return;
          }
        }else{
          data.Data.orderModel.AirTickets.forEach((airItem) => {
            airItem.DepartTime0 = airItem.DepartTime.split(' ')[0];
            airItem.DepartTime1 = airItem.DepartTime.split(' ')[1];
            airItem.DestinationTime0 = airItem.DestinationTime.split(' ')[0];
            airItem.DestinationTime1 = airItem.DestinationTime.split(' ')[1];
          })

          data.Data.orderModel.OrderStatus = app.orderStatus(data.Data.orderModel.OrderStatus);

          data.Data.orderModel.Hotels.forEach((hotelItem) => {
            hotelItem.JoinTime0 = hotelItem.JoinTime.split(' ')[0];
            hotelItem.OutTime0 = hotelItem.OutTime.split(' ')[0];
          })

          this.setData({
            orderModel: data.Data.orderModel,
            loading: false,
            login: true
          })
        }
      })
    })
  },


  gotoPay(){ //todo
    var that=this
    var app=getApp()
    wx.request({
      url: 'http://127.0.0.1:8000/wx/wx_login/',
      method:'POST',
      header:{
        "content-type": "application/x-www-form-urlencoded"		//使用POST方法要带上这个header
      },
     data:{
        action:'pay_order',
        order_id:that.data.orderId,
        user_id:app.globalData.userid
      },
      success: res => {
        //console.log(userinfor.nickName)
        utils.message('支付成功');
        wx.redirectTo({
          url: '/pages/orderlist/orderlist',
        })
      },
    })
  },
    

  cancelOrder(){
    var that=this
    utils.confirm('是否取消订单？',(res) => {
      if(res.confirm){
        wx.request({
          url: 'http://127.0.0.1:8000/wx/wx_login/',
          method:'POST',
          header:{
            "content-type": "application/x-www-form-urlencoded"		//使用POST方法要带上这个header
          },
         data:{
            action:'cancel_order',
            order_id:that.data.orderId
          },
          success: res => {
            //console.log(userinfor.nickName)
            utils.message('取消订单成功');
            wx.redirectTo({
              url: '/pages/orderlist/orderlist',
            })
          },
        })
  }
})
  },

  bindroomInfo(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      roomInfo: {
        show: true,
        infos: utils.replaceHtml(this.data.orderModel.Hotels[index].HotelDesc)
      }
    })
  },

  hideCostDetail(){
    this.setData({
      roomInfo: {
        show: false,
        infos: ''
      }
    })
  },

  onUnload(){
    let refreshOrderList = app.globalData.refreshOrderList;
    let that = this;

    if(typeof refreshOrderList === 'function'){
      setTimeout(function(){
        refreshOrderList(that.mergeData);
      });
    }
  }
  })

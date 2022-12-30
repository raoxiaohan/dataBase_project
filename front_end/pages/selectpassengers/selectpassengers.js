let app = getApp();
let utils = require('../../utils/utils');
//获取应用实例
Page({
  data: {
    passengerList:[],
    plane_id:0
  },
  onLoad:function(par){
    var that=this
    let passengerInfo=this.passengerInfo= wx.getStorageSync('passengerInfo');
    console.log(passengerInfo)
    console.log(this.getPassengerList(passengerInfo.pass_list))
    that.setData({passengerList:this.getPassengerList(passengerInfo.pass_list)})
    that.data.plane_id=par.plane_id
    // console.log(that.data.passengerList)
    this.selectedPassengerList=passengerInfo.selectedPassengerList||[];
    // this.lastDepartureTime=passengerInfo.lastDepartureTime;
    // this.childrenNum=passengerInfo.childrenNum*1||0;
    // this.adultNum=passengerInfo.adultNum*1||0;
    // this.setData({
    //   childrenNum:this.childrenNum,
    //   adultNum:this.adultNum,
    //   passengerList:this.getPassengerList(this.passengerList)
    // })
    // console.log(this.passengerList)
  },

  onShow:function()
  {
    var app=getApp()
    var that=this
     let user_id =app.globalData.userid
     console.log(user_id)
     wx.request({
      url: 'http://127.0.0.1:8000/wx/wx_login/',
      method:'GET',
     data:{
        action:'get_my_passenger',
        user_id: user_id
     },
      success(result){
        console.log(result.data.pass_list)
        let passengerInfo={
          pass_list:result.data.pass_list,
          pass_num:result.data.pass_list.length
        }
        console.log(passengerInfo)
        wx.setStorageSync('passengerInfo',passengerInfo);
        console.log(passengerInfo)
        // console.log(that.getPassengerList(passengerInfo.pass_list))
        that.setData({passengerList:passengerInfo.pass_list})
      } 
    })
  },
   getPassengerList:function(list){
    let that=this;

    return (list||[]).map(function(item){
      // let selected=that.selectedPassengerList.indexOf(item.id)>-1;
      return {
        id:item.id,
        name:item.name,
        cardnum:item.cardnum,
        selected:0
      }
    })
   }
  ,
  selectHanlder:function(e){
    console.log(e)
    let id=e.currentTarget.id*1;
    let index=e.currentTarget.dataset.index;
    let passengerItem=this.data.passengerList[index];
    console.log(passengerItem)
    let selected= !passengerItem.selected;
    if(selected){
      let len=this.selectedPassengerList.length;
      console.log(this.selectedPassengerList)
      if(len==this.adultNum+this.childrenNum){
        utils.message('选择旅客人数不能超过出行人数!');
        return;
      }
      if(this.selectedPassengerList.indexOf(id)==-1){
        this.selectedPassengerList.push(id);
      }
    }else{
      this.selectedPassengerList=this.selectedPassengerList.filter(function(item){
        return item!=id;
      })
    }
    passengerItem.selected=selected;
    this.setData({
      passengerList:this.data.passengerList
    })
    console.log(this.data.passengerList)
  },
  catchTapHandle:function(){

  }
  ,
  
  confirm:function(){
    console.log(this.passengerInfo)
    console.log(this.selectedPassengerList)
    wx.setStorageSync('passengerInfo',Object.assign({},this.passengerInfo,{
      selectedPassengerList:this.selectedPassengerList
    }));
    let fn=app.globalData.refreshPassenger;
    if(typeof fn=='function')
      setTimeout(fn,0);
    var that=this
    // wx.redirectTo({
    //   url: '../order/order?order='+that.data.plane_id,
    // })
    wx.navigateBack({
      delta: 1,
    })
  },
  add:function(){
    wx.navigateTo({
      url:'../createTraveller/createTraveller?type=2'
    })
  }


})

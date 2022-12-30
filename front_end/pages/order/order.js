let app = getApp();
let utils = require('../../utils/utils');
let dateFormat = require('../../utils/dateutil');
Page({
     data:{
        hasInvoice:false,
        hasCoupon:false,
        hasAgree:false,
        totalPrice: '--',
        nextStep: {
           btnWord: '去支付'
        },
        costDetail: {
           show: false
        },
        loading:true,
        order_id: "",
        dep_date: "",
        plane_num:"",
        price:"",
        passengerList:[],
        plane_id:"",
        personNum:0,
        oriPrice:0
   },
   //添加乘机人
   addp:function(e){
      this.refreshPassengerHandle();
      // 用于判断是否有库存的用户信息
      let passengerInfo= wx.getStorageSync('passengerInfo');
      console.log(passengerInfo)
        let pass_list=passengerInfo.pass_list;
        let pass_num=passengerInfo.pass_num;
        if(!pass_list||pass_num==0){
          wx.navigateTo({
            url: '../createTraveller/createTraveller?type=1'
           })
        }else{
          var that=this
          wx.navigateTo({
            url: '../selectpassengers/selectpassengers',
           })
        }
      },
   onLoad:function(params){
     let passengerInfo= wx.getStorageSync('passengerInfo');
     console.log(passengerInfo)
      let a = this
      a.data.plane_id=params.order
      console.log(a.data.plane_id)
      var level=params.level
      wx.request({
        url: 'http://127.0.0.1:8000/wx/wx_login/',
        method:'GET',
       data:{
          action:'get_plane_id',
          plane_id: params.order,
          level:level
       },
        success(result){
          console.log(result);
          a.setData({plane_name:result.data.name})
          a.setData({plane_num:result.data.num})
          a.setData({dep_date:result.data.dep_date})
          a.setData({price:result.data.price})
          console.log(a.data.dep_date)
          a.setData({loading:false})
          a.get_passenger()
          a.setData({totalPrice:a.getTotalPrice()})
        } 
      })
   },
  
  onShow:function(){
    var that=this
    let passengerInfo= wx.getStorageSync('passengerInfo');
     console.log(passengerInfo)
     let selectedPassengerList=passengerInfo.selectedPassengerList
     console.log(selectedPassengerList)
     let passengerList1=passengerInfo.pass_list
     console.log(passengerList1)
     if(selectedPassengerList!=null)
     {
      that.setData({passengerList:that.getSelectedPassengerList(passengerList1,selectedPassengerList)})
      that.setData({personNum:selectedPassengerList.length})
      console.log(that.data.personNum)
     }
    if(that.data.hasCoupon){
      let coupon=wx.getStorageSync('coupon')
     console.log(coupon)
     that.setData({coupon:coupon})
     if(this.getTotalPrice()-coupon.price>0)
     {
      that.setData({totalPrice:this.getTotalPrice()-coupon.price})
     }
    }
    else{
      console.log(that.data.personNum)
      that.setData({totalPrice:this.getTotalPrice()})
    }
     
  },

   get_passenger(){
     var app=getApp()
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
      } 
    })
    
   },
   chooseCoupon:function(){
     wx.navigateTo({
       url: '/pages/coupon/coupon',
     })
   },
   setBookingData:function(bookingInfo){
      let that=this;
      let departureDate= dateFormat.formatDay(new Date(bookingInfo.PkgProductInfo.PkgProduct_Schedule[0].DepartureDate));
      let departureCityName = bookingInfo.PkgProductInfo.DepartureTravelCityName;
      let destinationCityName = bookingInfo.PkgProductInfo.DestinationCityName;
      let contactInfo=this.contactInfo= bookingInfo.ContactInfo||{};
      let invoiceInfo=this.invoiceInfo= contactInfo.InvoiceInfo||{};
      this.isInternational = bookingInfo.PkgProductInfo.IsInternational;
      let segLeg=bookingInfo.PkgProductInfo.PkgProduct_Segment.length-1;
      this.lastDepartureTime=bookingInfo.PkgProductInfo.PkgProduct_Segment[segLeg].DepartureTime;
      //获取价格信息
      (bookingInfo.PackageProductPriceInfoList||[]).forEach(function(item){
        switch(item.PriceType){
          case 0:
            that.flightAndHotelPrice=item.TotalAmount;
            break;
          case 3:
            that.taxPrice=item.TotalAmount;
            break;
        }
      })
      let totalPrice=this.getTotalPrice();
      let passengerList=bookingInfo.PassengerInfoList;
      this.passengerInfo={
          productKey:this.productKey,
          passengerList:passengerList,
          selectedPassengerList:[],
          childrenNum:this.childrenNum,
          adultNum:this.adultNum,
          lastDepartureTime:this.lastDepartureTime,
          isInternational:this.isInternational
      };
      wx.setStorageSync('passengerInfo',this.passengerInfo);
      this.setData({
          productName:bookingInfo.PkgProductInfo.ProductName,
          departureDate:departureDate,
          departureCityName:departureCityName,
          destinationCityName:destinationCityName,
          totalPrice:totalPrice,
          flightAndHotelPrice:this.flightAndHotelPrice,
          taxPrice:this.taxPrice,
          contactName:contactInfo.ReceivingName||'',
          contactPhone:contactInfo.MobilePhone||'',
          contactEmail:contactInfo.Email||'',
          invoiceTitle:invoiceInfo.Title||'',
          invoiceAddress:invoiceInfo.DetailAddress||'',
          postCode:invoiceInfo.PostCode||'',
          invoicePhone:invoiceInfo.MobilePhone||'',
          invoiceName:invoiceInfo.Name||'',
          isInternational:this.isInternational,
          passengerList:[]
      })
   },
   getSelectedPassengerList:function(list,selectedIds){
      let that=this;
      console.log('get')
      return (list||[]).filter(function(item){
        return selectedIds.indexOf(item.id)>-1;
      }).map(function(item){
        console.log(item)
        return {
          id:item.id,
          name:item.name,
          CardNo:item.cardnum,
        }
      })
   }
   ,
   refreshPassengerHandle:function(){
     console.log("refresh")
      var that=this;
      var app=getApp()
      console.log(app.globalData.refreshPassenger)
      getApp().globalData.refreshPassenger=function(){
        console.log("func")
        let passengerInfo= wx.getStorageSync('passengerInfo');
        console.log(passengerInfo)
        if(that.productKey==passengerInfo.productKey){
          that.passengerInfo=passengerInfo;
          let passengerList=passengerInfo.passengerList;
          let selectedPassengerList=passengerInfo.selectedPassengerList;
          that.setData({
            passengerList:that.getSelectedPassengerList(passengerList,selectedPassengerList)
          })
          app.globalData.refreshPassenger=null;
        }
      }
   }
   ,
   getTotalPrice:function(){
       var that=this
       console.log(that.data.personNum)
       that.setData({oriPrice:that.data.price*that.data.personNum})
      //  that.setData({totalPrice:that.data.price*that.data.personNum})
       let totalPrice= that.data.price*that.data.personNum
       return totalPrice>0?totalPrice:"--";
   },

   inputChangeHandle:function(e){
      var key=e.currentTarget.id;
      var data={};
      data[key]=e.detail.value;
      this.setData(data);
   },

   bindKeyInput: function(e) {
      this.inputChangeHandle(e);
   }
   ,
    //开关函数
   switch1Change: function (e){
     this.inputChangeHandle(e);
  },

   // 遮罩层
 showMask:function(e){
    //  console.log(e)
     this.setData({
     modalhidden:false
     })
   },
   hiddenMask:function(e){
     this.setData({
     modalhidden:true
     })
   },

  //  活动弹窗
  showactivity:function(e){
    console.log(e)
      this.setData({
      activityhide:false
     })
  },
  deleteHandle:function(e){
    let id=e.currentTarget.dataset.id;
    let that=this;
    utils.confirm('是否删除旅客？',function(res){
      if(!res.confirm)return;
      let passengerInfo= wx.getStorageSync('passengerInfo');
      console.log(passengerInfo)
      passengerInfo.selectedPassengerList=passengerInfo.selectedPassengerList.filter(function(item){
        return item!=id;
      })
      wx.setStorageSync('passengerInfo',passengerInfo);
      let passengerList=that.data.passengerList.filter(function(item){
        return item.id!=id;
      })
      that.setData({
        passengerList:passengerList,
        personNum:that.data.personNum-1
      })
      console.log(that.data.passengerList)
      that.onShow()
    })
  },
  editHandle:function(e){
    this.refreshPassengerHandle();
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url:'../createTraveller/createTraveller?type=2&id='+id
    })
  },

  //选择
  catchTapHandle:function(){

  },
  verify:function(value) {
      var total = this.adultNum * 1 + this.childrenNum * 1,
          msg = '',
          selectedLists=[],
          billShow=this.data.hasInvoice,
          hasAgree=this.data.hasAgree;
      let passengerInfo= wx.getStorageSync('passengerInfo');
      // let passengerInfo=this.data.passengerInfo

      if(this.productKey==passengerInfo.productKey){
        let passengerList=passengerInfo.pass_list;
        let selectedPassengerList=passengerInfo.selectedPassengerList;
        console.log(passengerList)
        console.log(passengerInfo)
        selectedLists= passengerList.filter((item)=>{
          return selectedPassengerList.indexOf(item.ID)>-1;
        })
      }

      if (this.isInternational) {
          msg = this.verifyInterPassener(selectedLists);
      }
      else {
          msg = this.verifyPassener(selectedLists);
      }

      if(!hasAgree){
        return '同意须知项方能进行下一步预定！';
      }
      else if (msg)
          return msg;
      else if (selectedLists.length < total) {
          msg = '选择的旅客人数不能小于出行人数！';
      }else if(!value.contactName){
          msg = '联系人姓名为空！';
      }
      else if (!value.contactPhone) {
          msg = '联系人手机号为空！';
      }else if (!utils.verifyPhone(value.contactPhone)) {
          msg = '联系人手机号格式错误！'
      }else if (billShow && !utils.isChinaOrNumbOrLett(value.invoiceTitle)) {
          msg = '发票抬头为空或包含特殊字符！';
      }else if (billShow && ! value.invoiceName) {
          msg = '发票收件人为空！';
      }else if (billShow && !utils.verifyName(value.invoiceName)){
          msg = '发票收件人格式错误！'
      }else if (billShow && !value.invoicePhone) {
          msg = '收件人电话号码为空！';
      }else if (billShow && !utils.verifyPhone(value.invoicePhone)) {
          msg = '收件人电话号码格式错误！';
      }else if (billShow && !utils.isChinaOrNumbOrLett(value.invoiceAddress)) {
          msg = '地址为空或包含特殊字符！';
      }else if (billShow && !value.postCode) {
          msg = '邮政编码为空！';
      }else if (billShow && !utils.verifyPostCode(value.postCode)) {
          msg = '邮政编码格式不正确！';
      }
      return msg;
  },
  verifyInterPassener:function(passengerLists) {
      let msg = '',
          selectChild=0,
          selectAdult=0;
      passengerLists.some((item)=> {
          if(item.Birthday){
              let birDay=new Date(dateFormat.timestamp(item.Birthday,1)),
                  nowDate=new Date();
              if(utils.isChild(birDay,this.lastDepartureTime)){
                  selectChild++;
              }else if(utils.isAdult(birDay,this.lastDepartureTime)){
                  selectAdult++;
              }

          }

          if (!item.PassengerNameEN || item.PassengerNameEN == '/')
              msg = '英文名为空！';
          else if (item.CardType == null||item.CardType==0)//国际旅客没有身份证
              msg = '证件号码为空！';
          else if (!item.CardNo)
              msg = '证件号为空！';
          else if (!item.CheckCity) {
              msg = '签发地为空！';
          }
          else if (!item.CheckDate) {
              msg = '签发日期为空！';
          }
          else if (!item.PassportExpireDate) {
              msg = '证件有效期为空！';
          }
          else if (!item.CountryCode) {
              msg = '国籍为空！';
          }
          else if (!item.Birthday)
              msg = '生日为空！';
          else if(item.CardType==1&&!utils.varifyPassport(item.CardNo)){
              msg='护照格式错误，其由5-15位的字母和数字组成！';
          }else if(!utils.verifyName_2(item.PassengerName)){
              msg='中文姓名格式错误！';
          }

          if (msg) {
              msg = item.PassengerName + msg
              return true;
          }
      })
      if(!msg){
        console.log(this.data.personNum)
          if(this.data.personNum==0)
              msg='请您添加旅客！';
      }

      return msg;
  },
  verifyPassener:function(passengerLists) {
    var msg = '',
        selectChild=0,
        selectAdult=0;
    passengerLists.some((item)=> {
        if(item.Birthday){
            let birDay=new Date(dateFormat.timestamp(item.Birthday,1)),
                nowDate=new Date();
            if(utils.isChild(birDay,this.lastDepartureTime)){
                selectChild++;
            }else if(utils.isAdult(birDay,this.lastDepartureTime)){
                selectAdult++;
            }
        }

        if (!item.PassengerName)
            msg = '中文名为空！';
        else if (item.CardType == null)
            msg = '证件类型为空！'
        else if (!item.CardNo)
            msg = '证件号为空！';
        else if (!item.Birthday)
            msg = '生日为空！';
        else if(item.CardType==1&&!utils.varifyPassport(item.CardNo)){
            msg='护照格式错误，其由5-15位的字母和数字组成！';
        }else if(!utils.verifyName_2(item.PassengerName)){
            msg='中文姓名格式错误！';
        }
        if (msg) {
            msg = item.PassengerNameEN + msg
            return true;
        }
    })
    if(!msg){
        if(this.data.personNum==0)
            msg='请您添加旅客！';
    }

    return msg;
  },
  agreeChange:function(e){
    var key=e.currentTarget.id;
    var data={};
    data[key]=!this.data[key];
    this.setData(data);
  },

  //表单验证
  formBindsubmit:function(e){
    var value=e.detail.value;
    var msg=this.verify(value);
    if(msg){
      utils.message(msg);
    }else{
      app.globalData.afterLogin.then(()=>{
          let passengerInfo= wx.getStorageSync('passengerInfo');
          let selectedPassengerList=[];
          let hasInvoice=this.data.hasInvoice;
          let contactInfo=Object.assign({},this.contactInfo,{
              ReceivingName:value.contactName,
              MobilePhone:value.contactPhone,
          })
          let invoiceInfo;
          if(hasInvoice){
            invoiceInfo=Object.assign({},this.invoiceInfo,{
                DetailAddress:value.invoiceAddress,
                Name:value.invoiceName,
                MobilePhone:value.invoicePhone,
                Title:value.invoiceTitle,
                PostCode:value.postCode
            })
          }

          contactInfo.InvoiceInfo=invoiceInfo;

          if(this.productKey==passengerInfo.productKey){
              selectedPassengerList=passengerInfo.selectedPassengerList;
          }
          utils.loadingShow();
          if(this.loading)return;
          this.loading=true;
          var that=this
          var app=getApp()
          var now = new Date();
          var hour= now.getHours();//得到小时数
          var minute= now.getMinutes();//得到分钟数
          var second= now.getSeconds();//得到秒数
          let time_now=[hour,minute,second].join(':')
          let dateFormat = require('../../utils/dateutil');
          var date=dateFormat.formatDay2(new Date(Date.now()))
          console.log(date)
          console.log(that.data.coupon)
          wx.request({
            url: 'http://127.0.0.1:8000/wx/wx_login/',
          method:'POST',
          header:{
            "content-type": "application/x-www-form-urlencoded"		//使用POST方法要带上这个header
          },
         data:{
            action:'pay',
            user_id:app.globalData.userid,
            plane_num:that.data.plane_num,
            plane_name:that.data.plane_name,
            status:1,
            time:time_now,
            date:date,
            dep_date:that.data.dep_date,
            price:that.data.totalPrice,
            passenger_num:that.data.personNum,
            select_pass:selectedPassengerList,
            link_name:value.contactName,
            link_phone:value.contactPhone,
            coupon:that.data.coupon.id
          },
          success: res => {
            console.log(res)
            this.loading=false
             wx.redirectTo({
               url: '/pages/orderdetail/orderdetail?order='+res.data.id,
             })
          },
          })
          // app.post('api/Order/CreateOrder',{
          //   ProductKey: this.productKey,
          //   PassengerIDList: selectedPassengerList,
          //   ContactInfo: contactInfo,
          //   CouponIDList: [],
          //   CouponCodeList:[],
          //   Point:0
          // }).then((data)=>{
          //   this.loading=false;
          //   if(this.isUnload)return;
          //   wx.hideToast();
          //   if(data.Code==4){
          //     app.login().then(()=>{
          //       utils.message('网络请求失败，请重新提交！');
          //     })
          //   }else if(data.Code==200){
          //     this.goPay(data.Data);
          //     let fn=app.globalData.reloadOrderList;
          //     if(typeof fn=='function'){
          //       setTimeout(fn,0);
          //     }
          //   }else if(data.Msg){
          //     utils.message(data.Msg);
          //   }
          // }).catch((e)=>console.log(e))
      }).catch((e)=>console.log(e))
    }
  },
  goPay:function(data){
    wx.requestPayment({
      'timeStamp': data.TimeStamp,
      'nonceStr': data.NonceStr,
      'package': data.Package,
      'signType': data.SignType,
      'paySign': data.PaySign,
      success: ()=>{
        utils.message('支付成功！',function(){
          wx.switchTab({
            url: '../orderlist/orderlist'
          })
        })
      },
      fail: ()=>{
        utils.message('支付失败！');
      }
    })
  }
  ,
  showCostDetail(){
    this.setData({
      costDetail: {
        show: true
      }
    })
  },

  hideCostDetail(){
    this.setData({
      costDetail: {
        show: false
      }
    })
  },
  onUnload:function(){
    this.isUnload=true;
  }
})

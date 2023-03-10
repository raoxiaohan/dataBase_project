let app = getApp();
let loginCount = 0;

Page({
    data: {
      page:1,
      size: 20,
      hasMore: true,
      login: true,
      orderList: []
    },

    onLoad: function() {
      this.loadMore();
      this.refreshHandle();
    },


    loadMore(){
      var app=getApp()
      var that = this
      let user_id=app.globalData.userid
      console.log(user_id)
      wx.request({
        url: 'http://127.0.0.1:8000/wx/wx_login/',
        method:'GET',
       data:{
          action:'get_order',
          user_id:user_id
       },
        success(result){
          console.log(result)
          that.setData({hasMore:result.data.has})
          that.setData({orderList:result.data.list})
        } 
      })
      if(!this.data.hasMore) return

      // app.globalData.afterLogin.then(() => {
      //   app.post('api/Order/GetOrderAppListView',{
      //     PageIndex: this.data.page++,
      //     PageSize: this.data.size
      //   }).then((data) =>{
      //     if(data.Code == 4){
      //       if(loginCount < 3){
      //         app.login().then(this.loadMore)
      //         loginCount++;
      //       }else{
      //         this.setData({
      //           login: false
      //         });
      //         return;
      //       }
      //     }else if(data.Code === 200 && data.Data.OrderList.length){
      //       this.editOrderList(data.Data.OrderList);

      //       this.setData({
      //         orderList: this.data.orderList.concat(data.Data.OrderList)
      //       });

      //       if(data.Data.OrderList.length < this.data.size){
      //         this.setData({ hasMore: false })
      //       }
      //     }else{
      //       this.setData({ hasMore: false })
      //     }
      //   });
      // })
    },

    refreshHandle:function(){
      app.globalData.reloadOrderList=()=>{
        app.post('api/Order/GetOrderAppListView',{
          PageIndex: 1,
          PageSize: this.data.size
        }).then((data) =>{
          if(data.Code === 200 && data.Data.OrderList.length){
            this.editOrderList(data.Data.OrderList);

            this.setData({
              orderList: data.Data.OrderList,
              page:1
            });

            if(data.Data.OrderList.length < this.data.size){
              this.setData({ hasMore: false })
            }
          }
        });
      }
    },

    //?????????????????????
    tapdetail(e) {
      let order = e.currentTarget.dataset.order;
      console.log(e)
      wx.navigateTo({
        url: `../orderdetail/orderdetail?order=${order}`
      })
    },

    editOrderList(array){//?????????????????????
      if(array instanceof Array){
        array.forEach((item) => {
          item.OrderStatus = app.orderStatus(item.OrderStatus)
        });
        return array;
      }
    }
})

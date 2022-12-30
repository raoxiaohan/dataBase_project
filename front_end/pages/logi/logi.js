Page({
      data:{
      },
      login(){
        console.log('点击事件执行了')
        wx.getUserInfo({
          desc: '必须授权才能使用',
          success:res=>{
            let user=res.userInfo
            wx.setStorageSync('user', user)
      console.log('成功',res)
      this.setData({
        userInfo:user
      })
      },
          fall:res=>{
            console.log('失败',res)
          }
        })
      
      },
      nologin(){
       this.setData({
         userInfo:''
       })
       wx.setStorageSync('user', null)
      },
    getUserInfor(e){
        wx.getUserProfile({
          desc: '用来完善用户个人信息',//展示的消息
          success:(res)=>{
            console.log(res.userInfo)//将用户信息打印至控制台
            let userinfor=res.userInfo
            console.log(userinfor.nickName)
             //this.setData({ userinfor:res.userInfo})//将信息保存到定义的容器里
             console.log("执行give服务器这里了！！"),
        wx.request({     
          url: 'http://127.0.0.1:8000/wx/wx_login/',
          method:'POST',
          header:{
            "content-type": "application/x-www-form-urlencoded"		//使用POST方法要带上这个header
          },
         data:{
            action:'login',
            name:userinfor.nickName,
            image:userinfor.avatarUrl,
            credit:0
          },
          success: res => {
            //console.log(userinfor.nickName)
            var app=getApp()
            app.globalData.username=userinfor.nickName
            console.log(app.globalData.username)
            wx.request({
              url: 'http://127.0.0.1:8000/wx/wx_login/',
              method:'GET',
              data:{
                action:'get_inf',
                name:userinfor.nickName,
              },
              success(result){
                app.globalData.userid=result.data.id
                console.log(app.globalData.userid)
              } 
            })
            wx.switchTab({
              url: '/pages/index/index',
            })
            if (res.statusCode == 200) {
              console.log(res)
              this.setData({
                result: res.data	//服务器返回的结果 
              })    
            }    
          },
        })
          },
        })    
     },
    })
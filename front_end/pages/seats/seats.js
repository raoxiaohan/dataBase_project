//index.js
const app = getApp()
const { envList } = require('../../envList.js')

Page({
  data: {
    isPositionPermited: true,
    pics: ["a", "b"],
    seatings: [],
    showUploadTip: false,
    envList,
    selectedEnv: envList[0],
    haveCreateCollection: false,
    pid:0,
    oid:0,
    plane_id:0
  },
  onLoad:function(params){
    var that=this
    that.setData({pid:params.pid})
    that.setData({oid:params.oid})
  },
  onShow:function() {
    this.showSeats()
  },
  showSeats() {
    var that=this
    wx.request({
      url: 'http://127.0.0.1:8000/wx/wx_login/',
        method:'GET',
       data:{
          action:'get_seats',
          order_id:that.data.oid
       },
        success(result){
          console.log(result)
          that.setData({seatings:result.data.seats})
          that.setData({plane_id:result.data.plane_id})
          
        } 
    })
  },
 
  onClickPowerInfo(e) {
    console.log(e)
    const index = e.currentTarget.dataset.index
    const powerList = this.data.powerList
    powerList[index].showItem = !powerList[index].showItem
    if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
      this.onClickDatabase(powerList)
    } else {
      this.setData({
        powerList
      })
    }
  },

  onChangeShowEnvChoose() {
    wx.showActionSheet({
      itemList: this.data.envList.map(i => i.alias),
      success: (res) => {
        this.onChangeSelectedEnv(res.tapIndex)
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },

  onChangeSelectedEnv(index) {
    if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
      return
    }
    const powerList = this.data.powerList
    powerList.forEach(i => {
      i.showItem = false
    })
    this.setData({
      selectedEnv: this.data.envList[index],
      powerList,
      haveCreateCollection: false
    })
  },
  certain(){
    var that =this
    wx.showModal({
      content:"确定选择该座位？",
      success:res=>{
        let selectedIndex=wx.getStorageSync('selectedIndex')
    wx.request({
        url: 'http://127.0.0.1:8000/wx/wx_login/',
        method:'POST',
        header:{
				  "content-type": "application/x-www-form-urlencoded"		//使用POST方法要带上这个header
				},
       data:{
          action:'choose_seat',
          seat_index:selectedIndex[0],
          plane_id:that.data.plane_id,
          pid:that.data.pid,
          oid:that.data.oid
       },
       success: res => {
        console.log(res)
        var that=this
        that.setData({seatings:res.data.seat})   
        wx.navigateBack({
        delta: 1,
        })
      },
    })
      }
    })
  }
})

// components/seatList/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    seatings: Array,
    hallNumber: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectedIndex: [],
    selectedNum: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    selected(e) {
      console.log(e)
      let index = e.currentTarget.dataset.index;
      if(this.data.selectedIndex.indexOf(index)!=-1){
        let selectedIndex =  this.remove(this.data.selectedIndex, index);
        let selectedNum = this.data.selectedNum - 1;
        this.setData({
          selectedIndex,
          selectedNum
        })
      }else{
        if(this.data.selectedNum < 1){
        let selectedNum = this.data.selectedNum + 1;
        let selectedIndex = this.data.selectedIndex.concat(index);
            this.setData({
              selectedIndex,
              selectedNum
            })
        wx.setStorageSync('selectedIndex', selectedIndex)
        wx.setStorageSync('selectedNum', selectedNum)
      }else{
        wx.showToast({
          title: '只能选择一个座位',
        })
       }
      }
    },
    remove(arr, ele) {
      var index = arr.indexOf(ele); 
      if (index > -1) { 
      arr.splice(index, 1); 
        }
        return arr;
      }
    }
})

// pages/addQue/addQue.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[{value: 'USA', name: '酸胀痛酸胀痛酸胀痛酸胀痛酸胀痛酸胀痛酸胀痛酸胀痛酸胀痛'},
    {value: 'CHN', name: '绞痛', checked: 'true'},
    {value: 'BRA', name: '针刺痛'}],
    topicRows:[],
    rstart:1,
    rcount:15
  },
  addQue(e){
    wx.navigateTo({
      url: '../addQueItem/addQueItem?no='+this.data.chunkNo,
    })
  },
  showImg(e){
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  topicRows(){
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire/topic-rows',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
        chunkNo:that.data.chunkNo,
        rstart:that.data.rstart,
        rcount:that.data.rcount
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
         
          for(var i in res.data.data.rows){
            that.answerRows(res.data.data.rows[i].no)
            console.log(res.data.data.rows[i].img.slice(0,1))
            if(res.data.data.rows[i].img&&res.data.data.rows[i].img.slice(0,1)!='h'){
              res.data.data.rows[i].img=app.globalData.url+res.data.data.rows[i].img
            }
          }
          that.data.topicRows=that.data.topicRows.concat(res.data.data.rows)
          that.setData({
            topicRows: that.data.topicRows
          })
        } else {
          wx.showModal({
            showCancel: false,
            title: res.data.codeMsg
          })
        }
      }
    });
  },
  answerRows(topicNo){
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire/answer-rows',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
        topicNo:topicNo,
        rstart:1,
        rcount:100
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          for(var r in that.data.topicRows){
            if(that.data.topicRows[r].no==topicNo){
              that.data.topicRows[r].rows=res.data.data.rows
              console.log(that.data.topicRows[r].rows)
            }
          }
          // that.data.topicRows=that.data.topicRows.concat(res.data.data.rows)
          // for(var i in res.data.data.rows){
          //   res.data.data.rows[i].checked=false
          //   for(var r in that.data.topicRows){
          //     if(that.data.topicRows[r].no==res.data.data.rows[i].no){
          //       that.data.topicRows[r].rows=res.data.data.rows[i]
          //       console.log(that.data.topicRows[r].rows)
          //     }
          //   }
          // }
          that.setData({
            topicRows: that.data.topicRows
          })
          console.log(that.data.topicRows)
        } else {
          wx.showModal({
            showCancel: false,
            title: res.data.codeMsg
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      chunkNo:options.no
    })
    
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    const items = this.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }

    this.setData({
      items
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
    this.topicRows()
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
// packageA/pages/rows/rows.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows:[]
  },
  userRowsItem(e){
    wx.navigateTo({
      url:"../maIndex/maIndex?doNo="+e.currentTarget.dataset.no,
      // url: '../maindex/maindex?doNo='+e.currentTarget.dataset.no,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options:options
    })
    this.rows()
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
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
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
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    var path = 'packageA/pages/index/index'
    return {
      title: '维讯化工(南京)', //分享内容
      path: path, //分享地址
      imageUrl:'https://renx.cc/file/vfc-clockin/clockin.jpg', //分享图片
      success: function (res) {},
      fail: function (res) {}
    }
  },
  rows() {
    let that = this
    wx.request({
      url: app.globalData.dkUrl + '/vfc-clockin/questionnaire/rows',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('dkcookie')
      },
      data:{
        questionnaireNo:11111111111,
        userNo:that.data.options.no
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          for(var i in res.data.data.rows){
            res.data.data.rows[i].createTime=res.data.data.rows[i].createTime.split('T')[0]+'  '+res.data.data.rows[i].createTime.split('T')[1]
          }
          wx.setNavigationBarTitle({
            title: `打卡记录(${res.data.data.rows[0].realname})`,
          })
          that.setData({
            rows:res.data.data.rows
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
})
//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/util.js');
Page({
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    testImg: "../icon/Bitmap.png"
  },
  scan(e){
    wx.scanCode({
      success (res) {
        console.log(res)
        wx.navigateTo({
          url: res.path,
        })
      }
    })
  },
  evaList(e) {
    wx.navigateTo({
      url: '../evaList/evaList?type=' + e.currentTarget.dataset.type + '&detail=' + JSON.stringify(this.data.depart),
    })
  },
  evadepart(e) {
    wx.navigateTo({
      url: '../evadepart/evadepart?detail=' + JSON.stringify(this.data.depart),
    })
  },
  panoramaVrUrl(e) {
    wx.navigateTo({
      url: '../webview/webview?href=' + encodeURIComponent(this.data.hosDetail.panoramaVrUrl),
    })
  },
  //事件处理函数
  bindViewTap: function () {

  },
  
  hosDetail() {
    var that=this
    wx.request({
      url: app.globalData.url + '/user/hospital',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': app.globalData.cookie
      },
      method: 'get',
      data: {
        hospitalId: app.globalData.loginHospitalId,
      },
      success: function (res) {
        if (res.data.code == 0) {
          app.globalData.hospitalName = res.data.data.name
          var tag = []
          res.data.data.cover = app.cover(res.data.data.cover)
          if (res.data.data.tag) {
            for (var i in res.data.data.tag.split(',')) {
              tag.push(res.data.data.tag.split(',')[i])
            }
          }
          res.data.data.tag = tag
          that.setData({
            hosDetail: res.data.data,
            testImg: res.data.data.cover,
          })
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'loading'
          })
        }
      }
    })
  },
  departDetail() {
    var that=this
    wx.request({
      url: app.globalData.url + '/user/offices',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': app.globalData.cookie
      },
      method: 'get',
      data: {
        pn: 1,
        ps: 15,
      },
      success: function (res) {

        if (res.data.code == 0) {
          var departDetail = ''
          if (res.data.data.rows) {
            for (var i in res.data.data.rows) {
              departDetail = departDetail + "/" + res.data.data.rows[i].name
            }
            departDetail = departDetail.slice(1, departDetail.length)
          }
          that.setData({
            departDetail: departDetail,
            depart: res.data.data.rows
          })
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'loading'
          })
        }
      }
    })
  },
  docList() {
    var that=this
    wx.request({
      url: app.globalData.url + '/user/doctors',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': app.globalData.cookie
      },
      method: 'get',
      data: {
        //  sort   
        // order
        pn: 1,
        ps: 5,
      },
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data.rows) {
            for (var i in res.data.data.rows) {
              res.data.data.rows[i].cover = app.cover(res.data.data.rows[i].cover)
            }
          }
          that.setData({
            docList: res.data.data.rows
          })
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'loading'
          })
        }
      }
    })
  },
  onLoad: function () {
   
  },
  onShow: function () {
    this.hosDetail();
    this.departDetail();
    this.docList();
  },
  onReady: function () {
    this.setData({
      allHidden: 'none'
    })
  },
  lookMoreDetail(e) {
    wx.navigateTo({
      url: '../hosIndex/hosIndex?detail=' + JSON.stringify(e.currentTarget.dataset.detail),
    })
  },
  doctor(e) {
    wx.navigateTo({
      url: '../doctor/doctor?id=' + e.currentTarget.dataset.id + '&type=1' + '&detail=' + JSON.stringify(e.currentTarget.dataset.detail),
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      hosDetail: '',
      departDetail: '',
      docList: [],
    })
    this.hosDetail()
    this.departDetail()
    this.docList()
    wx.stopPullDownRefresh()
  },
})
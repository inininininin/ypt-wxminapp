//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/util.js');
Page({
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    testImg: "../icon/Bitmap.png",
    imglist: [],
  },
  // 查看二维码
  lookCode(e) {
    var current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.imglist // 需要预览的图片http链接列表
    })
  },

  scan(e) {
    wx.scanCode({
      success(res) {
        console.log(res, res.path.slice(3, 4))
        if (res.path.slice(3, 4) == 'i') {
          wx.reLaunch({
            url: res.path,
          })
        } else {
          wx.navigateTo({
            url: res.path,
          })
        }

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
    var that = this
    wx.request({
      url: app.globalData.url + '/user/hospital',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'get',
      data: {
        hospitalId: wx.getStorageSync('loginHospitalId'), // app.globalData.loginHospitalId,
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
    var that = this
    wx.request({
      url: app.globalData.url + '/user/offices',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
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
    var that = this
    wx.request({
      url: app.globalData.url + '/user/doctors',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
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
        } else if(res.data.code==20){
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'none',
            duration: 2000,
            mask: true,
            complete: function complete(res) {
              setTimeout(function () {
                  wx.setStorageSync('codeType', that.data.type)
                  wx.navigateTo({
                    url: '../login/login',
                  })
              }, 500);
            }
          });
        }else{
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'none',
          })
        }
      }
    })
  },
  onLoad: function (options) {
    console.log(options)
  },
  onShow: function (options) {
    console.log(options)
    if(options&&options.hospitalid){
      wx.setStorageSync('loginHospitalId', options.hospitalid)
      wx.setStorageSync('loginHpitalName', options.hospitalname)
    }
    
    if (wx.getStorageSync('codeType') == 1) {
      wx.navigateTo({
        url: '../evaNow/evaNow?type=' + wx.getStorageSync('type') + '&isfrom=1&id=' + wx.getStorageSync('id'),
      })
    }
    this.hosDetail();
    this.departDetail();
    this.docList();
    var that = this
    var param = encodeURIComponent('pages/index/index?hospitalid=' + app.globalData.userInfoDetail.hospitalId + '&hospitalname=' + app.globalData.userInfoDetail.hospitalName)
    wx.getImageInfo({
      src: app.globalData.url + '/wxminqrcode?path=' + param + '&width=2',
      method: 'get',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        var imglist = []
        imglist.push(res.path)
        that.setData({
          tcode: res.path,
          imglist: imglist,
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  onReady: function () {
    this.setData({
      allHidden: 'none'
    })
  },
  lookMoreDetail(e) {
    console.log(e.currentTarget.dataset.detail, JSON.stringify(e.currentTarget.dataset.detail))
    wx.navigateTo({
      url: '../hosIndex/hosIndex?detail=' + JSON.stringify(e.currentTarget.dataset.detail),
    })
  },
  doctor(e) {
    console.log(e.currentTarget.dataset.detail, JSON.stringify(e.currentTarget.dataset.detail))
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
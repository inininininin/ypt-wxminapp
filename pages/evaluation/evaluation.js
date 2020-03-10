// pages/evaluation/evaluation.js
var app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    navtitle: '全部评价',
    hospitalName: wx.getStorageSync('loginHpitalName'),
    allHidden: 'block',
    showNone: true,
    doctorNum: 0,
    nurseNum: 0,
    hospitalNum: 0,
    withoutLogin: false,
    userType: app.globalData.userInfoDetail.type,
    list1: [],
    list2:[],
    list1Num:0,
    list2Num:0,
  },
  toLogin(e) {
    var backUrl = '../evaluation/evaluation';
    wx.navigateTo({
      url: '../logs/logs?fromType=1&backUrl=' + backUrl,
    })
  },
  lookDetail(e) {
    var that = this
    if (e.currentTarget.dataset.evatype == 1) {
      for (var i in that.data.doctorList) {
        if (e.currentTarget.dataset.id == that.data.doctorList[i].doctorCommentId) {
          if (e.currentTarget.dataset.line == 'lineThree') {
            that.data.doctorList[i].lineThree = 'without'
          } else {
            that.data.doctorList[i].lineThree = 'lineThree'
          }
        }
      }
      that.setData({
        doctorList: that.data.doctorList
      })
    } else if (e.currentTarget.dataset.evatype == 2) {
      for (var i in that.data.nurseList) {
        if (e.currentTarget.dataset.id == that.data.nurseList[i].nurseCommentId) {
          if (e.currentTarget.dataset.line == 'lineThree') {
            that.data.nurseList[i].lineThree = 'without'
          } else {
            that.data.nurseList[i].lineThree = 'lineThree'
          }
        }
      }
      that.setData({
        nurseList: that.data.nurseList
      })
    } else  if (e.currentTarget.dataset.evatype == 3){
      for (var i in that.data.hospitalList) {
        if (e.currentTarget.dataset.id == that.data.hospitalList[i].hospitalCommentId) {
          if (e.currentTarget.dataset.line == 'lineThree') {
            that.data.hospitalList[i].lineThree = 'without'
          } else {
            that.data.hospitalList[i].lineThree = 'lineThree'
          }
        }
      }
      that.setData({
        hospitalList: that.data.hospitalList
      })
    } else  if (e.currentTarget.dataset.evatype == 4){
      for (var i in that.data.list1) {
        if (e.currentTarget.dataset.id == that.data.list1[i].doctorCommentId) {
          if (e.currentTarget.dataset.line == 'lineThree') {
            that.data.list1[i].lineThree = 'without'
          } else {
            that.data.list1[i].lineThree = 'lineThree'
          }
        }
      }
      that.setData({
        list1: that.data.list1
      })
    } else  if (e.currentTarget.dataset.evatype == 5){
      for (var i in that.data.list2) {
        if (e.currentTarget.dataset.id == that.data.list2[i].nurseCommentId) {
          if (e.currentTarget.dataset.line == 'lineThree') {
            that.data.list2[i].lineThree = 'without'
          } else {
            that.data.list2[i].lineThree = 'lineThree'
          }
        }
      }
      that.setData({
        list2: that.data.list2
      })
    }
  },
  lookMore(e) {
    wx.navigateTo({
      url: '../evalutionList/evalutionList?type=' + e.currentTarget.dataset.type,
    })
  },
  previewImage(e) {
    var current = e.currentTarget.dataset.src;
    var imglist = e.currentTarget.dataset.imglist;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfoDetail.type == 0) {
      this.lastPage(0, '/user/my-doctor-comments', 'doctorList')
      this.lastPage(0, '/user/my-nurse-comments', 'nurseList')
      this.lastPage(0, '/user/my-hospital-comments', 'hospitalList')
      this.numList( '/user/my-doctor-comments-sum', 'doctorList')
      this.numList( '/user/my-nurse-comments-sum', 'nurseList')
      this.numList( '/user/my-hospital-comments-sum', 'hospitalList')
    } else if (app.globalData.userInfoDetail.type == 1) {
      this.lastPageSelf(0, '/user/to-me-doctor-comments')
      this.numList( '/user/to-me-doctor-comments-sum', 'list1')
    } else if (app.globalData.userInfoDetail.type == 2) {
      this.lastPageSelf(0, '/user/to-me-nurse-comments')
      this.numList( '/user/to-me-nurse-comments-sum', 'list2')
    }

    if (this.data.doctorNum == 0 && this.data.nurseNum == 0 && this.data.hospitalNum == 0) {
      this.setData({
        showNone: true,
      });
    }
  },
  numList: function ( url, list) {
    var that = this
    wx.request({
      url: app.globalData.url + url, // '/user/my-messages',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          if (res.data.data.rowCount != 0) {
            that.setData({
              showNone: false,
            });
          }
          if (list == 'doctorList') {
            that.setData({
              doctorNum: res.data.data.rowCount,
            });
          } else if (list == 'nurseList') {
            that.setData({
              nurseNum: res.data.data.rowCount,
            });
          } else if (list == 'hospitalList') {
            that.setData({
              hospitalNum: res.data.data.rowCount,
            });
          } else if (list == 'list1') {
            that.setData({
              list1Num: res.data.data.rowCount,
            });
          } else if (list == 'list2') {
            that.setData({
              list2Num: res.data.data.rowCount,
            });
          }
        }
        // else {
        //   wx.showModal({
        //     showCancel: false,
        //     title: res.data.codeMsg
        //   })
        // }
      }
    });
  },
  lastPage: function (toPageNo, url, list) {
    var that = this
    toPageNo++
    wx.request({
      url: app.globalData.url + url, // '/user/my-messages',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        pn: toPageNo,
        ps: 3,
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          if (res.data.data.rows) {
            var addTime
            for (var i = 0; i < res.data.data.rows.length; i++) {
              addTime = res.data.data.rows[i].createTime
              res.data.data.rows[i].addTime = utils.formatTime(addTime / 1000, 'Y-M-D h:m');
              res.data.data.rows[i].lineThree = 'lineThree'
              // if (res.data.data.rows[i].content && res.data.data.rows[i].content.length > 72) {
              //   res.data.data.rows[i].lineThree = 'lineThree'
              // } else {
              //   res.data.data.rows[i].lineThree = 'without'
              // }
              if (res.data.data.rows[i].image) {
                var image = res.data.data.rows[i].image.split(',')
                for (var r in image) {
                  image[r] = app.cover(image[r])
                }
                res.data.data.rows[i].imgList = image
              }
            }
          }
          if (list == 'doctorList') {
            that.setData({
              doctorList: res.data.data.rows,
            });
          } else if (list == 'nurseList') {
            that.setData({
              nurseList: res.data.data.rows,
            });
          } else {
            that.setData({
              hospitalList: res.data.data.rows,
            });
          }
        }
        // else {
        //   wx.showModal({
        //     showCancel: false,
        //     title: res.data.codeMsg
        //   })
        // }
      }
    });
  },
  lastPageSelf: function (toPageNo, url, list) {
    var that = this
    toPageNo++
    wx.request({
      url: app.globalData.url + url, // '/user/my-messages',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        pn: toPageNo,
        ps: 15,
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          if (res.data.data.rows) {
            var addTime
            for (var i = 0; i < res.data.data.rows.length; i++) {
              addTime = res.data.data.rows[i].createTime
              res.data.data.rows[i].addTime = utils.formatTime(addTime / 1000, 'Y-M-D h:m');
              res.data.data.rows[i].lineThree = 'lineThree'
              if (res.data.data.rows[i].image) {
                var image = res.data.data.rows[i].image.split(',')
                for (var r in image) {
                  image[r] = app.cover(image[r])
                }
                res.data.data.rows[i].imgList = image
              }
            }
          }
          if (list == 'list1') {
            var list1 = that.data.list1.concat(res.data.data.rows)
            that.setData({
              list1: list1,
              list2Num:0,
              toPageNo: String(toPageNo)
            });
          } else {
            var list2 = that.data.list2.concat(res.data.data.rows)
            that.setData({
              list2: list2,
              list1Num:0,
              toPageNo: String(toPageNo)
            });
          }

        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      allHidden: 'none'
    })
  },
  backHistory(e) {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  var that=this
    if (wx.getStorageSync('withoutLogin') === true || wx.getStorageSync('withoutLogin') === '') {
      that.setData({
        withoutLogin: true,
        doctorList: [],
        nurseList: [],
        hospitalList: [],
        list1: [],
        list2: []
      })
    } else {
      wx.request({
        url: app.globalData.url + '/user/login-refresh',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'cookie': wx.getStorageSync('cookie')
        },
        method: 'post',
        success: function (res) {
          wx.hideToast()
          if (res.data.code == 0) {
            wx.setStorageSync('withoutLogin', false)
            app.globalData.userInfoDetail = res.data.data
            if (app.globalData.userInfoDetail.type == 0) {
              if (that.data.doctorList && that.data.doctorList.length == 0 && that.data.nurseList.length == 0 && that.data.hospitalList.length == 0) {
                that.lastPage(0, '/user/my-doctor-comments', 'doctorList')
                that.lastPage(0, '/user/my-nurse-comments', 'nurseList')
                that.lastPage(0, '/user/my-hospital-comments', 'hospitalList')
                that.numList('/user/my-doctor-comments-sum', 'doctorList')
                that.numList( '/user/my-nurse-comments-sum', 'nurseList')
                that.numList( '/user/my-hospital-comments-sum', 'hospitalList')
              }
            } else if (app.globalData.userInfoDetail.type == 1) {
              if (that.data.list1 && that.data.list1.length == 0) {
                that.lastPageSelf(0, '/user/to-me-doctor-comments', 'list1')
                that.numList('/user/to-me-doctor-comments-sum', 'list1')
              }
            } else if (app.globalData.userInfoDetail.type == 2) {
              if (that.data.list2 && that.data.list2.length == 0) {
                that.lastPageSelf(0, '/user/to-me-nurse-comments', 'list2')
                that.numList( '/user/to-me-nurse-comments-sum', 'list2')
              }
            }
          } else {
           
          }
        }
      })
      
      that.setData({
        withoutLogin: false,
        userType: app.globalData.userInfoDetail.type,
      })
    }
    that.setData({
      allHidden: 'none',
      loginHpitalName: wx.getStorageSync('loginHpitalName'),
    })
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
    this.setData({
      doctorList: [],
      nurseList: [],
      hospitalList: [],
      list1: [],
      list2: []
    })
    if (app.globalData.userInfoDetail.type == 0) {
      this.lastPage(0, '/user/my-doctor-comments', 'doctorList')
      this.lastPage(0, '/user/my-nurse-comments', 'nurseList')
      this.lastPage(0, '/user/my-hospital-comments', 'hospitalList')
      this.numList( '/user/my-doctor-comments-sum', 'doctorList')
      this.numList( '/user/my-nurse-comments-sum', 'nurseList')
      this.numList( '/user/my-hospital-comments-sum', 'hospitalList')
    } else if (app.globalData.userInfoDetail.type == 1) {
      this.lastPageSelf(0, '/user/to-me-doctor-comments','list1')
      this.numList( '/user/to-me-doctor-comments-sum','list1')
    } else if (app.globalData.userInfoDetail.type == 2) {
      this.lastPageSelf(0, '/user/to-me-nurse-comments','list2')
      this.numList( '/user/to-me-nurse-comments-sum', 'list2')
    }
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var toPageNo = this.data.toPageNo
    if (app.globalData.userInfoDetail.type == 1) {
      this.lastPageSelf(toPageNo, '/user/to-me-doctor-comments','list1')
      this.numList( '/user/to-me-doctor-comments-sum','list1')
    } else if (app.globalData.userInfoDetail.type == 2) {
      this.lastPageSelf(toPageNo, '/user/to-me-nurse-comments','list2')
      this.numList( '/user/to-me-nurse-comments-sum', 'list2')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
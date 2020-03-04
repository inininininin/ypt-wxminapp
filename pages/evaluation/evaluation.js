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
    withoutLogin:false
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
        if(e.currentTarget.dataset.id==that.data.doctorList[i].doctorCommentId){
          if(e.currentTarget.dataset.line=='lineThree'){
            that.data.doctorList[i].lineThree='without'
          }else{
            that.data.doctorList[i].lineThree='lineThree'
          }
        }
      }
      that.setData({
        doctorList:that.data.doctorList
      })
    } else if (e.currentTarget.dataset.evatype == 2) {
      for (var i in that.data.nurseList) {
        if(e.currentTarget.dataset.id==that.data.nurseList[i].nurseCommentId){
          if(e.currentTarget.dataset.line=='lineThree'){
            that.data.nurseList[i].lineThree='without'
          }else{
            that.data.nurseList[i].lineThree='lineThree'
          }
        }
      }
      that.setData({
        nurseList:that.data.nurseList
      })
    } else {
      for (var i in that.data.hospitalList) {
        if(e.currentTarget.dataset.id==that.data.hospitalList[i].hospitalCommentId){
          if(e.currentTarget.dataset.line=='lineThree'){
            that.data.hospitalList[i].lineThree='without'
          }else{
            that.data.hospitalList[i].lineThree='lineThree'
          }
        }
      }
      that.setData({
        hospitalList:that.data.hospitalList
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
    this.lastPage(0, '/user/my-doctor-comments', 'doctorList')
    this.lastPage(0, '/user/my-nurse-comments', 'nurseList')
    this.lastPage(0, '/user/my-hospital-comments', 'hospitalList')
    this.numList(0, '/user/my-doctor-comments-sum', 'doctorList')
    this.numList(0, '/user/my-nurse-comments-sum', 'nurseList')
    this.numList(0, '/user/my-hospital-comments-sum', 'hospitalList')
    if (this.data.doctorNum == 0 && this.data.doctorNum == 0 && this.data.doctorNum == 0) {
      this.setData({
        showNone: true,
      });
    }
  },
  numList: function (toPageNo, url, list) {
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
          } else {
            that.setData({
              hospitalNum: res.data.data.rowCount,
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
                console.log(image)
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
    if(wx.getStorageSync('withoutLogin')===true||wx.getStorageSync('withoutLogin')===''){
      this.setData({
        withoutLogin:true,
        doctorList: [],
        nurseList: [],
        hospitalList: [],
      })
    }else{
      if(this.data.doctorList&&this.data.doctorList.length==0&&this.data.nurseList.length==0&&this.data.hospitalList.length==0){
        this.lastPage(0, '/user/my-doctor-comments', 'doctorList')
        this.lastPage(0, '/user/my-nurse-comments', 'nurseList')
        this.lastPage(0, '/user/my-hospital-comments', 'hospitalList')
        this.numList(0, '/user/my-doctor-comments-sum', 'doctorList')
        this.numList(0, '/user/my-nurse-comments-sum', 'nurseList')
        this.numList(0, '/user/my-hospital-comments-sum', 'hospitalList')
      }
      
      this.setData({
        withoutLogin:false
      })
    }
    this.setData({
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
    })
    this.lastPage(0, '/user/my-doctor-comments', 'doctorList')
    this.lastPage(0, '/user/my-nurse-comments', 'nurseList')
    this.lastPage(0, '/user/my-hospital-comments', 'hospitalList')
    this.numList(0, '/user/my-doctor-comments-sum', 'doctorList')
    this.numList(0, '/user/my-nurse-comments-sum', 'nurseList')
    this.numList(0, '/user/my-hospital-comments-sum', 'hospitalList')
    wx.stopPullDownRefresh()
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
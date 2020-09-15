// pages/evalutionList/evalutionList.js
var app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    navtitle: '',
    list:[],
    loginHpitalName:app.globalData.loginHpitalName
  },
  previewImage(e) {
    var current = e.currentTarget.dataset.src;
    var imglist = e.currentTarget.dataset.imglist;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },
  lookDetail(e) {
    var that = this
    if (e.currentTarget.dataset.evatype == 1) {
      for (var i in that.data.list) {
        if(e.currentTarget.dataset.id==that.data.list[i].doctorCommentId){
          if(e.currentTarget.dataset.line=='lineThree'){
            that.data.list[i].lineThree='without'
          }else{
            that.data.list[i].lineThree='lineThree'
          }
        }
      }
      that.setData({
        list:that.data.list
      })
    } else if (e.currentTarget.dataset.evatype == 2) {
      for (var i in that.data.list) {
        if(e.currentTarget.dataset.id==that.data.list[i].nurseCommentId){
          if(e.currentTarget.dataset.line=='lineThree'){
            that.data.list[i].lineThree='without'
          }else{
            that.data.list[i].lineThree='lineThree'
          }
        }
      }
      that.setData({
        list:that.data.list
      })
    } else {
      for (var i in that.data.list) {
        if(e.currentTarget.dataset.id==that.data.list[i].hospitalCommentId){
          if(e.currentTarget.dataset.line=='lineThree'){
            that.data.list[i].lineThree='without'
          }else{
            that.data.list[i].lineThree='lineThree'
          }
        }
      }
      that.setData({
        list:that.data.list
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type='',url=''
    if(options.type==1){
      type='医生评价列表';
      url='/user/my-doctor-comments';
    }else  if(options.type==2){
      type='医护评价列表';
      url='/user/my-nurse-comments'
    }else{
      type='医院评价列表';
      url='/user/my-hospital-comments';  
    }
    this.setData({
      navtitle:type,
      types:options.type,
      url:url,
      loginHpitalName:wx.getStorageSync('loginHpitalName')
    })
    this.lastPage(0, url)
  },
  backHistory(e) {
    // wx.navigateBack({
    //   delta: 1
    // })
    console.log(123)
    wx.switchTab({
      url: '../index/index',
    })
  },
  lastPage: function (toPageNo, url) {
    var that = this
    // toPageNo++
    var toPageNo = parseInt(toPageNo) + 1
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
        var list=that.data.list.concat(res.data.data.rows)
            that.setData({
              list: list,
              toPageNo: String(toPageNo)
            });
         
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
    this.setData({
      list:[]
    })
    this.lastPage(0, this.data.url)
    wx.stopPullDownRefresh({
      complete: (res) => {},
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var toPageNo = this.data.toPageNo
    this.lastPage(toPageNo, this.data.url)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    wx.request({
      url: app.globalData.url + '/user/share',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
        
        }
      }
    })
  }
})
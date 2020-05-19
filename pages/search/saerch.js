// pages/search/saerch.js
var app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    keyword: '',
    searchVal:2,
    navbar: ['综合'],
    currentTab: 0,
    docList: [],
    nursesList:[],
    officesList:[],
    numlist1:[],
    numlist1Show:true,
    numlist2:[],
    numlist2Show:true,
    numlist3:[],
    numlist3Show:true,
    depart:''
  },
  backHistory(e) {
    wx.navigateBack({
      delta: 1
    })
  },
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
      productIs: e.currentTarget.dataset.idx,
      qx:1,
    })
  },
  inputVal(e){
    this.setData({
      keyword:e.detail.value
    })
  },
  searchThis:function(e){
    if(this.data.keyword){
      this.docList(0,4,this.data.keyword)
      this.nurseList(0,4,this.data.keyword)
      this.evaList(0,5,this.data.keyword)
    }else{
      this.docList(0,4,'')
      this.nurseList(0,4,'')
      this.evaList(0,5,'')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.departDetail()
    this.setData({
      keyword:options.kw
    })
    if(options.kw){
      this.docList(0,4,options.kw)
      this.nurseList(0,4,options.kw)
      this.evaList(0,5,options.kw)
    }else{
      this.docList(0,4,'')
      this.nurseList(0,4,'')
      this.evaList(0,5,'')
    }
    
  },
  doctor(e) {
    wx.navigateTo({
      url: '../doctor/doctor?id=' + e.currentTarget.dataset.id + '&type='+ e.currentTarget.dataset.type+ '&detail=' + JSON.stringify(e.currentTarget.dataset.detail),
    })
  },
  departDetails(e){
    wx.navigateTo({
      url: '../departDetail/departDetail?id='+e.currentTarget.dataset.id,
    })
  },
  evaList1(e) {
    console.log(12121)
    wx.navigateTo({
      url: '../evaList/evaList?type=' + e.currentTarget.dataset.type + '&detail=' + JSON.stringify(this.data.depart),
    })
  },
  evadepart(e) {
    wx.navigateTo({
      url: '../evadepart/evadepart?detail=' + JSON.stringify(this.data.depart),
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
      complete: (res) => {},
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

  },

  // 请求数据方法
  // 医生列表
  docList(pn,ps,kw) {
    var that = this
    pn++
    wx.request({
      url: app.globalData.url + '/user/doctors',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'get',
      data: {
        hosptialId:wx.getStorageSync('loginHospitalId'),
        pn: pn,
        ps: ps,
        kw:kw,
      },
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data.rows&&res.data.data.rows.length>0) {
            var numlist1Show=true
            for (var i in res.data.data.rows) {
              res.data.data.rows[i].cover = app.cover(res.data.data.rows[i].cover)
            }
          }else{
            var numlist1Show=false
          }
          that.setData({
            numlist1Show:numlist1Show,
            docList: res.data.data.rows,
            pn:pn
          })
          console.log(that.data.docList)
        } 
      }
    })
  },
  nurseList(pn,ps,kw) {
    var that = this
    pn++
    wx.request({
      url: app.globalData.url + '/user/nurses',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'get',
      data: {
        hosptialId:wx.getStorageSync('loginHospitalId'),
        pn: pn,
        ps: ps,
        kw:kw,
      },
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data.rows&&res.data.data.rows.length>0) {
            var numlist2Show=true
            for (var i in res.data.data.rows) {
              res.data.data.rows[i].cover = app.cover(res.data.data.rows[i].cover)
            }
          }else{
            var numlist2Show=false
          }
          that.setData({
            numlist2Show:numlist2Show,
            nursesList: res.data.data.rows,
            pn:pn
          })
        } 
      }
    })
  },
  evaList(pn,ps,kw) {
    var that = this
    pn++
    wx.request({
      url: app.globalData.url + '/user/offices',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'get',
      data: {
        hosptialId:wx.getStorageSync('loginHospitalId'),
        pn: pn,
        ps: ps,
        kw:kw,
      },
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data.rows&&res.data.data.rows.length>0) {
            var numlist3Show=true
            for (var i in res.data.data.rows) {
              res.data.data.rows[i].cover = app.cover(res.data.data.rows[i].cover)
            }
          }else{
            var numlist3Show=false
          }
          that.setData({
            numlist3Show:numlist3Show,
            officesList: res.data.data.rows,
            pn:pn
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
        hosptialId:wx.getStorageSync('loginHospitalId')
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
        } 
      }
    })
  },
})
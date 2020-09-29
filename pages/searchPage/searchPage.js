// pages/searchPage/searchPage.js
var app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    // navtitle: '详情',
    searchVal:2,
    navbar: ['综合', '医生', '护士','评价'],
    currentTab: 0,
    searchKeysThis:[],
    searchKeysThisShow:true,
    hotSearchThis:[],
    hotSearchThisShow:false,
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
  clearAll(e){
    wx.setStorageSync('searchKeys', '')
    this.setData({
      searchKeysThis:[],
      searchKeysThisShow:false
    })
  },
  searchKeyWords(e){
    var searchKeysThis=this.data.searchKeysThis
    var key=searchKeysThis
    var searchKeys=''
    for(var i in key){
      searchKeys=searchKeys+','+key[i]
      console.log(searchKeys)
    }
    var searchKeys=e.currentTarget.dataset.kw+searchKeys
    var keys=searchKeys.split(',')
    var searchKeysThisOn=[]
    for(var i in keys){
      searchKeysThisOn.push(keys[i])
    }
    this.setData({
      searchKeysThis:searchKeysThisOn,
      searchKeysThisShow:true
    })
    console.log(searchKeysThis,this.data.searchKeysThis)
    wx.setStorageSync('searchKeys', searchKeys)
    console.log(searchKeys)
    wx.navigateTo({
      url: '../search/saerch?kw='+e.currentTarget.dataset.kw,
    })
  },
  searchKey(e){
    if(e.detail.value==''){
      wx.showToast({
        title: '请输入搜索内容',
        icon:'none'
      })
    }else{
      var searchKeysThis=this.data.searchKeysThis
      var key=searchKeysThis
      var searchKeys=''
      for(var i in key){
        searchKeys=searchKeys+','+key[i]
        console.log(searchKeys)
      }
      var searchKeys=e.detail.value+searchKeys
      var keys=searchKeys.split(',')
      var searchKeysThisOn=[]
      for(var i in keys){
        searchKeysThisOn.push(keys[i])
      }
      this.setData({
        searchKeysThis:searchKeysThisOn,
        searchKeysThisShow:true
      })
      console.log(searchKeysThis,this.data.searchKeysThis)
      wx.setStorageSync('searchKeys', searchKeys)
      console.log(searchKeys)
      wx.navigateTo({
        url: '../search/saerch?kw='+e.detail.value,
      })
    }
    
  },
  searchKeyHos(e){
    wx.navigateTo({
      url: '../search/saerch?kw='+e.currentTarget.dataset.kw,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var searchKeys=wx.getStorageSync('searchKeys')
    console.log(searchKeys)
    // if(searchKeys.slice(searchKeys.length-1,searchKeys.length)==','){
    //   searchKeys=searchKeys.slice(0,searchKeys.length-1)
    // }
    
    var searchKeysThis=[]
    var searchKeysThisShow=false
    if(searchKeys){
      var key=searchKeys.split(',')
      searchKeysThisShow=true
      for(var i in key){
        searchKeysThis.push(key[i])
        console.log(searchKeysThis)
      }
    }
   
    
    this.setData({
      searchKeysThis:searchKeysThis,
      searchKeysThisShow:searchKeysThisShow
    })
    this.hotSearch()
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
    wx.request({
      url: app.globalData.url + '/ypt/user/share',
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
  },

  // 接口数据
  // 热搜榜
  hotSearch(){
    var that=this
    wx.request({
      url: app.globalData.url + '/ypt/hot-searches',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
        hospitalId:wx.getStorageSync('loginHospitalId')
      },
      method: 'get',
      success: function (res) {
        if (res.data.code == 0) {
          if(res.data.data.rows){
            that.setData({
              hotSearchList:res.data.data.rows,
              hotSearchListShow:true
            })
          }
          
        }
      }
    })
  },
  
})
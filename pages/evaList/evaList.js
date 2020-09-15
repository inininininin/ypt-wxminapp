// pages/evaList/evaList.js
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
    selectDatas: ['全部', '未就诊', '已就诊', '未就诊', '已就诊', '未就诊', '已就诊'],
    indexs: 0, //选择的下拉列 表下标,
    schemeList:[],
    kw:'',
    officeId:'',
    allHidden:'block',
    toPageNo:0,
  },
  // 点击下拉显示框
  selectTaps() {
    this.setData({
      shows: !this.data.shows,
    });
  },
  // 点击下拉列表
  optionTaps(e) {
    var status
    let indexs = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    let officeId=e.currentTarget.dataset.id;
    this.setData({
      officeId: officeId,
      indexs:indexs,
      shows: !this.data.shows,
      schemeList: [],
    });
    this.lastPage(0)
  },
  doctor(e){
    wx.navigateTo({
      url: '../doctor/doctor?id='+e.currentTarget.dataset.id+'&type='+this.data.type+'&detail='+JSON.stringify(e.currentTarget.dataset.detail),
    })
  },
  searchInput(e){
    this.setData({
      kw:e.detail.value,
      schemeList: [],
    })
    this.lastPage(0)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this 
    var selectDatas=[{officeId: "", name: "全部"}]
    selectDatas=selectDatas.concat(JSON.parse(options.detail))
    var urls=''
    if(options.type==1){
      urls='/user/doctors'
      that .setData({
        navtitle:'医生列表',
        type:options.type,
        url:urls,
        selectDatas:selectDatas
      })
    }else if(options.type==2){
      urls='/user/nurses'
      that .setData({
        navtitle:'医护列表',
        type:options.type,
        url:urls,
        selectDatas:selectDatas
      })
    }
    that.lastPage(0)
  },
  lastPage: function (toPageNo) {
    var that = this
    toPageNo++
    wx.request({
      url: app.globalData.url + that.data.url,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        pn: toPageNo,
        ps: 15,
        kw:that.data.kw,
        officeId:that.data.officeId,
        hosptialId:wx.getStorageSync('loginHospitalId')
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          var addTime
          for (var i = 0; i < res.data.data.rows.length; i++) {
            addTime = res.data.data.rows[i].addTime
            res.data.data.rows[i].addTime = utils.formatTime(addTime / 1000, 'Y-M-D h:m');
            res.data.data.rows[i].cover = app.cover(res.data.data.rows[i].cover)
          }
          
          var schemeListArr = that.data.schemeList;
          var newSchemeListArr = schemeListArr.concat(res.data.data.rows)
          if (res.data.data.rows.length == 0) {
            that.setData({
              schemeList: newSchemeListArr,
            });
          } else {
            that.setData({
              schemeList: newSchemeListArr,
              toPageNo: String(toPageNo)
            });
           
          }
          // that.setData({
          //   toPageNo: String(toPageNo)
          // })
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
      schemeList: [],
    })
    this.lastPage(0)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var toPageNo = this.data.toPageNo;
    this.lastPage(toPageNo)
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
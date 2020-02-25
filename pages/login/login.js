// pages/login/login.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    times:'获取验证码',
    time:60,
    key:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  
  loginWx:function(){
    // /user/login-by-wxminapp
    // wx.request({
    //   url: 'url',
    // })
  },
  loginPhone: function (e) {
    this.setData({
      key: e.detail.value,
    })
  },
  code: function (e) {
    this.setData({
      code: e.detail.value,
    })
  },
  // 获取验证码
  timeBack(){
    var that=this
      var timer = setInterval(function () {
        var time=that.data.time-1;
        that.setData({
          times: time + ' s',
          time: time
        })
        if (that.data.time == 0) {
          clearInterval(timer);
          that.setData({
            times: '获取验证码',
            time:60
          })
        }
      }, 1000);   
  },
  smsvcodeGet(e) {
    var that = this
    if (that.data.key == '' || that.data.key.length < 11) {
      wx.showToast({
        title: '请填写正确手机号',
        icon:'loading'
      })
    } else if (that.data.times != '获取验证码') {
      return
    } else {
      that.setData({
        time:60
      })
      wx.request({
        url: app.globalData.url + '/sendsmsvcode',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: 'post',
        data: {
          phone: that.data.key,
        },
        success: function (res) {
          wx.hideToast()
          if (res.data.code == 0) {
            that.timeBack()
          } else {
            wx.showToast({
              title: res.data.codeMsg
            })
          }
        }
      })
    }
  },
  login(e){
    var that=this
    wx.request({
      url: app.globalData.url + '/user/login-by-smsvcode',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: 'post',
      data: {
        phone: that.data.key,
        smsvcode:that.data.code,
        loginHospitalId:app.globalData.loginHospitalId,
      },
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          wx.showToast({
            title: '操作成功',
            icon:'loading'
          })
          app.globalData.cookie = res.header['Set-Cookie']
          wx.request({
            url: app.globalData.url + '/user/login-refresh',
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              'cookie': app.globalData.cookie
            },
            method: 'post',
            success: function (res) {
              wx.hideToast()
              if (res.data.code == 0) {
                app.globalData.userInfoDetail=res.data.data
                wx.switchTab({
                  url: '../index/index',
                })
              } else {
                wx.showToast({
                  title: res.data.codeMsg,
                  icon:'loading'
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon:'loading'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.login({
      success(res) {
        console.log(res.code);
        var code = res.code
      }
    })
  },
  getPhoneNumber (e) {
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
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
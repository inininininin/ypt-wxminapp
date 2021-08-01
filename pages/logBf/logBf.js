// pages/logBf/logBf.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '请稍等...'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.login({
      success(res) {
        var code = res.code
        console.log(code)
        wx.request({
          url: app.globalData.url + '/ypt/user/login-by-wxminapp-jscode',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: 'post',
          data: {
            wsJsCode: code,
            loginHospitalId: wx.getStorageSync('loginHospitalId'),
            // wxMinappencryptedDataOfPhoneNumber: e.detail.encryptedData || '',
            // wxMinappIv: e.detail.iv || '',
          },
          success: function (res) {
            wx.hideToast()
            if (res.data.code == 0) {

              wx.setStorageSync('cookie', res.header['Set-Cookie'])
              wx.request({
                url: app.globalData.url + '/ypt/user/login-refresh',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  'cookie': wx.getStorageSync('cookie')
                },
                method: 'post',
                success: function (res) {
                  wx.hideToast()
                  if (res.data.code == 0) {
                    app.globalData.userInfoDetail = res.data.data
                    wx.setStorageSync('loginHospitalId', res.data.data.hospitalId)
                    wx.setStorageSync('loginHpitalName', res.data.data.hospitalName)
                    wx.setStorageSync('codeType', that.data.type)
                    wx.setStorageSync('withoutLogin', false)
                    setTimeout(function () {
                      wx.setStorageSync('historyUrl', that.data.backUrl)
                      if (that.data.fromType == 1) {
                        wx.setStorageSync('fromTab', 1)
                        wx.switchTab({
                          url: '../index/index',
                        })
                      } else {
                        wx.switchTab({
                          url: '../index/index',
                        })
                      }
                    }, 500);
                    // wx.showToast({
                    //   title: '登录成功',
                    //   icon: 'none',
                    //   duration: 2000,
                    //   mask: true,
                    //   complete: function complete(res) {
                    //     setTimeout(function () {
                    //       wx.setStorageSync('historyUrl', that.data.backUrl)
                    //       if (that.data.fromType == 1) {
                    //         wx.setStorageSync('fromTab', 1)
                    //         wx.switchTab({
                    //           url: '../index/index',
                    //         })
                    //       } else {
                    //         wx.switchTab({
                    //           url: '../index/index',
                    //         })
                    //       }
                    //     }, 500);
                    //   }
                    // });

                  } else {
                    // wx.showToast({
                    //   title: res.data.codeMsg,
                    //   icon: 'none',
                    //   duration: 3000
                    // })
                    that.setData({
                      text: res.data.codeMsg
                    })
                  }
                }
              })


            } else {
              // wx.showToast({
              //   title: res.data.codeMsg,
              //   icon: 'none',
              //   duration: 3000
              // })
              that.setData({
                text: res.data.codeMsg
              })
            }
          }
        })
      }
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
// packageA/pages/login/login.js
const app = getApp({
  allowDefault: true
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight, // 导航栏高度
    menuRight: app.globalData.menuRight, // 胶囊距右方间距（方保持左、右间距一致）
    menuBotton: app.globalData.menuBotton, // 胶囊距底部间距（保持底部间距一致）
    menuHeight: app.globalData.menuHeight, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    menuWidth: app.globalData.menuWidth,
    title: "登录",
    realname: '',
    addressList: {},
    address: '',
    phone:'',
    showMaintainIs:true
  },
  realname(e){
    this.setData({
      realname:e.detail.value
    })
  },
  getPhoneNumber(e) {
    let that = this
    wx.login({
      success(res) {
        var code = res.code
        wx.request({
          url: app.globalData.dkUrl + '/vfc-clockin/bind-phone-by-wxmapp',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            'cookie': wx.getStorageSync('dkcookie')
          },
          method: 'post',
          data: {
            wsJsCode: code,
            // loginHospitalId: wx.getStorageSync('loginHospitalId'),
            wxMinappencryptedDataOfPhoneNumber: e.detail.encryptedData || '',
            wxMinappIv: e.detail.iv || '',
          },
          success: function (res) {
            if (res.data.code == 0) {
            let phone=res.data.data.phone
            that.setData({
              phone: phone
            })
              // wx.showToast({
              //   title: '绑定成功',
              //   icon: 'none',
              //   duration: 2000,
              //   mask: true,
              //   complete: function (res) {
              //     that.setData({
              //       phone: phone
              //     })
              //   }
              // });


            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          }
        })
      }
    })

  },
  WxLogin() {
    let that = this
    wx.login({
      success(res) {
        var code = res.code
        wx.request({
          url: app.globalData.dkUrl + '/vfc-clockin/login-by-wxmapp',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: 'post',
          data: {
            wsJsCode: code,
          },
          success: function (res) {
            wx.hideToast()
            if (res.data.code == 0) {
              // console.log(res.header['Set-Cookie'])
              // wx.setStorageSync('dkcookie', res.header['Set-Cookie'])
              let dkcookie=res.header['Set-Cookie'].split('HttpOnly,')[0].split(';')[0]+';'+res.header['Set-Cookie'].split('HttpOnly,')[1].split(';')[0]
              wx.setStorageSync('dkcookie', dkcookie)
              wx.getLocation({
                type: 'wgs84',
                success(res) {
                  const latitude = res.latitude
                  const longitude = res.longitude
                  const speed = res.speed
                  const accuracy = res.accuracy
                  console.log(latitude, longitude, speed, accuracy,app.globalData.dkUrl + '/vfc-clockin/baidu/map/reverse-geocoding')
                  wx.request({
                    url: app.globalData.dkUrl + '/vfc-clockin/baidu/map/reverse-geocoding',
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded",
                      'cookie': wx.getStorageSync('dkcookie')
                    },
                    data: {
                      longitude: longitude,
                      latitude: latitude,
                    },
                    method: 'post',
                    success: function (res) {
                      wx.hideToast()
                      if (res.data.code == 0) {
                        console.log(res.data.data)
                        let result = res.data.data.result
                        let address = result.formatted_address
                        let addressList = {}
                        addressList.area1Name = result.addressComponent.province
                        addressList.area2Name = result.addressComponent.city
                        addressList.area3Name = result.addressComponent.district
                        addressList.area1Id = result.addressComponent.adcode.slice(0, 2)
                        addressList.area2Id = result.addressComponent.adcode.slice(0, 4)
                        addressList.area3Id = result.addressComponent.adcode.slice(0, 6)
                        that.setData({
                          addressList: addressList,
                          address: address,
                        })
                      } else {
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'none'
                        })
                      }
                    }
                  });
                }
              })

              wx.request({
                url: app.globalData.dkUrl + '/vfc-clockin/login-refresh',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  'cookie': wx.getStorageSync('dkcookie')
                },
                method: 'post',
                success: function (res) {
                  wx.hideToast()
                  if (res.data.code == 0) {
                    app.globalData.dkUserInfoDetail=res.data.data
                      that.setData({
                        phone:res.data.data.phone||''
                      })
                      if(res.data.data.maintainIs==1){
                        that.setData({
                          showMaintainIs:true
                        })
                      }
                  } else {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none'
                    })
                  }
                }
              })


            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app)
    let that = this
    that.WxLogin()
    
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
      success: (res) => {},
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
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    var path = 'packageA/pages/index/index'
    return {
      title: '维讯化工(南京)', //分享内容
      path: path, //分享地址
      imageUrl:'https://renx.cc/file/vfc-clockin/clockin.jpg', //分享图片
      success: function (res) {},
      fail: function (res) {}
    }
  },
  addTopic(){
    let that=this
    if(!that.data.phone||!that.data.realname){
      wx.showToast({
        title: '请填写姓名和号码',
        icon:'none'
      })
      return
    }
    wx.request({
      url: app.globalData.dkUrl + '/vfc-clockin/alter-me',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('dkcookie')
      },
      data:{
        realname:that.data.realname
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          wx.navigateBack()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  }
})
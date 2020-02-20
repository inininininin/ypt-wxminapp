// pages/mine/mine.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    showIs: false,
    showIsTcode:false,
    names: '',
    phone: '',
    name: '',
    avator:'',
    tcode:''
  },
  tel(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  edit(e) {
    this.setData({
      showIs: true
    })
  },
  tCode(e) {
    this.setData({
      showIsTcode: true
    })
  },
  close(e) {
    this.setData({
      showIs: false,
      showIsTcode:false
    })
  },
  name(e) {
    this.setData({
      name: e.detail.value
    })
  },
  makesure(e) {
    var that = this
    wx.request({
      url: app.globalData.url + '/user/alter-my-info',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': app.globalData.cookie
      },
      method: 'post',
      data: {
        name: that.data.name,
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '操作成功',
            icon: 'loading'
          })
          setTimeout(function () {
            that.setData({
              names: that.data.name,
              showIs: false
            })
          }, 500)
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'loading'
          })
        }
      }
    })
  },
  loginout(e) {
    var that = this
    wx.request({
      url: app.globalData.url + '/user/logout',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': app.globalData.cookie
      },
      method: 'post',
      data: {
        name: that.data.name,
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.redirectTo({
            url: '../login/login',
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
  avator(){
    var that=this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        var avatar = res.tempFilePaths[0]
        wx.uploadFile({
          url: app.globalData.url + '/upload-static-file?cover&duration', //仅为示例，非真实的接口地址
          filePath: avatar,
          method: 'post',
          name: 'file',
          success: function (res) {
            var data = JSON.parse(res.data);
            var url = data.data.url
            console.log(data)
            if (data.code == 0) {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
              wx.request({
                url: app.globalData.url + '/user/alter-my-info', //仅为示例，非真实的接口地址
                method: 'post',
                data: {
                  cover: url,
                },
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  'cookie': app.globalData.cookie
                },
                success: function (res) {
                  that.setData({
                    avator: app.globalData.url + url
                  })
                }
              })
            }
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that=this
   if(app.globalData.userInfoDetail.cover==''||app.globalData.userInfoDetail.cover==null||app.globalData.userInfoDetail.cover==undefined){
     var avator='../icon/moren.png'
   }else{
    var avator=app.globalData.url+app.globalData.userInfoDetail.cover
   }
   that.setData({
      names: app.globalData.userInfoDetail.name,
      phone: app.globalData.userInfoDetail.phone,
      avator:avator
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
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon:'loading'
          })
        }
      }
    })
  var that=this
  wx.getImageInfo({
    src: app.globalData.url + '/wxminqrcode?path=pages/evaNow/evaNow?id=' + 2 + '&width=2',
    method:'get',
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    success: function(res) {
      that.setData({
        tcode:res.path
      })
    }
  })
    // var path=encodeURIComponent('pages/evaNow/evaNow?id=3')
    // wx.request({
    //   url: app.globalData.url + '/wxminqrcode',
    //   method:'get',
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   data:{
    //     path:path,
    //     width:2
    //   },
    //   success: function(res) {
    //     console.log(res);
    //     that.setData({
    //       tcode:'http://tmp/wxe403283f3b493453.o6zAJs1UGKDUdgrCE9ztq9czrC98.j8rxOYKt74fzf96c9de1a4c838cce479012b23982446.jpeg'
    //     })
    //   }
    // })
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
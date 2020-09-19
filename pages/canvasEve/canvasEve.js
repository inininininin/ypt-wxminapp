// pages/canvasEve/canvasEve.js
const app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    navtitle: '二维码',
    testImg: "../icon/Bitmap.png",
    imglist: [],
  },
  backHistory(e) {
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.avator, options.name, options.eveName, options.img)
    var imglist = []
    imglist.push(options.img)
    this.setData({
      imglist: imglist,
      hosName: options.name,
      avator: options.avator,
      eveName: options.eveName
    })
    this.sys();
    this.lookCode()
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

  },
  sys: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowW: res.windowWidth,
          windowH: res.windowHeight,
          windowTop: (res.windowHeight - res.windowWidth) / 2
        })
      },
    })
  },
  canvasdraw: function (canvas) {
    var that = this;
    that.setData({
      canvasShow: true
    })
    console.log('n3')
    if (that.data.avator == '../icon/moren.png') {
      console.log(11)
      that.setData({
        avatorShare: that.data.avator
      })
      var leftW = (that.data.windowW - 200) / 2
      var windowW = that.data.windowW;
      var windowH = that.data.windowH;

      canvas.drawImage('../icon/fang.png', 0, 0, windowW, windowW);
      canvas.drawImage(that.data.avatorShare, 15, 30, 50, 50);
      canvas.drawImage(that.data.imglist[0], leftW, 100, 200, 200);
      // canvas.setFontSize(50)
      canvas.font = "20px Georgia";
      // if(that.data.detail.type2NurseName){
      canvas.fillText(that.data.eveName, 70, 50)
      // }else if(that.data.detail.type1DoctorName){
      // canvas.fillText('医生：'+that.data.detail.type1DoctorName, 70, 50)
      // }
      canvas.font = "15px Georgia";
      canvas.fillText(app.globalData.hospitalName, 70, 70)
      canvas.draw(true, setTimeout(function () {
        console.log('n31')
        that.saveCanvas()

      }, 100));

    } else {
      console.log(that.data.avator)
      wx.downloadFile({
        url: that.data.avator,//注意公众平台是否配置相应的域名
        success: function (res) {
          console.log(333)
          that.setData({
            avatorShare: res.tempFilePath
          })
          var leftW = (that.data.windowW - 220) / 2
          var windowW = that.data.windowW;
          var windowH = that.data.windowH;

          canvas.drawImage('../icon/fang.png', 0, 0, windowW, windowW);
          canvas.drawImage(that.data.avatorShare, 15, 30, 50, 50);
          canvas.drawImage(that.data.imglist[0], leftW, 100, 220, 220);
          // canvas.setFontSize(50)
          canvas.font = "20px Georgia";
          // if(that.data.detail.type2NurseName){
          canvas.fillText(that.data.eveName, 70, 50)
          // }else if(that.data.detail.type1DoctorName){
          // canvas.fillText('医生：'+that.data.detail.type1DoctorName, 70, 50)
          // }
          canvas.font = "15px Georgia";
          canvas.fillText(app.globalData.hospitalName, 70, 70)
          canvas.draw(true, setTimeout(function () {
            console.log('n32')
            that.saveCanvas()

          }, 100));
        }
      })
    }





    // canvas.draw();
  },
  saveCanvas: function () {
    console.log('n4')
    var that = this;
    var windowW = that.data.windowW;
    var windowH = that.data.windowH;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: windowW,
      height: windowW,
      destWidth: windowW,
      destHeight: windowW,
      canvasId: 'canvas',
      success: function (res) {
        // that.setData({
        //   canvasShow:false
        // }).
        console.log(121212)
        console.log(340 + res.tempFilePath)
        that.setData({
          urls: res.tempFilePath
        })
      },
      fail: function (res) {
        console.log('fail=' + res)
      },
      error: function (res) {
        console.log('error=' + res)
      }
    })
  },
  lookCode: function () {
    var that = this;
    var canvas = wx.createCanvasContext('canvas');
    console.log('n2')
    that.canvasdraw(canvas);
    // that.setData({
    //   canvasShow:true
    // })
  },
  lookCodeShow() {
    var that = this
    if (that.data.imglist) {
      // that.setData({
      //   canvasShow:true
      // })
      // that.lookCode()
      if (that.data.detail.type2NurseName) {
        wx.navigateTo({
          url: '../canvasEve/canvasEve?img=' + that.data.imglist[0] + '&cover=' + that.data.testImg + '&name=' + that.data.hosDetail.name + '&eveName=护士：' + that.data.detail.type2NurseName,
        })
      } else if (that.data.detail.type1DoctorName) {
        wx.navigateTo({
          url: '../canvasEve/canvasEve?img=' + that.data.imglist[0] + '&cover=' + that.data.testImg + '&name=' + that.data.hosDetail.name + '&eveName=医生：' + that.data.detail.type1DoctorName,
        })
      }

    } else {
      wx.showToast({
        title: '维护中',
      })
    }
  },
  closeCanvas: function () {
    var that = this;
    that.setData({
      canvasShow: false
    })
  },
  saveIs: function () {
    var that = this
    console.log(that.data.urls)
    //生产环境时 记得这里要加入获取相册授权的代码
    wx.saveImageToPhotosAlbum({
      filePath: that.data.urls,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
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
          }
        })
      },
      fail: function (err) {

      }
    })
  },
})
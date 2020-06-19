
// pages/canvas/canvas.js
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    title:'12123123'
  },
 
  onLoad: function (options) {
    var that = this;
    that.sys();
    that.bginfo();
  },
  sys: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowW: res.windowWidth,
          windowH:res.windowWidth
        })
      },
    })
  },
  bginfo: function () {
    var that = this;
    that.setData({
      canvasimgbg: '../icon/fang.png'
    })
    // wx.downloadFile({
    //   url: '图片链接',//注意公众平台是否配置相应的域名
    //   success: function (res) {
    //     that.setData({
    //       canvasimgbg: res.tempFilePath
    //     })
 
    //   }
    // })
  },
  canvasdraw: function (canvas) {
    
    var that = this;
    var leftW=(that.data.windowW-175)/2
    var windowW = that.data.windowW;
    var windowH = that.data.windowH;
    var canvasimgbg = that.data.canvasimgbg;
    var canvasimg1 = that.data.chooseimg;
    canvas.drawImage(canvasimgbg, 0, 100, windowW, windowH);
    canvas.drawImage('../icon/Group2Copy@2x.png', 15, 30, 50, 50);
    canvas.drawImage('../icon/moren.png', leftW, 140, 175, 175);
    canvas.setFontSize(50)
    canvas.font="20px Georgia";
    canvas.fillText(that.data.title, 70, 50)
    canvas.font="15px Georgia";
    canvas.fillText(that.data.title, 70, 70)
    canvas.draw(true,setTimeout(function(){
      that.daochu()
    },1000));
    // canvas.draw();
  },
  daochu: function () {
    console.log('a');
    var that = this;
    var windowW = that.data.windowW;
    var windowH = that.data.windowH;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: windowW,
      height: windowH,
      destWidth: windowW,
      destHeight: windowH,
      canvasId: 'canvas',
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
          }
        })
        wx.previewImage({
          urls: [res.tempFilePath],
        })
      }
    })
  },
  chooseImage: function () {
    var that = this;
    var canvas = wx.createCanvasContext('canvas');
    that.canvasdraw(canvas);
  }
})
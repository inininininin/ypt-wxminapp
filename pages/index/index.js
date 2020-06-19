//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/util.js');
Page({
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    testImg: "../icon/Bitmap.png",
    imglist: [],
    hosDetail: '',
    departDetail: '',
    docList: [],
    bgUrl1: app.globalData.url + '/wxminapp-resource/1.png',
    bgUrl2: app.globalData.url + '/wxminapp-resource/2.png',
    bgUrl3: app.globalData.url + '/wxminapp-resource/3.png',
    canvasShow:false,
  },
  // 搜索跳转
  searchkey(e) {
    wx.navigateTo({
      url: '../searchPage/searchPage',
    })
  },
  // 查看二维码
  // lookCode(e) {
  //   // var current =  e.currentTarget.dataset.src;
  //   wx.previewImage({
  //     // current: current, // 当前显示图片的http链接
  //     urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
  //   })
  // },
  lookBigPic(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.src]
    })
  },
  scan(e) {
    wx.scanCode({
      success(res) {
        wx.reLaunch({
          url: '../index/index?hospitalid=1&hospitalname=忠安医院',
        })
        // if (res.path.slice(3, 4) == 'i') {
        //   wx.reLaunch({
        //     url: res.path,
        //   })
        // } else {
        //   wx.navigateTo({
        //     url: res.path,
        //   })
        // }

      }
    })
  },
  evaList(e) {
    wx.navigateTo({
      url: '../evaList/evaList?type=' + e.currentTarget.dataset.type + '&detail=' + JSON.stringify(this.data.depart),
    })
  },
  evadepart(e) {
    wx.navigateTo({
      url: '../evadepart/evadepart?detail=' + JSON.stringify(this.data.depart),
    })
  },
  panoramaVrUrl(e) {
    wx.navigateTo({
      url: '../webview/webview?href=' + encodeURIComponent(app.globalData.url + this.data.hosDetail.panoramaVrUrl),
    })
  },
  //事件处理函数
  bindViewTap: function () {

  },

  hosDetail() {
    var that = this
    // wx.showToast({
    //   title:  wx.getStorageSync('loginHospitalId'),
    // })
    wx.request({
      url: app.globalData.url + '/user/hospital',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'get',
      data: {
        hospitalId: wx.getStorageSync('loginHospitalId'), // app.globalData.loginHospitalId,
      },
      success: function (res) {
        if (res.data.code == 0) {
          app.globalData.hospitalName = res.data.data.name
          app.globalData.hospitaiDetail = res.data.data
          console.log(app.globalData.hospitaiDetail)

          var tag = []
          res.data.data.cover = app.cover(res.data.data.cover)
          if (res.data.data.tag) {
            for (var i in res.data.data.tag.split(',')) {
              tag.push(res.data.data.tag.split(',')[i])
            }
          }
          res.data.data.tag = tag
          that.setData({
            hosDetail: res.data.data,
            testImg: res.data.data.cover,
          })
          var param = encodeURIComponent('pages/index/index?hospitalid=' + app.globalData.hospitaiDetail.hospitalId + '&hospitalname=' + app.globalData.hospitaiDetail.name)
          wx.getImageInfo({
            src: app.globalData.url + '/wxminqrcode?path=' + param + '&width=2',
            method: 'get',
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            success: function (res) {
              var imglist = []
              imglist.push(res.path)
              that.setData({
                tcode: res.path,
                imglist: imglist,
              })
              // if(!that.data.avatorShare){
              //   that.lookCode()
              // }
            },
            fail(res) {
              console.log(res)
            }
          })
        } else {
          wx.showModal({
            content: '请先选择一个医院',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../hosList/hosList',
                })
              }
            }
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
        ps: 200,
        hosptialId: wx.getStorageSync('loginHospitalId')
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
        // else {
        //   wx.showToast({
        //     title: res.data.codeMsg,
        //     icon: 'none',
        //     duration: 2000,
        //     mask: true,
        //     complete: function complete(res) {
        //       setTimeout(function () {
        //         // wx.setStorageSync('codeType', that.data.type)
        //         wx.navigateTo({
        //           url: '../hosList/hosList',
        //         })
        //       }, 500);
        //     }
        //   });
        // }
      }
    })
  },
  docList() {
    var that = this
    wx.request({
      url: app.globalData.url + '/user/doctors',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'get',
      data: {
        hosptialId: wx.getStorageSync('loginHospitalId'),
        pn: 1,
        ps: 5,
      },
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data.rows) {
            for (var i in res.data.data.rows) {
              res.data.data.rows[i].cover = app.cover(res.data.data.rows[i].cover)
            }
          }
          that.setData({
            docList: res.data.data.rows
          })
        }
        // else if (res.data.code == 20) {
        //   wx.showToast({
        //     title: res.data.codeMsg,
        //     icon: 'none',
        //     duration: 2000,
        //     mask: true,
        //     complete: function complete(res) {
        //       setTimeout(function () {
        //         wx.setStorageSync('codeType', that.data.type)
        //         wx.navigateTo({
        //           url: '../login/login',
        //         })
        //       }, 500);
        //     }
        //   });
        // } 
        // else {
        //   wx.showToast({
        //     title: res.data.codeMsg,
        //     icon: 'none',
        //   })
        // }
      }
    })
  },
  onLoad: function (options) {   this.sys();},
  onShow: function (options) {
    this.setData({
      canvasShow:false
    })
    if (options && options.hospitalid) {
      wx.setStorageSync('loginHospitalId', options.hospitalid)
      wx.setStorageSync('loginHpitalName', options.hospitalname)
    }
    if (wx.getStorageSync('historyUrl') && wx.getStorageSync('fromTab') == 1) {
      wx.setStorageSync('fromTab', '')
      wx.reLaunch({
        url: wx.getStorageSync('historyUrl'),
      })
    } else {
      wx.navigateTo({
        url: wx.getStorageSync('historyUrl') + "?type=" + wx.getStorageSync('type') + "&id=" + wx.getStorageSync('id'),
      })
      wx.setStorageSync('historyUrl', '')
    }
    this.hosDetail();
    this.departDetail();
    this.docList();
   
    // console.log(app.globalData.hospitaiDetail)

  },
  onReady: function () {
    this.setData({
      allHidden: 'none'
    })
  },
  lookMoreDetail(e) {
    wx.navigateTo({
      url: '../hosIndex/hosIndex?detail=' + JSON.stringify(e.currentTarget.dataset.detail),
    })
  },
  doctor(e) {
    wx.navigateTo({
      url: '../doctor/doctor?id=' + e.currentTarget.dataset.id + '&type=1' + '&detail=' + JSON.stringify(e.currentTarget.dataset.detail),
    })
  },
  onPullDownRefresh: function () {
    // this.setData({
    //   hosDetail: '',
    //   departDetail: '',
    //   docList: [],
    // })
    this.hosDetail()
    this.departDetail()
    this.docList()
    wx.stopPullDownRefresh()
  },
  // 分享
  onShareAppMessage: function (res) {
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

  },
  // canvas绘图部分
  sys: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowW: res.windowWidth,
          windowH:res.windowHeight,
          windowTop:(res.windowHeight-res.windowWidth)/2
        })
      },
    })
  },
  // bginfo: function () {
  //   var that = this;
  //   console.log( that.data.avator)
  //   wx.downloadFile({
  //     url: that.data.avator,//注意公众平台是否配置相应的域名
  //     success: function (res) {
  //       console.log( res)
  //       that.setData({
  //         avatorShare: res.tempFilePath
  //       })
        
  //     }
  //   })
  // },
  canvasdraw: function (canvas) {
    var that = this;
   
    console.log(that.data.testImg)
    that.setData({
      canvasShow:true
    })
    wx.downloadFile({
      url: that.data.testImg,//注意公众平台是否配置相应的域名
      success: function (res) {
        console.log( res.tempFilePath)
        that.setData({
          avatorShare: res.tempFilePath
        })
        var leftW=(that.data.windowW-220)/2
        var windowW = that.data.windowW;
        var windowH = that.data.windowH;
        console.log(windowW,windowH)
        canvas.drawImage('../icon/fang.png', 0, 0, windowW, windowW);
        canvas.drawImage(that.data.avatorShare||'../icon/Bitmap.png', 15, 30, 50, 50);
        canvas.drawImage(that.data.imglist[0], leftW, 100, 220, 220);
        // canvas.setFontSize(50)
        canvas.font="20px Georgia";
        // if(that.data.detail.type2NurseName){
        //   canvas.fillText('护士：'+that.data.detail.type1DoctorName, 70, 50)
        // }else if(that.data.detail.type1DoctorName){
          canvas.fillText(that.data.hosDetail.name, 70, 50)
        // }
        // canvas.font="15px Georgia";
        // canvas.fillText( app.globalData.hospitalName, 70, 70)
        canvas.draw(true,setTimeout(function(){
          
          that.saveCanvas()
         
          // setTimeout(function(){
            
          // },200)
        },100));
      }
    })
   
    console.log(that.data.avatorShare,that.data.imglist[0])
  
   
   
    // canvas.draw();
  },
  saveCanvas: function () {
    console.log('a');
  
    var that = this;
   
    var windowW = that.data.windowW;
    var windowH = that.data.windowH;
    console.log(windowW,windowH);
    that.setData({
      canvasShow:true
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: windowW,
      height: windowW,
      destWidth: windowW,
      destHeight: windowW,
      canvasId: 'canvas',
      success: function (res) {
        console.log(res.tempFilePath)
       
        that.setData({
          urls:res.tempFilePath
        })
      },
      error:function(res){
        console.log(res)
      },
      fail:function(res){
        console.log(res)
      }
    })
  },
  lookCode: function () {
    var that = this;
    var canvas = wx.createCanvasContext('canvas');
    that.canvasdraw(canvas);
    // that.setData({
    //   canvasShow:true
    // })
  },
  lookCodeShow(){
    var that=this
    if(that.data.imglist){
        that.setData({
          canvasShow:true
        })
        that.lookCode()
    }else{
      wx.showToast({
        title: '维护中',
      })
    }
    // console.log(112121)
    // console.log(that.data.urls)
    // wx.previewImage({
    //   urls: [that.data.urls],
    // })
    // that.saveCanvas()
  },
  closeCanvas: function () {
    var that = this;
    that.setData({
      canvasShow:false
    })
  },
  saveIs: function() {
    var that = this
    //生产环境时 记得这里要加入获取相册授权的代码
    wx.saveImageToPhotosAlbum({
      filePath: that.data.urls,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({
                hidden: true
              })
            }
          }
        })
      }
    })
  },
})
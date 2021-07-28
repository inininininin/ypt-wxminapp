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
    showIsTcode: false,
    names: '',
    phone: '',
    name: '',
    avator: '../icon/moren.png',
    tcode: '',
    detail:'',
    imglist: [],
    version: '',
    bgUrl: app.globalData.url + '/ypt/wxminapp-resource/bj.jpg',
    withoutLogin: true,
    canvasShow:false
  },
  version(e){
    wx.showModal({
      title: 'ver: '+app.version,
      content: app.versionIntro ? app.versionIntro : "",
      showCancel: false,
      cancelText: "取消111",
      cancelColor: "#000",
      confirmText: "确定",
      confirmColor: "#0f0",
      success: function (res) {
        if (res.confirm) {
        }
      }
    })
  },
  taskList(e){
    wx.navigateTo({
      url: '../taskList/taskList',
    })
  },
  toLogin(e) {
    var backUrl = '../mine/mine';
    wx.redirectTo({
      url: '../login/login?fromType=1&backUrl=' + backUrl,
    })
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
      showIsTcode: false
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
      url: app.globalData.url + '/ypt/user/alter-my-info',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'post',
      data: {
        name: that.data.name,
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '操作成功',
            icon: 'none'
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
            icon: 'none'
          })
        }
      }
    })
  },
  loginout(e) {
 
    var that = this
    wx.showModal({
      title: '退出',
         content: '确定要退出登录？',
        //  showCancel: true,//是否显示取消按钮
        //  cancelText:"否",//默认是“取消”
        //  cancelColor:'skyblue',//取消文字的颜色
        //  confirmText:"是",//默认是“确定”
        //  confirmColor: 'skyblue',//确定文字的颜色
         success: function (res) {
            if (res.cancel) {
               //点击取消,默认隐藏弹框
            } else {
               //点击确定
               
               wx.request({
                 url: app.globalData.url + '/ypt/user/logout',
                 header: {
                   "Content-Type": "application/x-www-form-urlencoded",
                   'cookie': wx.getStorageSync('cookie')
                 },
                 method: 'post',
                 data: {
                   name: that.data.name,
                 },
                 success: function (res) {
                   if (res.data.code == 0) {
                     wx.setStorageSync('cookie', '')
                           app.globalData.userInfo = '' //null
                           app.globalData.userInfoDetail = []
                           wx.setStorageSync('withoutLogin', true)
                           that.setData({
                             names: '',
                             phone: '',
                             avator: '../icon/moren.png',
                             withoutLogin: true,
                           })
                           var backUrl = '../mine/mine';
                           wx.redirectTo({
                             url: '../logs/logs?fromType=1&backUrl=' + backUrl,
                           })
                   } else {
                     wx.showToast({
                       title: res.data.codeMsg,
                       icon: 'none'
                     })
                   }
                 }
               })
            }
         },
         fail: function (res) { }, 
         complete: function (res) { },
    })
    
  },
  avator() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        var avatar = res.tempFilePaths[0]
        wx.uploadFile({
          url: app.globalData.url + '/ypt/upload-static-file?cover&duration', //仅为示例，非真实的接口地址
          filePath: avatar,
          method: 'post',
          name: 'file',
          success: function (res) {
            var data = JSON.parse(res.data);
            var url = data.data.url
            if (data.code == 0) {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
              wx.request({
                url: app.globalData.url + '/ypt/user/alter-my-info', //仅为示例，非真实的接口地址
                method: 'post',
                data: {
                  cover: url,
                },
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  'cookie': wx.getStorageSync('cookie')
                },
                success: function (res) {
                  that.setData({
                    avator: app.globalData.url + url
                  })
                  // that.lookCode()
                  
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
  // 查看二维码
  // lookCode(e) {
  //   var current = e.currentTarget.dataset.src;
  //   wx.previewImage({
  //     current: current, // 当前显示图片的http链接
  //     urls: this.data.imglist // 需要预览的图片http链接列表
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.sys();
    // that.bginfo();
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
  canvasdraw: function (canvas) {
    var that = this;
    that.setData({
      canvasShow:true
    })
    console.log('n3')
    if(that.data.avator=='../icon/moren.png'){
      that.setData({
        avatorShare: that.data.avator
      })
      var leftW=(that.data.windowW-200)/2
      var windowW = that.data.windowW;
      var windowH = that.data.windowH;

      canvas.drawImage('../icon/fang.png', 0, 0, windowW, windowW);
      canvas.drawImage(that.data.avatorShare, 15, 30, 50, 50);
      canvas.drawImage(that.data.imglist[0], leftW, 100, 200, 200);
      // canvas.setFontSize(50)
      canvas.font="20px Georgia";
      if(that.data.detail.type2NurseName){
        canvas.fillText('护士：'+that.data.detail.type2NurseName, 70, 50)
      }else if(that.data.detail.type1DoctorName){
        canvas.fillText('医生：'+that.data.detail.type1DoctorName, 70, 50)
      }
      console.log(that.data.detail.type1DoctorName)
      canvas.font="15px Georgia";
      canvas.fillText( app.globalData.hospitalName, 70, 70)
      canvas.draw(true,setTimeout(function(){
        console.log('n31')
        that.saveCanvas()
        
      },100));
     
    }else{
   
      wx.downloadFile({
        url: that.data.avator,//注意公众平台是否配置相应的域名
        success: function (res) {
          that.setData({
            avatorShare: res.tempFilePath
          })
          var leftW=(that.data.windowW-220)/2
          var windowW = that.data.windowW;
          var windowH = that.data.windowH;
  
          canvas.drawImage('../icon/fang.png', 0, 0, windowW, windowW);
          canvas.drawImage(that.data.avatorShare, 15, 30, 50, 50);
          canvas.drawImage(that.data.imglist[0], leftW, 100, 220, 220);
          // canvas.setFontSize(50)
          canvas.font="20px Georgia";
          if(that.data.detail.type2NurseName){
            canvas.fillText('护士：'+that.data.detail.type2NurseName, 70, 50)
          }else if(that.data.detail.type1DoctorName){
            canvas.fillText('医生：'+that.data.detail.type1DoctorName, 70, 50)
          }
          canvas.font="15px Georgia";
          canvas.fillText( app.globalData.hospitalName, 70, 70)
          canvas.draw(true,setTimeout(function(){
            console.log('n32')
            that.saveCanvas()
  
          },100));
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
        console.log(340+res.tempFilePath)
        that.setData({
          urls:res.tempFilePath
        })
      },
      fail:function(res){
        console.log('fail='+res)
      },
      error:function(res){
        console.log('error='+res)
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
  lookCodeShow(){
    var that=this
    if(that.data.imglist){
        // that.setData({
        //   canvasShow:true
        // })
        // that.lookCode()
        console.log(that.data.imglist[0],that.data.avator)
        if(that.data.detail.type2NurseName){
          wx.navigateTo({
            url: '../canvasEve/canvasEve?img='+that.data.imglist[0]+'&avator='+that.data.avator+'&name='+app.globalData.hospitalName+'&eveName=护士：'+that.data.detail.type2NurseName,
          })
        }else if(that.data.detail.type1DoctorName){
          wx.navigateTo({
            url: '../canvasEve/canvasEve?img='+that.data.imglist[0]+'&avator='+that.data.avator+'&name='+app.globalData.hospitalName+'&eveName=医生：'+that.data.detail.type1DoctorName,
          })
        }
      
    }else{
      wx.showToast({
        title: '维护中',
      })
    }
  },
  closeCanvas: function () {
    var that = this;
    that.setData({
      canvasShow:false
    })
  },
  saveIs: function() {
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
          success: function(res) {
            if (res.confirm) {
              that.setData({
                hidden: true
              })
            }
          }
        })
      },
      fail:function(err){
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  refresh(){
    var that =this
    wx.request({
      url: app.globalData.url + '/ypt/user/login-refresh',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'post',
      success: function (res) {
        // wx.hideToast()
        if (res.data.code == 0) {
          
          wx.setStorageSync('withoutLogin', false)
          app.globalData.userInfoDetail = res.data.data
          if (app.globalData.userInfoDetail.cover == '' || app.globalData.userInfoDetail.cover == null || app.globalData.userInfoDetail.cover == undefined) {
            var avator = '../icon/moren.png'
          } else {
            var avator = app.globalData.url + app.globalData.userInfoDetail.cover
          }
          that.setData({
            typeUser: app.globalData.userInfoDetail.type,
            names: app.globalData.userInfoDetail.name,
            name: app.globalData.userInfoDetail.name,
            phone: app.globalData.userInfoDetail.phone,
            avator: avator,
            withoutLogin: false,
            detail:res.data.data
          })
          // Share
          var param = encodeURIComponent('pages/evaNowShare/evaNowShare?type=' + app.globalData.userInfoDetail.type + '&isfrom=1&id=' + (app.globalData.userInfoDetail.type1DoctorId || app.globalData.userInfoDetail.type2NurseId)+'&hospitalid='+(wx.getStorageSync('loginHospitalId')||''))
          wx.getImageInfo({
            src: app.globalData.url + '/ypt/wxminqrcode?path=' + param + '&width=200',
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
          // wx.showToast({
          //   title: res.data.codeMsg,
          //   icon: 'loading'
          // })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // var that = this
    this.setData({
      canvasShow:false
    })
    this.setData({
      version: app.version,//.split('-')[0],
      entityTel: app.globalData.entity.entityTel,
    })
    this.refresh()
    // var param=encodeURIComponent('../evaNow/evaNow?type='+app.globalData.userInfoDetail.type+'&id=' + (app.globalData.userInfoDetail.type1DoctorId||app.globalData.userInfoDetail.type2NurseId)+'&name=' + (app.globalData.userInfoDetail.type1DoctorName||app.globalData.userInfoDetail.type2NurseName)+'&hospitalid=' + app.globalData.userInfoDetail.hospitalId +'&hospitalname=' + app.globalData.userInfoDetail.hospitalName   )
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
    this.refresh()
    wx.stopPullDownRefresh({})
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
  }
})
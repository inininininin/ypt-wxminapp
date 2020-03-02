// pages/evaNow/evaNow.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    navtitle: '',
    showIs1: 'active',
    showIs2: 'active',
    showIs3: 'active',
    length: 0,
    title1: '',
    title2: '',
    title3: '请上传挂号发票或诊治单',
    hidden: false,
    star: '',
    imglist: [],
    imgBlob: '',
    star:'',
    content:''
    // imglist: ["https://zaylt.njshangka.com/oss/20200115142958749245942194005171.jpg", "https://zaylt.njshangka.com/oss/20200115143015774507902254216329.jpg", "https://zaylt.njshangka.com/oss/20200224110306310510637790292661.png"],
  },
  select(e) {
    if (e.currentTarget.dataset.select == 1) {
      this.setData({
        showIs1: '',
        showIs2: 'active',
        showIs3: 'active',
        select: e.currentTarget.dataset.select,
        star: 3,
      })
    } else if (e.currentTarget.dataset.select == 2) {
      this.setData({
        showIs1: 'active',
        showIs2: '',
        showIs3: 'active',
        select: e.currentTarget.dataset.select,
        star: 2
      })
    } else {
      {
        this.setData({
          showIs1: 'active',
          showIs2: 'active',
          showIs3: '',
          select: e.currentTarget.dataset.select,
          star: 1
        })
      }
    }
  },
  textarea(e) {
    this.setData({
      length: e.detail.value.length,
      content: e.detail.value,
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.imglist // 需要预览的图片http链接列表
    })
  },
  addPic: function (e) {
    var that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        var picBlob = that.data.picBlob
        for (var i in tempFilePaths) {

          wx.uploadFile({
            url: app.globalData.url + '/upload-static-file?cover&duration', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            success: function (res) {
              var data = JSON.parse(res.data);
              var url = data.data.url
              var imglist = that.data.imglist
              if (data.code == 0) {
                
                if (that.data.imgBlob == '') {
                  var imgBlob = url
                } else {
                  var imgBlob = that.data.imgBlob + ',' + url
                }
                imglist.push(app.globalData.url + url)
                that.setData({
                  imglist: imglist,
                  imgBlob: imgBlob
                })

              }
            },
            fail: function (res) {
              console.log(res)
              wx.showToast({
                  title: res,
                  icon: 'success',
                  duration: 2000
                })
            }
          })
        }
      }
    })
  },
  deletThis(e) {
    var img = [],
      imgBlob = ''
    var src = e.target.dataset.src
    var pic = this.data.imglist
    for (var i in pic) {
      if (src == pic[i]) {
        // img = this.data.imgBlob[i] + ','
      } else {
        img.push(pic[i])
        imgBlob = imgBlob + ',' + pic[i].split('com')[1]
      }
      this.setData({
        imglist: img,
        imgBlob: imgBlob.substring(1, imgBlob.length)
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.hospitalid!=''&&options.hospitalid!=undefined&&options.hospitalid!=null){
      wx.setStorageSync('loginHospitalId', options.hospitalid)
      wx.setStorageSync('loginHpitalName', options.hospitalname)
    }
    var that = this
    wx.setStorageSync('type', options.type)
    wx.setStorageSync('id', options.id)
    if (wx.getStorageSync('type') == 1) {
      wx.request({
        url: app.globalData.url + '/doctor',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'cookie': wx.getStorageSync('cookie')
        },
        data: {
          doctorId: wx.getStorageSync('id') ,
        },
        method: 'get',
        success: function (res) {
          if (res.data.code == 0) {
            wx.setStorageSync('loginHospitalId', res.data.data.hospitalId)
      wx.setStorageSync('loginHpitalName', res.data.data.hospitalName)
            that.setData({
              url: '/user/doctor-comment',
              type: options.type,
              id: res.data.data.doctorId,
              navtitle: res.data.data.name,
              title1: '您对本次就医医生诊断体验：',
              title2: '请填写您对该医生的评价：',
            })
          }
        }
      });
    } else if (wx.getStorageSync('type')  == 2) {
      wx.request({
        url: app.globalData.url + '/nurse',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'cookie': wx.getStorageSync('cookie')
        },
        data: {
          nurseId: wx.getStorageSync('id'),
        },
        method: 'get',
        success: function (res) {
          if (res.data.code == 0) {
            // app.globalData.loginHospitalId = res.data.data.hospitalId
            // app.globalData.loginHpitalName = res.data.data.hospitalName
            wx.setStorageSync('loginHospitalId', res.data.data.hospitalId)
            wx.setStorageSync('loginHpitalName', res.data.data.hospitalName)
            that.setData({
              url: '/user/nurse-comment',
              type: options.type,
              id: res.data.data.nurseId,
              navtitle: res.data.data.name,
              title1: '您对本次就医医护人员服务体验：',
              title2: '请填写您对该医护人员的评价：',
            })
          }
        }
      });
    } else {
      that.setData({
        url: '/user/hospital-comment',
        type: wx.getStorageSync('type'),
        id: wx.getStorageSync('id'),
        navtitle: options.name,
        title1: '您本次就医体验：',
        title2: '请填写您对该医院的具体评价及建议：',
      })
    }

  },
  evaNow(e) {
    wx.showToast({
      title: '操作中',
      icon: 'loading'
    })
    var that = this
    if (that.data.type == 1) {
      var params = '?doctorId=' + that.data.id
    } else if (that.data.type == 2) {
      var params = '?nurseId=' + that.data.id
    } else {
      var params = ''
    }
    if (that.data.star == '' || that.data.content == '') {
      wx.showToast({
        title: '请填写完整',
      })
    } else {
      wx.request({
        url: app.globalData.url + that.data.url + params,
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'cookie': wx.getStorageSync('cookie')
        },
        data: {
          star: that.data.star,
          content: that.data.content,
          cover: that.data.imgBlob
        },
        method: 'post',
        success: function (res) {
          if (res.data.codeMsg) {
            wx.showModal({
              showCancel: false,
              title: res.data.codeMsg
            })
          }
          if (res.data.code == 0) {
            wx.hideToast({
              complete: (res) => {},
            })
            that.setData({
              hidden: true
            })
          } else {
            wx.showModal({
              showCancel: false,
              title: res.data.codeMsg
            })
          }
        }
      });
    }

  },
  back(e) {
    wx.navigateBack({
      delta: 1
    })
  },
  detail(e) {
    wx.navigateTo({
      url: '../evalutionList/evalutionList?type=' + this.data.type,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    wx.request({
      url: app.globalData.url + '/user/login-refresh',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {

        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'none',
            duration: 2000,
            mask: true,
            complete: function complete(res) {
              setTimeout(function () {
                wx.navigateTo({
                  url: '../login/login?type=1',
                })
              }, 500);
            }
          });
        }
      }
    })
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
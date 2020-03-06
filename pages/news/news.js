// pages/news/news.js
var app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    navtitle: '全部消息',
    schemeList: [],
    showIs: false,
    newDate: '',
    newVal: '',
    showNone: true,
    withoutLogin: ''
  },
  close() {
    this.setData({
      showIs: false
    })
  },
  toLogin(e) {
    var backUrl = '../news/news';
    wx.navigateTo({
      url: '../logs/logs?fromType=1&backUrl=' + backUrl,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(111111)
    this.lastPage(0)
  },
  lookAll(e) {
    var that = this
    wx.request({
      url: app.globalData.url + '/user/look-all-my-message',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          for (var i in that.data.schemeList) {
            that.data.schemeList[i].looked = 1
          }
          that.setData({
            schemeList: that.data.schemeList
          })
        } else {
          wx.showModal({
            showCancel: false,
            title: res.data.codeMsg
          })
        }
      }
    });
  },
  look(e) {
    var that = this
    wx.request({
      url: app.globalData.url + '/user/my-message',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        userMessageId: e.currentTarget.dataset.id,
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          for (var i in that.data.schemeList) {
            if (e.currentTarget.dataset.id == that.data.schemeList[i].userMessageId) {
              that.data.schemeList[i].looked = 1
            }
          }
          that.setData({
            schemeList: that.data.schemeList,
            showIs: true,
            newDate: e.currentTarget.dataset.newdate,
            newVal: e.currentTarget.dataset.newval,
          })
        } else {
          wx.showModal({
            showCancel: false,
            title: res.data.codeMsg
          })
        }
      }
    });
  },
  lastPage: function (toPageNo) {
    var that = this
    toPageNo++
    wx.request({
      url: app.globalData.url + '/user/my-messages',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        pn: toPageNo,
        ps: 15,
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          var addTime
          for (var i = 0; i < res.data.data.rows.length; i++) {
            addTime = res.data.data.rows[i].createTime
            res.data.data.rows[i].addTime = utils.formatTime(addTime / 1000, 'Y-M-D h:m');
          }
          if(toPageNo==1){
            wx.setStorageSync('userMessageId', res.data.data.rows[0].userMessageId)
            var schemeListArr = [];
          }else{
            var schemeListArr = that.data.schemeList;
          }
          var schemeListArr = that.data.schemeList;
          console.log(that.data.schemeList)
          var newSchemeListArr = schemeListArr.concat(res.data.data.rows)
          if (res.data.data.rows.length == 0) {
            that.setData({
              schemeList: newSchemeListArr,
            });
            if (toPageNo == 1) {
              that.setData({
                showNone: true
              })
            } else {
              wx.showToast({
                title: '数据已全部加载',
                // icon: 'none',
                // duration: 1500
              })
            }
          } else {
            that.setData({
              schemeList: newSchemeListArr,
              toPageNo: String(toPageNo),
              showNone: false
            });
          }
        }
        // else {
        //   wx.showModal({
        //     showCancel: false,
        //     title: res.data.codeMsg
        //   })
        // }
      }
    });
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
    console.log(123123)
    var that = this
    wx.request({
      url: app.globalData.url + '/user/my-messages',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        pn: 1,
        ps: 15,
      },
      method: 'get',
      success: function (res) {
        if (res.data.code == 0) {
          if (wx.getStorageSync('userMessageId') != res.data.data.rows[0].userMessageId) {
            that.setData({
              schemeList: [],
            })
            wx.setStorageSync('userMessageId', res.data.data.rows[0].userMessageId)
            that.lastPage(0)
          }
        }
      }
    });
    if (wx.getStorageSync('withoutLogin') === true || wx.getStorageSync('withoutLogin') === "") {
      this.setData({
        withoutLogin: true
      })
    } else {
      // var that = this
      // that.setData({
      //   schemeList: [],
      // })
      // console.log(that.data.schemeList)

      // that.lastPage(0)
      this.setData({
        withoutLogin: false
      })
    }
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
  // newPage(){
  //   var that=this
  //   wx.request({
  //     url: app.globalData.url + '/user/my-messages',
  //     header: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //       'cookie': wx.getStorageSync('cookie')
  //     },
  //     data: {
  //       pn: 1,
  //       ps: 15,
  //     },
  //     method: 'get',
  //     success: function (res) {
  //       if (res.data.code == 0) {
  //         var addTime
  //         for (var i = 0; i < res.data.data.rows.length; i++) {
  //           addTime = res.data.data.rows[i].createTime
  //           res.data.data.rows[i].addTime = utils.formatTime(addTime / 1000, 'Y-M-D h:m');
  //         }
  //         var schemeListArr = that.data.schemeList;
  //         console.log(that.data.schemeList)
  //         var newSchemeListArr = schemeListArr.concat(res.data.data.rows)
  //         if (res.data.data.rows.length == 0) {
  //           that.setData({
  //             schemeList: newSchemeListArr,
  //           });
  //           if (toPageNo == 1) {
  //             wx.setStorageSync('userMessageId', res.data.data.rows[0].userMessageId)
  //             that.setData({
  //               showNone:true
  //             })
  //           } else {
  //             wx.showToast({
  //               title: '数据已全部加载',
  //               // icon: 'none',
  //               // duration: 1500
  //             })
  //           }
  //         } else {
  //           that.setData({
  //             schemeList: newSchemeListArr,
  //             toPageNo: String(toPageNo),
  //             showNone:false
  //           });
  //         }
  //       } 
  //     }
  //   });
  // },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    // that.setData({
    //   schemeList: [],
    // })
    // that.lastPage(0)
    wx.request({
      url: app.globalData.url + '/user/my-messages',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        pn: 1,
        ps: 15,
      },
      method: 'get',
      success: function (res) {
        if (res.data.code == 0) {
          console.log(wx.getStorageSync('userMessageId'))
          console.log(res.data.data.rows[0].userMessageId)
          if (wx.getStorageSync('userMessageId') != res.data.data.rows[0].userMessageId) {
            wx.setStorageSync('userMessageId', res.data.data.rows[0].userMessageId)
            that.setData({
              schemeList: [],
            })
            that.lastPage(0)
          }
        }
      }
    });
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    var toPageNo = that.data.toPageNo
    that.lastPage(toPageNo)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
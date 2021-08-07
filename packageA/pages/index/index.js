// packageA/pages/index/index.js
const app = getApp()
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
    title: "每日打卡",
    imgUrl: app.globalData.dkUrl,
    patientDetail: {},
    chunkNo: null,
    answerList: [],
    doMyself: true,
    addressList: {},
    address: '',
    topicList: [],
    disabled: false,
    showMaintainIs:false,
    loading:true,
    exception:'默认'
  },
  showMaintainIs(){
    wx.navigateTo({
      url: '../list/list',
    })
  },
  showImg(e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  bindTextBlur(e) {
    // this.data.answerList
    let answerVal = e.detail.value
    console.log(answerVal)
    let topicList = this.data.patientDetail.doChunks[0].doTopics
    for (var r in topicList) {
      if (e.currentTarget.dataset.tno == topicList[r].doTopicNo) {
        topicList[r].elseanswer = answerVal
        topicList[r].do = 1
        console.log(topicList[r].elseanswer)
      }
    }
    this.setData({
      patientDetail: this.data.patientDetail
    })
    console.log(this.data.patientDetail)
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    let answerVal = e.detail.value
    let topicList = this.data.patientDetail.doChunks[0].doTopics
    for (var r in topicList) {
      if (e.currentTarget.dataset.tno == topicList[r].doTopicNo) {
        let doAnswers = topicList[r].doAnswers
        topicList[r].do = 1
        for (var m in doAnswers) {
          if (answerVal == doAnswers[m].doAnswerNo) {
            doAnswers[m].selected = 1
          } else {
            doAnswers[m].selected = 0
          }
        }
      }
    }
    this.setData({
      patientDetail: this.data.patientDetail
    })
    console.log(this.data.patientDetail)
  },
  checkboxChange(e) {
    // console.log('checkbox发生change事件，携带value值为：', e, e.detail.value)
    let answerVal = e.detail.value
    let topicList = this.data.patientDetail.doChunks[0].doTopics
    for (var r in topicList) {
      if (e.currentTarget.dataset.tno == topicList[r].doTopicNo) {
        let doAnswers = topicList[r].doAnswers
        let ansArr = 0
        for (var m in doAnswers) {
          if (answerVal.includes(doAnswers[m].doAnswerNo)) {
            doAnswers[m].selected = 1
            ansArr = ansArr + 1
          } else {
            doAnswers[m].selected = 0
          }
        }
        if (ansArr > 0) {
          topicList[r].do = 1
        } else {
          topicList[r].do = 0
        }
      }
    }
    this.setData({
      patientDetail: this.data.patientDetail
    })
    // console.log(this.data.patientDetail.doChunks[0].doTopics)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
            if (res.data.code == 0) {
              // console.log(res.header['Set-Cookie'])
              // console.log(res.header['Set-Cookie'].split('HttpOnly,')[0].split(';')[0],res.header['Set-Cookie'].split('HttpOnly,')[1].split(';')[0])
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
                  console.log(latitude, longitude, speed, accuracy, app.globalData.dkUrl + '/vfc-clockin/baidu/map/reverse-geocoding')
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
                      if (res.data.code == 0) {
                        console.log(res.data.data)
                        let result = res.data.data.result
                        let address = result.addressComponent.street
                        let addressList = {}
                        addressList.areaL1Name = result.addressComponent.province
                        addressList.areaL2Name = result.addressComponent.city
                        addressList.areaL3Name = result.addressComponent.district
                        addressList.areaL1No = result.addressComponent.adcode.slice(0, 2)
                        addressList.areaL2No = result.addressComponent.adcode.slice(0, 4)
                        addressList.areaL3No = result.addressComponent.adcode.slice(0, 6)
                        addressList.address = result.addressComponent.street
                          that.setData({
                            addressList: addressList,
                            address: address,
                          })
                          wx.request({
                            url: app.globalData.dkUrl + '/vfc-clockin/login-refresh',
                            header: {
                              "Content-Type": "application/x-www-form-urlencoded",
                              'cookie': wx.getStorageSync('dkcookie')
                            },
                            method: 'post',
                            success: function (res) {
                              if (res.data.code == 0) {
                                
                                app.globalData.dkUserInfoDetail=res.data.data
                                if(res.data.data.maintainIs==1){
                                  that.setData({
                                    showMaintainIs:true
                                  })
                                }
                                if (res.data.data.phone == '' || res.data.data.phone == undefined || res.data.data.phone == null || res.data.data.realname == '' || res.data.data.realname == null || res.data.data.realname == undefined) {
                                  wx.navigateTo({
                                    url: '../login/login',
                                  })
                                  // wx.showModal({
                                  //   title: `提示`,
                                  //   content: `您当前尚未填写手机号或姓名，请前往填写`,
                                  //   showCancel: false,
                                  //   confirmText: "确定",
                                  //   confirmColor: "#0f0",
                                  //   success: function (res) {
                                  //     if (res.confirm) {
                                  //       console.log('用户点击确定')
                                  //       wx.navigateTo({
                                  //         url: '../login/login',
                                  //       })
                                  //     }
                                  //   }
                                  // })
                                }
            
                                that.clockin()
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
                  });
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
  // /clockin
  clockin() {
    let that = this
    wx.request({
      url: app.globalData.dkUrl + '/vfc-clockin/clockin',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('dkcookie')
      },
      data: {
        questionnaireNo: 11111111111,
        areaL1No: that.data.addressList.areaL1No,
        areaL1Name: that.data.addressList.areaL1Name,
        areaL2No: that.data.addressList.areaL2No,
        areaL2Name: that.data.addressList.areaL2Name,
        areaL3No: that.data.addressList.areaL3No,
        areaL3Name: that.data.addressList.areaL3Name,
        address: that.data.addressList.address,
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
          // wx.showToast({
          //   title: '打卡成功',
          //   icon: 'none'
          // })
          that.setData({
            doNo: res.data.data.doNo
          })
          that.topicRow()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  topicRow() {
    let that = this
    wx.request({
      url: app.globalData.dkUrl + '/vfc-clockin/questionnaire/row',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('dkcookie')
      },
      data: {
        doNo: that.data.doNo,
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data.row.commit == 1) {
            let nowDate = Date.parse(new Date())
            let commitTime = Date.parse(res.data.data.row.commitTime)
            console.log(nowDate, commitTime)
            let Difference = nowDate - commitTime
            console.log(Difference)
            let maxDifference = 10 * 60 * 1000
            if (Difference >= maxDifference) {
              that.setData({
                disabled: true
              })
            } else {
              that.setData({
                disabled: false
              })
            }
          }
          that.setData({
            commit:res.data.data.row.commit,
            exception:res.data.data.row.exception
          })
          console.log(res.data.data.row.doChunks[0].doTopics)
          for (var i in res.data.data.row.doChunks[0].doTopics) {
            let doTopics = res.data.data.row.doChunks[0].doTopics[i]
            res.data.data.row.doChunks[0].doTopics[i].do = 0
            if (doTopics.type == 3) {
              if (doTopics.elseanswer == '' || doTopics.elseanswer == null || doTopics.elseanswer == undefined) {
                res.data.data.row.doChunks[0].doTopics[i].do = 0
              } else {
                res.data.data.row.doChunks[0].doTopics[i].do = 1
              }
            } else if (doTopics.type == 1) {
              let doAnswers = doTopics.doAnswers
              for (var r in doAnswers) {
                if (doAnswers[r].selected == 1) {
                  res.data.data.row.doChunks[0].doTopics[i].do = 1
                }
              }
            } else if (doTopics.type == 2) {
              let doAnswers = doTopics.doAnswers
              let ansArr = 0
              for (var r in doAnswers) {
                if (doAnswers[r].selected == 1) {
                  ansArr++
                }
              }
              if (ansArr > 0) {
                res.data.data.row.doChunks[0].doTopics[i].do = 1
              }
            }


          }
          that.setData({
            topicList: res.data.data.row.doChunks[0].doTopics,
            patientDetail: res.data.data.row
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  // 提交答案
  supply() {
    let that = this
    let doChunks = that.data.patientDetail.doChunks
    let doTopics = doChunks[0].doTopics
    console.log(doTopics)
    for (var i in doTopics) {
      if (doTopics[i].must) {
        if (doTopics[i].do == 0) {
          wx.showToast({
            title: `第${Number(i)+1}题尚未填写，请填写完整`,
            icon: 'none'
          })
          return
        }
      }
    }


    setTimeout(() => {
      for (var i in doTopics) {
        if (doTopics[i].type == 3) {
          console.log(3)
          that.doTopic(doTopics[i].doTopicNo, doTopics[i].elseanswer, '')
        } else if (doTopics[i].type == 1) {
          console.log(1)
          for (var m in doTopics[i].doAnswers) {

            if (doTopics[i].doAnswers[m].selected == 1) {
              that.doTopic(doTopics[i].doTopicNo, '', doTopics[i].doAnswers[m].doAnswerNo)
            } else {
              that.undoTopic(doTopics[i].doTopicNo, doTopics[i].doAnswers[m].doAnswerNo)
            }

          }
          if (doTopics[i].elseanswer) {
            that.doTopic(doTopics[i].doTopicNo, doTopics[i].elseanswer, '')
          }

        } else if (doTopics[i].type == 2) {
          console.log(2)
          for (var m in doTopics[i].doAnswers) {
            if (doTopics[i].doAnswers[m].selected == 1) {
              that.doTopic(doTopics[i].doTopicNo, '', doTopics[i].doAnswers[m].doAnswerNo)
            } else {
              that.undoTopic(doTopics[i].doTopicNo, doTopics[i].doAnswers[m].doAnswerNo)
            }
          }
          if (doTopics[i].elseanswer) {
            that.doTopic(doTopics[i].doTopicNo, doTopics[i].elseanswer, '')
          }
        }
      }
    }, 500)
  },

  // 医生做题目
  // /do-topic
  doTopic(doTopicNo, elseanswer, doAnswerNo) {
    var that = this

    wx.request({
      url: app.globalData.dkUrl + '/vfc-clockin/questionnaire/do-topic',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('dkcookie')
      },
      data: {
        doNo: that.data.doNo,
        doTopicNo: doTopicNo || "",
        elseanswer: elseanswer || "",
        doAnswerNo: doAnswerNo || "",
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
          // wx.showToast({
          //   title: '提交成功',
          //   icon: "none",
          //   success: function (res) {

          //   }
          // })
          let doTopics = that.data.patientDetail.doChunks[0].doTopics
          let len = doTopics.length
          if (doTopicNo === doTopics[doTopics.length - 1].doTopicNo) {
            that.commit()
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    });
  },
  //  取消题目
  undoTopic(doTopicNo, doAnswerNo) {
    var that = this
    wx.request({
      url: app.globalData.dkUrl + '/vfc-clockin/questionnaire/undo-selected-answer',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('dkcookie')
      },
      data: {
        doNo: that.data.doNo,
        doTopicNo: doTopicNo,
        doAnswerNo: doAnswerNo,
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
          // wx.showToast({
          //   title: '提交成功',
          //   icon: "none",
          //   success: function (res) {
          //     console.log(2112121)
          //   }
          // })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    });
  },
  //  提交题目
  commit() {
    var that = this
    wx.request({
      url: app.globalData.dkUrl + '/vfc-clockin/questionnaire/commit',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('dkcookie')
      },
      data: {
        doNo: that.data.doNo,
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '提交成功',
            icon: "none",
            success: function (res) {
              wx.request({
                url: app.globalData.dkUrl + '/vfc-clockin/questionnaire/row',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  'cookie': wx.getStorageSync('dkcookie')
                },
                data: {
                  doNo: that.data.doNo,
                },
                method: 'post',
                success: function (res) {
                  if (res.data.code == 0) {
                    that.setData({
                      commit:res.data.data.row.commit,
                      exception:res.data.data.row.exception
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
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    });
  },

})
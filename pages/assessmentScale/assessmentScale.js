// pages/assessmentScale/assessmentScale.js
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.url,
    items: [{
        value: '',
        name: ''
      },
      {
        value: '',
        name: '',
        checked: ''
      },
      {
        value: '',
        name: ''
      }
    ],
    patientDetail: {},
    chunkNo: null,
    answerList: [],
    doMyself: true,
    dis: true,
    isMine: false,
    mydoNo: '',
    type: null,
    maintainIs:null,
    maintainIsShow:false,
    opinion:''
  },
  newOwnTopic() {
    this.myQue()
  },
  suggestRefuse(){
    this.setData({
      maintainIsShow:false
    })
  },
  opinion(e){
    this.setData({
      opinion:e.detail.value
    })
  },
  maintainIs() {
    let that=this
    this.setData({
      maintainIsShow:true
    })
  },
  suggestSure(){
    let that=this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire-do/expert-do-opinion',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        doNo:  that.data.options.doNo,
        opinion: that.data.opinion
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
          console.log(that.data.patientDetail)
          that.data.patientDetail.expertOpinion= that.data.opinion
          that.setData({
            opinion:'',
            patientDetail:that.data.patientDetail,
            maintainIsShow:false
          })
          wx.showToast({
            title: '提交成功',
            icon: "none"
          })
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'none'
          })
        }
      }
    });
  },
  bindTextBlur(e) {
    // this.data.answerList
    let answerVal = e.detail.value
    let topicList = []
    for (var i in this.data.patientDetail.doChunks) {
      if (this.data.patientDetail.doChunks[i].doChunkNo == this.data.chunkNo) {
        topicList = this.data.patientDetail.doChunks[i].doTopics
        for (var r in topicList) {
          if (e.currentTarget.dataset.tno == topicList[r].doTopicNo) {
            topicList[r].elseanswer = answerVal
            console.log(topicList[r].elseanswer)
          }
        }
      }
    }
    this.setData({
      patientDetail: this.data.patientDetail
    })

  },
  // bindTextAreaBlur(e){
  //   // this.data.answerList
  //   let answerVal=e.detail.value
  //   let topicList=[]
  //   for(var i in this.data.patientDetail.doChunks){
  //     if(this.data.patientDetail.doChunks[i].doChunkNo==this.data.chunkNo){
  //       topicList=this.data.patientDetail.doChunks[i].doTopics
  //       for(var r in topicList){
  //         if(e.currentTarget.dataset.tno==topicList[r].doTopicNo){
  //           topicList[r].elseanswer=answerVal
  //         }
  //       }
  //     }
  //   }
  //   this.setData({
  //     patientDetail:this.data.patientDetail
  //   })
  // },
  modifyPersonal() {
    wx.navigateTo({
      url: '../addPatient/addPatient?type=modify&doNo=' + this.data.options.doNo,
    })
  },
  showImg(e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    let answerVal = e.detail.value
    let topicList = []
    for (var i in this.data.patientDetail.doChunks) {
      if (this.data.patientDetail.doChunks[i].doChunkNo == this.data.chunkNo) {
        topicList = this.data.patientDetail.doChunks[i].doTopics
        for (var r in topicList) {
          if (e.currentTarget.dataset.tno == topicList[r].doTopicNo) {
            let doAnswers = topicList[r].doAnswers
            for (var m in doAnswers) {
              if (answerVal == doAnswers[m].doAnswerNo) {
                doAnswers[m].selected = 1
              } else {
                doAnswers[m].selected = 0
              }
            }
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
    console.log('checkbox发生change事件，携带value值为：', e, e.detail.value)
    let answerVal = e.detail.value
    let topicList = []
    for (var i in this.data.patientDetail.doChunks) {
      if (this.data.patientDetail.doChunks[i].doChunkNo == this.data.chunkNo) {
        topicList = this.data.patientDetail.doChunks[i].doTopics
        for (var r in topicList) {
          if (e.currentTarget.dataset.tno == topicList[r].doTopicNo) {
            let doAnswers = topicList[r].doAnswers
            for (var m in doAnswers) {
              if (answerVal.includes(doAnswers[m].doAnswerNo)) {
                // if(answerVal==doAnswers[m].doAnswerNo){
                doAnswers[m].selected = 1
              } else {
                doAnswers[m].selected = 0
              }
            }
          }
        }
      }
    }
    this.setData({
      patientDetail: this.data.patientDetail
    })
    console.log(this.data.patientDetail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    that.setData({
      maintainIs:app.globalData.userInfoDetail.maintainIs
    })
    wx.request({
      url: app.globalData.url + '/oss/alive/user-protocol.html',
      success: function (res) {
        var article = res.data
        WxParse.wxParse('article', 'html', article, that, 5);
      }
    })
    if (options && options.dis) {
      that.setData({
        dis: options.dis
      })
    }
    that.setData({
      options: options
    })
    that.wxLogin()
    // this.patientRow()
  },
  selectChunk(e) {
    let chunkNo = ''

    for (var i in this.data.patientDetail.doChunks) {
      if (this.data.patientDetail.doChunks[i].doChunkNo == e.currentTarget.dataset.no) {
        this.data.patientDetail.doChunks[i].active = 'active'
        chunkNo = this.data.patientDetail.doChunks[i].doChunkNo
      } else {
        this.data.patientDetail.doChunks[i].active = ''
      }
    }
    this.setData({
      patientDetail: this.data.patientDetail,
      chunkNo: chunkNo
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
    console.log(this.data.patientDetail)
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
    this.patientRow()
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
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    // var path = 'pages/assessmentScaleShare/assessmentScaleShare?no=' + this.data.options.no + "&loginHospitalId=" + wx.getStorageSync('loginHospitalId') + '&doNo=' + this.data.options.doNo + '&fromUserId=' + app.globalData.userInfoDetail.userId
    // var path = 'pages/out/articleDetail/articleDetail?id=' + this.data.id+"&ids=1"
    var path = 'pages/assessmentScale/assessmentScale?no=' + this.data.options.no + "&loginHospitalId=" + wx.getStorageSync('loginHospitalId') + '&doNo=' + this.data.options.doNo + '&fromUserId=' + app.globalData.userInfoDetail.userId + "&dis=true"

    let realname = this.data.patientDetail.realname
    if (realname.length > 1) {
      realname = realname.slice(0, realname.length - 1) + '*'
    }
    console.log(realname)
    return {
      title:   realname+'的问卷' + `(${app.globalData.userInfoDetail.hospitalName})`, //分享内容
      path: path, //分享地址
      imageUrl: app.globalData.url + '/ypt/wxminapp-resource/questionnaire-logo1.png', //分享图片
      success: function (res) {},
      fail: function (res) {}
    }

  },
  // showImg(e){
  //   console.log(e)
  //   wx.previewImage({
  //     current: e.currentTarget.dataset.src, // 当前显示图片的http链接
  //     urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
  //   })
  // },
  patientRow() {
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire-do/row',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        doNo: that.data.options.doNo
      },
      method: 'post',
      success: function (res) {

        if (res.data.code == 0) {
          console.log(that.data.dis)
          console.log(111)
          // console.log()
          console.log('123='+res.data.data.row.userId, '456='+app.globalData.userInfoDetail.userId)
          if (res.data.data.row.userId == app.globalData.userInfoDetail.userId) {
            that.setData({
              dis: false,
              isMine: true
            })
          } else {
            if (that.data.type == 1) {
              that.setData({
                dis: false,
                isMine: false
              })
            } else {
              that.setData({
                dis: true,
                isMine: false
              })
            }

          }
          console.log(that.data.dis)
          let chunkNo = ''
          for (var i in res.data.data.row.doChunks) {
            if (i == 0) {
              res.data.data.row.doChunks[i].active = 'active'
              chunkNo = res.data.data.row.doChunks[i].doChunkNo
            } else {
              res.data.data.row.doChunks[i].active = ''
            }
            for (var r in res.data.data.row.doChunks[i].doTopics) {
              that.answerRows(res.data.data.row.doChunks[i].doTopics[r].doTopicNo)
            }
          }
          that.setData({
            patientDetail: res.data.data.row,
            chunkNo: chunkNo
          })
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'none'
          })
        }
      }
    });
  },
  answerRows(topicNo) {
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire/answer-rows',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        topicNo: topicNo,
        rstart: 1,
        rcount: 100
      },
      method: 'post',
      success: function (res) {

        if (res.data.code == 0) {
          for (var r in that.data.topicRows) {
            if (that.data.topicRows[r].no == topicNo) {
              that.data.topicRows[r].rows = res.data.data.rows
              console.log(that.data.topicRows[r].rows)
            }
          }
          that.setData({
            topicRows: that.data.topicRows
          })
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'none'
          })
        }
      }
    });
  },
  // 医生做题目
  // /do-topic
  doTopic(doTopicNo, elseanswer, doAnswerNo) {
    var that = this

    wx.request({
      url: app.globalData.url + '/ypt/questionnaire-do/do-topic',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        doNo: that.data.options.doNo,
        doTopicNo: doTopicNo || "",
        elseanswer: elseanswer || "",
        doAnswerNo: doAnswerNo || "",
      },
      method: 'post',
      success: function (res) {

        if (res.data.code == 0) {
          let doTopics = []
          for (var i in that.data.patientDetail.doChunks) {
            if (that.data.patientDetail.doChunks[i].doChunkNo == that.data.chunkNo) {
              doTopics = that.data.patientDetail.doChunks[i].doTopics
              for (var r in doTopics) {
                if (doTopicNo == doTopics[r].doTopicNo) {
                  wx.showToast({
                    title: '提交成功',
                    icon: "none",
                    success: function (res) {

                    }
                  })
                }
              }
            }


          }


        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'none'
          })
        }
      }
    });
  },
  // 提交答案
  supply() {
    setTimeout(() => {
      console.log(this.data.patientDetail)
      let doChunks = this.data.patientDetail.doChunks
      let that = this
      let doTopics = []
      for (var i in doChunks) {
        if (doChunks[i].doChunkNo == that.data.chunkNo) {
          doTopics = doChunks[i].doTopics
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
          // wx.redirectTo({
          //   url: '../assessmentScaleShare/assessmentScaleShare?no='+that.data.options.no+'&doNo='+that.data.options.doNo,
          // })
          if (that.data.options.share == 2) {
            wx.navigateBack()
          } else {
            // wx.showToast({
            //   title: '修改已完成',
            //   icon:'none'
            // })
          }
        }
      }
    }, 500)



  },
  // /undo-selected-answer
  undoTopic(doTopicNo, doAnswerNo) {
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire-do/undo-selected-answer',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        doNo: that.data.options.doNo,
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
            title: res.data.codeMsg,
            icon: 'none'
          })
        }
      }
    });
  },
  wxLogin() {
    let that = this
    wx.login({
      success(res) {
        var code = res.code
        wx.request({
          url: app.globalData.url + '/ypt/user/login-by-wxminapp-jscode',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: 'post',
          data: {
            wsJsCode: code,
            loginHospitalId: wx.getStorageSync('loginHospitalId'),
          },
          success: function (res) {

            if (res.data.code == 0) {
              console.log('wxLogin')
              wx.setStorageSync('cookie', res.header['Set-Cookie'])
              wx.request({
                url: app.globalData.url + '/ypt/user/login-refresh',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  'cookie': wx.getStorageSync('cookie')
                },
                method: 'post',
                success: function (res) {

                  if (res.data.code == 0) {
                    if (!res.data.data.phone) {
                      that.setData({
                        showIs: true
                      })
                    }
                    if (res.data.data.hospitalOperation == 1) {
                      that.setData({
                        dis: false,
                        type: res.data.data.hospitalOperation
                      })
                    }
                    that.myQue()
                    that.patientRow()
                    app.globalData.userInfoDetail = res.data.data
                    wx.setStorageSync('loginHospitalId', res.data.data.hospitalId)
                    wx.setStorageSync('loginHpitalName', res.data.data.hospitalName)
                    wx.setStorageSync('codeType', that.data.type)
                    wx.setStorageSync('withoutLogin', false)

                  } else {
                    wx.showToast({
                      title: res.data.codeMsg,
                      icon: 'none'
                    })
                  }
                }
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
    })
  },
  myQue() {
    let that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire-do/get-my-questionnaire-do',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        questionnaireNo: that.data.options.no,
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data.doNo != '' && res.data.data.doNo != null && res.data.data.doNo != undefined) {
            that.setData({
              funBtn: true,
              mydoNo: res.data.data.doNo
            })

          } else {
            that.setData({
              funBtn: false
            })

          }
          console.log(that.data.dis)
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'none'
          })
        }
      }
    });
  },
  newOwnTopic() {
    wx.navigateTo({
      url: '../addPatientMine/addPatientMine?no=' + this.data.options.no + "&type=myself",
    })
  },
  goOwnTopic() {
    wx.navigateTo({
      url: '../assessmentScale/assessmentScale?no=' + this.data.options.no + '&doNo=' + this.data.mydoNo,
    })
  },
  getPhoneNumber(e) {
    let that = this
    wx.login({
      success(res) {
        var code = res.code
        wx.request({
          url: app.globalData.url + '/ypt/user/bind-phone',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            'cookie': wx.getStorageSync('cookie')
          },
          method: 'post',
          data: {
            wsJsCode: code,
            // loginHospitalId: wx.getStorageSync('loginHospitalId'),
            wxMinappencryptedDataOfPhoneNumber: e.detail.encryptedData || '',
            wxMinappIv: e.detail.iv || '',
          },
          success: function (res) {
            wx.hideToast()
            if (res.data.code == 0) {

              // wx.setStorageSync('cookie', res.header['Set-Cookie'])
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
                    wx.showToast({
                      title: '绑定成功',
                      icon: 'none',
                      duration: 2000,
                      mask: true,
                      complete: function (res) {
                        setTimeout(function () {
                          that.data.patientDetail.phone = app.globalData.userInfoDetail.phone
                          // wx.redirectTo({
                          //   url: '../assessmentScaleShare/assessmentScaleShare?no=' + that.data.options.no + "&loginHospitalId=" + wx.getStorageSync('loginHospitalId') + "&doNo=" + that.data.options.doNo
                          // })
                          wx.redirectTo({
                            url: '../assessmentScale/assessmentScale?no=' + that.data.options.no + "&loginHospitalId=" + wx.getStorageSync('loginHospitalId') + "&doNo=" + that.data.options.doNo+"&dis=true"
                          })
                          
                          that.setData({
                            showIs: false,
                            patientDetail: that.data.patientDetail
                          })
                        }, 500);
                      }
                    });

                  } else {
                    wx.showToast({
                      title: res.data.codeMsg,
                      icon: 'none'
                    })
                  }
                }
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
    })
  }
})
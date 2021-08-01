// pages/assessmentScale/assessmentScale.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.url,
    items: [{
        value: 'USA',
        name: '酸胀痛酸胀痛酸胀痛酸胀痛酸胀痛酸胀痛酸胀痛酸胀痛酸胀痛'
      },
      {
        value: 'CHN',
        name: '绞痛',
        checked: 'true'
      },
      {
        value: 'BRA',
        name: '针刺痛'
      }
    ],
    patientDetail: {},
    chunkNo: null,
    answerList: [],
    doMyself: true
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
              }else{
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
    this.setData({
      options: options
    })
    this.patientRow()
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

  },
  showImg(e){
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
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
        wx.hideToast()
        if (res.data.code == 0) {
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
          wx.showModal({
            showCancel: false,
            title: res.data.codeMsg
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
        wx.hideToast()
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
          wx.showModal({
            showCancel: false,
            title: res.data.codeMsg
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
      url: app.globalData.url +  '/ypt/questionnaire/do-topic',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        doNo: that.data.options.doNo,
        doTopicNo: doTopicNo,
        elseanswer: elseanswer,
        doAnswerNo: doAnswerNo,
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          wx.showToast({
            title: '提交成功',
            icon: "none",
            success: function (res) {
              console.log(2112121)
            }
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
  // 提交答案
  supply() {
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
                that.doTopic(doTopics[i].doTopicNo,'', doTopics[i].doAnswers[m].doAnswerNo)
              }else{
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
              }else{
                that.undoTopic(doTopics[i].doTopicNo, doTopics[i].doAnswers[m].doAnswerNo)
              }
            }
            if (doTopics[i].elseanswer) {
              that.doTopic(doTopics[i].doTopicNo, doTopics[i].elseanswer, '')
            }
          }
        }
      }
    }
    console.log(doTopics)
   

  },
  // /undo-selected-answer
  undoTopic(doTopicNo, doAnswerNo) {
    var that = this
    wx.request({
      url: app.globalData.url + '/undo-selected-answer',
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
        wx.hideToast()
        if (res.data.code == 0) {
          wx.showToast({
            title: '提交成功',
            icon: "none",
            success: function (res) {
              console.log(2112121)
            }
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
})
// pages/assessmentScaleShare/assessmentScaleShare.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginPhone:null,
    imgUrl:app.globalData.url,
    questionnaireNo:null,
    chunkList:[],
    options:{},
    patientDetail:{},
    topicRows:[],
    chunkNo:null,
    funBtn:false
  },
  showImg(e){
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  selectChunk(e){
    let chunkNo=''
    for(var i in this.data.patientDetail.doChunks){
      if(this.data.patientDetail.doChunks[i].doChunkNo==e.currentTarget.dataset.no){
        this.data.patientDetail.doChunks[i].active='active'
        chunkNo=this.data.patientDetail.doChunks[i].doChunkNo
      }else{
        this.data.patientDetail.doChunks[i].active=''
      }
    }
    this.setData({
      patientDetail:this.data.patientDetail,
      chunkNo:chunkNo
    })
  },
  patientRow(){
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire-do/row',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
        doNo:that.data.options.doNo
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          let chunkNo=''
          if(res.data.data.row.phone==that.data.loginPhone){
            that.setData({
              funBtn:true
            })
          }
          for(var i in res.data.data.row.doChunks){
            if(i==0){
              res.data.data.row.doChunks[i].active='active'
              chunkNo=res.data.data.row.doChunks[i].doChunkNo
            }else{
              res.data.data.row.doChunks[i].active=''
            }
            
          }
          that.setData({
            patientDetail:res.data.data.row,
            chunkNo:chunkNo
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
  chunkRows(e) {
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire/chunk-rows',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
        questionnaireNo:that.data.options.no
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          for(var i in res.data.data.rows){
            if(i==0){
              res.data.data.rows[i].active='active'
            }else{
              res.data.data.rows[i].active=''
            }
            
          }
          that.setData({
            chunkList: res.data.data.rows,
            chunkNo:res.data.data.rows[0].no
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
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if(wx.getStorageSync('no')){
      options.no=wx.getStorageSync('no')
    }
    if(wx.getStorageSync('doNo')){
      options.doNo=wx.getStorageSync('doNo')
    }
    if(options.loginHospitalId){
      wx.setStorageSync('loginHospitalId', options.loginHospitalId)
    }
    this.setData({
      options:options
    })
    this.patientRow()
    // this.chunkRows()
    // this.topicRows()
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
    // this.loginRefresh()
    var that=this
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
          wx.setStorageSync('withoutLogin', false)
          if(res.data.data.type==1){
            that.setData({
              funBtn:true,
              loginPhone:res.data.data.phone
            })
          }
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'none',
            duration: 2000,
            mask: true,
            complete: function complete(res) {
              setTimeout(function () {
                wx.setStorageSync('historyUrl', app.historyUrl() )
                wx.setStorageSync('no', that.data.options.no)
                wx.setStorageSync('doNo', that.data.options.doNo)
                wx.navigateTo({
                  url: '../login/login?fromType=2&backUrl=../assessmentScaleShare/assessmentScaleShare',
                })
              }, 500);
            }
          });
        }
      }
    })
  },
  loginRefresh(){
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
      // wx.showToast({
      //   title: '登录成功',
      //   icon: 'none',
      //   duration: 2000,
      //   mask: true,
      //   complete: function complete(res) {
      //     setTimeout(function () {            
      //       wx.setStorageSync('historyUrl', that.data.backUrl)              
      //       if (that.data.fromType == 1) {
      //         wx.setStorageSync('fromTab', 1)
      //         wx.switchTab({
      //           url: '../index/index',
      //         })
      //       } else {
      //         wx.switchTab({
      //           url: '../index/index',
      //         })
      //       }
      //     }, 500);
      //   }
      // });

    } else {
      wx.showToast({
        title: res.data.codeMsg,
        icon: 'none'
      })
    }
  }
})
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  topicRows(){
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire/topic-rows',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
        chunkNo:that.data.chunkNo,
        rstart:1,
        rcount:50
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
         
          for(var i in res.data.data.rows){
            that.answerRows(res.data.data.rows[i].no)
            console.log(res.data.data.rows[i].img.slice(0,1))
            if(res.data.data.rows[i].img&&res.data.data.rows[i].img.slice(0,1)!='h'){
              res.data.data.rows[i].img=app.globalData.url+res.data.data.rows[i].img
            }
          }
          that.data.topicRows=that.data.topicRows.concat(res.data.data.rows)
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
  answerRows(topicNo){
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire/answer-rows',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
        topicNo:topicNo,
        rstart:1,
        rcount:100
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          for(var r in that.data.topicRows){
            if(that.data.topicRows[r].no==topicNo){
              that.data.topicRows[r].rows=res.data.data.rows
            }
          }
          that.setData({
            topicRows: that.data.topicRows
          })
          console.log(topicRows)
        } else {
          wx.showModal({
            showCancel: false,
            title: res.data.codeMsg
          })
        }
      }
    });
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
  onShareAppMessage: function (res) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
   
    if (app.globalData.lastClient == 1) {
      var path = 'pages/out/articleDetail/articleDetail?id=' + this.data.id + "&ids=1"
    } else {
      var path = 'pages/out/articleDetail/articleDetail?id=' + this.data.id + "&ids=2"
    }
    // url: '../assessmentScaleShare/assessmentScaleShare?no='+this.data.list[0].no+'&doNo='+e.currentTarget.dataset.id,
    var path = 'pages/assessmentScaleShare/assessmentScaleShare?no=' + this.data.list[0].no + "&loginHospitalId="+wx.getStorageSync('loginHospitalId')
    // var path = 'pages/out/articleDetail/articleDetail?id=' + this.data.id+"&ids=1"
    return {
      title: this.data.list.title, //分享内容
      path: path, //分享地址
      imageUrl: this.data.list.cover, //分享图片
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },
  edit(){
    wx.navigateTo({
      url: '../assessmentScale/assessmentScale?no='+this.data.options.no+'&doNo='+this.data.options.doNo,
    })
  },
  newOwnTopic(){
    wx.navigateTo({
      url: '../addPatient/addPatient?no='+this.data.options.no+"&type=myself",
    })
  },
})
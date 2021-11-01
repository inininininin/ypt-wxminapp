// pages/pacie/pacie.js
const app=getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imglist:[],
    tcode:'',
    formIs:true,
    list:[],
    patientList:[],
    formImg:app.globalData.url+'/ypt/wxminapp-resource/questionnaire-logo.png',
    showIs:false
  },
  deleteThis(e){
    let that=this
    let doNo=e.currentTarget.dataset.id
    let realname=e.currentTarget.dataset.realname
    that.setData({
      doNo:doNo,
      realname:realname
    })
    wx.showModal({
      title: `将删除用户 "${that.data.realname}" , 请确认`,
      content: '',
      editable:true,
      placeholderText:'请输入 "删除" 以确认',
      success (res) {
        // if(res.content){

        // }
        if (res.confirm) {
          if(res.content=='删除'){
wx.request({
            url: app.globalData.url + '/ypt/questionnaire-do/delete',
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              'cookie': wx.getStorageSync('cookie')
            },
            data:{
              doNo:that.data.doNo,
              realname:that.data.realname
            },
            method: 'post',
            success: function (res) {
              // wx.hideToast()
              
              if (res.data.code == 0) {
                for(var i in that.data.patientList){
                  if(that.data.patientList[i].doNo==that.data.doNo){
                    that.data.patientList.splice(i,1)
                    wx.showToast({
                      title: '删除成功',
                      icon:"none"
                    })
                  }
                }
                that.setData({
                  patientList: that.data.patientList
                })
              } else {
                wx.showToast({
                  title: res.data.codeMsg,
                  icon:'none'
                })
              }
            }
          });
          }else{
            wx.showToast({
              title: '请输入"删除"两字，才能进行用户删除',
              icon:'none'
            })
          }
         
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
    
  },  
  // 去新建表单
  goNew(){
    wx.navigateTo({
      url: '../painForm/painForm',
    })
  },
  lookForm(e){
    // wx.navigateTo({
    //   url: '../assessmentScaleShare/assessmentScaleShare?no='+this.data.list[0].no+'&doNo='+e.currentTarget.dataset.id+"&share=2",
    // })
    wx.navigateTo({
      url: '../assessmentScale/assessmentScale?no='+this.data.list[0].no+'&doNo='+e.currentTarget.dataset.id+"&share=2&dis=true",
    })
  },
  // 新增病人
  addNew(e){
    wx.navigateTo({
      url: '../addPatient/addPatient?no='+this.data.list[0].no+"&hospitalId="+this.data.options.id,
    })
  },
  painForm(e){
    // hospitalMaintainIs
    if(app.globalData.userInfoDetail.maintainIs!=1){
      return
    }
    wx.navigateTo({
      url: '../painForm/painForm?no='+e.currentTarget.dataset.no,
    })
  },
  questionnaireRows(e) {
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire/questionnaire-rows',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          if(res.data.data.rows&&res.data.data.rows.length>0){
            that.setData({
              formIs:false
            })
          }else{
            that.setData({
              formIs:true
            })
          }
          that.setData({
            list: res.data.data.rows
          })
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon:'none'
          })
        }
      }
    });
  },
  patientRows() {
    if(!app.globalData.userInfoDetail.maintainIs&&app.globalData.userInfoDetail.hospitalOperation!=1){
      return
    }
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire-do/rows-in-all-hospitals',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
        hospitalId:that.data.options.id
        // hospitalId:wx.getStorageSync('loginHospitalIdMaintain')
        // questionnaireNo:this.data.list[0].no
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          // if(res.data.data.rows&&res.data.data.rows.length>0){
          //   that.setData({
          //     formIs:false
          //   })
          // }else{
          //   that.setData({
          //     formIs:true
          //   })
          // }
          // that.data.patientList=that.data.patientList.concat(res.data.data.rows)
          for(var i in res.data.data.rows){
            res.data.data.rows[i].createTime = utils.formatTime( res.data.data.rows[i].createTime / 1000, 'Y-M-D h:m');
          }
          that.setData({
            patientList: that.data.patientList.concat(res.data.data.rows)
          })
          console.log(that.data.patientList)
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon:'none'
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    if(app.globalData.userInfoDetail.maintainIs==1||app.globalData.userInfoDetail.hospitalOperation==1){
      that.setData({
        showIs:true
      })
    }
    wx.setNavigationBarTitle({
      title: options.name,
    })
    that.setData({
      options:options
    })
    console.log(options)
    var param = encodeURIComponent('pages/index/index?hospitalid=' + options.id + '&hospitalname=' + options.name)
    wx.getImageInfo({
      src: app.globalData.url + '/ypt/wxminqrcode?path=' + param + '&width=2',
      method: 'get',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        var imglist = []
        imglist.push(res.path)
        console.log(res.path)
        that.setData({
          tcode: res.path,
          imglist: imglist,
        })
      },
      fail(res) {
        console.log(res)
      }
    })
    that.questionnaireRows()
    that.patientRows()
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
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    console.log('分享页'+this.data.list[0].no+'==='+this.data.options.id,this.data.options.name)
    var path = 'pages/addPatientMine/addPatientMine?no=' + this.data.list[0].no + "&loginHospitalId="+this.data.options.id+"&type=myself"+'&fromUserId='+app.globalData.userInfoDetail.userId
    return {
      title: this.data.options.name+`(${app.globalData.userInfoDetail.realname})`, //分享内容
      path: path, //分享地址
      imageUrl: app.globalData.url+'/ypt/wxminapp-resource/questionnaire-logo1.png', //分享图片
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },
  maintainIs() {
    var that = this
    if (that.data.imglist) {
      // that.setData({
      //   canvasShow:true
      // })
      // that.lookCode()
      console.log(that.data.options.name, that.data.imglist[0])
      let cover=''
      if(that.data.options.cover){
        cover=app.globalData.url+that.data.options.cover
      }else{
        cover=''
      }
      if(that.data.imglist[0]&&that.data.options.name){
        wx.navigateTo({
          url: '../canvasHos/canvasHos?img=' + that.data.imglist[0] + '&cover=' + cover + '&name=' + that.data.options.name+"&id="+that.data.options.id,
        })
      }else{
        wx.showToast({
          title: '二维码生成中,请稍后重试',
          icon:'none'
        })
      }
     
    } else {
      wx.showToast({
        title: '维护中',
        icon:'none'
      })
    }
    // console.log(112121)
    // console.log(that.data.urls)
    // wx.previewImage({
    //   urls: [that.data.urls],
    // })
    // that.saveCanvas()
  }
})
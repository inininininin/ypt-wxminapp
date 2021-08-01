// pages/pacie/pacie.js
const app=getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formIs:true,
    list:[],
    patientList:[],
    formImg:app.globalData.url+'/ypt/wxminapp-resource/questionnaire-logo.png'
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
                wx.showModal({
                  showCancel: false,
                  title: res.data.codeMsg
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
    wx.navigateTo({
      url: '../assessmentScaleShare/assessmentScaleShare?no='+this.data.list[0].no+'&doNo='+e.currentTarget.dataset.id,
    })
  },
  // 新增病人
  addNew(e){
    wx.navigateTo({
      url: '../addPatient/addPatient?no='+this.data.list[0].no,//+"&patientId="+id,
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
          wx.showModal({
            showCancel: false,
            title: res.data.codeMsg
          })
        }
      }
    });
  },
  patientRows(e) {
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire-do/rows',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
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
    console.log(options)
    this.questionnaireRows()
    this.patientRows()
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

  }
})
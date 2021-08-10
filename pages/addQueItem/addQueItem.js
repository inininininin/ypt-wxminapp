// pages/addQueItem/addQueItem.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrayOption:['下一题'],
    indexOption:0,
    activeIcon:false,
    show:true,
    queList:[{name:'单选题',type:1,selectThis:false},{name:'多选题',type:2,selectThis:false},{name:'填空题',type:3,selectThis:false}],
    answerList:[],
    selectActive:false,
    active:'',
    selectThis:true,
    queType:null,
    queTypeName:null,
    que:{
      chunkNo:null,
      name:null,
      type:null,
      elseanswerIs:null,
      img:null
    },
    topicRows:[]
  },
  bindPickerClick(e){
    this.setData({
      activeIcon:'activeIcon'
    })
  },
  bindcancel(e){
    this.setData({
      activeIcon:false
    })
  },
  bindPickerChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      indexOption: e.detail.value,
      activeIcon:false
    })
  },
  addAnswer(){
    console.log(this.data.answerList)
    this.data.answerList.push({name:null})
    this.setData({
      answerList:this.data.answerList
    })
  },
  addPhoto(){
      var that = this
      console.log(1)
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
              that.data.que.img=data.data.url
              that.setData({
                que:that.data.que,
                img:data.data.url,
                imgShow:app.globalData.url+data.data.url,
              })
              console.log(that.data.que.img)
              if (data.code == 0) {
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 2000
                })
                // wx.request({
                //   url: app.globalData.url + '/ypt/user/alter-my-info', //仅为示例，非真实的接口地址
                //   method: 'post',
                //   data: {
                //     cover: url,
                //   },
                //   header: {
                //     "Content-Type": "application/x-www-form-urlencoded",
                //     'cookie': wx.getStorageSync('cookie')
                //   },
                //   success: function (res) {
                //     that.setData({
                //       avator: app.globalData.url + url
                //     })
                //     // that.lookCode()
                    
                //   }
                // })
              }
            },
            fail: function (res) {
              console.log(res)
            }
          })
        }
      })
  },
  queName(e){
    this.data.que.name=e.detail.value
    this.setData({
      que:this.data.que
    })
  },
  switchChange: function (e) {
    console.log(e.detail.value)
    this.data.que.elseanswerIs=e.detail.value
    this.setData({
      que:this.data.que
    })
  },
  // 点击下拉显示框
  selectTaps() {
    this.setData({
      selectActive: !this.data.selectActive,
      active:this.data.selectActive==false?'active':''
    });
  },
  selectThis(e){
    let queTypeName=null,queType=null;
    for(var i in this.data.queList){
      if(e.currentTarget.dataset.type==this.data.queList[i].type){
        this.data.queList[i].selectThis=true
        queTypeName=this.data.queList[i].name
        queType=this.data.queList[i].type
      }else{
        this.data.queList[i].selectThis=false
      }
    }
    console.log(queType,queTypeName)
    this.data.que.type = queType
    
    this.setData({
      queList:this.data.queList,
      active:!this.data.active,
      queTypeName:queTypeName,
      queType:queType,
      que:this.data.que
    })
    console.log(e.currentTarget.dataset.type)
  },
  inputItem(e){
    console.log(e.currentTarget.dataset,e.detail.value)
    for(var i in this.data.answerList){
      console.log(e.currentTarget.dataset.key)
      if(e.currentTarget.dataset.key==i){
        console.log(i)
        this.data.answerList[i].name=e.detail.value
      }
    }
    this.setData({
      answerList:this.data.answerList
    })
    console.log(this.data.answerList)
    
  },
  addTopic(){
    var that = this
    // if(that.data.indexOption)
    let orderNum=''
    if(that.data.indexOption==0){
      orderNum=''
    }else{
      orderNum=(that.data.topicRows[that.data.indexOption-1].orderNum+that.data.topicRows[that.data.indexOption].orderNum)/2
    }
   
// console.log(orderNum,orderNum/2)
    // return
    if(!that.data.que.name){
      wx.showToast({
        title: '请添写题目',
        icon:'none'
      })
      return
    }
    if(that.data.que.type!=3){
      if(that.data.answerList&&that.data.answerList.length==0){
        wx.showToast({
          title: '请添加答案',
          icon:'none'
        })
        return
      }
    }
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire/create-topic',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
        chunkNo:that.data.que.chunkNo||'',
        name:that.data.que.name||'',
        type:that.data.que.type||'',
        elseanswerIs:that.data.que.elseanswerIs?1:0,
        img:that.data.que.img||'',
        orderNum:orderNum
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          let no=res.data.data.no
          if(that.data.que.type!=3){
            if(that.data.answerList&&that.data.answerList.length==0){
              wx.showToast({
                title: '请添加答案',
                icon:'none'
              })
              return
            }
            for(var i in that.data.answerList){
              that.addAnswerEve(no,that.data.answerList[i].name,i)
            }
            return
          }
          // for(var i in that.data.answerList){
          //   that.addAnswerEve(no,that.data.answerList[i].name,i)
          // }
          wx.navigateBack()
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon:'none'
          })
        }
      }
    });
  },
  addAnswerEve(no,name,index){
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire/create-answer',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
        topicNo:no,
        name:name,
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          console.log(index,that.data.answerList.length)
          if(index==that.data.answerList.length-1){
            wx.navigateBack()
          }
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
    console.log(options)
    this.data.que.chunkNo=options.no
    this.topicRows()
    let arrayOption=this.data.arrayOption
    for(var i =0;i<options.quelength;i++){
      console.log(options.quelength,i)
      arrayOption.push(Number(i)+1)
    }
    this.setData({
      que:this.data.que,
      options:options,
      arrayOption:arrayOption
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
        chunkNo:that.data.que.chunkNo,
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          let topicRows=[{orderNum:0}]
          that.setData({
            topicRows:topicRows.concat(res.data.data.rows)// that.data.topicRows
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
})
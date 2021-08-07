// pages/addQueItem/addQueItem.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrayOption:['默认','1', '2', '3', '4','5'],
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
      no:null,
      name:null,
      type:null,
      elseanswerIs:null,
      img:null
    }
  },
  deleteAnswer(e){
    let that=this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire/delete-answer',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
        no:e.currentTarget.dataset.no,
        name:e.currentTarget.dataset.name
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          for(var i in that.data.answerList){
            if(that.data.answerList[i].no==e.currentTarget.dataset.no){
              that.data.answerList.splice(i,1)
            }
          }
          that.setData({
            answerList:that.data.answerList
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
  bindPickerClick(e){
    this.setData({
      indexOption: e.detail.value,
      activeIcon:'activeIcon'
    })
  },
  bindcancel(e){
    this.setData({
      activeIcon:false
    })
  },
  bindPickerChange: function(e) {
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
    let orderNum=''
    console.log(that.data.topicRows[that.data.indexOption-1])
    let params=''
    if(that.data.indexOption==0){
      params=''
      // orderNum=''
    }else{
      params=`orderNum:(that.data.topicRows[that.data.indexOption-1].orderNum+that.data.topicRows[that.data.indexOption].orderNum)/2`
      // orderNum=(that.data.topicRows[that.data.indexOption-1].orderNum+that.data.topicRows[that.data.indexOption].orderNum)/2
    }
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire/alter-topic',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
        no:that.data.que.no||'',
        name:that.data.que.name||'',
        type:that.data.que.type||'',
        elseanswerIs:that.data.que.elseanswerIs?1:0,
        img:that.data.que.img||'',
        params
        // orderNum:orderNum
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
              console.log(that.data.answerList[i].no)
              if(that.data.answerList[i].no){
                console.log(i)
                that.modifyAnswerEve(that.data.answerList[i].no,that.data.answerList[i].name,i)
              }else{
                console.log(i)
                that.addAnswerEve(that.data.que.no,that.data.answerList[i].name,i)
              }
            }
            return
          }
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
  modifyAnswerEve(no,name,index){
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire/alter-answer',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
        no:no,
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
    this.data.que.no=options.no
    this.setData({
      que:this.data.que,
      options:options
    })
    this.topicRows()
    this.topicRow()
    this.answerRows()
   
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
  
  topicRow(){
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire/topic-row',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
        no:that.data.que.no,
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          // console.log(res.data.data)
          res.data.data.row.no=res.data.data.row.no

          let queTypeName=null,queType=null;
          for(var i in that.data.queList){
            if(res.data.data.row.type==that.data.queList[i].type){
              that.data.queList[i].selectThis=true
              queTypeName=that.data.queList[i].name
              queType=that.data.queList[i].type
            }else{
              that.data.queList[i].selectThis=false
            }
          }
          console.log(queType,queTypeName)
          that.data.que.type = queType
          
          that.setData({
            queList:that.data.queList,
            active:!that.data.active,
            queTypeName:queTypeName,
            queType:queType,
            que:res.data.data.row
          })


          // that.setData({
          //   que: res.data.data.row
          // })
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon:'none'
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
        topicNo:that.data.que.no,
        rstart:1,
        rcount:100
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          that.setData({
            answerList: res.data.data.rows
          })
          console.log(that.data.answerList)
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon:'none'
          })
        }
      }
    });
  },
  deleteTopic(){
    let that=this
    wx.showModal({
      title: '是否确认删除题目？',
      icon: 'none',
      duration: 1000,
      mask: true,
      complete: function complete(res) {
        setTimeout(function () {
          wx.request({
            url: app.globalData.url + '/ypt/questionnaire/delete-topic',
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              'cookie': wx.getStorageSync('cookie')
            },
            data:{
              no:that.data.que.no,
              name:that.data.que.name
            },
            method: 'post',
            success: function (res) {
              wx.hideToast()
              if (res.data.code == 0) {
               
                wx.navigateBack()
              } else {
                wx.showToast({
                  title: res.data.codeMsg,
                  icon:'none'
                })
               
              }
            }
          });
        }, 500);
      }
    });

  
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
        chunkNo:that.data.options.chunkNo,
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
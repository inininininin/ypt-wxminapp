// pages/painForm/painForm.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addShow: false,
    questionnaireNo: null,
    labelName: null,
    list: [],
    no: null
  },
  uModify(e) {
    for(var i in this.data.list){
      if(e.currentTarget.dataset.no== this.data.list[i].no){
        this.data.list[i].active=false
      }
    }
    this.setData({
      list:this.data.list,
      no: e.currentTarget.dataset.no,
      addShow: !this.data.addShow,
      labelName: e.currentTarget.dataset.name || ''
    })
    // this.setData({
    //   no: e.currentTarget.dataset.no,
    //   addShow: !this.data.addShow,
    //   labelName: e.currentTarget.dataset.name || ''
    // })
  },
  uClose(e) {
    for (var i in this.data.list) {
      if (e.currentTarget.dataset.no == this.data.list[i].no) {
        this.data.list[i].active = false
      }
    }
    this.setData({
      list: this.data.list
    })
  },
  uDelete(e) {
    let no = e.currentTarget.dataset.no
    let realname=e.currentTarget.dataset.name
    let that = this
    wx.showModal({
      title: `将删除标签 "${realname}" , 请确认`,
      content: '',
      editable:true,
      placeholderText:'请输入 "删除" 以确认',
      success (res) {
        if (res.confirm) {
          if(res.content=='删除'){
            wx.request({
              url: app.globalData.url + '/ypt/questionnaire/delete-chunk',
              header: {
                "Content-Type": "application/x-www-form-urlencoded",
                'cookie': wx.getStorageSync('cookie')
              },
              data: {
                no: no
              },
              method: 'post',
              success: function (res) {
                wx.hideToast()
                if (res.data.code == 0) {
                  for (var i in that.data.list) {
                    if (that.data.list[i].no == no) {
                      that.data.list.splice(i, 1)
                      // that.data.list[i].name=that.data.labelName
                    }
                  }
                  that.setData({
                    list: that.data.list,
                    // addShow: !that.data.addShow,
                    // no: null
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
  modifyChunk(e) {
    for (var i in this.data.list) {
      if (e.currentTarget.dataset.no == this.data.list[i].no) {
        this.data.list[i].active = true
      } else {
        this.data.list[i].active = false
      }
    }
    this.setData({
      list: this.data.list
    })
  },
  addChunkDetail(e) {
    wx.navigateTo({
      url: '../addQue/addQue?no=' + e.currentTarget.dataset.no,
    })
  },
  addChunk(e) {
    this.setData({
      no: e.currentTarget.dataset.no,
      addShow: !this.data.addShow,
      labelName: e.currentTarget.dataset.name || ''
    })
  },
  labelName(e) {
    this.setData({
      labelName: e.detail.value
    })
  },
  alterChunkBtn() {
    let that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire/alter-chunk',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        name: that.data.labelName,
        no: that.data.no
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          for (var i in that.data.list) {
            if (that.data.list[i].no == that.data.no) {
              that.data.list[i].name = that.data.labelName
            }
          }
          that.setData({
            list: that.data.list,
            addShow: !that.data.addShow,
            no: null
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
  addChunkBtn() {
    let that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire/create-chunk',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        name: that.data.labelName,
        questionnaireNo: that.data.questionnaireNo
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          that.data.list.push({
            'name': that.data.labelName,
            'no': res.data.data.no,
            'active': false
          })
          that.setData({
            list: that.data.list,
            addShow: !that.data.addShow
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
  makesure(e) {
    console.log(this.data.no)
    if (this.data.no) {
      this.alterChunkBtn()
    } else {
      this.addChunkBtn()
    }
  },
  chunkRows(e) {
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire/chunk-rows',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        questionnaireNo: that.data.questionnaireNo
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          if (res.data.data.rows && res.data.data.rows.length > 0) {
            for (var i in res.data.data.rows) {
              res.data.data.rows[i].active = false
            }
            that.setData({
              formIs: false
            })
          } else {
            that.setData({
              formIs: true
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      questionnaireNo: options.no
    })
    this.chunkRows()
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

  }
})
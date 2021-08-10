// packageA/pages/list/list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userRows:[],
    userNo:'',
    realname:"",
  },
  userRowsItem(e){
    wx.navigateTo({
      url: '../rows/rows?no='+e.currentTarget.dataset.no,
    })
  },
  modifyName(e){
    let that=this
    let userNo=e.currentTarget.dataset.no
    let realname=e.currentTarget.dataset.realname
    that.setData({
      userNo:userNo,
      realname:realname
    })
    wx.showModal({
      title: `将修改用户 "${that.data.realname}" , 请确认`,
      content: '',
      editable:true,
      placeholderText:'请输入姓名',
      success (res) {
        if (res.confirm) {
          let contentEve=res.content
          if(res.content==''||res.content==null||res.content==undefined){
            wx.showToast({
              title: '请输入姓名进行修改',
              icon:'none'
            })
            return
          }
          wx.request({
            url: app.globalData.dkUrl + '/vfc-clockin/alter-user',
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              'cookie': wx.getStorageSync('dkcookie')
            },
            data:{
              userNo:that.data.userNo,
              realname:contentEve
            },
            method: 'post',
            success: function (res) {
              if (res.data.code == 0) {
                for(var i in that.data.userRows){
                  if(that.data.userRows[i].no==that.data.userNo){
                    that.data.userRows[i].realname=contentEve
                    that.setData({
                      userRows:that.data.userRows
                    })
                    wx.showToast({
                      title:'修改成功',
                      icon:"none"
                    })
                  }
                }
                
              } else {
                wx.showToast({
                  title: res.data.codeMsg,
                  icon:'none'
                })
              }
            }
          });
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
this.userRows()
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
  userRows() {
    let that = this
    wx.request({
      url: app.globalData.dkUrl + '/vfc-clockin/user-rows',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('dkcookie')
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
         
          that.setData({
            userRows:res.data.data.rows
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
})
//app.js
App({
version: '211101',
versionIntro: '更新',
  globalData: {
    loginHospitalId: '',
    loginHpitalName: '',
    userInfo: null,
    userInfoDetail: [],
    entity: [],
    url: 'https://njshangka.com',
    cookie: '',
    withoutLogin:'',
    hospitaiDetail:[],
    navBarHeight: 0, // 导航栏高度
    menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
    menuBotton: 0, // 胶囊距底部间距（保持底部间距一致）
    menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    menuWidth:0,
    dkUrl:'https://renx.cc',
    dkUserInfoDetail: [],
  },
  onLaunch: function () {

    const that = this;
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
    that.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight;
    that.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    that.globalData.menuBotton = menuButtonInfo.top - systemInfo.statusBarHeight;
    that.globalData.menuHeight = menuButtonInfo.height;
    that.globalData.menuWidth = menuButtonInfo.width;
    
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    wx.setStorageSync('searchKeys', '')
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    const vm = this
    wx.getSystemInfo({
      success: function(res) {
        let titleBarHeight = 0
        if (res.model.indexOf('iPhone') !== -1) {
          titleBarHeight = 44
        } else {
          titleBarHeight = 48
        }
        // that.setData({
          vm.globalData.statusBarHeight= res.statusBarHeight,
          vm.globalData.titleBarHeight= titleBarHeight
        // });
      },
      failure() {
        vm.globalData.statusBarHeight= res.statusBarHeight,
          vm.globalData.titleBarHeight= titleBarHeight
      }
    })
    wx.request({
      url: vm.globalData.url+'/oss/alive/config.json',
      success(res){
        vm.globalData.entity=res.data
      }
    })
  },

  

  cover(_cover){
    var that=this
    if(_cover&&_cover.slice(0,1)!='h'){
      _cover=that.globalData.url+_cover
    }
    return _cover

  },
  historyUrl(){
    var pages = getCurrentPages()               //获取加载的页面
    var currentPage = pages[pages.length-1]    //获取当前页面的对象
    var url ='..'+ currentPage.route.split('pages')[1] 
    return url
  },
})
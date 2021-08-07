// pages/addPatient/addPatient.js
const app=getApp()
var utils = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[{name:'男',value:1},{name:'女',value:2}],
    picker: true,
    region: ['请选择发货地址：省-市-区'],
    patientDetail:{
      'questionnaireNo':'',
      realname:null,
      sex:null,
      age:null,
      phone:null,
      addressList: {
        'area1Id': '',
        'area1Name': '',
        'area2Id': '',
        'area2Name': '',
        'area3Id': '',
        'area3Name': '',
        'address': '',
      },
    },
    createPatientUrl:'/ypt/questionnaire-do/create',
    myself:false,
    showIs:false
  },
  realname(e){
    this.data.patientDetail.realname=e.detail.value
    this.setData({
      patientDetail:this.data.patientDetail
    })
  },
  age(e){
    this.data.patientDetail.age=e.detail.value
    this.setData({
      patientDetail:this.data.patientDetail
    })
  },
  phone(e){
    this.data.patientDetail.phone=e.detail.value
    this.setData({
      patientDetail:this.data.patientDetail
    })
  },
  address(e){
    this.data.patientDetail.addressList.address=e.detail.value
    this.setData({
      patientDetail:this.data.patientDetail
    })
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.data.patientDetail.sex=e.detail.value

    this.setData({
      patientDetail:this.data.patientDetail
    })
  },
  modifyPatient(){
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/questionnaire-do/alter',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
        doNo:that.data.options.doNo,
        // questionnaireNo:that.data.patientDetail.questionnaireNo,
        phone:that.data.patientDetail.phone||"",
        realname:that.data.patientDetail.realname||"",
        sex:that.data.patientDetail.sex||"",
        age:that.data.patientDetail.age||"",
        areaL1No:that.data.patientDetail.addressList.area1Id||"",
        areaL1Name:that.data.patientDetail.addressList.area1Name||"",
        areaL2No:that.data.patientDetail.addressList.area2Id||"",
        areaL2Name:that.data.patientDetail.addressList.area2Name||"",
        areaL3No:that.data.patientDetail.addressList.area3Id||"",
        areaL3Name:that.data.patientDetail.addressList.area3Name||"",
        address:that.data.patientDetail.addressList.address||""
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          var pages = getCurrentPages();
          // var currPage = pages[pages.length - 1]; //当前页面
          var prevPage = pages[pages.length - 2]; //上一个页面
          console.log(prevPage.data.patientDetail)
          prevPage.data.patientDetail.realname=that.data.patientDetail.realname
          prevPage.data.patientDetail.age=that.data.patientDetail.age
          prevPage.data.patientDetail.phone=that.data.patientDetail.phone
          prevPage.data.patientDetail.sex=that.data.patientDetail.sex
          prevPage.data.patientDetail.areaL1Name=that.data.patientDetail.area1Name
          prevPage.data.patientDetail.areaL2Name=that.data.patientDetail.area2Name
          prevPage.data.patientDetail.areaL3Name=that.data.patientDetail.area3Name
          prevPage.data.patientDetail.address=that.data.patientDetail.address
          // prevPage.data.patientList.unshift({doNo: res.data.data.doNo,
          // createTime:utils.formatTime( Date.parse(new Date()) / 1000, 'Y-M-D h:m') ,
          // userId: '',
          // realname: that.data.patientDetail.realname,
          // phone: that.data.patientDetail.phone})
          console.log(prevPage.data.patientDetail)
          // //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
            patientDetail: prevPage.data.patientDetail,
          })
          console.log(prevPage.data.patientDetail)
          wx.navigateBack();
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon:'none'
          })
        }
      }
    });
  },
  createPatient(){
    var that = this
    console.log(132)
    console.log(that.data.patientDetail.questionnaireNo)
    wx.request({
      url: app.globalData.url +that.data.createPatientUrl,// '/ypt/questionnaire-do/create',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data:{
        fromUserId:wx.getStorageSync('fromUserId'),
        questionnaireNo:that.data.patientDetail.questionnaireNo,
        phone:that.data.patientDetail.phone||"",
        realname:that.data.patientDetail.realname||"",
        sex:that.data.patientDetail.sex||"",
        age:that.data.patientDetail.age||"",
        areaL1No:that.data.patientDetail.addressList.area1Id||"",
        areaL1Name:that.data.patientDetail.addressList.area1Name||"",
        areaL2No:that.data.patientDetail.addressList.area2Id||"",
        areaL2Name:that.data.patientDetail.addressList.area2Name||"",
        areaL3No:that.data.patientDetail.addressList.area3Id||"",
        areaL3Name:that.data.patientDetail.addressList.area3Name||"",
        address:that.data.patientDetail.addressList.address||""
      },
      method: 'post',
      success: function (res) {
        wx.hideToast()
        console.log(333)
        console.log(res)
        if (res.data.code == 0) {
          if(that.data.createPatientUrl=='/ypt/questionnaire-do/create'){
            var pages = getCurrentPages();
            // var currPage = pages[pages.length - 1]; //当前页面
            var prevPage = pages[pages.length - 2]; //上一个页面
            console.log(prevPage.data.patientList)
            prevPage.data.patientList.unshift({doNo: res.data.data.doNo,
            createTime:utils.formatTime( Date.parse(new Date()) / 1000, 'Y-M-D h:m') ,
            userId: '',
            realname: that.data.patientDetail.realname,
            phone: that.data.patientDetail.phone})
            console.log(prevPage.data.patientList)
            // //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
            prevPage.setData({
              patientList: prevPage.data.patientList,
            })
            wx.navigateBack();
          }else{
            // wx.navigateBack();
            // ?no='+this.data.list[0].no+'&doNo='+e.currentTarget.dataset.id,
            wx.redirectTo({
              url: '../assessmentScaleShare/assessmentScaleShare?no='+wx.getStorageSync('no')+'&doNo='+res.data.data.doNo,
            })
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
  addressSel: function (e) {
    console.log(e.detail.value, this.data.picker)
    this.data.patientDetail.addressList.area1Id = e.detail.code[2].substring(0, 2);
    this.data.patientDetail.addressList.area2Id = e.detail.code[2].substring(0, 4);
    this.data.patientDetail.addressList.area3Id = e.detail.code[2];
    this.data.patientDetail.addressList.area1Name = e.detail.value[0];
    this.data.patientDetail.addressList.area2Name = e.detail.value[1];
    this.data.patientDetail.addressList.area3Name = e.detail.value[2];
    this.setData({
      patientDetail: this.data.patientDetail,
      picker: false,
      region: e.detail.value
    })
    console.log(this.data.patientDetail)
  },


  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that=this
    if(options.fromUserId){
      wx.setStorageSync('fromUserId', options.fromUserId)
    }
    that.setData({
      options:options
    })
    wx.request({
          url: app.globalData.url + '/ypt/questionnaire-do/get-my-questionnaire-do',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            'cookie': wx.getStorageSync('cookie')
          },
          data:{
            questionnaireNo :options.no,
          },
          method: 'post',
          success: function (res) {
            // wx.hideToast()
            if (res.data.code == 0) {
              console.log(12312312)
             console.log(res.data.data.doNo)
             wx.showToast({
              title: res.data.data.doNo,
              icon:'none'
            })
              if(res.data.data.doNo!=''&&res.data.data.doNo!=null&&res.data.data.doNo!=undefined){
                console.log('12312='+options.no)
                wx.showToast({
                  title: res.data.data.doNo,
                  icon:'none'
                })
                wx.redirectTo({
                  url: '../assessmentScale/assessmentScale?no='+options.no+'&doNo='+res.data.data.doNo,
                })
              }else{
                
                wx.getLocation({
                  type: 'wgs84',
                  success (res) {
                    const latitude = res.latitude
                    const longitude = res.longitude
                    const speed = res.speed
                    const accuracy = res.accuracy
                    console.log(latitude,longitude,speed,accuracy)
                    wx.request({
                      url: app.globalData.url + '/ypt/baidu/map/reverse-geocoding',
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        'cookie': wx.getStorageSync('cookie')
                      },
                      data:{
                        longitude :longitude,
                        latitude :latitude,
                      },
                      method: 'post',
                      success: function (res) {
                        wx.hideToast()
                        if (res.data.code == 0) {
                         console.log(res.data.data)
                         if(that.data.picker||that.data.patientDetail.addressList.area1Name==''){
                           console.log(res.data.data.result.addressComponent.adcode,typeof(res.data.data.result.addressComponent.adcode))
                            that.data.patientDetail.addressList.area1Name=res.data.data.result.addressComponent.province
                            that.data.patientDetail.addressList.area2Name=res.data.data.result.addressComponent.city
                            that.data.patientDetail.addressList.area3Name=res.data.data.result.addressComponent.district
                            that.data.patientDetail.addressList.area1Id=res.data.data.result.addressComponent.adcode.slice(0,2)
                            that.data.patientDetail.addressList.area2Id=res.data.data.result.addressComponent.adcode.slice(0,4)
                            that.data.patientDetail.addressList.area3Id=res.data.data.result.addressComponent.adcode.slice(0,6)
                            console.log(that.data.patientDetail)
                            setTimeout(()=>{
                              that.setData({
                                patientDetail: that.data.patientDetail,
                                region:[that.data.patientDetail.addressList.areaL1Name,that.data.patientDetail.addressList.areaL2Name,that.data.patientDetail.addressList.areaL3Name],
                                picker:false
                               })
                             },500)
                         }
                         
                        } else {
                          wx.showToast({
                            title: res.data.codeMsg,
                            icon:'none'
                          })
                        }
                      }
                    });
                  }
                 })
                that.data.patientDetail.questionnaireNo=options.no
                if(options.loginHospitalId){
                  wx.setStorageSync('loginHospitalId', options.loginHospitalId)
                }
                
                that.setData({
                  patientDetail:that.data.patientDetail,
                  options:options
                })
                console.log(that.data.patientDetail.questionnaireNo)
                wx.request({
                  url: app.globalData.url + '/oss/alive/user-protocol.html',
                  success: function (res) {
                    var article = res.data
                    WxParse.wxParse('article', 'html', article, that, 5);
                  }
                })
                wx.request({
                  url: app.globalData.url + '/ypt/user/login-refresh',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'cookie': wx.getStorageSync('cookie')
                  },
                  method: 'post',
                  success: function (res) {
                    console.log(23232)
                    console.log(res)
                    if (res.data.code == 0) {
                      app.globalData.userInfoDetail = res.data.data
                      let data=res.data.data
                      let patientDetail=that.data.patientDetail,addressList={},items=[],region=[]
                      if(data.sex==1){
                        items=[{name:'男',value:1,checked:true},{name:'女',value:2,checked:false}]
                     }else if(data.sex==2){
                        items=[{name:'男',value:1,checked:false},{name:'女',value:2,checked:true}]
                     }else{
                       items=[{name:'男',value:1,checked:false},{name:'女',value:2,checked:false}]
                     }
                      // ["北京市", "北京市", "东城区"]
                      patientDetail.realname=data.realname
                      patientDetail.sex=data.sex
                      patientDetail.age=data.age
                      patientDetail.phone=data.phone
                      addressList.area1Id=data.areaL1No
                      addressList.area1Name=data.areaL1Name
                      addressList.area2Id=data.areaL2No
                      addressList.area2Name=data.areaL2Name
                      addressList.area3Id=data.areaL3No
                      addressList.area3Name=data.areaL3Name
                      addressList.address=data.address
                      patientDetail.addressList=addressList
                      that.setData({
                        patientDetail:patientDetail,
                        items:items,
                        region:[data.areaL1Name,data.areaL2Name,data.areaL3Name],
                        picker:data.areaL1Name?false:true
                      })
                      console.log(that.data.patientDetail)
            
                      wx.setStorageSync('withoutLogin', false)
                     
                      app.globalData.userInfoDetail = res.data.data
                      wx.setStorageSync('loginHospitalId', res.data.data.hospitalId)
                      wx.setStorageSync('loginHpitalName', res.data.data.hospitalName)
                      wx.setStorageSync('codeType', that.data.type)
                    } else {
                      
                      that.wxLogin()
                    }
                  }
                })
                if(options&&options.type=='myself'){
                  // /create-my-do
                  that.setData({
                    createPatientUrl:'/ypt/questionnaire-do/create-my-do',
                    myself:true
                  })
                }
                if(options&&options.type=='modify'){
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
                //         region: ['请选择发货地址：省-市-区'],
                        let patientDetail={},addressList={},data=res.data.data.row,items=[],region=[]
                        if(data.sex==1){
                          items=[{name:'男',value:1,checked:true},{name:'女',value:2,checked:false}]
                       }else if(data.sex==2){
                          items=[{name:'男',value:1,checked:false},{name:'女',value:2,checked:true}]
                       }else{
                         items=[{name:'男',value:1,checked:false},{name:'女',value:2,checked:false}]
                       }
                        // ["北京市", "北京市", "东城区"]
                        
                        patientDetail.realname=data.realname
                        patientDetail.sex=data.sex
                        patientDetail.age=data.age
                        patientDetail.phone=data.phone
                        addressList.area1Id=data.areaL1No
                        addressList.area1Name=data.areaL1Name
                        addressList.area2Id=data.areaL2No
                        addressList.area2Name=data.areaL2Name
                        addressList.area3Id=data.areaL3No
                        addressList.area3Name=data.areaL3Name
                        addressList.address=data.address
                        patientDetail.addressList=addressList
                        that.setData({
                          patientDetail:patientDetail,
                          items:items,
                          region:[data.areaL1Name,data.areaL2Name,data.areaL3Name],
                          picker:data.areaL1Name?false:true
                        })
                        console.log(that.data.patientDetail)
                      } else {
                        wx.showToast({
                          title: res.data.codeMsg,
                          icon:'none'
                        })
                      }
                    }
                  });
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
    let that=this
    let patientDetail=that.data.patientDetail,addressList={},items=[],region=[]
    let data=app.globalData.userInfoDetail
    if(data.sex==1){
       items=[{name:'男',value:1,checked:true},{name:'女',value:2,checked:false}]
    }else if(data.sex==2){
       items=[{name:'男',value:1,checked:false},{name:'女',value:2,checked:true}]
    }else{
      items=[{name:'男',value:1,checked:false},{name:'女',value:2,checked:false}]
    }
    // ["北京市", "北京市", "东城区"]
    patientDetail.questionnaireNo=that.data.patientDetail.questionnaireNo
    patientDetail.realname=data.realname
    patientDetail.sex=data.sex
    patientDetail.age=data.age
    patientDetail.phone=data.phone
    addressList.area1Id=data.areaL1No
    addressList.area1Name=data.areaL1Name
    addressList.area2Id=data.areaL2No
    addressList.area2Name=data.areaL2Name
    addressList.area3Id=data.areaL3No
    addressList.area3Name=data.areaL3Name
    addressList.address=data.address
    patientDetail.addressList=addressList
    that.setData({
      patientDetail:patientDetail,
      items:items,
      region:[data.areaL1Name,data.areaL2Name,data.areaL3Name],
      picker:data.areaL1Name?false:true
    })
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
  refuse(e) {
    this.setData({
      showIs: false
    })
  },
  getPhoneNumber(e) {
let that=this
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
                    let data=res.data.data
                    let patientDetail=that.data.patientDetail
                    // ,addressList={},items=[],region=[]
                  //   if(data.sex==1){
                  //     items=[{name:'男',value:1,checked:true},{name:'女',value:2,checked:false}]
                  //  }else if(data.sex==2){
                  //     items=[{name:'男',value:1,checked:false},{name:'女',value:2,checked:true}]
                  //  }else{
                  //    items=[{name:'男',value:1,checked:false},{name:'女',value:2,checked:false}]
                  //  }
                    // ["北京市", "北京市", "东城区"]
                    
                    // patientDetail.realname=data.realname
                    // patientDetail.sex=data.sex
                    // patientDetail.age=data.age
                    patientDetail.phone=data.phone
                    // addressList.area1Id=data.areaL1No
                    // addressList.area1Name=data.areaL1Name
                    // addressList.area2Id=data.areaL2No
                    // addressList.area2Name=data.areaL2Name
                    // addressList.area3Id=data.areaL3No
                    // addressList.area3Name=data.areaL3Name
                    // addressList.address=data.address
                    // patientDetail.addressList=addressList
                    that.setData({
                      patientDetail:patientDetail,
                      // items:items,
                      // region:[data.areaL1Name,data.areaL2Name,data.areaL3Name],
                      // picker:data.areaL1Name?false:true
                    })
                    wx.setStorageSync('loginHospitalId', res.data.data.hospitalId)
                    wx.setStorageSync('loginHpitalName', res.data.data.hospitalName)
                    wx.setStorageSync('codeType', that.data.type)
                    wx.setStorageSync('withoutLogin', false)
                    wx.showToast({
                      title: '绑定成功',
                      icon: 'none',
                      duration: 2000,
                      mask: true,
                      complete: function(res) {
                        setTimeout(function () {    
                          that.data.patientDetail.phone=app.globalData.userInfoDetail.phone
                          that.setData({
                            showIs: false,
                            patientDetail:that.data.patientDetail
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

  },
  popWindowGet(){
    this.setData({
      showIs: true
    })
  },
  wxLogin(){
    let that=this
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
            wx.hideToast()
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
                  wx.hideToast()
                  if (res.data.code == 0) {
                    if(!res.data.data.phone){
                      that.setData({
                        showIs: true
                      })
                    }
                    app.globalData.userInfoDetail = res.data.data
                    let data=res.data.data
                    let patientDetail=that.data.patientDetail,addressList={},items=[],region=[]
                    if(data.sex==1){
                      items=[{name:'男',value:1,checked:true},{name:'女',value:2,checked:false}]
                   }else if(data.sex==2){
                      items=[{name:'男',value:1,checked:false},{name:'女',value:2,checked:true}]
                   }else{
                     items=[{name:'男',value:1,checked:false},{name:'女',value:2,checked:false}]
                   }
                    // ["北京市", "北京市", "东城区"]
                    
                    patientDetail.realname=data.realname
                    patientDetail.sex=data.sex
                    patientDetail.age=data.age
                    patientDetail.phone=data.phone
                    addressList.area1Id=data.areaL1No
                    addressList.area1Name=data.areaL1Name
                    addressList.area2Id=data.areaL2No
                    addressList.area2Name=data.areaL2Name
                    addressList.area3Id=data.areaL3No
                    addressList.area3Name=data.areaL3Name
                    addressList.address=data.address
                    patientDetail.addressList=addressList
                    that.setData({
                      patientDetail:patientDetail,
                      items:items,
                      region:[data.areaL1Name,data.areaL2Name,data.areaL3Name],
                      picker:data.areaL1Name?false:true
                    })
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
})
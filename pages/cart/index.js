/* 
1 获取用户的收货地址
  1 绑定点击事件
  2 调用小程序内置api  获取用户的收货地址 chooseAddress
2 页面加载完毕
  0 onLoad onShow
  1 获取本地储存中的地址数据
  2 把数据 设置给data中的一个变量
 */
Page({
  data:{
    address:{}
  },
  onShow(){
    // 1 获取缓存中的收货地址信息
    const address=wx.getStorageSync("address");
    // 2 给data赋值
    this.setData({
      address
    })
  },
  // 点击 收货地址
  async handleChooseAdress(){
    // 2 获取收货地址
    wx.chooseAddress({
      success: (result) => {
       console.log(result); 
      }
    });
    // 4 调用获取收货地址的api
    let address = await wx.chooseAddress();
    address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
    // 5 存入到缓存中
    wx.setStorageSync("address", address);
      
  }
})
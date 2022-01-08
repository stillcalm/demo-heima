import { request } from "../../request/index.js";
Page({
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的菜单数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0
  },
  Cates: [],

  onLoad: function (options) {
    /* 
    0 web中本地存储和 小程序中的本地存储的区别
      1 写代码的方式不一样
        web: localStorage.setItem("key","vaule") localStorage.getItem("key")
      小程序中: wx.setStorageSync("key", "value"); wx.getStorageSync("key");
      2 存的时候 有没有做类型转换
        web: 不管存入的是什么类型的数据，最终都会现调用以下 toString(),把数据变成了字符串 再存入
        小程序: 不存在类型转换的这个操作 存什么类型的数据进去，获取的就是什么类型的数据
    1 先判断一下本地储存中有没有旧的数据
      {time:Date.now(),data:this.Cates}
    2 没有旧数据 直接发送新请求
    3 有旧的数据 同时 旧的数据没有过期 就使用 本地存储中的旧数据即可
    */


    // 1获取本地存储中的数据 （小程序中也是存在本地存储 技术）
    const Cates = wx.getStorageSync("cates");
    // 2判断
    if (!Cates) {
      // 不存在 发送请求数据
      this.getCates();
    } else {
      // 有旧的数据 定义过期时间 10s
      if (Date.now() - Cates.time > 1000 * 300) {
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },
  // 获取分类数据
  async getCates() {
    /*     request({
          url:"/categories"
        })
          .then(res => {
            this.Cates=res.data.message;
    
            //把数据存储到本地存储中
            wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
            // 构造左侧的菜单数据
            let leftMenuList=this.Cates.map(v=>v.cat_name);
    
            // 构造右侧的商品数据
            let rightContent=this.Cates[0].children;
            this.setData({
              leftMenuList,
              rightContent
            })
          }) */
    const res = await request({ url: "/categories" })
    this.Cates = res;

    //把数据存储到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    // 构造左侧的菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    /* 
    1 获取被点击的标题身上的索引
    2 给data中的currentIndex赋值就可以了
    */
    const { index } = e.currentTarget.dataset; //解构赋值

    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置 右侧内容的scrolly-view标签距离顶部的距离
      scrollTop: 0
    })
  }
});

$(function () {
  // 先截取 location.search 里面的id
  let id = location.search.substring(4);
  // 到数组里面把对应id的数据获取出来
  // 这样做是可以获取到对应的数据的 —— 但是太麻烦了
  // phoneData.forEach(e=>{
  //   if(e.pID == id){
  //     console.log(e);
  //   }
  // })

  // 讲解一个新的数组的获取指定条件元素的方法
  let target = phoneData.find(e => {
    // 返回你的条件
    return e.pID == id;


  });// 就可以把数据动态的渲染到结构里面
  // 把价格修改
  $('.summary-price em').text(`￥${target.price}`);
  // 改名字
  $('.sku-name').text(target.name);
  // 改图片
  $('.preview-img>img').attr('src', target.imgSrc);
  // 如果还有别的地方要改(数据要支持)，继续修改
  // 点击加入购物车
  $('.addshopcar').on('click', function () {
    // 现货区数组里面的件数
    let number = $('.choose-number').val();
    // 判断输入的是否是一个大于0的数字
    // isNaN（） 检查其结果是否是一个数字值
    if (number.trim().length === 0 || isNaN(number) || parseInt(number) <= 0) {
      alert('输入的商品数量不正确，请重新输入');
      return;
    }
    // 把件数和商品储存到本地存储里面
    // 先在本地存储里面存储一个数组
    let arr = kits.loadData('cartListData');

    // 在把数据添加到购物车里面之前，要先判断，该商品是否已经存在于购物车中，如果存在了，应该是把数量叠加，而不是添加一个新的商品
    // 判断是否已经存在该商品 - 根据id判断是否已经存在
    let exist = arr.find(e => {
      // 新的数组的获取指定条件元素的方法
      return e.pID == id;
    })
    // 为了保证数量是数字，需要把数量先转换为数字
    number = parseInt(number);
    // 如果数组中有满足条件的元素，exist就是一个对象，否则是undefined
    if (exist) {
      exist.number += number;
    } else {
      // 需要自己构建对象
      let obj = {
        pID: target.pID,
        imgSrc: target.imgSrc,
        name: target.name,
        price: target.price,
        number: number,
        isChecked: true,
      }
      // 把数据放到数组里面，然后存到本地存储
      arr.push(obj);

    }
    kits.saveData('cartListData', arr);
    // location 跳转到新的页面
    location.href = './cart.html';
  })

});


$(function () {
  // 第一个功能： 先读取本地数据中的数据，然后动态的生成列表结构
  let arr = kits.loadData('cartListData');
  // 遍历数组，生成指定结构
  // 先准备一个空字符串
  let html = '';
  arr.forEach(e => {
    // 需要有一个id 用于生成其他的操作
    html += `<div class="item" data-id="${e.pID}">
        <div class="row">
          <div class="cell col-1 row">
            <div class="cell col-1">
              <input type="checkbox" class="item-ck" checked="">
            </div>
            <div class="cell col-4">
              <img src="${e.imgSrc}" alt="">
            </div>
          </div>
          <div class="cell col-4 row">
            <div class="item-name">${e.name}</div>
          </div>
          <div class="cell col-1 tc lh70">
            <span>￥</span>
            <em class="price">${e.price}</em>
          </div>
          <div class="cell col-1 tc lh70">
            <div class="item-count">
              <a href="javascript:void(0);" class="reduce fl ">-</a>
              <input autocomplete="off" type="text" class="number fl" value="${e.number}">
              <a href="javascript:void(0);" class="add fl">+</a>
            </div>
          </div>
          <div class="cell col-1 tc lh70">
            <span>￥</span>
            <em class="computed">${e.number * e.price}</em>
          </div>
          <div class="cell col-1">
            <a href="javascript:void(0);" class="item-del">从购物车中移除</a>
          </div>
        </div>
      </div>`;
  })
  // append:添加子元素
  $('.item-list').append(html);
  // 如果arr里面的不是全勾选的，就要把全勾选去掉
  let noCkall = arr.find(e => {
    return e.isChecked === false;
  })
  if (noCkall) {
    $('pick-all').prop('checked', false);
  }
  if (arr.length != 0) {
    $('.empty-tip').hide();
    $('.cart-header').show();
    $('.total-of').show();
  }

  // 第二个功能，全选/全不选
  $('.pick-all').on('click', function () {
    let status = $(this).prop('checked');
    $('.item-ck').prop('checked', status);
    $('.pick-all').prop('checked', status);
    // 先把本地数据里面的所有数据都勾选
    arr.forEach(e => {
      e.isChecked = status;
    })
    // 重新存进本地数据
    kits.saveData('cartListData', arr);
    // 点击全选的时候，也需要把数据更新
    calcTotal();
  })
  $('.item-list').on('click', '.item-ck', function () {
    let ckall = $('.item-ck').length === $('.item-ck:checked').length;
    $('pick-all').prop('checked', ckall);
    // 点选的同时，要修改该多选框对应的本地数据里面的选中状态
    // attr获取勾选的选择器
    let pID = $(this).parents('.item').attr('data-id');
    // 获取当前这个单选是否被选中
    let isChecked = $(this).prop('checked');
    arr.forEach(e => {
      if (e.pID == pID) {
        e.isChecked = isChecked;
      }
    })
    kits.saveData('cartListData', arr);
    // 点击全选的时候，也需要把数据更新
    calcTotal();
  })
  function calcTotal() {
    let totalCount = 0;
    let totalMoney = 0;
    arr.forEach(e => {
      if (e.isChecked) {
        totalCount += e.number;
        totalMoney += e.number * e.price;
      }
    })
    $('.selected').text(totalCount);
    $('.total-money').text(totalMoney);
  }
  calcTotal();

  // 实现数量的加减
  $('.item-list').on('click', '.add', function () {
    // 让输入框里面的数字增加
    let prev = $(this).prev();
    let current = prev.val();
    prev.val(++current);
    // 数量也要更新到本地数据
    let id = $(this).parents('.item').attr('data-id');
    let obj = arr.find(e => {
      return e.pID == id;
    })
    obj.number = current;
    // 把数据存储到本地
    kits.saveData('cartListData', arr);
    calcTotal();
    $(this).parents('.item').find('.computed').text(obj.number * obj.price);
  })
  // 点击减号
  $('.item-list').on('click', '.reduce', function () {
    // 让输入框里面的数字增加
    let next = $(this).next();
    let current = next.val();
    // 判断当前的值是否是小于等于1
    if (current <= 1) {
      alert('商品的件数不能小于1');
      return;
    }
    next.val(--current);
    // 数量也要更新到本地数据
    let id = $(this).parents('.item').attr('data-id');
    let obj = arr.find(e => {
      return e.pID == id;
    })
    obj.number = current;
    // 把数据存储到本地
    kits.saveData('cartListData', arr);
    calcTotal();
    $(this).parents('.item').find('.computed').text(obj.number * obj.price);
  });
  // 当得到焦点的时候，把当前的值先存起来，如果失去焦点的时候，输入的结果不正确，可以返回原来的值
  // focus 得到焦点
  $('.item-list').on('focus', '.number', function () {
    // 把旧的正确的值先存起来
    let old = $(this).val();
    $(this).attr('data-id', old);
  });
  // 当失去焦点的时候，需要把当前的值同步到本地存储
  // blur 失去焦点
  $('.item-list').on('blue', '.number', function () {
    let current = $(this).val();
    // 每次让用户输入的内容，一定要合理
    // trim 去除前后空白
    // isNaN 判断是不是一个数字
    // parseInt 判断是个整数
    if (current.trim().length === 0 || isNaN(current) || parseInt(current) <= 0) {
      let old = $(this).attr('data-id');
      $(this).val(old);
      alert('商品数量不正确，请输入正确的数量');
      return;
    }
    // 把数量总价更新
    let id = $(this).parents('.item').attr('data-id');
    let obj = arr.find(e => {
      return e.pID == id;
    })
    obj.number = parseInt(current);
    // 把数据存储到本地
    kits.saveData('cartListData', arr);
    calcTotal();
    $(this).parents('.item').find('.computed').text(obj.number * obj.price);
  })
  // 实现删除
  $('.item-list').on('click', '.item-del', function () {
    layer.confirm('你确定要删除吗？', { icon: 0, title: '警告' }, (index) => {
      layer.close(index);
      // 先得到要删除的id
      let id = $(this).parents('.item').attr('data-id');
      // 把当前点击的对应的这一行删除
      $(this).parents('.item').remove();
      // 还要把本地存储的数据删除
      arr = arr.filter(e => {
        return e.pID = id;
      });
      kits.saveData('cartListData', arr);
      calcTotal();
    })
  })
})

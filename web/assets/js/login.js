$(function () {
  // 点击"去注册账号"的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击"去登录"的链接
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })


  // 从 layui 中获取 form 对象
  let form = layui.form
  // 从 layui 中 获取layer 对象
  // 通过 form.verfiy() 函数自定义校验规则
  form.verify({
    // 自定义一个叫 pwd 检验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    repwd: function (value) {
      let pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致！'
      }
    }
  })


  // 监听 注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    // 1.阻止默认提交
    e.preventDefault()
    // 原请求路径：'http://ajax.frontend.itheima.net/api/reguser'
    let data = {
       username: $('#form_reg [name=username]').val(), 
       password: $('#form_reg [name=password]').val() 
      }
      // 2.发起 Ajax 的 post请求
    $.post('/api/reguser',data, function (res) {
      if(res.status !== 0){
        return layer.msg('用户名被占用，请更换其他用户名！',{icon:5})
      }
      layer.msg('注册成功,请登录!',{ icon:6})
      // 模拟 点击行为
      $('#link_login').click()
      
    })

  })

  // 监听 登录表单的提交事件
  $('#form_login').submit(function(e) {
    e.preventDefault()
    console.log($(this).serialize());
    $.ajax({
      method:'POST',
      url:'/api/login',
      // 快速获取表单中的数据,查询字符串
      data:$(this).serialize(),
      success:function(res) {
        console.log(res);
       if(res.status !== 0){
        return layer.msg(res.msg,{icon:2})
       }
        layer.msg(res.msg, { icon:1})
        // 登陆成功后返回的 Token 存储到本地
        localStorage.setItem('token',res.token)
        // 跳转到后台首页
        location.href  = '/index.html'

      }
    
    })
  })




})
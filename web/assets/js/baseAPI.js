
// $.ajaxPrefilter(function(options) {
//   // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
//   options.url = 'http://ajax.frontend.itheima.net' + options.url
// })


// 注意：每次调用$.get()或$.post()或$.ajax()的时候
// 先调用 ajaxPrefilter 这个函数
// 这个函数里面，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options)
{
    // 发起 Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://127.0.0.1' + options.url
    //统一为有权限的接口，设置 headers 请求头
    //  配置对象,携带身份认证字段
     if(options.url.indexOf('/my/')!==-1){
    options.headers = {
        Authorization: localStorage.getItem('token')||''
    }
  }

// 无论成功失败，都会调用 complete函数
// 全局统一挂载 回调函数

    options.complete = function (res) {
        console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.msg ===
            "身份认证失败") {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }

    }
      
})
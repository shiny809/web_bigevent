$(function () {
    // 调用函数 获取 用户信息
    getUserInfo()
    // 退出功能
    let layer = layui.layer
    $('#btnLogout').on('click', function () {
        //   提示 用户是否确认退出
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            //    关闭询问框
            layer.close(index);

            // 点击确定执行的回调
            //1. 清空本地存储的token
            localStorage.removeItem('token')
            // 2.更新跳转到登录界面
            location.href = '/login.html'
        });

    })

})
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        }
       
    })

    // 渲染用户头像
    function renderAvatar(user) {
        // 1、获取用户名称
        let name = user.nickname || user.username

        // 2、设置欢迎文本
        $('.welcome').html('欢迎&nbsp;&nbsp;' + name)

        // 3、按需渲染用户的头像
        if (user.user_pic !== null) {
            // 3.1 渲染图片头像
            $('.layui-nav-img').attr('src', user.user_pic).show()
            $('.text-avatar').hide()
        } else {
            // 3.2 渲染文本头像
            let first = name[0].toUpperCase()
            $('.layui-nav-img').hide()
            $('.text-avatar').html(first).show()
        }
    }
}


$(function () {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6)
                return "昵称长度必须在1~6个字符之间！"
        }
    })

    initUserInfo()
    // 1.初始化 用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res);
                //调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 2.重置表单的数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单默认重置行为
        e.preventDefault()
        // 将数据 还原成初始的样子
        initUserInfo()

    })

    

    // 3.表单数据的提交
    $('.layui-form').on('submit',function(e) {
        e.preventDefault()
        // 发起ajax数据请求
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            // data:$(this).serialize(),
            data: form.val('formUserInfo'),
            success:function(res) {
                if(res.status!==0){
                    return layer.msg('更新用户信息失败！')
                }
                 layer.msg('更新用户信息成功！') 
                // 4.调用父页面的方法 重新渲染用户的信息
                window.parent.getUserInfo()
            }
        })
        // 区别：对象和查询字符串
        // console.log(form.val('formUserInfo'));
        // console.log(($('.layui-form').serialize()));

       
    })

})
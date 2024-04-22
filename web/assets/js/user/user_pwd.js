
$(function() {
    let  form = layui.form
    // 1.添加 表单验证
    form.verify({
        pwd:[/^[\S]{6,12}$/,'密码必须6-12位，且不能出现空格'],
        samePwd:function(value) {
            if(value === $('[name = oldPwd]').val()){
                return '新旧密码不能相同!'        
            }
        },
        rePwd:function(value) {
            if (value !== $('[name = newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })
    // 2.发起修改密码的请求
    $('.layui-form').on('submit',function (e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success:function(res) {
                // console.log(res);
                if(res.status !==0){
                    return layer.msg('旧密码不正确！')
                }
                layer.msg('密码修改成功！')
                $('.layui-form')[0].reset()

            }
        })

    })
    

})
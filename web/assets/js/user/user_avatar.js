$(function () {

    // 优化：发起请求设置图片
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取用户头像失败！')
            }

            if (res.data.user_pic !== null) {
                $('#image').attr('src', res.data.user_pic )
            } 
        }

    })
    let layer = layui.layer
    // 1.实现 裁剪效果
    // 1.1 获取裁剪区域的 DOM 元素
    const $image = $('#image')
    // 1.2 配置选项
    const options = {
        aspectRatio:1, //纵横比
        preview:'.img-preview'// 指定预览区域
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 2.更换图片
    // 2.1 绑定点击事件
    $('#btnChooseImg').on('click',function() {
        // 模拟 文件点击事件
        $('#file').click()
    })

    // 2.2 绑定 change 事件
    $('#file').on('change',function(e) {
        // console.log(e.target.files);
        // 获取用户选择的文件，是个 伪数组
        let filelist = e.target.files
        if(filelist.length ===  0) {
            return layer.msg('请选择照片！')
        }
        // 3.1 拿到 选择的文件
        let file = e.target.files[0]
        // 3.2 将文件转化为路径
        let imgURL = URL.createObjectURL(file)
        // 3.3 重新初始化裁剪区域
        $image
        .cropper('destroy') //销毁旧的裁剪区域
        .attr('src',imgURL) //重新设置图片路径
        .cropper(options) // 重新 初始化 裁剪区域
    })

    // 4. 上传图像
    $('#btnUpload').on('click',function() {
        // 4.1 将裁剪的图片 转化为 base64 的图片
        let dataURL = $image.cropper('getCroppedCanvas',{
            // 创建一个 canvas 画布
            width:100,
            height:100
        })
        .toDataURL('image/png')//将 Canvas 画布上的内容，转化为base64 格式的字符串
        $.ajax({
            method:'POST',
            url:'/my/update/avatar',
            data:{avatar:dataURL},
            success:function(res) {
               if(res.status !== 0){
                return layer.msg('更换头像失败！')
               }
                layer.msg('更换头像成功！')
                window.parent.getUserInfo()
            }

        })
    })



})
let form = layui.form
function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/artcate/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.msg)
            }
            // 调用模板引擎渲染下拉菜单
            let htmlStr = template('tpl-cate', res)
            $('[name=cate_id]').html(htmlStr)
            // 调用 layui 方法重新渲染
            form.render()

        }
    }
    )
}

$(function () {
    // 1. 加载下拉框 文章分类列
    let layer = layui.layer
    initCate()

    // 2.调用 `initEditor()` 方法，初始化富文本编辑器：  
    // 初始化富文本编辑器
    initEditor()


    // 3.封面裁剪
    // 3.1 初始化图片裁剪器
    let $image = $('#image')
    // 3.2 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    //3.3 初始化裁剪区域
    $image.cropper(options)


    // 4.封面图片 设置
    // 4.1 封面按钮绑定点击事件
    $('#btnChooseImg').on('click', function () {
        $('#coverFile').click()
    })
    // 4.2 监听 文件框 change 事件，获取用户选择文件列表
    $('#coverFile').on('change', function (e) {
        let files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的url地址
        let newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域 重新设置图片
        $image
            .cropper('destroy')//销毁旧的裁剪区域
            .attr('src', newImgURL)
            .cropper(options)//重新初始化裁剪区域
    })


    // 5.发布文章
    // 5.1 状态设置，重新 优化 如下代码，分类讨论
    let art_state = undefined
    $('#btnSave1').on('click', function () {
        art_state = '已发布'
    })
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 6.为表单 绑定 点击事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 基于表单快速创建一个formData 对象
        let fd = new FormData($(this)[0])
        // 将发布状态存到 fd中
        fd.append('state', art_state)
        // 将封面裁剪的区域输出为 文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                publishArticle(fd)

            })
    })

})


// 发布文章的方法
function publishArticle(fd) {
    $.ajax({
        method: 'POST',
        url: '/my/article/add',
        data: fd,
        contentType: false,
        processData: false,
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('发布文章失败！')
            }
            layer.msg('发布文章成功!')
            // 不跳转，设置前面 art_state的状态
            let val = form.val('form-edit')
            // console.log(val);
            // 发布成功，跳转页面
            window.parent.$('.layui-nav-tree .layui-nav-item:nth-child(2) dd:nth-child(2)').addClass('layui-this').siblings().removeClass('layui-this')
            location.href = ('/article/art_list.html')
        }
    })
}

$(function() {
    let layer = layui.layer
    let form = layui.form
    initArtCateList()
    // 1.获取文章的列表
    function initArtCateList() {
        $.ajax({
            method:'GET',
            url:'/my/artcate/cates',
            success:function (res) {
                if(res.status!==0)
                {
                  return layer.msg('获取文章分类列表失败！')
                }
               let htmlStr =  template('tpl-table',res)
               $('tbody').html(htmlStr)
            }
        })
    }

    let indexAdd = null
    // 2.1为添加类别按钮点击绑定事件
    $('#btnAddCate').on('click',function(){
         indexAdd = layer.open({
            type:1,
            title:'添加文章分类',
            area:['500px','250px'],
            content:$('#dialog-add').html()
        })     
    })

    // 2.2 提交按钮绑定 submit 事件
    // 只能通过事件委托的形式，因为标签在添加之前 是不存在的
    $('body').on('submit','#form-add',function (e) {
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/artcate/addcates',
            data:$('#form-add').serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg(res.msg)
                }
                layer.msg(res.msg)
                layer.close(indexAdd)
                initArtCateList()
            }
        })

    } )

    // 3.1为 编辑 按钮点击绑定事件
    let indexEdit = null
    // 定义 全局变量，后面重置也可使用
    let formVal = null
    $('tbody').on('click','.btn-edit', function () {
        // 弹出一个修改文章分类的层
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        })
        let id = $(this).attr('data-id')
        // 发起请求获取对应数据
        $.ajax({
            method:'GET',
            url:'/my/artcate/cates/'+ id,
            success:function (res){
                formVal = res.data
             form.val('form-edit',formVal)
            }
        })
    })

    // 3.1.1 重置按钮 还原数据
    $('body').on('click', '#btn-reset', function (e) {
        e.preventDefault()
        form.val('form-edit', formVal)
    }
    )
   
    // 3.2 编辑按钮绑定 submit 事件
    // 只能通过事件委托的形式，因为标签在添加之前 是不存在的
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/artcate/updatecate',
            data: $('#form-edit').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.msg)
                }
                layer.msg(res.msg)
                layer.close(indexEdit)
                initArtCateList()
            }
        })

    })

    // 4.删除 分类数据
    $('tbody').on('click','.btn-del',function () {
        let id = $(this).attr('data-id')
        layer.confirm("确认删除?",{icon:3,title:'提示'},function (index){
            $.ajax({
                method:'GET',
                url:'/my/artcate/deletecate/'+id,
                success:function(res){
                    if(res.status !==0 ){
                        layer.msg('删除数据失败！')
                    }
                    layer.msg('删除数据成功！')
                    layer.close(index)
                   initArtCateList()
                }
            })

        })

    })
})
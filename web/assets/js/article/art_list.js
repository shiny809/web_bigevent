$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage
    // 3.定义 时间美化 过滤器
    // 定义 补零 函数
    function padZero(t) {
        return t > 9 ? t : '0' + t

    }
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss

    }

    // 1.定义查询字符串
    let q = {
        pagenum: 1,// 页码值
        pagesize: 3,// 页码数据条数
        // 不填 或者 填必须符合要求 或者？？undefined也可以
        cate_id: undefined,//文章分类id
        state: undefined//文章的发布状态
    }

    initTable()
    // 2.获取文章列表数据方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用 模版引擎 渲染数据
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染 分页的方法
                renderPage(res.total)
            }
        })


    }

    // 4.动态加载 分类下拉菜单项
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/artcate/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模版引擎或在循环方法渲染
                // let htmlStr1 = template('tpl-cate',res)
                // $('[name=cate_id]').html(htmlStr1)

                let htmlStr = '<option value="0">所有分类</option>'
                $.each(res.data, function (index, item) {
                    htmlStr += `<option value = "${item.id}" >${item.name}</option>`
                })
                // console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr)
                // 调用 layui的render方法，重新渲染
                form.render()


            }
        })
    }

    // 5.实现筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单选中的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // console.log(typeof (cate_id));//string
        // console.log(typeof (state)); //string
        // console.log(cate_id, state);
        // 解决了查询 全部分类 出错问题
        // console.log(typeof (undefined));
        // console.log(typeof ('undefined'));
        // ！！！提交有 数据类型限制？？ 直接提交undefined不出错，巧妙设置 value = "0" 转化 undefined
        q.cate_id = cate_id === '0' ? undefined : cate_id
        q.state = state === '0' ? undefined : state
        // 自动回到 第一页
        q.pagenum = 1

        // 根据最新的筛选条件重新渲染数据
        initTable()

    })

    // 6.定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调 laypage.render()方法渲染分页结果
        laypage.render({
        elem: 'pageBox' ,
        count: total, //数据总数,从服务端得到
        limit:q.pagesize,//每页显示数据条数
        curr:q.pagenum ,//设置被选中的分页
        layout:['count','limit','prev','page','next','skip'],
        limits:[2,3,5,10],

        // 分页发生切换 触发 jump回调 
        // 触发 jump  回调的方式有两种：
        // 1. 点击页码，会触发 jump 回调
        // 2. 只要调用 layuipage.render()方法，会触发 jump , first 为 true
        jump:function(obj,first) {
            // console.log(obj.curr);
            // console.log(first);
            // 把最新的页码值，赋值到 q 这个查询参数对象中
            q.pagenum = obj.curr
            // 把新的条目数，复制到 q 这个查询参数中
            q.pagesize = obj.limit
            // 首次不执行，用于初始加载的判断,避免死循环
            if(!first){
                initTable()
            }
        }
        });

    }

    // 7.删除文章列表 
    $('tbody').on('click','.btn-del',function() {
        // 获取 删除按钮 个数
        let len = $('.btn-del').length

        let id = $(this).attr('data-id')
        layer.confirm('确认删除？',{icon:3,title:'提示'},function(index) {
            $.ajax({
                method:'GET',
                url:'/my/article/delete/'+ id,
                success:function(res) {
                if(res.status !== 0 ){
                    return layer.msg(res.msg)
                }
                layer.msg(res.msg)
                // !!!当数据删除完成后，判断是否有剩余数据，没有则页码值减 1
                if(len === 1){
                    // 页码值 最小为 1
                    q.pagenum = q.pagenum===1?1:q.pagenum-1
                }
                initTable()
                }
            })
            layer.close(index)

        })
    })

    // ！！！ 8.编辑 文章列表
    $('tbody').on('click', '.btn-edit', function (e) {
        let id  = $(this).attr('data-id')
        // 发起ajax请求，跳转页面并 渲染数据
        $.ajax({
            method:'GET',
            url:'/my/article/' + id,
            success:function (res) {
                if(res.status !== 0){
                    return layer.msg(res.msg)
                }
                console.log(res.data);
                // let data = {
                //     id: res.data.id,
                //     title:res.data.title,
                //     content:res.data.content,
                //     cate_id:res.data.cate_id,
                //     cover_img:res.data.cover_img
                // }     
                //  !!!!! 解决：调用另一框架中的方法
                // 开始一直无法 调用函数，后面发现函数定义要写在入口函数 外部，不然无法挂载
            //     window.parent.$('iframe').eq(0).css('display', 'none')
            //    let parWin = window.parent.$('iframe')[1].contentWindow
            // console.log(parWin);
            //     parWin.editArticle(res.data)
            //     window.parent.$('iframe').eq(1).css('display', 'block')       


            // !!!方法2：把数据挂载在  父窗口中
            // 只用一个框架就可以了，也解决了渲染的问题
            window.parent.data = res.data
            location.href = '/article/art_edit.html'
            }
        })

    })




})
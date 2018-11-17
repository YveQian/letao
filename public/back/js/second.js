
$(function () {
  var currentPage = 1; // 当前页
  var pageSize = 6; // 每页条数
  render()
  function render() {

    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      dataType: 'json',
      data: {
        page: currentPage, // 当前页
        pageSize: pageSize // 每页条数
      },
      success: function (info) {
        console.log(info);
        //渲染模板
        $('tbody').html(template('tabletmp', info));
        //分页插件
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil(info.total / info.size),//总页数
          onPageClicked: function (a, b, c, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }
        });


      }
    })

  }
})
//添加模态框
$(function () {

  $('#addBtn').click(function () {

    $('#addModal').modal("show");

    //点击添加分类的同时,发送AJAX请求
    //将返回的数据添加到一级分类
    $.ajax({
      url: '/category/queryTopCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: 'json',
      success: function (info) {
        console.log(info);

        $('.dropdown-menu').html(template("dropdownTpl", info));

      }
    })
  })



  //给下拉菜单里的a标签,通过事件委托添加事件
  $('.dropdown-menu').on('click', 'a', function () {
    var txt = $(this).text();
    // console.log(txt);
    $('#dropdownText').text(txt);
    // 获取 id, 设置给准备好的 input
    var id = $(this).data("id");
    $('[name="categoryId"]').val(id);

    // $('[name="categoryId"]').trigger("input");

    // 手动将 name="categoryId" 的校验状态, 改成 VALID 校验成功
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID")



  })
  // 4. 进行文件上传初始化
  $('#fileupload').fileupload({
    dataType: "json",
    // 表示文件上传完成的回调函数
    done: function (e, data) {
      console.log(data);
      // 后台返回的结果
      var result = data.result;
      // 获取文件上传的地址
      var picUrl = result.picAddr;
      // 设置给 img 的 src
      $('#imgBox img').attr("src", picUrl);

      // 将src路径, 实时设置给 input
      $('[name="brandLogo"]').val(picUrl);

      // 将 name="brandLogo" 的校验状态, 改成成功
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });
  // 5. 配置表单校验
  $('#form').bootstrapValidator({

    // 配置排序项, 默认会对隐藏域进行排除, 我们需要对隐藏域进行校验
    excluded: [],

    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 校验字段
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },

      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },

      brandLogo: {
        validators: {
          notEmpty: {
            message: "请选择图片"
          }
        }
      }
    }
  })
});

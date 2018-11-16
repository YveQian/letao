/**
 * Created by 54721 on 2018/11/16.
 */
$(function() {

  // 1. 一进入页面, 发送请求, 获取数据进行渲染
  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页条数
  render();

  // 根据 currentPage 和 pageSize 请求对应的数据, 进行渲染
  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        // 根据模板引擎进行渲染
        var htmlStr = template("secondTpl", info );
        $('tbody').html( htmlStr );

        // 进行分页初始化
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3, // 版本号
          totalPages: Math.ceil( info.total / info.size ),
          currentPage: info.page,
          onPageClicked: function( a, b, c, page ) {
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }
        })
      }
    })
  }


  // 2. 点击添加按钮, 显示添加模态框
  $('#addBtn').click(function() {

    // 显示添加模态框
    $('#addModal').modal("show");

    // 发送ajax请求, 获取下拉菜单的列表数据(全部的一级分类)
    // 通过分页获取一级分类的接口, 模拟获取全部数据的接口, page=1, pageSize: 100
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        var htmlStr = template( "dropdownTpl", info );
        $('.dropdown-menu').html( htmlStr );
      }
    })

  });



  // 3. 给下拉菜单的所有 a 添加点击事件, 通过事件委托注册
  $('.dropdown-menu').on("click", "a", function() {
    // 获取 a 的文本
    var txt = $(this).text();
    // 将文本设置给 按钮
    $('#dropdownText').text( txt );

    // 获取 id, 设置给准备好的 input
    var id = $(this).data("id");
    $('[name="categoryId"]').val( id );

    // $('[name="categoryId"]').trigger("input");

    // 手动将 name="categoryId" 的校验状态, 改成 VALID 校验成功
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID")
  });


  // 4. 进行文件上传初始化
  $('#fileupload').fileupload({
    dataType: "json",
    // 表示文件上传完成的回调函数
    done: function( e, data ) {
      console.log( data );
      // 后台返回的结果
      var result = data.result;
      // 获取文件上传的地址
      var picUrl = result.picAddr;
      // 设置给 img 的 src
      $('#imgBox img').attr("src", picUrl );

      // 将src路径, 实时设置给 input
      $('[name="brandLogo"]').val( picUrl );

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


})

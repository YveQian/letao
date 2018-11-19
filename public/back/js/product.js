$(function () {
  var currentPage = 1; // 当前页
  var pageSize = 3; // 每页条数
  var picArr = []; //用于存放上传图片地址
  render()
  function render() {

    $.ajax({
      type: 'get',
      url: '/product/queryProductDetailList',
      dataType: 'json',
      data: {
        page: currentPage, // 当前页
        pageSize: pageSize // 每页条数
      },
      success: function (info) {
        console.log(info);
        //渲染模板
        $('tbody').html(template('proTmp', info));
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
  //添加商品功能
  $('#addBtn').click(function () {
    $('#addModal').modal("show");
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        $('.dropdown-menu').html(template('dropdownTpl', info));


      }

    })
  })
  //通过事件委托,将所有dropdown里面的a添加点击事件
  $('.dropdown-menu').on('click', 'a', function () {

    var txt = $(this).text();

    $('#dropdownText').text(txt);

    //将id存储在隐藏域

    var id = $(this).data('id');
    $('[name="brandId"]').val(id);

    //更改校验状态
    $('#form1').data("bootstrapValidator").updateStatus("brandId", "VALID");
  })
  //实现按钮禁用,启用功能
  $("tbody").on('click', '.pro .btn', function () {
    // alert(1)

    // 显示模态框
    $('#userModal').modal("show");

    // 获取用户 id
    currentId = $(this).parent().data("id");

    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;

  });
  //fileupload图片上传
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      console.log(data);

      var pruobj = data.result;//图片名称和图片地址
      var pruAddr = pruobj.picAddr;

      //将上传的pruAddr存放在pruArr数组中,每次传入都添加到最前面
      picArr.unshift(pruobj);
      //将数组中的对象,添加到imgBox中;
      $('#imgBox').prepend('<img src="' + pruAddr + '" style="height: 100px" alt="">');

      //限制上传数量
      if (picArr.length > 3) {
        pruAddr.pop();
        $('#imgBox img:last-of-type').remove();
      }
      //当图片等于三张,picStatus 状态应该更新成 VALID
      if (picArr.length === 3) {
        // 说明文件上传满 3 张了, picStatus 状态应该更新成 VALID
        $("#form1").data("bootstrapValidator").updateStatus("picStatus", "VALID");
      }


    }
  });
  // 确认按钮被点击, 发送ajax请求, 改变用户状态
  $('#confirmBtn').click(function () {
    $.ajax({
      type: "post",
      //暂时没有接口
      url: "/product/addProduct",
      data: {
        id: currentId,
        isDelete: isDelete
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        if (info.success) {
          // 修改成功
          // 关闭模态框
          $('#userModal').modal("hide");
          // 页面重新渲染
          render();
        }
      }
    })
  })

  //使用表单校验插件
  $('#form1').bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],

    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //3. 指定校验字段
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品名称'
          }
        }
      },
      proDesc: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品描述'
          }
        }
      },
      num: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品库存数量'
          },
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '请输入非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入尺码'
          },
          // 校验需求: 必须是 xx-xx 的格式,  xx两位数字
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '必须是 xx-xx 的格式,  xx两位数字'
          }

        }
      },
      oldPrice: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品原价'
          }
        }
      },
      price: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品现价'
          }
        }
      },
      picStatus: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择3张图片'
          }
        }
      }
    }

  });
  // 6. 注册表单校验成功事件, 阻止默认的提交, 通过 ajax 提交
  $('#form1').on("success.form.bv", function (e) {
    e.preventDefault();

    var params = $('#form1').serialize();  // 获取所有 input 中的数据

    console.log(picArr);
    // 还要加上图片的数据
    // params += "&picName1=xx&picAddr1=xx"
    params += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
    params += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
    params += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;

    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: params,
      dataType: "json",
      success: function (info) {
        console.log(info);
        if (info.success) {
          // 关闭模态框
          $('#addModal').modal("hide");
          // 重新渲染第一页
          currentPage = 1;
          render();
          // 重置内容和状态
          $('#form1').data("bootstrapValidator").resetForm(true);

          // 重置下拉按钮 和 图片内容
          $('#dropdownText').text("请选择二级分类");
          $('#imgBox img').remove();
          // 清空数组
          picArr = [];
        }
      }
    })

  })

})


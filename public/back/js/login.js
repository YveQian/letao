$(function() {

  /*
   * 1. 进行表单校验配置
   *    校验要求:
   *        (1) 用户名不能为空, 长度为2-6位
   *        (2) 密码不能为空, 长度为6-12位
   * */
  $('#form').bootstrapValidator({

    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 配置校验字段  (需要先在 input 中配置name)
    fields: {

      username: {
        // 进行多个规则配置
        validators: {
          // 非空校验
          notEmpty: {
            // 校验提示
            message: "用户名不能为空"
          },
          // 长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名长度必须是2-6位"
          },
          // 配置回调函数的提示信息
          callback: {
            message: "用户名不存在"
          }
        }
      },

      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度必须是6-12位"
          },
          // 配置回调函数的提示信息
          callback: {
            message: "密码错误"
          }
        }
      }

    }

  });

});

$('#form').on("success.form.bv", function( e ) {
  // 阻止默认的表单提交
  e.preventDefault();

  // 通过 ajax 提交
  $.ajax({
    type: "post",
    url: "/employee/employeeLogin",
    // $('#form').serialize() 表单序列化, 快速收集 设置了 name 属性的表单元素值
    data: $('#form').serialize(),
    dataType: "json",
    success: function( info ) {
      console.log( info );
      if ( info.success ) {
        location.href = "index.html";
      }

      if ( info.error === 1000 ) {
        // alert("用户名不存在");
        // 调用插件提供的方法, 将用户名input状态 更新成校验失败状态
        // updateStatus
        // 参数1: 校验字段  username/password
        // 参数2: 校验状态  NOT_VALIDATED(未校验), VALIDATING(校验中), INVALID(失败) or VALID(成功)
        // 参数3: 校验规则, 用来配置错误时的提示信息
        $('#form').data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
      }

      if ( info.error === 1001 ) {
        // alert("密码错误");
        $('#form').data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
      }
    }
  })

});

//重置按钮
$('[type="reset"]').click(function(){

  $('#form').data("bootstrapValidator").resetForm();

});

// $(function(){
//   $('.btn-login').click(function(){
//     var username=$('#username').value;
//     var password=$('#password').value;;
//     $.ajax({
//       url:'/employee/employeeLogout',
//       dataType:'json',
//       data:{
//         username:username,
//         password:password
//       },
//       success:function(info){
//           console.log(info); 
          
//       }
//     })
//   })
// })

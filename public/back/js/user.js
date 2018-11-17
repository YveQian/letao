
$(function(){

  var currentPage = 1;
  var pageSize =6;

  var currentId; // 当前正在修改的用户 id
  var isDelete;  // 需要修改的状态


  render();

  function render(){

    $.ajax({

      url:'/user/queryUser',
      data:{
       page : currentPage,
       pageSize : pageSize
      },
      success:function(info){
          console.log(info);
          $('tbody').html(template('userTmp',info))
          //生成分页
          $("#paginator").bootstrapPaginator({
            bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
            currentPage:info.page,//当前页
            totalPages: Math.ceil( info.total / info.size ),//总页数
            size:"small",//设置控件的大小，mini, small, normal,large
            onPageClicked:function(a, s, d,page){
              //为按钮绑定点击事件 page:当前点击的按钮值
              currentPage=page,
              render()
            }
          });
          
      }
    })


  }

  //实现按钮禁用,启用功能
  $("tbody").on('click','.btn', function(){
    // alert(1)

    // 显示模态框
    $('#userModal').modal("show");

    // 获取用户 id
    currentId = $(this).parent().data("id");

    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;

  });

    // 确认按钮被点击, 发送ajax请求, 改变用户状态
    $('#confirmBtn').click(function() {
      $.ajax({
        type: "post",
        url: "/user/updateUser",
        data: {
          id: currentId,
          isDelete: isDelete
        },
        dataType: "json",
        success: function( info ) {
          console.log( info );
          if ( info.success ) {
            // 修改成功
            // 关闭模态框
            $('#userModal').modal("hide");
            // 页面重新渲染
            render();
          }
        }
      })
    })


})
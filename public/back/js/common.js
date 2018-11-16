



$(document).ajaxStart(function () {
  NProgress.start();
});

$(document).ajaxStop(function () {
setTimeout(function(){

  NProgress.done();

},500)
});

//公共功能
//导航栏点击切换
$(function(){

$('.category').click(function(){
  $(this).next().stop().slideToggle();
});


$('.icon_left').click(function(){
  $('.lt-aside').toggleClass('hidemenu');
  $('.lt-main').toggleClass('hidemenu');
  $('.lt-topbar').toggleClass('hidemenu');
})
//模态框点点击出现
$('.icon_right').click(function(){
  // $('#logoutModal').modal("show");
  $('#logoutModal').modal("show");
})
//点击退出按钮,销毁后台数据,返回主页
$('#logoutBtn').click(function(){
  // alert(1);
  $.ajax({
    type:'get',
    url:'/employee/employeeLogout',
    dataType:'json',
    success:function(info){
      console.log(info);
      if(info.success){
        //退出成功
        location.href="login.html"
      }
    }
  })
})



// $('.nav ul li a').click(function(){

//     $(this).toggleClass("current").silbing().removeClass('current');
// })
// console.log($('.nav ul li'));

})
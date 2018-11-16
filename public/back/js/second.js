
$(function(){

  $.ajax({
    url:'/category/querySecondCategoryPaging',
    type:'get',
    dataType:'json',
    success:function(info){
        console.log(info);
        
    }
  })
})
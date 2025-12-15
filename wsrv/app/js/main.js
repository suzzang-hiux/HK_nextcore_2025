$('a').click(function(e) {
    e.preventDefault();
});

// board 메뉴 탭
const tabschedule = $(".tab_schedule > ul > li");    
const tabscheduleCont = $(".tab_schedule-content");     

//컨텐츠 내용을 숨겨주세요!
tabscheduleCont.hide().eq(0).show();
tabschedule.click(function(e){
    e.preventDefault();
    const target = $(this);         
    const index = target.index();   
    tabmyboard.removeClass("active");    
    target.addClass("active");       
    tabmyboardCont.css("display","none");
    tabmyboardCont.eq(index).css("display","block");
});
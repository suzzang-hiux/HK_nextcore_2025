/*
 *gnb
 */
$(function () {
	
var gnbVm = $portalApp.vueServiceBean({
    el: "#gnbContainer",
    data: {
        userPersonalize : '',
        theme : 'type0',
        showUserInfo: false,
        showUserDropdown: false,
        gnbMenuList: [],
        activeGnbItem : {},
        searchTimer : -1,
        searchView:false,
        searchData:[],
        // 251216 추가
        showGnbScrollBtn: false,
    }
    ,created : function (){
    	var allItems = {"rootNode" :{
            id :'rootNode'
            ,text:'rootNode'
            ,children :[]
            ,state	:{
                opened :true
            }
        }};

        const menuList = G_EP_MENU.gnbMenu;
        
        for(var i =0 ;i < menuList.length ; i++){
            var item = menuList[i];
            var menuId =item.MENU_ID
                ,parentMenuId = item.PARENT_MENU_ID;
            
            item.id = menuId;
            item.pid = parentMenuId;
            item.text = item.MENU_NM;
            item.children = [];
            
            allItems[menuId]  = item; 
                                                
            if(item.pid =='root' || PencakeCustomCTRL.isBlank(item.PARENT_MENU_ID)){
                allItems['rootNode'].children.push(item);
            }else{
                var pItem =allItems[parentMenuId]; 
                if(!PENCAKE_OBJ.isUndefined(pItem)){
                    pItem.children.push(item);
                }
            }
        }

        this.gnbMenuList = allItems.rootNode.children;

        // 251216 추가
        // gnb 메뉴 스크롤 양옆 이동 
        var _this = this;

        setTimeout(function () {
            _this.checkGnbScrollable();
        }, 0);

        $(window).on('resize.gnb', function () {
            _this.checkGnbScrollable();
        });
    }
    ,methods: {
        init: function () {
        	var _this = this; 
        	
        	var theme = $('.wrapper').hasClass('portal') ? 'type1' : 'type0';
            
            try{
            	if (this.userPersonalize) {
                    var userSettingInfo = JSON.parse(this.userPersonalize);
                    if (userSettingInfo.theme) {
                        theme = userSettingInfo.theme;
                    }
                }
            	
            	_this.changeTheme(theme, true);
            }catch(e){
            	// ignore
            	_this.changeTheme(theme, true);
            }
            
            this.initEvt();
        }
        ,initEvt: function () {
            var _this = this;
            
         	// 포탈관리자
            $(".menu-right-area > .dropdown").on("mouseenter", function () {
				$(this).addClass("open");
			}).on("mouseleave", function () {
				$(this).removeClass("open");
			});
        }
     	// 검색 보기.
        ,searchMenu: function () {
            var _this = this;
            
            clearTimeout(this.searchTimer);
            
            // 검색 속도를 높이기 위해 최종 검색어만 검색하게 수정. 
            this.searchTimer = setTimeout(function () {
            	var searchText = document.getElementById("searchText").value;
                
                if(searchText.length < 2){
                	return ; 
                }
                
               	_this.searchView = true;
               	_this.searchData = epMainCtrl.getMenuSearch(searchText);
			}, 200);
        }
        // gnb 메뉴 추가. 
        ,addGnbMenu(item){
            console.log(item);
            this.myMenuSetting();
        }
        // 즐겨찾기 설정
        ,myMenuSetting: function () {
            PencakeCustomCTRL.showModal("/menu/gnb/gnbSetting.html", {
                width: 800,         // 넓이
                height: 590,         // 높이
                showTitle: true,         // 제목 숨김여부
                title: "메뉴관리",
            });
        }
        // 서브 메뉴 열기
        ,openSubMenu:function(item){
            if(this.activeGnbItem.MENU_ID == item.MENU_ID){
                this.closeSubMenu();    
                return; 
            }

            this.activeGnbItem = item;
        }
        // 서브 메뉴 닫기
        ,closeSubMenu(){
        	this.activeGnbItem = {};
        }
        // 검색 닫기
        ,closeSearchResult (){
        	this.searchView = false;
            this.searchData = [];
            var $input = document.getElementById("searchText");
            if ($input) {
                $input.value = "";
            }
        }
        // 테마 변경.
        ,changeTheme: function (theme, initFlag){
        	$('body').attr('data-theme',theme);
        	
        	this.theme = theme;
        	
        	if(initFlag !== true){
	        	PENCAKE_OBJ.personalize.savePersonalize({theme : theme}, function (res){});
        	}
        }
        // 메뉴 열기
       	,openMenu:function (menuId){
       		epMainCtrl.viewMenu(menuId);
       		this.closeSubMenu();
       	}
        // 로그아웃
        ,logout :function (){
	    	PubEPUI.dialog.html("로그아웃 하시겠습니까?",{
                title:"알림", 
                width: '400',
                height:'auto',
                classes: {
                    "ui-dialog": "type-white"
                },
                buttons:{
                    '확인':function (){
                        if(ePortalConfig.runtime =='local'){
                            location.href = PENCAKE_OBJ.getUrl('/logout');
                        }else{
                            location.href = ePortalConfig.context.sso+'/raon/logoutAuto.jsp';
                        }
                    }, 
                    '닫기':function(){
                        PubEPUI.dialog.closeDialog();
                    }
                }
            });
            setTimeout(function(){
                const $btns = $(".ui-dialog-buttonpane button");

                $btns.each(function(){
                    const txt = $(this).text().trim();
                    if(txt === "닫기"){
                        $(this).addClass("black");
                    }
                });
            }, 0);
        }
        // 251216 추가
        // gnb 메뉴 스크롤 양옆 이동 
        ,checkGnbScrollable: function () {
            var el = this.$refs.gnbMenu;
            if (!el) return;

            this.showGnbScrollBtn = el.scrollWidth > el.clientWidth;
        },
        scrollPrev: function () {
            var el = this.$refs.gnbMenu;
            if (!el) return;

            el.scrollLeft -= 200;
        },
        scrollNext: function () {
            var el = this.$refs.gnbMenu;
            if (!el) return;

            el.scrollLeft += 200;
        }
    }
});

$('#gnbContainer').on('click', function (e) {
    e.stopPropagation();
});

$(document).on('click.gnb', function (e) {
    if (!$(e.target).closest('#gnbContainer').length) {
        gnbVm.closeSubMenu();
    }
});

$('iframe').attr('tabindex', '-1').on('focus', function () {
    gnbVm.closeSubMenu();
});

$(window).on('blur', function () {
    gnbVm.closeSubMenu();
});

});
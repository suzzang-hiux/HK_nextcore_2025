window.epMainCtrl ={}

$(function () {
    // PubEP.logWrite(location.pathname, "hkMain", { gubun: "main_screen", gubunkey: "hkMain" });

    var mainScreenContent = {
        menuDescInfo: {},
        init: function () {
            this.initEvt();
        },
        initEvt: function () {
            var _this = this;

            $(".ep_main_background ").on("click", function () {
                _this.mainFrameBg("off", "main");
            });
        },

        mainFrameBg: function (onOff, type) {
            epMainCtrl.menuHide();
        },
    };
    mainScreenContent.init();
});

let G_LOG_VIEW = false;
(function() {
const menuViewer = {
	init(){
        const bizUrl = `${location.protocol}//upridelc.heungkukfire.co.kr:${location.port}/wsrv/menuView.html`;
		$(PencakeCustomCTRL.getBizFrameSelector()).attr('src',bizUrl)	
	}
	,getUrl(){
		if(PencakeCustomCTRL.isSysGA()){
			return '/wsrv/menuView.html'	
		}else if(PencakeCustomCTRL.isSysSFA()){
			return '/wsrv/menuView.html'
		}else{
			return '/wsrv/menuView.html'
		}
	}
	// send post message
	,sendMessage(msgInfo){
		const sendMessageInfo = PubEP.util.objectMerge(msgInfo, PencakeCustomCTRL.defaultPostMessageParam());
		sendPostMessage(sendMessageInfo);
	}
	// 메뉴 open 
	,openMenu (menuInfo){
		var _this = this;
		
		console.log('open menu', menuInfo)
		
		let messageInfo = this.getMenuInfo(menuInfo);
		
		if(PencakeCustomCTRL.isBlank(messageInfo)){
			return ; 
		}
		
		messageInfo = PubEP.util.objectMerge(messageInfo, PencakeCustomCTRL.defaultPostMessageParam());
		
		if(G_LOG_VIEW){
			console.log(messageInfo)
		}
		
		sendPostMessage(messageInfo);
		
	}
	// 메뉴 정보
	,getMenuInfo (openInfo){
		return {
			viewType : 'menu'
			,menuInfo:{
				menuCd: (openInfo.MENU_CD||'')
				,menuNm: (openInfo.MENU_KNM||'')
				,openUrl: (openInfo.MENU_KNM||'')
				,path: (openInfo.idPath||'')
				,pathNm: (openInfo.namePath||'')
				,param: openInfo.SCREEN_PARM
			}
		};
	}
}

function sendPostMessage(messageInfo){
	try{
		var frameObj = $(PencakeCustomCTRL.getBizFrameSelector())[0];
		
		frameObj.contentWindow.postMessage(messageInfo,'*');
	}catch(e){
		console.log(e);
	}
}

menuViewer.init();

window.HK_BIZ_CTRL = menuViewer;

})();
 
/**
 * pencake.custom.js
 * ========================================================================
 */

(function(window) {
'use strict';

if(!window.console){
	var f = function (){};
	window.console = {
		log : f, info:f, warn:f, debug:f, error:f, table:f
	}
}


function log() {
	console.log.apply(console, arguments);
}

var _$base = {},
	isMenuLog = true, // log 남길지 여부.
	isEPMenuLog = true, // ep log 남길지 여부.
	bizFrameSelector = "#epContentViewFrame",
	mainFrameSelector = "#epMainFrame",
	_ePortalConfig = typeof ePortalConfig === "undefined" ? { domain: {}, context: {}, link: {}, userInfo:{} } : ePortalConfig,
	useSsoExtension = false, // 메뉴 클릭시 sso 시간 연장 여부
	_defaultOption = {
		LEGACY: {
			initScreen: false,
			url: PENCAKE_OBJ.getUrl("/menu/view?fn=#fn#"),
		},
	};
	
// 시스템 구분 코드
var SYS_CL_CD = _ePortalConfig.userInfo.sysClcd ||"UP";

function isUndefined(obj) {
	return typeof obj === "undefined";
}
/**
 * @method init
 * @description 설정 초기화.
 */
_$base.init = function(option) {
	$.extend(globalOption, option);
	return _$base;
};

_$base.defaultPostMessageParam = function() {
	return {
		sysinfo : _ePortalConfig.userInfo.sysClcd
		,runtime : _ePortalConfig.runtime
		,userId: _ePortalConfig.userId
		,userNm: _ePortalConfig.userInfo.nm
		,ornCd: _ePortalConfig.userInfo.orncd
		,ornNm: _ePortalConfig.userInfo.ornnm
		,ssoToken: _ePortalConfig.userInfo.ssoToken
	};
};

// 메인 페이지 frame selector
_$base.getMainFrameSelector = function(){
	return mainFrameSelector;
}

// biz 페이지 frame selector
_$base.getBizFrameSelector = function(){
	return bizFrameSelector;
}

// biz dialog frame default url
_$base.getBizDialogFrameUrl= function(){
	return '/wsrv/dialog.html';
}


// ga 인지 여부
_$base.isSysGA = function(){
	return SYS_CL_CD =='GA';
}

// sfa 인지 여부
_$base.isSysSFA = function(){
	return SYS_CL_CD =='SFA';
}

// upride 인지 여부
_$base.isSysUP = function(){
	return SYS_CL_CD =='UP';
}

// 메인 페이지 frame selector
_$base.isBizMenu = function(menuItem, sysClcd){
	if(sysClcd == 'GA'){
		return menuItem.FOLD_YN != '1' && menuItem.USE_YN != 'N' && (menuItem.SCREEN_PARM||'').indexOf('CHILD=Y') == -1;
	}else if(sysClcd == 'SFA'){
		return menuItem.FOLD_YN != '1' && menuItem.USE_YN != 'N' && (menuItem.SCREEN_PARM||'').indexOf('CHILD=Y') == -1;
	}
	
	return !_$base.isBlank(menuItem.SCREEN_CD);
}


function menuIdCheck(menuItem) {
	if(_$base.isSysGA()){
		return _$base.isBizMenu(menuItem, 'GA');
	}else if(_$base.isSysSFA()){
		return _$base.isBizMenu(menuItem, 'SFA');
	}
	
	return _$base.isBizMenu(menuItem, 'UP');
}

// bookmark icon
_$base.favoriteCheckIcon = 'on'; 
_$base.favoriteUnCheckIcon = ''; 

_$base.fnConvertUnderscoreCase = function(str) {
	if (str == "") {
		return str;
	}
	return str
		.split(/(?=[A-Z])/)
		.join("_")
		.toUpperCase();
};

_$base.menu = {
	icon: {
		ETC: "fa fa-file icon_file menu-icon",
		portal: "fa fa-file icon_file menu-icon",
	},
	menuData: function(opt, callbackFn) {
		var ajaxOpt = PubEP.util.objectMerge(
			{
				url: ePortalConfig.context.epplt + "/menu/list",
				method: "get",
			},
			opt
		);

		ajaxOpt.success = function(resData) {
			callbackFn(resData.list);
		};

		PubEP.req.ajax(ajaxOpt);
	},
	getMenuIcon: function(item) {
		return this.icon[item.MENU_TYPE] || this.icon.ETC;
	},
	menuUrl: function(systemCode) {
		systemCode = systemCode || "kofis";

		if (systemCode.indexOf("mypage_") == 0) {
			systemCode = systemCode.replace("mypage_", "");
		}

		return PENCAKE_OBJ.getUrl("/app/user/menuList?systemCode=" + systemCode);
	},
	// bookmark file 여부 체크.
	isBookmarkFile: function(id) {
		id = id+''; 
		
		return id.length == 8 && id.indexOf('00') !=0 && id.indexOf('90') !=0;
	},
	getMenuId: function(menuItem) {
		return menuItem.MENU_CD;
	},
	isMenuId: function(menuItem) {
		return menuIdCheck(menuItem);
	},
	// 메뉴 여부 체크.
	isMenu: function(menuItem) {
		if (menuItem.hasOwnProperty("isMenu")) {
			return menuItem.isMenu;
		}

		if (menuItem.MENU_TYPE == "portal") {
			if (menuItem.PAGE_TYPE == "1" || menuItem.PAGE_TYPE == "3" || menuItem.PAGE_TYPE == "4") {
				// popup, iframe 만 메뉴로 처리.
				menuItem.isMenu = true;
			} else {
				menuItem.isMenu = false;
			}

			return menuItem.isMenu;
		}
		menuItem.isMenu = menuIdCheck(menuItem);

		return menuItem.isMenu;
	},
	isFolder: function(menuItem) {
		if (menuItem.hasOwnProperty("isFolder")) {
			return menuItem.isFolder;
		}
		menuItem.isFolder = !menuIdCheck(menuItem);

		return menuItem.isFolder;
	},
	allTreeMenu: function(allMenu, custFn) {
		var len = allMenu.length;
		var isCustFn = $.isFunction(custFn);

		var allMenuItem = {
			rootNode: {
				id: "rootNode",
				text: "rootNode",
				children: [],
				state: {
					opened: true,
				},
			},
		};
		
		var item;
		var pItem;

		for (var i = 0; i < len; i++) {
			item = allMenu[i];

			var menuId = item.MENU_CD;
			var menuPId = item.UP_MENU_CD;

			item.id = menuId;
			item.pid = menuPId;
			item.text = item.MENU_KNM;
			item.childCount = 0;

			item.children = $.isArray(item.children) ? item.children : [];

			item.isMenu = this.isMenu(item);

			if (item.isMenu) {
				item.icon = this.getMenuIcon(item);
				item.iconStyle = this.getMenuIcon(item);
			}

			if (item.MENU_DEPTH == 1) {
				pItem = allMenuItem["rootNode"];
				item.idPath = menuId;
				item.namePath = item.MENU_KNM;
			} else {
				pItem = allMenuItem[menuPId];

				if (isUndefined(pItem)) {
					item.isEmptyParent = true;
					continue;
				}

				item.idPath = (pItem.idPath || "") + " > " + menuId;
				item.namePath = (pItem.namePath || "") + " > " + item.MENU_KNM;
			}

			if (item.isMenu) {
				var idPathTrim = item.idPath.replace(/\s/g, "");

				for (var idx in idPathTrim.split(">")) {
					var nodeId = idPathTrim.split(">")[idx];
					if (allMenuItem[nodeId]) allMenuItem[nodeId].childCount += 1;
				}
			}

			if (isCustFn) {
				var reval = custFn(item);
				if (reval === false) {
					continue;
				}

				if ($.isPlainObject(reval)) {
					item = reval;
				}
			}

			allMenuItem[menuId] = item;

			if (pItem.children) {
				pItem.children.push(item);
			}
			item = null;
			pItem = null;  
		}
		var rootNodeChildren = allMenuItem["rootNode"].children;
		removeChildEmptyFolder(rootNodeChildren, allMenuItem);

		return allMenuItem;
	},
};

// 메뉴가 없는 폴더 제거.
function removeChildEmptyFolder(nodes, allMenuItem) {
	for (var i = nodes.length - 1; i >= 0; i--) {
		var menuNode = nodes[i];
		
		//delete menuNode.idPath;

		if (menuNode.children.length > 0) {
			removeChildEmptyFolder(menuNode.children, allMenuItem);
		}
		if (!menuNode.isMenu && menuNode.childCount < 1) {
			delete allMenuItem[menuNode.id];
			nodes.splice(i, 1);
		}
	}
}

_$base.viewMenu = {
	// bi menu 호출.
	LEGACY: function(openInfo, viewType) {
		this.enableFrame('legacy');
		
		HK_BIZ_CTRL.openMenu(openInfo);
	}
	,PORTAL: function(openInfo, viewType) {
		var url = "";

		if (openInfo.PAGE_TYPE == "1") {
			url = PENCAKE_OBJ.getUrl("/portlet/render.pencake?page_id=" + openInfo.MENU_CD);
		} else {
			url = PubEP.util.replaceParam(openInfo.MENU_URL,  PubEP.util.objectMerge({userId: ePortalConfig.userId, nmEncode:encodeURIComponent(ePortalConfig.userInfo.nm), ornNmEncode:encodeURIComponent(ePortalConfig.userInfo.ornnm)}, ePortalConfig.domain, ePortalConfig.userInfo));
		}

		if (viewType == "return") {
			return url;
		}

		if (openInfo.PAGE_TYPE == "3") {
			PubEP.page.view(url, "popup", {name : url, viewOption:'width=1280, height=900, location = no, resizable=yes'});
			return ; 
		}

		this._mainFrameView(url);
	},
	// 지정된거 이외.
	OTHER: function(openInfo) {
		PubEP.page.view(openInfo.menuUrl, "popup", {});
		//$(bizFrameSelector).attr('src',openInfo.menuUrl);
	},
	enableFrame :  function (mode){
		var contTypeMap = {
			'biz':'main'
			,'legacy' : 'legacy'
		}
		mode = contTypeMap[mode] ? contTypeMap[mode] :'legacy';
		
		var frameEle = $('.main-content-wrapper[data-cont-type="'+mode+'"]');

		if (localStorage.getItem("epViewMode")) {
			// content view mode 셋팅.
			var viewMode = localStorage.getItem("epViewMode");

			if (viewMode == "top") {
				$("body").attr("data-ep-view-mode", viewMode);
			}
		}

		if (!frameEle.hasClass("on")) {
			$(".main-content-wrapper.on").removeClass("on");
			$(".main-content-wrapper.on").hide();
			frameEle.addClass("on");
			frameEle.show();
		}
	}
	,_mainFrameView: function(url, headerHiddenFlag) {
		this.enableFrame('biz');
		
		if($(mainFrameSelector).attr("data-current-url") == url){
			return; 
		}
		
		$(mainFrameSelector).attr("data-current-url", url);
		$(mainFrameSelector).attr("src", url);

		if (useSsoExtension == true) {
			_$base.ssoExtension();
		}
	},
};

// main frame url 변경하기
_$base.mainFrameView = function(url) {
	_$base.viewMenu._mainFrameView(url);
};

/**
 * @method setWindowObject
 * @description object setting
 */
var currentMenuInfo; // iframe 내부에서 정보를 가져갈수 있게 선언;
_$base.open = function(openInfo, objType, popupFlag) {
	var _this = this;
	
	openInfo = PubEP.util.objectMerge({}, openInfo);

	if (window != parent && (parent || top).PencakeCustomCTRL) {
		(parent || top).PencakeCustomCTRL.open(openInfo, objType, popupFlag);
		return;
	}
	
	if (!isUndefined(openInfo.MENU_CD)) {
		$(bizFrameSelector).attr("data-current-menucode", openInfo.MENU_CD);
	}
	
	if ((openInfo.MENU_TYPE || "").toLowerCase() == "portal") {
		objType = "PORTAL";
	}

	objType = objType || "LEGACY";

	// ep log write
	if (isEPMenuLog === true) {
		if (objType != "PORTAL" || (objType == "PORTAL" && openInfo.isMyPage !== true)) {
			PubEP.logWrite(openInfo.MENU_CD, "popup", { gubun: "gnb_menu", gubunkey: openInfo.MENU_CD });
		}
	}

	if (typeof epMainCtrl !== "undefined" && $.isFunction(epMainCtrl.getMenuInfo)) {
		currentMenuInfo = epMainCtrl.getMenuInfo(openInfo.MENU_CD);
	}

	if (!isUndefined(_this.viewMenu[objType])) {
		_$base.viewMenu[objType].call(_$base.viewMenu, openInfo);
	} else {
		_$base.viewMenu.OTHER(openInfo);
	}
	return;
};

/**
 * biz message 
 */
_$base.bizMessage = function(msgInfo) {
	
	if (window != parent && (parent || top).PencakeCustomCTRL) {
		(parent || top).PencakeCustomCTRL.open(openInfo, objType, popupFlag);
		return;
	}
	
	HK_BIZ_CTRL.sendMessage(msgInfo);
	return;
};

_$base.clickMenu = function() {
	return currentMenuInfo;
};

/**
 * openBroswer 특정 브라우저로만 오픈할때 사용 
 * 
 * type = chrome, ie  // 오픈 브라우저 
 * url =  http://10.118.1.5 // 오픈 url
 * 
 * @code
 * 
 * // ie 에서 타 edge 오픈 브라우저 열기
 * PencakeCustomCTRL.openBroswer({type:'edge',url:'${pageContext.request.contextPath}/admin/mgmtMain'});
 * // ie 외 브라우저에서 ie 열기
 * PencakeCustomCTRL.openBroswer({type:'ie',url:'${pageContext.request.contextPath}/appMgmt/page'})
 */
_$base.openBroswer = function(openOpt) {
	
	var type = openOpt.type
		,url = openOpt.url;
	
	var currentBrowser = $.browser.name; 
	
	if(url.indexOf('http') != 0){
		url = PubEP.util.domain()+url;
	}
	
//	console.log(currentBrowser+' || '+ url+' ll '+ type)
	
	if(type == 'ie'){
		if(currentBrowser != 'msie'){
			url  ='openie'+url;
		}
				
		window.open(url, '_self');
		
		return ; 
	}
	
	if(currentBrowser == 'msie'){
		
		url = 'microsoft-edge:'+url;
		
		location.href = url;
		
		return ; 
	}
	
	window.open(url, '');
};

_$base.isBlank = function(value) {
	if (value === null) return true;
	if (value === "") return true;
	if (typeof value === "undefined") return true;
	if (typeof value === "string" && (value === "" || value.replace(/\s/g, "") === "")) return true;
	return false;
};

function isIE(){
	return $.browser.name =='msie';
}


var POST_MESSAGE_KEY = 'postMessageData';
// post message 상위 부모창에 보내기
_$base.openerMessge = function(message) {
	var msgStr = JSON.stringify(message); 
	localStorage.setItem(POST_MESSAGE_KEY,msgStr);
	opener.postMessage(msgStr,'*')
};


var receiver = function (e){
	
	try{
		var msgObj = {};
		if(e.data == ''){
			var postMessageData = localStorage.getItem(POST_MESSAGE_KEY);
			if(postMessageData){
				try{
					 msgObj = JSON.parse(postMessageData);
				}catch(e){
					
				}
				localStorage.removeItem(POST_MESSAGE_KEY);
			}
		}else{
			if(!$.isPlainObject(e.data)){
				try{
					msgObj = JSON.parse(e.data);
				}catch(e){
					//console.log(e);
				}
			}else{
				msgObj = e.data;
			}
		}
		
		if(!isUndefined(msgObj.fnName) && $.isFunction(window[msgObj.fnName])){
			window[msgObj.fnName](msgObj);
		}
	}catch(e){
		console.log(e);
	}
}; 

// post message 이벤트 등록
if(window.attachEvent){
	window.attachEvent('onmessage', receiver)
}else {
	window.addEventListener('message', receiver ,false)

}

/**
 * ie check
 * true = ie browser , false = ie 이외의 브라우저
 */
_$base.isIE = isIE;

/**
 * 다이얼 로그 창 열기
 * 
 * url = view url
 * opt : 
 	{name :'security_popup',  // 다이얼로그 이름
 	 width :730, 			// 넓이
 	 height: 500, 			// 높이
 	 titleHide:true, 		// 제목 숨김여부
 	 title:'다이얼로그'}		// 제목
 */
var ONLY_DIALOG_OPEN = true; // 다이얼로그 오픈시 브라우저 구분 없이 모두 jquery dialog 오픈 할지 여부.
_$base.showModal = function(url, opt) {
	
	var callback = opt.callback || function (result){};
	
	opt.height = opt.height+'';
	opt.width = opt.width+''; 
	
	var options = $.extend(true, {
		targetId : '_modal_div_frameid_'+PubEP.util.generateUUID().replace(/-/g,'')
		,title : '설정'
		,width : '800'
		,height : '600'
		,scrolling : 'no'
	} ,opt);
	
	
	if(!ONLY_DIALOG_OPEN && isIE()){ // 추후  ie에서 showModalDialog 사용한다고 하면 오픈
		var result1 = window.showModalDialog(url, window, 'dialogWidth:'+options.width.replace('px','')+'px;dialogHeight:'+options.height.replace('px','')+'px; center:1; scroll:1; help:0; status:0');
		callback(result1);
		return result1; 
	}
	
	var _opener = window;
		
	if(typeof top.PencakeCustomCTRL !=='undefined'){
		_opener = top; 
	}else if(typeof parent.PencakeCustomCTRL !=='undefined'){
		_opener = parent; 
	}
	
	var _targetId = options.targetId; 
	
	var modalOption = {
		 modal: true
		, autoOpen : false
		, resizable : false
		, draggable: true
		, close : function (event, ui){
			callback(_opener.$('#'+_targetId).attr('returnValue'));
		}
	}
	
	modalOption = $.extend(true, modalOption, options);
	
	if(_opener.$('#'+_targetId).length < 1){
		_opener.$('body').append('<div id="'+_targetId+'"></div>');
	}
	
	if(_opener.$('#'+_targetId+'iframe').length > 0){
		_opener.$('#'+_targetId).dialog("close");
	}
	
	var dialogHtm;
	
	var frameSelector = _targetId+'iframe'; 
	
	modalOption.width = (modalOption.width+'').replace(/px/,'');
	modalOption.height = (modalOption.height+'').replace(/px/,'');
	
	modalOption.width = modalOption.width =='auto' ? 'auto' : modalOption.width;
	modalOption.height = modalOption.height =='auto' ? 'auto' : modalOption.height;
	modalOption.open =function(){
		_opener.PubEP.page.view(url, "iframe", $.extend({},{param:{targetId : _targetId},target:"#"+frameSelector, gubun:"dialog", gubunkey:"modalDialog", name:decodeURIComponent("modalDialog")}));
	}
	dialogHtm = '<iframe id="'+frameSelector+'" name="'+frameSelector+'" style="text-align:center;width:100%;height:100%;" frameborder="0"></iframe>'; 
	
	_opener.$('#'+_targetId).html(dialogHtm)
		.dialog(modalOption)
		.dialog("open").parent().find('.ui-dialog-title').html('<h1 class="tit">'+options.title+'</h1>');
	
	if(options.cssStyle!=''){
		_opener.$('#'+_targetId).attr('style',options.cssStyle);
	}
	
	if(options.titleHide===true){
		_opener.$('.ui-dialog-titlebar').hide();
	}else{
		_opener.$('.ui-dialog-titlebar').show();
		//_opener.$('.ui-widget-overlay.ui-front').css('height',_opener.$(_opener.document).height());
	}
};

// 업무 다이얼로그 오픈
_$base.openBizDialog = function(data, url, targetId) {
	const viewOption = data.viewOption||{};
	const dialogTargetId = targetId || PubEP.util.generateUUID().replace(/-/g,'');

	const dialogUrl = url || _$base.getBizDialogFrameUrl();

	PencakeCustomCTRL.showModal(dialogUrl, {
		targetId: dialogTargetId,
		width: viewOption.width || 500,         // 넓이
		height: viewOption.height || 300,         // 높이
		showTitle: viewOption.showTitle,         // 제목 숨김여부
		title: viewOption.title || '레이어',
	});

	const dialogFrameElement = $('#'+ dialogTargetId+'iframe');

	// 다이얼로그 frame load 후 메시지 전달
	dialogFrameElement.on('load', ()=>{
			try{
				var frameObj = dialogFrameElement[0];

				frameObj.contentWindow.postMessage({
					viewId : dialogTargetId,
					view : data.view,
					callback: data.callback,
					viewOption :{
						param : (data.viewOption || {}).param
					}
				},'*');
			}catch(e){
				console.log(e);
			}
			dialogFrameElement.off('load')
	})
}


// modal 닫기
_$base.closeModal = function (targetId, returnValue){
	var _opener = window;
	
	if(typeof top.PencakeCustomCTRL !=='undefined'){
		_opener = top; 
	}else if(typeof parent.PencakeCustomCTRL !=='undefined'){
		_opener = parent; 
	}
	
	_opener.$('#'+targetId).attr('returnValue', returnValue);
	
	_opener.$('#'+targetId).dialog("close");
	_opener.$('#'+targetId).dialog("destroy");
	_opener.$('#'+targetId).remove();
}

_$base._getMenuInfo = function(menuId) {
	if (typeof epMainCtrl !== "undefined" && $.isFunction(epMainCtrl.getMenuInfo)) {
		return epMainCtrl.getMenuInfo(menuId);
	}
	return false;
};

_$base.blockBackspace = function() {
	try{
		var killBackSpace = function(e) {
		 e = e ? e : window.event;
		 var t = e.target ? e.target : e.srcElement ? e.srcElement : null;
		 if(t && t.tagName && (t.type && /(password)|(text)|(file)/.test(t.type.toLowerCase()))
		  || t.tagName.toLowerCase() == 'textarea') {
		  return true;
		 }
	
		 var k = e.keyCode ? e.keyCode : e.which ? e.which : null;
		 if(k == 8) {
		  if(e.preventDefault) {
		   e.preventDefault();
		  }
	
		  return false;
		 }
	
		 return true;
		};
	
		if(typeof document.addEventListener != 'undefined') {
		 document.addEventListener('keydown', killBackSpace, false);
		}else if(typeof document.attachEvent != 'undefined') {
		 document.attachEvent('onkeydown', killBackSpace);
		}else {
		 if(document.onkeydown != null) {
		  var oldOnkeydown = document.onkeydown;
		  document.onkeydown = function(e) {
		   oldOnkeydown(e);
		   killBackSpace(e);
		  };
		 }else {
		  document.onkeydown = killBackSpace;
		 }
		}
		window.history.forward();
		history.pushState(null, document.title, location.href);
		window.addEventListener('popstate', function (event){ // 뒤로가기 이벤트 막기
			history.pushState(null, document.title, location.href);
		})
	}catch(e){
		console.log(e);
	}
};

if (typeof window != "undefined") {
	if (typeof window.PencakeCustomCTRL == "undefined") {
		window.PencakeCustomCTRL = _$base;
	}
} else {
	if (!PencakeCustomCTRL) {
		PencakeCustomCTRL = _$base;
	}
}

})(window, jQuery);

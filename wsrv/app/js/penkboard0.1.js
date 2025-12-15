/**
 * pencake.js
 * ========================================================================
 * var 없이 선언 PENCAKE_OBJ 전역변수로 사용 shhan
 */
if (typeof window != "undefined") {
    if (typeof window.PENCAKE_OBJ == "undefined") {
        window.PENCAKE_OBJ = {};
    }
}else{
	if(!PENCAKE_OBJ){
		PENCAKE_OBJ = {};
	}
}


(function( window, $ ) {
	//'use strict';
function log () {
	if(console && console.log){
		console.log.apply(console, arguments)
	}
}

var g_login_error =0; // error count
var pageCallInfo; 		// 재로그인 전 호출 한 페이지 정보. 

PubEP.init({
	loadingImg : '/wsrv/images/common/loading.gif'
	,loadingBgColor:'#ffffff'
	,log :{
		url : ePortalConfig.context.epplt+'/api/logWrite'
		,logWriteKey : [
			'portlet','mainLink','gnb_menu','main_screen','datamgmt','login_log','action_log', 'board_detail'
		]
		,enabled : true
		,param : {
			'userid' : ePortalConfig.userId
		}
	} 
	,openType:{
		'1':'popup'
		,'2':'iframe'
		,'3':'location'
	}
	,defaultPopupPosition : {
		topMargin : 10
		,leftMargin : 0
		,top:4
		,browser : {
			msie : 0
			,mozilla : 10
			,chrome : 0
			,'default' : 10
			,safari : 10
		}
	}
	,beforePageView : function (callbackFn){
		var retryCount =0; 
		callbackFn(true);
	}
}
,{
	timeout : 300000
	,error : function (data, msg,xhr){
		if(data.status==403){
			//PENCAKE_OBJ.loginPopup();
			return ;
		}
		if(data.status==412){
			//PENCAKE_OBJ.loginPopup();
			return ;
		}
		log(data.status);
	}
})

var _$base = {},
_defaultOption ={
	contextPath: (typeof global_page_context_path === 'undefined' ? '/pencake' : global_page_context_path)
	,link :{}
}
,_$board ={
	contextPath : ePortalConfig.context.board
	,ajaxTimeout : 10000
	/*,view: {
		url : ePortalConfig.context.board+'/board/viewPost.do?scrollyn=Y&boardNo=#cat_seq_no#&artNo=#art_seq_no#'
		,popup : 'width=1024,height=768,scrollbars=1, resizable=1'
		,fullPopup : ''
	}*/
	,detail : {
		url : ePortalConfig.context.board+'/board/app/penkBrdDetail?brdType=#type#&brdCode=#code#&docNum=#docNum#&searchField=#searchField#&searchValue=#searchValue#&pageNo=#pageNo#&category=#category#'
		,popup : 'width=1024,height=768,scrollbars=1, resizable=1'
		,fullPopup : ''
	}
	,write : {
		url : ePortalConfig.context.board+'/board/app/penkBrdWrite?brdType=#type#&brdCode=#code#&searchField=#searchField#&searchValue=#searchValue#&pageNo=#pageNo#&category=#category#'
		,popup : 'width=1024,height=768,scrollbars=1, resizable=1'
		,fullPopup : ''
	}
	,update : {
		url : ePortalConfig.context.board+'/board/app/penkBrdUpdate?brdType=#type#&brdCode=#code#&docNum=#docNum#&searchField=#searchField#&searchValue=#searchValue#&pageNo=#pageNo#&category=#category#'
		,popup : 'width=1024,height=768,scrollbars=1, resizable=1'
		,fullPopup : ''
	}
	,customUpdate : {
		url : ePortalConfig.context.board+'/board/app/penkBrdUpdate?brdType=#type#&brdCode=#code#&docNum=#docNum#&searchField=#searchField#&searchValue=#searchValue#&pageNo=#pageNo#&category=#category#&parentYn=#parentYn#&brdAlias=#brdAlias#&parentBrdAlias=#parentBrdAlias#'
		,popup : 'width=1024,height=768,scrollbars=1, resizable=1'
		,fullPopup : ''
	}
	,list : {
		url : ePortalConfig.context.board+'/board/app/penkBrdList?brdType=#type#&brdCode=#code#&scrollyn=Y&searchField=#searchField#&searchValue=#searchValue#&pageNo=#pageNo#&category=#category#'
		,popup : 'width=1024,height=768,scrollbars=1, resizable=1'
		,fullPopup : ''
	}
	,filedown:{
		url : ePortalConfig.context.board+'/board/app/getFileDownload?docNum=#docNum#&fileSeq=#fileSeq#&cmtSeq=#cmtSeq#&attachDiv=#attachDiv#&downFileName=#downFileName#&category=#category#'
		,popup : 'width=1024,height=768,scrollbars=1, resizable=1'
		,fullPopup : ''
	}
	,mgmt_penkbdcd_write : {
		url : ePortalConfig.context.board+'/mgmt/mgmtWrite'
		,popup : 'width=1024,height=768,scrollbars=1, resizable=1'
		,fullPopup : ''
	}
	,param : {
		//게시판 솔루션에 대응하는 파라미터를 수정하여 셋팅한다.shhan 20190326
		category1 :'category1'		//게시판 카테고리.
		, type :'brdType'			// 게시판 타입
		, code :'brdCode'			// 게시판 아이디
		, docNum : 'docNum'				// 글번호
		, searchVal :'searchValue'		// 검색어 
		, searchField :'searchField'	// 필드 
		, pageNo : 'pageNo'		// 페이지 번호
		, countPerPage :'countPerPage'	// 페이지 갯수
		, isImportant: 'isImportant'	// 중요 공지 여부
		, attachDiv: 'attachDiv'	// 첨부 파일 구분
		, boardSortColumn: 'boardSortColumn'	// 첨부 파일 구분
	}
	,paramValue :{
		 pageNo : 1
		, countPerPage : 10
	}
}

function isUndefined(obj){
	return typeof obj==='undefined';
}

_$base.isUndefined = isUndefined; 

_$base.responseCodeCheck = function (resData){
	if(resData.messageCode=='valid'){
		var item = resData.item; 
		if(item.defaultMessage){
			alert(item.defaultMessage)
		}else{
			alert(item.field +' ' + item.code)
		}
		
		return false; 
	} 
	
	return true; 
}

_$base.loginRedirect = function (){
	alert('로그인 되었습니다.\n클릭해주세요.');
	
	g_login_error == 0;
	pageCallInfo = false; 
}
/**
 * @method init
 * @description 설정 초기화.
 */	
_$base.init = function (option){
	PubEP.util.objectMerge(_defaultOption,option);
	return _$base; 
}

/**
 * @method PENCAKE_OBJ.loginPopup
 * @description 로그인 팝업.
 */	
_$base.loginPopup = function (option){
	return PubEP.page.view('/pencake/login/popupLoginPage.jsp?p_userid='+ePortalConfig.userId+'&p_errcode=1001','popup',{name:'ep_re_login', beforeCheck:false,viewOption:'width=500, height=250,scrollbars=0,status=0,toolbar=0,menubar=0,location=0,resizable=1'});; 
}

/**
 * @method PENCAKE_OBJ.getUrl
 * @description url 가져오기.
 */	
_$base.getUrl = function (uri , type){
	if(typeof type !=='undefined'){
		return ePortalConfig.context[type]+uri;
	}else{
		return _defaultOption.contextPath+uri;
	}
}

_$base.isJson = function (str){
	var str = $.trim(str +'');
	
	if(str.match(/^{.*}$/g)){
		return true; 
	}
	
	return false; 
}

_$base.isMenu = function (url){
	var matchObj = url.match(/^NCRM:.*|^SFA:.*|^REPT:.*/);
	return matchObj==null ?false:true;
}

/**
 * @method PENCAKE_OBJ.board
 * @description 게시판 관련 공통.
 */	
_$base.board = {
	contextPath : function (){
		return ePortalConfig.context.board||ePortalConfig.context.epplt || '/pencake';
	}
	// 글 상세보기.
	,viewDetail : function (boardInfo, boardParam, openType){
		openType = openType != 'popup' ?'location' : 'popup';

		PubEP.page.view(this.detailUrl(boardInfo,boardParam) ,openType, {gubun:'board'
			, gubunkey : 'board_'+boardInfo[_$board.param.code]
			,name : 'board_'+boardInfo[_$board.param.docNum]
			,viewOption: _$board.detail.popup
		});

		//게시글 상세보기 클릭시 로그 생성(최근 읽은 게시물)
		PubEP.logWrite(this.detailUrl(boardInfo,boardParam), '' ,{gubun:'board_detail' ,gubunkey: 'viewDetail', logWriteFlag:true});
	}
	// 상세 url
	,detailUrl : function (boardInfo, boardParam){
		var _url = this._setParameter(_$board.detail.url, boardInfo, boardParam);
		return _url;
	}
	// 글 목록 보기
	,viewList : function (boardInfo, boardParam, openType){
		openType = openType != 'popup' ?'location' : 'popup';
		
		PubEP.page.view(this.listUrl(boardInfo, boardParam) ,openType, {gubun:'board'
			, gubunkey: 'board_'+boardInfo[_$board.param.code]
			,name:'board_'+boardInfo[_$board.param.brdType]
			,viewOption: _$board.list.popup
		});
	}
	// 목록 url
	,listUrl : function (boardInfo, boardParam){
		var _url = this._setParameter(_$board.list.url, boardInfo, boardParam);
		return _url;
	}
	,viewWrite : function (boardInfo, boardParam, openType){
		openType = openType != 'popup' ?'location' : 'popup';
		
		PubEP.page.view(this.writeUrl(boardInfo, boardParam) ,openType, {gubun:'board'
			, gubunkey: 'board_'+boardInfo[_$board.param.code]
			,name:'board_'+boardInfo[_$board.param.code]
			,viewOption: _$board.write.popup
		});
	}
	// 글쓰기 url 
	,writeUrl : function (boardInfo, boardParam){
		var _url = this._setParameter(_$board.write.url, boardInfo, boardParam);
		return _url;
	}
	// 글 수정 페이지 보기 
	,viewUpdate : function (boardInfo, boardParam, openType){
		openType = openType != 'popup' ?'location' : 'popup';

		PubEP.page.view(this.updateUrl(boardInfo, boardParam), openType, {gubun:'board'
			, gubunkey: 'board_'+boardInfo[_$board.param.code]
			,name:'board_'+boardInfo[_$board.param.code]
			,viewOption: _$board.update.popup
		});
	}
	// 글 수정 url 
	,updateUrl : function (boardInfo, boardParam){
		var _url = "";
		if(boardParam.parentYn){ //부모 게시판이 있을경우 부모게시판 별칭을 추가해서 넘겨줌
			_url = this._setParameter(_$board.customUpdate.url, boardInfo, boardParam);
		}else{
			_url = this._setParameter(_$board.update.url, boardInfo, boardParam);
		}
		
		return _url;
	}
	// 파일 다운로드.
	,fileDownload : function (boardInfo, boardParam){
		boardParam.downFileName = encodeURIComponent(boardParam.downFileName||'');
		
		location.href=this._setParameter(_$board.filedown.url, boardInfo, boardParam)
	}
	// 파일 다운로드 url
	,fileDownUrl : function (boardInfo, boardParam){
		boardParam.downFileName = encodeURIComponent(boardParam.downFileName||'');
		return this._setParameter(_$board.filedown.url, boardInfo, boardParam);
	}
	// 데이타 받기.
	,getListData : function (boardInfo, boardParam, callbackFn, customOpt){
		
		if(!$.isFunction(callbackFn)){
			return ; 
		}
		customOpt = customOpt ||{};
		
		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+'/board/app/boardListData';
		
		var param = this._convertParam(boardInfo,boardParam);
		
		PubEP.req.ajax({
			url: callUrl
			, loadSelector : param.loadSelector||''
			, data : param
			, timeout : _$board.ajaxTimeout
			, success: function(resData) {
				callbackFn(resData);
			}
			,error : function (xhr){
				callbackFn(resData);
				throw xhr; 
			}
		});
	}
	//알람
	,sendAlarm : function(boardParam, callbackFn){
		
		return ; 
		//TODO
		/*
		if(!$.isFunction(callbackFn)){
			return ; 
		}
		
		PubEP.req.ajax({
			url : ePortalConfig.context.epplt+"/board/sendAlarm"
			,cache : false
			,method : "post"
			,data : boardParam
			,dataType : "json"
			,success : function(resData){
				callbackFn(resData);
			}
			,error : function (resData){
				callbackFn(resData);
			}
		});
		*/
	}
	,getUserListData : function (boardInfo, boardParam, callbackFn, customOpt){
			
		if(!$.isFunction(callbackFn)){
			return ; 
		}
		
		customOpt = customOpt ||{};
		
		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+'/board/app/boardUserListData';
		
		var param = this._convertParam(boardInfo,boardParam);
		
		PubEP.req.ajax({
			url: callUrl
			, loadSelector : param.loadSelector||''
			, data : param
			, timeout : _$board.ajaxTimeout
			, success: function(resData) {
				callbackFn(resData);
			}
			,error : function (xhr){
				callbackFn(resData);
				throw xhr; 
			}
		});
	}

	//게시판 메뉴 네비게이션 조회
	,getBrdCategory : function (boardInfo, boardParam, callbackFn, customOpt){

		if(!$.isFunction(callbackFn)){
			return ; 
		}

		customOpt = customOpt ||{};

		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+'/board/app/brdTreeData';
		var param = this._convertParam(boardInfo,boardParam);
		
		PubEP.req.ajax({
			url: callUrl
			, loadSelector : param.loadSelector||''
			, data : param
			, timeout : _$board.ajaxTimeout
			, success: function(resData) {
				callbackFn(resData);
			}
			,error : function (xhr){
				callbackFn(resData);
				throw xhr; 
			}
		});
	}
	
	//게시판 메뉴 네비게이션 조회
	,getNav : function (boardInfo, boardParam, callbackFn, customOpt){

		if(!$.isFunction(callbackFn)){
			return ; 
		}

		customOpt = customOpt ||{};

		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+'/board/getNav';
		var param = this._convertParam(boardInfo,boardParam);
		
		PubEP.req.ajax({
			url: callUrl
			, loadSelector : param.loadSelector||''
			, data : param
			, timeout : _$board.ajaxTimeout
			, success: function(resData) {
				resData.list =resData.list || [];
				
				if(resData.list.length < 1){
					resData.list.push({pathNm :'', title : ''});
				} 
				
				callbackFn(resData);
			}
			,error : function (xhr){
				callbackFn(resData);
				throw xhr; 
			}
		});
	}

	//키워드 조회
	,getKeyword : function (boardInfo, boardParam, callbackFn, customOpt){

		if(!$.isFunction(callbackFn)){
			return ; 
		}

		customOpt = customOpt ||{};

		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+'/board/app/getKeyword';
		var param = this._convertParam(boardInfo,boardParam);

		PubEP.req.ajax({
			url: callUrl
			, loadSelector : param.loadSelector||''
			, data : param
			, timeout : _$board.ajaxTimeout
			, success: function(resData) {
				callbackFn(resData);
			}
			,error : function (xhr){
				callbackFn(resData);
				throw xhr; 
			}
		});
	}

	//사용자별 키워드 조회
	,getUserKeyword : function (boardParam, callbackFn, customOpt){

		if(!$.isFunction(callbackFn)){
			return ; 
		}

		customOpt = customOpt ||{};

		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+'/board/app/getUserKeyword';
		var param = boardParam;

		PubEP.req.ajax({
			url: callUrl
			, loadSelector : param.loadSelector||''
			, data : param
			, timeout : _$board.ajaxTimeout
			, success: function(resData) {
				callbackFn(resData);
			}
			,error : function (xhr){
				callbackFn(resData);
				throw xhr; 
			}
		});
	}

	//게시글 키워드 whitelist 조회
	,getKeywordWhitelist : function (boardInfo, boardParam, callbackFn, customOpt){

		if(!$.isFunction(callbackFn)){
			return ; 
		}

		customOpt = customOpt ||{};

		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+'/board/app/keywordWhitelist';
		var param = this._convertParam(boardInfo,boardParam);

		PubEP.req.ajax({
			url: callUrl
			, loadSelector : param.loadSelector||''
			, data : param
			, async:false
			, timeout : _$board.ajaxTimeout
			, success: function(resData) {
				callbackFn(resData);
			}
			,error : function (xhr){
				callbackFn(resData);
				throw xhr; 
			}
		});
	}

	//사용자별 키워드 whitelist 조회
	,getUserKeywordWhitelist : function (boardParam, callbackFn, customOpt){

		if(!$.isFunction(callbackFn)){
			return ; 
		}

		customOpt = customOpt ||{};

		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+'/board/app/userKeywordWhitelist';
		var param = boardParam;

		PubEP.req.ajax({
			url: callUrl
			, loadSelector : param.loadSelector||''
			, data : param
			, async:false
			, timeout : _$board.ajaxTimeout
			, success: function(resData) {
				callbackFn(resData);
			}
			,error : function (xhr){
				callbackFn(resData);
				throw xhr; 
			}
		});
	}

	//북마크 저장
	,saveBookmark : function (cmd, params, url, callbackFn, customOpt){

		if(!$.isFunction(callbackFn)){
			return ; 
		}

		customOpt = customOpt ||{};

		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+ url;
		var param = this._convertParam(cmd,params);

		PubEP.req.ajax({
			url: callUrl
			, loadSelector : param.loadSelector||''
			, data : param
			, timeout : _$board.ajaxTimeout
			, success: function(resData) {
				callbackFn(resData);
			}
			,error : function (xhr){
				callbackFn(resData);
				throw xhr; 
			}
		});
	}
	//게시글 조회 이력 저장
	,saveViewLog : function (boardParam, callbackFn, customOpt){
		if(!$.isFunction(callbackFn)){
			return ; 
		}

		customOpt = customOpt ||{};

		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+ '/board/app/saveViewLog';
		
		PubEP.req.ajax({
			url: callUrl
			, loadSelector : boardParam.loadSelector||''
			, data : boardParam
			, timeout : _$board.ajaxTimeout
			, success: function(resData) {
				callbackFn(resData);
			}
			,error : function (xhr){
				callbackFn(resData);
				throw xhr; 
			}
		});
	}
	
	//게시판 정보 조회
	,getBoardInfo : function (boardParam, callbackFn, customOpt){

		if(!$.isFunction(callbackFn)){
			return ; 
		}
		customOpt = customOpt ||{};

		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+ '/board/getBoardInfo';
		
		PubEP.req.ajax({
			url: callUrl
			, loadSelector : boardParam.loadSelector||''
			, data : boardParam
			, timeout : _$board.ajaxTimeout
			, success: function(resData) {
				callbackFn(resData);
			}
			,error : function (xhr){
				callbackFn(resData);
				throw xhr; 
			}
		});
	}
	
	//엑셀다운로드
	,exportExcel : function (boardParam, callbackFn){
		var items = boardParam.items;
		var excelTemplate = boardParam.excelTemplate;
		
		var excelDataList = [];
		for ( var i in items) {
			var item = 	items[i];
			
			var excelItem = {};
			for ( var j in excelTemplate) {
				var templateItem = excelTemplate[j];
				let key = Object.getOwnPropertyNames(templateItem)[0];
				
				excelItem[templateItem[key]] = item[key];
				
			}
			excelDataList.push(excelItem)
            
		}
		
		var wb = XLSX.utils.book_new();
		var newWorksheet = XLSX.utils.json_to_sheet(excelDataList);
		XLSX.utils.book_append_sheet(wb, newWorksheet, 'json');
		var wbout = XLSX.write(wb, {bookType:'xlsx', type:'binary'});
		saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), boardParam.brdDesc+'.xlsx');
		
		function s2ab(s){
			let buf = new ArrayBuffer(s.length);
			let view = new Uint8Array(buf);
			for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
			return buf;
		}
	}

	// 데이타 받기.
	,deleteAttachFiles : function (boardInfo, boardParam, callbackFn, customOpt){
		
		if(!$.isFunction(callbackFn)){
			return ; 
		}
		
		customOpt = customOpt ||{};
		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+'/board/app/deleteAttachFiles';
		
		var param = this._convertParam(boardInfo , boardParam);
		
		PubEP.req.ajax({
			url : callUrl
			, loadSelector : param.loadSelector||''
			, data : param
			, timeout : _$board.ajaxTimeout
			, success : function(resData) {
				//PubEPUI.toast.view({text:'첨부파일이 삭제 되었습니다.'});
				callbackFn(resData);						
			}
			,error:function(resData){
				callbackFn(resData);
			}
		});
	}
	// 데이타 받기.
	,getDetailData : function (boardInfo, boardParam, callbackFn, customOpt){
		
		if(!$.isFunction(callbackFn)){
			return ; 
		}
		
		customOpt = customOpt ||{};
		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+'/board/app/getSelectBoard';
		
		var param = this._convertParam(boardInfo , boardParam);
		
		PubEP.req.ajax({
			url : callUrl
			, loadSelector : param.loadSelector||''
			, data : param
			, timeout : _$board.ajaxTimeout
			, success : function(resData) {
				
				if(resData.resultCode ==404){
					alert('게시글이 존재 하지 않습니다.');
					// PENCAKE_OBJ.board.viewList(boardInfo, boardParam);
					self.close();
					return ; 
				}
				
				var param = {};
				param.brdCd = resData.item.brdCode;
				param.docnum = resData.item.docNum;
				//게시글 상세보기 클릭시 로그 생성
				PENCAKE_OBJ.board.saveViewLog(param, function(){});
				
				callbackFn(resData);
				
				try{
					var targetNode = document.querySelector('div.content'); 
					if(targetNode){
						var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
						var observer = new MutationObserver(function(mutations, observer) {
						    $('div.se-contents a[target="_blank"]').each(function (){
							    var sEle = $(this);
							    var href = sEle.attr('href');
							    sEle.attr('href','javascript:;');
							    sEle.attr('data-href',href);
							    sEle.removeAttr('target');
							})
							
							$('.se-contents a[data-href]').on('click',function (e){
							    var sEle = $(this);
							    var datahref = sEle.attr('data-href');
							    window.open(datahref,"_blank",'toolbar=1,scrollbars=1,location=1,statusbar=0,resizable=1,width=1024,height=768')
							})	
							
							observer.disconnect();
						});
											
						observer.observe(targetNode, {subtree: true, mattributes: true, childList: true });
					}
				}catch(e){
					console.log('detail a tag error',e);
				}
			}
			,error:function(resData){
				callbackFn(resData);
			}
		});
	}
	// 데이타 받기.
	,getCustomDetailData : function (boardInfo, boardParam, callbackFn, customOpt){
		
		if(!$.isFunction(callbackFn)){
			return ; 
		}
		
		customOpt = customOpt ||{};
		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+'/board/getSelectBoard';
		
		var param = this._convertParam(boardInfo , boardParam);
		
		PubEP.req.ajax({
			url : callUrl
			, loadSelector : param.loadSelector||''
			, data : param
			, timeout : _$board.ajaxTimeout
			, success : function(resData) {
				
				if(resData.resultCode ==404){
					alert('게시글이 존재 하지 않습니다.');
					// PENCAKE_OBJ.board.viewList(boardInfo, boardParam);
					self.close();
					return ; 
				}
				callbackFn(resData);
			}
			,error:function(resData){
				callbackFn(resData);
			}
		});
	}
	// 게시글 삭제. 
	,deleteData : function (boardInfo, boardParam, callbackFn, customOpt){
		
		var param = this._convertParam(boardInfo , boardParam);
		
		customOpt = customOpt ||{};
		
		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+'/board/app/setDeleteBoard';
		
		PubEP.req.ajax({
			url : callUrl
			, loadSelector : param.loadSelector||''
			, data : param
			, timeout : _$board.ajaxTimeout
			, success : function(resData) {
				
				if(resData.resultCode==403){
					PubEPUI.toast.view({text:'권한이 없습니다.'});
					return ;
				}
				
				if(!$.isFunction(callbackFn)){
					PENCAKE_OBJ.board.viewList(boardInfo, boardParam);
				}else{
					callbackFn(resData);
				}				
			}
			,error:function(resData){
				callbackFn(resData);
			}
		});
	}
	,
	// 메세지 창 열기
	showConfirmMessage : function(message, confirmEvt, closeEvt){
		var target = $('body > .alert_popup');
		if(target.length == 0){
			var html = [];
			html.push('<div class="alert_popup">');
			html.push(' <p></p>');
			html.push(' <div class="alert_btn2">');
			html.push(' <button class="alert_cancel">취소</button>');
			html.push(' <button class="alert_confirm">확인</button>');
			html.push(' </div>');
			html.push('</div>');
			$('body').append(html.join(''))
			target = $('body > .alert_popup');
		}
		target.find('p').html(message);
		target.show();
		target.addClass('show'); 
		target.find('.alert_confirm').off('click').on('click', confirmEvt);
		target.find('.alert_cancel').off('click').on('click', closeEvt);
		return;
		
	},
	// 메세지 창 닫기
	closeConfirmMessage : function(){
		var target = $('.alert_popup');
		target.hide();
		target.removeClass('show'); 
	},
	// message(alert) 창 열기
	showAlertMessage : function(message, confirmEvt){
		var target = $('body > .message_popup');
		if(target.length == 0){
			var html = [];
			html.push('<div class="message_popup">');
			html.push(' <p></p>');
			html.push(' <div class="message_btn">');            
			html.push(' <button class="message_confirm">확인</button>');
			html.push(' </div>');
			html.push('</div>');
			$('body').append(html.join(''))
			target = $('body > .message_popup');
		}
		target.find('p').html(message);
		target.show();
		target.addClass('show'); 
		target.find('.message_confirm').off('click').on('click', confirmEvt);
		return;
		
	},
	// message(alert) 창 닫기
	closeAlertMessage : function(){
		var target = $('.message_popup');
		target.hide();
		target.removeClass('show'); 
	}
	// 글 저장. 
	,saveData : function (boardInfo, boardParam, callbackFn){
		var formData = new FormData();
		
		if(boardParam.title==''){
			PubEPUI.toast.view({text:'제목을 입력하세요'});
			return {
				code : 'title'
				,errorCode : 'empty'
			}; 
		}
		
		if(boardParam.title.length > 500 ){
			PubEPUI.toast.view({text:'제목은 최대 500자 까지 입력 가능합니다.'});
			return {
				code : 'title'
				,errorCode : 'max-size'
			}; 
		}

		if (!confirm('저장하시겠습니까?')) return;
		
			var fileSelector = boardParam.fileSelector || "input[name=attachFile]"
				,editorSelector = boardParam.editorSelector
				,subCodeList = boardParam.subCodeList;
			
			//첨부파일 넣기
			var filelength=$(fileSelector).length;
			for (var i =0 ; i < filelength ; i++) {
				
				var fileObj;
				if(typeof $(fileSelector)[i].files == 'undefined'){
					fileObj = $(fileSelector)[i];
				}else{
					fileObj = $(fileSelector)[i].files[0];
				}

				if(fileObj){
					formData.append("uploadFile",fileObj);
				}
			}
			
			boardParam.postingStartDt = boardParam.postingStartDt ? boardParam.postingStartDt : '';
			boardParam.postingEndDt = boardParam.postingEndDt ? boardParam.postingEndDt : '';
			
			//20220628 에디터 사용유무 체크 추가
			if(typeof boardParam.editorUse =="undefined" || boardParam.editorUse==""){
				if(!boardParam.surveyYn){
					boardParam.contents= PENCAKE_OBJ.editor.getData(editorSelector);
				}else{
					//설문 표지는 contentDesc에 데이터를 넣는다.
					boardParam.contentDesc= PENCAKE_OBJ.editor.getData(editorSelector);
				}
			}else{
				boardParam.contents= boardParam.contents; //editer 안쓸경우 yjlee 2022.08.29
			}
			$.each(boardParam, function(v){
				 var val = (boardParam[v] == null ? '' : boardParam[v]);
				 boardParam[v] = val;
			})
			$.each(boardParam, function(v){ 
				formData.append(v,boardParam[v]);				
			});
			
			//컬럼 유형별 입력값 처리
			for(var i=0; i <subCodeList.length; i++){
				var subCodeItem = subCodeList[i];	
				var uiType=subCodeItem.COL_UI_TYPE;
				var colNm=subCodeItem.COL_NM;				
				var optLabels=(subCodeItem.OPT_LABEL!=null)?subCodeItem.OPT_LABEL.split(","):subCodeItem.OPT_LABEL;			
				var optValues="";				
				
				if(uiType=='text'){				
					optValues=$('#'+colNm).val();
				}else if(uiType=='selectbox'){	
					optValues=$('#'+colNm).val();
				}else if(uiType=='radio'){
					optValues=$("input[name='"+colNm+"']:checked").val();	
				}else if(uiType=='checkbox'){	
					$(":checkbox[name='"+colNm+"']:checked").each(function(i,e){
						if(optValues == ""){
							optValues = e.value;
						}else{
							optValues += ","+e.value;
						}
					});					
				}else if(uiType=='date'){	
					var dateLen=optLabels.length;
					for(var j=0;j<dateLen;j++){							
						if(optValues == ""){
							optValues =$('#sdate'+j).val();
						}else{
							optValues += ","+$('#sdate'+j).val();
						}						
					}
					
				}			
				formData.append(colNm,optValues);	
			}
			console.log('33333333333x', formData);
			$.ajax({
				type:'POST',
				url : ePortalConfig.context.board+'/board/app/setInsertBoard',
				enctype: 'multipart/form-data',
				processData: false,
				contentType: false,
				cashe: false,
				data: formData,
				beforeSend : function (xhr){
					$('body').centerLoading();
					xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
				},
				success: function(resData){
					// PubEPUI.toast.view({text:'저장 되었습니다.'});
					if(resData.status != 200){
						alert(resData.message);
						return ; 
					}
					
					var resultCode = resData.resultCode; 
					
					if(resultCode > 0){
						if(resultCode==403){
							PubEPUI.toast.view({text:'권한이 없습니다.'});
							return ;
						}else if(resultCode==507){
							PubEPUI.toast.view({text:'파일이 허용된 최대크기를 초과했습니다.'});
							return ;
						}
					}
					
					$('body').centerLoadingClose();

					if(!$.isFunction(callbackFn)){
						PENCAKE_OBJ.board.viewList(boardInfo);
					}else{
						callbackFn(resData);
					}
				}
				,error:function(resData){
					
					PubEPUI.toast.view({text:'등록에 실패 하였습니다.'});
					return ;
						
					if($.isFunction(callbackFn)){
						callbackFn(resData);
					}
				}
			}).done(function (xhr){
				$('body').centerLoadingClose();
			}).fail(function (xhr){
				$('body').centerLoadingClose();
			});
	}
	,customSaveData : function (boardInfo, boardParam, callbackFn){
		var formData = new FormData();
		
		// if (!confirm('저장하시겠습니까?')) return;

			var fileSelector = boardParam.fileSelector || "input[name=attachFile]"
				,editorSelector = boardParam.editorSelector
				,subCodeList = boardParam.subCodeList;
			
			//첨부파일 넣기
			var filelength=$(fileSelector).length;
			for (var i =0 ; i < filelength ; i++) {
				
				var fileObj;
				if(typeof $(fileSelector)[i].files == 'undefined'){
					fileObj = $(fileSelector)[i];
				}else{
					fileObj = $(fileSelector)[i].files[0];
				}

				if(fileObj){
					formData.append("uploadFile",fileObj);
				}
			}
			
			boardParam.postingStartDt = boardParam.postingStartDt ? boardParam.postingStartDt : '';
			boardParam.postingEndDt = boardParam.postingEndDt ? boardParam.postingEndDt : '';
			
			//20220628 에디터 사용유무 체크 추가
			if(typeof boardParam.editorUse =="undefined" || boardParam.editorUse==""){
				boardParam.contents= PENCAKE_OBJ.editor.getData(editorSelector);		
			}else{
				boardParam.contents= boardParam.contents; //editer 안쓸경우 yjlee 2022.08.29
			}

			$.each(boardParam, function(v){ 
				formData.append(v,boardParam[v]);				
			});
			
			//컬럼 유형별 입력값 처리
			for(var i=0; i <subCodeList.length; i++){
				var subCodeItem = subCodeList[i];	
				var uiType=subCodeItem.COL_UI_TYPE;
				var colNm=subCodeItem.COL_NM;				
				var optLabels=(subCodeItem.OPT_LABEL!=null)?subCodeItem.OPT_LABEL.split(","):subCodeItem.OPT_LABEL;			
				var optValues="";				
				
				if(uiType=='text'){				
					optValues=$('#'+colNm).val();
				}else if(uiType=='selectbox'){	
					optValues=$('#'+colNm).val();
				}else if(uiType=='radio'){
					optValues=$("input[name='"+colNm+"']:checked").val();	
				}else if(uiType=='checkbox'){	
					$(":checkbox[name='"+colNm+"']:checked").each(function(i,e){
						if(optValues == ""){
							optValues = e.value;
						}else{
							optValues += ","+e.value;
						}
					});					
				}else if(uiType=='date'){	
					var dateLen=optLabels.length;
					for(var j=0;j<dateLen;j++){							
						if(optValues == ""){
							optValues =$('#sdate'+j).val();
						}else{
							optValues += ","+$('#sdate'+j).val();
						}						
					}
					
				}
				formData.append(colNm,optValues);
			}
			
			$.ajax({
				type:'POST',
				url : ePortalConfig.context.board+'/board/app/setInsertBoard',
				enctype: 'multipart/form-data',
				processData: false,
				contentType: false,
				cashe: false,
				data: formData,
				beforeSend : function (xhr){
					$('body').centerLoading();
					xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
				},
				success: function(resData){
					if(resData.status != 200){
						alert(resData.message);
						return ; 
					}
					
					var resultCode = resData.resultCode; 
					
					if(resultCode > 0){
						if(resultCode==403){
							PubEPUI.toast.view({text:'권한이 없습니다.'});
							return ;
						}else if(resultCode==507){
							PubEPUI.toast.view({text:'파일이 허용된 최대크기를 초과했습니다.'});
							return ;
						}
					}
					
					$('body').centerLoadingClose();

					if(!$.isFunction(callbackFn)){
						PENCAKE_OBJ.board.viewList(boardInfo);
					}else{
						callbackFn(resData);
					}
				}
				,error:function(resData){
					
					PubEPUI.toast.view({text:'등록에 실패 하였습니다.'});
					return ;
						
					if($.isFunction(callbackFn)){
						callbackFn(resData);
					}
				}
			}).done(function (xhr){
				$('body').centerLoadingClose();
			}).fail(function (xhr){
				$('body').centerLoadingClose();
			});
	}

	//getEmoji
	,getEmoji : function(param, boardParam, callbackFn){

		if(!$.isFunction(callbackFn)){
			return ; 
		}
		
		var _emojiUserItems = {
			mUsers : []
			,cUsers : []
		}
		
		var _detailItem = {};
		var _commentList = [];
		
		if(param.emojiDiv == 'M'){
			_detailItem = boardParam;			
		}else{
			_commentList = boardParam;
		}
				
		PubEP.req.ajax({
			url : PENCAKE_OBJ.getUrl('/board/app/getEmoji')
			,data : param
			,dataType: "json"
			,loadSelector : 'body'
			,async : false
			,success: function(resData) {
				if(resData.status != 200){
					alert(resData.message);
					return;
				}
				
				var emojiItems = resData.customs.emojiList || [];
				var emojiUserItems = resData.customs.emojiUserList || [];
				
				_emojiUserItems.mUsers = [];
				_emojiUserItems.cUsers = [];
				
				for ( var i in emojiUserItems) {
					var item = emojiUserItems[i];
					if(item.emojiDiv == 'M'){
						_emojiUserItems.mUsers.push(item);
					}else{
						_emojiUserItems.cUsers.push(item);
					}
				}
				
				if(param.emojiDiv == 'M'){ //본문
					_detailItem.emojiItems = emojiItems;
					_detailItem.emojiItems.users = [];
					var emojiItems = _detailItem.emojiItems;
					
					var mUsers = _emojiUserItems.mUsers;
					var users = [];
					
					for ( var key in emojiItems) {
						var item = emojiItems[key];
						
						if(item.emojiDiv == 'M'){
							for ( var m in mUsers) {
								var mUserItem = mUsers[m];
								
								if(mUserItem.emoji == item.emoji){
									users.push(mUserItem);
								}
							}
							item.users = users;
						}
					}
					_detailItem.emojiItems.users = users;
					callbackFn(_detailItem);
				}else{ //댓글
					var commentList = _commentList;
					
					var cUsers = _emojiUserItems.cUsers;
					
					for ( var k in commentList) {
						var commentItem = commentList[k];
						
						var emojiList = [];
						
						for ( var l in emojiItems) {
							var emojiItem = emojiItems[l];

							if(commentItem.cmtSeq == emojiItem.cmtSeq){
								var users = [];									
								for ( var c in cUsers) {
									var cUserItem = cUsers[c];
									
									if((emojiItem.cmtSeq == cUserItem.cmtSeq) && (emojiItem.emoji == cUserItem.emoji)){
										users.push(cUserItem);
									}
								}
								emojiItem.users = users;
								emojiList.push(emojiItem);
								commentItem.emojiItems = emojiList;
							}
						}
					}
					_commentList = [];
					_commentList = commentList;
					
					callbackFn(_commentList);
				}
			}
			,error : function (resData){
				callbackFn(resData);
			}
		});
	}
	
	//setEmoji
	,setEmoji : function(param, callbackFn){

		if(!$.isFunction(callbackFn)){
			return ; 
		}
		
		PubEP.req.ajax({
			url : PENCAKE_OBJ.getUrl('/board/app/setEmoji')
			,data : param
			,dataType: "json"
			,loadSelector : 'body'
			,async : false
			,success: function(resData) {
				if(resData.status != 200){
					alert(resData.message);
					return;
				}
				callbackFn(resData);
			}
			,error : function (resData){
				callbackFn(resData);
			}
		});
	}

	//북마크 저장
	,saveBookmark : function(boardInfo, boardParam, callbackFn, customOpt){

		if(!$.isFunction(callbackFn)){
			return ; 
		}

		customOpt = customOpt ||{};

		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+'/board/app/saveBookmark';
		var param = this._convertParam(boardInfo,boardParam);

		PubEP.req.ajax({
			url: callUrl
			, loadSelector : param.loadSelector||''
			, data : param
			, timeout : _$board.ajaxTimeout
			, success: function(resData) {
				callbackFn(resData);
			}
			,error : function (xhr){
				callbackFn(resData);
				throw xhr; 
			}
		});
	}
	
	// 댓글 저장
	,commentSave  : function (commentParam, detailItem ,callbackFn){
		var fileSelector = commentParam.fileSelector || "input[name=attachFile]"
			,commentSelector = commentParam.commentSelector ||'#commentContents'
			,replyAnswerSelector = commentParam.commentSelector ||'#replyAnswer';
   	
		var formData = new FormData();
		
	   	//첨부파일 넣기	   
		var filelength=$(fileSelector).length;
		
	   	for (var i =0 ; i < filelength ; i++) {
			var fileObj;
			if(typeof $(fileSelector)[i].files == 'undefined'){
				fileObj = $(fileSelector)[i];
			}else{
				fileObj = $(fileSelector)[i].files[0];
			}

			if(fileObj){
				formData.append("uploadFile",fileObj);
			}
	   	}
	   	
	   	detailItem = PubEP.util.objectMerge({},detailItem);
		//내용 넣기				
		detailItem.attachDiv='comment';					
		detailItem.commentContents=$(commentSelector).val();
		detailItem.answerYn= $('#answerYn').is(':checked') ? 'Y' : 'N';
		
		$.each(detailItem, function(v){ 
			formData.append(v,detailItem[v]);				
		});
		
		$.ajax({	
			type:'POST',
			url:ePortalConfig.context.board+'/board/app/insertComment',
			enctype: 'multipart/form-data',
			processData: false,
			contentType: false,
			cashe: false,
			data: formData,
			beforeSend : function (xhr){
				//$('body').centerLoading();
			},
			success: function(resData){
				//$('body').centerLoadingClose();
				if(resData.status != 200){
					alert(resData.message);
					return ; 
				}
				callbackFn(resData);
			}
			,error:function(resData){
				//$('body').centerLoadingClose();
				callbackFn(resData);
			}
		});	
	}
	// 댓글 수정. 
	,commentModify  : function (commentParam, detailItem ,callbackFn){
		
		var fileSelector = commentParam.fileSelector || "input[name=editAttachFile]"
			,commentSelector = commentParam.commentSelector ||'#commentContents';
		
		var param = PubEP.util.objectMerge({},detailItem, commentParam);
		
		var formData = new FormData();
		
		var filelength=$(fileSelector).length;
	   	for (var i =0 ; i < filelength ; i++) {
	   		var fileObj;
			if(typeof $(fileSelector)[i].files == 'undefined'){
				fileObj = $(fileSelector)[i];
			}else{
				fileObj = $(fileSelector)[i].files[0];
			}

			if(fileObj){
				formData.append("uploadFile",fileObj);
			}
	   	}
      
		$.each(param, function(v){ 
			formData.append(v,param[v]);				
		});
		
		$.ajax({
			type:'POST',
			url:ePortalConfig.context.board+'/board/app/updateComment',
			enctype: 'multipart/form-data',
			processData: false,
			contentType: false,
			cashe: false,
			data: formData,
			beforeSend : function (xhr){
				//$('body').centerLoading();
			},
			success: function(resData){
				//$('body').centerLoadingClose();
				if(resData.status != 200){
					alert(resData.message);
					return ; 
				}
				callbackFn(resData);
			}
			,error:function(resData){
				//$('body').centerLoadingClose();
				callbackFn(resData);
			}
		});	
	}
	//댓글 삭제.
	,commentDelete : function (commentParam, callbackFn){
		
		PubEP.req.ajax({
			url : ePortalConfig.context.board+'/board/app/deleteComment'
			, loadSelector : commentParam.loadSelector||''
			, data : commentParam
			, timeout : _$board.ajaxTimeout
			, success : function(resData) {
				if(resData.status != 200){
					alert(resData.message);
					return ; 
				}
				
				callbackFn(resData);
			}
			,error:function(resData){
				callbackFn(resData);
			}
		});
	}
	// 댓글 목록
	,commentList : function (commentParam, callbackFn){
		
		var param = commentParam;
		
		if(param.cmtSeq == 0){
			//이모지 등록시 본문은 cmtSeq 를 0으로 넣기 때문에 cmtSeq를 삭제 한다.
			delete param.cmtSeq;
		}
		
		PubEP.req.ajax({
			url : ePortalConfig.context.board+'/board/app/selectCommentList'
			, loadSelector : commentParam.loadSelector||''
			, data : commentParam
			, timeout : _$board.ajaxTimeout
			, success : function(resData) {
				if(resData.status != 200){
					alert(resData.message);
					return ; 
				}
				
				callbackFn(resData);
			}
			,error:function(resData){
				callbackFn(resData);
			}
		});
	}
	// comment file delete
	,commentFileDelete : function (commentParam, callbackFn){
		
		PubEP.req.ajax({
			url : ePortalConfig.context.board+'/board/app/deleteCommentAttachFiles'
			, loadSelector : commentParam.loadSelector||''
			, data : commentParam
			, timeout : _$board.ajaxTimeout
			, success : function(resData) {
				if(resData.status != 200){
					alert(resData.message);
					return ; 
				}
				
				callbackFn(resData);
			}
			,error:function(resData){
				callbackFn(resData);
			}
		});
	}
	
	// 이전글 다음글 보기.
	,getDocPrevNext : function (boardInfo, boardParam, callbackFn, customOpt){
		
		if(!$.isFunction(callbackFn)){
			return ; 
		}
		
		customOpt = customOpt ||{};
		var callUrl = !isUndefined(customOpt.url) ? customOpt.url : ePortalConfig.context.board+'/board/app/docPrevNext';
		
		var param = this._convertParam(boardInfo , boardParam);
		
		PubEP.req.ajax({
			url : callUrl
			, data : param
			, success : function(resData) {
				var list = resData.list ||[];
				
				var docInfo = {};
				
				list.forEach(function (item){
					docInfo[item.type] = item; 
				});
				
				var newList = [];
				newList.push(docInfo['prev']||{docnum:-1});
				newList.push(docInfo['next']||{docnum:-1});
				
				resData.list = newList;
				
				callbackFn(resData);
			}
			,error:function(resData){
				callbackFn(resData);
			}
		});
	}
	// 파라미터 변경. 
	,_convertParam : function (boardInfo, boardParam){
		
		var reval ={};
		for(var key in _$board.param){
			if(!isUndefined(boardInfo[key])){
				reval[_$board.param[key]] = boardInfo[key];
			}
		}
		
		for(var key in boardParam){
			reval[key] = boardParam[key];
		}
		
		if(isUndefined(reval[_$board.param.pageNo])){
			reval[_$board.param.pageNo] = _$board.paramValue.pageNo;
		}
		
		if(isUndefined(reval[_$board.param.countPerPage])){
			reval[_$board.param.countPerPage] = _$board.paramValue.countPerPage;
		}
		
		return reval; 
	}
	,_setParameter : function (url, boardInfo, boardParam){
		if(boardParam){
			return PubEP.util.replaceParamUrl(url,PubEP.util.objectMerge({},boardParam,boardInfo));
		}
		return PubEP.util.replaceParamUrl(url,boardInfo);
	}
	,getSubSetDataHtmlTemplate : function (subCodeDataList , opt){
		opt = opt||{};
		var hiddenItem = opt.hiddenItem || [];
		
		var strHtm = [];
		
		for(var i=0; i <subCodeDataList.length; i++){
			var codeData = subCodeDataList[i]; 
			var colDesc=codeData.COL_DESC;
			var colNm=codeData.COL_NM;							
			
			var styleInfo = [];
			if($.inArray(colNm, hiddenItem) > -1){
				styleInfo.push('display: none');
			}
			
			strHtm.push('<tr style="'+styleInfo.join(';')+'"><th>');
			strHtm.push(colDesc);
			strHtm.push('</th><td colspan="3">');												
			strHtm.push((codeData.COL_VALUE ||'').split(",").join('&nbsp;&nbsp;'));
			strHtm.push('</td></tr>');
		}
		
		return {
			template : strHtm.join('')
		};
	}
	// sub code template
	,getSubSetHtmlTemplate : function (subCodeList, subCodeData, opts){
		opts = opts||{};
		var hiddenItem = opts.hiddenItem || [];
		
		var strHtm = [];
		for(var i=0; i <subCodeList.length; i++){
			var subCodeItem = subCodeList[i];
			var uiType=subCodeItem.COL_UI_TYPE;
			var colDesc=subCodeItem.COL_DESC;
			var colNm=subCodeItem.COL_NM;
			var dateLen=0;						
			
			var styleInfo = [];
			if($.inArray(colNm, hiddenItem) > -1){
				styleInfo.push('display: none');
			}
			
			strHtm.push('<tr style="'+styleInfo.join(';')+'"><th>');
			strHtm.push(colDesc);
			strHtm.push('</th><td colspan="3" data-colnm="'+colNm+'">');					
			if(uiType=='text'){			
				strHtm.push('<input type="text" name="'+colNm+'" id="'+colNm+'" value="'+( subCodeData[colNm]|| '' )+'"  >');
			}else{
				
				var optLabels=(subCodeItem.OPT_LABEL!=null)?subCodeItem.OPT_LABEL.split(","):[];		
				var optLabelValus=(subCodeItem.OPT_VALUE!=null)?subCodeItem.OPT_VALUE.split(","):[];		
				dateLen=optLabels.length;
				
				if(uiType=='radio'){		
					for(var j=0;j<dateLen;j++){
						var chkVal=((subCodeData[colNm]||'').match(optLabelValus[j]))?"checked":"";									
						strHtm.push(optLabels[j]+'<input type="radio" name="'+colNm+'" id="'+(colNm+j)+'" value="'+(  optLabelValus[j] || '' )+'" '+chkVal+'><label for="'+(colNm+j)+'" class="mr10" >'+(  optLabelValus[j] || '' )+'</label>&nbsp;&nbsp;');									
					}
				}else if(uiType=='selectbox'){		
					strHtm.push('<select  name="'+colNm+'" id="'+colNm+'">');
					for(var j=0;j<dateLen;j++){
						var chkVal=((subCodeData[colNm]||'').match(optLabelValus[j]))?"selected":"";		
						strHtm.push('<option value="'+optLabelValus[j]+'" '+chkVal+'>'+optLabels[j]+'</option>');								
					}									
					strHtm.push('</select>');								
				}else if(uiType=='checkbox'){
					for(var j=0;j<dateLen;j++){
						var chkVal=((subCodeData[colNm]||'').match(optLabelValus[j]))?"checked":"";
			 			strHtm.push(optLabels[j]+'<input type="checkbox" name="'+colNm+'" id="'+(colNm+j)+'" value="'+(  optLabelValus[j] || '' )+'" '+chkVal+'><label for="'+(colNm+j)+'" class="mr10">'+(  optLabelValus[j] || '' )+'</label>&nbsp;&nbsp;');
					}
				}else if(uiType=='date'){
					var dateVal=(subCodeData[colNm]||'')?subCodeData[colNm].split(","):[];
					
					for(var j=0;j<dateLen;j++){		
						strHtm.push('<label class="control-label">'+optLabels[j]+':</label>');
			 			strHtm.push('<input type="text" name="sdate'+j+'" id="sdate'+j+'" class="datetimepicker custom-date-picker" default="'+ (dateVal[j] || '' ) +'"  style="width:150px;">&nbsp;&nbsp;');	
					}
					
					/*
					for(var j=0;j<dateLen;j++){		
						var dateVal=(((subCodeData[colNm]||'').match(optLabelValus[j]))?"checked":"";
						strHtm.push('<label class="control-label">'+optLabels[j]+':</label>');
			 			strHtm.push('<input type="text" name="sdate'+j+'" id="sdate'+j+'" class="datetimepicker custom-date-picker" default="'+dateVal+'"  style="width:150px;">&nbsp;&nbsp;');	
					}
					*/					
				}
			}
			strHtm.push('</td></tr>');
		}
		
		return {
			template : strHtm.join('')
		}
	}
	// check datepicker field 
	,existsDatepickerField : function (chkSelector){
		return $(chkSelector+' .custom-date-picker').length > 0;
	}
	,getDatepickerFieldLength : function (chkSelector){
		return $(chkSelector+' .custom-date-picker').length;
	}
	//get search field 
	,getSearchField : function (schField){
		return $.inArray(schField , ['01','02','03'] ) > -1 ? schField : '01'
	}
	,initViewSearchData : function (initData){
		
		// 검색 기본 데이터 셋팅. 
		initData.searchField =PENCAKE_OBJ.board.getSearchField(initData.beforeCond.searchField);
		initData.searchValue =initData.beforeCond.searchValue;
		initData.searchCategory = initData.beforeCond.category ||'';
		
		// 검색 이전데 이터 셋팅.
		initData.beforeCond.pageNo =$.isNumeric(initData.beforeCond.pageNo) ? initData.beforeCond.pageNo : 1;
		initData.beforeCond.searchField =initData.searchField;
		initData.beforeCond.searchValue =initData.searchValue;
		
		
		
		return initData; 
	}
	,setViewSearchData : function (initData, param){
		initData.beforeCond.searchField = param.searchField;
		initData.beforeCond.searchValue = param.searchValue;
		initData.beforeCond.pageNo = param.pageNo;
		initData.beforeCond.category = param.category1;
				
		return initData; 
	}
	,userList : function (param, callbackFn){
		PubEP.req.ajax({
			url : ePortalConfig.context.board+'/api/board/userList'
			, loadSelector : param.loadSelector||''
			, data : param
			, success : function(resData) {
				if(resData.status != 200){
					alert(resData.message);
					return ; 
				}
				
				callbackFn(resData);
			}
			,error:function(resData){
				callbackFn(resData);
			}
		});
	}
	,roleList : function (param, callbackFn){
		PubEP.req.ajax({
			url : ePortalConfig.context.board+'/api/board/roleList'
			, loadSelector : param.loadSelector||''
			, data : param
			, success : function(resData) {
				if(resData.status != 200){
					alert(resData.message);
					return ; 
				}
				
				callbackFn(resData);
			}
			,error:function(resData){
				callbackFn(resData);
			}
		});
	}
	,articleAuth : function (param, callbackFn){
		PubEP.req.ajax({
			url : ePortalConfig.context.board+'/api/board/articleAuth'
			, loadSelector : param.loadSelector||''
			, data : param
			, success : function(resData) {
				if(resData.status != 200){
					alert(resData.message);
					return ; 
				}
				
				callbackFn(resData);
			}
			,error:function(resData){
				callbackFn(resData);
			}
		});
	}
	// 게시글 이동.
	,moveDoc : function(item){
		var url = PENCAKE_OBJ.getUrl('/board/app/brdTree?brdCd='+item.brdCode + "&docNum=" + item.docNum);
		PubEP.page.view(url, 'popup',{gubun:'docMovePopup', gubunkey:'',name:'docMovePopup', viewOption:'width=500,height=600'});
	}
}

/**
 * @method PENCAKE_OBJ.util
 * @description utils
 */	
_$base.util = {
	string: {
		getByte : function(string){
			return string.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g,"$&$1$2").length;
		}
		,substring : function(string, endIdx){
			if(string == null || string.length < endIdx){
				return string;
			}
			
			var rtnStr = "";
			var tmpIdx = 0;
			
			for(var i = 0; i < string.length; i++){
				if(tmpIdx >= endIdx){
				    return rtnStr;
				}
				
				if(string[i] != "(" && string[i] != ")"){
					tmpIdx++;
				} 
				
				rtnStr += string[i];
			}
				
			return rtnStr;
		}			
	}
	,isNew:function(valDate){
		
		var retVal=false;
		var today = new Date();  
		var dateString = valDate;  
		  
		var dateArray = dateString.split("-");  
		  
		var dateObj = new Date(dateArray[0], Number(dateArray[1])-1, dateArray[2]);  
		  
		var betweenDay = (today.getTime() - dateObj.getTime())/1000/60/60/24;  
		
		if(betweenDay <=1){
			retVal=true;
		}else{
			retVal=false;
		}
		
		return 	retVal;
	}
	,date :{
		stringFormatter : function (dateStr, pattern){
			if(isUndefined(dateStr) || dateStr==null || dateStr == '') {
				return '';
			}
			dateStr = (dateStr+'').replace(/[-./]/g,'');
			pattern = pattern ||'yyyy-mm-dd';
			
			return PubEP.util.dateFormat(new Date(dateStr.replace(/(\d{4})(\d{2})(\d{2})/g,'$1-$2-$3')) ,pattern);
		}
		,currentDate : function (num , pattern){
			pattern = pattern || 'yyyy-mm-dd'; 
			
			num = isUndefined(num) ? 0 : num; 
			
			return PubEP.util.calcDate(new Date(), num ,pattern); 
		}
		,startEndChk : function (startDt, endDt, currFlag){
			var currnetDt = parseInt(PENCAKE_OBJ.util.date.currentDate().replace(/-/g,''), 10);
			
			
			if(currFlag===true){
				if(startDt < currnetDt){
					return 1; 
				}
			}
			
			if(startDt > endDt){
				return 2; 
			}
			
			return 0; 
		}
	}
}

_$base.editor ={
	init : function (opt){ //ckeditor
		opt = PubEP.util.objectMerge(opt||{},{
	    	imageUploadUrl : PENCAKE_OBJ.getUrl("/imageUpload.do")
	    })
		var url = opt.imageUploadUrl || '';
		
		url = url.indexOf('?') > -1 ? url : url+'?1p1p1ed1=1';
		
		CKEDITOR.replace(this.getEl(opt), {
	    	filebrowserUploadUrl :url
	       // filebrowserImageUploadUrl: 'MacaronicsServlet?command=ckeditor_upload'	
	    });
	}
	,synapInit : function(){
		window.editor = new SynapEditor("pencakeContentEditor", synapEditorConfig);
		$('#'+ editor.id).css('z-index',10);
		
		// 링크 에서 최상위창 , 부모창 옵션 삭제 하기.   
		$('button.se-button[name="link"]').on('click', function (e){
			$('[data-value="_top"],[data-value="_parent"]').remove();
		})
	}
	,getData : function (opt){
		var opt = typeof opt ==='string'? {el : opt} : opt;
		
		var el = this.getEl(opt);
		
		return CKEDITOR.instances[el].getData();
		//return editor.getPublishingHtml();
	}
	,setData : function (opt){
		
		opt = opt ? opt :'';
		
		var opt = typeof opt ==='string'? {data : opt} : opt;
		var _this =this; 
		var el = this.getEl(opt);
		
		CKEDITOR.instances[el].setData(opt.data,{callback  : function(){
			if(_this.getData() != opt.data){
				CKEDITOR.instances[el].setData(opt.data);
			}}
        });
	}
	,getEl : function (opt){
		opt = opt ? opt : 'pencakeContentEditor'; 
		
		return typeof opt==='undefined' ? 'pencakeContentEditor' :(typeof opt ==='string'? opt :  (opt.el || 'pencakeContentEditor'));
	}
}



//확장자 배열
var arrayExp = {
	image       : ['gif', 'png', 'jpg', 'jpeg', 'bmp']
	,document   : ['hwp', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'xls', 'xlsx']
	,joinDoc    : ['hwp', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx']  
	,powerPoint : ['ppt', 'pptx']
	,excel      : ['xls', 'xlsx']
	,msWord     : ['doc', 'docx']
	,adobePdf   : ['pdf']
	,word       : ['hwp']
	,all        : []
};

//파일 확장자 체크
_$base.board.fileExpCheck = function (files, expTypes){
	/**
	 * 파일 확장자 체크
	 * @method fileExpCheck
	 * @param {*} files(mutile file), expTypes(확장자, 여려개일 경우 ',' 찍어서 구분)
	 * @return {*} resultCode    : 결과 코드
				   resultMessage : 결과 메시지
				   result        : true, false 
	 */
	
	if(!$.isArray(files)){
		files = [files];
	}
	
	var result = {
		resultCode : "200"
		,resultMessage : ""
		,result : true
	};
	
	var checkExtArr = arrayExp[expTypes];
	
	if(!checkExtArr){
		checkExtArr = [];
		
		var extTypeArr = expTypes.split(',');
		
		for (var i = 0; i < extTypeArr.length; i++) {
			var extStr = extTypeArr[i]; 
			var tmpExtArr = arrayExp[extStr];
			
			if(!tmpExtArr){
				checkExtArr.push(extStr)
			}else{
				checkExtArr.concat(tmpExtArr);
			}
		}
	}

	for (var i = 0; i < files.length; i++) {
		
		var fileName = files[i];
		var _file = fileName.substring(fileName.lastIndexOf('\\')+1, fileName.length);
		
		var filename; //파일명
		var exp;      //확장자
		
		if(_file.indexOf('.') >= 0){
			filename = _file.substring(0, _file.lastIndexOf('.'));
			exp = _file.substring(_file.lastIndexOf('.')+1, _file.length).toLowerCase();
		}else{
			filename = _file;
			exp = '';
		}
		
		//확장자 없는 파일 return
		if(exp == ''){
			result = {
				resultCode : "404"
				,resultMessage : "선택하신 파일에 확장자가 없습니다."
				,result : false
			};
			return result;
		}
		
		if($.inArray(exp, checkExtArr) == -1){
			result = {
				resultCode : "500"
				,resultMessage : ""
				,result : false
			};
			return result;
		}
	}
	
	return result;
}

//파일 확장자 체크
_$base.board.useFileExt = function (fileName){
	var result = {
		resultCode : false
		,resultMessage : '허용된 확장자가 아닙니다.'
	};
	
	var useFileExt = ePortalConfig.fileupload.useFileExt.toLowerCase();
	var useFileExtList = useFileExt.split('|');

	var fileExt = fileName.substring(fileName.lastIndexOf('.') +1, fileName.length).toLowerCase();
	
	for (var key in useFileExtList) {
		var item = useFileExtList[key];
		
		if(item == fileExt){
			result.resultCode = true;
			result.resultMessage = '허용된 확장자 입니다.'
			break;
		}
	};
	return result;
}
_$base.board.formatBytes = function (bytes, decimals) {
    if (!+bytes) return "0 Bytes";

    decimals = decimals || 2;

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
_$base.board.addAttachFile = function(files, infoList, fileList, fileOrig, fileSize, cmtSeq){
	var items = [];
	var fileItems = [];
	var validate = true;
	var FILE_ORIG = 'FILE_ORIG';
	var FILE_SIZE = 'FILE_SIZE';
	if(fileOrig) FILE_ORIG = fileOrig;
	if(fileSize) FILE_SIZE = fileSize;

	for (var i =0; i <files.length; i++){
		var item = files[i];
		var fileItem = {};
		fileItem[FILE_ORIG] = item.name;
		fileItem[FILE_SIZE] = PENCAKE_OBJ.board.formatBytes(item.size);
		if(cmtSeq){
			fileItem[cmtSeq] = '';
		}
		//  동일 파일명 체크
		var fileCheckList = fileList.filter(function (o) {
			return o.FILE_ORIG == fileItem[FILE_ORIG];
	    });
		if(fileCheckList.length > 0) {
			validate = false;
			PubEPUI.toast.view({text: fileItem[FILE_ORIG] + '는 등록된 파일입니다.'});
			break;
		}
		// 확장자 체크
		var checkedExt = PENCAKE_OBJ.board.useFileExt(fileItem[FILE_ORIG]);
		if(!checkedExt.resultCode){
			validate = false;
			PubEPUI.toast.view({text: checkedExt.resultMessage});
			break;
		}
		items.push(item);
		fileItems.push(fileItem);
	}
	if(validate){
		for(var i=0;i<items.length;i++){
			infoList.push(items[i]);
			fileList.push(fileItems[i]);
		}
	}
}
$.fn.draghover = function(options) {
	return this.each(function() {
	  var collection = $(),
		  self = $(this);
	  self.on('dragenter', function(e) {
		if(collection.length > 0) collection = $();
		self.trigger('draghoverstart');
		collection = collection.add(e.target);
	  });
	  self.on('dragleave drop', function(e) {
		collection = collection.not(e.target);
		if (collection.length === 0) {
		  self.trigger('draghoverend');
		}
	  });
	});
};
_$base.board.initDragAndDropFiles = function(sel){
	//  파일 첨부 드래그앤드랍 설정
	$(window).draghover().on({
		'draghoverstart': function() {
			$(sel).css('background', "border-box #e8e8f8");
		},
		'draghoverend': function() {
			$(sel).css('background', "");
		}
	});
	$(document).on('dragover', sel, function(e){
		if (e.preventDefault) {
			e.preventDefault();
		}
		return false;
	})
	$(document).on('drop', sel, function(e){
		if(e.target._prevClass != sel.substring(1)) {
			var dropEvent = $.Event('drop');
			dropEvent.originalEvent = e.originalEvent;
			$(sel).trigger(dropEvent);
			return;
		}
		$(sel).css('background', "");
		e.stopPropagation();
		e.preventDefault();
		e.target.querySelector('input[type="file"]').files = e.originalEvent.dataTransfer.files;
		e.target.querySelector('input[type="file"]').dispatchEvent(new Event("change"));
	})
}
try{
	if($.isFunction($.fn.MultiFile)){
		$.fn.MultiFile.options.maxfile = ePortalConfig.fileupload.maxUploadSizePerFile/1024;
		$.fn.MultiFile.options.maxsize = ePortalConfig.fileupload.maxUploadSize/1024
		
		$.fn.MultiFile.options.STRING= PubEP.util.objectMerge($.fn.MultiFile.options.STRING,{
			remove: 'x',
			file: '$file',
			selected: 'File selected: $file',
			duplicate: '이미 선택된 파일 입니다.:\n$file',
			toomuch: '선택한 파일이 허용된 최대크기 ($size)를 초과했습니다.',
			toomany: '최대 $max개 까지 업로드 가능합니다.',
			toobig: '$file 용량이 큽니다 (max $size)'
		})
		
		/* $(function(){
			$(".MultiFile-wrap").append('<div class="text-small">( 허용된 확장자 : '+ePortalConfig.fileupload.useFileExt.split('|').join(' ,')+')</div>');
		}) */
	}
}catch(e){};

try{
	if($.isFunction($.fn.datetimepicker)){
		$.fn.datetimepicker.defaults.icons= {
			time: 'glyphicon glyphicon-time',
			date: 'glyphicon glyphicon-calendar',
			up: 'glyphicon glyphicon-chevron-up',
			down: 'glyphicon glyphicon-chevron-down',
			previous: 'icon-left-open',
			next: 'icon-right-open',
			today: 'glyphicon glyphicon-screenshot',
			clear: 'glyphicon glyphicon-trash',
			close: 'glyphicon glyphicon-remove'
		}
	}
}catch(e){};

// pencake 관리자 페이지 디자인 처리.
$(function (){
	if(parent != window && parent.$$btMgmtMainPage ===true){
		$('body.pencake-board .popHeader').remove();
		$('body.pencake-board').removeClass('pencake-board').addClass('frame-content');
		$('html').addClass('frame-content');
	}
	PENCAKE_OBJ.board.initDragAndDropFiles('.attach-file');
})





window.PENCAKE_OBJ = _$base;
})( window ,jQuery);

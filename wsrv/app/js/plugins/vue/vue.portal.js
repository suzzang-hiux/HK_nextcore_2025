/**
 * vue.portal.js v0.0.1
 * ========================================================================
 */
if (typeof window != "undefined") {
    if (typeof window.$portalApp == "undefined") {
        window.$portalApp = {};
    }
}else{
	if(!$portalApp){
		$portalApp = {};
	}
}


var  portalDefaultTemplate = {
  "type1Template": '<table class="query-list-tbl width100">'
			+'<colgroup>'
			+'	<col width="30px">'
			+'	<col width="*">'
			+'	<col width="100px">'
			+'	<col width="150px;">'
			+'</colgroup>'
			+'	<tr v-for="(listItem,index) in list">'
			+'		<td class="click-item">{{index}}</td>'
			+'		<td class="click-item"><a href="javascript:;" :title="listItem[keyInfo.TITLE]" @click="titleClick(listItem)">{{listItem[keyInfo.TITLE]}}</a></td>'
			+'		<td>{{listItem[keyInfo.AUTHOR]}}</td>'
			+'		<td>{{listItem[keyInfo.DATE]}}</td>'
			+'	</tr>'
			+'	<tr v-if="list.length === 0">'
			+'		<td>{{$portalApp.message.empty}}</td>'
			+'	</tr>'
		+'</table>'
	,"portlet1Template": '<ul class="board-list">'
			+'	<li v-for="(listItem,index) in list">'
			+'		<a href="javascript:;" @click="titleClick(listItem)" :title="listItem[keyInfo.TITLE]">{{listItem[keyInfo.TITLE]}}</a> '
			+'		<span :class=\'(listItem[keyInfo.ISNEWYN]=="Y"?"new":"")\'></span><span class="date">{{PubEP.util.dateFormat(listItem[keyInfo.DATE],\"yyyy-mm-dd\")}}</span><span class="dept">{{listItem[keyInfo.DEPT_NM]}}</span>'
			+'	</li>'
			+'</ul>'
	,"portlet2Template": '<ul class="board-list">'
			+'	<li v-for="(listItem,index) in list">'
			+'		<a href="javascript:;" @click="titleClick(listItem)" :title="listItem[keyInfo.TITLE]">{{listItem[keyInfo.TITLE]}}</a> '
			+'		<template v-if="listItem.reply_cnt > 0">'
			+'		<span class="reply-area">[<span class="num">{{listItem.reply_cnt}}</span>]</span>'
			+'		</template>'
			+'		<span :class=\'(listItem[keyInfo.ISNEWYN]=="Y"?"new":"")\'></span><span class="date">{{PubEP.util.dateFormat(listItem[keyInfo.DATE],\"yyyy-mm-dd\")}}</span><span class="dept">{{listItem[keyInfo.DEPT_NM]}}</span>'
			+'	</li>'
			+'</ul>'
	,'pageNavTemplate' : '<ul class="pagination">'
		+'<li :class="((pageInfo.preP_is !== true && pageInfo.currPage <=1)? \'disabled\' :\'\')">'
		+'	<a @click="goPage(pageInfo.currPage - 1)">«</a>'
		+'</li>'
		+'<li v-for="no in range(pageInfo.currStartPage , pageInfo.currEndPage)">'
		+'	<a v-if="no ==pageInfo.currPage" class="on">{{no}}</a>'
		+'	<a v-if="no != pageInfo.currPage" @click="goPage(no)">{{no}}</a>'
		+'</li>'
		+'<li :class="((pageInfo.nextPage_is !== true && pageInfo.currPage ==pageInfo.currEndPage)?\'disabled\':\'\')">'
		+'	<a @click="goPage(pageInfo.currPage + 1)">»</a>'
		+'</li>'
	+'</ul>'
	,'pageNavCustomTemplate' : '<ul class="pagination">'
		+'<li :class="((pageInfo.preP_is !== true && pageInfo.currPage <=1)? \'disabled\' :\'\')">'
		+'	<a @click="goPage(pageInfo.currPage - 1)" class="arrow">＜</a>'
		+'</li>'
		+'<li v-for="no in range(pageInfo.currStartPage , pageInfo.currEndPage)">'
		+'	<a v-if="no ==pageInfo.currPage" class="num active">{{no}}</a>'
		+'	<a v-if="no != pageInfo.currPage" @click="goPage(no)" class="num">{{no}}</a>'
		+'</li>'
		+'<li :class="((pageInfo.nextPage_is !== true && pageInfo.currPage ==pageInfo.currEndPage)?\'disabled\':\'\')">'
		+'	<a @click="goPage(pageInfo.currPage + 1)" class="arrow">＞</a>'
		+'</li>'
	+'</ul>'
	,'pageNavCustomSCGFTemplate' : '<nav class="pagination"><ul>'
		+'<li>'
		+'<a href="#none" @click="goPage(1)" title="맨처음"><i class="icon first size-xs"></i></a>'
		+'</li>'	
		+'<li :class="((pageInfo.preP_is !== true && pageInfo.currPage <=1)? \'disabled\' :\'\')">'
		+'	<a href="#none" @click="goPage(pageInfo.currPage - 1)" title="이전"><i class="icon leftarrow size-xs"></i></a>'
		+'</li>'
		+'<li v-for="no in range(pageInfo.currStartPage , pageInfo.currEndPage)" :class="{ active : no == pageInfo.currPage }">'
		+'	<a href="#none" v-if="no ==pageInfo.currPage" class="active">{{no}}</a>'
		+'	<a href="#none" v-if="no != pageInfo.currPage" @click="goPage(no)" class="">{{no}}</a>'
		+'</li>'
		+'<li :class="((pageInfo.nextPage_is !== true && pageInfo.currPage ==pageInfo.currEndPage)?\'disabled\':\'\')">'
		+'	<a href="#none" @click="goPage(pageInfo.currPage + 1)" title="다음"><i class="icon rightarrow size-xs"></i></a>'
		+'</li>'
		+'<li>'
		+'<a href="#none" @click="goPage(pageInfo.totalPage)" title="맨마지막"><i class="icon last size-xs"></i></svg>'
		+'</a>'		
	+'</ul></nav>'
};

(function( Vue ,portalDefaultTemplate, $) {

Vue.config.devtools = true;
Vue.prototype.$ajax = PubEP.req.ajax;
	
$portalApp.message ={
	empty : '데이타가 없습니다.'
}

Vue.component('modal', {
  template: '#modal-template'
})




// list component add
Vue.component('list-cont', {
	created :function() {
		var templateName = this.listType+'Template';
		var templateCont = portalDefaultTemplate[templateName]; 

		if(typeof templateCont ==='undefined'){
			templateCont  = portalDefaultTemplate['type1Template'];
		}

		this.$options.template = templateCont;
	}
	,props: {
		list : Array,
		listType : String, 
		columnKey : Object
	}
	,data:function(){
		var sortOrders = {};

		var keyInfo = Vue.util.extend({
			'TITLE' : 'art_title'
			,'AUTHOR' : 'AUTHOR'
			,'DATE' : 'str_write_date'
			,'DEPT_NM' : 'deptname'
			,'ISNEWYN' : 'is_new_yn'
			,price : 'price'
			,active : 'active'
			,imgSrc : 'imgSrc'
		},this.columnKey);

		return {
			keyInfo : keyInfo
		}
	}
	,methods: {
		titleClick:function(item) {
			this.$parent.detailItem = item;
			
			if(typeof this.$parent.titleClick !=='undefined'){
				this.$parent.titleClick.call(this.$parent,item);
			}
		}
	}
})

// page navigation component add 
Vue.component('page-navigation', {
	template: portalDefaultTemplate.pageNavTemplate,
	props: {
		pageInfo : Object
		,callback : String
	}
	,methods: {
		range : function (start, end) {

			if(typeof start ==='undefined') return [];

			var reArr = [];

			for(start ; start <= end;start++){
				reArr.push(start);
			}

			return reArr;
		}
		,goPage : function (pageNo) {

			if(pageNo < 1){
				pageNo =1; 
				return ; 
			}
			
			if(pageNo > this.pageInfo.totalPage){
				pageNo= this.pageInfo.totalPage; 
				return ; 
			}

			if(this.pageInfo.currPage == pageNo){
				return ; 
			}
			this.pageInfo.currPage = pageNo;

			
			var callback = this.$parent[this.callback];
			
			if(typeof callback === 'undefined'){
				callback = this.$parent['srvs_goPage'];
			}

			callback.call(null,pageNo);
		}
	}
})

// page navigation component add 
Vue.component('page-custom-navigation', {
	template: null,
	props: {
		pageInfo : Object
		,callback : String
		,pageType : String
	},
	created : function(){
		var pageType = '';
		if(this.$options.propsData.pageType){
			pageType = this.$options.propsData.pageType;
		}
		this.$options.template = portalDefaultTemplate['pageNavCustom'+pageType+'Template'];
	}
	,methods: {
		range : function (start, end) {

			if(typeof start ==='undefined') return [];

			var reArr = [];

			for(start ; start <= end;start++){
				reArr.push(start);
			}

			return reArr;
		}
		,goPage : function (pageNo) {

			if(pageNo < 1){
				pageNo =1; 
				return ; 
			}
			
			if(pageNo > this.pageInfo.totalPage){
				pageNo= this.pageInfo.totalPage; 
				return ; 
			}

			if(this.pageInfo.currPage == pageNo){
				return ; 
			}
			this.pageInfo.currPage = pageNo;

			
			var callback = this.$parent[this.callback];
			
			if(typeof callback === 'undefined'){
				callback = this.$parent['srvs_goPage'];
			}
			
			var pageNav = $(this.$el);
			if(pageNav.length > 0 && pageNav.closest('.pencake-list-box')){
				var customScrollEl = pageNav.closest('.pencake-list-box').find('.custom-scroll'); 
				if(customScrollEl.length > 0){
					customScrollEl.scrollTop(0)
				}
			}
			callback.call(null,pageNo);
		}
	}
})

// page navigation component add 
Vue.component('editor-content', {
	template: '<div :style="{height:contentHeight +\'px\'}"></div>',
	props: {
		id: {
			type: String,
			required: true,
			default: "editorContFrame"
		}
		,editContent : {
			type: String
			, default :''
		}
		,marginBottom : {type: Number, default: 50 }
		,contentHeight : {type: Number, default: 10 }
		,contentCss : {type: Array ,
			default :['/wsrv/js/plugins/editor/contents.css', '/wsrv/js/plugins/editor/plugins/preview/styles/screen.css']
		}
	}
	,mounted : function() {
		this.setContent(this.editContent, false);
	}
	,watch: {
	    // 질문이 변경될 때 마다 이 기능이 실행됩니다.
		editContent: function (newVal) {
			if(newVal ==''){
				return ; 
			}
			
			this.setContent(newVal , true);
	    }
	}
	,methods: {
		setContent : function (editVal , modifyFlag){
			
			if(modifyFlag === false && editVal ==''){
				return ; 
			}
			
			this.$el.innerHTML = '<iframe id="'+this.id+'" style="position:relative;width:100%;border:0px;" scrolling="yes"></iframe>';
			
			var contFrameEle = document.getElementById(this.id);
			
			var parentFnName = 'fn_' +PubEP.util.generateUUID().replace(/-/gi,'');
			
			var _this =this; 
			
			window[parentFnName] = function (val){
				_this.contentHeight = val; 
				contFrameEle.style.height = _this.contentHeight +'px'; 
				//delete window[parentFnName];
			}
			
			var contHtm = [];
			contHtm.push('<!doctype html><html dir="ltr"><head>');
			contHtm.push('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><meta charset="UTF-8" />');
			
			for (var i =0 ;i < this.contentCss.length;i++){
				contHtm.push('<link type="text/css" rel="stylesheet" href="'+this.contentCss[i]+'">');
			}
			contHtm.push('<style>body{margin:0px;overflow-x:auto;overflow-y:hidden;width:100%;font-size:15pt;font-family:"NotoSansR", Malgun Gothic, "맑은고딕", sans-serif;}</style>');
			contHtm.push('</head><body class="cke_editable" onload="pageLoad(\'first\')">');
			contHtm.push(editVal);
			
			contHtm.push('<script>');
			contHtm.push('if (!Element.prototype.matches) {');
			contHtm.push('		Element.prototype.matches = Element.prototype.msMatchesSelector ||');
			contHtm.push('		Element.prototype.webkitMatchesSelector;');
			contHtm.push('}');
			contHtm.push('var marginBottom = '+_this.marginBottom+', beforeHeight = 0, beforeWidth = 0;');
			contHtm.push('var dBody =document.body;');
			contHtm.push('function pageLoad(mode){');
			contHtm.push('	var winH = Math.max(dBody.scrollHeight, dBody.offsetHeight, dBody.clientHeight);');
			contHtm.push('	var winW = window.innerWidth;');
			
			contHtm.push('	winH = winH+ marginBottom;');
			contHtm.push('	var resizeFlag = false;');
			contHtm.push('	if(mode=="first"){ ');
			contHtm.push('		resizeFlag = true; ');
			contHtm.push('	}else{ ');
			contHtm.push('		if(beforeHeight != winH  && beforeWidth !=winW){');
			contHtm.push('			resizeFlag = true; ');
			contHtm.push('		}');
			contHtm.push('	}');
			contHtm.push('	if(resizeFlag){ ');
			contHtm.push('		beforeHeight = winH; ');
			contHtm.push('		beforeWidth = winW; ');
			contHtm.push('		parent.'+parentFnName+'(beforeHeight);');
			contHtm.push('	}');
			contHtm.push('}');
			contHtm.push('window.addEventListener("resize", pageLoad, false);');
			contHtm.push('document.addEventListener("contextmenu", function (e){ if(!e.target.matches("img") && window.getSelection().toString() == ""){e.preventDefault(); return false;} }, false);');
			
			contHtm.push('</script>');
			
			contHtm.push('</body></html>');
			
			var frameDoc = contFrameEle.contentWindow.document; 
			try{frameDoc.open();}catch(e){console.log(e)}
			
			frameDoc.write(contHtm.join(''));
			
			try{frameDoc.close();}catch(e){console.log(e)}
		}
	}
})

/**
 * @method $portalApp.addTemplate 
 * @description 템플릿 add
 */	
$portalApp.addTemplate  = function (template){
	if($.isPlainObject(template)){
		for(var key in template){
			if(typeof portalDefaultTemplate[key] ==='undefined'){
				portalDefaultTemplate[key]= template[key];
			}
		}
	}
}

/**
 * @method $portalApp.addMessage
 * @description 메시지 add
 */	
$portalApp.addMessage = function (msg){
	for(var key in msg){
		$portalApp.message[key]= msg[key];
	}
}


var defaultOpt = {
	el: '#epViewArea'
	,data: {
		$$initPortletFlag : false
		,detailItem :{}
	}
	,mounted  : function() {
		var el = this.$options.el ; 
		
		$(el).removeClass('vue_selector');
	
		this.init();
		this.evts_init();
		
		var portletElId = el + ePortalConfig.userId;
		
		if(localStorage.getItem(portletElId) == 'Y'){
			$(el).addClass('folding');
			this.$$initPortletFlag = false; 
		}else{
			this.srvs_getData();
			this.$$initPortletFlag = true; 
		}
		
		if(typeof this.search ==='function'){
			this.search();
		}
    }
	,methods:{
		init : function (){}
		,portletToggleMinimize : function (){
			var sEle =event.target; 
			
			var secEle = $(sEle).closest('section.portlet');
			
			var elid = this.$options.el + ePortalConfig.userId;
			
			if(secEle.hasClass('folding')){
				if(this.$$initPortletFlag ===false){
					this.srvs_getData();
				}
				secEle.removeClass('folding');
				localStorage.removeItem(elid);
			}else{
				secEle.addClass('folding');
				
				localStorage.setItem(elid,'Y');
			}
		}
	}
	,evts :{
		init : function (){}
		,fieldClear : function (){
			this.detailItem = {};
		}
	}
	,computed:{		
	}
	,srvs :{
		getData: function (no){}
		,goPage : function (no){
			this.srvs_getData(no);
		}
	}
}
/**
 * @method addMethod 
 * @description vue method 추가.
 * @param prefix
 * @param opts
 * @param methodObj
 * @returns
 */
function addMethod(prefix , opts){
	var methodObj = opts[prefix]; 
	
	if(typeof methodObj !=='undefined'){
		for(var key in methodObj){
			opts.methods[prefix+'_'+key] = methodObj[key];
		} 
		delete opts[prefix];
	}
	return opts; 
}

var addMethodKey = ['evts','srvs'];
$portalApp.vueServiceBean = function (opts){
	var _evts = {} 
		,_srvs = {};
	
	var initOpt = {};
	var initMethodName = '';
		
	if(typeof opts['mounted'] !=='undefined'){
		initOpt = {methods :{}};
		initMethodName = 'fn'+PubEP.util.generateUUID().replace(/-/g,'');
		initOpt.methods[initMethodName] = defaultOpt.mounted;
	}	
	   
	opts = PubEP.util.objectMerge(initOpt,defaultOpt,opts);
	
	opts.methods = opts.methods ||{};
	
	for(var i =0 ;i <addMethodKey.length ;i++){
		var methodKey = addMethodKey[i]; 
		addMethod(methodKey, opts);
	}
	
	var vueObj = new Vue(opts);
	
	return vueObj;
}
})(Vue , portalDefaultTemplate, jQuery);
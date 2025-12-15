

if (typeof window != "undefined") {
    if (typeof window.pencakeCalendar == "undefined") {
        window.pencakeCalendar = {};
    }
}else{
	if(!pencakeCalendar){
		pencakeCalendar = {};
	}
}

;(function() {
	"use strict";
var GRID_LAYOUT_ELEMENT = false;
var START_SUPPORT_YEAR = 1901;
var END_SUPPORT_YEAR = 2049;
var _datastore ={};
var DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
var DEFAULT_TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm';
var DEFAULT_TIME_FORMAT = 'HH:mm';
var _defaultOptions = {
	mode: 'S' // S=양력, L=음력
	,enableFooterTooltip: false // 하단 정보 보여질지여부
	,isEmbed: false		// layer or innerhtml
	,changeDate: function (dt){}
	,zIndex : 1000
};

function miniCalendar(selector, opt){

	this.options = PubEP.util.objectMerge({}, _defaultOptions, opt);
	this.options.mode = (this.options.mode||'S').toUpperCase();
	this.orginSelector = selector;
	
	if(typeof opt === 'undefined' || typeof _datastore[selector] !=='undefined'){
		return _datastore[selector]; 
	}
		
	if(this.options.isEmbed){
		this.selector = selector;
		this.element = $(selector);
	}else{
		this.selector = '#cal'+getHashCode(selector);

		if(GRID_LAYOUT_ELEMENT === false){
			$('body').append('<div class="pub-mini-calendar-hidden-area"></div>');
			GRID_LAYOUT_ELEMENT = $('.pub-mini-calendar-hidden-area');
		}
		
		if(GRID_LAYOUT_ELEMENT.find(this.selector).length < 1){
			GRID_LAYOUT_ELEMENT.append('<div id="'+this.selector.replace(/#/,'') +'" class="calendar-layer"></div>')
			this.element = $(this.selector);
		}
	}
	
	this.config = {
		currentYYYY:''
		, currentMM:''
		, initViewDt: opt.viewDt ? opt.viewDt :moment().format(DEFAULT_DATE_FORMAT)  
	};
	
	this.config.initViewYyyyMm = this.config.initViewDt.substring(0,7);
	
	this.init();
	_datastore[selector] = this;
	
}

miniCalendar.prototype = {
	init : function (){
		this.create();
		this.initEvent();
	}
	,setCalendarMode : function (mode){
		this.options.mode = mode;
	}
	,initEvent : function (){
		var _this = this; 
		
		if(!this.options.isEmbed){
			if($(this.orginSelector)[0].tagName.toUpperCase() == 'INPUT'){
				
				
				var beforeDt = '';
				$(this.orginSelector).off('click.pencake blur.pencake');
				$(this.orginSelector).on('click.pencake', function (e){
					var sEle = $(this);
					var offset = sEle.offset();
					
					beforeDt = sEle.val();
					
					if(!_this.element.hasClass('on')){
						_this.element.addClass('on');

						_this.element.css({
							top: offset.top+sEle.height()+10
							,left: offset.left
							,'z-index' : _this.options.zIndex
						})
	
						_this.setDayHtml(sEle.val());
					}
				}).on('blur.pencake',function (e){
					var sEle = $(this);
					
					var val = sEle.val();
					
					if(val == beforeDt){
						return ; 
					}
					
					var dt = moment(removeSpecialChar(val), 'YYYYMMDD');
					
					var year = dt.format('YYYY');
					if(year > END_SUPPORT_YEAR || year < START_SUPPORT_YEAR){
						sEle.val(beforeDt);
						alert('지원하는 날짜 범위를 벗어났습니다.\n'+ START_SUPPORT_YEAR+'년~'+END_SUPPORT_YEAR+'년 사이로 입력해주세요.');
						sEle.select();
						return ; 
					}
					
					if(!dt.isValid()){
						alert('날짜 및 시간 형식에 맞체 입력해주세요.\n예)2022-12-01');
						sEle.val(beforeDt);
						sEle.focus();
						return ; 
					}
					
					beforeDt = dt.format(DEFAULT_DATE_FORMAT);
					sEle.val(beforeDt);
					
					if(_this.options.changeDate){
						_this.options.changeDate(beforeDt);
					}
				})
			}
		}

		var viewDtEle = this.element.find('.pubcalendar_view_dt');
		this.element.find('.pubcalendar-move-btn').on('click', function (e){
			var sEle = $(this);
			var mode= sEle.attr('_mode');

			var year = parseInt(viewDtEle.data('year'),10);
			var month = parseInt(viewDtEle.data('month'),10);

			if(mode =='p'){
				if(month ==1){
					month = 12;
					year -= 1;
				}else{
					month -= 1;
				}
			}else{
				if(month == 12){
					month = 1;
					year += 1;
				}else{
					month += 1;
				}
			}

			_this.setDayHtml(year+'-'+day2(month)+'-'+'01');
		})

		// 날짜 선택 레이어
		var yyyyEle = this.element.find('.select-yyyy-data');
		var mmEle = this.element.find('.select-mm-data');
		var selectYyyyymmDataEle = this.element.find('.select-yyyymm-data');
		this.element.find('.select-yyyymm-btn').on('click', function (e){
			
			if(selectYyyyymmDataEle.hasClass('on')){
				selectYyyyymmDataEle.removeClass('on');
			}else{
				selectYyyyymmDataEle.addClass('on');
			}

			var yyPos = yyyyEle.find('.select-yyyy-item[data-year="'+_this.config.currentYYYY+'"]').position().top + yyyyEle.scrollTop() - yyyyEle.position().top;
			var mmPos = mmEle.find('.select-mm-item[data-mm="'+_this.config.currentMM+'"]').position().top + mmEle.scrollTop() - mmEle.position().top;

			yyyyEle.scrollTop(yyPos); 
			mmEle.scrollTop(mmPos);
		})

		// 닫기 선택
		this.element.find('.layer-close').on('click', function (e){
			selectYyyyymmDataEle.removeClass('on');
		})

		// 년도 선택
		this.element.find('.select-yyyy-item').on('click', function (e){
			_this.element.find('.select-yyyy-item.on').removeClass('on');
			$(this).addClass('on');
		})

		// 월 선택
		this.element.find('.select-mm-item').on('click', function (e){
			_this.element.find('.select-mm-item.on').removeClass('on');
			var sEle = $(this); 

			sEle.addClass('on');

			var year = _this.element.find('.select-yyyy-item.on').data('year');
			var mm = sEle.data('mm');

			_this.setDayHtml(year+'-'+day2(mm)+'-'+'01')

			selectYyyyymmDataEle.removeClass('on');
		})

		// 하단 툴팁
		if(this.options.enableFooterTooltip === true){
			this.element.find('.pubcalendar_body').on('mouseenter','.pubcalendar-day-item', function (e){
				var sEle = $(this);
	
				_this.footerTooltipElement.empty().html((_this.options.mode=='L' ? '양력' : '음력')+' : '+sEle.attr('data-toolipdt'));
			})
		}
		
		// 날짜 클릭
		this.element.find('.pubcalendar_body').on('click.select','.pubcalendar-day-item', function (e){
			var sEle = $(this);

			var dt = sEle.data('dt');

			if(!_this.options.isEmbed){
				_this.element.removeClass('on');
			}

			_this.options.changeDate(dt);
		})
	}
	,create : function (){
		
		var calHTML  = [];
		
		this.element.empty().html('');
		
		
		calHTML.push('<div class="mini-pubcalendar">');
		calHTML.push('	<div class="pub-mini-cal-header">');
		calHTML.push('	  <a href="javascript:;" class="pubcalendar-move-btn" _mode="p">');
		calHTML.push(' 		<i class="icon leftarrow size-xs"></i> ');
		calHTML.push('    </a> ');

		calHTML.push('	  <span class="pubcalendar_year_wrap">');
		calHTML.push('		<span class="pubcalendar_view_dt" data-year="" data-month=""></span>');
		calHTML.push('		<a href="javascript:;" class="select-yyyymm-btn toggle"></a>');
		calHTML.push('	  </span>');
		calHTML.push(' 	  <a href="javascript:;" class="pubcalendar-move-btn" _mode="n"> ');
		calHTML.push('       <i class="icon rightarrow size-xs"></i> ');
		calHTML.push(' 	  </a> ');
		calHTML.push('	  <div class="select-yyyymm-data">');
		calHTML.push('	   <div class="schedule_modal-box">');
		
		calHTML.push('		<ul class="select-yyyy-data custom-scroll">');
		for(var i =START_SUPPORT_YEAR; i<=END_SUPPORT_YEAR; i++){
			calHTML.push('		<li class="select-yyyy-item" data-year="'+i+'">'+i+'</li>');
		}
		calHTML.push('		</ul>');
		calHTML.push('		<ul class="select-mm-data custom-scroll">');
		for(var i =1;i<=12;i++){
			calHTML.push('		<li class="select-mm-item" data-mm="'+i+'">'+i+'</li>');
		}
		calHTML.push('		</ul>');
		calHTML.push('	   </div>');
		calHTML.push('	  </div>');
		calHTML.push('	</div>');
		calHTML.push('	<table class="mini-pubcalendar-tbl">');

		calHTML.push(' <colgroup>');
		for (var i=0; i< 7; i++ ){
			calHTML.push('  <col style="min-width:30px;text-align:center;">');
		}
		calHTML.push('  </colgroup>');

		calHTML.push('  <thead><tr>		');
		calHTML.push('		<td valign="top" class="pub-calendar-red">일</td>		');
		calHTML.push('		<td valign="top" class="">월</td>		');
		calHTML.push('		<td valign="top" class="">화</td>		');
		calHTML.push('		<td valign="top" class="">수</td>		');
		calHTML.push('		<td valign="top" class="">목</td>		');
		calHTML.push('		<td valign="top" class="">금</td>		');
		calHTML.push('		<td valign="top" class="pub-calendar-blue">토</td>		');
		calHTML.push('	  </tr></thead>');
		
		calHTML.push('	<tbody class="pubcalendar_body">');
		calHTML.push('</tbody>');

		if(this.options.enableFooterTooltip ===true){
			calHTML.push('<tfoot><td colspan="7"><div class="footer-tooltip"></div></td></tfoot>');
		}
		
		calHTML.push("</table></div>");
		
		this.element.empty().html(calHTML.join(''));

		if(this.options.enableFooterTooltip === true){
			this.footerTooltipElement = this.element.find('.footer-tooltip');
		}

		calHTML.push(this.setDayHtml(this.options.viewDt));
	}
	,setDayHtml : function (viewDt){

		if(!viewDt){
			viewDt = moment().format(DEFAULT_DATE_FORMAT)
		}

		var dt = getDateInfo(viewDt);

		var year=dt.year, month=dt.month;
		
		year = parseInt(year,10);
		month = parseInt(month,10);

		if(year > END_SUPPORT_YEAR || year < START_SUPPORT_YEAR){
			alert('지원하는 날짜 범위를 벗어났습니다.');
			return ; 
		}
		
		this.config.currentYYYY = year;
		this.config.currentMM = month;
		this.options.viewDt = viewDt;

		if(this.options.mode =='L'){
			this.lunarDayHtml(year, month);
		}else{
			this.solarDayHtml(year, month);
		}

		if(this.options.enableFooterTooltip === true){
			this.footerTooltipElement.empty();
		}
	}
	//음력 달력.
	,lunarDayHtml : function (year, month){
		
		var solarFirstDt = getLunarDayToSolarDay(year+'-'+day2(month)+'-01');
		var startDayNum = moment(solarFirstDt.yyyy_mm_dd).day()-1;
		var lunYearInfo = pubLunYearInfo(year);
		var lunMonthEndDays = lunYearInfo.monthEndDays;
		var viewLunMonthEndDays =[];
		var lunMonthIdx;
		
		// 음력 시작 마지막날 구하기.
		for(var j =0; j<2; j++){
			for(var i =0; i<lunMonthEndDays.length; i++){
				var endDayInfo = lunMonthEndDays[i];

				if(endDayInfo.y == year && endDayInfo.m == month){
					//console.log(startDayNum, 'endDayInfo ', i, endDayInfo)
					
					if(startDayNum == -1){
						lunMonthIdx = i; 
						viewLunMonthEndDays.push(lunMonthEndDays[i]);
						break; 
					}else{
						if(i == 0){
							lunMonthEndDays = pubLunYearInfo(year).monthEndDays;
							lunMonthIdx = lunMonthEndDays.length-1;
							viewLunMonthEndDays.push(lunMonthEndDays[lunMonthEndDays.length-1]);
						}else{
							lunMonthIdx = i-1;
							if(lunMonthEndDays[i-1].isLeap){
								if(lunMonthIdx == 0){
									viewLunMonthEndDays.push(pubLunYearInfo(year-1).monthEndDays[pubLunYearInfo(year-1).monthEndDays.length-1]);
								}else{
									viewLunMonthEndDays.push(lunMonthEndDays[i-2]);
								}
								viewLunMonthEndDays[0] = JSON.parse(JSON.stringify(viewLunMonthEndDays[0]));
								viewLunMonthEndDays[0].nextLeap = true; // 다음달 윤달 정보 추가.
							}else{
								viewLunMonthEndDays.push(lunMonthEndDays[i-1]);
							}
						}
					}
					break; 
				}
			}

			if(viewLunMonthEndDays.length > 0){
				break;
			}
			lunYearInfo = pubLunYearInfo(year+1);
			lunMonthEndDays = lunYearInfo.monthEndDays;
		}

		var startInfo = viewLunMonthEndDays[0];

		//console.log(startInfo, lunMonthIdx, lunMonthEndDays.length,'viewLunMonthEndDays.length',viewLunMonthEndDays.length, viewLunMonthEndDays)

		for (var i = 1; i <= 3; i++) {
			lunMonthIdx++;
			if(lunMonthEndDays[lunMonthIdx]){
				viewLunMonthEndDays.push(lunMonthEndDays[lunMonthIdx]);
			}else{
				lunMonthIdx =-1;
				lunYearInfo = pubLunYearInfo(year+1);
				lunMonthEndDays = lunYearInfo.monthEndDays;
			}
		}

		var startYear = startInfo.y, startMonth = startInfo.m, startLastDay = startInfo.d;
		var thirdPrintDay;
		var solStartDt;
		if(startDayNum==-1){
			solStartDt = solarFirstDt.yyyy_mm_dd;
			thirdPrintDay = 1;
		}else{
			thirdPrintDay= (startLastDay- startDayNum);
			solStartDt = getLunarDayToSolarDay(startYear+'-'+day2(startMonth)+'-'+thirdPrintDay).yyyy_mm_dd;
		}

		var lunStartMonthIdx = 0;
		var startDt = moment(solStartDt);
		var calHTML =[];

		var dateItem; 
		var idx = 0; 
		var beforeStartInfo;
		for (var i=0; i< 42; i++ ){
			dateItem = startDt.clone().add(idx, 'days');
			var tooltipDt = dateItem.format(DEFAULT_DATE_FORMAT);

			var tempTodayDate = startYear +'-'+ day2(startMonth) +'-'+ day2(thirdPrintDay);
				
			if(i%7==0){
				calHTML.push((i==0?'':'</tr>')+'<tr>');
			}
			
			calHTML.push('<td class="pubcalendar-day-item" data-toolipdt="'+tooltipDt+'" data-dt="'+tempTodayDate+'">');
			calHTML.push('<a href="javascript:;" class="'+(i%7==0?'pub-calendar-red':'')+'">');
			calHTML.push(thirdPrintDay);
			calHTML.push('</a>'); 
			calHTML.push('</td>');
			
			if(thirdPrintDay == startLastDay){
				thirdPrintDay = 1; 

				beforeStartInfo = startInfo;
				startInfo = viewLunMonthEndDays[++lunStartMonthIdx];
				
				if(startInfo.isLeap){ // 윤달 체크.
					
					startYear = startInfo.y;
					startMonth++;
					startLastDay++;

					var solarDt = getLunarDayToSolarDay(startYear+'-'+day2(startMonth)+'-01');
					idx = -1;
					startDt = moment(solarDt.yyyy_mm_dd);
				}else{
					startYear = startInfo.y;
					startMonth = startInfo.m; 
					startLastDay = startInfo.d;
				}

				if(beforeStartInfo.isLeap ||beforeStartInfo.nextLeap){
					var solarDt = getLunarDayToSolarDay(startYear+'-'+day2(startMonth)+'-01');
					idx = -1;
					startDt = moment(solarDt.yyyy_mm_dd);
				}
			}else{
				thirdPrintDay++;
			}
			idx++;
		}

		calHTML.push('</tr>');

		this.element.find('.pubcalendar_body').empty().html(calHTML.join(''));

		var viewDtEle = this.element.find('.pubcalendar_view_dt');

		viewDtEle.data('year', year);
		viewDtEle.data('month', month);

		viewDtEle.empty().html(year+'.'+day2(month));

		this.element.find('.select-yyyy-item.on').removeClass('on');
		this.element.find('.select-yyyy-item[data-year="'+this.config.currentYYYY+'"]').addClass('on');
		this.element.find('.select-mm-item.on').removeClass('on');
		this.element.find('.select-mm-item[data-mm="'+this.config.currentMM+'"]').addClass('on');
	}
	// 양력 달력.
	,solarDayHtml : function (year, month){
		
		var startDt = moment(year+'-'+day2(month)+'-01').startOf('week');

		var viewDateArr = getSolarToLunarDayInfo({startDt : startDt.format(DEFAULT_DATE_FORMAT), endDt : startDt.add(41, 'days').format(DEFAULT_DATE_FORMAT) });

		var _tdate = this.options.viewDt
			,thirdPrintDay=1;
		var viewYyyyMm = _tdate.substring(0,7);
		
		var calHTML =[];

		var viewDate; 
		for (var i=0; i< viewDateArr.length; i++ ){
			viewDate = viewDateArr[i];

			var tempTodayDate = viewDate.yyyy_mm_dd
			thirdPrintDay = viewDate.day;
			if(i%7==0){
				calHTML.push((i==0?'':'</tr>')+'<tr>');
			}
			
			var boldClass='';
			if(viewYyyyMm == this.config.initViewYyyyMm){
				if( tempTodayDate==this.config.initViewDt){
					boldClass='today';	
				}
			}else if (_tdate == tempTodayDate){
				boldClass='today';
			}
			
			calHTML.push('<td class="pubcalendar-day-item" data-toolipdt="'+viewDate.lunYmd+'" data-dt="'+tempTodayDate+'">');
			calHTML.push('<a href="javascript:;" class="'+boldClass+' '+(i%7==0?'pub-calendar-red':'')+'">');
			calHTML.push(thirdPrintDay);
			calHTML.push('</a>'); 
			calHTML.push('</td>');
		}

		calHTML.push('</tr>');

		this.element.find('.pubcalendar_body').empty().html(calHTML.join(''));

		var viewDtEle = this.element.find('.pubcalendar_view_dt');

		viewDtEle.data('year', year);
		viewDtEle.data('month', month);

		viewDtEle.empty().html(year+'.'+day2(month));

		this.element.find('.select-yyyy-item.on').removeClass('on');
		this.element.find('.select-yyyy-item[data-year="'+this.config.currentYYYY+'"]').addClass('on');
		this.element.find('.select-mm-item.on').removeClass('on');
		this.element.find('.select-mm-item[data-mm="'+this.config.currentMM+'"]').addClass('on');
	}
	,destroy:function (){
		$(this.selector).empty().remove();
		delete _datastore[this.orginSelector];
	}
}

function getSolarToLunarDayInfo(dateInfoItem){
	var startDt,endDt;
	
	if(typeof dateInfoItem ==='string'){
		startDt = dateInfoItem;
		endDt = dateInfoItem;
	}else{
		startDt = dateInfoItem.startDt;
		endDt = dateInfoItem.endDt||startDt;
	}

	if(startDt instanceof Date){
		startDt = dateToString(startDt);
	}else{
		startDt = removeSpecialChar(startDt);
	}

	if(endDt instanceof Date){
		endDt = dateToString(endDt);
	}else{
		endDt = removeSpecialChar(endDt);
	}
	
	var anniversaryMapInfo = getAnniversaryInfo(dateInfoItem.anniversary ||[]);
	
	var annvrsryMap = anniversaryMapInfo.anniversary;
	var exceptionAnnvrsryMap = anniversaryMapInfo.exception;

	if(parseInt(startDt,10) > parseInt(endDt,10)){
		throw new Error('Start date cannot be greater than end date.')
	}

	if(parseInt(endDt,10) > parseInt(END_SUPPORT_YEAR+'1231',10)){
		throw new Error('Out of date range supported. end date : '+ formatDate(endDt) +', support date : '+formatDate(END_SUPPORT_YEAR+'1231'));
	}
	
	var viewDateArr = getViewDayInfo(formatDate(startDt), formatDate(endDt));
	var dateLen = viewDateArr.length;
	var tmpDayInfo;

	var div = document.createElement("div");
	div.setAttribute('class','fc-custom-anniversary');
	
	for (var i=0; i < dateLen; i++){
		tmpDayInfo = viewDateArr[i];
		
		// 기념일 정보
		tmpDayInfo.anniversary = getMemorialDay(annvrsryMap, exceptionAnnvrsryMap, tmpDayInfo);

		if(tmpDayInfo.anniversary.length > 0){
			// full-calendar 에 기념일 영역 추가.
			var dataEle = document.querySelector('[data-date="'+tmpDayInfo.yyyy_mm_dd+'"] .fc-daygrid-day-top');
	
			if(dataEle){
				var customAnniversaryEle = dataEle.querySelector('.fc-custom-anniversary');
				var node;

				if(customAnniversaryEle){
					node = customAnniversaryEle; 
				}else{
					node = div.cloneNode(true);
					dataEle.append(node);
				}
				
				if(tmpDayInfo.anniversary.length > 0){
					var anniversaryItem = tmpDayInfo.anniversary[0];
					var anniversaryItems = tmpDayInfo.anniversary;
					for(var k =0; k<anniversaryItems.length; k++){
						var item =anniversaryItems[k];
						
						if(item.year == tmpDayInfo.year){
							anniversaryItem = item;
							break; 
						}
						
						if(item.isHoliday){
							anniversaryItem = item
						}
					}
				
					var dayNumEle =dataEle.querySelector('.fc-daygrid-day-number');
	
					if(anniversaryItem.isHoliday){
						dayNumEle.classList.add("holiday");
						node.classList.add("holiday");
					}else{
						dayNumEle.classList.remove("holiday");
						node.classList.remove("holiday");
					}
					node.innerText = anniversaryItem.name;
					//node.innerText = tmpDayInfo.lunYear +'-'+tmpDayInfo.lunMonth+'-'+tmpDayInfo.lunDay;//anniversaryItem.name;	
				}
				
			}
		}		
	}

	return viewDateArr;
}

// 음력 날짜 계산
function getLunarDayToSolarDay(date){
		
	var lunYear, lunMonth ,lunDay;

	if(date instanceof Date){
		lunYear = date.getFullYear()
		,lunMonth= date.getMonth()+1
		,lunDay = date.getDate();
	}else{
		date = date.replace(/[-/.]/g,'');
		lunYear = parseInt(date.substring(0,4),10);
		lunMonth= parseInt(date.substring(4,6),10);
		lunDay = parseInt(date.substring(6,8),10)
	}
	
	var solYear = lunYear;
	var lunYearInfo = pubLunYearInfo(lunYear);
			
	if(lunYearInfo.yearEnd.m < lunMonth 
		|| (!lunYearInfo.yearEnd.isLeap && lunYearInfo.yearEnd.m == lunMonth && lunYearInfo.yearEnd.d < lunDay) // 마지막 달이 윤달 일 경우 체크
	){
		solYear +=1;
		lunYearInfo = pubLunYearInfo(solYear);	
	}
	
	var lunMonthEndDays = lunYearInfo.monthEndDays;

	var lunElapseDay;
	if(lunYearInfo.yearStart.y == lunYear && lunYearInfo.yearStart.m == lunMonth){
		lunElapseDay = lunDay - lunYearInfo.yearStart.d + 1;
	}else{
		lunElapseDay = lunMonthEndDays[0].d+1-lunYearInfo.yearStart.d + lunDay;
		
		for(var i=1; i < lunMonthEndDays.length; i++){
			var lunMonthEndItem = lunMonthEndDays[i]; 
		
			if(lunMonthEndItem.y == lunYear && lunMonthEndItem.m == lunMonth){
				break;
			}
			lunElapseDay += lunMonthEndItem.d;
		}
	}
		
	var monthArr = getMonthLastDayArr(solYear);
	var solMonth=0;
	for (; solMonth<monthArr.length; solMonth++){
		if(lunElapseDay <= monthArr[solMonth]){
			break;
		}else{
			lunElapseDay -= monthArr[solMonth];
		}
	}

	var solDay = lunElapseDay;
	var solarDt = (solYear+'-'+(day2(solMonth+1))+'-'+day2(solDay));
	
	return {
		year : solYear, month:(solMonth+1), day: solDay
		,yyyy_mm_dd : solarDt
		,lunYmd : formatDate(date)
	}; 
}

// 기념일 정보.
function getAnniversaryInfo(anniversaryInfos){
	var annvrsryMap = {};
	var exceptionAnnvrsryMap = {};
		
	for(var i =0; i<anniversaryInfos.length; i++){
		var annvrsryItem = anniversaryInfos[i];
		var dt = annvrsryItem.date+ (annvrsryItem.isLunar===true?'L':'');

		if(annvrsryItem.isLunar===true && annvrsryItem.date.startsWith('_')){
			exceptionAnnvrsryMap[annvrsryItem.date] = [annvrsryItem];
		}

		if(typeof annvrsryMap[dt] === 'undefined'){
			annvrsryMap[dt] = [annvrsryItem]; 
		}else{
			annvrsryMap[dt].push(annvrsryItem); 
		}
	}

	return {
		anniversary : annvrsryMap
		,exception : exceptionAnnvrsryMap
	};
}

function getDateInfo(dt){
	dt = removeSpecialChar(dt);

	return {
		year : dt.substring(0,4)
		,month : dt.substring(4,6)
		,day : dt.substring(6,8)
	}
}

function removeSpecialChar(dt){
	return dt.replace(/[-/.]/g,'');
}

function formatDate(dt){
	return dt.substring(0,4)+'-'+dt.substring(4,6)+'-'+dt.substring(6,8);
}

function dateToString(dt){
	return String(dt.getFullYear()) +day2(dt.getMonth() + 1)+''+day2(dt.getDate());
}

// 기념일 추출.
function getMemorialDay(mdi, exceptionAnnvrsryMap, dayInfo){
	//양력일 기념일 추출
	var reval = [];

	var monthStr = day2(dayInfo.month);
	var dayStr = day2(dayInfo.day);

	var tmpMdi = exceptionAnnvrsryMap['_'+dayInfo.lunMonth+'E'];
	
	if(tmpMdi && dayInfo.isEndDay){
		reval = reval.concat(tmpMdi);
	}
	
	tmpMdi = mdi[day2(dayInfo.month)+''+dayStr];
	
	if(tmpMdi) {
		reval = reval.concat(tmpMdi);
	}
	
	// 년도 포함 기념일 추출
	tmpMdi = mdi[dayInfo.year+''+monthStr+''+dayStr];
	if(tmpMdi) {
		reval = reval.concat(tmpMdi);
	}

	//음력일 기념일 추출
	tmpMdi = mdi[day2(dayInfo.lunMonth)+''+day2(dayInfo.lunDay)+'L'];
	if(tmpMdi) {
		reval = reval.concat(tmpMdi);
	}

	return reval; 
}

function getViewDayInfo(viewStartDt, viewEndDt){
		
	var first = new Date(viewStartDt)
		,last = new Date(viewEndDt);
	
	var solYear = first.getFullYear()
		,solMonth= first.getMonth()+1
		,solDay = first.getDate();

	var lastYear = last.getFullYear()
		,lastMonth= last.getMonth()+1
		,lastDay = last.getDate();
	
	var lunYearInfo = pubLunYearInfo(solYear);

	// 달력 시작일에 대한 음력일 계산.
	var lunDay = lunYearInfo.yearStart.d;

	var monthArr = getMonthLastDayArr(solYear);

	// 음력 날짜를 구하기 위해서 경과일을 계산
	var solElapseDay = solDay-1; // 첫시작일 부터 1 이므로 1을 빼기

	for (var i = 0; i < solMonth-1; i++){
		solElapseDay += monthArr[i];
	}

	var lunStartDay;
	var lunMonthEndDayInfoIdx = 0;
	var lunMonthEndDays = lunYearInfo.monthEndDays;
	if(solElapseDay == 0){
		lunStartDay = lunDay;
	}else{
		var lunElapseDay = lunMonthEndDays[0].d - lunYearInfo.yearStart.d; 
		var startLunMonthInfo = lunMonthEndDays[0];
		var lunMonthIdx = 0;

		if(lunElapseDay <= solElapseDay){
			lunMonthIdx = 1;
				// 경과일 계산
			for (; lunMonthIdx < lunMonthEndDays.length; lunMonthIdx++){
				startLunMonthInfo = lunMonthEndDays[lunMonthIdx];
				lunElapseDay += startLunMonthInfo.d;

				if(lunElapseDay >= solElapseDay){
					break; 
				}
			}
		}
		
		// 경과일이 해당년의 max 월을 지났을때.
		if(lunMonthEndDays.length == lunMonthIdx && solElapseDay > lunElapseDay){
			lunYearInfo = pubLunYearInfo(solYear+1);
			lunMonthEndDays = lunYearInfo.monthEndDays;
			lunMonthIdx = 0;
			startLunMonthInfo = lunMonthEndDays[lunMonthIdx];
			lunElapseDay += startLunMonthInfo.d;
		}

		lunMonthEndDayInfoIdx = lunMonthIdx;

		if(lunElapseDay > solElapseDay){
			lunStartDay = (startLunMonthInfo.d -(lunElapseDay - solElapseDay));
		}else if(lunElapseDay == solElapseDay){
			lunStartDay = startLunMonthInfo.d;
		}else{
			lunMonthEndDayInfoIdx = lunMonthIdx-1;
			lunStartDay = solElapseDay - lunElapseDay;
		}
	}

	var viewDateArr = [], tmpDayInfo;

	while (true){

		var endDayItem = lunMonthEndDays[lunMonthEndDayInfoIdx];

		if(typeof endDayItem ==='undefined'){
			endDayItem = {y:'not support', m:'not support', d:'not support'};
		}

		tmpDayInfo ={
			year : solYear
			, month : solMonth
			, day : solDay
			, yyyy_mm_dd : solYear+'-'+day2(solMonth)+'-'+day2(solDay)
		};
		
		tmpDayInfo.lunYmd = endDayItem.y +'-'+day2(endDayItem.m)+'-'+day2(lunStartDay)
		tmpDayInfo.lunYear = endDayItem.y
		tmpDayInfo.lunMonth = endDayItem.m;
		tmpDayInfo.lunDay = lunStartDay;
		tmpDayInfo.isLeap = endDayItem.isLeap === true;
				
		if(endDayItem.d == lunStartDay){
			tmpDayInfo.isEndDay = true;
			lunMonthEndDayInfoIdx++;
			lunStartDay = 0;
			
			if(lunMonthEndDayInfoIdx == lunMonthEndDays.length){
				lunMonthEndDayInfoIdx = 0;
				if(END_SUPPORT_YEAR == solYear){ // 제한 년도의 마지막 달의 값을 처리.
					lunMonthEndDays = [{y:solYear,m:endDayItem.m+1}]; 
				}else if(END_SUPPORT_YEAR < solYear){ // 지원하지 않는 날짜를 빈값처리.
					lunMonthEndDays = [];
				}else{
					lunMonthEndDays = pubLunYearInfo(solYear+1).monthEndDays;
				}
			}
		}

		lunStartDay++;
		viewDateArr.push(tmpDayInfo);
		
		if(solYear == lastYear && solMonth ==lastMonth && solDay ==lastDay){
			break; 
		}
		
		/* add a day of solar calendar */
		if (solMonth == 12 && solDay == 31)	{
			solYear++;
			solMonth = 1;
			solDay = 1;
			monthArr = getMonthLastDayArr(solYear);
		}else if (monthArr[solMonth - 1] == solDay){
			solMonth++;
			solDay = 1; 
		}else{
			solDay++;
		}
	}

	return viewDateArr; 
}

function day2(d) {	// 2자리 숫자료 변경
	d = parseInt(d,10); 

	return String((d < 10) ? "0"+d : d);
}

// 년 마지막 날 구하기.
function getMonthLastDayArr(year){
	var monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if (year % 400 == 0) monthDay[1]=29;
	else if (year % 100 == 0) monthDay[1]=28;
	else if (year % 4 == 0) monthDay[1]=29;

	return monthDay;
}

function pubLunYearInfo(year){
	return yearLunarInfo[year]; 
}

function getHashCode(str){
	var hash = 0;
	if (str.length == 0) return hash;
	for (var i = 0; i < str.length; i++) {
		var tmpChar = str.charCodeAt(i);
		hash = ((hash<<5)-hash)+tmpChar;
		hash = hash & hash;
	}
	return ''+hash+'99';
}

$(document).on('mousedown.pubgrid.background', function (e){
	if(e.which !==2){
		var targetEle = $(e.target);
		var pubLayerEle = targetEle.closest('.mini-pubcalendar');
		if(pubLayerEle.length < 1 ){
			$('.select-yyyymm-data.on').each(function (){
				$(this).removeClass('on')
			})

			$('.calendar-layer.on').each(function (){
				$(this).removeClass('on')
			})
		}else{
			if(targetEle.closest('.select-yyyymm-data').length < 1){
				$('.select-yyyymm-data.on').each(function (){
					$(this).removeClass('on')
				})
			}
		}
	}
})

function getMiniCalendar(selector){
	return _datastore[selector] ; 
}

pencakeCalendar = {
	getSolarToLunarDayInfo : getSolarToLunarDayInfo
	, getLunarDayToSolarDay : getLunarDayToSolarDay
	, miniCalendar : miniCalendar
	, getMiniCalendar : function (selector){
		return _datastore[selector] ; 
	}
	, getCurrentDate : function (){
		return moment().format(DEFAULT_DATE_FORMAT)
	}
	,validStartYear : START_SUPPORT_YEAR
	,validEndYear : END_SUPPORT_YEAR
	,TIME_FORMAT : DEFAULT_TIME_FORMAT
	,DATE_FORMAT : DEFAULT_DATE_FORMAT
	,TIMESTAMP_FORMAT : DEFAULT_TIMESTAMP_FORMAT
	,lpadNumber :day2 
	, scheduleType : [
		{id : '1', nm : '업무'}
		,{id : '2', nm : '회의'}
		,{id : '4', nm : '출장'}
		,{id : '5', nm : '휴가'}
		,{id : '6', nm : '교육'}
		,{id : '7', nm : '생일'}
		,{id : '8', nm : '기념일'}
		,{id : '9', nm : '기타'}
	]
	, weekdayInfo : [
		{cd :'SU', nm : '일'}
		,{cd :'MO', nm : '월'}
		,{cd :'TU', nm : '화'}
		,{cd :'WE', nm : '수'}
		,{cd :'TH', nm : '목'}
		,{cd :'FR', nm : '금'}
		,{cd :'SA', nm : '토'}
	]
	, getRecurRule : function(saveInfo, recurFreqDateInfo){
		if(saveInfo.recurYn == 'Y'){
			var recurRule = {};
			
			if(!isNaN(saveInfo.rrule.interval)){
				recurRule.interval = parseInt(saveInfo.rrule.interval,10);
				recurRule.interval = recurRule.interval < 1 ? 1 : recurRule.interval;
			}
			
			if(saveInfo.rrule.count){
				recurRule.count = saveInfo.rrule.count;
				recurRule.count = recurRule.count < 1 ? 1 : recurRule.count;
			}
			
			if(saveInfo.recurFreq !=1 && saveInfo.recurFreq !=2){
				
				if(saveInfo.rrule.byday && saveInfo.rrule.byday.length > 0){
					recurRule.byday = saveInfo.rrule.byday;
				}
									
				if(saveInfo.recurFreq == 4 || saveInfo.recurFreq == 5){
					delete recurRule.byday;
					
					if(saveInfo.recurFreq == 5){
						recurRule.bymonth = parseInt(recurFreqDateInfo.mm, 10);
					}
					
					if(saveInfo.recurFreqYearMonth == 1){
						recurRule.bymonthday = recurFreqDateInfo.dd;
					}else if(saveInfo.recurFreqYearMonth == 2){
						recurRule.byday = ['+'+(recurFreqDateInfo.weekOfMonth)+recurFreqDateInfo.weekday];
					}else if(saveInfo.recurFreqYearMonth == 3){ // 마지막주 
						recurRule.byday = [recurFreqDateInfo.weekday];
						recurRule.bysetpos = -1;
					}else if(saveInfo.recurFreqYearMonth == 4){
						recurRule.bymonthday = -1;
					}
				}
			}
			
			return JSON.stringify(recurRule);
		}
		
		return '';
	}
	, responseCheck : function(resData){
		if(!PENCAKE_OBJ.validationCheck(resData)){
			return false;
		}
		
		if(resData.resultCode == 409){
			
			var idItem = {}
			resData.list.forEach(item=>{
				if(idItem[item.equipmentId]){
					idItem[item.equipmentId].push(item);
				}else{
					idItem[item.equipmentId] =[item];
				}
			})
			
			var strMessage = [];
			
			for(var key in idItem){
				var firstFlag = true; 
				idItem[key].forEach(item=>{
					if(firstFlag){
						strMessage.push('## 설비명 : '+ item.equipmentName+' ##\n');
					}else{
						strMessage.push('\n');
					}
					firstFlag = false; 
					
					strMessage.push('예약명 : '+ item.title+'\n');
					if('Y' == item.alldayYn){
						var startYmd = moment(item.startDt, DEFAULT_TIMESTAMP_FORMAT).format(DEFAULT_DATE_FORMAT); 
						var endYmd = moment(item.endDt, DEFAULT_TIMESTAMP_FORMAT).format(DEFAULT_DATE_FORMAT); 
						
						strMessage.push('사용기간 : '+ (startYmd+' ~ '+ endYmd)+' (종일)\n');
					}else{
						strMessage.push('사용기간 : '+ (item.startDt+' ~ '+ item.endDt)+'\n');
					}
				})
				
				strMessage.push('------------------------------------------------------\n');
			}
			
			alert(strMessage.join(''));
			return false;
		}
		
		if(resData.message){
			alert(resData.message);
			return ;
		}
		
		var resultCode = resData.resultCode; 
		
		if(resultCode > 0){
			if(resultCode==403){
				PubEPUI.toast.view({text:'권한이 없습니다.'});
				return false;
			}else if(resultCode==507){
				PubEPUI.toast.view({text:'파일이 허용된 최대크기를 초과했습니다.'});
				return false;
			}
		}
		
		return true; 
	}
	//장비 선택 화면 열기
	,openEquipmentPopup : function (scheduleInfo, todayDt){
		var startDt, endDt;
		if(scheduleInfo.alldayYn=='Y'){
			startDt = moment(scheduleInfo.startYmd+' 00:00', "YYYY-MM-DD HH:mm");
			endDt = moment(scheduleInfo.endYmd + ' 23:59', "YYYY-MM-DD HH:mm");	
		}else{
			startDt = moment(scheduleInfo.startYmd+' '+scheduleInfo.startHhmm, "YYYY-MM-DD HH:mm");
			endDt = moment(scheduleInfo.endYmd + ' '+ scheduleInfo.endHhmm, "YYYY-MM-DD HH:mm");	
		}
		
		if(endDt.diff(startDt) <= 0){
			PubEPUI.toast.view({text:'종료일이 시작일보다 이전일 수 없습니다.'});
			return ;
		}
		var orginTodayDt = todayDt; 
		todayDt = moment(todayDt, "YYYY-MM-DD");
		
		if(endDt.diff(todayDt, 'days') > 90){
			
			PubEPUI.toast.view({text:'설비 등록은 현재('+orginTodayDt+')일 부터 최대 90일('+todayDt.add(90, 'days').format("YYYY-MM-DD")+')까지 등록 가능합니다.'});
			return ;
		}
		
		PubEP.page.view(PENCAKE_OBJ.getUrl('/calendar/equipmentSelect'),'popup',{
			method: 'get'
			,name:'equipmentSelectPopup'
			,viewOption:'width=970,height=750'
			,param:{
				startDt : startDt.format(pencakeCalendar.TIMESTAMP_FORMAT)
				,endDt : endDt.format(pencakeCalendar.TIMESTAMP_FORMAT)
			}
		})
	}
	//사용자 공유 팝업
	,openShareUsersPopup: function (){
		PubEP.page.view(PENCAKE_OBJ.getUrl('/orgPopup'),'popup',{
			method: 'get'
			,name:'calendarSharePopup'
			,viewOption:'width=970,height=750'
		})
	}
	// rule data 초기화
	,initScheduleRuleData: function (){
		return {
			interval: 1
			,count: null
			,bymonth: null
			,bymonthday: null
			,bysetpos: null
			,byday : []
		}
	}
	// 요일 정보
	,getByDays : function (rruleObj){
		var weekdayArr = [];
		if(rruleObj.byday && rruleObj.byday.length > 0){
			var byday = rruleObj.byday;
			
			for(var i =0; i<byday.length; i++){
				var dayVal = byday[i];
				
				if(dayVal.length > 2){
					var dayStr = dayVal.substring(dayVal.length-2);
					var nStr = dayVal.replace(dayStr,'');
					
					var weekDayRuleInfo = rrule.RRule[dayStr];
					weekDayRuleInfo.n =  parseInt(nStr, 10);
					weekdayArr.push(weekDayRuleInfo);
				}else{
					weekdayArr.push(dayVal);
				}
			}	
		}
		
		return weekdayArr;
	}
	// 요일명
	,getByDayNames : function (weekdayArr){
		var reval = [];
		for(var i=0; i<weekdayArr.length; i++){
			var weekItem = weekdayArr[i]; 
			
			if(typeof weekItem ==='string'){
				reval.push(this.weekdayInfo.find(item=>item.cd==weekItem).nm+'요일');
			}else{
				reval.push(weekItem.n+'번째 '+this.weekdayInfo[weekItem.weekday+1].nm+'요일');	
			}
			
		}
		return reval; 
	}
	// rrule 정보 fullcalendar object로 변경. 
	,convertRruleToObject: function (item, detailFlag, recurCudMode, allRecurFreq){
		
		if(item.recurFreq){
			if(detailFlag && recurCudMode==1){
				item.recurYn = 'N';
			}else{
				item.recurYn = 'Y';	
			}
			
			var rruleObj = JSON.parse(item.recurRule);
			var rruleInterval = rruleObj.interval; 
			
      		if(rruleInterval && $.isNumeric(rruleInterval)){
				rruleObj.interval = parseInt(rruleInterval, 10);
			}else{
				if(rruleInterval==null || rruleInterval=='null'){
					rruleObj.interval = 1; 
				}
			}
			
			if(rruleObj.count) rruleObj.count = parseInt(rruleObj.count, 10);
			
			if(item.recurFreq == '5' && rruleObj.bymonth){
				rruleObj.bymonth = parseInt(rruleObj.bymonth, 10);
			}
			
			var freqInfo = allRecurFreq[item.recurFreq];
			rruleObj.freq = freqInfo.freqCd;
			rruleObj.dtstart = item.start;
			rruleObj.until = item.end;
			
			if(item.recurFreq=='2'){
				rruleObj.byday = freqInfo.defaultValue.split(',');
			}
			
			var weekdayArr = pencakeCalendar.getByDays(rruleObj);
			if(weekdayArr.length > 0){
				if(detailFlag){
					rruleObj.byday = weekdayArr;
				}else{
					delete rruleObj.byday; // fullcalendar 에서 사용안한
					rruleObj.byweekday = weekdayArr;
				}	
			}
			
			item.rrule = rruleObj;
		}else{
			item.recurYn = 'N';
			item.rrule = pencakeCalendar.initScheduleRuleData();
		}
	}
	//음력 반복일 계산
	,getLunarRruleCalc : function (schStartDt, schEndDt, rrule, lunarDt){
	    var solarInfo = getLunarDayToSolarDay(lunarDt)
	    
	    var chkDt = moment(solarInfo.yyyy_mm_dd);

	    if(chkDt.diff(schStartDt, 'days') > -1 && chkDt.diff(schEndDt,'days') < 0){
	        rrule.bymonth = solarInfo.month;
	        rrule.bymonthday = solarInfo.day;
	        return solarInfo;
	    }
	}
};

// 음력 정보 // 년도 양력 / yearStart: 양력 1/1에 대한 음력정보, yearEnd 양력 12/31 에 대한 음력정보, monthEndDays 음력 월의 마지막 날짜 정보.
var yearLunarInfo = {
	1900:{"yearStart":{"y":1899,"m":12,"d":1},"yearEnd":{"y":1900,"m":11,"d":10},"monthEndDays":[{"y":1899,"m":12,"d":30},{"y":1900,"m":1,"d":29},{"y":1900,"m":2,"d":30},{"y":1900,"m":3,"d":29},{"y":1900,"m":4,"d":29},{"y":1900,"m":5,"d":30},{"y":1900,"m":6,"d":29},{"y":1900,"m":7,"d":30},{"y":1900,"m":8,"d":30},{"y":1900,"m":8,"d":29,"isLeap":true},{"y":1900,"m":9,"d":30},{"y":1900,"m":10,"d":30}]}
	,1901:{"yearStart":{"y":1900,"m":11,"d":11},"yearEnd":{"y":1901,"m":11,"d":21},"monthEndDays":[{"y":1900,"m":11,"d":29},{"y":1900,"m":12,"d":30},{"y":1901,"m":1,"d":29},{"y":1901,"m":2,"d":30},{"y":1901,"m":3,"d":29},{"y":1901,"m":4,"d":29},{"y":1901,"m":5,"d":30},{"y":1901,"m":6,"d":29},{"y":1901,"m":7,"d":30},{"y":1901,"m":8,"d":29},{"y":1901,"m":9,"d":30},{"y":1901,"m":10,"d":30}]}
	,1902:{"yearStart":{"y":1901,"m":11,"d":22},"yearEnd":{"y":1902,"m":12,"d":2},"monthEndDays":[{"y":1901,"m":11,"d":30},{"y":1901,"m":12,"d":29},{"y":1902,"m":1,"d":30},{"y":1902,"m":2,"d":29},{"y":1902,"m":3,"d":30},{"y":1902,"m":4,"d":29},{"y":1902,"m":5,"d":29},{"y":1902,"m":6,"d":30},{"y":1902,"m":7,"d":29},{"y":1902,"m":8,"d":30},{"y":1902,"m":9,"d":29},{"y":1902,"m":10,"d":30},{"y":1902,"m":11,"d":30}]}
	,1903:{"yearStart":{"y":1902,"m":12,"d":3},"yearEnd":{"y":1903,"m":11,"d":13},"monthEndDays":[{"y":1902,"m":12,"d":30},{"y":1903,"m":1,"d":29},{"y":1903,"m":2,"d":30},{"y":1903,"m":3,"d":29},{"y":1903,"m":4,"d":30},{"y":1903,"m":5,"d":29},{"y":1903,"m":5,"d":29,"isLeap":true},{"y":1903,"m":6,"d":30},{"y":1903,"m":7,"d":29},{"y":1903,"m":8,"d":29},{"y":1903,"m":9,"d":30},{"y":1903,"m":10,"d":30}]}
	,1904:{"yearStart":{"y":1903,"m":11,"d":14},"yearEnd":{"y":1904,"m":11,"d":25},"monthEndDays":[{"y":1903,"m":11,"d":29},{"y":1903,"m":12,"d":30},{"y":1904,"m":1,"d":30},{"y":1904,"m":2,"d":30},{"y":1904,"m":3,"d":29},{"y":1904,"m":4,"d":30},{"y":1904,"m":5,"d":29},{"y":1904,"m":6,"d":29},{"y":1904,"m":7,"d":30},{"y":1904,"m":8,"d":29},{"y":1904,"m":9,"d":29},{"y":1904,"m":10,"d":30}]}
	,1905:{"yearStart":{"y":1904,"m":11,"d":26},"yearEnd":{"y":1905,"m":12,"d":6},"monthEndDays":[{"y":1904,"m":11,"d":30},{"y":1904,"m":12,"d":29},{"y":1905,"m":1,"d":30},{"y":1905,"m":2,"d":30},{"y":1905,"m":3,"d":29},{"y":1905,"m":4,"d":30},{"y":1905,"m":5,"d":30},{"y":1905,"m":6,"d":29},{"y":1905,"m":7,"d":29},{"y":1905,"m":8,"d":30},{"y":1905,"m":9,"d":29},{"y":1905,"m":10,"d":30},{"y":1905,"m":11,"d":29}]}
	,1906:{"yearStart":{"y":1905,"m":12,"d":7},"yearEnd":{"y":1906,"m":11,"d":16},"monthEndDays":[{"y":1905,"m":12,"d":30},{"y":1906,"m":1,"d":29},{"y":1906,"m":2,"d":30},{"y":1906,"m":3,"d":30},{"y":1906,"m":4,"d":29},{"y":1906,"m":4,"d":30,"isLeap":true},{"y":1906,"m":5,"d":29},{"y":1906,"m":6,"d":30},{"y":1906,"m":7,"d":29},{"y":1906,"m":8,"d":30},{"y":1906,"m":9,"d":29},{"y":1906,"m":10,"d":30}]}
	,1907:{"yearStart":{"y":1906,"m":11,"d":17},"yearEnd":{"y":1907,"m":11,"d":27},"monthEndDays":[{"y":1906,"m":11,"d":29},{"y":1906,"m":12,"d":30},{"y":1907,"m":1,"d":29},{"y":1907,"m":2,"d":30},{"y":1907,"m":3,"d":29},{"y":1907,"m":4,"d":30},{"y":1907,"m":5,"d":29},{"y":1907,"m":6,"d":30},{"y":1907,"m":7,"d":30},{"y":1907,"m":8,"d":29},{"y":1907,"m":9,"d":30},{"y":1907,"m":10,"d":29}]}
	,1908:{"yearStart":{"y":1907,"m":11,"d":28},"yearEnd":{"y":1908,"m":12,"d":9},"monthEndDays":[{"y":1907,"m":11,"d":30},{"y":1907,"m":12,"d":29},{"y":1908,"m":1,"d":30},{"y":1908,"m":2,"d":29},{"y":1908,"m":3,"d":29},{"y":1908,"m":4,"d":30},{"y":1908,"m":5,"d":30},{"y":1908,"m":6,"d":29},{"y":1908,"m":7,"d":30},{"y":1908,"m":8,"d":29},{"y":1908,"m":9,"d":30},{"y":1908,"m":10,"d":30},{"y":1908,"m":11,"d":29}]}
	,1909:{"yearStart":{"y":1908,"m":12,"d":10},"yearEnd":{"y":1909,"m":11,"d":19},"monthEndDays":[{"y":1908,"m":12,"d":30},{"y":1909,"m":1,"d":29},{"y":1909,"m":2,"d":30},{"y":1909,"m":2,"d":29,"isLeap":true},{"y":1909,"m":3,"d":29},{"y":1909,"m":4,"d":30},{"y":1909,"m":5,"d":29},{"y":1909,"m":6,"d":30},{"y":1909,"m":7,"d":29},{"y":1909,"m":8,"d":30},{"y":1909,"m":9,"d":30},{"y":1909,"m":10,"d":30}]}
	,1910:{"yearStart":{"y":1909,"m":11,"d":20},"yearEnd":{"y":1910,"m":11,"d":30},"monthEndDays":[{"y":1909,"m":11,"d":29},{"y":1909,"m":12,"d":30},{"y":1910,"m":1,"d":29},{"y":1910,"m":2,"d":30},{"y":1910,"m":3,"d":29},{"y":1910,"m":4,"d":29},{"y":1910,"m":5,"d":30},{"y":1910,"m":6,"d":29},{"y":1910,"m":7,"d":30},{"y":1910,"m":8,"d":29},{"y":1910,"m":9,"d":30},{"y":1910,"m":10,"d":30},{"y":1910,"m":11,"d":30}]}
	,1911:{"yearStart":{"y":1910,"m":12,"d":1},"yearEnd":{"y":1911,"m":11,"d":12},"monthEndDays":[{"y":1910,"m":12,"d":29},{"y":1911,"m":1,"d":30},{"y":1911,"m":2,"d":29},{"y":1911,"m":3,"d":30},{"y":1911,"m":4,"d":29},{"y":1911,"m":5,"d":29},{"y":1911,"m":6,"d":30},{"y":1911,"m":6,"d":29,"isLeap":true},{"y":1911,"m":7,"d":29},{"y":1911,"m":8,"d":30},{"y":1911,"m":9,"d":30},{"y":1911,"m":10,"d":29}]}
	,1912:{"yearStart":{"y":1911,"m":11,"d":13},"yearEnd":{"y":1912,"m":11,"d":23},"monthEndDays":[{"y":1911,"m":11,"d":30},{"y":1911,"m":12,"d":30},{"y":1912,"m":1,"d":30},{"y":1912,"m":2,"d":29},{"y":1912,"m":3,"d":30},{"y":1912,"m":4,"d":29},{"y":1912,"m":5,"d":29},{"y":1912,"m":6,"d":30},{"y":1912,"m":7,"d":29},{"y":1912,"m":8,"d":29},{"y":1912,"m":9,"d":30},{"y":1912,"m":10,"d":30}]}
	,1913:{"yearStart":{"y":1912,"m":11,"d":24},"yearEnd":{"y":1913,"m":12,"d":5},"monthEndDays":[{"y":1912,"m":11,"d":29},{"y":1912,"m":12,"d":30},{"y":1913,"m":1,"d":30},{"y":1913,"m":2,"d":30},{"y":1913,"m":3,"d":29},{"y":1913,"m":4,"d":30},{"y":1913,"m":5,"d":29},{"y":1913,"m":6,"d":29},{"y":1913,"m":7,"d":30},{"y":1913,"m":8,"d":29},{"y":1913,"m":9,"d":29},{"y":1913,"m":10,"d":30},{"y":1913,"m":11,"d":29}]}
	,1914:{"yearStart":{"y":1913,"m":12,"d":6},"yearEnd":{"y":1914,"m":11,"d":15},"monthEndDays":[{"y":1913,"m":12,"d":30},{"y":1914,"m":1,"d":30},{"y":1914,"m":2,"d":30},{"y":1914,"m":3,"d":29},{"y":1914,"m":4,"d":30},{"y":1914,"m":5,"d":30},{"y":1914,"m":5,"d":29,"isLeap":true},{"y":1914,"m":6,"d":29},{"y":1914,"m":7,"d":30},{"y":1914,"m":8,"d":29},{"y":1914,"m":9,"d":30},{"y":1914,"m":10,"d":29}]}
	,1915:{"yearStart":{"y":1914,"m":11,"d":16},"yearEnd":{"y":1915,"m":11,"d":25},"monthEndDays":[{"y":1914,"m":11,"d":29},{"y":1914,"m":12,"d":30},{"y":1915,"m":1,"d":30},{"y":1915,"m":2,"d":29},{"y":1915,"m":3,"d":30},{"y":1915,"m":4,"d":30},{"y":1915,"m":5,"d":29},{"y":1915,"m":6,"d":30},{"y":1915,"m":7,"d":29},{"y":1915,"m":8,"d":30},{"y":1915,"m":9,"d":29},{"y":1915,"m":10,"d":30}]}
	,1916:{"yearStart":{"y":1915,"m":11,"d":26},"yearEnd":{"y":1916,"m":12,"d":7},"monthEndDays":[{"y":1915,"m":11,"d":29},{"y":1915,"m":12,"d":30},{"y":1916,"m":1,"d":29},{"y":1916,"m":2,"d":30},{"y":1916,"m":3,"d":29},{"y":1916,"m":4,"d":30},{"y":1916,"m":5,"d":29},{"y":1916,"m":6,"d":30},{"y":1916,"m":7,"d":30},{"y":1916,"m":8,"d":29},{"y":1916,"m":9,"d":30},{"y":1916,"m":10,"d":29},{"y":1916,"m":11,"d":30}]}
	,1917:{"yearStart":{"y":1916,"m":12,"d":8},"yearEnd":{"y":1917,"m":11,"d":18},"monthEndDays":[{"y":1916,"m":12,"d":29},{"y":1917,"m":1,"d":30},{"y":1917,"m":2,"d":29},{"y":1917,"m":2,"d":29,"isLeap":true},{"y":1917,"m":3,"d":30},{"y":1917,"m":4,"d":29},{"y":1917,"m":5,"d":30},{"y":1917,"m":6,"d":30},{"y":1917,"m":7,"d":29},{"y":1917,"m":8,"d":30},{"y":1917,"m":9,"d":30},{"y":1917,"m":10,"d":29}]}
	,1918:{"yearStart":{"y":1917,"m":11,"d":19},"yearEnd":{"y":1918,"m":11,"d":28},"monthEndDays":[{"y":1917,"m":11,"d":30},{"y":1917,"m":12,"d":29},{"y":1918,"m":1,"d":30},{"y":1918,"m":2,"d":29},{"y":1918,"m":3,"d":29},{"y":1918,"m":4,"d":30},{"y":1918,"m":5,"d":29},{"y":1918,"m":6,"d":30},{"y":1918,"m":7,"d":29},{"y":1918,"m":8,"d":30},{"y":1918,"m":9,"d":30},{"y":1918,"m":10,"d":30}]}
	,1919:{"yearStart":{"y":1918,"m":11,"d":29},"yearEnd":{"y":1919,"m":11,"d":10},"monthEndDays":[{"y":1918,"m":11,"d":29},{"y":1918,"m":12,"d":30},{"y":1919,"m":1,"d":29},{"y":1919,"m":2,"d":30},{"y":1919,"m":3,"d":29},{"y":1919,"m":4,"d":29},{"y":1919,"m":5,"d":30},{"y":1919,"m":6,"d":29},{"y":1919,"m":7,"d":30},{"y":1919,"m":7,"d":29,"isLeap":true},{"y":1919,"m":8,"d":30},{"y":1919,"m":9,"d":30},{"y":1919,"m":10,"d":29}]}
	,1920:{"yearStart":{"y":1919,"m":11,"d":11},"yearEnd":{"y":1920,"m":11,"d":22},"monthEndDays":[{"y":1919,"m":11,"d":30},{"y":1919,"m":12,"d":30},{"y":1920,"m":1,"d":29},{"y":1920,"m":2,"d":30},{"y":1920,"m":3,"d":29},{"y":1920,"m":4,"d":29},{"y":1920,"m":5,"d":30},{"y":1920,"m":6,"d":29},{"y":1920,"m":7,"d":29},{"y":1920,"m":8,"d":30},{"y":1920,"m":9,"d":30},{"y":1920,"m":10,"d":29}]}
	,1921:{"yearStart":{"y":1920,"m":11,"d":23},"yearEnd":{"y":1921,"m":12,"d":3},"monthEndDays":[{"y":1920,"m":11,"d":30},{"y":1920,"m":12,"d":30},{"y":1921,"m":1,"d":30},{"y":1921,"m":2,"d":29},{"y":1921,"m":3,"d":30},{"y":1921,"m":4,"d":29},{"y":1921,"m":5,"d":29},{"y":1921,"m":6,"d":30},{"y":1921,"m":7,"d":29},{"y":1921,"m":8,"d":29},{"y":1921,"m":9,"d":30},{"y":1921,"m":10,"d":29},{"y":1921,"m":11,"d":30}]}
	,1922:{"yearStart":{"y":1921,"m":12,"d":4},"yearEnd":{"y":1922,"m":11,"d":14},"monthEndDays":[{"y":1921,"m":12,"d":30},{"y":1922,"m":1,"d":30},{"y":1922,"m":2,"d":29},{"y":1922,"m":3,"d":30},{"y":1922,"m":4,"d":30},{"y":1922,"m":5,"d":29},{"y":1922,"m":5,"d":29,"isLeap":true},{"y":1922,"m":6,"d":30},{"y":1922,"m":7,"d":29},{"y":1922,"m":8,"d":29},{"y":1922,"m":9,"d":30},{"y":1922,"m":10,"d":29}]}
	,1923:{"yearStart":{"y":1922,"m":11,"d":15},"yearEnd":{"y":1923,"m":11,"d":24},"monthEndDays":[{"y":1922,"m":11,"d":30},{"y":1922,"m":12,"d":30},{"y":1923,"m":1,"d":29},{"y":1923,"m":2,"d":30},{"y":1923,"m":3,"d":30},{"y":1923,"m":4,"d":29},{"y":1923,"m":5,"d":30},{"y":1923,"m":6,"d":29},{"y":1923,"m":7,"d":30},{"y":1923,"m":8,"d":29},{"y":1923,"m":9,"d":30},{"y":1923,"m":10,"d":29}]}
	,1924:{"yearStart":{"y":1923,"m":11,"d":25},"yearEnd":{"y":1924,"m":12,"d":6},"monthEndDays":[{"y":1923,"m":11,"d":29},{"y":1923,"m":12,"d":30},{"y":1924,"m":1,"d":30},{"y":1924,"m":2,"d":29},{"y":1924,"m":3,"d":30},{"y":1924,"m":4,"d":29},{"y":1924,"m":5,"d":30},{"y":1924,"m":6,"d":30},{"y":1924,"m":7,"d":29},{"y":1924,"m":8,"d":30},{"y":1924,"m":9,"d":29},{"y":1924,"m":10,"d":30},{"y":1924,"m":11,"d":29}]}
	,1925:{"yearStart":{"y":1924,"m":12,"d":7},"yearEnd":{"y":1925,"m":11,"d":16},"monthEndDays":[{"y":1924,"m":12,"d":29},{"y":1925,"m":1,"d":30},{"y":1925,"m":2,"d":29},{"y":1925,"m":3,"d":30},{"y":1925,"m":4,"d":30},{"y":1925,"m":4,"d":29,"isLeap":true},{"y":1925,"m":5,"d":30},{"y":1925,"m":6,"d":29},{"y":1925,"m":7,"d":30},{"y":1925,"m":8,"d":30},{"y":1925,"m":9,"d":29},{"y":1925,"m":10,"d":30}]}
	,1926:{"yearStart":{"y":1925,"m":11,"d":17},"yearEnd":{"y":1926,"m":11,"d":27},"monthEndDays":[{"y":1925,"m":11,"d":29},{"y":1925,"m":12,"d":30},{"y":1926,"m":1,"d":29},{"y":1926,"m":2,"d":29},{"y":1926,"m":3,"d":30},{"y":1926,"m":4,"d":29},{"y":1926,"m":5,"d":30},{"y":1926,"m":6,"d":29},{"y":1926,"m":7,"d":30},{"y":1926,"m":8,"d":30},{"y":1926,"m":9,"d":29},{"y":1926,"m":10,"d":30}]}
	,1927:{"yearStart":{"y":1926,"m":11,"d":28},"yearEnd":{"y":1927,"m":12,"d":8},"monthEndDays":[{"y":1926,"m":11,"d":30},{"y":1926,"m":12,"d":29},{"y":1927,"m":1,"d":30},{"y":1927,"m":2,"d":29},{"y":1927,"m":3,"d":29},{"y":1927,"m":4,"d":30},{"y":1927,"m":5,"d":29},{"y":1927,"m":6,"d":30},{"y":1927,"m":7,"d":29},{"y":1927,"m":8,"d":30},{"y":1927,"m":9,"d":30},{"y":1927,"m":10,"d":29},{"y":1927,"m":11,"d":30}]}
	,1928:{"yearStart":{"y":1927,"m":12,"d":9},"yearEnd":{"y":1928,"m":11,"d":20},"monthEndDays":[{"y":1927,"m":12,"d":30},{"y":1928,"m":1,"d":29},{"y":1928,"m":2,"d":30},{"y":1928,"m":2,"d":29,"isLeap":true},{"y":1928,"m":3,"d":29},{"y":1928,"m":4,"d":30},{"y":1928,"m":5,"d":29},{"y":1928,"m":6,"d":29},{"y":1928,"m":7,"d":30},{"y":1928,"m":8,"d":30},{"y":1928,"m":9,"d":29},{"y":1928,"m":10,"d":30}]}
	,1929:{"yearStart":{"y":1928,"m":11,"d":21},"yearEnd":{"y":1929,"m":12,"d":1},"monthEndDays":[{"y":1928,"m":11,"d":30},{"y":1928,"m":12,"d":30},{"y":1929,"m":1,"d":29},{"y":1929,"m":2,"d":30},{"y":1929,"m":3,"d":29},{"y":1929,"m":4,"d":29},{"y":1929,"m":5,"d":30},{"y":1929,"m":6,"d":29},{"y":1929,"m":7,"d":29},{"y":1929,"m":8,"d":30},{"y":1929,"m":9,"d":29},{"y":1929,"m":10,"d":30},{"y":1929,"m":11,"d":30}]}
	,1930:{"yearStart":{"y":1929,"m":12,"d":2},"yearEnd":{"y":1930,"m":11,"d":12},"monthEndDays":[{"y":1929,"m":12,"d":30},{"y":1930,"m":1,"d":29},{"y":1930,"m":2,"d":30},{"y":1930,"m":3,"d":30},{"y":1930,"m":4,"d":29},{"y":1930,"m":5,"d":29},{"y":1930,"m":6,"d":30},{"y":1930,"m":6,"d":29,"isLeap":true},{"y":1930,"m":7,"d":29},{"y":1930,"m":8,"d":30},{"y":1930,"m":9,"d":29},{"y":1930,"m":10,"d":30}]}
	,1931:{"yearStart":{"y":1930,"m":11,"d":13},"yearEnd":{"y":1931,"m":11,"d":23},"monthEndDays":[{"y":1930,"m":11,"d":30},{"y":1930,"m":12,"d":29},{"y":1931,"m":1,"d":30},{"y":1931,"m":2,"d":30},{"y":1931,"m":3,"d":30},{"y":1931,"m":4,"d":29},{"y":1931,"m":5,"d":29},{"y":1931,"m":6,"d":30},{"y":1931,"m":7,"d":29},{"y":1931,"m":8,"d":29},{"y":1931,"m":9,"d":30},{"y":1931,"m":10,"d":29}]}
	,1932:{"yearStart":{"y":1931,"m":11,"d":24},"yearEnd":{"y":1932,"m":12,"d":5},"monthEndDays":[{"y":1931,"m":11,"d":30},{"y":1931,"m":12,"d":29},{"y":1932,"m":1,"d":30},{"y":1932,"m":2,"d":30},{"y":1932,"m":3,"d":30},{"y":1932,"m":4,"d":29},{"y":1932,"m":5,"d":30},{"y":1932,"m":6,"d":29},{"y":1932,"m":7,"d":30},{"y":1932,"m":8,"d":29},{"y":1932,"m":9,"d":29},{"y":1932,"m":10,"d":30},{"y":1932,"m":11,"d":29}]}
	,1933:{"yearStart":{"y":1932,"m":12,"d":6},"yearEnd":{"y":1933,"m":11,"d":15},"monthEndDays":[{"y":1932,"m":12,"d":30},{"y":1933,"m":1,"d":29},{"y":1933,"m":2,"d":30},{"y":1933,"m":3,"d":30},{"y":1933,"m":4,"d":29},{"y":1933,"m":5,"d":30},{"y":1933,"m":5,"d":30,"isLeap":true},{"y":1933,"m":6,"d":29},{"y":1933,"m":7,"d":30},{"y":1933,"m":8,"d":29},{"y":1933,"m":9,"d":30},{"y":1933,"m":10,"d":29}]}
	,1934:{"yearStart":{"y":1933,"m":11,"d":16},"yearEnd":{"y":1934,"m":11,"d":25},"monthEndDays":[{"y":1933,"m":11,"d":29},{"y":1933,"m":12,"d":30},{"y":1934,"m":1,"d":29},{"y":1934,"m":2,"d":30},{"y":1934,"m":3,"d":29},{"y":1934,"m":4,"d":30},{"y":1934,"m":5,"d":30},{"y":1934,"m":6,"d":29},{"y":1934,"m":7,"d":30},{"y":1934,"m":8,"d":30},{"y":1934,"m":9,"d":29},{"y":1934,"m":10,"d":30}]}
	,1935:{"yearStart":{"y":1934,"m":11,"d":26},"yearEnd":{"y":1935,"m":12,"d":6},"monthEndDays":[{"y":1934,"m":11,"d":29},{"y":1934,"m":12,"d":30},{"y":1935,"m":1,"d":29},{"y":1935,"m":2,"d":29},{"y":1935,"m":3,"d":30},{"y":1935,"m":4,"d":29},{"y":1935,"m":5,"d":30},{"y":1935,"m":6,"d":29},{"y":1935,"m":7,"d":30},{"y":1935,"m":8,"d":30},{"y":1935,"m":9,"d":29},{"y":1935,"m":10,"d":30},{"y":1935,"m":11,"d":30}]}
	,1936:{"yearStart":{"y":1935,"m":12,"d":7},"yearEnd":{"y":1936,"m":11,"d":18},"monthEndDays":[{"y":1935,"m":12,"d":29},{"y":1936,"m":1,"d":30},{"y":1936,"m":2,"d":29},{"y":1936,"m":3,"d":29},{"y":1936,"m":3,"d":30,"isLeap":true},{"y":1936,"m":4,"d":29},{"y":1936,"m":5,"d":30},{"y":1936,"m":6,"d":29},{"y":1936,"m":7,"d":30},{"y":1936,"m":8,"d":29},{"y":1936,"m":9,"d":30},{"y":1936,"m":10,"d":30}]}
	,1937:{"yearStart":{"y":1936,"m":11,"d":19},"yearEnd":{"y":1937,"m":11,"d":29},"monthEndDays":[{"y":1936,"m":11,"d":30},{"y":1936,"m":12,"d":29},{"y":1937,"m":1,"d":30},{"y":1937,"m":2,"d":29},{"y":1937,"m":3,"d":29},{"y":1937,"m":4,"d":30},{"y":1937,"m":5,"d":29},{"y":1937,"m":6,"d":29},{"y":1937,"m":7,"d":30},{"y":1937,"m":8,"d":29},{"y":1937,"m":9,"d":30},{"y":1937,"m":10,"d":30}]}
	,1938:{"yearStart":{"y":1937,"m":11,"d":30},"yearEnd":{"y":1938,"m":11,"d":10},"monthEndDays":[{"y":1937,"m":11,"d":30},{"y":1937,"m":12,"d":29},{"y":1938,"m":1,"d":30},{"y":1938,"m":2,"d":30},{"y":1938,"m":3,"d":29},{"y":1938,"m":4,"d":29},{"y":1938,"m":5,"d":30},{"y":1938,"m":6,"d":29},{"y":1938,"m":7,"d":29},{"y":1938,"m":7,"d":30,"isLeap":true},{"y":1938,"m":8,"d":29},{"y":1938,"m":9,"d":30},{"y":1938,"m":10,"d":30}]}
	,1939:{"yearStart":{"y":1938,"m":11,"d":11},"yearEnd":{"y":1939,"m":11,"d":21},"monthEndDays":[{"y":1938,"m":11,"d":29},{"y":1938,"m":12,"d":30},{"y":1939,"m":1,"d":30},{"y":1939,"m":2,"d":30},{"y":1939,"m":3,"d":29},{"y":1939,"m":4,"d":29},{"y":1939,"m":5,"d":30},{"y":1939,"m":6,"d":29},{"y":1939,"m":7,"d":29},{"y":1939,"m":8,"d":30},{"y":1939,"m":9,"d":29},{"y":1939,"m":10,"d":30}]}
	,1940:{"yearStart":{"y":1939,"m":11,"d":22},"yearEnd":{"y":1940,"m":12,"d":3},"monthEndDays":[{"y":1939,"m":11,"d":29},{"y":1939,"m":12,"d":30},{"y":1940,"m":1,"d":30},{"y":1940,"m":2,"d":30},{"y":1940,"m":3,"d":29},{"y":1940,"m":4,"d":30},{"y":1940,"m":5,"d":29},{"y":1940,"m":6,"d":30},{"y":1940,"m":7,"d":29},{"y":1940,"m":8,"d":29},{"y":1940,"m":9,"d":30},{"y":1940,"m":10,"d":29},{"y":1940,"m":11,"d":30}]}
	,1941:{"yearStart":{"y":1940,"m":12,"d":4},"yearEnd":{"y":1941,"m":11,"d":14},"monthEndDays":[{"y":1940,"m":12,"d":29},{"y":1941,"m":1,"d":30},{"y":1941,"m":2,"d":30},{"y":1941,"m":3,"d":29},{"y":1941,"m":4,"d":30},{"y":1941,"m":5,"d":30},{"y":1941,"m":6,"d":29},{"y":1941,"m":6,"d":30,"isLeap":true},{"y":1941,"m":7,"d":29},{"y":1941,"m":8,"d":29},{"y":1941,"m":9,"d":30},{"y":1941,"m":10,"d":29}]}
	,1942:{"yearStart":{"y":1941,"m":11,"d":15},"yearEnd":{"y":1942,"m":11,"d":24},"monthEndDays":[{"y":1941,"m":11,"d":30},{"y":1941,"m":12,"d":29},{"y":1942,"m":1,"d":30},{"y":1942,"m":2,"d":29},{"y":1942,"m":3,"d":30},{"y":1942,"m":4,"d":30},{"y":1942,"m":5,"d":29},{"y":1942,"m":6,"d":30},{"y":1942,"m":7,"d":30},{"y":1942,"m":8,"d":29},{"y":1942,"m":9,"d":30},{"y":1942,"m":10,"d":29}]}
	,1943:{"yearStart":{"y":1942,"m":11,"d":25},"yearEnd":{"y":1943,"m":12,"d":5},"monthEndDays":[{"y":1942,"m":11,"d":29},{"y":1942,"m":12,"d":30},{"y":1943,"m":1,"d":29},{"y":1943,"m":2,"d":30},{"y":1943,"m":3,"d":29},{"y":1943,"m":4,"d":30},{"y":1943,"m":5,"d":29},{"y":1943,"m":6,"d":30},{"y":1943,"m":7,"d":30},{"y":1943,"m":8,"d":29},{"y":1943,"m":9,"d":30},{"y":1943,"m":10,"d":30},{"y":1943,"m":11,"d":29}]}
	,1944:{"yearStart":{"y":1943,"m":12,"d":6},"yearEnd":{"y":1944,"m":11,"d":17},"monthEndDays":[{"y":1943,"m":12,"d":30},{"y":1944,"m":1,"d":29},{"y":1944,"m":2,"d":29},{"y":1944,"m":3,"d":30},{"y":1944,"m":4,"d":29},{"y":1944,"m":4,"d":30,"isLeap":true},{"y":1944,"m":5,"d":29},{"y":1944,"m":6,"d":30},{"y":1944,"m":7,"d":29},{"y":1944,"m":8,"d":30},{"y":1944,"m":9,"d":30},{"y":1944,"m":10,"d":29}]}
	,1945:{"yearStart":{"y":1944,"m":11,"d":18},"yearEnd":{"y":1945,"m":11,"d":27},"monthEndDays":[{"y":1944,"m":11,"d":30},{"y":1944,"m":12,"d":30},{"y":1945,"m":1,"d":29},{"y":1945,"m":2,"d":29},{"y":1945,"m":3,"d":30},{"y":1945,"m":4,"d":29},{"y":1945,"m":5,"d":29},{"y":1945,"m":6,"d":30},{"y":1945,"m":7,"d":29},{"y":1945,"m":8,"d":30},{"y":1945,"m":9,"d":30},{"y":1945,"m":10,"d":30}]}
	,1946:{"yearStart":{"y":1945,"m":11,"d":28},"yearEnd":{"y":1946,"m":12,"d":9},"monthEndDays":[{"y":1945,"m":11,"d":29},{"y":1945,"m":12,"d":30},{"y":1946,"m":1,"d":30},{"y":1946,"m":2,"d":29},{"y":1946,"m":3,"d":29},{"y":1946,"m":4,"d":30},{"y":1946,"m":5,"d":29},{"y":1946,"m":6,"d":29},{"y":1946,"m":7,"d":30},{"y":1946,"m":8,"d":29},{"y":1946,"m":9,"d":30},{"y":1946,"m":10,"d":30},{"y":1946,"m":11,"d":29}]}
	,1947:{"yearStart":{"y":1946,"m":12,"d":10},"yearEnd":{"y":1947,"m":11,"d":20},"monthEndDays":[{"y":1946,"m":12,"d":30},{"y":1947,"m":1,"d":30},{"y":1947,"m":2,"d":30},{"y":1947,"m":2,"d":29,"isLeap":true},{"y":1947,"m":3,"d":29},{"y":1947,"m":4,"d":30},{"y":1947,"m":5,"d":29},{"y":1947,"m":6,"d":29},{"y":1947,"m":7,"d":30},{"y":1947,"m":8,"d":29},{"y":1947,"m":9,"d":30},{"y":1947,"m":10,"d":29}]}
	,1948:{"yearStart":{"y":1947,"m":11,"d":21},"yearEnd":{"y":1948,"m":12,"d":2},"monthEndDays":[{"y":1947,"m":11,"d":30},{"y":1947,"m":12,"d":30},{"y":1948,"m":1,"d":30},{"y":1948,"m":2,"d":29},{"y":1948,"m":3,"d":30},{"y":1948,"m":4,"d":29},{"y":1948,"m":5,"d":30},{"y":1948,"m":6,"d":29},{"y":1948,"m":7,"d":29},{"y":1948,"m":8,"d":30},{"y":1948,"m":9,"d":29},{"y":1948,"m":10,"d":30},{"y":1948,"m":11,"d":29}]}
	,1949:{"yearStart":{"y":1948,"m":12,"d":3},"yearEnd":{"y":1949,"m":11,"d":12},"monthEndDays":[{"y":1948,"m":12,"d":30},{"y":1949,"m":1,"d":30},{"y":1949,"m":2,"d":30},{"y":1949,"m":3,"d":29},{"y":1949,"m":4,"d":30},{"y":1949,"m":5,"d":29},{"y":1949,"m":6,"d":30},{"y":1949,"m":7,"d":29},{"y":1949,"m":7,"d":29,"isLeap":true},{"y":1949,"m":8,"d":30},{"y":1949,"m":9,"d":29},{"y":1949,"m":10,"d":30}]}
	,1950:{"yearStart":{"y":1949,"m":11,"d":13},"yearEnd":{"y":1950,"m":11,"d":23},"monthEndDays":[{"y":1949,"m":11,"d":29},{"y":1949,"m":12,"d":30},{"y":1950,"m":1,"d":30},{"y":1950,"m":2,"d":29},{"y":1950,"m":3,"d":30},{"y":1950,"m":4,"d":30},{"y":1950,"m":5,"d":29},{"y":1950,"m":6,"d":30},{"y":1950,"m":7,"d":29},{"y":1950,"m":8,"d":29},{"y":1950,"m":9,"d":30},{"y":1950,"m":10,"d":29}]}
	,1951:{"yearStart":{"y":1950,"m":11,"d":24},"yearEnd":{"y":1951,"m":12,"d":4},"monthEndDays":[{"y":1950,"m":11,"d":30},{"y":1950,"m":12,"d":29},{"y":1951,"m":1,"d":30},{"y":1951,"m":2,"d":29},{"y":1951,"m":3,"d":30},{"y":1951,"m":4,"d":30},{"y":1951,"m":5,"d":29},{"y":1951,"m":6,"d":30},{"y":1951,"m":7,"d":29},{"y":1951,"m":8,"d":30},{"y":1951,"m":9,"d":29},{"y":1951,"m":10,"d":30},{"y":1951,"m":11,"d":29}]}
	,1952:{"yearStart":{"y":1951,"m":12,"d":5},"yearEnd":{"y":1952,"m":11,"d":15},"monthEndDays":[{"y":1951,"m":12,"d":30},{"y":1952,"m":1,"d":29},{"y":1952,"m":2,"d":30},{"y":1952,"m":3,"d":29},{"y":1952,"m":4,"d":30},{"y":1952,"m":5,"d":29},{"y":1952,"m":5,"d":30,"isLeap":true},{"y":1952,"m":6,"d":30},{"y":1952,"m":7,"d":29},{"y":1952,"m":8,"d":30},{"y":1952,"m":9,"d":29},{"y":1952,"m":10,"d":30}]}
	,1953:{"yearStart":{"y":1952,"m":11,"d":16},"yearEnd":{"y":1953,"m":11,"d":26},"monthEndDays":[{"y":1952,"m":11,"d":29},{"y":1952,"m":12,"d":30},{"y":1953,"m":1,"d":29},{"y":1953,"m":2,"d":30},{"y":1953,"m":3,"d":29},{"y":1953,"m":4,"d":29},{"y":1953,"m":5,"d":30},{"y":1953,"m":6,"d":30},{"y":1953,"m":7,"d":29},{"y":1953,"m":8,"d":30},{"y":1953,"m":9,"d":30},{"y":1953,"m":10,"d":29}]}
	,1954:{"yearStart":{"y":1953,"m":11,"d":27},"yearEnd":{"y":1954,"m":12,"d":7},"monthEndDays":[{"y":1953,"m":11,"d":30},{"y":1953,"m":12,"d":30},{"y":1954,"m":1,"d":29},{"y":1954,"m":2,"d":29},{"y":1954,"m":3,"d":30},{"y":1954,"m":4,"d":29},{"y":1954,"m":5,"d":29},{"y":1954,"m":6,"d":30},{"y":1954,"m":7,"d":29},{"y":1954,"m":8,"d":30},{"y":1954,"m":9,"d":30},{"y":1954,"m":10,"d":29},{"y":1954,"m":11,"d":30}]}
	,1955:{"yearStart":{"y":1954,"m":12,"d":8},"yearEnd":{"y":1955,"m":11,"d":18},"monthEndDays":[{"y":1954,"m":12,"d":30},{"y":1955,"m":1,"d":30},{"y":1955,"m":2,"d":29},{"y":1955,"m":3,"d":29},{"y":1955,"m":3,"d":30,"isLeap":true},{"y":1955,"m":4,"d":29},{"y":1955,"m":5,"d":29},{"y":1955,"m":6,"d":30},{"y":1955,"m":7,"d":29},{"y":1955,"m":8,"d":30},{"y":1955,"m":9,"d":29},{"y":1955,"m":10,"d":30}]}
	,1956:{"yearStart":{"y":1955,"m":11,"d":19},"yearEnd":{"y":1956,"m":11,"d":30},"monthEndDays":[{"y":1955,"m":11,"d":30},{"y":1955,"m":12,"d":30},{"y":1956,"m":1,"d":29},{"y":1956,"m":2,"d":30},{"y":1956,"m":3,"d":29},{"y":1956,"m":4,"d":30},{"y":1956,"m":5,"d":29},{"y":1956,"m":6,"d":29},{"y":1956,"m":7,"d":30},{"y":1956,"m":8,"d":29},{"y":1956,"m":9,"d":30},{"y":1956,"m":10,"d":29},{"y":1956,"m":11,"d":30}]}
	,1957:{"yearStart":{"y":1956,"m":12,"d":1},"yearEnd":{"y":1957,"m":11,"d":11},"monthEndDays":[{"y":1956,"m":12,"d":30},{"y":1957,"m":1,"d":30},{"y":1957,"m":2,"d":29},{"y":1957,"m":3,"d":30},{"y":1957,"m":4,"d":29},{"y":1957,"m":5,"d":30},{"y":1957,"m":6,"d":29},{"y":1957,"m":7,"d":29},{"y":1957,"m":8,"d":30},{"y":1957,"m":8,"d":29,"isLeap":true},{"y":1957,"m":9,"d":30},{"y":1957,"m":10,"d":29}]}
	,1958:{"yearStart":{"y":1957,"m":11,"d":12},"yearEnd":{"y":1958,"m":11,"d":21},"monthEndDays":[{"y":1957,"m":11,"d":30},{"y":1957,"m":12,"d":30},{"y":1958,"m":1,"d":29},{"y":1958,"m":2,"d":30},{"y":1958,"m":3,"d":30},{"y":1958,"m":4,"d":29},{"y":1958,"m":5,"d":30},{"y":1958,"m":6,"d":29},{"y":1958,"m":7,"d":29},{"y":1958,"m":8,"d":30},{"y":1958,"m":9,"d":29},{"y":1958,"m":10,"d":30}]}
	,1959:{"yearStart":{"y":1958,"m":11,"d":22},"yearEnd":{"y":1959,"m":12,"d":2},"monthEndDays":[{"y":1958,"m":11,"d":29},{"y":1958,"m":12,"d":30},{"y":1959,"m":1,"d":29},{"y":1959,"m":2,"d":30},{"y":1959,"m":3,"d":30},{"y":1959,"m":4,"d":29},{"y":1959,"m":5,"d":30},{"y":1959,"m":6,"d":29},{"y":1959,"m":7,"d":30},{"y":1959,"m":8,"d":29},{"y":1959,"m":9,"d":30},{"y":1959,"m":10,"d":29},{"y":1959,"m":11,"d":30}]}
	,1960:{"yearStart":{"y":1959,"m":12,"d":3},"yearEnd":{"y":1960,"m":11,"d":14},"monthEndDays":[{"y":1959,"m":12,"d":29},{"y":1960,"m":1,"d":30},{"y":1960,"m":2,"d":29},{"y":1960,"m":3,"d":30},{"y":1960,"m":4,"d":29},{"y":1960,"m":5,"d":30},{"y":1960,"m":6,"d":30},{"y":1960,"m":6,"d":29,"isLeap":true},{"y":1960,"m":7,"d":30},{"y":1960,"m":8,"d":29},{"y":1960,"m":9,"d":30},{"y":1960,"m":10,"d":29}]}
	,1961:{"yearStart":{"y":1960,"m":11,"d":15},"yearEnd":{"y":1961,"m":11,"d":24},"monthEndDays":[{"y":1960,"m":11,"d":30},{"y":1960,"m":12,"d":29},{"y":1961,"m":1,"d":30},{"y":1961,"m":2,"d":29},{"y":1961,"m":3,"d":30},{"y":1961,"m":4,"d":29},{"y":1961,"m":5,"d":30},{"y":1961,"m":6,"d":29},{"y":1961,"m":7,"d":30},{"y":1961,"m":8,"d":30},{"y":1961,"m":9,"d":29},{"y":1961,"m":10,"d":30}]}
	,1962:{"yearStart":{"y":1961,"m":11,"d":25},"yearEnd":{"y":1962,"m":12,"d":5},"monthEndDays":[{"y":1961,"m":11,"d":29},{"y":1961,"m":12,"d":30},{"y":1962,"m":1,"d":29},{"y":1962,"m":2,"d":30},{"y":1962,"m":3,"d":29},{"y":1962,"m":4,"d":29},{"y":1962,"m":5,"d":30},{"y":1962,"m":6,"d":29},{"y":1962,"m":7,"d":30},{"y":1962,"m":8,"d":30},{"y":1962,"m":9,"d":29},{"y":1962,"m":10,"d":30},{"y":1962,"m":11,"d":30}]}
	,1963:{"yearStart":{"y":1962,"m":12,"d":6},"yearEnd":{"y":1963,"m":11,"d":16},"monthEndDays":[{"y":1962,"m":12,"d":29},{"y":1963,"m":1,"d":30},{"y":1963,"m":2,"d":29},{"y":1963,"m":3,"d":30},{"y":1963,"m":4,"d":29},{"y":1963,"m":4,"d":29,"isLeap":true},{"y":1963,"m":5,"d":30},{"y":1963,"m":6,"d":29},{"y":1963,"m":7,"d":30},{"y":1963,"m":8,"d":29},{"y":1963,"m":9,"d":30},{"y":1963,"m":10,"d":30}]}
	,1964:{"yearStart":{"y":1963,"m":11,"d":17},"yearEnd":{"y":1964,"m":11,"d":28},"monthEndDays":[{"y":1963,"m":11,"d":30},{"y":1963,"m":12,"d":29},{"y":1964,"m":1,"d":30},{"y":1964,"m":2,"d":29},{"y":1964,"m":3,"d":30},{"y":1964,"m":4,"d":29},{"y":1964,"m":5,"d":29},{"y":1964,"m":6,"d":30},{"y":1964,"m":7,"d":29},{"y":1964,"m":8,"d":30},{"y":1964,"m":9,"d":29},{"y":1964,"m":10,"d":30}]}
	,1965:{"yearStart":{"y":1964,"m":11,"d":29},"yearEnd":{"y":1965,"m":12,"d":9},"monthEndDays":[{"y":1964,"m":11,"d":30},{"y":1964,"m":12,"d":30},{"y":1965,"m":1,"d":29},{"y":1965,"m":2,"d":30},{"y":1965,"m":3,"d":29},{"y":1965,"m":4,"d":30},{"y":1965,"m":5,"d":29},{"y":1965,"m":6,"d":29},{"y":1965,"m":7,"d":30},{"y":1965,"m":8,"d":29},{"y":1965,"m":9,"d":29},{"y":1965,"m":10,"d":30},{"y":1965,"m":11,"d":30}]}
	,1966:{"yearStart":{"y":1965,"m":12,"d":10},"yearEnd":{"y":1966,"m":11,"d":20},"monthEndDays":[{"y":1965,"m":12,"d":30},{"y":1966,"m":1,"d":29},{"y":1966,"m":2,"d":30},{"y":1966,"m":3,"d":30},{"y":1966,"m":3,"d":29,"isLeap":true},{"y":1966,"m":4,"d":30},{"y":1966,"m":5,"d":29},{"y":1966,"m":6,"d":29},{"y":1966,"m":7,"d":30},{"y":1966,"m":8,"d":29},{"y":1966,"m":9,"d":29},{"y":1966,"m":10,"d":30}]}
	,1967:{"yearStart":{"y":1966,"m":11,"d":21},"yearEnd":{"y":1967,"m":12,"d":1},"monthEndDays":[{"y":1966,"m":11,"d":30},{"y":1966,"m":12,"d":29},{"y":1967,"m":1,"d":30},{"y":1967,"m":2,"d":30},{"y":1967,"m":3,"d":29},{"y":1967,"m":4,"d":30},{"y":1967,"m":5,"d":30},{"y":1967,"m":6,"d":29},{"y":1967,"m":7,"d":29},{"y":1967,"m":8,"d":30},{"y":1967,"m":9,"d":29},{"y":1967,"m":10,"d":30},{"y":1967,"m":11,"d":29}]}
	,1968:{"yearStart":{"y":1967,"m":12,"d":2},"yearEnd":{"y":1968,"m":11,"d":12},"monthEndDays":[{"y":1967,"m":12,"d":30},{"y":1968,"m":1,"d":29},{"y":1968,"m":2,"d":30},{"y":1968,"m":3,"d":30},{"y":1968,"m":4,"d":29},{"y":1968,"m":5,"d":30},{"y":1968,"m":6,"d":29},{"y":1968,"m":7,"d":30},{"y":1968,"m":7,"d":29,"isLeap":true},{"y":1968,"m":8,"d":30},{"y":1968,"m":9,"d":29},{"y":1968,"m":10,"d":30}]}
	,1969:{"yearStart":{"y":1968,"m":11,"d":13},"yearEnd":{"y":1969,"m":11,"d":23},"monthEndDays":[{"y":1968,"m":11,"d":29},{"y":1968,"m":12,"d":30},{"y":1969,"m":1,"d":29},{"y":1969,"m":2,"d":30},{"y":1969,"m":3,"d":29},{"y":1969,"m":4,"d":30},{"y":1969,"m":5,"d":29},{"y":1969,"m":6,"d":30},{"y":1969,"m":7,"d":30},{"y":1969,"m":8,"d":29},{"y":1969,"m":9,"d":30},{"y":1969,"m":10,"d":29}]}
	,1970:{"yearStart":{"y":1969,"m":11,"d":24},"yearEnd":{"y":1970,"m":12,"d":4},"monthEndDays":[{"y":1969,"m":11,"d":30},{"y":1969,"m":12,"d":29},{"y":1970,"m":1,"d":30},{"y":1970,"m":2,"d":29},{"y":1970,"m":3,"d":29},{"y":1970,"m":4,"d":30},{"y":1970,"m":5,"d":30},{"y":1970,"m":6,"d":29},{"y":1970,"m":7,"d":30},{"y":1970,"m":8,"d":29},{"y":1970,"m":9,"d":30},{"y":1970,"m":10,"d":30},{"y":1970,"m":11,"d":29}]}
	,1971:{"yearStart":{"y":1970,"m":12,"d":5},"yearEnd":{"y":1971,"m":11,"d":14},"monthEndDays":[{"y":1970,"m":12,"d":30},{"y":1971,"m":1,"d":29},{"y":1971,"m":2,"d":30},{"y":1971,"m":3,"d":29},{"y":1971,"m":4,"d":29},{"y":1971,"m":5,"d":30},{"y":1971,"m":5,"d":29,"isLeap":true},{"y":1971,"m":6,"d":30},{"y":1971,"m":7,"d":29},{"y":1971,"m":8,"d":30},{"y":1971,"m":9,"d":30},{"y":1971,"m":10,"d":30}]}
	,1972:{"yearStart":{"y":1971,"m":11,"d":15},"yearEnd":{"y":1972,"m":11,"d":26},"monthEndDays":[{"y":1971,"m":11,"d":29},{"y":1971,"m":12,"d":30},{"y":1972,"m":1,"d":29},{"y":1972,"m":2,"d":30},{"y":1972,"m":3,"d":29},{"y":1972,"m":4,"d":29},{"y":1972,"m":5,"d":30},{"y":1972,"m":6,"d":29},{"y":1972,"m":7,"d":30},{"y":1972,"m":8,"d":29},{"y":1972,"m":9,"d":30},{"y":1972,"m":10,"d":30}]}
	,1973:{"yearStart":{"y":1972,"m":11,"d":27},"yearEnd":{"y":1973,"m":12,"d":7},"monthEndDays":[{"y":1972,"m":11,"d":30},{"y":1972,"m":12,"d":29},{"y":1973,"m":1,"d":30},{"y":1973,"m":2,"d":29},{"y":1973,"m":3,"d":30},{"y":1973,"m":4,"d":29},{"y":1973,"m":5,"d":29},{"y":1973,"m":6,"d":30},{"y":1973,"m":7,"d":29},{"y":1973,"m":8,"d":29},{"y":1973,"m":9,"d":30},{"y":1973,"m":10,"d":30},{"y":1973,"m":11,"d":30}]}
	,1974:{"yearStart":{"y":1973,"m":12,"d":8},"yearEnd":{"y":1974,"m":11,"d":18},"monthEndDays":[{"y":1973,"m":12,"d":29},{"y":1974,"m":1,"d":30},{"y":1974,"m":2,"d":30},{"y":1974,"m":3,"d":29},{"y":1974,"m":4,"d":30},{"y":1974,"m":4,"d":29,"isLeap":true},{"y":1974,"m":5,"d":29},{"y":1974,"m":6,"d":30},{"y":1974,"m":7,"d":29},{"y":1974,"m":8,"d":29},{"y":1974,"m":9,"d":30},{"y":1974,"m":10,"d":30}]}
	,1975:{"yearStart":{"y":1974,"m":11,"d":19},"yearEnd":{"y":1975,"m":11,"d":29},"monthEndDays":[{"y":1974,"m":11,"d":29},{"y":1974,"m":12,"d":30},{"y":1975,"m":1,"d":30},{"y":1975,"m":2,"d":30},{"y":1975,"m":3,"d":29},{"y":1975,"m":4,"d":30},{"y":1975,"m":5,"d":29},{"y":1975,"m":6,"d":29},{"y":1975,"m":7,"d":30},{"y":1975,"m":8,"d":29},{"y":1975,"m":9,"d":29},{"y":1975,"m":10,"d":30},{"y":1975,"m":11,"d":29}]}
	,1976:{"yearStart":{"y":1975,"m":12,"d":1},"yearEnd":{"y":1976,"m":11,"d":11},"monthEndDays":[{"y":1975,"m":12,"d":30},{"y":1976,"m":1,"d":30},{"y":1976,"m":2,"d":30},{"y":1976,"m":3,"d":29},{"y":1976,"m":4,"d":30},{"y":1976,"m":5,"d":29},{"y":1976,"m":6,"d":30},{"y":1976,"m":7,"d":29},{"y":1976,"m":8,"d":30},{"y":1976,"m":8,"d":29,"isLeap":true},{"y":1976,"m":9,"d":30},{"y":1976,"m":10,"d":29}]}
	,1977:{"yearStart":{"y":1976,"m":11,"d":12},"yearEnd":{"y":1977,"m":11,"d":21},"monthEndDays":[{"y":1976,"m":11,"d":29},{"y":1976,"m":12,"d":30},{"y":1977,"m":1,"d":30},{"y":1977,"m":2,"d":29},{"y":1977,"m":3,"d":30},{"y":1977,"m":4,"d":30},{"y":1977,"m":5,"d":29},{"y":1977,"m":6,"d":30},{"y":1977,"m":7,"d":29},{"y":1977,"m":8,"d":30},{"y":1977,"m":9,"d":29},{"y":1977,"m":10,"d":30}]}
	,1978:{"yearStart":{"y":1977,"m":11,"d":22},"yearEnd":{"y":1978,"m":12,"d":2},"monthEndDays":[{"y":1977,"m":11,"d":29},{"y":1977,"m":12,"d":29},{"y":1978,"m":1,"d":30},{"y":1978,"m":2,"d":30},{"y":1978,"m":3,"d":29},{"y":1978,"m":4,"d":30},{"y":1978,"m":5,"d":29},{"y":1978,"m":6,"d":30},{"y":1978,"m":7,"d":30},{"y":1978,"m":8,"d":29},{"y":1978,"m":9,"d":30},{"y":1978,"m":10,"d":29},{"y":1978,"m":11,"d":30}]}
	,1979:{"yearStart":{"y":1978,"m":12,"d":3},"yearEnd":{"y":1979,"m":11,"d":13},"monthEndDays":[{"y":1978,"m":12,"d":29},{"y":1979,"m":1,"d":30},{"y":1979,"m":2,"d":29},{"y":1979,"m":3,"d":29},{"y":1979,"m":4,"d":30},{"y":1979,"m":5,"d":29},{"y":1979,"m":6,"d":30},{"y":1979,"m":6,"d":30,"isLeap":true},{"y":1979,"m":7,"d":29},{"y":1979,"m":8,"d":30},{"y":1979,"m":9,"d":30},{"y":1979,"m":10,"d":29}]}
	,1980:{"yearStart":{"y":1979,"m":11,"d":14},"yearEnd":{"y":1980,"m":11,"d":25},"monthEndDays":[{"y":1979,"m":11,"d":30},{"y":1979,"m":12,"d":29},{"y":1980,"m":1,"d":30},{"y":1980,"m":2,"d":29},{"y":1980,"m":3,"d":29},{"y":1980,"m":4,"d":30},{"y":1980,"m":5,"d":29},{"y":1980,"m":6,"d":30},{"y":1980,"m":7,"d":29},{"y":1980,"m":8,"d":30},{"y":1980,"m":9,"d":30},{"y":1980,"m":10,"d":29}]}
	,1981:{"yearStart":{"y":1980,"m":11,"d":26},"yearEnd":{"y":1981,"m":12,"d":6},"monthEndDays":[{"y":1980,"m":11,"d":30},{"y":1980,"m":12,"d":30},{"y":1981,"m":1,"d":29},{"y":1981,"m":2,"d":30},{"y":1981,"m":3,"d":29},{"y":1981,"m":4,"d":29},{"y":1981,"m":5,"d":30},{"y":1981,"m":6,"d":29},{"y":1981,"m":7,"d":29},{"y":1981,"m":8,"d":30},{"y":1981,"m":9,"d":30},{"y":1981,"m":10,"d":29},{"y":1981,"m":11,"d":30}]}
	,1982:{"yearStart":{"y":1981,"m":12,"d":7},"yearEnd":{"y":1982,"m":11,"d":17},"monthEndDays":[{"y":1981,"m":12,"d":30},{"y":1982,"m":1,"d":30},{"y":1982,"m":2,"d":29},{"y":1982,"m":3,"d":30},{"y":1982,"m":4,"d":29},{"y":1982,"m":4,"d":29,"isLeap":true},{"y":1982,"m":5,"d":30},{"y":1982,"m":6,"d":29},{"y":1982,"m":7,"d":29},{"y":1982,"m":8,"d":30},{"y":1982,"m":9,"d":30},{"y":1982,"m":10,"d":29}]}
	,1983:{"yearStart":{"y":1982,"m":11,"d":18},"yearEnd":{"y":1983,"m":11,"d":28},"monthEndDays":[{"y":1982,"m":11,"d":30},{"y":1982,"m":12,"d":30},{"y":1983,"m":1,"d":30},{"y":1983,"m":2,"d":29},{"y":1983,"m":3,"d":30},{"y":1983,"m":4,"d":29},{"y":1983,"m":5,"d":29},{"y":1983,"m":6,"d":30},{"y":1983,"m":7,"d":29},{"y":1983,"m":8,"d":29},{"y":1983,"m":9,"d":30},{"y":1983,"m":10,"d":29}]}
	,1984:{"yearStart":{"y":1983,"m":11,"d":29},"yearEnd":{"y":1984,"m":11,"d":10},"monthEndDays":[{"y":1983,"m":11,"d":30},{"y":1983,"m":12,"d":30},{"y":1984,"m":1,"d":30},{"y":1984,"m":2,"d":29},{"y":1984,"m":3,"d":30},{"y":1984,"m":4,"d":30},{"y":1984,"m":5,"d":29},{"y":1984,"m":6,"d":29},{"y":1984,"m":7,"d":30},{"y":1984,"m":8,"d":29},{"y":1984,"m":9,"d":29},{"y":1984,"m":10,"d":30},{"y":1984,"m":10,"d":29,"isLeap":true}]}
	,1985:{"yearStart":{"y":1984,"m":11,"d":11},"yearEnd":{"y":1985,"m":11,"d":20},"monthEndDays":[{"y":1984,"m":11,"d":30},{"y":1984,"m":12,"d":30},{"y":1985,"m":1,"d":29},{"y":1985,"m":2,"d":30},{"y":1985,"m":3,"d":30},{"y":1985,"m":4,"d":29},{"y":1985,"m":5,"d":30},{"y":1985,"m":6,"d":29},{"y":1985,"m":7,"d":30},{"y":1985,"m":8,"d":29},{"y":1985,"m":9,"d":29},{"y":1985,"m":10,"d":30}]}
	,1986:{"yearStart":{"y":1985,"m":11,"d":21},"yearEnd":{"y":1986,"m":12,"d":1},"monthEndDays":[{"y":1985,"m":11,"d":29},{"y":1985,"m":12,"d":30},{"y":1986,"m":1,"d":29},{"y":1986,"m":2,"d":30},{"y":1986,"m":3,"d":30},{"y":1986,"m":4,"d":29},{"y":1986,"m":5,"d":30},{"y":1986,"m":6,"d":30},{"y":1986,"m":7,"d":29},{"y":1986,"m":8,"d":30},{"y":1986,"m":9,"d":29},{"y":1986,"m":10,"d":30},{"y":1986,"m":11,"d":29}]}
	,1987:{"yearStart":{"y":1986,"m":12,"d":2},"yearEnd":{"y":1987,"m":11,"d":11},"monthEndDays":[{"y":1986,"m":12,"d":29},{"y":1987,"m":1,"d":30},{"y":1987,"m":2,"d":29},{"y":1987,"m":3,"d":30},{"y":1987,"m":4,"d":30},{"y":1987,"m":5,"d":29},{"y":1987,"m":6,"d":30},{"y":1987,"m":6,"d":29,"isLeap":true},{"y":1987,"m":7,"d":30},{"y":1987,"m":8,"d":30},{"y":1987,"m":9,"d":29},{"y":1987,"m":10,"d":30}]}
	,1988:{"yearStart":{"y":1987,"m":11,"d":12},"yearEnd":{"y":1988,"m":11,"d":23},"monthEndDays":[{"y":1987,"m":11,"d":29},{"y":1987,"m":12,"d":30},{"y":1988,"m":1,"d":29},{"y":1988,"m":2,"d":29},{"y":1988,"m":3,"d":30},{"y":1988,"m":4,"d":29},{"y":1988,"m":5,"d":30},{"y":1988,"m":6,"d":29},{"y":1988,"m":7,"d":30},{"y":1988,"m":8,"d":30},{"y":1988,"m":9,"d":29},{"y":1988,"m":10,"d":30}]}
	,1989:{"yearStart":{"y":1988,"m":11,"d":24},"yearEnd":{"y":1989,"m":12,"d":4},"monthEndDays":[{"y":1988,"m":11,"d":30},{"y":1988,"m":12,"d":29},{"y":1989,"m":1,"d":30},{"y":1989,"m":2,"d":29},{"y":1989,"m":3,"d":29},{"y":1989,"m":4,"d":30},{"y":1989,"m":5,"d":29},{"y":1989,"m":6,"d":30},{"y":1989,"m":7,"d":29},{"y":1989,"m":8,"d":30},{"y":1989,"m":9,"d":30},{"y":1989,"m":10,"d":29},{"y":1989,"m":11,"d":30}]}
	,1990:{"yearStart":{"y":1989,"m":12,"d":5},"yearEnd":{"y":1990,"m":11,"d":15},"monthEndDays":[{"y":1989,"m":12,"d":30},{"y":1990,"m":1,"d":29},{"y":1990,"m":2,"d":30},{"y":1990,"m":3,"d":29},{"y":1990,"m":4,"d":29},{"y":1990,"m":5,"d":30},{"y":1990,"m":5,"d":29,"isLeap":true},{"y":1990,"m":6,"d":29},{"y":1990,"m":7,"d":30},{"y":1990,"m":8,"d":30},{"y":1990,"m":9,"d":29},{"y":1990,"m":10,"d":30}]}
	,1991:{"yearStart":{"y":1990,"m":11,"d":16},"yearEnd":{"y":1991,"m":11,"d":26},"monthEndDays":[{"y":1990,"m":11,"d":30},{"y":1990,"m":12,"d":30},{"y":1991,"m":1,"d":29},{"y":1991,"m":2,"d":30},{"y":1991,"m":3,"d":29},{"y":1991,"m":4,"d":29},{"y":1991,"m":5,"d":30},{"y":1991,"m":6,"d":29},{"y":1991,"m":7,"d":29},{"y":1991,"m":8,"d":30},{"y":1991,"m":9,"d":29},{"y":1991,"m":10,"d":30}]}
	,1992:{"yearStart":{"y":1991,"m":11,"d":27},"yearEnd":{"y":1992,"m":12,"d":8},"monthEndDays":[{"y":1991,"m":11,"d":30},{"y":1991,"m":12,"d":30},{"y":1992,"m":1,"d":29},{"y":1992,"m":2,"d":30},{"y":1992,"m":3,"d":30},{"y":1992,"m":4,"d":29},{"y":1992,"m":5,"d":29},{"y":1992,"m":6,"d":30},{"y":1992,"m":7,"d":29},{"y":1992,"m":8,"d":29},{"y":1992,"m":9,"d":30},{"y":1992,"m":10,"d":29},{"y":1992,"m":11,"d":30}]}
	,1993:{"yearStart":{"y":1992,"m":12,"d":9},"yearEnd":{"y":1993,"m":11,"d":19},"monthEndDays":[{"y":1992,"m":12,"d":30},{"y":1993,"m":1,"d":29},{"y":1993,"m":2,"d":30},{"y":1993,"m":3,"d":30},{"y":1993,"m":3,"d":29,"isLeap":true},{"y":1993,"m":4,"d":30},{"y":1993,"m":5,"d":29},{"y":1993,"m":6,"d":30},{"y":1993,"m":7,"d":29},{"y":1993,"m":8,"d":29},{"y":1993,"m":9,"d":30},{"y":1993,"m":10,"d":29}]}
	,1994:{"yearStart":{"y":1993,"m":11,"d":20},"yearEnd":{"y":1994,"m":11,"d":29},"monthEndDays":[{"y":1993,"m":11,"d":30},{"y":1993,"m":12,"d":29},{"y":1994,"m":1,"d":30},{"y":1994,"m":2,"d":30},{"y":1994,"m":3,"d":30},{"y":1994,"m":4,"d":29},{"y":1994,"m":5,"d":30},{"y":1994,"m":6,"d":29},{"y":1994,"m":7,"d":30},{"y":1994,"m":8,"d":29},{"y":1994,"m":9,"d":29},{"y":1994,"m":10,"d":30},{"y":1994,"m":11,"d":29}]}
	,1995:{"yearStart":{"y":1994,"m":12,"d":1},"yearEnd":{"y":1995,"m":11,"d":10},"monthEndDays":[{"y":1994,"m":12,"d":30},{"y":1995,"m":1,"d":29},{"y":1995,"m":2,"d":30},{"y":1995,"m":3,"d":30},{"y":1995,"m":4,"d":29},{"y":1995,"m":5,"d":30},{"y":1995,"m":6,"d":30},{"y":1995,"m":7,"d":29},{"y":1995,"m":8,"d":30},{"y":1995,"m":8,"d":29,"isLeap":true},{"y":1995,"m":9,"d":30},{"y":1995,"m":10,"d":29}]}
	,1996:{"yearStart":{"y":1995,"m":11,"d":11},"yearEnd":{"y":1996,"m":11,"d":21},"monthEndDays":[{"y":1995,"m":11,"d":29},{"y":1995,"m":12,"d":30},{"y":1996,"m":1,"d":29},{"y":1996,"m":2,"d":30},{"y":1996,"m":3,"d":29},{"y":1996,"m":4,"d":30},{"y":1996,"m":5,"d":30},{"y":1996,"m":6,"d":29},{"y":1996,"m":7,"d":30},{"y":1996,"m":8,"d":29},{"y":1996,"m":9,"d":30},{"y":1996,"m":10,"d":30}]}
	,1997:{"yearStart":{"y":1996,"m":11,"d":22},"yearEnd":{"y":1997,"m":12,"d":2},"monthEndDays":[{"y":1996,"m":11,"d":29},{"y":1996,"m":12,"d":30},{"y":1997,"m":1,"d":29},{"y":1997,"m":2,"d":29},{"y":1997,"m":3,"d":30},{"y":1997,"m":4,"d":29},{"y":1997,"m":5,"d":30},{"y":1997,"m":6,"d":29},{"y":1997,"m":7,"d":30},{"y":1997,"m":8,"d":30},{"y":1997,"m":9,"d":29},{"y":1997,"m":10,"d":30},{"y":1997,"m":11,"d":30}]}
	,1998:{"yearStart":{"y":1997,"m":12,"d":3},"yearEnd":{"y":1998,"m":11,"d":13},"monthEndDays":[{"y":1997,"m":12,"d":29},{"y":1998,"m":1,"d":30},{"y":1998,"m":2,"d":29},{"y":1998,"m":3,"d":29},{"y":1998,"m":4,"d":30},{"y":1998,"m":5,"d":29},{"y":1998,"m":5,"d":29,"isLeap":true},{"y":1998,"m":6,"d":30},{"y":1998,"m":7,"d":30},{"y":1998,"m":8,"d":29},{"y":1998,"m":9,"d":30},{"y":1998,"m":10,"d":30}]}
	,1999:{"yearStart":{"y":1998,"m":11,"d":14},"yearEnd":{"y":1999,"m":11,"d":24},"monthEndDays":[{"y":1998,"m":11,"d":30},{"y":1998,"m":12,"d":29},{"y":1999,"m":1,"d":30},{"y":1999,"m":2,"d":29},{"y":1999,"m":3,"d":29},{"y":1999,"m":4,"d":30},{"y":1999,"m":5,"d":29},{"y":1999,"m":6,"d":29},{"y":1999,"m":7,"d":30},{"y":1999,"m":8,"d":29},{"y":1999,"m":9,"d":30},{"y":1999,"m":10,"d":30}]}
	,2000:{"yearStart":{"y":1999,"m":11,"d":25},"yearEnd":{"y":2000,"m":12,"d":6},"monthEndDays":[{"y":1999,"m":11,"d":30},{"y":1999,"m":12,"d":29},{"y":2000,"m":1,"d":30},{"y":2000,"m":2,"d":30},{"y":2000,"m":3,"d":29},{"y":2000,"m":4,"d":29},{"y":2000,"m":5,"d":30},{"y":2000,"m":6,"d":29},{"y":2000,"m":7,"d":29},{"y":2000,"m":8,"d":30},{"y":2000,"m":9,"d":29},{"y":2000,"m":10,"d":30},{"y":2000,"m":11,"d":30}]}
	,2001:{"yearStart":{"y":2000,"m":12,"d":7},"yearEnd":{"y":2001,"m":11,"d":17},"monthEndDays":[{"y":2000,"m":12,"d":29},{"y":2001,"m":1,"d":30},{"y":2001,"m":2,"d":30},{"y":2001,"m":3,"d":30},{"y":2001,"m":4,"d":29},{"y":2001,"m":4,"d":29,"isLeap":true},{"y":2001,"m":5,"d":30},{"y":2001,"m":6,"d":29},{"y":2001,"m":7,"d":29},{"y":2001,"m":8,"d":30},{"y":2001,"m":9,"d":29},{"y":2001,"m":10,"d":30}]}
	,2002:{"yearStart":{"y":2001,"m":11,"d":18},"yearEnd":{"y":2002,"m":11,"d":28},"monthEndDays":[{"y":2001,"m":11,"d":29},{"y":2001,"m":12,"d":30},{"y":2002,"m":1,"d":30},{"y":2002,"m":2,"d":30},{"y":2002,"m":3,"d":29},{"y":2002,"m":4,"d":30},{"y":2002,"m":5,"d":29},{"y":2002,"m":6,"d":30},{"y":2002,"m":7,"d":29},{"y":2002,"m":8,"d":29},{"y":2002,"m":9,"d":30},{"y":2002,"m":10,"d":29}]}
	,2003:{"yearStart":{"y":2002,"m":11,"d":29},"yearEnd":{"y":2003,"m":12,"d":9},"monthEndDays":[{"y":2002,"m":11,"d":30},{"y":2002,"m":12,"d":29},{"y":2003,"m":1,"d":30},{"y":2003,"m":2,"d":30},{"y":2003,"m":3,"d":29},{"y":2003,"m":4,"d":30},{"y":2003,"m":5,"d":30},{"y":2003,"m":6,"d":29},{"y":2003,"m":7,"d":30},{"y":2003,"m":8,"d":29},{"y":2003,"m":9,"d":29},{"y":2003,"m":10,"d":30},{"y":2003,"m":11,"d":29}]}
	,2004:{"yearStart":{"y":2003,"m":12,"d":10},"yearEnd":{"y":2004,"m":11,"d":20},"monthEndDays":[{"y":2003,"m":12,"d":30},{"y":2004,"m":1,"d":29},{"y":2004,"m":2,"d":30},{"y":2004,"m":2,"d":29,"isLeap":true},{"y":2004,"m":3,"d":30},{"y":2004,"m":4,"d":30},{"y":2004,"m":5,"d":29},{"y":2004,"m":6,"d":30},{"y":2004,"m":7,"d":29},{"y":2004,"m":8,"d":30},{"y":2004,"m":9,"d":29},{"y":2004,"m":10,"d":30}]}
	,2005:{"yearStart":{"y":2004,"m":11,"d":21},"yearEnd":{"y":2005,"m":12,"d":1},"monthEndDays":[{"y":2004,"m":11,"d":29},{"y":2004,"m":12,"d":30},{"y":2005,"m":1,"d":29},{"y":2005,"m":2,"d":30},{"y":2005,"m":3,"d":29},{"y":2005,"m":4,"d":30},{"y":2005,"m":5,"d":29},{"y":2005,"m":6,"d":30},{"y":2005,"m":7,"d":30},{"y":2005,"m":8,"d":29},{"y":2005,"m":9,"d":30},{"y":2005,"m":10,"d":30},{"y":2005,"m":11,"d":29}]}
	,2006:{"yearStart":{"y":2005,"m":12,"d":2},"yearEnd":{"y":2006,"m":11,"d":12},"monthEndDays":[{"y":2005,"m":12,"d":29},{"y":2006,"m":1,"d":30},{"y":2006,"m":2,"d":29},{"y":2006,"m":3,"d":30},{"y":2006,"m":4,"d":29},{"y":2006,"m":5,"d":30},{"y":2006,"m":6,"d":29},{"y":2006,"m":7,"d":30},{"y":2006,"m":7,"d":29,"isLeap":true},{"y":2006,"m":8,"d":30},{"y":2006,"m":9,"d":30},{"y":2006,"m":10,"d":29}]}
	,2007:{"yearStart":{"y":2006,"m":11,"d":13},"yearEnd":{"y":2007,"m":11,"d":22},"monthEndDays":[{"y":2006,"m":11,"d":30},{"y":2006,"m":12,"d":30},{"y":2007,"m":1,"d":29},{"y":2007,"m":2,"d":29},{"y":2007,"m":3,"d":30},{"y":2007,"m":4,"d":29},{"y":2007,"m":5,"d":29},{"y":2007,"m":6,"d":30},{"y":2007,"m":7,"d":29},{"y":2007,"m":8,"d":30},{"y":2007,"m":9,"d":30},{"y":2007,"m":10,"d":30}]}
	,2008:{"yearStart":{"y":2007,"m":11,"d":23},"yearEnd":{"y":2008,"m":12,"d":5},"monthEndDays":[{"y":2007,"m":11,"d":29},{"y":2007,"m":12,"d":30},{"y":2008,"m":1,"d":30},{"y":2008,"m":2,"d":29},{"y":2008,"m":3,"d":29},{"y":2008,"m":4,"d":30},{"y":2008,"m":5,"d":29},{"y":2008,"m":6,"d":29},{"y":2008,"m":7,"d":30},{"y":2008,"m":8,"d":29},{"y":2008,"m":9,"d":30},{"y":2008,"m":10,"d":30},{"y":2008,"m":11,"d":29}]}
	,2009:{"yearStart":{"y":2008,"m":12,"d":6},"yearEnd":{"y":2009,"m":11,"d":16},"monthEndDays":[{"y":2008,"m":12,"d":30},{"y":2009,"m":1,"d":30},{"y":2009,"m":2,"d":30},{"y":2009,"m":3,"d":29},{"y":2009,"m":4,"d":29},{"y":2009,"m":5,"d":30},{"y":2009,"m":5,"d":29,"isLeap":true},{"y":2009,"m":6,"d":29},{"y":2009,"m":7,"d":30},{"y":2009,"m":8,"d":29},{"y":2009,"m":9,"d":30},{"y":2009,"m":10,"d":29}]}
	,2010:{"yearStart":{"y":2009,"m":11,"d":17},"yearEnd":{"y":2010,"m":11,"d":26},"monthEndDays":[{"y":2009,"m":11,"d":30},{"y":2009,"m":12,"d":30},{"y":2010,"m":1,"d":30},{"y":2010,"m":2,"d":29},{"y":2010,"m":3,"d":30},{"y":2010,"m":4,"d":29},{"y":2010,"m":5,"d":30},{"y":2010,"m":6,"d":29},{"y":2010,"m":7,"d":29},{"y":2010,"m":8,"d":30},{"y":2010,"m":9,"d":29},{"y":2010,"m":10,"d":30}]}
	,2011:{"yearStart":{"y":2010,"m":11,"d":27},"yearEnd":{"y":2011,"m":12,"d":7},"monthEndDays":[{"y":2010,"m":11,"d":29},{"y":2010,"m":12,"d":30},{"y":2011,"m":1,"d":30},{"y":2011,"m":2,"d":29},{"y":2011,"m":3,"d":30},{"y":2011,"m":4,"d":30},{"y":2011,"m":5,"d":29},{"y":2011,"m":6,"d":30},{"y":2011,"m":7,"d":29},{"y":2011,"m":8,"d":29},{"y":2011,"m":9,"d":30},{"y":2011,"m":10,"d":29},{"y":2011,"m":11,"d":30}]}
	,2012:{"yearStart":{"y":2011,"m":12,"d":8},"yearEnd":{"y":2012,"m":11,"d":19},"monthEndDays":[{"y":2011,"m":12,"d":29},{"y":2012,"m":1,"d":30},{"y":2012,"m":2,"d":29},{"y":2012,"m":3,"d":30},{"y":2012,"m":3,"d":30,"isLeap":true},{"y":2012,"m":4,"d":30},{"y":2012,"m":5,"d":29},{"y":2012,"m":6,"d":30},{"y":2012,"m":7,"d":29},{"y":2012,"m":8,"d":29},{"y":2012,"m":9,"d":30},{"y":2012,"m":10,"d":29}]}
	,2013:{"yearStart":{"y":2012,"m":11,"d":20},"yearEnd":{"y":2013,"m":11,"d":29},"monthEndDays":[{"y":2012,"m":11,"d":30},{"y":2012,"m":12,"d":29},{"y":2013,"m":1,"d":30},{"y":2013,"m":2,"d":29},{"y":2013,"m":3,"d":30},{"y":2013,"m":4,"d":30},{"y":2013,"m":5,"d":29},{"y":2013,"m":6,"d":30},{"y":2013,"m":7,"d":29},{"y":2013,"m":8,"d":30},{"y":2013,"m":9,"d":29},{"y":2013,"m":10,"d":30},{"y":2013,"m":11,"d":29}]}
	,2014:{"yearStart":{"y":2013,"m":12,"d":1},"yearEnd":{"y":2014,"m":11,"d":10},"monthEndDays":[{"y":2013,"m":12,"d":30},{"y":2014,"m":1,"d":29},{"y":2014,"m":2,"d":30},{"y":2014,"m":3,"d":29},{"y":2014,"m":4,"d":30},{"y":2014,"m":5,"d":29},{"y":2014,"m":6,"d":30},{"y":2014,"m":7,"d":29},{"y":2014,"m":8,"d":30},{"y":2014,"m":9,"d":30},{"y":2014,"m":9,"d":29,"isLeap":true},{"y":2014,"m":10,"d":30}]}
	,2015:{"yearStart":{"y":2014,"m":11,"d":11},"yearEnd":{"y":2015,"m":11,"d":21},"monthEndDays":[{"y":2014,"m":11,"d":29},{"y":2014,"m":12,"d":30},{"y":2015,"m":1,"d":29},{"y":2015,"m":2,"d":30},{"y":2015,"m":3,"d":29},{"y":2015,"m":4,"d":29},{"y":2015,"m":5,"d":30},{"y":2015,"m":6,"d":29},{"y":2015,"m":7,"d":30},{"y":2015,"m":8,"d":30},{"y":2015,"m":9,"d":30},{"y":2015,"m":10,"d":29}]}
	,2016:{"yearStart":{"y":2015,"m":11,"d":22},"yearEnd":{"y":2016,"m":12,"d":3},"monthEndDays":[{"y":2015,"m":11,"d":30},{"y":2015,"m":12,"d":29},{"y":2016,"m":1,"d":30},{"y":2016,"m":2,"d":29},{"y":2016,"m":3,"d":30},{"y":2016,"m":4,"d":29},{"y":2016,"m":5,"d":29},{"y":2016,"m":6,"d":30},{"y":2016,"m":7,"d":29},{"y":2016,"m":8,"d":30},{"y":2016,"m":9,"d":30},{"y":2016,"m":10,"d":29},{"y":2016,"m":11,"d":30}]}
	,2017:{"yearStart":{"y":2016,"m":12,"d":4},"yearEnd":{"y":2017,"m":11,"d":14},"monthEndDays":[{"y":2016,"m":12,"d":30},{"y":2017,"m":1,"d":29},{"y":2017,"m":2,"d":30},{"y":2017,"m":3,"d":29},{"y":2017,"m":4,"d":30},{"y":2017,"m":5,"d":29},{"y":2017,"m":5,"d":29,"isLeap":true},{"y":2017,"m":6,"d":30},{"y":2017,"m":7,"d":29},{"y":2017,"m":8,"d":30},{"y":2017,"m":9,"d":29},{"y":2017,"m":10,"d":30}]}
	,2018:{"yearStart":{"y":2017,"m":11,"d":15},"yearEnd":{"y":2018,"m":11,"d":25},"monthEndDays":[{"y":2017,"m":11,"d":30},{"y":2017,"m":12,"d":30},{"y":2018,"m":1,"d":29},{"y":2018,"m":2,"d":30},{"y":2018,"m":3,"d":29},{"y":2018,"m":4,"d":30},{"y":2018,"m":5,"d":29},{"y":2018,"m":6,"d":29},{"y":2018,"m":7,"d":30},{"y":2018,"m":8,"d":29},{"y":2018,"m":9,"d":30},{"y":2018,"m":10,"d":29}]}
	,2019:{"yearStart":{"y":2018,"m":11,"d":26},"yearEnd":{"y":2019,"m":12,"d":6},"monthEndDays":[{"y":2018,"m":11,"d":30},{"y":2018,"m":12,"d":30},{"y":2019,"m":1,"d":30},{"y":2019,"m":2,"d":29},{"y":2019,"m":3,"d":30},{"y":2019,"m":4,"d":29},{"y":2019,"m":5,"d":30},{"y":2019,"m":6,"d":29},{"y":2019,"m":7,"d":29},{"y":2019,"m":8,"d":30},{"y":2019,"m":9,"d":29},{"y":2019,"m":10,"d":30},{"y":2019,"m":11,"d":29}]}
	,2020:{"yearStart":{"y":2019,"m":12,"d":7},"yearEnd":{"y":2020,"m":11,"d":17},"monthEndDays":[{"y":2019,"m":12,"d":30},{"y":2020,"m":1,"d":30},{"y":2020,"m":2,"d":29},{"y":2020,"m":3,"d":30},{"y":2020,"m":4,"d":30},{"y":2020,"m":4,"d":29,"isLeap":true},{"y":2020,"m":5,"d":30},{"y":2020,"m":6,"d":29},{"y":2020,"m":7,"d":29},{"y":2020,"m":8,"d":30},{"y":2020,"m":9,"d":29},{"y":2020,"m":10,"d":30}]}
	,2021:{"yearStart":{"y":2020,"m":11,"d":18},"yearEnd":{"y":2021,"m":11,"d":28},"monthEndDays":[{"y":2020,"m":11,"d":29},{"y":2020,"m":12,"d":30},{"y":2021,"m":1,"d":29},{"y":2021,"m":2,"d":30},{"y":2021,"m":3,"d":30},{"y":2021,"m":4,"d":29},{"y":2021,"m":5,"d":30},{"y":2021,"m":6,"d":29},{"y":2021,"m":7,"d":30},{"y":2021,"m":8,"d":29},{"y":2021,"m":9,"d":30},{"y":2021,"m":10,"d":29}]}
	,2022:{"yearStart":{"y":2021,"m":11,"d":29},"yearEnd":{"y":2022,"m":12,"d":9},"monthEndDays":[{"y":2021,"m":11,"d":30},{"y":2021,"m":12,"d":29},{"y":2022,"m":1,"d":30},{"y":2022,"m":2,"d":29},{"y":2022,"m":3,"d":30},{"y":2022,"m":4,"d":29},{"y":2022,"m":5,"d":30},{"y":2022,"m":6,"d":30},{"y":2022,"m":7,"d":29},{"y":2022,"m":8,"d":30},{"y":2022,"m":9,"d":29},{"y":2022,"m":10,"d":30},{"y":2022,"m":11,"d":29}]}
	,2023:{"yearStart":{"y":2022,"m":12,"d":10},"yearEnd":{"y":2023,"m":11,"d":19},"monthEndDays":[{"y":2022,"m":12,"d":30},{"y":2023,"m":1,"d":29},{"y":2023,"m":2,"d":30},{"y":2023,"m":2,"d":29,"isLeap":true},{"y":2023,"m":3,"d":30},{"y":2023,"m":4,"d":29},{"y":2023,"m":5,"d":30},{"y":2023,"m":6,"d":29},{"y":2023,"m":7,"d":30},{"y":2023,"m":8,"d":30},{"y":2023,"m":9,"d":29},{"y":2023,"m":10,"d":30}]}
	,2024:{"yearStart":{"y":2023,"m":11,"d":20},"yearEnd":{"y":2024,"m":12,"d":1},"monthEndDays":[{"y":2023,"m":11,"d":29},{"y":2023,"m":12,"d":30},{"y":2024,"m":1,"d":29},{"y":2024,"m":2,"d":30},{"y":2024,"m":3,"d":29},{"y":2024,"m":4,"d":29},{"y":2024,"m":5,"d":30},{"y":2024,"m":6,"d":29},{"y":2024,"m":7,"d":30},{"y":2024,"m":8,"d":30},{"y":2024,"m":9,"d":29},{"y":2024,"m":10,"d":30},{"y":2024,"m":11,"d":30}]}
	,2025:{"yearStart":{"y":2024,"m":12,"d":2},"yearEnd":{"y":2025,"m":11,"d":12},"monthEndDays":[{"y":2024,"m":12,"d":29},{"y":2025,"m":1,"d":30},{"y":2025,"m":2,"d":29},{"y":2025,"m":3,"d":30},{"y":2025,"m":4,"d":29},{"y":2025,"m":5,"d":29},{"y":2025,"m":6,"d":30},{"y":2025,"m":6,"d":29,"isLeap":true},{"y":2025,"m":7,"d":30},{"y":2025,"m":8,"d":29},{"y":2025,"m":9,"d":30},{"y":2025,"m":10,"d":30}]}
	,2026:{"yearStart":{"y":2025,"m":11,"d":13},"yearEnd":{"y":2026,"m":11,"d":23},"monthEndDays":[{"y":2025,"m":11,"d":30},{"y":2025,"m":12,"d":29},{"y":2026,"m":1,"d":30},{"y":2026,"m":2,"d":29},{"y":2026,"m":3,"d":30},{"y":2026,"m":4,"d":29},{"y":2026,"m":5,"d":29},{"y":2026,"m":6,"d":30},{"y":2026,"m":7,"d":29},{"y":2026,"m":8,"d":30},{"y":2026,"m":9,"d":29},{"y":2026,"m":10,"d":30}]}
	,2027:{"yearStart":{"y":2026,"m":11,"d":24},"yearEnd":{"y":2027,"m":12,"d":4},"monthEndDays":[{"y":2026,"m":11,"d":30},{"y":2026,"m":12,"d":30},{"y":2027,"m":1,"d":29},{"y":2027,"m":2,"d":30},{"y":2027,"m":3,"d":29},{"y":2027,"m":4,"d":30},{"y":2027,"m":5,"d":29},{"y":2027,"m":6,"d":29},{"y":2027,"m":7,"d":30},{"y":2027,"m":8,"d":29},{"y":2027,"m":9,"d":29},{"y":2027,"m":10,"d":30},{"y":2027,"m":11,"d":30}]}
	,2028:{"yearStart":{"y":2027,"m":12,"d":5},"yearEnd":{"y":2028,"m":11,"d":16},"monthEndDays":[{"y":2027,"m":12,"d":30},{"y":2028,"m":1,"d":29},{"y":2028,"m":2,"d":30},{"y":2028,"m":3,"d":30},{"y":2028,"m":4,"d":29},{"y":2028,"m":5,"d":30},{"y":2028,"m":5,"d":29,"isLeap":true},{"y":2028,"m":6,"d":29},{"y":2028,"m":7,"d":30},{"y":2028,"m":8,"d":29},{"y":2028,"m":9,"d":29},{"y":2028,"m":10,"d":30}]}
	,2029:{"yearStart":{"y":2028,"m":11,"d":17},"yearEnd":{"y":2029,"m":11,"d":27},"monthEndDays":[{"y":2028,"m":11,"d":30},{"y":2028,"m":12,"d":29},{"y":2029,"m":1,"d":30},{"y":2029,"m":2,"d":30},{"y":2029,"m":3,"d":29},{"y":2029,"m":4,"d":30},{"y":2029,"m":5,"d":30},{"y":2029,"m":6,"d":29},{"y":2029,"m":7,"d":29},{"y":2029,"m":8,"d":30},{"y":2029,"m":9,"d":29},{"y":2029,"m":10,"d":29}]}
	,2030:{"yearStart":{"y":2029,"m":11,"d":28},"yearEnd":{"y":2030,"m":12,"d":7},"monthEndDays":[{"y":2029,"m":11,"d":30},{"y":2029,"m":12,"d":30},{"y":2030,"m":1,"d":29},{"y":2030,"m":2,"d":30},{"y":2030,"m":3,"d":29},{"y":2030,"m":4,"d":30},{"y":2030,"m":5,"d":30},{"y":2030,"m":6,"d":29},{"y":2030,"m":7,"d":30},{"y":2030,"m":8,"d":29},{"y":2030,"m":9,"d":30},{"y":2030,"m":10,"d":29},{"y":2030,"m":11,"d":30}]}
	,2031:{"yearStart":{"y":2030,"m":12,"d":8},"yearEnd":{"y":2031,"m":11,"d":18},"monthEndDays":[{"y":2030,"m":12,"d":29},{"y":2031,"m":1,"d":30},{"y":2031,"m":2,"d":29},{"y":2031,"m":3,"d":30},{"y":2031,"m":3,"d":29,"isLeap":true},{"y":2031,"m":4,"d":30},{"y":2031,"m":5,"d":29},{"y":2031,"m":6,"d":30},{"y":2031,"m":7,"d":30},{"y":2031,"m":8,"d":29},{"y":2031,"m":9,"d":30},{"y":2031,"m":10,"d":29}]}
	,2032:{"yearStart":{"y":2031,"m":11,"d":19},"yearEnd":{"y":2032,"m":11,"d":29},"monthEndDays":[{"y":2031,"m":11,"d":30},{"y":2031,"m":12,"d":29},{"y":2032,"m":1,"d":30},{"y":2032,"m":2,"d":29},{"y":2032,"m":3,"d":29},{"y":2032,"m":4,"d":30},{"y":2032,"m":5,"d":29},{"y":2032,"m":6,"d":30},{"y":2032,"m":7,"d":30},{"y":2032,"m":8,"d":29},{"y":2032,"m":9,"d":30},{"y":2032,"m":10,"d":30},{"y":2032,"m":11,"d":29}]}
	,2033:{"yearStart":{"y":2032,"m":12,"d":1},"yearEnd":{"y":2033,"m":11,"d":10,"isLeap":true},"monthEndDays":[{"y":2032,"m":12,"d":30},{"y":2033,"m":1,"d":29},{"y":2033,"m":2,"d":30},{"y":2033,"m":3,"d":29},{"y":2033,"m":4,"d":29},{"y":2033,"m":5,"d":30},{"y":2033,"m":6,"d":29},{"y":2033,"m":7,"d":30},{"y":2033,"m":8,"d":29},{"y":2033,"m":9,"d":30},{"y":2033,"m":10,"d":30},{"y":2033,"m":11,"d":30}]}
	,2034:{"yearStart":{"y":2033,"m":11,"d":11},"yearEnd":{"y":2034,"m":11,"d":21},"monthEndDays":[{"y":2033,"m":11,"d":29,"isLeap":true},{"y":2033,"m":12,"d":30},{"y":2034,"m":1,"d":29},{"y":2034,"m":2,"d":30},{"y":2034,"m":3,"d":29},{"y":2034,"m":4,"d":29},{"y":2034,"m":5,"d":30},{"y":2034,"m":6,"d":29},{"y":2034,"m":7,"d":30},{"y":2034,"m":8,"d":29},{"y":2034,"m":9,"d":30},{"y":2034,"m":10,"d":30}]}
	,2035:{"yearStart":{"y":2034,"m":11,"d":22},"yearEnd":{"y":2035,"m":12,"d":3},"monthEndDays":[{"y":2034,"m":11,"d":30},{"y":2034,"m":12,"d":29},{"y":2035,"m":1,"d":30},{"y":2035,"m":2,"d":29},{"y":2035,"m":3,"d":30},{"y":2035,"m":4,"d":29},{"y":2035,"m":5,"d":29},{"y":2035,"m":6,"d":30},{"y":2035,"m":7,"d":29},{"y":2035,"m":8,"d":29},{"y":2035,"m":9,"d":30},{"y":2035,"m":10,"d":30},{"y":2035,"m":11,"d":29}]}
	,2036:{"yearStart":{"y":2035,"m":12,"d":4},"yearEnd":{"y":2036,"m":11,"d":14},"monthEndDays":[{"y":2035,"m":12,"d":30},{"y":2036,"m":1,"d":30},{"y":2036,"m":2,"d":30},{"y":2036,"m":3,"d":29},{"y":2036,"m":4,"d":30},{"y":2036,"m":5,"d":29},{"y":2036,"m":6,"d":29},{"y":2036,"m":6,"d":30,"isLeap":true},{"y":2036,"m":7,"d":29},{"y":2036,"m":8,"d":29},{"y":2036,"m":9,"d":30},{"y":2036,"m":10,"d":30}]}
	,2037:{"yearStart":{"y":2036,"m":11,"d":15},"yearEnd":{"y":2037,"m":11,"d":25},"monthEndDays":[{"y":2036,"m":11,"d":29},{"y":2036,"m":12,"d":30},{"y":2037,"m":1,"d":30},{"y":2037,"m":2,"d":30},{"y":2037,"m":3,"d":29},{"y":2037,"m":4,"d":30},{"y":2037,"m":5,"d":29},{"y":2037,"m":6,"d":29},{"y":2037,"m":7,"d":30},{"y":2037,"m":8,"d":29},{"y":2037,"m":9,"d":29},{"y":2037,"m":10,"d":30}]}
	,2038:{"yearStart":{"y":2037,"m":11,"d":26},"yearEnd":{"y":2038,"m":12,"d":6},"monthEndDays":[{"y":2037,"m":11,"d":29},{"y":2037,"m":12,"d":30},{"y":2038,"m":1,"d":30},{"y":2038,"m":2,"d":30},{"y":2038,"m":3,"d":29},{"y":2038,"m":4,"d":30},{"y":2038,"m":5,"d":29},{"y":2038,"m":6,"d":30},{"y":2038,"m":7,"d":29},{"y":2038,"m":8,"d":30},{"y":2038,"m":9,"d":29},{"y":2038,"m":10,"d":29},{"y":2038,"m":11,"d":30}]}
	,2039:{"yearStart":{"y":2038,"m":12,"d":7},"yearEnd":{"y":2039,"m":11,"d":16},"monthEndDays":[{"y":2038,"m":12,"d":29},{"y":2039,"m":1,"d":30},{"y":2039,"m":2,"d":30},{"y":2039,"m":3,"d":29},{"y":2039,"m":4,"d":30},{"y":2039,"m":5,"d":30},{"y":2039,"m":5,"d":29,"isLeap":true},{"y":2039,"m":6,"d":30},{"y":2039,"m":7,"d":29},{"y":2039,"m":8,"d":30},{"y":2039,"m":9,"d":29},{"y":2039,"m":10,"d":30}]}
	,2040:{"yearStart":{"y":2039,"m":11,"d":17},"yearEnd":{"y":2040,"m":11,"d":28},"monthEndDays":[{"y":2039,"m":11,"d":29},{"y":2039,"m":12,"d":29},{"y":2040,"m":1,"d":30},{"y":2040,"m":2,"d":29},{"y":2040,"m":3,"d":30},{"y":2040,"m":4,"d":30},{"y":2040,"m":5,"d":29},{"y":2040,"m":6,"d":30},{"y":2040,"m":7,"d":30},{"y":2040,"m":8,"d":29},{"y":2040,"m":9,"d":30},{"y":2040,"m":10,"d":29}]}
	,2041:{"yearStart":{"y":2040,"m":11,"d":29},"yearEnd":{"y":2041,"m":12,"d":9},"monthEndDays":[{"y":2040,"m":11,"d":30},{"y":2040,"m":12,"d":29},{"y":2041,"m":1,"d":30},{"y":2041,"m":2,"d":29},{"y":2041,"m":3,"d":29},{"y":2041,"m":4,"d":30},{"y":2041,"m":5,"d":29},{"y":2041,"m":6,"d":30},{"y":2041,"m":7,"d":30},{"y":2041,"m":8,"d":29},{"y":2041,"m":9,"d":30},{"y":2041,"m":10,"d":30},{"y":2041,"m":11,"d":29}]}
	,2042:{"yearStart":{"y":2041,"m":12,"d":10},"yearEnd":{"y":2042,"m":11,"d":20},"monthEndDays":[{"y":2041,"m":12,"d":30},{"y":2042,"m":1,"d":29},{"y":2042,"m":2,"d":30},{"y":2042,"m":2,"d":29,"isLeap":true},{"y":2042,"m":3,"d":29},{"y":2042,"m":4,"d":30},{"y":2042,"m":5,"d":29},{"y":2042,"m":6,"d":30},{"y":2042,"m":7,"d":29},{"y":2042,"m":8,"d":30},{"y":2042,"m":9,"d":30},{"y":2042,"m":10,"d":29}]}
	,2043:{"yearStart":{"y":2042,"m":11,"d":21},"yearEnd":{"y":2043,"m":12,"d":1},"monthEndDays":[{"y":2042,"m":11,"d":30},{"y":2042,"m":12,"d":30},{"y":2043,"m":1,"d":29},{"y":2043,"m":2,"d":30},{"y":2043,"m":3,"d":29},{"y":2043,"m":4,"d":29},{"y":2043,"m":5,"d":30},{"y":2043,"m":6,"d":29},{"y":2043,"m":7,"d":29},{"y":2043,"m":8,"d":30},{"y":2043,"m":9,"d":30},{"y":2043,"m":10,"d":29},{"y":2043,"m":11,"d":30}]}
	,2044:{"yearStart":{"y":2043,"m":12,"d":2},"yearEnd":{"y":2044,"m":11,"d":13},"monthEndDays":[{"y":2043,"m":12,"d":30},{"y":2044,"m":1,"d":30},{"y":2044,"m":2,"d":29},{"y":2044,"m":3,"d":30},{"y":2044,"m":4,"d":29},{"y":2044,"m":5,"d":29},{"y":2044,"m":6,"d":30},{"y":2044,"m":7,"d":29},{"y":2044,"m":7,"d":29,"isLeap":true},{"y":2044,"m":8,"d":30},{"y":2044,"m":9,"d":29},{"y":2044,"m":10,"d":30}]}
	,2045:{"yearStart":{"y":2044,"m":11,"d":14},"yearEnd":{"y":2045,"m":11,"d":24},"monthEndDays":[{"y":2044,"m":11,"d":30},{"y":2044,"m":12,"d":30},{"y":2045,"m":1,"d":30},{"y":2045,"m":2,"d":29},{"y":2045,"m":3,"d":30},{"y":2045,"m":4,"d":29},{"y":2045,"m":5,"d":29},{"y":2045,"m":6,"d":30},{"y":2045,"m":7,"d":29},{"y":2045,"m":8,"d":29},{"y":2045,"m":9,"d":30},{"y":2045,"m":10,"d":29}]}
	,2046:{"yearStart":{"y":2045,"m":11,"d":25},"yearEnd":{"y":2046,"m":12,"d":5},"monthEndDays":[{"y":2045,"m":11,"d":30},{"y":2045,"m":12,"d":30},{"y":2046,"m":1,"d":30},{"y":2046,"m":2,"d":29},{"y":2046,"m":3,"d":30},{"y":2046,"m":4,"d":30},{"y":2046,"m":5,"d":29},{"y":2046,"m":6,"d":29},{"y":2046,"m":7,"d":30},{"y":2046,"m":8,"d":29},{"y":2046,"m":9,"d":29},{"y":2046,"m":10,"d":30},{"y":2046,"m":11,"d":29}]}
	,2047:{"yearStart":{"y":2046,"m":12,"d":6},"yearEnd":{"y":2047,"m":11,"d":15},"monthEndDays":[{"y":2046,"m":12,"d":30},{"y":2047,"m":1,"d":30},{"y":2047,"m":2,"d":29},{"y":2047,"m":3,"d":30},{"y":2047,"m":4,"d":30},{"y":2047,"m":5,"d":29},{"y":2047,"m":5,"d":30,"isLeap":true},{"y":2047,"m":6,"d":29},{"y":2047,"m":7,"d":30},{"y":2047,"m":8,"d":29},{"y":2047,"m":9,"d":29},{"y":2047,"m":10,"d":30}]}
	,2048:{"yearStart":{"y":2047,"m":11,"d":16},"yearEnd":{"y":2048,"m":11,"d":26},"monthEndDays":[{"y":2047,"m":11,"d":29},{"y":2047,"m":12,"d":30},{"y":2048,"m":1,"d":29},{"y":2048,"m":2,"d":30},{"y":2048,"m":3,"d":30},{"y":2048,"m":4,"d":29},{"y":2048,"m":5,"d":30},{"y":2048,"m":6,"d":30},{"y":2048,"m":7,"d":29},{"y":2048,"m":8,"d":30},{"y":2048,"m":9,"d":29},{"y":2048,"m":10,"d":30}]}
	,2049:{"yearStart":{"y":2048,"m":11,"d":27},"yearEnd":{"y":2049,"m":12,"d":7},"monthEndDays":[{"y":2048,"m":11,"d":29},{"y":2048,"m":12,"d":29},{"y":2049,"m":1,"d":30},{"y":2049,"m":2,"d":29},{"y":2049,"m":3,"d":30},{"y":2049,"m":4,"d":29},{"y":2049,"m":5,"d":30},{"y":2049,"m":6,"d":30},{"y":2049,"m":7,"d":29},{"y":2049,"m":8,"d":30},{"y":2049,"m":9,"d":30},{"y":2049,"m":10,"d":29},{"y":2049,"m":11,"d":30}]}
	,2050:{"yearStart":{"y":2049,"m":12,"d":8},"yearEnd":{"y":2050,"m":11,"d":18},"monthEndDays":[{"y":2049,"m":12,"d":29},{"y":2050,"m":1,"d":30},{"y":2050,"m":2,"d":29},{"y":2050,"m":3,"d":29},{"y":2050,"m":3,"d":30,"isLeap":true},{"y":2050,"m":4,"d":29},{"y":2050,"m":5,"d":30},{"y":2050,"m":6,"d":29},{"y":2050,"m":7,"d":30},{"y":2050,"m":8,"d":30},{"y":2050,"m":9,"d":29},{"y":2050,"m":10,"d":30}]}
}

}());
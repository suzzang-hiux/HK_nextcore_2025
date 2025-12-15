(function($) {
    var boardTree ={
        $tree : false
        ,currNodeInfo : {}
        ,selectNode : ''
        ,saveMode : ''
		,title:''
		,rootDiv : ''
		,rootDivNm : ''
		,_boardInfo : {}
		,currMemo : ''
		,currNodeId : ''
        ,init :function (bmkDiv, boardInfo, initTreeFlag){
            var _this = this;
			_this._boardInfo = boardInfo || {};
			_this.rootDiv = bmkDiv;
			_this.rootDivNm = bmkDiv == 'F' ? '즐겨찾기' : '스크랩';
			// 트리 생성
			_this.createJstree('home', bmkDiv, initTreeFlag);
        }
        , initEvt :function (){
            var _this =this;
        }
        ,createJstree : function(selNode, bmkDiv,initTreeFlag){
			var _this = this;
            
			PubEP.req.ajax({
				url : PENCAKE_OBJ.getUrl('/board/searchBookmark'),
				cache : false,
				type:"post",
                data:{bmkDiv : bmkDiv},
				dataType: "json",
				success: function(resData) {
					var bkList = resData.list;
					_this.jstreeNode = [];
					
					var allItems = {"rootNode" :{
						id :'rootNode'
						,text:'rootNode'
						,children :[{
							id :'home'
							,pid : '#'
							,text:_this.rootDivNm
							,children :[]
							,state	:{
								opened :true
							}
						}]
						,state	:{
							opened :true
						}
					}};
					allItems[allItems.rootNode.children[0].id] = allItems.rootNode.children[0];
					
					var favoriteShowFlag = false;
					var myBookmarkFlag = false;
					$.each(bkList, function(i, item){
						var treeItem = {};
						var treeId = item.BMK_ID; 
						var treePid = (item.BMK_PID || 'home');

						item.BMK_TYPE = treeId.startsWith('F') ? 'F' :'C';

						treeItem.id = treeId;
						treeItem.pid = treePid;
						treeItem.parent = treePid;
						treeItem.text = item.BMK_NM;
						treeItem.sort_order = item.SORT_ORDER;
						treeItem.memo = item.MEMO;
						treeItem.path_nm = item.PATH_NM;
						treeItem.bmkDiv = item.BMK_DIV;
						treeItem.bmkType = item.BMK_TYPE;
						treeItem.brdCd = item.BRD_CD;
						treeItem.docNum = item.DOCNUM;
						treeItem.children = [];

						allItems[treeId] = treeItem; 

						//아이콘 설정
						if(item.BMK_TYPE == 'C'){
							treeItem.icon = 'jstree-file';
						}else{
							treeItem.icon = 'jstree-folder';
						}

						if(treePid =='home'){
							allItems['home'].children.push(treeItem);
						}else{
							var pItem =allItems[treePid]; 
							if(!PENCAKE_OBJ.isUndefined(pItem)){
								pItem.children.push(treeItem);
							}
						}

						//내가 등록한 스크랩, 즐겨찾기
                        if((item.BMK_DIV == 'S' && item.BMK_TYPE == 'C' && _this._boardInfo.brdCode == item.BRD_CD && _this._boardInfo.docNum == item.DOCNUM)
						    || (item.BMK_DIV == 'F' && item.BMK_TYPE == 'C' && _this._boardInfo.brdCode == item.BRD_CD)){
							var vBmkPid = item.BMK_PID; //부모노드
							//카테고리 조회시 카테고리 명을 빼기 위해 부모 코드 카테고리만 조회
							var vCategory = '';
							for (var key in bkList) {
								var bkItem = bkList[key];
								if(bkItem.BMK_ID == vBmkPid){
									vCategory = bkItem.PATH_NM;
								}
							}
							selNode = allItems[treePid];
							
                            //저장된 북마크 조회
                            $("#categoryPath").text(selNode.path_nm); //등록된 카테고리 조회
							$("#bmkMemo").text(item.MEMO); //등록된 메모 조회
							_this.currMemo = item.MEMO;
							myBookmarkFlag = true;
                        }
						
						if(item.BMK_DIV == 'F' && item.BMK_TYPE == 'C' && _this._boardInfo.brdCode == item.BRD_CD){
							//즐겨찾기가 저장되있을경우 북마크 이미지 변경
							$(".favorite").addClass("show");
							favoriteShowFlag = true;
						}
					})
					
					if(!favoriteShowFlag){
						$(".favorite").removeClass("show");
					}

					if(!myBookmarkFlag){
						$("#categoryPath").text(_this.rootDivNm); //등록된 카테고리 조회
						$("#bmkMemo").text(''); //등록된 메모 조회
					}

                    //저장된 북마크 조회 일경우는 tree 만들지 않음
                    if(initTreeFlag !== false){
						_this.initJstree(allItems.rootNode.children, selNode);
                    }
				},
				error: function(xhr, status, e) {
					PubEP.log(status + " : " + e + xhr.responseText);
				}
			});
		}
        ,initJstree : function(data, selNode) {
			var _this = this;
			_this.$tree = $('#jstree');
            _this.$tree.jstree("destroy");
			_this.$tree.jstree({
				"json_data" : { },
				"plugins" : ["json_data", "dnd", "contextmenu"],
				"core" : {
					"themes" : {
						"icons" : true,
						"dots" : true
					}
					,"check_callback" : true
					,"multiple" : false
					,"data" : data
					,"strings" : {
						"Loading ..." : " ",
						"New node" : "새폴더"
					}
				},
				"dnd" : {
			},
			"types" : {
			},
			"contextmenu" : {
				"items" : function(node){
					// if(node.id == 'home') return {};
					var sel = [node.id];
					var bmkType = node.original.bmkType;
					
					if(node.gridContextMenu){
						sel = _this.getSelection();
					}
					
					var disablFlag = false;
					//home 또는 폴더일 경우 추가 버튼 활성화
					if((bmkType == 'F') || (sel[0] == "home")){
						disablFlag = false;
					}else{
						disablFlag = true;
					}
					
					var template = 
					{
						"add" : {
							"_disabled" : disablFlag,
							"separator_before" : false,
							"separator_after"  : true,
							"icon" : 'fa fa-plus',
							"label"            : '추가',
							"action"           : function (obj) {
								var inst = $.jstree.reference(obj.reference),
								node = inst.get_node(obj.reference);
								
								_this.addBrd();
							}
						},
						"edit" : {
							"_disabled" : (sel.length > 1 ? true : false),
							"separator_before" : false,
							"separator_after"  : true,
							"icon" : 'fa fa-edit',
							"label"            : '편집',
							"action"           : function (obj) {
								var inst = $.jstree.reference(obj.reference),
								node = inst.get_node(obj.reference);
								$('#jstree').jstree("edit", node);//수정 모드 (input 작성가능하게)
							}
						},
						"delete" : {
							"separator_before" : false,
							"separator_after"  : true,
							"icon" : 'fa fa-remove',
							"label"            : "삭제",
							"action"           : function (obj) {
								var inst = $.jstree.reference(obj.reference);
								var selectNode = inst.get_node(obj.reference);
								_this.deleteBrd(selectNode.original);
							}
						}
					};

					return template;
				}
			}
		}).bind('select_node.jstree', function(evt, data) {
			_this.currNodeInfo = _this.getCurrNodeInfo(data.node.original);

			//북마크가 폴더일 경우 categoryPath 변경
			if(typeof _this.currNodeInfo.bmkType == 'undefined' || _this.currNodeInfo.bmkType == 'F'){
				$('#currCatagoryPath').val(_this.currNodeInfo.pathNm || _this.rootDivNm);
				$("#bmkMemo").val(''); //등록된 메모 조회(폴더)
				$("#btnSaveBookmark").text(_this.rootDivNm + '저장');
			}else if(_this.currNodeInfo.bmkType == 'C'){
				$("#bmkMemo").val(_this.currNodeInfo.memo == 'null' ? '' : _this.currNodeInfo.memo); //등록된 메모 조회
				$("#btnSaveBookmark").text('메모저장');
			}
			
		}).bind('loaded.jstree', function(evt, data) {
			_this.$tree.jstree("open_all");
			
			var selectNodeId = selNode =='home' ? 'home' :selNode.id;
			// 첫번째 아이템 선택
			$("#jstree").jstree().select_node($("#jstree").jstree().get_node(selectNodeId));
			
		}).bind('copy_node.jstree', function(evt, data) {
		}).bind('create_node.jstree', function(evt, data) {
		}).bind('delete_node.jstree', function(evt, data) {
		}).bind('rename_node.jstree', function(evt, data) {
			_this.brdRename(evt, data);
		}).bind('edit_node.jstree', function(evt, data) {
			_this.$tree.jstree(true).edit(id);
		}).bind('move_node.jstree', function(evt, data) {
			if(data.parent == 'home'){
				_this.selectNode = '';	
			}else{
				_this.selectNode = data.parent;
			}

			_this.moveBrd(data.node.original);
		}).bind('hover_node.jstree', function(evt, data) {
			var nodeId = data.node.id;
			var $node = $("#" + nodeId);
			var bmkType = data.node.original.bmkType;

			if(nodeId == 'home')return;

			$node.find('div').remove();

			if(bmkType == 'F'){
				//폴더일 경우 삭제 버튼
				$node.find("> a").append(_this.buttonDelete());
				$node.find("> a .xbutton").show();
			}else{
				//컨텐츠일 경우 경우 메모수정, 삭제 버튼
				$node.find("> a").append(_this.buttonEdit() + _this.buttonDelete());
				$node.find("> a .ebutton").show();
				$node.find("> a .xbutton").show();
			}

			$node.find("> a .xbutton").off('click').on('click', function(e) {
				e.stopImmediatePropagation();
				e.preventDefault();
				_this.deleteBrd(data.node.original);
			});

			$node.find("> a .ebutton").off('click').on('click', function(e) {
				e.stopImmediatePropagation();
				e.preventDefault();
				_this.brdEditMemo(data.node);
			});

		}).bind('dehover_node.jstree', function(evt, data) {
			var $node = $("#" + data.node.id);
			$node.find("> a .xbutton").hide();
			$node.find("> a .ebutton").hide();
		}).bind('open_node.jstree', function(evt, data) {
		})



		$(document).bind('dnd_stop.vakata', function(evt, data) {
		}).bind('dnd_start.vakata', function(evt, data) {
		})
	}
	,getCurrNodeInfo :function (nodeInfo){
		return {
			nodeId : nodeInfo.id
			,parent : nodeInfo.parent
			,bmkNm : nodeInfo.text
			,memo : nodeInfo.memo
			,ordNo : nodeInfo.sort_order
			,pathNm : nodeInfo.path_nm
			,bmkDiv : nodeInfo.bmkDiv
			,bmkType : nodeInfo.bmkType
		}
	}
	,openAll : function(){
		_this.$tree.jstree("open_all");
	}
	,closeAll : function(){
		_this.$tree.jstree("close_all");
	}
	// 즐겨찾기 폴더 추가
	,addBrd : function(nodeId, node){
		var _this = this;
		var ref = $('#jstree').jstree(true),
		sel = ref.get_selected();
		if (!sel.length) {return false;}
				
		sel = sel[0];
		sel = ref.create_node(sel, {
			"type": "file"
		});
		ref.edit(sel);

		_this.saveMode = 'I';
		var newNode = $('#jstree').jstree(true).get_node(sel);
		
		var param = {};
		param.nodeId = newNode.id;
		param.id = newNode.id;
		param.parent = newNode.parent == 'home' ? '' : newNode.parent;
		param.ordNo = _this.$tree.jstree().get_node((newNode.parent||'home')).children.length;
		param.bmkNm = newNode.text;
		param.bmkDiv = _this.rootDiv;
		param.bmkType = 'F';
		
		_this.saveData(param,'add');
	}
	,brdRename : function(evt, data){
		var _this = this;

		if(_this.saveMode == 'I'){return;}

		_this.saveMode = 'U';

		var param = {};
		param.nodeId = data.node.id;
		param.parent = '';
		param.bmkNm = data.text;
		param.bmkType = data.node.original.bmkType;
		
		_this.saveData(param,'rename');
	}
	
	// 지식 공유함 삭제
	,deleteBrd : function(data){
		var _this = this;
		if(!confirm('삭제 하시겠습니까?')) return;
		
		//삭제시 북마크 창 닫기
		$('#modal-id-favorite').removeClass('show').addClass('hide');
		$('#modal-id-storage').removeClass('show').addClass('hide');

		_this.saveMode = 'D';
		var param = {};
		param.nodeId = data.id;
		param.brdCode = data.brdCd;
		param.docNum = data.docNum;

		_this.saveData(param,'delete');
	}
	,moveBrd : function (data){
		var _this = this;
		var code = data.id;
		var bmkType = data.bmkType;

		var dataList = [];
		var parentNode = _this.selectNode;
		if(parentNode == '') parentNode = 'home';
		
		$.each(_this.$tree.jstree().get_node(parentNode).children, function(i, item){
			var data = {};
			
			if(item == code){
				_this.saveMode = 'M';
				data.code = code;
			}else{
				_this.saveMode = 'M';
				data.code = item;
			}
			data.parent_code = _this.selectNode;
			data.sort_order = (i+1);
			dataList.push(data);
		})
		
		var param = {dataList : JSON.stringify(dataList)};
		param.bmkType = bmkType;
		
		_this.saveData(param,'move');
	}
	//마이보드에서 메모 수정
	,saveMemo : function(){
		var _this = this;

		var node = _this.tempVal;
		_this.saveMode = 'U';

		var param = _this.currNodeInfo;
		// param.nodeId = node.id;
		param.parent = '';
		param.bmkMemo = $("#bmkMemo").val();
		param.bmkType = 'C';
		_this.saveData(param, 'memo');
	}
	,brdEditMemo : function(node){
		var _this = this;
		// _this.tempVal = node;
		$('#bmkMemo').val(node.original.memo);

		_this.currNodeInfo = _this.getCurrNodeInfo(node.original);
		var mdzIndex = 90;
		$('#modal-id-favorite').removeClass('hide').addClass('show').css({ 'z-index': mdzIndex });
	}
	,buttonDelete : function(){
		var xbutton = '<div class="xbutton" xid="" style="display:none;margin:-2px 0px 0px 5px;float:right;cursor:pointer;">'
					+ '    <svg viewBox="0 0 14 14" class="svgSize-xs main-color">'
					+ '        <path d="M1.8,13.76s-.91,.56-1.5-.02c-.68-.68,0-1.49,0-1.49L5.56,6.96,.3,1.67S-.2,1.01,.49,.31C1.09-.29,1.8,.16,1.8,.16L7.06,5.45,12.32,.16s.67-.44,1.34,.23,.17,1.28,.17,1.28l-5.26,5.29,5.26,5.29s.45,.82-.08,1.35c-.65,.66-1.42,.16-1.42,.16l-5.26-5.29L1.8,13.76Z"/>';
					+ '    </svg>'
					+ '</div>';
		return xbutton;
	}

	,buttonEdit : function(){
		var ebutton = '<div class="ebutton" xid="" style="display:none;margin:2px 5px 0px 10px;float:right;cursor:pointer;">'
					+ '    <svg viewBox="0 0 20 24" class="svgSize-s main-color">'
					+ '        <path d="M13.44,12.06l-2.39-2.58-6.36,6.87c-.09,.1-.16,.2-.19,.3-.04,.1-.06,.21-.06,.33v1.62c0,.16,.06,.3,.17,.42,.11,.12,.24,.18,.39,.18h1.44c.11,0,.22-.02,.32-.06,.1-.04,.19-.11,.26-.21l6.42-6.87Zm.78-.84l1.17-1.32c.11-.12,.17-.26,.17-.42s-.06-.3-.17-.42l-1.56-1.68c-.11-.12-.24-.18-.39-.18s-.28,.06-.39,.18l-1.22,1.26,2.39,2.58ZM2.22,21.6h15.56V4.8H2.22V21.6ZM2.22,4.8v0Zm0,19.2c-.61,0-1.13-.23-1.57-.7-.43-.47-.65-1.04-.65-1.7V4.8c0-.66,.22-1.23,.65-1.7,.44-.47,.96-.7,1.57-.7H6.89c.24-.72,.64-1.3,1.21-1.74,.56-.44,1.2-.66,1.9-.66s1.34,.22,1.9,.66c.56,.44,.97,1.02,1.21,1.74h4.67c.61,0,1.13,.23,1.57,.7,.43,.47,.65,1.04,.65,1.7V21.6c0,.66-.22,1.23-.65,1.7-.44,.47-.96,.7-1.57,.7H2.22ZM10,3.9c.24,0,.44-.09,.6-.26,.16-.17,.24-.38,.24-.64s-.08-.48-.24-.65c-.16-.17-.36-.25-.6-.25-.24,0-.44,.08-.6,.25-.16,.17-.24,.39-.24,.65s.08,.47,.24,.64c.16,.17,.36,.26,.6,.26Z"></path>';
					+ '    </svg>'
					+ '</div>';
		return ebutton;
	}
	,saveBookmark : function(bmkDiv, boardParam){
		var _this = this;
		
		var msg = _this.currNodeInfo.bmkDiv == 'F' ? '즐겨찾기' : '스크랩';
		var bmkType = _this.currNodeInfo.bmkType || 'F';
		if(bmkType == 'C'){
			// PubEPUI.toast.view({text:'폴더에만 ' + msg + ' 할 수 있습니다.'});
			// return;
			_this.modifyMemo(bmkDiv, boardParam);
			return;
		}

		var param = _this.currNodeInfo;
		param.parent = '';
		param.bmkMemo = $("#bmkMemo").val() == '' ? _this.currMemo : $("#bmkMemo").val();
		_this.rootDiv = bmkDiv;
		param.brdCode = boardParam.brdCode;
		param.docNum = boardParam.docNum;
		param.bmkNm = _this._boardInfo.title;
		_this.saveMode = 'bmk';

		//루트에 북마크 저장시 부모노드가 home로 들어가는걸 방지하기 위해(home로 들어가면 sql에서 데이터 조회가 안됨)
		_this.currNodeInfo.nodeId = _this.currNodeInfo.nodeId == 'home' ? '' : _this.currNodeInfo.nodeId;

		_this.saveData(param,'bookmark');
	}
	,modifyMemo : function(bmkDiv, boardParam){
		var _this = this;

		var param = _this.currNodeInfo;
		param.bmkMemo = $("#bmkMemo").val();
		_this.rootDiv = bmkDiv;
		_this.saveMode = 'U';

		//루트에 북마크 저장시 부모노드가 home로 들어가는걸 방지하기 위해(home로 들어가면 sql에서 데이터 조회가 안됨)
		_this.currNodeInfo.nodeId = _this.currNodeInfo.nodeId == 'home' ? '' : _this.currNodeInfo.nodeId;
		_this.currNodeInfo.parent = _this.currNodeInfo.parent == 'home' ? '' : _this.currNodeInfo.parent;
		
		_this.saveData(param,'memo');
	}
	,saveData : function(nodeInfo , mode){
		var _this = this;
		var param = nodeInfo || {};
		param.saveMode = _this.saveMode;
		
		param.bmkDiv = _this.rootDiv || 'F';
		
		if(_this.saveMode == 'bmk'){
		 	param.bmkType = 'C';
		}else{
			if(mode !== 'move'){
				param.bmkType = mode == 'add' ? 'F' : param.nodeId.startsWith('F')?'F':'C';
			}
		}

		param.brdCode = nodeInfo.brdCode || _this.brdCode;
		param.docNum = nodeInfo.docNum;
		
		PubEP.req.ajax({
			url : PENCAKE_OBJ.getUrl('/board/saveBookmark')
			,data : param
			,dataType: "json"
			,loadSelector : 'body'
			,async : false
			,success: function(resData) {
				if(resData.status != 200){
					alert(resData.message);
					return;
				}
				
				if(_this.saveMode == 'I'){
					_this.init(_this.rootDiv, _this._boardInfo); //폴더 추가 후 트리 초기화
				}else if(_this.saveMode == 'U' || nodeInfo.bmkMemo || _this.saveMode == 'bmk'){
					
					if(_this.saveMode == 'bmk' && _this.currNodeInfo.bmkDiv == 'F'){
						PubEPUI.toast.view({text:'저장되었습니다.'});
						
						//즐겨찾기 저장후 즐겨찾기 창 닫기
						$('#modal-id-favorite').removeClass('show').addClass('hide');
						$('#modal-id-storage').removeClass('show').addClass('hide');
					}else if(_this.saveMode == 'bmk' && _this.currNodeInfo.bmkDiv == 'S'){
						PubEPUI.toast.view({text:'저장되었습니다.'});
						
						//스크랩 저장후 스크랩 창 닫기
						$('#modal-id-favorite').removeClass('show').addClass('hide');
						$('#modal-id-storage').removeClass('show').addClass('hide');
					}

					_this.init(_this.rootDiv, _this._boardInfo); //폴더 추가 후 트리 초기화

				}else if(_this.saveMode == 'D'){
					// $('#jstree').jstree("delete_node", nodeInfo.nodeId);
					PubEPUI.toast.view({text:'삭제 되었습니다.'});
					_this.init(_this.rootDiv, _this._boardInfo);
				}
				
				_this.saveMode = '';
			}
		});
	}
}
window.boardTree = boardTree;
}(jQuery));
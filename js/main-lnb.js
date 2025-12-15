/*
 *lnb
 */
$(function () {
	
function getMenuItem(item){
	return {
		MENU_CD : item.pageId
		,UP_MENU_CD : item.parentPageId
		,MENU_DEPTH : item.level- 1
		,MENU_KNM : item.pageName
		,MENU_URL : item.url
		,MENU_TYPE : 'portal'
		,PAGE_UID : item.pageUid
		,PAGE_TYPE : item.pageType
		,isTypePortal : true
	}
}

function addChildNode(menuItems, item, depth) {
    item.url = item.pageType == "1" ? "/portlet/render.pencake?page_id=" + item.pageId : item.url;

    var addItem = getMenuItem(item);
    menuItems.push(addItem);

    var childNode = item.childNode;

    if (childNode.length > 0) {
        depth = 1;
        for (var j = 0; j < childNode.length; j++) {
            var addChildItem = childNode[j];

            if (addItem.PAGE_TYPE != "1" && addItem.PAGE_TYPE != "3" && addItem.PAGE_TYPE != "4") {
                addChildNode(menuItems, addChildItem, depth);
            }
        }
    }
}

var mainMenuArea = $portalApp.vueServiceBean({
    el: "#lnbMenuContainer",
    data: {
        fuse: false,
        favoriteLimit : 20,
        menuHideTimer : -1,
        searchTimer : -1,
        logStatus : ePortalConfig.runtime =='dev' ? false : false,
        menuTreeObj: false,
        menuHideType : 'click', // click, mouseout
        showUserInfo: false,
        searchVal: "",
        searchData: [],
        allMenuItem: {},
        portalMenu: [{"pageId":"0ece38a9e4b64ca2861c1d085293a851","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851","pageUid":"0ece38a9e4b64ca2861c1d085293a851","pageName":"업무매뉴얼","pageI18Name":"업무매뉴얼","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼","url":"","pageType":"2","level":2,"parentPageId":"228dcad052df4e158e65eebe67064716","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"1e13ac1e222641bacba435ae7f8d2999","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;1e13ac1e222641bacba435ae7f8d2999","pageUid":"1e13ac1e222641bacba435ae7f8d2999","pageName":"장기","pageI18Name":"장기","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;장기","url":"","pageType":"2","level":3,"parentPageId":"0ece38a9e4b64ca2861c1d085293a851","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"48082841b27340599a65bb787ac0a800","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;1e13ac1e222641bacba435ae7f8d2999;;48082841b27340599a65bb787ac0a800","pageUid":"48082841b27340599a65bb787ac0a800","pageName":"신규","pageI18Name":"신규","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;장기;;신규","url":"","pageType":"2","level":4,"parentPageId":"1e13ac1e222641bacba435ae7f8d2999","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"4df3bd94ba634786d39bc6c1da92284a","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;1e13ac1e222641bacba435ae7f8d2999;;48082841b27340599a65bb787ac0a800;;4df3bd94ba634786d39bc6c1da92284a","pageUid":"4df3bd94ba634786d39bc6c1da92284a","pageName":"인보험인수지침","pageI18Name":"인보험인수지침","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;장기;;신규;;인보험인수지침","url":"/manual/m311.pdf","pageType":"3","level":5,"parentPageId":"48082841b27340599a65bb787ac0a800","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}},{"pageId":"4b63a95dec5c4488b5096d2197155e74","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;1e13ac1e222641bacba435ae7f8d2999;;48082841b27340599a65bb787ac0a800;;4b63a95dec5c4488b5096d2197155e74","pageUid":"4b63a95dec5c4488b5096d2197155e74","pageName":"재물인수지침","pageI18Name":"재물인수지침","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;장기;;신규;;재물인수지침","url":"http://cloud.heungkukfire.co.kr/client/Filink.jsp?code=IU1QUTE5N01qWTFNVFkwTlRNPQ==","pageType":"3","level":5,"parentPageId":"48082841b27340599a65bb787ac0a800","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}}],"parameter":{}},{"pageId":"b1b3ddc870ef44089e0e255eeec9b789","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;1e13ac1e222641bacba435ae7f8d2999;;b1b3ddc870ef44089e0e255eeec9b789","pageUid":"b1b3ddc870ef44089e0e255eeec9b789","pageName":"유지보전","pageI18Name":"유지보전","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;장기;;유지보전","url":"","pageType":"2","level":4,"parentPageId":"1e13ac1e222641bacba435ae7f8d2999","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"2a3b93899d164b6ec2788330f43ad569","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;1e13ac1e222641bacba435ae7f8d2999;;b1b3ddc870ef44089e0e255eeec9b789;;2a3b93899d164b6ec2788330f43ad569","pageUid":"2a3b93899d164b6ec2788330f43ad569","pageName":"수납","pageI18Name":"수납","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;장기;;유지보전;;수납","url":"http://cloud.heungkukfire.co.kr/client/Filink.jsp?code=IUNTQjgxMU1qWTFNVFV4TnpZPQ==","pageType":"3","level":5,"parentPageId":"b1b3ddc870ef44089e0e255eeec9b789","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}},{"pageId":"a0ff04af228d4535d363d93efe0c380e","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;1e13ac1e222641bacba435ae7f8d2999;;b1b3ddc870ef44089e0e255eeec9b789;;a0ff04af228d4535d363d93efe0c380e","pageUid":"a0ff04af228d4535d363d93efe0c380e","pageName":"환급","pageI18Name":"환급","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;장기;;유지보전;;환급","url":"/manual/m42.pdf","pageType":"3","level":5,"parentPageId":"b1b3ddc870ef44089e0e255eeec9b789","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}}],"parameter":{}},{"pageId":"7ba3c73729224e36fc39264ff44b9d58","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;1e13ac1e222641bacba435ae7f8d2999;;7ba3c73729224e36fc39264ff44b9d58","pageUid":"7ba3c73729224e36fc39264ff44b9d58","pageName":"구비서류","pageI18Name":"구비서류","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;장기;;구비서류","url":"","pageType":"2","level":4,"parentPageId":"1e13ac1e222641bacba435ae7f8d2999","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"68e67259bcf94f36c305fde2c6e1c4a1","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;1e13ac1e222641bacba435ae7f8d2999;;7ba3c73729224e36fc39264ff44b9d58;;68e67259bcf94f36c305fde2c6e1c4a1","pageUid":"68e67259bcf94f36c305fde2c6e1c4a1","pageName":"계약변경 구비서류","pageI18Name":"계약변경 구비서류","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;장기;;구비서류;;계약변경 구비서류","url":"/manual/m331.pdf","pageType":"3","level":5,"parentPageId":"7ba3c73729224e36fc39264ff44b9d58","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}},{"pageId":"bf8d841b53cb4bd2f35834ee4786dd8a","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;1e13ac1e222641bacba435ae7f8d2999;;7ba3c73729224e36fc39264ff44b9d58;;bf8d841b53cb4bd2f35834ee4786dd8a","pageUid":"bf8d841b53cb4bd2f35834ee4786dd8a","pageName":"수납 및 환급 구비서류","pageI18Name":"수납 및 환급 구비서류","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;장기;;구비서류;;수납 및 환급 구비서류","url":"/manual/m332.pdf","pageType":"3","level":5,"parentPageId":"7ba3c73729224e36fc39264ff44b9d58","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}}],"parameter":{}}],"parameter":{}},{"pageId":"8986e231d24146f4e2c40a5cc8e67093","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093","pageUid":"8986e231d24146f4e2c40a5cc8e67093","pageName":"재무회계","pageI18Name":"재무회계","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계","url":"","pageType":"2","level":3,"parentPageId":"0ece38a9e4b64ca2861c1d085293a851","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"d006335490234f27eb2cec5cdc8197e2","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093;;d006335490234f27eb2cec5cdc8197e2","pageUid":"d006335490234f27eb2cec5cdc8197e2","pageName":"전표관리","pageI18Name":"전표관리","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계;;전표관리","url":"","pageType":"2","level":4,"parentPageId":"8986e231d24146f4e2c40a5cc8e67093","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"444f622cd201401a845a6513caec6049","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093;;d006335490234f27eb2cec5cdc8197e2;;444f622cd201401a845a6513caec6049","pageUid":"444f622cd201401a845a6513caec6049","pageName":"전표관리","pageI18Name":"전표관리","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계;;전표관리;;전표관리","url":"/manual/m611.pdf","pageType":"3","level":5,"parentPageId":"d006335490234f27eb2cec5cdc8197e2","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}},{"pageId":"4687cb22e9ec4954dcc380088f2f0568","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093;;d006335490234f27eb2cec5cdc8197e2;;4687cb22e9ec4954dcc380088f2f0568","pageUid":"4687cb22e9ec4954dcc380088f2f0568","pageName":"전표관리_무전표","pageI18Name":"전표관리_무전표","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계;;전표관리;;전표관리_무전표","url":"/manual/m612.pdf","pageType":"3","level":5,"parentPageId":"d006335490234f27eb2cec5cdc8197e2","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}},{"pageId":"59dd3efbff684655b223b680adc8172d","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093;;d006335490234f27eb2cec5cdc8197e2;;59dd3efbff684655b223b680adc8172d","pageUid":"59dd3efbff684655b223b680adc8172d","pageName":"전표관리_전결","pageI18Name":"전표관리_전결","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계;;전표관리;;전표관리_전결","url":"/manual/m613.pdf","pageType":"3","level":5,"parentPageId":"d006335490234f27eb2cec5cdc8197e2","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}}],"parameter":{}},{"pageId":"08ca14d3a29e4b2d836e2f63458dfc0c","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093;;08ca14d3a29e4b2d836e2f63458dfc0c","pageUid":"08ca14d3a29e4b2d836e2f63458dfc0c","pageName":"사업비관리","pageI18Name":"사업비관리","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계;;사업비관리","url":"","pageType":"2","level":4,"parentPageId":"8986e231d24146f4e2c40a5cc8e67093","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"bc638c0fbf564901c5a3ed534844c65c","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093;;08ca14d3a29e4b2d836e2f63458dfc0c;;bc638c0fbf564901c5a3ed534844c65c","pageUid":"bc638c0fbf564901c5a3ed534844c65c","pageName":"사업비관리","pageI18Name":"사업비관리","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계;;사업비관리;;사업비관리","url":"/manual/m621.pdf","pageType":"3","level":5,"parentPageId":"08ca14d3a29e4b2d836e2f63458dfc0c","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}},{"pageId":"f193db0829884c68940807587c11e0df","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093;;08ca14d3a29e4b2d836e2f63458dfc0c;;f193db0829884c68940807587c11e0df","pageUid":"f193db0829884c68940807587c11e0df","pageName":"사업비관리_소득귀속","pageI18Name":"사업비관리_소득귀속","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계;;사업비관리;;사업비관리_소득귀속","url":"/manual/m622.pdf","pageType":"3","level":5,"parentPageId":"08ca14d3a29e4b2d836e2f63458dfc0c","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}},{"pageId":"2476ea27c784493bc9e9545e52fdf8eb","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093;;08ca14d3a29e4b2d836e2f63458dfc0c;;2476ea27c784493bc9e9545e52fdf8eb","pageUid":"2476ea27c784493bc9e9545e52fdf8eb","pageName":"법인카드관리","pageI18Name":"법인카드관리","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계;;사업비관리;;법인카드관리","url":"/manual/m623.pdf","pageType":"3","level":5,"parentPageId":"08ca14d3a29e4b2d836e2f63458dfc0c","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}},{"pageId":"db1afa61a2d748feea2fd7e1033d0040","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093;;08ca14d3a29e4b2d836e2f63458dfc0c;;db1afa61a2d748feea2fd7e1033d0040","pageUid":"db1afa61a2d748feea2fd7e1033d0040","pageName":"법인카드관리_비즈플레이","pageI18Name":"법인카드관리_비즈플레이","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계;;사업비관리;;법인카드관리_비즈플레이","url":"/manual/m624.pdf","pageType":"3","level":5,"parentPageId":"08ca14d3a29e4b2d836e2f63458dfc0c","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}}],"parameter":{}},{"pageId":"eeb15ea4d16f4405b68a2926c3401ebe","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093;;eeb15ea4d16f4405b68a2926c3401ebe","pageUid":"eeb15ea4d16f4405b68a2926c3401ebe","pageName":"수납관리","pageI18Name":"수납관리","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계;;수납관리","url":"","pageType":"2","level":4,"parentPageId":"8986e231d24146f4e2c40a5cc8e67093","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"67765a7119794c09eefa4e9f59b76bac","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093;;eeb15ea4d16f4405b68a2926c3401ebe;;67765a7119794c09eefa4e9f59b76bac","pageUid":"67765a7119794c09eefa4e9f59b76bac","pageName":"가상계좌 관리","pageI18Name":"가상계좌 관리","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계;;수납관리;;가상계좌 관리","url":"/manual/m631.pdf","pageType":"3","level":5,"parentPageId":"eeb15ea4d16f4405b68a2926c3401ebe","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}},{"pageId":"ab6769627f6146c29356ffd451abf9c2","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093;;eeb15ea4d16f4405b68a2926c3401ebe;;ab6769627f6146c29356ffd451abf9c2","pageUid":"ab6769627f6146c29356ffd451abf9c2","pageName":"신용카드관리","pageI18Name":"신용카드관리","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계;;수납관리;;신용카드관리","url":"/manual/m632.pdf","pageType":"3","level":5,"parentPageId":"eeb15ea4d16f4405b68a2926c3401ebe","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}}],"parameter":{}},{"pageId":"6e4af14795294ba8f35d7e897703525a","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093;;6e4af14795294ba8f35d7e897703525a","pageUid":"6e4af14795294ba8f35d7e897703525a","pageName":"기타관리","pageI18Name":"기타관리","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계;;기타관리","url":"","pageType":"2","level":4,"parentPageId":"8986e231d24146f4e2c40a5cc8e67093","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"687f348a8ba6405191b6bacd20a46a91","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093;;6e4af14795294ba8f35d7e897703525a;;687f348a8ba6405191b6bacd20a46a91","pageUid":"687f348a8ba6405191b6bacd20a46a91","pageName":"거래처계좌등록","pageI18Name":"거래처계좌등록","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계;;기타관리;;거래처계좌등록","url":"/manual/m641.pdf","pageType":"3","level":5,"parentPageId":"6e4af14795294ba8f35d7e897703525a","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}},{"pageId":"7af316047a714526d5f9bdcce8795a08","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093;;6e4af14795294ba8f35d7e897703525a;;7af316047a714526d5f9bdcce8795a08","pageUid":"7af316047a714526d5f9bdcce8795a08","pageName":"이체계좌변경","pageI18Name":"이체계좌변경","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계;;기타관리;;이체계좌변경","url":"/manual/m642.pdf","pageType":"3","level":5,"parentPageId":"6e4af14795294ba8f35d7e897703525a","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}},{"pageId":"7ea82bc253d649b2a7d6b3c650fae858","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;8986e231d24146f4e2c40a5cc8e67093;;6e4af14795294ba8f35d7e897703525a;;7ea82bc253d649b2a7d6b3c650fae858","pageUid":"7ea82bc253d649b2a7d6b3c650fae858","pageName":"가수환급","pageI18Name":"가수환급","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;재무회계;;기타관리;;가수환급","url":"/manual/m643.pdf","pageType":"3","level":5,"parentPageId":"6e4af14795294ba8f35d7e897703525a","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}}],"parameter":{}}],"parameter":{}},{"pageId":"687317b24f794688adab44565dbe71d2","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;687317b24f794688adab44565dbe71d2","pageUid":"687317b24f794688adab44565dbe71d2","pageName":"콜센터 업무기준","pageI18Name":"콜센터 업무기준","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;콜센터 업무기준","url":"","pageType":"2","level":3,"parentPageId":"0ece38a9e4b64ca2861c1d085293a851","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"dba96dc8fb3e4d86f082da3b30866d1f","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;687317b24f794688adab44565dbe71d2;;dba96dc8fb3e4d86f082da3b30866d1f","pageUid":"dba96dc8fb3e4d86f082da3b30866d1f","pageName":"공통","pageI18Name":"공통","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;콜센터 업무기준;;공통","url":"","pageType":"2","level":4,"parentPageId":"687317b24f794688adab44565dbe71d2","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"a95420a8e3f045cd931b615b2263ca76","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;687317b24f794688adab44565dbe71d2;;dba96dc8fb3e4d86f082da3b30866d1f;;a95420a8e3f045cd931b615b2263ca76","pageUid":"a95420a8e3f045cd931b615b2263ca76","pageName":"본인확인 기준 및 안내가능 범위","pageI18Name":"본인확인 기준 및 안내가능 범위","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;콜센터 업무기준;;공통;;본인확인 기준 및 안내가능 범위","url":"http://webmanual.insurance.co.kr/manual/sso/start.jsp?upride=true&content_id=67287","pageType":"3","level":5,"parentPageId":"dba96dc8fb3e4d86f082da3b30866d1f","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}},{"pageId":"e4458cccab514dd0dcb28eae0c2edcda","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;687317b24f794688adab44565dbe71d2;;dba96dc8fb3e4d86f082da3b30866d1f;;e4458cccab514dd0dcb28eae0c2edcda","pageUid":"e4458cccab514dd0dcb28eae0c2edcda","pageName":"미성년자 계약 안내범위","pageI18Name":"미성년자 계약 안내범위","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;콜센터 업무기준;;공통;;미성년자 계약 안내범위","url":"http://webmanual.insurance.co.kr/manual/sso/start.jsp?upride=true&content_id=88681","pageType":"3","level":5,"parentPageId":"dba96dc8fb3e4d86f082da3b30866d1f","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}}],"parameter":{}},{"pageId":"6eb9541414064e2ccda9517ec7a96641","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;687317b24f794688adab44565dbe71d2;;6eb9541414064e2ccda9517ec7a96641","pageUid":"6eb9541414064e2ccda9517ec7a96641","pageName":"장기보험","pageI18Name":"장기보험","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;콜센터 업무기준;;장기보험","url":"","pageType":"2","level":4,"parentPageId":"687317b24f794688adab44565dbe71d2","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"85d7aba6dfe0479890755c4f148265d2","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;687317b24f794688adab44565dbe71d2;;6eb9541414064e2ccda9517ec7a96641;;85d7aba6dfe0479890755c4f148265d2","pageUid":"85d7aba6dfe0479890755c4f148265d2","pageName":"콜센터 업무처리기준(장기)","pageI18Name":"콜센터 업무처리기준(장기)","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;콜센터 업무기준;;장기보험;;콜센터 업무처리기준(장기)","url":"http://webmanual.insurance.co.kr/manual/sso/start.jsp?upride=true&content_id=67296","pageType":"3","level":5,"parentPageId":"6eb9541414064e2ccda9517ec7a96641","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}},{"pageId":"e7eb8418264046e49961c3db5f0ad7df","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;687317b24f794688adab44565dbe71d2;;6eb9541414064e2ccda9517ec7a96641;;e7eb8418264046e49961c3db5f0ad7df","pageUid":"e7eb8418264046e49961c3db5f0ad7df","pageName":"콜센터 제지급 처리기준","pageI18Name":"콜센터 제지급 처리기준","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;콜센터 업무기준;;장기보험;;콜센터 제지급 처리기준","url":"http://webmanual.insurance.co.kr/manual/sso/start.jsp?upride=true&content_id=109792","pageType":"3","level":5,"parentPageId":"6eb9541414064e2ccda9517ec7a96641","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}}],"parameter":{}},{"pageId":"56caa7dd70c249d6ad60e8b78c3bafaa","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;687317b24f794688adab44565dbe71d2;;56caa7dd70c249d6ad60e8b78c3bafaa","pageUid":"56caa7dd70c249d6ad60e8b78c3bafaa","pageName":"자동차보험","pageI18Name":"자동차보험","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;콜센터 업무기준;;자동차보험","url":"","pageType":"2","level":4,"parentPageId":"687317b24f794688adab44565dbe71d2","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"546cb98bf13944b4c40528f1fbe58ade","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;687317b24f794688adab44565dbe71d2;;56caa7dd70c249d6ad60e8b78c3bafaa;;546cb98bf13944b4c40528f1fbe58ade","pageUid":"546cb98bf13944b4c40528f1fbe58ade","pageName":"콜센터 업무처리기준(자동차)","pageI18Name":"콜센터 업무처리기준(자동차)","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;콜센터 업무기준;;자동차보험;;콜센터 업무처리기준(자동차)","url":"http://webmanual.insurance.co.kr/manual/sso/start.jsp?upride=true&content_id=67333","pageType":"3","level":5,"parentPageId":"56caa7dd70c249d6ad60e8b78c3bafaa","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}}],"parameter":{}},{"pageId":"eb544dd360d849d6f16580e9ea66e7c6","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;687317b24f794688adab44565dbe71d2;;eb544dd360d849d6f16580e9ea66e7c6","pageUid":"eb544dd360d849d6f16580e9ea66e7c6","pageName":"대출","pageI18Name":"대출","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;콜센터 업무기준;;대출","url":"","pageType":"2","level":4,"parentPageId":"687317b24f794688adab44565dbe71d2","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"f819ae77dcf04b0abfb6bc06d637cee0","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;687317b24f794688adab44565dbe71d2;;eb544dd360d849d6f16580e9ea66e7c6;;f819ae77dcf04b0abfb6bc06d637cee0","pageUid":"f819ae77dcf04b0abfb6bc06d637cee0","pageName":"콜센터 업무처리기준(계약대출)","pageI18Name":"콜센터 업무처리기준(계약대출)","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;콜센터 업무기준;;대출;;콜센터 업무처리기준(계약대출)","url":"http://webmanual.insurance.co.kr/manual/sso/start.jsp?upride=true&content_id=28362","pageType":"3","level":5,"parentPageId":"eb544dd360d849d6f16580e9ea66e7c6","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}}],"parameter":{}}],"parameter":{}},{"pageId":"359258e5be5e47969b13acfcfaab9012","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;359258e5be5e47969b13acfcfaab9012","pageUid":"359258e5be5e47969b13acfcfaab9012","pageName":"챗봇,채팅","pageI18Name":"챗봇,채팅","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;챗봇,채팅","url":"","pageType":"2","level":3,"parentPageId":"0ece38a9e4b64ca2861c1d085293a851","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"60d034b14a0c43ebc33e17d5ca5f1213","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;0ece38a9e4b64ca2861c1d085293a851;;359258e5be5e47969b13acfcfaab9012;;60d034b14a0c43ebc33e17d5ca5f1213","pageUid":"60d034b14a0c43ebc33e17d5ca5f1213","pageName":"챗봇,채팅 업무처리","pageI18Name":"챗봇,채팅 업무처리","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;업무매뉴얼;;챗봇,채팅;;챗봇,채팅 업무처리","url":"/manual/m551.pdf","pageType":"3","level":4,"parentPageId":"359258e5be5e47969b13acfcfaab9012","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}}],"parameter":{}}],"parameter":{}},{"pageId":"117adbbfc96043df96c232690536a4c7","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;117adbbfc96043df96c232690536a4c7","pageUid":"117adbbfc96043df96c232690536a4c7","pageName":"다운로드보안센터","pageI18Name":"다운로드보안센터","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;다운로드보안센터","url":"","pageType":"2","level":2,"parentPageId":"228dcad052df4e158e65eebe67064716","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[{"pageId":"d7f795c5b39042b3b8c8e158d8c1ed30","pageIdPath":"root_node;;228dcad052df4e158e65eebe67064716;;117adbbfc96043df96c232690536a4c7;;d7f795c5b39042b3b8c8e158d8c1ed30","pageUid":"d7f795c5b39042b3b8c8e158d8c1ed30","pageName":"다운로드보안센터","pageI18Name":"다운로드보안센터","pageNamePath":"PENCAKE_PAGE_ROOT;;메인 포탈 메뉴;;다운로드보안센터;;다운로드보안센터","url":"http://devupride.heungkukfire.co.kr:8026/DownLoadCenter/index.jsp?crno=#userId#&dept=#orncd#&crnonm=#nmEncode#&deptnm=#ornNmEncode#","pageType":"3","level":3,"parentPageId":"117adbbfc96043df96c232690536a4c7","pageLangKey":"","layoutId":"","layoutPath":"","childNode":[],"parameter":{}}],"parameter":{}}],
        menuViewType: "biz",
        searchView: false,
        allFavoriteInfo: false,
        enableMenu: false,
        favoriteLoadFlag: true,
        viewChannelMode : 'biz',
        currentViewItem : {},
        viewUrl : '',
        bizChannel: [
            { url : "/html/bizMain.html", pageName: "보상", pageI18Name: "보상채널", pageNamePath: "PENCAKE_PAGE_ROOT;;업무채널;;보상채널", pageType: "2", level: 2, parentPageId: "009054777de94a0fa011679362bbc33c", pageLangKey: "", layoutId: "", layoutPath: "", childNode: [], parameter: { style: "blue" } },
        ],
        isManager :  'true',
        userMainMenu: G_EP_MENU,
        showResizeToolTip: false,
    }
    ,watch:{
    	searchView : function (newValue, oldValue){
			this.setMenuFrameMargin();
    	}
    }
    ,created : function (){
    	var screenMenuArr = [];

        var portalMenus = this.portalMenu || [];
        
        var menuItems = [];

        var myPageID = "";
        for (var i = 0; i < portalMenus.length; i++) {
            var item = portalMenus[i];

            addChildNode(menuItems, item, 0);
        }
        
        this.portalMenu = [];
        menuItems = menuItems.concat(this.userMainMenu.allMenu);

        this.allMenuItem = PencakeCustomCTRL.menu.allTreeMenu(
        	menuItems,
            function (item) {
        		let isMenu = false; 
                if (item.isMenu && item.isEmptyParent !== true) {
                	if(item.isTypePortal !== true){  // portal 메뉴는 검색 안되게 처리.
                		isMenu = true; 
                     screenMenuArr.push(item);
                	}
                }
                if(isMenu){
                	item.a_attr = {title: item.text + `[${item.SCREEN_CD}]`};
                }else{
                	item.a_attr = {title: item.text};	
                }
                return item;
            },
            true
        );
        
        this.fuse = new Fuse(screenMenuArr, {
            shouldSort: true,
            threshold: 0.1, // 정확도.
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 2,
            keys: [
                { name: "MENU_KNM", weight: 0.7 },
                { name: "SCREEN_CD", weight: 0.7 },
            ],
        });
        
        screenMenuArr = null;
        menuItems = null;
    }
    ,methods: {
        init: function () {
        	var _this = this; 
        	
        	this.viewChannel('init','');
            this.initEvt();
        },
        initEvt: function () {
            var _this = this;
           
			
            // 즐겨찾기 보기
            $("#favoriteArea").on("click", "[data-favorite-id]", function () {
                var sEle = $(this);

                var favoriteId = sEle.data("favorite-id");
                
                var favoriteItem = _this.allFavoriteInfo[favoriteId];
                
                var viewMenuItem = _this.allMenuItem[favoriteItem.MENU_CD]; 
                
                if(PENCAKE_OBJ.isUndefined(viewMenuItem)){
                	_this.viewMenu({
                    	MENU_KNM : favoriteItem.FAVOR_NM
                    	, MENU_CD : favoriteItem.FAVOR_ID
                    	, MENU_URL:favoriteItem.MENU_URL
                    	, MENU_TYPE : 'LEGACY'
                    	, SCREEN_CD : favoriteItem.SCREEN_CD
                    });
                }else{
                	_this.viewMenu(_this.allMenuItem[favoriteItem.MENU_CD]);
                }
            });
            
            // if(this.menuHideType == 'mouseout'){
	        //     $("#menuContentContainer").on("mouseenter", function () {
	        //     	clearTimeout(_this.menuHideTimer);
	        //     }).on("mouseleave", function () {
	        //     	_this.menuHideTimer = setTimeout(function () {
	        //     		_this._setEnableMenu(false);
			// 		}, 1000);
	        //     })
            // }else{
            // 	$("#menuContentContainer").on("focusout", function (e) {
	        //     	_this.menuFocusOut(e);
	        //     })
            // }
            
            var scrollPosition = {top:0,left:0};
            $("#menuWrapper").mCustomScrollbar({
    			theme:"minimal-dark" //3d-thick ,minimal-dark, rounded
    			,axis :"yx"
    			,autoHideScrollbar :false
    			,callbacks:{
    				onBeforeUpdate: function (){
    					var sEle = $(this);
    					
    					var isVerticalVisible = sEle.find('.mCSB_container').hasClass('mCS_y_hidden');
    					
    					if(isVerticalVisible){
    						sEle.mCustomScrollbar('scrollTo',[scrollPosition.top, scrollPosition.left],{trigger:"internal", dir:'y', timeout:1, scrollInertia : 0, scrollEasing:"linear"});
    					}else{
    						scrollPosition.top = Math.abs(sEle.find('.mCSB_container').css('top').replace(/px/gi,''));;
    						scrollPosition.left = Math.abs(sEle.find('.mCSB_container').css('left').replace(/px/gi,'')); 
    					}	
    				}
    			}
    		});
            
            var bmScrollPosition = {top:0,left:0};
            $("#favMenuWrapper").mCustomScrollbar({
    			theme:"minimal-dark" //3d-thick ,minimal-dark, rounded
    			,axis :"yx"
    			,autoHideScrollbar :false
    			,callbacks:{
    				onBeforeUpdate: function (){
    					var sEle = $(this);
						var isVerticalVisible = sEle.find('.mCSB_container').hasClass('mCS_y_hidden');
    					
    					if(isVerticalVisible){
    						sEle.mCustomScrollbar('scrollTo',[bmScrollPosition.top, bmScrollPosition.left],{trigger:"internal", dir:'y', timeout:1, scrollInertia : 0, scrollEasing:"linear"});
    					}else{
    						bmScrollPosition.top = Math.abs(sEle.find('.mCSB_container').css('top').replace(/px/gi,''));;
    						bmScrollPosition.left = Math.abs(sEle.find('.mCSB_container').css('left').replace(/px/gi,'')); 
    					}
    				}
    			}
    		});
            
            $("#mainMenuSearchResult").mCustomScrollbar({
    			theme:"minimal-dark" //3d-thick ,minimal-dark, rounded
    		});
        }
     	// 접기 펼치기
        ,mainMenuTreeToggle(mode){
        	if(!this.menuTreeObj) return ;
        	
        	if(mode=='open'){
        		this.menuTreeObj.jstree('open_all');
			}else{
				this.menuTreeObj.jstree('close_all');
			}
        }
       
        //채널 화면 보기(업무, 부서)
        ,viewChannel : function (mode, viewItem){
        	if(viewItem==''){
        		if(this.viewChannelMode == mode){
	        		PencakeCustomCTRL.viewMenu.enableFrame('biz');
	        		return ; 
        		}else{
        			viewItem =  this.bizChannel[0];
        		}
        	}
        	
        	var mainViewUrl = '';
        	if(mode == 'init'){
        		mode = 'biz';
        		viewItem = {};
            	if(!PencakeCustomCTRL.isBlank(this.viewUrl)){
            		mainViewUrl = this.viewUrl;
            	}else if(this.bizChannel.length > 0){
            		viewItem = this.bizChannel[0]; 
            		mainViewUrl = PencakeCustomCTRL.viewMenu.PORTAL({MENU_CD:viewItem.pageId, MENU_URL: viewItem.url, PAGE_TYPE : viewItem.pageType},'return');
            	}else{
            		mainViewUrl = PencakeCustomCTRL.viewMenu.PORTAL({MENU_CD:'bizChannelDefault' , PAGE_TYPE : '1'},'return');
            	}
        	}else{
        		mainViewUrl = PencakeCustomCTRL.viewMenu.PORTAL({MENU_CD:viewItem.pageId , PAGE_TYPE : viewItem.pageType},'return');
        	}
        	
        	this._setEnableMenu(false);
        	
        	this.viewChannelMode = mode;
        	this.currentViewItem = viewItem;
        	PencakeCustomCTRL.mainFrameView(mainViewUrl);
        }
        
		// 메뉴 포커스 아웃
        ,menuFocusOut: function (e){
        	//console.log(e.relatedTarget, e)
        	
        	if(e.relatedTarget != null){
        		if (e.which !== 2 &&  $(e.relatedTarget).closest("#menuToggleBtn").length != 1 && $(e.relatedTarget).closest("#menuContentContainer").length < 1) {
        			this._setEnableMenu(false);
    			}
        	}
        }
        // content frame 보기
        ,toggleContentFrame : function (){
        	// 업무 화면은 토글 처리. 기간계 화면과 채널 화면을 토글.
        	
        	const mode  = $('.main-content-wrapper.on').attr('data-cont-type');
        	
        	if(mode == 'main'){
         		PencakeCustomCTRL.viewMenu.enableFrame('legacy');
        	}else{
        		PencakeCustomCTRL.viewMenu.enableFrame('biz');	
        	}
        }
        // 메뉴 tree
        ,menuTree: function () {
            var _this = this;

            if (_this.loading === false) {
                return;
            }
            
            _this.loading = true;

            _this.menuTreeObj = $("#mainMenuTree").jstree({
                plugins: ["types"],
                core: {
                    data: _this.allMenuItem.rootNode.children,
                    themes: { dots: false },
                    multiple: false,
                    animation : -1,
                    dblclick_toggle: false,
                    check_callback: function (op, node, node_parent, pos, more) {},
                },
            })
            .on("select_node.jstree", function (evt, data) {
                var ref = _this.menuTreeObj.jstree(true);
                var sel = ref.get_selected();

                if (sel.length < 1) return false;

                var node = _this.allMenuItem[sel[0]];
                if (node.isMenu) {
                    _this.viewMenu(node);
                } else {
                    // folder click
                    _this.menuTreeObj.jstree("toggle_node", node.MENU_CD);
                }

                return false;
            });

            _this.menuTreeObj.jstree("open_node", "rootNode");

            
        },
        // 즐겨찾기 설정
        favoriteSetting: function () {
            // PubEP.page.view(PENCAKE_OBJ.getUrl("/menu/favorite/favorites.html"), "popup", { gubun: "favorite", gubunkey: "favoriteSetting", name: "favorite_setting", viewOption: "width=950px,height=600px" });
            PencakeCustomCTRL.showModal("/menu/favorite/favorites.html", {
                width: 600,         // 넓이
                height: 600,         // 높이
                showTitle: true,         // 제목 숨김여부
                title: "즐겨찾기 편집",
            });
        },
        //즐겨찾기 등록.
        addFavoriteItem: function (item, evt) {
            this.setFavoriteData(item.MENU_CD, $(evt.srcElement));
        },
        // 즐겨찾기 I,D
        setFavoriteData: function (menuId, sEle) {
            var _this = this;
            var favInfo = _this.allMenuItem[menuId];
            
            var favoriteInfo = {
                menuId: favInfo.MENU_CD,
                mode: !this.existsFavorite(favInfo) ? "I" : "D",
                menuNm: favInfo.MENU_KNM,
                etc1 : favInfo.MENU_URL
            };
            
            if(favoriteInfo.mode=="I" && Object.keys(_this.allFavoriteInfo).length >= this.favoriteLimit){
            	PubEPUI.toast.view({text:`${this.favoriteLimit} 이상 추가 할 수 없습니다.`});
            	return ; 
            }
            
            this.$ajax({
                url: PENCAKE_OBJ.getUrl("/menu/favorite/modify"),
                data: favoriteInfo,
                success: function (resData) {
                	if (resData.status == 200) {
                        var item = resData.item;
                        var favId = item.favId;
                        if (item == "I") {
                            sEle.addClass(PencakeCustomCTRL.favoriteCheckIcon).removeClass(PencakeCustomCTRL.favoriteUnCheckIcon);
                            _this.allFavoriteInfo[favId] = item;
                        } else {
                            sEle.addClass(PencakeCustomCTRL.favoriteUnCheckIcon).removeClass(PencakeCustomCTRL.favoriteCheckIcon);
                            delete _this.allFavoriteInfo[favId];
                        }
                        _this.favorite(true);
                    }else if (resData.status == 509) {
                    	PubEPUI.toast.view({text:`${_this.favoriteLimit} 이상 추가 할 수 없습니다.`});
                    }
                },
                error: function (e){
                	alert('새로고침 후 다시 시도해주세요.');
                	return ;
                }
            });
        },
        // 즐겨찾기
        favorite: function (reloadFlag) {
            var _this = this;
            reloadFlag = reloadFlag || _this.favoriteLoadFlag;

            // 즐겨찾기 가져오기.
            this.getFavoriteData(function(data, reloadFlag) {
                if (reloadFlag === false) return;
				
                var strHtm = [];
                if(data.length > 0){
	                for (var item of data) {
	                	strHtm.push(`<li><a href="javascript:;" data-favorite-id="${item.FAVOR_ID}" title="${item.FAVOR_NM}">${item.FAVOR_NM}</a> </li>`);
	                }
                }else{
                	strHtm.push('<li class="no-data"><span>데이터가 없습니다.</span></li>');
                }

                $("#favoriteArea").html(strHtm.join(""));
                
                strHtm = null;

                _this.favoriteLoadFlag = false;
            }, reloadFlag);
        },
        // 즐겨찾기 가져오기;
        getFavoriteData: function (callbackFn, reloadFlag) {
            var _this = this;

            if (reloadFlag !== true) {
                if (this.allFavoriteInfo !== false && $.isFunction(callbackFn)) {
                    callbackFn(_this.allFavoriteInfo, reloadFlag);
                    return;
                }
            }
			
            this.$ajax({
                url: PENCAKE_OBJ.getUrl("/menu/favorite/favoritesList"),
                method:'get',
                success: function (resData) {
                    _this.allFavoriteInfo = {};
                    var itemList = resData.list;
                    for (var i = 0; i < itemList.length; i++) {
                        var item = itemList[i];
                        _this.allFavoriteInfo[item.FAVOR_ID] = item;
                    }

                    if ($.isFunction(callbackFn)) {
                        callbackFn(itemList, reloadFlag);
                    }
                },
            });
        },
        // 즐겨찾기 아이콘 스타일
        getFavoriteStyle: function (sItem) {
            if (this.existsFavorite(sItem)) {
                return PencakeCustomCTRL.favoriteCheckIcon;
            }
            return PencakeCustomCTRL.favoriteUnCheckIcon;
        },
        // 즐겨찾기 존재 여부.
        existsFavorite: function (sItem) {
            return typeof this.allFavoriteInfo[sItem.MENU_CD] !== "undefined";
        },
        // 메뉴 열기 처리
        openMenu: function () {
            console.log('openMenu called', this.enableMenu);
        	this._setEnableMenu(!this.enableMenu);
        	
            if (this.loading !== true) {
                this.$nextTick(function () {
                    this.favorite();
                });
                this.menuTree();
            }
        },
        // 메뉴 보이기 처리.
        _setEnableMenu: function (flag) {
            this.enableMenu = flag;
            
            if(this.enableMenu){
            	$("#menuContentContainer").addClass('open');
				// this.$nextTick(function () {
				// 	$('#searchVal').focus();
				// });
        	}else{
        		$("#menuContentContainer").removeClass('open');
        	}
            clearTimeout(this.menuHideTimer);
            
            this.setMenuFrameMargin();
            
            if($('.main-content-wrapper.on[data-cont-type="legacy"]').length > 0){
            	this.backgroundOnOff("off");
            	return ;
            }
            
            this.backgroundOnOff(this.enableMenu ? "on" : "off");
        }
        // add menu frame margin 
        ,setMenuFrameMargin: function(){
        	var scrollOnOff = 'on'
        	
       		if(this.enableLegacySlide === false){
               	return ;	
            }
        	
        	var menuFrameElement = $('.main-content-wrapper[data-cont-type="legacy"]>iframe');
        	if(this.enableMenu){
        		if(this.searchView){
        			menuFrameElement.removeClass('slideRight-small').addClass('slideRight-big');
        		}else{
        			menuFrameElement.removeClass('slideRight-big').addClass('slideRight-small');
        		}
        		
        		$('[data-cont-type="legacy"]').addClass('overflow_hidden')
        	}else{
        		menuFrameElement.removeClass('slideRight-big slideRight-small');
        		$('[data-cont-type="legacy"]').removeClass('overflow_hidden')
        	}
        }
        // 업무 메뉴 , 북마트 탭 처리
        ,viewTabMenu: function (mode) {
            this.menuViewType = mode;
        },
        // 메뉴 보기
        viewMenu: function (menuInfo) {
        	this._setEnableMenu(false);
            PencakeCustomCTRL.open(menuInfo);
        },
        // 검색 보기.
        searchMenu: function () {
            var _this = this;
            
            clearTimeout(this.searchTimer);
            
            // 검색 속도를 높이기 위해 최종 검색어만 검색하게 수정. 
            this.searchTimer = setTimeout(function () {
            	var searchVal = document.getElementById("searchVal").value;
                
                if(searchVal.length < 2){
                    _this.searchView = false;
                    _this.searchData = [];
                    return ; 
                }

                if (_this.loading === false) {
                    return;
                }

               	_this.searchView = true;

                const rawList = _this.getMenuSearch(searchVal);
                const reg = new RegExp(`(${searchVal})`, "gi");

                _this.searchData = rawList.map(item => ({
                    ...item,
                    highlightName: item.MENU_KNM.replace(reg, '<span class="highlight">$1</span>')
                }));
			}, 200);
        },
       	// 검색 데이터
        getMenuSearch: function (searchText){
        	const result = this.fuse.search(searchText); 
        	if(PENCAKE_OBJ.isUndefined(Fuse.version)){
        		return result; 
        	}else{
        		return result.map(d=>d.item);
        	}
        },
        // 메뉴 결과 닫기
        closeSearchResult: function () {
            this.searchView = false;
            this.searchData = [];
            this.searchVal = "";
        },
        backgroundOnOff: function (onOff) {
            if (onOff == "on") {
                $(".ep_main_background").addClass("open");
            } else {
                $(".ep_main_background").removeClass("open");
                this.layerHide();
            }
        },
        layerHide: function () {
            $('[data-ep-layout="true"]').removeClass("on");
        }
       
	    // 비밀번호 변경. 
        ,changePassword :function (){
        	// PubEP.page.view(ePortalConfig.context.sso+"/raon/change_pwd.jsp", "popup", { gubun: "rightMenu", gubunkey: 'change_pwd', name:'change_pwd', viewOption: "width=700,height=320,scrollbars=no" });
            PencakeCustomCTRL.showModal("/menu/gnb/changePassword.html", {
                width: 400,         // 넓이
                height: 316,         // 높이
                showTitle: true,         // 제목 숨김여부
                title: "비밀번호 변경",
            });
	    }
	    
	    // IP 변경. 
        ,changeIP :function (){
        	PubEP.page.view(ePortalConfig.context.sso+"/raon/authChk/modifyIP_WACPop.jsp", "popup", { gubun: "rightMenu", gubunkey: 'modifyIP', name:'modifyIP', viewOption: "width=580,height=265,scrollbars=yes"  });
        }
    },
});

const layoutResize = {
	layout: document.querySelector("body"),
	_raf: null,
	defaultWidth: 1280,
	defaultHeight: 720,
	enableAutoResize: false,
	useZoomStyle:false, // zoom style 사용여부
	orginStyleAttr: [
		"transformOrigin",
		"width",
		"height",
		"transform",
		"zoom",
	],
	orginStyle: {},
	init: function () {
		const layoutStyle = this.layout.style;
		let debounceTimer = null;

		this.orginStyleAttr.forEach((attr) => {
			this.orginStyle[attr] = layoutStyle.getPropertyValue(attr);
		});

		if (this.enableAutoResize) {
			layoutStyle.transformOrigin = "0 0";
		}

		// 내부 debounce 함수 정의
		const debounce = (fn, delay = 16) => {
			if (debounceTimer) clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => fn(), delay);
		};

		// ResizeObserver 지원 확인 및 적용
		if (window.ResizeObserver) {
			// ResizeObserver 설정
			this._resizeObserver = new ResizeObserver((entries) => {
				if (this.enableAutoResize) {
					debounce(() => {
						if (this._raf) cancelAnimationFrame(this._raf);
						this._raf = requestAnimationFrame(() => {
							this.resizeLayout();
						});
					});
				}
			});

			// 레이아웃 요소 관찰 시작
			this._resizeObserver.observe(document.documentElement);
		} else {
			// ResizeObserver 미지원 시 기존 resize 이벤트 사용
			window.addEventListener(
				"resize",
				() => {
					if (this.enableAutoResize) {
						debounce(() => {
							if (this._raf) cancelAnimationFrame(this._raf);
							this._raf = requestAnimationFrame(() => {
								this.resizeLayout();
							});
						});
					}
				},
				{ passive: true }
			);
		}

		// autoResize 체크박스 이벤트 리스너 추가
		const autoResizeCheckbox = document.getElementById("lnbAutoResize");
		autoResizeCheckbox.addEventListener("change", (e) => {
			if (e.target.checked) {
				this.enableAutoResize = true;
				layoutStyle.transformOrigin = "0 0";
				this.resizeLayout();
			} else {
				this.enableAutoResize = false;
				// 체크 해제되면 원본 크기로 복원
				if (this._raf) cancelAnimationFrame(this._raf);
				this._raf = requestAnimationFrame(() => {
					this.defaultSize();
				});
			}
		});
	},
	defaultSize: function () {
		const layoutStyle = this.layout.style;

		this.orginStyleAttr.forEach((attr) => {
			if (this.orginStyle[attr]) {
				layoutStyle.setProperty(attr, this.orginStyle[attr]);
			} else {
				layoutStyle.removeProperty(attr);
			}
		});
	},
	applyScale: function (scale) {
		const layoutStyle = this.layout.style;

		// zoom 속성 지원 확인 및 적용
		if (this.useZoomStyle && "zoom" in layout.style) {
			layoutStyle.transform = "none";
			layoutStyle.zoom = scale;
			layoutStyle.width = "100%";
			layoutStyle.height = "100%";
		} else {
			// transform scale이 1보다 작을 때는 width/height를 scale의 역수만큼 키워서
			// 실제 표시되는 크기가 원하는 크기가 되도록 조정
			const adjustedScale = scale < 1 ? (1 / scale) * 100 : 100;
            layoutStyle.width = adjustedScale+'%';
            layoutStyle.height = adjustedScale+'%';
            layoutStyle.zoom = null;
            layoutStyle.transform = 'scale('+scale+')';
		}
	},
	resizeLayout: function () {
		const layout = this.layout;
		const w = window.innerWidth;
		const h = window.innerHeight;

		if (w >= this.defaultWidth) {
			this.defaultSize();
			return;
		}

		const scaleX = w / this.defaultWidth;

		if (this._raf) cancelAnimationFrame(this._raf);
		this._raf = requestAnimationFrame(() => {
			this.applyScale(scaleX);
		});
	},
};
layoutResize.init();

PubEP.util.objectMerge(window.epMainCtrl, {
    reloadFavorite: function () {
        mainMenuArea.favorite(true);
    },
    getCurrentMenu: function () {
        return mainMenuArea.getCurrentMenu();
    },
    menuHide: function () {
        mainMenuArea._setEnableMenu(false);
    },
    bgOnOff: function (mode) {
        mainMenuArea.backgroundOnOff(mode);
    },
    viewMenu: function (menuId) {
        mainMenuArea.viewMenu(mainMenuArea.allMenuItem[menuId]);
    },
    layerHide: function () {
        mainMenuArea.layerHide();
    },
    getMenuInfo: function (menuId) {
        return mainMenuArea.allMenuItem[menuId];
    },
    getMenuSearch: function (searchText) {
        return mainMenuArea.getMenuSearch(searchText);
    },
    getFavoriteStyle: function (item) {
        return mainMenuArea.getFavoriteStyle(item);
    },
    addFavoriteItem: function (item, evt){
        return mainMenuArea.addFavoriteItem(item, evt);
    }
})


$(document).on('click.lnb', function(e) {
    if (!mainMenuArea.enableMenu) return;
    
    const $target = $(e.target);
    const isMenuArea = $target.closest('#menuContentContainer').length > 0;
    const isToggleBtn = $target.closest('#menuToggleBtn').length > 0;

    if (!isMenuArea && !isToggleBtn) {
        mainMenuArea._setEnableMenu(false);
    }
})
});
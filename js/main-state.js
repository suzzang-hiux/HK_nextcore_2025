$(function (){
    // 화면경로
    $portalApp.vueServiceBean({
        el: "#stateBar",
        data: {
            pageLouteShow: false,
        },
        methods: {
            requestSOS: function() {
                PencakeCustomCTRL.showModal("/menu/state/requestSOS.html", {
                    targetId: 'requestSOS',
                    width: 1200,
                    height: 700,
                    showTitle: true,
                    title: "SOS 요청",
                });
            }
        }
    });
})
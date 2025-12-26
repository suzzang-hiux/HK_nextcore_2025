$(function () {
    // 내 정보 조회
    $portalApp.vueServiceBean({
        el: "#myProfileWrap",
        methods: {
            myInfoView: function() {
                PencakeCustomCTRL.showModal("/menu/home/myInfo.html", {
                    targetId: 'myDetailInfo',
                    width: 400,
                    height: 244,
                    showTitle: true,
                    title: "내 정보 조회",
                    dialogClass: 'type-border'
                });
            }
        }
    });

    // 추천상품 - 지점/MY플랜
    $portalApp.vueServiceBean({
        el: "#recommendGoods",
        methods: {
            myPlanView: function() {
                PencakeCustomCTRL.showModal("/menu/home/myPlan.html", {
                    targetId: 'myPlanDetail',
                    width: 1000,
                    height: 607,
                    showTitle: true,
                    title: "지점/MY플랜",
                });
            }
        }
    });

    // 이 달의 실적 탭 - 도넛차트 / hide 연결
    $portalApp.vueServiceBean({
        el: "#monthRecordWrap",
        data: {
            // TAB 인덱스
            activeTab: {
                recordAllTab: 0,
                recordGroupTab: 0,
            },
            // 이 달의 실적 - 전체 실적 테스트 데이터
            recordAllData: [
                { goal: 100000000, result: 90000000, rate: 90.0 },
                { goal: 347910000, result: 225445680, rate: 64.8 },
                { goal: 120000000, result: 90000000, rate: 75.0 },
                { goal: 50000000, result: 30000000, rate: 60.0 }
            ],
            designManagerData: [
                { goal: 100000000, user: 71, rate: 90.0 },
                { goal: 347910000, user: 15, rate: 64.8 },
                { goal: 120000000, user: 30, rate: 75.0 },
                { goal: 50000000, user: 40, rate: 60.0 }
            ],
            // 이 달의 실적 - 조직별 실적조회 테스트 데이터
            recordGroupData: [
                [
                    {
                        name: '개인영업본부',
                        goal: 48650000,
                        result: 36682100,
                        rate: 75.4
                    },
                    {
                        name: 'TM 영업단',
                        goal: 39700000,
                        result: 20564600,
                        rate: 51.8
                    },
                    {
                        name: '전략영업본부',
                        goal: 62480000,
                        result: 35988480,
                        rate: 57.6
                    }
                ],
                [
                    {
                        name: '개인영업본부',
                        goal: 100000000,
                        result: 80000000,
                        rate: 80.0
                    },
                    {
                        name: 'TM 영업단',
                        goal: 100000000,
                        result: 80000000,
                        rate: 80.0
                    },
                    {
                        name: '전략영업본부',
                        goal: 100000000,
                        result: 80000000,
                        rate: 80.0
                    }
                ],
                [
                    {
                        name: '개인영업본부',
                        goal: 120000000,
                        result: 30000000,
                        rate: 60.0
                    },
                    {
                        name: 'TM 영업단',
                        goal: 120000000,
                        result: 30000000,
                        rate: 60.0
                    },
                    {
                        name: '전략영업본부',
                        goal: 120000000,
                        result: 30000000,
                        rate: 60.0
                    }
                ],
            ],
            // 이 달의 실적 값 숨김 체크박스
            isRecordHidden: false,
            // 이 달의 실적 바 차트 애니메이션 준비
            isBarReady: false,
        },
        computed: {
            // 이 달의 실적 - 전체 실적 데이터 변경
            currentRecord() {
                return this.recordAllData[this.activeTab.recordAllTab];
            },
            currentDesignManagerData() {
                return this.designManagerData[this.activeTab.recordAllTab];
            },
            // 이 달의 실적 - 조직별 실적조회 데이터 변경
            currentGroupRecords() {
                return this.recordGroupData[this.activeTab.recordGroupTab] || [];
            }
        },
        mounted() {
            this.$nextTick(() => {
                // 도넛 차트 애니메이션
                if (!this.isRecordHidden) {
                    this.animateDonut(this.currentRecord.rate);
                }
            });

            // 바 차트 애니메이션
            requestAnimationFrame(() => {
                this.isBarReady = true;
            });

            $(document).on('portal:tab-change', (e, payload) => {
                if (payload.name === 'recordAllTab') {
                    this.activeTab.recordAllTab = payload.index;
                }

                if (payload.name === 'recordGroupTab') {
                    this.activeTab.recordGroupTab = payload.index;
                }
            });
        },
        watch: {
            // 도넛 차트 애니메이션 (데이터 변경 시)
            'activeTab.recordAllTab'() {
                this.$nextTick(() => {
                    if (!this.isRecordHidden) {
                        this.animateDonut(this.currentRecord.rate);
                    }
                });
            },
            isRecordHidden(val) {
                this.$nextTick(() => {
                    if (val) {
                        this.animateDonut(0);
                    } else {
                        this.animateDonut(this.currentRecord.rate);
                    }
                });
            }
        },
        methods: {
            // 이 달의 실적 도넛차트
            animateDonut: function(percent, duration = 1000) {
                const chart = this.$el.querySelector('.donut-chart');
                if (!chart) return;

                const circle = chart.querySelector('.progressCircle');
                if (!circle) return;

                const radius = 63;
                const circumference = 2 * Math.PI * radius;

                circle.style.transform = 'rotate(-90deg)';
                circle.style.transformOrigin = '50% 50%';
                circle.style.strokeDasharray = circumference;
                circle.style.strokeDashoffset = circumference;

                const totalFrames = Math.round(duration / (1000 / 60));
                let frame = 0;

                function easeOutCubic(t) {
                return 1 - Math.pow(1 - t, 3);
                }

                function animate() {
                    frame++;
                    const progress = frame / totalFrames;
                    const eased = easeOutCubic(progress);
                    const current = eased * percent;
                    const offset = circumference * (1 - current / 100);

                    circle.style.strokeDashoffset = offset;

                    if (frame < totalFrames) {
                        requestAnimationFrame(animate);
                    }
                }

                requestAnimationFrame(animate);
            }
        }
    });

    // 나의 일정
    $portalApp.vueServiceBean({
        el: "#myCalendarWrap",
        data: {
            calendarMode: 'calendar',
            items: []
            , calendarContent: ''
            , selectDate: ''
            , currentDate: '2024-03-26'
            , allDiaryInfos: {}
            , currentInfo: {}
            , selectDiaryInfo: {}
        },
        methods: {
            calendarToggleMode: function() {
                this.calendarMode = this.calendarMode === 'calendar' ? 'list' : 'calendar';
            },
            init: function () {
                // console.log('1111111')
                this.selectDate = this.currentDate;
                this.initCalendar();
                var currentDateArr = this.currentDate.split('-');
                this.getData({
                    year: currentDateArr[0]
                    , month: currentDateArr[1]
                }, 'init');
            }

            , initCalendar: function (linkInfo) {
                var _this = this;

                $('#pencake_0bef7fc53bc9412387893bf00e2e7fdbcalendar').datepicker({
                    changeMonth: true
                    , showOtherMonths: true
                    , selectOtherMonths: true
                    , showMonthAfterYear: true
                    , beforeShowDay: function (date) {
                        //var highlight = eventDates[date];
                        var viewDate = moment(date).format('YYYY-MM-DD');

                        if (_this.allDiaryInfos[viewDate]) {
                            return [true, "diary-event-day", ''];
                        } else {
                            return [true, '', ''];
                        }
                    }
                    , autoSize: true
                    , defaultDate: $.datepicker.parseDate("yy-mm-dd", this.currentDate)
                    , changeYear: true
                    , showButtonPanel: true
                    , onChangeMonthYear: function (year, month, inst) {
                        _this.getData({
                            year: year
                            , month: month
                        });
                    }
                    , onSelect: function (date, inst) {
                        _this.setDateContent(date);
                        return false;
                    }
                    , onUpdateDatepicker: function () {
                        //console.log(' onUpdateDatepicker 111')
                    }
                });

                $('.pencake_0bef7fc53bc9412387893bf00e2e7fdbsave').on('click', '', function () {
                    _this.saveContent();
                });
            }
            // 내용 삭제
            , deleteContent: function () {
                var _this = this;

                if (!confirm('삭제 하시겠습니까?')) return;

                _this.$ajax({
                    url: PENCAKE_OBJ.getUrl('/portlet/schedule/delete')
                    , method: 'get'
                    , data: {
                        diaryDt: this.selectDate
                        , id: this.selectDiaryInfo.ID
                    }
                    , loadSelector: '#pencake_0bef7fc53bc9412387893bf00e2e7fdbcontainer'
                    , success: function (resData) {
                        if (resData.status != 200) {
                            alert(resData.message);
                            return;
                        }
                        _this.getData(_this.currentInfo, 'delete');
                    }
                });
            }
            // 내용 저장
            , saveContent: function () {
                var _this = this;

                _this.$ajax({
                    url: PENCAKE_OBJ.getUrl('/portlet/schedule/save')
                    , method: 'get'
                    , data: {
                        diaryDt: this.selectDate
                        , contents: this.calendarContent
                    }
                    , loadSelector: '#pencake_0bef7fc53bc9412387893bf00e2e7fdbcontainer'
                    , success: function (resData) {
                        if (resData.status != 200) {
                            alert(resData.message);
                            return;
                        }
                        _this.getData(_this.currentInfo);
                    }
                });
            }
            // 일정 목록
            , getData: function (dateInfo, mode) {
                var _this = this;

                this.currentInfo = dateInfo;

                if (mode == 'delete') {
                    this.calendarContent = '';
                }

                _this.$ajax({
                    url: PENCAKE_OBJ.getUrl('/portlet/schedule/list')
                    , method: 'get'
                    , data: dateInfo
                    , loadSelector: '#pencake_0bef7fc53bc9412387893bf00e2e7fdbcontainer'
                    , success: function (resData) {
                        if (resData.status != 200) {
                            alert(resData.message);
                            return;
                        }
                        var allDiaryInfos = {};
                        resData.list.forEach(function (item) {
                            allDiaryInfos[item.DIARY_DT] = item;
                        })
                        _this.allDiaryInfos = allDiaryInfos;

                        if (mode == 'init') {
                            _this.setDateContent(_this.currentDate)
                        }

                        $('#pencake_0bef7fc53bc9412387893bf00e2e7fdbcalendar').datepicker('refresh');
                    }
                });
            }
            // 일정보기
            , setDateContent: function (date) {
                this.selectDate = date;
                this.selectDiaryInfo = (this.allDiaryInfos[date] || {});

                this.calendarContent = this.selectDiaryInfo.CONTENTS;
            }
        }
    });

    // 공통 탭
    $(document).on(
        'click', '[data-event] .common-tab li > button', function () {
            const $btn = $(this);
            const $li = $btn.closest('li');
            const $tabWrap = $btn.closest('[data-event]');

            // eventType "tab" : 콘텐츠 레이아웃이 바뀌는 tab. hide/show 제어함
            // eventType "view-tab" : 콘텐츠 레이아웃 바뀌지 않고 데이터만 변경됨
            const eventType = $tabWrap.data('event');
            const tabName = $tabWrap.data('tab-name');
            const tabIndex = $li.index();

            $li.addClass('active').siblings().removeClass('active');

            // tab 인 경우만 cnt-item 전환
            if (eventType === 'tab') {
                const $contents = $tabWrap.find('.tab-content .cnt-item');

                $contents.hide().eq(tabIndex).show();
            }

            $(document).trigger('portal:tab-change', {
                name: tabName,
                index: tabIndex
            });
        }
    );
    // 탭 초기 상태
    $('[data-event="tab"]').each(function() {
        const $wrap = $(this);
        const $activeLi = $wrap.find('.common-tab li.active');
        const initIndex = $activeLi.length ? $activeLi.index() : 0;

        $wrap.find('.tab-content .cnt-item').hide().eq(initIndex).show();
    });
})
import { info } from 'console';
import React, { Component } from 'react';
import { connect } from 'react-redux';

interface SalesState {
    tabMenu: string,
    checkedList: {}[],
    isCheckedList: boolean,

    isLoading: boolean,
    cntPage: number,
    selectOptCd: string,
}

class SalesLayout extends Component<any> {

    private testBottom = React.createRef<HTMLDivElement>();

    state: SalesState = {
        tabMenu: '1',
        checkedList: [], // 즐겨찾기
        isCheckedList: false,
        isLoading: false,
        cntPage: 0,
        selectOptCd: '1'
    }

    componentDidMount() {

    }

    scrollEvent = () => {
        let scrollTop = this.testBottom.current?.scrollTop;
        let scrollHeight = this.testBottom.current?.scrollHeight;
        let clientHeight = this.testBottom.current?.clientHeight;

        let bottom;
        if (scrollTop != undefined && scrollHeight != undefined) {
            bottom = scrollHeight - scrollTop === clientHeight;
            if (bottom) {
                this.setIsLoading();
                setTimeout(() => {
                    this.setCntPage();
                    this.setIsLoading();
                }, 500)
            }
        }
    }

    setIsLoading = () => {
        this.setState({
            isLoading: this.state.isLoading ? false : true
        })
    }

    setCntPage = () => {
        this.setState({
            cntPage: this.state.cntPage + 1
        }, () => {
            this.props.setSalesCurrentPage(1);
        })
    }

    returnOptTp = (optTp: any) => {
        switch (optTp) {
            case '1':
                return '영업기회';
            case '2':
                return '고객발굴';
            case '3':
                return '영업성공';
            case '4':
                return '영업실패';
            case '5':
                return '기회할당';
            default:
                return '';
        }
    }

    printList = (data: any) => {
        if (!this.state.isCheckedList) { // 즐겨찾기 필터 여부
            return (
                <li key={data.optCd + new Date()}>
                    {this.props.view(data, this.returnOptTp)}
                </li>
            )
        } else {
            if (data.bookMarkYn === 'Y') {
                return (
                    <li key={data.optCd + new Date()}>
                        {this.props.view(data, this.returnOptTp)}
                    </li>
                )
            }
        }
    }

    setActIcon = (str: any) => {
        let tmp = str.slice(0, 2);

        if (tmp === '견적')
            return 'order';
        if (tmp === '전화')
            return 'call';
    }

    // 즐겨찾기
    setCheckedList = (data: string, type: string) => {
        let tmp = this.state.checkedList;

        if (type === 'insert') {
            tmp.push(data);
        } else {
            tmp = tmp.filter(i => i !== data);
        }

        // state 처리
        this.setState({
            checkedList: tmp,
        }, () => {
            this.props.getSalesCheckedList(this.state.checkedList); // custArrayInfo 변경
        })

    }

    setIsCheckedList = () => {
        this.setState({
            isCheckedList: this.state.isCheckedList ? false : true
        })
    }

    setSelectOptCd = (optCd: string) => {
        this.props.getSelectOne(optCd);
        this.setState({
            selectOptCd: optCd
        })
    }

    render() {

        // redux state
        let { currentPage, isPanelOpen, pageDepth, filterVal, tmpCd } = this.props.rootState;

        // props
        let { salesArrayInfo, actvArrayInfo } = this.props;

        // state
        let { checkedList, isLoading, selectOptCd } = this.state;

        return (
            <div className={'contents flex-1 h-box'}>
                <div className={'viewBody bgType1 flex-1 v-box'}>
                    {
                        pageDepth === 1 ?
                            <div className="listHeaderWrap h-box">
                                <div className="leftDiv flex-1 h-box">
                                    <span className={`bookMarkBtn`} onClick={(e: any) => {
                                        if (e.target.className === 'bookMarkBtn')
                                            e.target.className = 'bookMarkBtn on';
                                        else
                                            e.target.className = 'bookMarkBtn';
                                        this.setIsCheckedList();
                                    }}>즐겨찾기</span>
                                </div>
                                <div className="rightDiv h-box" onClick={() => this.props.dispatch({ type: 'setIsFilterPanelOnOff', value: filterVal })}>
                                    <span className={`filterBtn`}><span className="cnt">2</span></span>
                                </div>
                            </div>
                            : undefined
                    }
                    {
                        isLoading ?
                            <div className='loadingWrap'>
                                <div className='bg_loading'>
                                </div>
                            </div>
                            : undefined
                    }
                    {
                        pageDepth === 1 ?
                            <div className={'cardList pt0 pb0 flex-1'} onScroll={this.scrollEvent} ref={this.testBottom}>
                                <ul onClick={(e: any) => {
                                    if (e.target.nodeName !== 'SPAN') {
                                        let tmp = e.target.parentNode.parentNode.parentNode.dataset.cd;
                                        this.setSelectOptCd(tmp);
                                        this.props.dispatch({ type: 'setIsDetaillOpen', value: tmp })
                                    } else {
                                        // 즐겨찾기
                                        let optCd = e.target.dataset.cd;
                                        if (e.target.className === 'ico') {
                                            this.setCheckedList(optCd, 'insert');
                                        } else {
                                            this.setCheckedList(optCd, 'remove');
                                        }
                                    }
                                }}>
                                    {
                                        salesArrayInfo ?
                                            salesArrayInfo.map((item: any) => {
                                                return (
                                                    this.printList(item)
                                                )
                                            })
                                            : undefined
                                    }
                                </ul>
                            </div>
                            :
                            undefined
                    }

                    {
                        // 영업관리 상세페이지
                        pageDepth === 2 ?

                            <SalesDetail
                                salesArrayInfo={salesArrayInfo}
                                actvArrayInfo={actvArrayInfo}
                                selectOptCd={tmpCd}
                                returnOptTp={this.returnOptTp}
                            />

                            :
                            undefined
                    }

                </div>
            </div>
        )
    }
}

class SalesDetail extends Component<any> {

    state = {
        info: {
            optCd: "",
            optTp: '',
            optNm: "",
            custNm: "",
            bookMarkYn: "",
            mySalesYn: "",
            startDt: "",
            endDt: "",
            salesEmpNm: "",
            insertDt: 0,
            updateDt: 0
        },

    }

    componentDidMount() {
        let tmp = this.setDetailInfo();
        this.setState({
            info: tmp
        });
    }

    setDetailInfo = () => {
        let optCd = this.props.selectOptCd;
        let salesArrayInfo = this.props.salesArrayInfo;

        let result;

        result = salesArrayInfo.filter((i: any) => i.optCd === optCd);
        result = result[0];
        return result;
    }

    getDay = (date: string) => {
        let a = []
        a.push(parseInt(date.slice(0, 4)), parseInt(date.slice(4, 6)), parseInt(date.slice(6, 8)))

        let today = new Date();
        let dday = new Date(`${a[0]}-${a[1]}-${a[2]}:00:00:00+0900`);
        let gap = dday.getTime() - today.getTime();
        let result = Math.ceil(gap / (1000 * 60 * 60 * 24));

        return 'D-' + result;
    }

    setActIcon = (str: any) => {
        let tmp = str.slice(0, 2);

        if (tmp === '견적')
            return 'order';
        if (tmp === '전화')
            return 'call';
    }

    returnOptTp = (optTp: string) => {
        switch (optTp) {
            case '1':
                return <div className="type1">영업기회</div>;
            case '2':
                return <div className="type2">고객발굴</div>;
            case '3':
                return <div className="type3">영업성공</div>;
            case '4':
                return <div className="type4">영업실패</div>;
            case '5':
                return <div className="type5">기회할당</div>;
            default:
                return '';
        }
    }

    render() {
        let { info } = this.state;
        let { selectOptCd, actvArrayInfo } = this.props;

        return (
            <>
                <div className="detailsHeader h-box posi_stk" style={{ top: '0px' }}>
                    <div className="dh-con flex-1 v-box">
                        <div className="h-box">
                            <div className="title flex-1 h-box">{info.optNm}</div>
                            <div className="salesStateBox">
                                {
                                    this.returnOptTp(info.optTp)
                                }
                            </div>
                        </div>
                        <div className="h-box">
                            <div className="txt-c1">{info.custNm}</div>
                            <div className="line"></div>
                            <div className="txt-c2 flex-1">{info.startDt + '-' + info.endDt}</div>
                            <div className="SalesStateTxt">{info.optCd !== '' ? this.getDay(info.endDt) : ''}</div>
                        </div>
                    </div>
                </div>

                <div className='timelineContents v-box' style={{ background: '#fff' }}>
                    <div className='flex-1 v-box'>
                        <div className="timelineFn h-box">
                            <div className="title flex-1">활동 타임라인</div>
                        </div>
                        <div className='timelineList flex-1 scroll_y_on'>
                            {
                                info.optCd === '1' ?
                                    <ul>
                                        {
                                            actvArrayInfo.map((item: any, index: number) => {
                                                return (
                                                    <li className="v-box" key={index}>
                                                        {
                                                            item.keymanCd ?
                                                                <>
                                                                    <div className="listType h-box">
                                                                        <div className={"icon " + this.setActIcon(item.actvTitlDc)}></div>
                                                                        <div className="info v-box flex-1">
                                                                            <div className="h-box">
                                                                                <div className="title ellipsis">{item.actvTitlDc}</div>
                                                                                <div className="arrowDetail"></div>
                                                                            </div>
                                                                            <div className="h-box">
                                                                                <div className="txt">{item.custNm}</div>
                                                                                <div className="line"></div>
                                                                                <div className="txt flex-1">홍길동 과장</div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="listMore"></div>
                                                                    </div><div className="listBox v-box">
                                                                        <div className="fnDiv h-box">
                                                                            <div className="textInfo flex-1">{item.actvDt + ' ' + item.qutDeptNm + ' ' + item.qutEmpNm}</div>
                                                                        </div>
                                                                        <div className="txDiv txLimit">
                                                                            {item.actvCntnTxt}
                                                                        </div>
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    <div className="listType h-box">
                                                                        <div className="icon system"></div>
                                                                        <div className="info v-box flex-1">
                                                                            <div className="h-box">
                                                                                <div className="title ellipsis">{item.actvTitlDc}</div>
                                                                            </div>
                                                                            <div className="h-box">
                                                                                <div className="txt">{item.actvDt}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                        }


                                                    </li>

                                                )
                                            })
                                        }
                                    </ul>
                                    : 'No data!'
                            }

                        </div>
                    </div>
                </div>

            </>

        )
    }

}

const reduxTest = (state: any) => {
    return {
        rootState: state
    }
}

export default connect(reduxTest)(SalesLayout);
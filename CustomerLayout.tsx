import React, { Component } from 'react';
import { connect } from 'react-redux';

interface CustomerState {
    tabMenu: string,
    checkedList: {}[],
    isCheckedList: boolean,
    cntPage: number,

    scroll: number,
    isLoading: boolean,
    selectCustCd: string,
}

class CustomerLayout extends Component<any> {

    private testBottom = React.createRef<HTMLDivElement>();

    state: CustomerState = {
        tabMenu: '1',
        checkedList: [], // 즐겨찾기
        isCheckedList: false,

        cntPage: 0, // scroll 시 +1

        scroll: 0,
        isLoading: false,

        selectCustCd: '3',
    }

    componentDidMount() {

    }

    componentDidUpdate(privProps: any, privState: any) {

    }

    scrollEvent = (e: any) => {

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

    printList = (data: any) => {
        if (!this.state.isCheckedList) { // 즐겨찾기 필터 여부,             
            return (
                <li key={data.custCd}>
                    {this.props.view(data)}
                </li>
            )
        } else {
            if (data.bookMarkYn === 'Y') { // 즐겨찾기만 출력
                return (
                    <li key={data.custCd}>
                        {this.props.view(data)}
                    </li>
                )
            }
        }
    }

    // 상세페이지
    printDetail = (custCd: string) => {
        let custArray = this.props.custArrayInfo;
        let result;

        result = custArray.filter((i: any) => i.custCd === custCd);

        return (
            <>

            </>
        )
    }

    setIsCheckedList = () => {
        this.setState({
            isCheckedList: this.state.isCheckedList ? false : true
        })
    }

    setTabMenu = (val: string) => {
        this.setState({
            tabMenu: val
        })
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
            this.props.getCustCheckedList(this.state.checkedList); // custArrayInfo 변경
        })

    }

    setCntPage = () => {
        this.setState({
            cntPage: this.state.cntPage + 1
        }, () => {
            this.props.setcustCurrentPage(1);
        })
    }
    getCntPage = () => {
        return this.state.cntPage;
    }

    setSelectCustCd = (custCd: string) => {
        this.props.getSelectOne(custCd);
        this.setState({
            selectCustCd: custCd
        })
    }

    render() {

        // redux state
        let { currentPage, isPanelOpen, pageDepth, tmpCd, filterVal } = this.props.rootState;

        // props
        let { custArrayInfo, actvArrayInfo } = this.props;

        // local state
        let { tabMenu, checkedList, cntPage, isLoading, selectCustCd } = this.state;

        return (
            <div className={'contents flex-1 h-box'}>
                <div className={'viewBody bgType1 flex-1 v-box'}>
                    {/* 즐겨찾기/필터 여부 */}
                    <div className="listHeaderWrap h-box">
                        <div className="leftDiv flex-1 h-box">
                            <span className={`bookMarkBtn`} onClick={(e: any) => {
                                if (e.target.className === 'bookMarkBtn') {
                                    // 즐겨찾기 켜기
                                    e.target.className = 'bookMarkBtn on';
                                } else {
                                    // 즐겨찾기 끄기
                                    e.target.className = 'bookMarkBtn';
                                }
                                this.setIsCheckedList();
                            }}>즐겨찾기</span>
                        </div>
                        <div className="rightDiv h-box" onClick={() => this.props.dispatch({ type: 'setIsFilterPanelOnOff', value: filterVal })}>
                            <span className={`filterBtn`}><span className="cnt">2</span></span>
                        </div>
                    </div>

                    {
                        isLoading ?
                            <div className='loadingWrap'>
                                <div className='bg_loading'>
                                </div>
                            </div>
                            : undefined
                    }

                    {/* list 출력 */}
                    {
                        pageDepth === 1 ?
                            <div className={'cardList pt0 pb0 flex-1'} onScroll={this.scrollEvent} ref={this.testBottom}>

                                <ul onClick={(e: any) => {
                                    if (e.target.nodeName !== 'SPAN') {
                                        let tmp = e.target.parentNode.parentNode.parentNode.dataset.cd;

                                        this.setSelectCustCd(tmp);
                                        this.props.dispatch({ type: 'setIsDetaillOpen', value: tmp });
                                    } else {
                                        let custCd = e.target.dataset.cd;
                                        if (e.target.className === 'ico') {
                                            // 즐겨찾기 리스트에 추가된 custCd는 bookMarkYn => 'Y' 변경
                                            this.setCheckedList(custCd, 'insert');
                                        } else {
                                            // 즐겨찾기에서 삭제하기
                                            this.setCheckedList(custCd, 'remove')
                                        }
                                    }
                                }}
                                >
                                    {
                                        // 출력부분                                        
                                        custArrayInfo ?
                                            custArrayInfo.map((item: any) => {
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
                        // 고객사 추가 버튼
                        <div className="floatingBtnBox" onClick={() => {
                            this.props.dispatch({ type: 'addPanelOnOff' })
                        }}><span className="addBtn"></span></div>
                    }


                    {/* 디테일 페이지 */}
                    {
                        pageDepth === 2 ?
                            <CustomerDetail
                                custArrayInfo={custArrayInfo}
                                actvArrayInfo={actvArrayInfo}
                                selectCustCd={tmpCd}
                            />
                            :
                            undefined
                    }


                </div>
            </div >
        )
    }

}

class CustomerDetail extends Component<any> {

    state = {
        tabMenu: '1',
        info: {
            custCd: "",
            custNm: "",
            bookMarkYn: "",
            bizrNo: "",
            tradeYn: "",
            salesYn: "",
            ceoNm: "",
            telNo: "",
            insertDt: 0,
            updateDt: 0
        },
        thisCustCd: 0,
    }

    componentDidMount() {
        let tmp = this.setDetailInfo();
        this.setState({
            info: tmp,
            thisCustCd: this.props.selectCustCd,
        })
    }

    setDetailInfo = () => {
        let custCd = this.props.selectCustCd;
        let custArrayInfo = this.props.custArrayInfo;

        let result;

        result = custArrayInfo.filter((i: any) => i.custCd === custCd);
        result = result[0];
        return result;
    }

    setTabMenu = (val: string) => {
        this.setState({
            tabMenu: val
        })
    }

    setActIcon = (str: any) => {
        let tmp = str.slice(0, 2);

        if (tmp === '견적')
            return 'order';
        if (tmp === '전화')
            return 'call';
    }

    render() {

        // local state
        let { tabMenu, info } = this.state;

        // props
        let { actvArrayInfo, selectCustCd } = this.props;

        return (
            <>
                <div className="detailsHeader h-box posi_stk" style={{ top: '0px' }}>
                    <div className="dh-con flex-1 v-box">
                        <div className="h-box">
                            <div className="title flex-1 h-box">{info.custNm}</div>
                            <div className="customerStateBox">
                                {info.tradeYn === 'N' ?
                                    <div className={'type1'}>미거래</div> :
                                    <div className={'type2'}>거래중</div>
                                }
                            </div></div><div className="h-box">
                            <div className="txt-c1">{info.bizrNo}</div>
                            <div className="flex-1"></div>
                            <div className="customerStateTxt">
                                {info.salesYn === 'N' ?
                                    <div className={'type1'}>미진행</div> :
                                    <div className={'type2'}>영업중</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="detailsTab posi_stk" style={{ top: '64px' }}>
                    <div className="detailsTabMenu">
                        <ul className="flex-1 h-box" onClick={(e: any) => {
                            if (e.target.nodeName == 'SPAN')
                                this.setTabMenu(e.target.dataset.tab);
                        }}>
                            <li className={this.state.tabMenu === '1' ? 'on' : ''}>
                                <span className="txt" data-tab='1'>기본정보</span>
                            </li>
                            <li className={this.state.tabMenu === '2' ? 'on' : ''}>
                                <span className="txt" data-tab='2'>활동 타임라인</span>
                            </li>
                        </ul>
                    </div>
                </div>
                {
                    tabMenu === '1' ?
                        <div className={'basicContents'}>
                            <div className="viewUnit h-box">
                                <dl className="v-box flex-1">
                                    <dt>회사명</dt>
                                    <dd><div className="txt">{info.custNm}</div></dd>
                                </dl>
                            </div>
                            <div className="viewUnit h-box">
                                <dl className="v-box flex-1">
                                    <dt>대표자</dt>
                                    <dd><div className="txt">{info.ceoNm ? info.ceoNm : '-'}</div></dd>
                                </dl>
                            </div>
                            <div className="viewUnit h-box">
                                <dl className="v-box flex-1">
                                    <dt>사업자번호</dt>
                                    <dd><div className="txt">{info.bizrNo ? info.bizrNo : '-'}</div></dd>
                                </dl>
                            </div>
                            <div className="viewUnit h-box">
                                <dl className="v-box flex-1">
                                    <dt>대표번호</dt>
                                    <dd><div className="txt">{info.telNo ? info.telNo : '-'}</div></dd>
                                </dl><div className="fnBtn h-box"><span className="telepBtn flex-1"></span>
                                </div>
                            </div>
                        </div>
                        : undefined
                }
                {
                    tabMenu === '2' ?
                        <div className='timelineContents v-box'>
                            <div className='flex-1 v-box'>
                                <div className="timelineFn h-box">
                                    <div className="title flex-1">활동 타임라인</div>
                                    {/* <div className="promotionBtn new">프로모션 확인</div> */}
                                    <div className="filterBtn"><span className="cnt">2</span>
                                    </div>
                                </div>
                                <div className='timelineList flex-1 scroll_y_on'>
                                    {
                                        info.custCd === '3' ?
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
                                            : 'No Data!'
                                    }

                                </div>
                            </div>
                        </div>

                        : undefined
                }

            </>
        )
    }
}

const reduxTest = (state: any) => {
    return {
        rootState: state
    }
}

export default connect(reduxTest)(CustomerLayout);
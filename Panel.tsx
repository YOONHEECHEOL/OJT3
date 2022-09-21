import React, { Component } from 'react';
import { connect } from 'react-redux';

// rState = redux state
const reduxTest = (rState: any) => {
    return {
        rootState: rState
    }
}

// lnb패널
class Panel extends Component<any> {

    private refCustNm = React.createRef<HTMLInputElement>();
    private refCeoNm = React.createRef<HTMLInputElement>();
    private refBizrNo = React.createRef<HTMLInputElement>();
    private refTelNo = React.createRef<HTMLInputElement>();
    private refTradeYn = React.createRef<HTMLSpanElement>();
    private refSalesYn = React.createRef<HTMLSpanElement>();

    state: any = {
        alignFilter: 'i',
        filterVal: {
            customer: {
                align: 'i',
                isSales: {
                    onSale: 'Y',
                    notSale: ''
                }
            },
            sales: {
                align: 'i',
                isTrade: {
                    myOpt: 'Y',
                    shareOpt: ''
                }
            }
        },
    }

    setCurrentPage = (page: any) => {
        this.props.dispatch({ type: 'setCurrentPage', value: page });
        // this.props.setIsPanelOpen();
        this.props.dispatch({ type: 'setIsPanelOpen', value: '' })
    }

    setAlignFilter = (val: string) => {
        let currentPage = this.props.rootState.currentPage;

        if (currentPage === 'customer') {
            this.setState({
                filterVal: {
                    ...this.state.filterVal,
                    customer: {
                        ...this.state.filterVal.customer,
                        align: val,
                    }
                }
            })
        }
        if (currentPage === 'sales') {
            this.setState({
                filterVal: {
                    ...this.state.filterVal,
                    sales: {
                        ...this.state.filterVal.sales,
                        align: val
                    }
                }
            }, () => this.state.filterVal.sales.align + '값으로 정렬!')
        }
    }

    getAlignFilter = () => {
        let currentPage = this.props.rootState.currentPage;

        let result;
        if (currentPage === 'customer')
            result = this.state.filterVal.customer.align;
        if (currentPage === 'sales')
            result = this.state.filterVal.sales.align;
        return result;
    }

    setFilterPanelOnOff = () => {

        this.props.dispatch({ type: 'setIsFilterPanelOnOff', value: this.state.filterVal });
    }

    render() {

        // rootState
        let { isPanelOpen, pageDepth, currentPage, isFilter, addPanel } = this.props.rootState;

        // localState
        let { filterVal } = this.state;

        // props
        let { custArrayLength } = this.props;

        return (
            <>
                <div className={`panel-drawer-wrap animated03s fadeInRight v-box`} style={{ display: isPanelOpen ? 'flex' : 'none' }}>
                    <div className={'flex-1 v-box'}>
                        {
                            pageDepth === 1 && isFilter === false ?
                                <>
                                    <div className="panelHeader h-box">
                                        <div className="picDiv flex-1 h-box">
                                            <div className="pic">
                                                <img src="./static/media/temp-user.272375ac.png" alt="" />
                                            </div>
                                            <div className="flex-1 v-box">
                                                <div className="name ellipsis">김더존</div>
                                                <div className="company ellipsis">더존비즈온</div>
                                            </div>
                                        </div>
                                        <div className="rightFnDiv">
                                            <span className="closeBtn" onClick={() => this.props.dispatch({ type: 'setIsPanelOpen', value: '' })}></span>
                                            <span className="settingBtn"></span>
                                        </div>
                                    </div>
                                    <div className='lnbMenu'>
                                        <dl>
                                            <dt>고객관리</dt>
                                            <dd onClick={() => this.setCurrentPage('customer')}><span className="menuItem customer">고객사</span></dd>
                                        </dl>
                                        <dl>
                                            <dt>영업활동관리</dt>
                                            <dd onClick={() => this.setCurrentPage('sales')}>
                                                <span className="menuItem sales">영업활동</span>
                                            </dd>
                                        </dl>
                                    </div>
                                </> :
                                undefined
                        }
                        {
                            // 고객사 필터 패널
                            isFilter === true && currentPage === 'customer' ?
                                <>
                                    <div className="panelHeader h-box">
                                        <div className="titleDiv flex-1 h-box">
                                            <span className="filterTitle">필터&amp;정렬</span>
                                        </div>
                                        <div className="rightFnDiv">
                                            <span className="textBlackBtn" onClick={() => this.props.dispatch({ type: 'setIsFilterPanelOnOff', value: filterVal })}>확인</span>
                                            <span className="refreshBtn"></span>
                                        </div>
                                    </div>
                                    <div className="filterUnit flex-1 scroll_y_on">
                                        <dl>
                                            <dt className="h-box">
                                                <div className="tit flex-1">정렬</div>
                                            </dt>
                                            <dd className="alignBox h-box" onClick={(e: any) => {
                                                if (e.target.dataset.filter) {
                                                    this.setAlignFilter(e.target.dataset.filter);
                                                }
                                            }}>
                                                <div className={filterVal.customer.align === 'i' ? "alignItem on" : 'alignItem'} data-filter={'i'}>등록순</div>
                                                <div className={filterVal.customer.align === 'u' ? "alignItem on" : 'alignItem'} data-filter={'u'}>수정순</div>
                                            </dd>
                                        </dl>
                                        <dl>
                                            <dt className="h-box">
                                                <div className="tit flex-1">영업진행여부</div>
                                                <div className="sub">중복선택가능</div>
                                            </dt>
                                            <dd className={filterVal.customer.isSales.onSale === 'Y' ? "h-box on" : 'h-box'} onClick={() => {
                                                this.setState({
                                                    filterVal: {
                                                        ...filterVal,
                                                        customer: {
                                                            ...filterVal.customer,
                                                            isSales: {
                                                                ...filterVal.customer.isSales,
                                                                onSale: filterVal.customer.isSales.onSale === 'Y' ? '' : 'Y'
                                                            }
                                                        }
                                                    },
                                                })
                                            }}>
                                                <div className="itemText flex-1">영업중</div>
                                                <div className="checkBox">
                                                    <div className={filterVal.customer.isSales.onSale === 'Y' ? "checkItem checked" : 'checkItem'}></div>
                                                </div>
                                            </dd>
                                            <dd className={filterVal.customer.isSales.notSale === 'Y' ? "h-box on" : 'h-box'} onClick={() => {
                                                this.setState({
                                                    filterVal: {
                                                        ...filterVal,
                                                        customer: {
                                                            ...filterVal.customer,
                                                            isSales: {
                                                                ...filterVal.customer.isSales,
                                                                notSale: filterVal.customer.isSales.notSale === 'Y' ? '' : 'Y'
                                                            }
                                                        }
                                                    },
                                                })
                                            }}>
                                                <div className="itemText flex-1">미진행</div>
                                                <div className="checkBox">
                                                    <div className={filterVal.customer.isSales.notSale === 'Y' ? "checkItem checked" : 'checkItem'}></div>
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </> :
                                undefined
                        }
                        {
                            // 영업관리 필터 패널
                            isFilter === true && currentPage === 'sales' ?
                                <>
                                    <div className="panelHeader h-box">
                                        <div className="titleDiv flex-1 h-box">
                                            <span className="filterTitle">필터&amp;정렬</span>
                                        </div>
                                        <div className="rightFnDiv">
                                            <span className="textBlackBtn" onClick={() => this.props.dispatch({ type: 'setIsFilterPanelOnOff', value: filterVal })}>확인</span>
                                            <span className="refreshBtn"></span>
                                        </div>
                                    </div>
                                    <div className="filterUnit flex-1 scroll_y_on">
                                        <dl>
                                            <dt className="h-box">
                                                <div className="tit flex-1">정렬</div>
                                            </dt>
                                            <dd className="alignBox h-box" onClick={(e: any) => {
                                                if (e.target.dataset.filter) {
                                                    this.setAlignFilter(e.target.dataset.filter);
                                                }
                                            }}>
                                                <div className={this.state.filterVal.sales.align === 'i' ? "alignItem on" : 'alignItem'} data-filter='i'>등록순</div>
                                                <div className={this.state.filterVal.sales.align === 'u' ? "alignItem on" : 'alignItem'} data-filter='u'>수정순</div>
                                                <div className={this.state.filterVal.sales.align === 'c' ? "alignItem on" : 'alignItem'} data-filter='c'>회사명순</div>
                                                <div className={this.state.filterVal.sales.align === 'r' ? "alignItem on" : 'alignItem'} data-filter='r'>최근활동순</div>
                                            </dd>
                                        </dl>
                                        <dl>
                                            <dt className="h-box">
                                                <div className="tit flex-1">거래여부</div>
                                                <div className="sub">중복선택가능</div>
                                            </dt>
                                            <dd className={filterVal.sales.isTrade.myOpt === 'Y' ? "h-box on" : 'h-box'} onClick={() => {
                                                this.setState({
                                                    filterVal: {
                                                        ...filterVal,
                                                        sales: {
                                                            ...filterVal.sales,
                                                            isTrade: {
                                                                ...filterVal.sales.isTrade,
                                                                myOpt: filterVal.sales.isTrade.myOpt === 'Y' ? '' : 'Y'
                                                            }
                                                        }
                                                    }
                                                })
                                            }}>
                                                <div className="itemText flex-1">내기회</div>
                                                <div className="checkBox">
                                                    <div className={filterVal.sales.isTrade.myOpt === 'Y' ? "checkItem checked" : 'checkItem'}></div>
                                                </div>
                                            </dd>
                                            <dd className={filterVal.sales.isTrade.shareOpt === 'Y' ? "h-box on" : 'h-box'} onClick={() => {
                                                this.setState({
                                                    filterVal: {
                                                        ...filterVal,
                                                        sales: {
                                                            ...filterVal.sales,
                                                            isTrade: {
                                                                ...filterVal.sales.isTrade,
                                                                shareOpt: filterVal.sales.isTrade.shareOpt === 'Y' ? '' : 'Y'
                                                            }
                                                        }
                                                    }
                                                })
                                            }}>
                                                <div className="itemText flex-1">공유기회</div>
                                                <div className="checkBox">
                                                    <div className={filterVal.sales.isTrade.shareOpt === 'Y' ? "checkItem checked" : 'checkItem'}></div>
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </> :
                                undefined
                        }
                    </div>
                </div>
                <div className={`dim2`} style={{ display: isPanelOpen ? 'flex' : 'none' }} />

                {
                    addPanel ?
                        // 추가페이지
                        <div className="PN2DWrap animated03s fadeInRight v-box flex-1">
                            <div className="panel-sub-wrap v-box animated03s fadeInRight">
                                <div className="flex-1 v-box">
                                    <div className="panelHeader h-box">
                                        <div className="leftFnDiv" onClick={() => {
                                            this.props.dispatch({ type: 'addPanelOnOff' })
                                        }}>
                                            <span className="closeBtn">
                                            </span>
                                        </div>
                                        <div className="titleDiv flex-1 h-box">
                                            <span className="title">고객사 등록</span>
                                        </div>
                                        <div className="rightFnDiv">
                                            <span className="textBlueBtn" onClick={() => {
                                                let custCdSeq = custArrayLength + 1;

                                                console.log(custCdSeq)
                                                debugger;

                                                // 입력값 검증
                                                let input = { custCd: custCdSeq, custNm: "", bookMarkYn: "N", bizrNo: "", tradeYn: "N", salesYn: "N", ceoNm: "", telNo: "", insertDt: custCdSeq, updateDt: custCdSeq };

                                                let refCustNm = this.refCustNm.current
                                                let refBizrNo = this.refBizrNo.current
                                                let refCeoNm = this.refCeoNm.current
                                                let refSalesYn = this.refSalesYn.current
                                                let refTelNo = this.refTelNo.current
                                                let refTradeYn = this.refTradeYn.current

                                                if (refCustNm && refBizrNo && refCeoNm && refSalesYn && refTelNo && refTradeYn) {
                                                    // custNm 검증
                                                    if (refCustNm.value === '')
                                                        return console.log('no data!');

                                                    input = {
                                                        ...input,
                                                        custNm: refCustNm.value,
                                                        bizrNo: refBizrNo.value,
                                                        ceoNm: refCeoNm.value,
                                                        telNo: refTelNo.value,
                                                        salesYn: refSalesYn.dataset.chk === 'N' ? 'N' : 'Y',
                                                        tradeYn: refTradeYn.dataset.chk === 'N' ? 'N' : 'Y'
                                                    }

                                                    this.props.addCustArray(input)
                                                }

                                                // 패널 닫기
                                                this.props.dispatch({ type: 'addPanelInsert' })
                                            }}>등록</span>
                                        </div>
                                    </div>
                                    <div className="viewBody flex-1 v-box scroll_y_on bgType2">
                                        <div className="basicContents">
                                            <div className="titleUnit h-box">
                                                <div className="titleText flex-1">기본정보</div>
                                            </div>
                                            <div className="editUnit h-box">
                                                <dl className="v-box flex-1">
                                                    <dt>회사명<span className="imp">*</span></dt>
                                                    <dd className="flex-1 h-box">
                                                        <input ref={this.refCustNm} type="text" className="inputField flex-1" placeholder="회사명을 입력해주세요." />
                                                    </dd>
                                                </dl>
                                            </div>
                                            <div className="editUnit h-box">
                                                <dl className="v-box flex-1">
                                                    <dt>대표자</dt>
                                                    <dd className="flex-1 h-box">
                                                        <input ref={this.refCeoNm} type="text" className="inputField flex-1" placeholder="회사명을 입력해주세요." />
                                                    </dd>
                                                </dl>
                                            </div>
                                            <div className="editUnit h-box">
                                                <dl className="v-box flex-1">
                                                    <dt>사업자번호</dt>
                                                    <dd className="flex-1 h-box">
                                                        <input ref={this.refBizrNo} type="text" className="inputField flex-1" placeholder="회사명을 입력해주세요." />
                                                    </dd>
                                                </dl>
                                            </div>
                                            <div className="editUnit h-box">
                                                <dl className="v-box flex-1">
                                                    <dt>대표번호</dt>
                                                    <dd className="flex-1 h-box">
                                                        <input ref={this.refTelNo} type="text" className="inputField flex-1" placeholder="회사명을 입력해주세요." />
                                                    </dd>
                                                </dl>
                                            </div>
                                            <div className="editUnit h-box">
                                                <dl className="v-box flex-1">
                                                    <dt>거래여부</dt>
                                                </dl>
                                                <div className="fnBtn h-box">
                                                    <span ref={this.refTradeYn} data-chk='N' className="radioItem flex-1" onClick={(e: any) => {
                                                        let chk = e.target.dataset.chk;
                                                        if (chk === 'N')
                                                            e.target.className = 'radioItem flex-1 selected';
                                                        else
                                                            e.target.className = 'radioItem flex-1';
                                                        e.target.dataset.chk = chk === 'N' ? 'Y' : 'N';
                                                    }}></span></div>
                                            </div>
                                            <div className="editUnit h-box">
                                                <dl className="v-box flex-1">
                                                    <dt>영업진행여부</dt>
                                                </dl>
                                                <div className="fnBtn h-box">
                                                    <span ref={this.refSalesYn} data-chk='N' className="radioItem flex-1" onClick={(e: any) => {
                                                        let chk = e.target.dataset.chk;
                                                        if (chk === 'N')
                                                            e.target.className = 'radioItem flex-1 selected';
                                                        else
                                                            e.target.className = 'radioItem flex-1';
                                                        e.target.dataset.chk = chk === 'N' ? 'Y' : 'N';
                                                    }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : undefined
                }
            </>
        )
    }

}
export default connect(reduxTest)(Panel);
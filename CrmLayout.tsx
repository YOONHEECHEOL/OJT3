import React, { Component, Fragment } from 'react';
import { IonAlert, IonToast } from '@ionic/react';
import CustomerLayout from './CustomerLayout';
import SalesLayout from './SalesLayout';
import Panel from './Panel';

import '../../assets/css/common.scss';
import '../../assets/css/animate.scss';
import '../../assets/css/crm.scss';
import { connect } from 'react-redux';

// data
import { custArrayInfo, salesArrayInfo, actvArrayInfo } from './data';

class CrmLayout extends Component<any> {

    state: any = {
        custArray: [],
        custArrayLength: 0,
        salesArray: [],
        actvArrayInfo: actvArrayInfo,

        custCurrentPage: 0,
        custPageLength: 0,

        salesCurrentPage: 0,
        salesPageLength: 0,

        selectOne: '',
    }

    componentDidMount() {

        let custArray: any;
        let salesArray: any;

        // data localStorage 저장
        if (localStorage.getItem('custArray') === null)
            this.setLocalStorageArray('custArray', custArrayInfo);

        if (localStorage.getItem('salesArray') === null)
            this.setLocalStorageArray('salesArray', salesArrayInfo);

        // data를 state로 저장
        custArray = this.getLocalStorageArray('custArray');
        this.setState({ custArrayLength: custArray.length });
        salesArray = this.getLocalStorageArray('salesArray');

        this.getArrayInfo(custArray, 10, this.state.custCurrentPage, 'customer', '');
        this.getArrayInfo(salesArray, 10, this.state.salesCurrentPage, 'sales', '');

        // locatStorage에서 filterVal 가져오기
        let filterVal;
        if (localStorage.getItem('filterVal') !== null)
            filterVal = this.getLocalStorageArray('filterVal');

    }

    componentDidUpdate(privProps: any, privState: any) {
        // 스크롤 시 추가 출력
        if (privState.custCurrentPage != this.state.custCurrentPage) {
            let tmp = this.setFilterArray(this.getLocalStorageArray('custArray'));
            tmp = this.setSortArray(tmp);
            this.getArrayInfo(tmp, 10, this.state.custCurrentPage, 'customer', '');
        }
        if (privState.salesCurrentPage != this.state.salesCurrentPage) {
            let tmp = this.setFilterArray(this.getLocalStorageArray('salesArray'));
            tmp = this.setSortArray(tmp);
            this.getArrayInfo(tmp, 10, this.state.salesCurrentPage, 'sales', '');
        }

        // 정렬 & filter
        if (privProps.rootState.filterVal != this.props.rootState.filterVal) {
            if (this.props.rootState.currentPage === 'customer') {
                let tmp = this.setFilterArray(this.getLocalStorageArray('custArray'));
                tmp = this.setSortArray(tmp);

                this.setState({ custCurrentPage: 0 }, () => {
                    this.getArrayInfo(tmp, 10, this.state.custCurrentPage, 'customer', 'Y');
                })
            }
            if (this.props.rootState.currentPage === 'sales') {
                let tmp = this.setFilterArray(this.getLocalStorageArray('salesArray'));
                tmp = this.setSortArray(tmp);
                this.setState({ salesCurrentPage: 0 }, () => {
                    this.getArrayInfo(tmp, 10, this.state.salesCurrentPage, 'sales', 'Y');
                })
            }

        }
    }

    // localStorage getter, setter
    getLocalStorageArray = (arrNm: string): [] | undefined => {
        let result: any;
        if (localStorage.getItem(arrNm) !== undefined) {
            result = localStorage.getItem(arrNm);
            result = JSON.parse(result);
            return result;
        }
        return;
    }
    setLocalStorageArray = (arrNm: string, arr: {}[]): void => {
        localStorage.setItem(arrNm, JSON.stringify(arr));
    }

    // scroll 페이지 변경
    setcustCurrentPage = (data: number) => {
        this.setState({
            custCurrentPage: this.state.custCurrentPage + data
        })
    }
    setSalesCurrentPage = (data: number) => {
        this.setState({
            salesCurrentPage: this.state.salesCurrentPage + data
        })
    }

    // array 정렬
    setSortArray = (arr: any) => {

        let { filterVal, currentPage } = this.props.rootState;

        let val: any;
        if (currentPage == 'customer')
            val = this.props.rootState.filterVal.customer.align;
        if (currentPage == 'sales')
            val = this.props.rootState.filterVal.sales.align;

        /**
         * i : 등록순
         * u : 수정순
         * c : 회사명순
         * r : 최근활동순
         */
        let result = []; // 기존 값으로 입력
        if (!arr)
            return;
        if (val === 'i') {
            result = arr.sort((a: any, b: any) => {
                return a.insertDt - b.insertDt;
            })
        }
        if (val === 'u') {
            result = arr.sort((a: any, b: any) => {
                return a.updateDt - b.updateDt;
            })
        }
        if (val === 'c') {
            result = arr.sort((a: any, b: any) => {
                return a.custNm - b.custNm;
            })
        }
        if (val === 'r') {
            result = arr.sort((a: any, b: any) => {
                return a.startDt - b.startDt;
            })
        }

        return result;
    }

    // 필터값 적용하기
    setFilterArray = (arr: any) => {
        let { currentPage, filterVal } = this.props.rootState;
        let filterA = '';
        let filterB = '';

        let result: any = [];

        let tmp1 = [];
        let tmp2 = [];

        if (currentPage === 'customer') {
            filterA = filterVal.customer.isSales.onSale;
            filterB = filterVal.customer.isSales.notSale;

            if (!arr)
                return;
            if (filterA === 'Y') {
                tmp1 = arr.filter((i: any) => i.salesYn !== 'N')
            }
            if (filterB === 'Y') {
                tmp2 = arr.filter((i: any) => i.salesYn === 'N')
            }
            if (filterA === '' && filterB === '') {
                return arr;
            }
        }
        if (currentPage === 'sales') {
            filterA = filterVal.sales.isTrade.shareOpt;
            filterB = filterVal.sales.isTrade.myOpt;

            if (!arr)
                return;
            if (filterA === 'Y') {
                result = [];
                tmp1 = arr.filter((i: any) => i.mySalesYn !== 'N')
            }
            if (filterB === 'Y') {
                result = [];
                tmp2 = arr.filter((i: any) => i.mySalesYn === 'N')
            }
            if (filterA === '' && filterB === '') {
                return arr;
            }
        }
        result = [...result, ...tmp1, ...tmp2];

        return result;
    }

    // 스크롤 시 데이터 출력
    getArrayInfo = (arrInfo: any, listCnt: number, currentPage: number, arrNm: string, reset: string) => {
        let custArray = this.state.custArray;
        let salesArray = this.state.salesArray;

        if (reset === 'Y') {
            custArray = [];
            salesArray = [];
        }

        let arr = arrInfo; // custArray, salesArray

        let result = [];
        let tmp: any = [];

        if (arr.length < listCnt) {
            if (arrNm === 'customer')
                this.setState({
                    custArray: arr
                });
            if (arrNm === 'sales')
                this.setState({
                    salesArray: arr
                });

            return;
        }

        if (arr) {
            // 배열 분할
            for (let i = 0; i < arr.length; i += listCnt) {
                result.push(arr.slice(i, i + listCnt))
            }

            if (arrNm === 'customer')
                this.setState({
                    custPageLength: result.length
                });
            if (arrNm === 'sales')
                this.setState({
                    salesPageLength: result.length
                });

            result.forEach((i: any, index: number) => {
                if (currentPage >= index) {
                    i.forEach((j: any) => {
                        tmp.push(j)
                    })
                }
            })

            if (result.length > currentPage) {
                if (arrNm === 'customer')
                    this.setState({
                        custArray: [...tmp]
                    });
                if (arrNm === 'sales')
                    this.setState({
                        salesArray: [...tmp]
                    });
            }
        }
    }

    addCustArray = (data: any) => {
        // 추가할 데이터 받기
        let tmp: any = this.getLocalStorageArray('custArray');
        tmp.unshift(data);

        this.setLocalStorageArray('custArray', tmp)

        this.setState({
            custArray: tmp
        })
    }

    setIsPanelOpen = () => {
        this.props.dispatch({ type: 'setIsPanelOpen', value: '' })
    }

    setPageBack = (depth: number) => {
        this.props.dispatch({ type: 'setPageBack', value: depth })
    }

    getTitle = () => {
        let { currentPage, isPanelOpen, pageDepth } = this.props.rootState;

        if (currentPage === 'customer' && pageDepth === 1)
            return '고객사';
        if (currentPage === 'sales' && pageDepth === 1)
            return '영업관리';
        if (currentPage === 'customer' && pageDepth === 2)
            return '고객사 상세';
        if (currentPage === 'sales' && pageDepth === 2)
            return '영업관리 상세';
    }

    getCustCheckedList = (list: string[], arrNm: string) => {
        // custArrayInfo에서 즐겨찾기에 포함된 리스트의 bookMarkYn 변경
        let tmp = this.state.custArray;

        tmp = tmp.map((item: any) => {
            if (list.includes(item.custCd))
                return { ...item, bookMarkYn: 'Y' }
            return { ...item, bookMarkYn: 'N' }
        })

        this.setState({
            custArray: [...tmp],
        })
    }

    getSalesCheckedList = (list: string[]) => {
        // salesArrayInfo에서 즐겨찾기에 포함된 리스트의 bookMarkYn 변경
        let tmp = this.state.salesArray;

        tmp = tmp.map((item: any) => {
            if (list.includes(item.optCd))
                return { ...item, bookMarkYn: 'Y' }
            return { ...item, bookMarkYn: 'N' }
        })

        this.setState({
            salesArray: [...tmp],
        })
    }

    getSelectOne = (data: string) => {
        this.setState({
            selectOne: data
        })
    }

    render() {

        // redux state
        let { currentPage, isPanelOpen, pageDepth } = this.props.rootState;
        // local state
        let { custArray, salesArray, actvArrayInfo, custPageLength, custArrayLength, selectOne } = this.state;

        return (
            <>
                <div className="mobileWrap v-box">
                    <div className={'DV1DWrap v-box'}>
                        {
                            // 고객사, 영업활동 페이지
                            pageDepth === 1 ?
                                <>
                                    <CommonHeader
                                        type={1}

                                        setIsPanelOpen={this.setIsPanelOpen}
                                        title={this.getTitle()}
                                    />
                                    {
                                        currentPage === 'customer' ?
                                            <CustomerLayout
                                                custArrayInfo={custArray}
                                                custPageLength={custPageLength}
                                                actvArrayInfo={actvArrayInfo}

                                                // scroll 이벤트 페이지 수정
                                                setcustCurrentPage={this.setcustCurrentPage}

                                                // 즐겨찾기 리스트 받기
                                                getCustCheckedList={this.getCustCheckedList}

                                                getSelectOne={this.getSelectOne}

                                                // 카드 형태
                                                view={(data: any) => {
                                                    return (
                                                        <div className={selectOne === data.custCd ? 'cardDiv h-box on' : 'cardDiv h-box'} data-cd={data.custCd}>
                                                            <div className={'list-con flex-1 v-box'}>
                                                                <div className={'h-box'}>
                                                                    <div className={'title flex-1'}>{data.custNm}</div>
                                                                    <div className="customerStateBox">
                                                                        {data.tradeYn === 'N' ?
                                                                            <div className={'type1'}>미거래</div> :
                                                                            <div className={'type2'}>거래중</div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="h-box">
                                                                    <div className="txt01 flex-1">{data.bizrNo}</div>
                                                                    <div className="customerStateTxt">
                                                                        {data.salesYn === 'N' ?
                                                                            <div className={'type1'}>미진행</div> :
                                                                            <div className={'type2'}>영업중</div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="list-bmk">
                                                                <span data-cd={data.custCd} className={data.bookMarkYn === 'N' ? 'ico' : 'ico on'}></span>
                                                            </div>
                                                        </div>
                                                    )
                                                }}
                                            />
                                            : undefined
                                    }
                                    {
                                        currentPage === 'sales' ?
                                            <SalesLayout
                                                salesArrayInfo={salesArray}
                                                actvArrayInfo={actvArrayInfo}

                                                getSalesCheckedList={this.getSalesCheckedList}
                                                setSalesCurrentPage={this.setSalesCurrentPage}

                                                getSelectOne={this.getSelectOne}

                                                // 카드 형태
                                                view={(data: any, returnOptTp: any) => {
                                                    return (
                                                        <div className={selectOne === data.optCd ? 'cardDiv h-box on' : 'cardDiv h-box'} data-cd={data.optCd}>
                                                            <div className={'list-con flex-1 v-box'}>
                                                                <div className={'h-box'}>
                                                                    <div className={'title flex-1'}>{data.optNm}</div>
                                                                    <div className="salesStateBox">
                                                                        <div className={'type' + data.optTp}>
                                                                            {returnOptTp(data.optTp)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="h-box">
                                                                    <div className="txt01">{data.optNm}</div>
                                                                    <div className="line"></div>
                                                                    <div className="txt02 flex-1">{data.endDt}</div>
                                                                    <div className="txt01 mr5">{data.salesEmpNm}</div>
                                                                </div>
                                                            </div>
                                                            <div className="list-bmk">
                                                                <span data-cd={data.optCd} className={data.bookMarkYn === 'N' ? 'ico' : 'ico on'}></span>
                                                            </div>
                                                        </div>
                                                    )
                                                }}
                                            />
                                            : undefined
                                    }
                                </>
                                : undefined
                        }
                    </div>

                    <div className={'DV2DWrap v-box'}>
                        {
                            // 상세페이지
                            pageDepth === 2 ?
                                <>
                                    <CommonHeader
                                        type={2}

                                        setIsPanelOpen={this.setIsPanelOpen}
                                        title={this.getTitle()}
                                        setPageBack={() => this.setPageBack(1)}
                                    />
                                    {
                                        // customer - 고객사 상세페이지
                                        currentPage === 'customer' ?
                                            <>
                                                <CustomerLayout
                                                    custArrayInfo={custArrayInfo}
                                                    actvArrayInfo={actvArrayInfo}
                                                />
                                            </>
                                            : undefined
                                    }
                                    {
                                        // sales - 영업관리 상세페이지
                                        currentPage === 'sales' ?
                                            <>
                                                <SalesLayout
                                                    salesArrayInfo={salesArray}
                                                    actvArrayInfo={actvArrayInfo}
                                                />
                                            </>
                                            : undefined
                                    }
                                </>
                                : undefined
                        }
                        {
                            <Panel
                                // custArrayLength
                                custArrayLength={custArrayLength}

                                // custArray 리스트 추가 Fnc
                                addCustArray={this.addCustArray}
                            />
                        }
                    </div>

                </div>


            </>
        );
    }
}

export class CommonHeader extends Component<any> {

    render() {
        return (
            <div className={`header h-box`}>
                {/* 왼쪽 버튼영역 */}
                <div className="leftFnDiv">
                    <span className="backBtn"
                        onClick={(e: any) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (this.props.hasOwnProperty('setPageBack'))
                                this.props.setPageBack(1);
                        }}
                    />
                </div>
                {/* 타이틀영역 */}
                <div className="titleDiv flex-1 h-box">
                    <span className="title">
                        {this.props.title}
                    </span>
                </div>
                {/* 오른쪽 버튼영역 */}
                {
                    this.props.type === 1 ?
                        <div className="rightFnDiv">
                            <span className="menuBtn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    this.props.setIsPanelOpen();
                                }}
                            />
                        </div>
                        : undefined
                }
                {
                    this.props.type === 2 ?
                        // <div className="rightFnDiv">
                        //     <span className="moreBtn"></span>
                        //     <span className="editBtn"></span>
                        //     <span className="bookMarkBtn "></span>
                        // </div>
                        <></>
                        : undefined
                }
            </div>
        )
    }

}

// rState = redux state
const reduxTest = (state: any) => {
    return {
        rootState: state
    }
}

export default connect(reduxTest)(CrmLayout);

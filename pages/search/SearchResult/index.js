import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import * as Constants from '../../../components/constants';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import {useRouter}  from 'next/router';
import * as actionTypes from '../../../store/actions';
import {connect} from 'react-redux';
import ProductCard from '../../../components/ProductCard/ProductCard';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Pagination from '@material-ui/lab/Pagination';
import Drawer from '@material-ui/core/Drawer';
import SearchProductcard from '../../../components/SearchProductCard/SearchProductCard';
import Head from 'next/head';

const SearchResult = (props) => {

    const router = useRouter();

    const [addedFilters, setAddedFilters] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [orderState, setOrderState] = useState('new');
    const [categoryName, setCategoryName] = useState('');
    const [searchInputState, setSearchInputState] = useState('');
    const [categoryBanners, setCategoryBanners] = useState([]);
    const [categoryBreadcrumbs, setCategoryBreadcrumbs] = useState([]);
    const [productFound, setProductFound] = useState(true);
    const [state, setState] = React.useState({bottom: false});
    const [p, setP] = useState(1);
    const [pages, setPages] = useState(1);
    const [filters, setFilters] = useState([]);
    const [filterMinPrice, setFilterMinprice] = useState(0);
    const [filterMaxPrice, setFilterMaxPrice] = useState(0);
    const [recentlyDeletedFilter, setRecentlyDeletedFilter] = useState({});
    const [phoneFilterOpenStatus, setPhoneFilterOpenStatus] = useState(false);
    const [visibleFilterGroupId, setVisibleFilterGroupId] = useState(-1);
    const [windowHeight, setWindowHeight] = useState(0);

    const [results, setResults] = useState([]);

    const [category, setCategory] = useState('');

    useEffect(() => {
        if(router.query.query !== undefined){
            setCategory(router.query.query)
            receiveData();
        }
    }, [router.query.query, undefined]);

    useEffect(() => {
        props.reduxUpdateUserTotally(props.ssrUser);
        if(props.ssrUser.status === 'LOGIN'){
            console.warn(props.ssrUser.information);
            axios.post(Constants.apiUrl + "/api/user-cart", {},{
                headers: {
                    'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
                }
            }).then((res)=>{
                let response = res.data;
                if(response.status === 'done'){
                    let cartArray = [];
                    if(response.cart !== '{}'){
                        response.cart.map((item, counter) => {
                            cartArray.push({
                                productId: item.productId,
                                productPackId: item.productPackId,
                                name: item.productName,
                                categoryId: item.categoryId,
                                prodID: item.prodID,
                                url: item.productUrl,
                                count: item.productCount,
                                unitCount: item.productUnitCount,
                                unitName: item.productUnitName,
                                label: item.productLabel,
                                basePrice: item.productBasePrice,
                                price: item.productPrice,
                                discountedPrice: item.discountedPrice,
                                discountPercent: item.discountPercent
                            });
                        });
                        props.reduxUpdateCart(cartArray);
                    }else{
                        props.reduxUpdateCart([]);
                    }
                }else if(response.status === 'failed'){
                    console.warn(response.message);
                    console.warn(response.umessage);
                }
            }).catch((error)=>{
                console.error(error);
                props.reduxUpdateCart([]);
                alert('مشکلی پیش آمده لطفا مجددا امتحان کنید');
            });
        }else if(props.ssrUser.status === 'GUEST'){
            let cart = localStorage.getItem('user_cart');
            if(cart === undefined || cart === null){
                localStorage.setItem('user_cart', '[]');
                props.reduxUpdateCart([]);
            }else{
                axios.post(Constants.apiUrl + '/api/guest-cart',{
                    cart: localStorage.getItem('user_cart')
                }).then((res) => {
                    const response = res.data;
                    if(response.status === 'done'){
                        let cartArray = [];
                        response.cart.map((item, counter) => {
                            cartArray.push({ 
                                productId: item.productId, 
                                productPackId: item.productPackId, 
                                name: item.productName, 
                                categoryId: item.categoryId, 
                                prodID: item.prodID, 
                                url: item.productUrl, 
                                count: item.productCount, 
                                unitCount: item.productUnitCount, 
                                unitName: item.productUnitName, 
                                label: item.productLabel, 
                                basePrice: item.productBasePrice, 
                                price: item.productPrice, 
                                discountedPrice: item.discountedPrice, 
                                discountPercent: item.discountPercent 
                            });
                        });
                        props.reduxUpdateCart(cartArray);
                    }
                }).catch((error) => {
                    console.log(error);
                    alert('مشکل در برقراری ارتباط');
                })
            }
        }
    }, [props.reduxUser.status, 'NI']);

    const receiveData = () => {
        axios.post(Constants.apiUrl + '/api/search-products', {
            category: router.query.query,
            page: 1,
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                setResults(response.result[0].properties);
                setPages(response.result[0].totalPage);
            }
            console.log(response);
        }).catch((err) => {
            console.log(err);

        });
    }

    const paginationChanged = (event, page) =>{
        setP(page);
        getNewProducts({page: page});
    }

    const paginationNextButtonClicked = () => {
        if(p !== pages){
            getNewProducts({page: p + 1});
            setP(p + 1);
        }
    }

    const paginationPrevButtonClicked = () => {
        if(p !== 1){
            getNewProducts({page: p - 1});
            setP(p - 1);
        }
    }

    const getNewProducts = (obj) => {
        let page = p;
        if(obj.page !== undefined){
            page = obj.page;
        }
        axios.post(Constants.apiUrl + '/api/search-products', {
            category: router.query.query,
            page: page,
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                setResults(response.result[0].properties);
                setPages(response.result[0].totalPage);
            }
            console.log(response);
        }).catch((err) => {
            console.log(err);
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
        });
    }

    const noResultFound = () => {
        return (
            <div className={['container'].join(' ')}>
                <div className={['row', 'px-6', 'mt-2', 'mt-md-5', 'rtl', 'align-items-center', 'justify-content-center'].join(' ')}>
                    <h6 className={['col-12', 'text-right', 'rtl', 'mb-0', 'mt-3', 'd-md-none', 'font17md22'].join(' ')} style={{color: '#00BAC6'}}>{" متاسفانه محصولی مطابق \"" + router.query.query + "\" پیدا نکردیم"}</h6>
                    <div className={['col-8', 'd-none', 'd-md-block'].join(' ')}>
                        <h6 className={['text-right', 'rtl', 'font17md22'].join(' ')} style={{color: '#00BAC6'}}>{" متاسفانه محصولی مطابق \"" + router.query.query + "\" پیدا نکردیم"}</h6>
                        <div className={['d-flex', 'flex-row', 'rtl', 'text-right', 'align-items-center', 'mt-5'].join(' ')}>
                            <img src={Constants.baseUrl + '/assets/images/main_images/circle_main_super_small.png'} style={{width: '10px', height: '10px'}} />
                            <h6 className={['font17md22', 'mb-0', 'pr-2'].join(' ')} style={{color: '#00BAC6'}}>املای عبارت وارد شده را بررسی کنید.</h6>
                        </div>
                        <div className={['d-flex', 'flex-row', 'rtl', 'text-right', 'align-items-center', 'mt-3'].join(' ')}>
                            <img src={Constants.baseUrl + '/assets/images/main_images/circle_main_super_small.png'} style={{width: '10px', height: '10px'}} />
                            <h6 className={['font17md22', 'mb-0', 'pr-2'].join(' ')} style={{color: '#00BAC6'}}>از عبارت‌های متداول تر استفاده کنید.</h6>
                        </div>
                        <div className={['d-flex', 'flex-row', 'rtl', 'text-right', 'align-items-center', 'mt-3'].join(' ')}>
                            <img src={Constants.baseUrl + '/assets/images/main_images/circle_main_super_small.png'} style={{width: '10px', height: '10px'}} />
                            <h6 className={['font17md22', 'mb-0', 'pr-2'].join(' ')} style={{color: '#00BAC6'}}>میتوانید از کلمات مشابه یا هم‌معنی استفاده کنید.</h6>
                        </div>
                    </div>
                    <div className={['col-12', 'col-md-4', 'px-5', 'px-md-0', 'mt-3', 'mt-md-0'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/search_result_not_found_main.png'} className={[''].join(' ')} style={{width: '100%'}} />
                    </div>
                    <div className={['col-12', 'd-md-none'].join(' ')}>
                        <div className={['d-flex', 'flex-row', 'rtl', 'text-right', 'align-items-center', 'mt-5'].join(' ')}>
                            <img src={Constants.baseUrl + '/assets/images/main_images/circle_main_super_small.png'} style={{width: '10px', height: '10px'}} />
                            <h6 className={['font17md22', 'mb-0', 'pr-2'].join(' ')} style={{color: '#00BAC6'}}>املای عبارت وارد شده را بررسی کنید.</h6>
                        </div>
                        <div className={['d-flex', 'flex-row', 'rtl', 'text-right', 'align-items-center', 'mt-3'].join(' ')}>
                            <img src={Constants.baseUrl + '/assets/images/main_images/circle_main_super_small.png'} style={{width: '10px', height: '10px'}} />
                            <h6 className={['font17md22', 'mb-0', 'pr-2'].join(' ')} style={{color: '#00BAC6'}}>از عبارت‌های متداول تر استفاده کنید.</h6>
                        </div>
                        <div className={['d-flex', 'flex-row', 'rtl', 'text-right', 'align-items-center', 'mt-3'].join(' ')}>
                            <img src={Constants.baseUrl + '/assets/images/main_images/circle_main_super_small.png'} style={{width: '10px', height: '10px'}} />
                            <h6 className={['font17md22', 'mb-0', 'pr-2'].join(' ')} style={{color: '#00BAC6'}}>میتوانید از کلمات مشابه یا هم‌معنی استفاده کنید.</h6>
                        </div>
                    </div>
                    <div className={['col-12', 'd-flex', 'flex-row', 'justify-content-center', 'mt-4'].join(' ')}>
                        <Link href={'/'}><a className={['text-center', 'px-5', 'py-2'].join(' ')} style={{background: '#00BAC6', color: 'white', border: 'none', outlineStyle: 'none'}}>بازگشت به صفحه‌ی اصلی</a></Link>
                    </div>
                </div>

            </div>
        );
    }

    const showResults = () => {
        return (
            <div className={['container'].join(' ')} style={{overflowX: 'hidden '}}>
                <div className={['row'].join(' ')}>
                    <div className={['col-12', 'px-2', 'text-right', 'rtl', 'd-none', 'flex-row', 'align-items-center'].join(' ')}>
                        <span className={['rtl', 'text-right', 'px-1'].join(' ')}>فیلترهای اعمال شده :</span>
                        <span className={['d-flex', 'flex-row'].join(' ')}>
                        {
                            addedFilters.map((f, index)=>{
                                    console.log(addedFilters);
                                    return(
                                        <div key={index} className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'ml-2', 'p-1'].join(' ')} style={{borderRadius: '4px', border: '1px solid #dedede', backgroundColor: '#f2f2f2'}}>
                                            <img src="/assets/images/main_images/cross_gray_small.png" style={{width: '14px'}} onClick={()=>{deleteFilter(index)}} />
                                            <span className={['pr-1', 'mr-1'].join(' ')} style={{fontSize: '13px', borderRight: '1px dashed #757575'}}>{f.value}</span>
                                        </div>
                                    );
                            })
                        }
                        </span>
                        <span className={['d-flex', 'flex-row', 'rtl'].join(' ')} style={{backgroundColor: '#f2f2f2', borderRadius: '4px', border: '1px solid #dedede'}}></span>
                    </div>
                    <div className={['row', 'd-flex', 'align-items-stretch', 'px-3'].join(' ')}>
                        <div className={['col-12', 'd-flex', 'flex-row', 'text-right', 'rtl', 'align-items-center', 'mt-3', 'mb-1'].join(' ')}>
                            <img src={Constants.baseUrl + '/assets/images/main_images/search_black.png'} style={{width: '17px', height: '17px'}} />
                            <h2 className={['mb-0', 'pr-2'].join(' ')} style={{fontSize: '17px'}}>{'نتایج جستجو برای عبارت : ' + router.query.query}</h2>
                        </div>
                    {
                        results.map((r, key)=>{
                            return(
                                <SearchProductcard information={r} key={key} />
                            );
                        })
                    }
                    </div>
                    {
                        results.length !== 0 
                        ?
                        <div className={['col-12', 'd-flex', 'flex-row', 'justify-content-center', 'align-items-center', 'mt-2', 'rtl'].join(' ')}>
                            <button className={['d-flex', 'flex-row', 'align-items-center', 'pointer', 'px-3', 'shadow-sm', 'rtl'].join(' ')} onClick={paginationPrevButtonClicked} style={{outlineStyle: 'none', borderRadius: '4px', border: '1px solid #dedede', backgroundColor: 'white', paddingTop: '0.37rem', paddingBottom: '0.37rem'}}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/right_arrow_black.png'} style={{width: '8px', height: '8px'}} />
                                <span className={['pr-1', 'font-weight-bold'].join(' ')} style={{fontSize: '13px'}}>قبلی</span>
                            </button>
                            <div className={['text-right', 'rtl', 'd-none', 'd-md-block'].join(' ')}><Pagination count={pages} shape='rounded' onChange={paginationChanged} page={p} hideNextButton={true} hidePrevButton={true} /></div>
                            <span className={['d-block', 'd-md-none', 'px-3', 'rtl'].join(' ')}>{ p + '  از  ' + pages}</span>
                            <button className={['d-flex', 'flex-row', 'align-items-center', 'pointer', 'px-3', 'ltr', 'shadow-sm'].join(' ')} onClick={paginationNextButtonClicked} style={{outlineStyle: 'none', borderRadius: '4px', border: '1px solid #dedede', backgroundColor: 'white', paddingTop: '0.37rem', paddingBottom: '0.37rem'}}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_black.png'} style={{width: '8px', height: '8px'}} />
                                <span className={['pl-1', 'font-weight-bold'].join(' ')} style={{fontSize: '13px'}}>بعدی</span>
                            </button>
                        </div>
                        :
                        null
                    }
                </div>
            </div>
        );
    }


    return (
        <React.Fragment>
            <Head>
                <title>نتایج جستجو</title>
                <link rel="icon" href={ Constants.baseUrl + "/favicon.ico"} type="image/x-icon"/>
            </Head>
            <Header menu={props.ssrMenu} />  
            {
                results.length !== 0
                ?
                showResults()
                :
                noResultFound()
            }
            <Footer />
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        reduxUser: state.user,
        reduxCart: state.cart,
        reduxLoad: state.loading,
        reduxCategoryFilter: state.categoryFilter,
        reduxSearchFilter: state.searchFilter
    };
}

const mapDispatchToProps = (dispatch) => {
    return{
        reduxUpdateCart: (d) => dispatch({type: actionTypes.UPDATE_CART, data: d}),
        reduxAddToCart: (d) => dispatch({type: actionTypes.ADD_TO_CART, data: d}),
        reduxIncreaseCountByOne: (d) => dispatch({type: actionTypes.INCREASE_COUNT_BY_ONE, productPackId: d}),
        reduxDecreaseCountByOne: (d) => dispatch({type: actionTypes.DECREASE_COUNT_BY_ONE, productPackId: d}),
        reduxRemoveFromCart: (d) => dispatch({type: actionTypes.REMOVE_FROM_CART, productPackId: d}),
        reduxWipeCart: () => dispatch({type: actionTypes.WIPE_CART}),
        reduxUpdateUserTotally: (d) => dispatch({type: actionTypes.UPDATE_USER_TOTALLY, data: d}),
        reduxStopLoading: () => dispatch({type: actionTypes.STOP_LOADING}),
        reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t}),
        reduxUpdateCategoryFilterId: (id) => dispatch({type: actionTypes.UPDATE_CATEGORY_FILTER_ID, id: id}),
        reduxUpdateCategoryFilterPriceMargin: (min, max) => dispatch({type: actionTypes.UPDATE_CATEGORY_FILTER_PRICE, minPrice: min, maxPrice: max}),
        reduxUpdateCategoryFilterOrder: (o) => dispatch({type: actionTypes.UPDATE_CATEGORY_FILTER_ORDER, order: o}),
        reduxUpdateCategoryFilterPage: (p) => dispatch({type: actionTypes.UPDATE_CATEGORY_FILTER_PAGE, page: p}),
        reduxUpdateCategoryFilterMaxPage: (p) => dispatch({type: actionTypes.UPDATE_CATEGORY_FILTER_MAX_PAGE, maxPage: p}),
        reduxAddToCategoryFilterOptions: (en, v) => dispatch({type: actionTypes.ADD_CATEGORY_FILTER_OPTION, en_name: en, value: v}),
        reduxRemoveFromCategoryFilterOptions: (en, v) => dispatch({type: actionTypes.REMOVE_CATEGORY_FILTER_OPTION, en_name: en, value: v}) ,
        reduxUpdateCategoryFilterResults: (r) => dispatch({type: actionTypes.UPDATE_CATEGORY_FILTER_RESULTS, results: r}),
        reduxUpdateCategoryFilterKey: (k) => dispatch({type: actionTypes.UPDATE_CATEGORY_FILTER_KEY, key: k}),
        reduxWipeCategoryFilterTotally: () => dispatch({type: actionTypes.WIPE_CATEGORY_FILTER}),
        reduxUpdateSearchFilterFacets: (f) => dispatch({type: actionTypes.UPDATE_SEARCH_FILTER_FACETS, facets: f}),
        reduxAddSearchFilterFacet: (f) => dispatch({type: actionTypes.ADD_SEARCH_FILTER_FACET, facet: f}),
        reduxRemoveSearchFilterFacet: (f) => dispatch({type: actionTypes.REMOVE_SEARCH_FILTER_FACET, facet: f}),
        reduxWipeSearchFilterFacets: () => dispatch({type: actionTypes.WIPE_SEARCH_FILTER_FACETS}),
        reduxUpdateSearchFilterResults: (r) => dispatch({type: actionTypes.UPDATE_SEARCH_FILTER_RESULTS, results: r}),
        reduxUpdateSearchFilterPage: (p) => dispatch({type: actionTypes.UPDATE_SEARCH_FILTER_PAGE, page: p}),
        reduxUpdateSearchFilterMaxPages: (m) => dispatch({type: actionTypes.UPDATE_SEARCH_FILTER_MAX_PAGES, maxPage: m}),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);

export async function getServerSideProps(context){
    const m = await fetch(Constants.apiUrl + '/api/menu', {
        method: 'GET'
    });
    let menu = await m.json();
    if(context.req.cookies.user_server_token !== undefined){
        const res = await fetch(Constants.apiUrl + '/api/user-information',{
            method: 'POST',
            headers: new Headers(
                {
                    'Authorization': 'Bearer ' + context.req.cookies.user_server_token
                }
            )
        });
        let response = await res.json();
        if(await response.status === 'done' && await response.found === true){
            return {
                props: {
                    ssrUser: {status: 'LOGIN', information: await response.information},
                    ssrCookies: context.req.cookies,
                    ssrMenu: await menu
                }
            }
        }else{
            return {
                props: {
                    ssrUser: {status: 'GUEST', information: {}},
                    ssrCookies: context.req.cookies,
                    ssrMenu: await menu
                }
            }
        }
        
    }else{
        console.log("DOES NOT HAVE ANY COOKIES");
        return{
            props: {
                ssrUser: {status: 'GUEST', information: {}},
                ssrCookies: context.req.cookies,
                ssrMenu: await menu
            }
        };
    }
}
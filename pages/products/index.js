import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Head from 'next/head';
import * as Constants from '../../components/constants';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';
import ProductCard from '../../components/ProductCard/ProductCard';
import Pagination from '@material-ui/lab/Pagination';


const Products = (props) => {

    const [products, setProducts] = useState([]);
    const [p, setP] = useState(1);
    const [maxPage, setMaxPage] = useState(0);

    useEffect(() => {
        axios.post(Constants.apiUrl + '/api/filtered-paginated-new-products', {
            page: 1
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                if(response.found === true){
                    setMaxPage(Math.ceil(response.count / 12));
                    setProducts(response.products);
                }else{
                    setP(1);
                    setMaxPage(0);
                    setProducts([]);
                }
            }else if(response.status === 'failed'){
                console.warn(response.message);
                props.reduxUpdateSnackbar('warning', true, response.umessage);
                setProducts([]);
            }
        }).catch((error) => {
            console.error(error);
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
        });
    }, []);

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

    const getNewProducts = (obj) => {
        let page = p;
        if(obj.page !== undefined){
            page = obj.page;
        }
        axios.post(Constants.apiUrl + '/api/filtered-paginated-new-products', {
            page: page,
        }).then((res) => {
            let response = res.data;
            if(response.status == 'done'){
                if(response.found === true){
                    setMaxPage(Math.ceil(response.count / 12));
                    setProducts(response.products);
                }else{
                    setP(1);
                    setMaxPage(0);
                    setProducts([]);
                }
            }else if(response.status === 'failed'){
                console.warn(response.message);
                props.reduxUpdateSnackbar('warning', true, response.umessage);
                setProducts([]);
            }
        }).catch((error) => {
            console.error(error);
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
        });
    }

    const paginationChanged = (event, page) =>{
        setP(page);
        getNewProducts({page: page});
    }

    const paginationNextButtonClicked = () => {
        if(p !== maxPage){
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

    return (
        <React.Fragment>
            <Head>
                <title>تمام محصولات جدید | هنری</title>
                <link rel="icon" href={ Constants.baseUrl + "/favicon.ico"} type="image/x-icon"/>
            </Head>
            <Header menu={props.ssrMenu} />  
                <div className={['container'].join(' ')}>
                    <div className={['row'].join(' ')}>
                        <h2 className={['col-12', 'mb-0', 'mt-3', 'mb-1', 'rtl', 'text-right', 'font17md22'].join(' ')} style={{}}><b>محصولات جدید</b></h2>
                    </div>
                    <div className={['row', 'rtl'].join(' ')}>
                        {
                            products.map((product, count) => {
                                return (
                                    <ProductCard information={product} key={count} />
                                );
                            })
                        }
                    </div>
                    <div className={['row'].join(' ')}>
                        {
                            products.length !== 0 
                            ?
                            <div className={['col-12', 'd-flex', 'flex-row', 'justify-content-center', 'align-items-center', 'mt-2', 'rtl'].join(' ')}>
                                <button className={['d-flex', 'flex-row', 'align-items-center', 'pointer', 'px-3', 'shadow-sm'].join(' ')} onClick={paginationPrevButtonClicked} style={{outlineStyle: 'none', borderRadius: '4px', border: '1px solid #dedede', backgroundColor: 'white', paddingTop: '0.37rem', paddingBottom: '0.37rem'}}>
                                    <img src={Constants.baseUrl + '/assets/images/main_images/right_arrow_black.png'} style={{width: '8px', height: '8px'}} />
                                    <span className={['pr-1', 'font-weight-bold'].join(' ')} style={{fontSize: '13px'}}>قبلی</span>
                                </button>
                                <div className={['text-right', 'rtl', 'd-none', 'd-md-block'].join(' ')}><Pagination count={maxPage} shape='rounded' onChange={paginationChanged} page={p} hideNextButton={true} hidePrevButton={true} /></div>
                                <span className={['d-block', 'd-md-none', 'px-3'].join(' ')}>{ p + '  از  ' + maxPage}</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(Products);

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
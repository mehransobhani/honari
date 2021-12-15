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

const SearchWithCategory = (props) => {

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
    const [pages, setPages] = useState(12);
    const [filters, setFilters] = useState([]);
    const [filterMinPrice, setFilterMinprice] = useState(0);
    const [filterMaxPrice, setFilterMaxPrice] = useState(0);
    const [recentlyDeletedFilter, setRecentlyDeletedFilter] = useState({});
    const [phoneFilterOpenStatus, setPhoneFilterOpenStatus] = useState(false);
    const [visibleFilterGroupId, setVisibleFilterGroupId] = useState(-1);
    const [windowHeight, setWindowHeight] = useState(0);

    const [category, setCategory] = useState('');
    const [facets, setFacets] = useState([]);


    const filterDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ bottom: open });
    };

    useEffect(() => {
        if(router.query.query !== undefined){
            setWindowHeight(window.outerHeight);
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
        axios.post(Constants.apiUrl + '/api/search-with-category', {
            category: router.query.query,
            page: 1,
            facets: []
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                console.info(response.result.facets);
                setFilters(response.result.facets);
                props.reduxUpdateSearchFilterResults(response.result.properties);
                props.reduxUpdateSearchFilterMaxPages(response.result.totalPage);
            }
            console.log(response);
        }).catch((err) => {
            console.log(err);

        });
    }

    const checkFacetExistance = (item) => {
        let found = false;
        props.reduxSearchFilter.facets.map((f, i) => {
            if(f.name === item.name){
                f.values.map((v, c) => {
                    if(v == item.value){
                        found = true;
                    }
                });
            }
        });
        return found;
    }

    const newAddedFacet = (item) => {
        let newFacets = [];
        let added = false;
        props.reduxSearchFilter.facets.map((f, i) => {
            if(f.name === item.name){
                let newValues = f.values;
                newValues.push(item.value);
                added = true;
                newFacets.push({name: f.name, min: f.min, max: f.max, values: newValues});
            }else{
                newFacets.push(f);
            }
        });
        if(!added){
            newFacets.push({name: item.name, min: item.min, max: item.max, values: [item.value]});
        }
        return newFacets;
    }

    const newRemovedFacet = (item) => {
        let newFacets = [];
        props.reduxSearchFilter.facets.map((f, i) => {
            if(f.name === item.name){
                let newValues = [];
                f.values.map((v, c) => {
                    if(v !== item.value){
                        newValues.push(v);
                    }
                });
                if(newValues.length !== 0){
                    newFacets.push({name: f.name, min: f.min, max: f.max, values: newValues});
                }
            }else{
                newFacets.push({name: f.name, min: f.min, max: f.max, values: f.values});
            }
        });
        return newFacets;
    }

    const filterCheckboxChanged = (item) => {
        let newFacets = [];
        if(checkFacetExistance(item)){
            newFacets = newRemovedFacet(item);
        }else{
            newFacets = newAddedFacet(item);
        }
        console.error(newFacets);
        props.reduxUpdateSearchFilterFacets(newFacets);
        getNewProducts({facets: newFacets});
    }

    const isTheCheckboxSelected = (item) => {
        return checkFacetExistance(item);
        /*let found = false;
        props.reduxSearchFilter.facets.map((f, i) => {
            if(f.name === item.name){
                f.values.map((v, c) => {
                    if(v === item.value){
                        found = true;
                    }
                });
            }
        });
        return found;*/
    }

    const updatedFacetsWithPrice = (min, max) => {
        let newFacets = [];
        props.reduxSearchFilter.facets.map((f, i) => {
            if(f.name === 'product_price'){
                newFacets.push({name: 'product_price', min: min, max: max, values: []});
            }else{
                newFacets.push(f);
            }
        });
        return newFacets;
    }

    const getNewProducts = (obj) => {
        let page = props.reduxSearchFilter.page;
        let facets = props.reduxSearchFilter.facets;
        if(obj.page !== undefined){
            page = obj.page;
        }
        if(obj.facets !== undefined){
            facets = obj.facets;
        }
        let i = 0;
        for(i; i< facets.length; i++){
            if(facets[i].name === 'product_price'){
                break;
            }
        }
        if(facets[i].min == 0 && facets[i].max == 0){
            facets[i].min = null;
            facets[i].max = null;
        }
        axios.post(Constants.apiUrl + '/api/search-with-category', {
            category: router.query.query,
            page: page,
            facets: facets
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                props.reduxUpdateSearchFilterMaxPages(response.result.totalPage);
                props.reduxUpdateSearchFilterResults(response.result.properties);
            }else if(response.status === 'failed'){
                props.reduxUpdateSnackbar('warning', true, response.umessage);
            }
        }).catch((err) => {
            console.error(err);
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
        });
    }

    const phoneWipeAllFacets = () => {
        let priceFacet = [{name: 'product_price', min: null, max: null, values: []}];
        props.reduxUpdateSearchFilterFacets(priceFacet);
        getNewProducts({facets: priceFacet})
        filterDrawer('bottom', false);
    }

    const phoneFilter = (
        <div className={['container'].join(' ')} style={{height: windowHeight}}>
            <div className={['row'].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'rtl', 'pt-3', 'pb-0', 'px-3'].join(' ')}>
                    <h6 className={['mb-0'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>فیلترها</h6>
                    <img src={Constants.baseUrl + '/assets/images/main_images/cross_black.png'} onClick={filterDrawer('bottom', false)} style={{width: '17px', height: '17px'}}/>
                </div>
            </div>
            {
                filters.map((filter, key)=>{
                    if(filter.name !== 'product_price' && filter.name !== 'has_stock'){
                        //return <CheckboxGroup information={filter} filterUpdated={filterItemUpdated} key={key} deletedFilter={recentlyDeletedFilter} />;
                        return(
                            <div className={['rtl', 'text-right', 'py-3', 'px-1'].join(' ')} style={{borderBottom: '1px solid #D8D8D8'}}>
                                <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer'].join(' ')} onClick={() => {key === visibleFilterGroupId ?  setVisibleFilterGroupId(-1) : setVisibleFilterGroupId(key)}}>
                                    <h6 className={['mb-0']} style={{fontSize: '13px', color: '#444444'}}>{filter.name}</h6>
                                    <img src={key === visibleFilterGroupId ? '/assets/images/main_images/minus_black.png' : '/assets/images/main_images/plus_black.png'} style={{width: '14px', heigth: '14px'}} />
                                </div>
                                <div hidden={key === visibleFilterGroupId ? false : true} className={['mt-2', 'pr-3'].join(' ')} style={{overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: '#dedede, #dedede'}}>
                                    {
                                        filter.values.map((option, index)=>{
                                            return(
                                                <div key={index}>
                                                    <input type='checkbox' className={[''].join(' ')} value={option.value} checked={isTheCheckboxSelected({name: filter.name, min: filter.min, max: filter.max, value: option.value})} onChange={() => {filterCheckboxChanged({name: filter.name, min: filter.min, max: filter.max, value: option.value})}} />
                                                    <label className={['mr-1', 'mb-1'].join(' ')} style={{fontSize: '13px', color: '#444444'}} >{option.value}</label>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        );
                    }
                })
            }
            <div className={['d-flex', 'flex-column', 'w-100', 'px-3'].join(' ')} style={{bottom: '0', right: '0', display: 'hidden'}}>
                <button className={['py-2', 'text-center', 'pointer'].join(' ')} style={{fontSize: '14px', color: 'white', background: 'white', borderRadius: '2px', border: 'none', outline: 'none'}}>-</button>
                <button className={['py-3', 'text-center', 'pointer'].join(' ')} style={{fontSize: '14px', color: 'white', background: 'white', border: 'none', outline: 'none'}}>-</button>
            </div>
            <div className={['d-flex', 'flex-column', 'w-100', 'px-3'].join(' ')} style={{position: 'fixed', bottom: '0', right: '0'}}>
                <button className={['py-2', 'text-center', 'pointer'].join(' ')} style={{fontSize: '14px', color: '#00BAC6', background: 'white', borderRadius: '2px', border: '1px solid #00BAC6'}} onClick={filterDrawer('bottom', false)}>اعمال فیلترها</button>
                <button className={['py-3', 'text-center', 'pointer'].join(' ')} style={{fontSize: '14px', color: '#02959F', background: 'white', border: 'none', outline: 'none'}} onClick={phoneWipeAllFacets}>پاک‌کردن همه فیلترها</button>
            </div>
        </div>
    );

    const minPriceChanged = (event) => {
        let value = parseInt(event.target.value);
        if(value <= 0 || value == ''){
            setFilterMinprice(0);
        }else{
            setFilterMinprice(event.target.value);
        }
    }

    const maxPriceChanged = (event) => {
        let value = parseInt(event.target.value);
        if(value <= 0 || value == ''){
            setFilterMaxPrice(0);
        }else{
            setFilterMaxPrice(value);
        }
    }

    const paginationChanged = (event, page) =>{
        props.reduxUpdateSearchFilterPage(page);
        getNewProducts({page: page});
    }

    const paginationNextButtonClicked = () => {
        if(props.reduxSearchFilter.page !== props.reduxSearchFilter.maxPage){
            props.reduxUpdateSearchFilterPage(props.reduxSearchFilter.page + 1);
            getNewProducts({page: props.reduxSearchFilter.page + 1});
        }
    }

    const paginationPrevButtonClicked = () => {
        if(props.reduxSearchFilter.page !== 1){
            let b = props.reduxUpdateSearchFilterPage(props.reduxSearchFilter.page - 1);
            getNewProducts({page: props.reduxSearchFilter.page - 1});
        }
    }

    const priceFilterButtonClicked = () => {
        let newFacet = updatedFacetsWithPrice(filterMinPrice, filterMaxPrice);
        props.reduxUpdateSearchFilterFacets(newFacet);
        getNewProducts({facets: newFacet});
        //props.reduxUpdateCategoryFilterPriceMargin(filterMinPrice, filterMaxPrice);
        //getNewProducts({page: 1, minPrice: filterMinPrice, maxPrice: filterMaxPrice});
    }

    const sortByMenuChanged = (event) => {
        if(props.reduxCategoryFilter.order !== event.target.value){
            props.reduxUpdateCategoryFilterPage(1);
            props.reduxUpdateCategoryFilterOrder(event.target.value);
            getNewProducts({page: 1, order: event.target.value});
        }
    }

    return(
        <React.Fragment>
            <Drawer anchor="bottom" open={state['bottom']} onClose={filterDrawer('bottom', false)}>
                {phoneFilter}
            </Drawer>
            <Header />
            <div className={['container'].join(' ')} style={{overflowX: 'hidden'}}>
                <div className={['row', 'rtl', 'mt-3'].join(' ')}>
                    {
                        categoryBanners.map((cb, key)=>{
                            let categoryUrl = cb.url;
                            return(
                                <div className={['col-4', 'p-2'].join(' ')} key={key}>
                                    <Link href={categoryUrl.substring(18)}>
                                        <a className={['w-100', 'd-flex', 'flex-column', 'shadow-sm', 'pointer'].join(' ')} style={{borderRadius: '4px', border: '1px solid #dedede'}}>
                                            <img src={cb.image} className={['w-100'].join(' ')} />
                                            <h6 className={['py-3', 'text-center', 'mb-0'].join(' ')}>{cb.title}</h6>
                                        </a>
                                    </Link>
                                </div>
                            );
                        })
                    }
                </div>
                <div className={['col-12', 'd-flex', 'flex-row', 'text-right', 'rtl', 'align-items-center', 'mt-3', 'mb-1'].join(' ')}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/search_black.png'} style={{width: '17px', height: '17px'}} />
                    <h2 className={['mb-0', 'pr-2'].join(' ')} style={{fontSize: '17px'}}>{'نتایج جستجو برای عبارت : ' + router.query.query}</h2>
                </div>
                <div className={['d-flex', 'flex-column', 'd-md-none', 'align-items-center', 'justify-content-center', 'rtl'].join(' ')}>
                    <h6 className={['mb-0', 'text-right'].join(' ')} style={{width: '100%'}}>{categoryName}</h6>
                    <div className={['d-flex', 'flex-row', 'rtl', 'py-2', 'px-3', 'mt-3', 'align-items-center', 'justify-content-center', 'w-100', 'pointer'].join(' ')} onClick={filterDrawer('bottom', true)} style={{color: '#00bac6', borderRadius: '4px', border: '2px solid #00bac6'}}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/filter_main.png'} style={{width: '17px', height: '17px'}} />
                        <span className={['mr-2', 'font-weight-bold'].join(' ')} style={{color: '#00bac6', fontSize: '14px'}}>فیلترها</span> 
                    </div>
                </div>
                <div className={['row', 'rtl', 'mt-2'].join(' ')}>
                    <div className={['d-none', 'd-md-block', 'mr-2', 'ml-2'].join(' ')} style={{flex: '1'}}>
                        <h1 className={['text-right', 'mb-3'].join(' ')} style={{fontSize: '26px', fontWeight: 'bold'}}>{categoryName}</h1>
                        <div className={['rtl'].join(' ')} style={{borderRadius: '4px'}}>
                            <div className={['d-flex', 'flex-row', 'align-items-center', 'p-3'].join(' ')}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/filter_black.png'} style={{width: '13px'}} />
                                <span className={['font-weight-bold','mr-2'].join(' ')} style={{fontSize: '14px'}} >فیلتر کردن محصولات</span>
                            </div>
                                {
                                    filters.map((filter, key)=>{
                                        if(filter.name !== 'product_price' && filter.name !== 'has_stock'){
                                            //return <CheckboxGroup information={filter} filterUpdated={filterItemUpdated} key={key} deletedFilter={recentlyDeletedFilter} />;
                                            return(
                                                <div className={['rtl', 'text-right', 'p-3'].join(' ')} style={{borderBottom: '1px solid #dedede'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer'].join(' ')} onClick={() => {key === visibleFilterGroupId ?  setVisibleFilterGroupId(-1) : setVisibleFilterGroupId(key)}}>
                                                        <h6 className={['mb-0']} style={{fontSize: '13px', color: '#444444'}}>{filter.name}</h6>
                                                        <img src={key === visibleFilterGroupId ? '/assets/images/main_images/minus_black.png' : '/assets/images/main_images/plus_black.png'} style={{width: '14px', heigth: '14px'}} />
                                                    </div>
                                                    <div hidden={key === visibleFilterGroupId ? false : true} className={['mt-2'].join(' ')} style={{maxHeight: '200px', overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: '#dedede, #dedede'}}>
                                                        {
                                                            filter.values.map((option, index)=>{
                                                                return(
                                                                    <div key={index}>
                                                                        <input type='checkbox' className={[''].join(' ')} value={option.value} checked={isTheCheckboxSelected({name: filter.name, min: filter.min, max: filter.max, value: option.value})} onChange={() => {filterCheckboxChanged({name: filter.name, min: filter.min, max: filter.max, value: option.value})}} />
                                                                        <label className={['mr-1', 'mb-1'].join(' ')} style={{fontSize: '14px'}} >{option.value}</label>
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })
                                }
                                  <div className={['rtl', 'text-right', 'p-3'].join(' ')} style={{borderBottom: '1px solid #dedede'}}>
                                <h6 className={['font-weight-bold', 'text-right'].join(' ')}>قیمت</h6>
                                <div className={['row', 'w-100','px-0', 'mx-0', ].join(' ')}>
                                    <div className={['col-6', 'pr-0', 'pl-2'].join(' ')}>
                                        <small>از (تومان)</small>
                                        <input type='number' className={['form-control', 'font-weight-bold'].join(' ')} value={filterMinPrice} style={{fontSize: '13px'}} onChange={minPriceChanged} />
                                    </div>
                                    <div className={['col-6', 'pl-0', 'pr-2'].join(' ')}>
                                        <small>تا (تومان)</small>
                                        <input type='number' className={['form-control', 'font-weight-bold'].join(' ')} value={filterMaxPrice} style={{fontSize: '13px'}} onChange={maxPriceChanged} />
                                    </div>
                                </div>
                                <button className={['btn', 'mt-3'].join(' ')} style={{borderRadius: '4px', color: 'white', backgroundColor: '#00bac6', fontSize: '14px'}} onClick={priceFilterButtonClicked}>اعمال فیلتر قیمت</button>
                            </div>
                        </div>
                    </div>
                    <div className={[''].join(' ')} style={{flex: '4'}}>
                        <div className={['container'].join(' ')}>
                            <div className={['row'].join(' ')}>
                                <div className={['col-12', 'd-none'].join(' ')}>
                                        <div>
                                            <p className={['d-inline-block', 'px-2'].join(' ')}>مرتب‌سازی براساس :</p>
                                            <Select
                                                defaultValue={'new'}                 
                                                onChange={sortByMenuChanged}>
                                                <MenuItem value={'new'}><div className={['text-right'].join(' ')} style={{fontSize: '14px'}}>جدیدترین</div></MenuItem>
                                                <MenuItem value={'old'}><div className={['text-right'].join(' ')} style={{fontSize: '14px'}}>قدیمی‌ترین</div></MenuItem>
                                                <MenuItem value={'cheap'}><div className={['text-right'].join(' ')} style={{fontSize: '14px'}}>کمترین قیمت</div></MenuItem>
                                                <MenuItem value={'expensive'}><div className={['text-right'].join(' ')} style={{fontSize: '14px'}}>بیشترین قیمت</div></MenuItem>
                                            </Select>
                                        </div>
                                </div>
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
                                {
                                    props.reduxSearchFilter.results.map((r, key)=>{
                                        return(
                                            <SearchProductcard information={r} key={key} />
                                        );
                                    })
                                }
                                </div>
                                {
                                    props.reduxSearchFilter.results.length !== 0 
                                    ?
                                    <div className={['col-12', 'd-flex', 'flex-row', 'justify-content-center', 'align-items-center', 'mt-2'].join(' ')}>
                                        <button className={['d-flex', 'flex-row', 'align-items-center', 'pointer', 'px-3', 'shadow-sm'].join(' ')} onClick={paginationPrevButtonClicked} style={{outlineStyle: 'none', borderRadius: '4px', border: '1px solid #dedede', backgroundColor: 'white', paddingTop: '0.37rem', paddingBottom: '0.37rem'}}>
                                            <img src={Constants.baseUrl + '/assets/images/main_images/right_arrow_black.png'} style={{width: '8px', height: '8px'}} />
                                            <span className={['pr-1', 'font-weight-bold'].join(' ')} style={{fontSize: '13px'}}>قبلی</span>
                                        </button>
                                        <div className={['text-right', 'rtl', 'd-none', 'd-md-block'].join(' ')}><Pagination count={props.reduxSearchFilter.maxPage} shape='rounded' onChange={paginationChanged} page={props.reduxSearchFilter.page} hideNextButton={true} hidePrevButton={true} /></div>
                                        <span className={['d-block', 'd-md-none', 'px-3'].join(' ')}>{ props.reduxSearchFilter.page + '  از  ' + props.reduxSearchFilter.maxPage}</span>
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
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchWithCategory);

export async function getServerSideProps(context){
    
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
                    ssrCookies: context.req.cookies
                }
            }
        }else{
            return {
                props: {
                    ssrUser: {status: 'GUEST', information: {}},
                    ssrCookies: context.req.cookies
                }
            }
        }
        
    }else{
        console.log("DOES NOT HAVE ANY COOKIES");
        return{
            props: {
                ssrUser: {status: 'GUEST', information: {}},
                ssrCookies: context.req.cookies
            }
        };
    }
}
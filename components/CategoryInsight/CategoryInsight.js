import React, { useState, useEffect } from 'react';
import {useRouter} from 'next/router';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from 'next/link';
import ProductCard from '../ProductCard/ProductCard';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';
import * as Constants from '../constants';
import CheckboxGroup from '../Filters/CheckboxGroup';
import Header from '../Header/Header';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import Image from 'next/image';
import Skeleton from '@mui/material/Skeleton';

const CategoryInsight = (props) => {

    let router = useRouter();
    let url = router.query;
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
    const [pages, setPages] = useState(0);
    const [filters, setFilters] = useState([]);
    const [filterMinPrice, setFilterMinprice] = useState(0);
    const [filterMaxPrice, setFilterMaxPrice] = useState(0);
    const [recentlyDeletedFilter, setRecentlyDeletedFilter] = useState({});
    const [phoneFilterOpenStatus, setPhoneFilterOpenStatus] = useState(false);
    const [visibleFilterGroupId, setVisibleFilterGroupId] = useState(-1);
    const [id, setId] = useState(props.id);
    const [windowHeight, setWindowHeight] = useState(0);
    const [waitingForData, setWaitingForData] = useState(false);
    const [firstTime, setFirstTime] = useState(true);
    const [ssrProducts, setSsrProducts] = useState(true);

    const filterDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ bottom: open });
        setVisibleFilterGroupId(-1);
    };

    useEffect(() => {
        setWindowHeight(window.outerHeight);
        props.reduxWipeCategoryFilterTotally();
    }, []);

    const paginationChanged = (event, page) =>{
        props.reduxUpdateCategoryFilterPage(page);
        getNewProducts({page: page});
    }

    const paginationNextButtonClicked = () => {
        if(props.reduxCategoryFilter.page !== props.reduxCategoryFilter.maxPage){
            props.reduxUpdateCategoryFilterPage(props.reduxCategoryFilter.page + 1);
            getNewProducts({page: props.reduxCategoryFilter.page + 1});
        }
    }

    const paginationPrevButtonClicked = () => {
        if(props.reduxCategoryFilter.page !== 1){
            let b = props.reduxUpdateCategoryFilterPage(props.reduxCategoryFilter.page - 1);
            getNewProducts({page: props.reduxCategoryFilter.page - 1});
        }
    }

    const sortByMenuChanged = (event) => {
        if(props.reduxCategoryFilter.order !== event.target.value){
            props.reduxUpdateCategoryFilterPage(1);
            props.reduxUpdateCategoryFilterOrder(event.target.value);
            getNewProducts({page: 1, order: event.target.value});
        }
    }

    useEffect(()=>{
        setSsrProducts(true);
        props.reduxUpdateCategoryFilterId(props.id);
        axios.post(Constants.apiUrl + '/api/category-filters', {
            id: props.id
        }).then((res)=>{
            let response = res.data;
            if(response.status === 'done' && response.found === true){
                setFilters(response.filters);
            }else if(response.status === 'failed'){
                console.log(response.message)
            }
        }).catch((error)=>{
            console.log(error);
        });
    },[id, props.id]);

    useEffect(()=>{
        if(props.reduxCategoryFilter.id !== -1){
            /*axios.post(Constants.apiUrl + '/api/filtered-paginated-category-products', {
                id: props.id, //props.reduxCategoryFilter.id,
                page: props.reduxCategoryFilter.page,
                order: props.reduxCategoryFilter.order,
                minPrice: props.reduxCategoryFilter.minPrice,
                maxPrice: props.reduxCategoryFilter.maxPrice,
                filters: props.reduxCategoryFilter.options,
                onlyAvailableProducts: props.reduxCategoryFilter.onlyAvailableProducts,
            }).then((res)=>{
                let response = res.data;
                if(response.status === 'done'){
                    setCategoryName(response.categoryName);
                }
                if(response.status === 'done' && response.found === true){
                    props.reduxUpdateCategoryFilterResults(response.products);
                    props.reduxUpdateCategoryFilterMaxPage(Math.ceil(response.count/12));
                    //setVisibleProducts(response.products);
                    //setPages(Math.ceil(response.count/12));
                    //setProductFound(true);
                }else if(response.status === 'failed'){
                    console.warn(response.message);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
                setWaitingForData(false);
            }).catch((error)=>{
                console.error(error);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                setWaitingForData(false);
            });*/
            props.reduxUpdateCategoryFilterResults(props.products);
            props.reduxUpdateCategoryFilterMaxPage(Math.ceil(props.count / 12));
            setWaitingForData(false);
        }
        //[props.reduxCategoryFilter.id, -1]
    },[props.reduxCategoryFilter.id, props.id]);
    /*useEffect(()=>{
        if(props.reduxCategoryFilter.id !== -1){
            axios.post(Constants.apiUrl + '/api/filtered-paginated-category-products', {
                id: props.id, //props.reduxCategoryFilter.id,
                page: props.reduxCategoryFilter.page,
                order: props.reduxCategoryFilter.order,
                minPrice: props.reduxCategoryFilter.minPrice,
                maxPrice: props.reduxCategoryFilter.maxPrice,
                filters: props.reduxCategoryFilter.options,
            }).then((res)=>{
                let response = res.data;
                if(response.status === 'done'){
                    setCategoryName(response.categoryName);
                }
                if(response.status === 'done' && response.found === true){
                    props.reduxUpdateCategoryFilterResults(response.products);
                    props.reduxUpdateCategoryFilterMaxPage(Math.ceil(response.count/12));
                    //setVisibleProducts(response.products);
                    //setPages(Math.ceil(response.count/12));
                    //setProductFound(true);
                }else if(response.status === 'failed'){
                    console.warn(response.message);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
            }).catch((error)=>{
                console.error(error);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            });
        }
        //[props.reduxCategoryFilter.id, -1]
    },[id, props.id]);*/

    /*
    useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/category-banners', {
            id: props.id,
        }).then((res)=>{
            let response = res.data;
            if(response.status === 'done'){
                if(response.found === true){
                    setCategoryBanners(response.banners);
                }else{
                    console.log('This category does not have any banner');
                }
            }else if(response.status === 'failed'){
                console.log(response.message);
            }
        }).catch((error)=>{
            console.log(error);
        });
    },[id, props.id]);
    */

    /*
    useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/category-breadcrumb',{
            id: props.id,
        }).then((res)=>{
            let response = res.data;
            if(response.status === 'done'){
                setCategoryBreadcrumbs(response.categories);
            }else{
                console.log(response.message);
            }
        }).catch((error)=>{
            console.log(error);
        });
    }, [id, props.id]);
    */

    const getNewProducts = (obj) => {
        setSsrProducts(false);
        let page = obj.page;
        let order = obj.order;
        let filters = obj.filters;
        let key = obj.key;
        let min = obj.minPrice;
        let max = obj.maxPrice;
        let onlyAvailableProducts = obj.onlyAvailableProducts;
        if(page === undefined){
            page = props.reduxCategoryFilter.page;
        }
        if(order === undefined){
            order = props.reduxCategoryFilter.order;
        }
        if(filters === undefined){
            filters = props.reduxCategoryFilter.options;
        }
        if(key === undefined){
            key = props.reduxCategoryFilter.key;
        }
        if(min === undefined){
            min = props.reduxCategoryFilter.minPrice;
        }
        if(max === undefined){
            max = props.reduxCategoryFilter.maxPrice;
        }
        if(onlyAvailableProducts === undefined){
            onlyAvailableProducts = props.reduxCategoryFilter.onlyAvailableProducts;
        }
        setWaitingForData(true);
        axios.post(Constants.apiUrl + '/api/filtered-paginated-category-products', {
            id: props.reduxCategoryFilter.id,
            page: page,//props.reduxCategoryFilter.page,
            order: order,//props.reduxCategoryFilter.order,
            searchInput: key,
            minPrice: min,
            maxPrice: max,
            filters: filters,
            onlyAvailableProducts: onlyAvailableProducts,
        }).then((res)=>{
            let response = res.data;
            if(response.status === 'done'){
                props.reduxUpdateCategoryFilterMaxPage(Math.ceil(response.count/12));
                props.reduxUpdateCategoryFilterResults(response.products);
                /*if(response.products.length === 0){
                    props.reduxUpdateCategoryFilterResults([]);
                    props.reduxUpdateCategoryFilterPage(1);
                }*/
                if(response.products.length === 0){
                    props.reduxUpdateSnackbar('warning', true, 'موردی یافت نشد');
                }
                setFirstTime(false);
            }else if(response.status === 'failed'){
                console.warn(response.message);
                props.reduxUpdateSnackbar('warning', true, 'موردی یافت نشد');
            }
            setWaitingForData(false);
        }).catch((error)=>{
            console.error(error);
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            setWaitingForData(false);
        });
    }

    const searchInputChanged = (event) => {
        let input = event.target.value;
        props.reduxUpdateCategoryFilterKey(input);
        props.reduxUpdateCategoryFilterPage(1);
        getNewProducts({page: 1, key: input});
    }

    const minPriceChanged = (event) => {
        let value = event.target.value;
        if(value == 0 || value == ''){
            setFilterMinprice(0);
        }else{
            setFilterMinprice(event.target.value);
        }
    }

    const maxPriceChanged = (event) => {
        let value = event.target.value;
        if(value == 0 || value == ''){
            setFilterMaxPrice(0);
        }else{
            setFilterMaxPrice(value);
        }
    }

    const priceFilterButtonClicked = () => {
        props.reduxUpdateCategoryFilterPriceMargin(filterMinPrice, filterMaxPrice);
        getNewProducts({page: 1, minPrice: filterMinPrice, maxPrice: filterMaxPrice});
    }

    const deleteFilter = (index) => {
        /*let newFilters = [];
        addedFilters.map((f, i)=>{
            if(i !== index){
                newFilters.push(f);
            }else{
                setRecentlyDeletedFilter(f);
            }
        });
        setAddedFilters(newFilters);
        getNewProducts({filter: newFilters});*/
    }

    const filterCheckboxChanged = (item) => {
        let found = false;
        props.reduxCategoryFilter.options.map((o, counter) => {
            if(o.en_name === item.en_name && o.value === item.value){
                found = true;    
            }
        });
        if(found){
            let nCheckboxFilter = [];
            props.reduxCategoryFilter.options.map((item, counter) => {
                if(item.en_name !== item.en_name || item.value !== item.value){
                    nCheckboxFilter.push(item);
                }
            });
            props.reduxRemoveFromCategoryFilterOptions(item.en_name, item.value);
            getNewProducts({page: 1, filters: nCheckboxFilter});
        }else{
            let nCheckboxFilter = [];
            nCheckboxFilter = props.reduxCategoryFilter.options;
            nCheckboxFilter.push(item);
            props.reduxAddToCategoryFilterOptions(item.en_name, item.value);
            getNewProducts({page: 1, filters: nCheckboxFilter});
        }
    }

    const isTheCheckboxSelected = (item) => {
        let found = false;
        props.reduxCategoryFilter.options.map((o, counter) => {
            if(o.en_name == item.en_name && o.value == item.value){
                found = true;
            }
        });
        return found;
    }

    const removeAllFilters = () => {
        if(props.reduxCategoryFilter.key !== "" || props.reduxCategoryFilter.options.length !== 0 || props.reduxCategoryFilter.onlyAvailableProducts === 1){
            props.reduxWipeCategoryFilterTotally();
            props.reduxUpdateCategoryFilterPage(1);
            getNewProducts({page: 1, filters: [], key: '', onlyAvailableProducts: 0});
        }
    }

    const showOnlyAvailableProductsCheckboxChanged = (event) => {
        let newOap = 1;
        if(props.reduxCategoryFilter.onlyAvailableProducts === 1){
            newOap = 0;
        }
        props.reduxUpdateCategoryFilterOnlyAvailableProducts(newOap);
        props.reduxUpdateCategoryFilterPage(1);
        getNewProducts({page: 1, onlyAvailableProducts: newOap});
    }

    const isShowOnlyAvailableProductsCheckboxChecked = () => {
        if(props.reduxCategoryFilter.onlyAvailableProducts === 1){
            return true;
        }else {
            return false;
        }
    }

    const removeThisSelectedFilterItem = (item) => {
        let newFilters = [];
        props.reduxCategoryFilter.options.map((option, index) => {
            if(option.en_name != item.en_name){
                newFilters.push(option);
            }else{
                if(option.value != item.value){
                    newFilters.push(option);
                }
            }
        });
        console.warn(newFilters);
        props.reduxRemoveFromCategoryFilterOptions(item.en_name, item.value);
        props.reduxUpdateCategoryFilterPage(1);
        getNewProducts({filters: newFilters, page: 1});
    }

    const getFilterSelectedItems = (enName) => {
        let selectedOptions = [];
        props.reduxCategoryFilter.options.map((selectedOption, index) => {
            if(selectedOption.en_name === enName){
                selectedOptions.push(selectedOption.value);
            }
        });
        return (
            <div className={['row', 'text-right', 'rtl', 'px-3'].join(' ')}>
                {
                    selectedOptions.map((item, index) => {
                        return (
                            <div className={['d-flex', 'flex-row', 'rtl', 'text-right', 'pl-1', 'ml-1', 'align-items-center', 'mt-2', 'pointer'].join(' ')} onClick={() =>{removeThisSelectedFilterItem({en_name: enName, value: item})}} style={{borderRadius: '3px'}}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/close_circle_full_main.png'} style={{width: '15px', height: '15px'}} />
                                <span className={['pr-1', 'mb-0'].join(' ')} style={{color: 'white', fontSize: '12px', color: '#00BAC6'}} >{item}</span>
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    const phoneFilter = (
        <div className={['container'].join(' ')} style={{height: windowHeight}}>
            <div className={['row'].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'rtl', 'pt-3', 'pb-0', 'px-3'].join(' ')}>
                    <h6 className={['mb-0'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>فیلترها</h6>
                    <img src={Constants.baseUrl + '/assets/images/main_images/cross_black.png'} onClick={filterDrawer('bottom', false)} style={{width: '17px', height: '17px'}}/>
                </div>
                <div className={['col-12', 'px-3', 'mt-3'].join(' ')}>
                    <input type="text" value={props.reduxCategoryFilter.key} className={['form-control', 'text-right', 'rtl'].join(' ')} placeholder="نام محصول را جستجو کنید" onChange={searchInputChanged}/>
                </div>
                <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'justify-content-right', 'align-items-center', 'mt-3', 'd-none'].join(' ')}>
                    <input type='checkbox' className={['d-none'].join(' ')} checked={isShowOnlyAvailableProductsCheckboxChecked()} onChange={showOnlyAvailableProductsCheckboxChanged} style={{accentColor: '#009CA6'}} />
                    <h6 className={['mb-0', 'mr-2', 'd-none'].join(' ')} style={{fontSize: '13px', color: 'rgb(68, 68, 68)'}}>عدم نمایش محصولات ناموحود</h6>
                </div>
            </div>
            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'rtl', 'mt-2'].join(' ')}>
                <p className={['d-inline-block', 'px-2', 'mb-0'].join(' ')}>مرتب‌سازی براساس :</p>
                <Select
                    defaultValue={'new'}                 
                    onChange={sortByMenuChanged}>
                    <MenuItem value={'new'}><div className={['text-right'].join(' ')} style={{fontSize: '14px'}}>جدیدترین</div></MenuItem>
                    <MenuItem value={'old'}><div className={['text-right'].join(' ')} style={{fontSize: '14px'}}>قدیمی‌ترین</div></MenuItem>
                    <MenuItem value={'cheap'}><div className={['text-right'].join(' ')} style={{fontSize: '14px'}}>کمترین قیمت</div></MenuItem>
                    <MenuItem value={'expensive'}><div className={['text-right'].join(' ')} style={{fontSize: '14px'}}>بیشترین قیمت</div></MenuItem>
                </Select>
            </div>
            <div className={['rtl', 'text-right', 'px-1', 'py-3'].join(' ')} style={{borderBottom: '1px solid #dedede'}}>
                <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer'].join(' ')} onClick={() => {-2 === visibleFilterGroupId ?  setVisibleFilterGroupId(-1) : setVisibleFilterGroupId(-2)}}>
                    <h6 className={['mb-0']} style={{fontSize: '13px', color: '#444444'}}>موجود بودن/نبودن</h6>
                    <img src={-2 === visibleFilterGroupId ? Constants.baseUrl+'/assets/images/main_images/minus_black.png' : Constants.baseUrl+'/assets/images/main_images/plus_black.png'} style={{width: '14px', heigth: '14px'}} />
                </div>
                {
                    isShowOnlyAvailableProductsCheckboxChecked() 
                    ?
                    (
                    <div className={['row', 'text-right', 'rtl', 'px-3'].join(' ')}>
                        <div className={['d-flex', 'flex-row', 'rtl', 'text-right', 'pl-1', 'ml-1', 'align-items-center', 'mt-2', 'pointer'].join(' ')} onClick={showOnlyAvailableProductsCheckboxChanged} style={{borderRadius: '3px'}}>
                            <img src={Constants.baseUrl + '/assets/images/main_images/close_circle_full_main.png'} style={{width: '15px', height: '15px'}} />
                            <span className={['pr-1', 'mb-0'].join(' ')} style={{color: 'white', fontSize: '12px', color: '#00BAC6'}} >موجود بودن</span>
                        </div>
                    </div>
                    )
                    : 
                    null
                }
                <div hidden={-2 === visibleFilterGroupId ? false : true} className={['mt-2'].join(' ')} style={{maxHeight: '200px', overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: '#dedede, #dedede'}}>
                    <div >
                        <input type='checkbox' className={[''].join(' ')} style={{accentColor: '#009CA6'}} checked={isShowOnlyAvailableProductsCheckboxChecked()} onChange={showOnlyAvailableProductsCheckboxChanged} />
                        <label className={['mr-1', 'mb-1'].join(' ')} style={{fontSize: '14px'}} >عدم نمایش محصولات ناموجود</label>
                    </div>
                </div>
            </div>
            {
                filters.map((filter, key)=>{
                    if(filter.type === 'radio'){
                        //return <CheckboxGroup information={filter} filterUpdated={filterItemUpdated} key={key} deletedFilter={recentlyDeletedFilter} />;
                        return(
                            <div key={key} className={['rtl', 'text-right', 'py-3', 'px-1'].join(' ')} style={{borderBottom: '1px solid #D8D8D8'}}>
                                <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer'].join(' ')} onClick={() => {key === visibleFilterGroupId ?  setVisibleFilterGroupId(-1) : setVisibleFilterGroupId(key)}}>
                                    <h6 className={['mb-0']} style={{fontSize: '13px', color: '#444444'}}>{filter.name}</h6>
                                    <img src={key === visibleFilterGroupId ? Constants.baseUrl + '/assets/images/main_images/minus_black.png' : Constants.baseUrl + '/assets/images/main_images/plus_black.png'} style={{width: '14px', heigth: '14px'}} />
                                </div>
                                {getFilterSelectedItems(filter.enName)}
                                <div hidden={key === visibleFilterGroupId ? false : true} className={['mt-2', 'pr-3'].join(' ')} style={{overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: '#dedede, #dedede'}}>
                                    {
                                        JSON.parse(filter.options).map((option, index)=>{
                                            return(
                                                <div key={index}>
                                                    <input type='checkbox' style={{accentColor: '#009CA6'}} className={[''].join(' ')} value={option} checked={isTheCheckboxSelected({en_name: filter.enName, value: option})} onChange={() => {filterCheckboxChanged({en_name: filter.enName, value: option})}} />
                                                    <label className={['mr-2', 'mb-1'].join(' ')} style={{fontSize: '13px', color: '#444444'}} >{option}</label>
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
                <button className={['py-3', 'text-center', 'pointer'].join(' ')} style={{fontSize: '14px', color: '#00BAC6', background: 'white', border: 'none', outline: 'none'}} onClick={removeAllFilters}>پاک‌کردن همه فیلترها</button>
            </div>
        </div>
    );

    const showSkeletonGrid = () => {
        const skeletonArray = [1,1,1,1,1,1,1,1,1,1,1,1];
        return (
            <div className={['row', 'd-flex', 'align-items-stretch', 'px-2'].join(' ')}>
                {
                    skeletonArray.map((sa, i) => {
                        return (
                            <div className={['col-6', 'col-md-3', 'p-2', 'd-flex', 'flex-column', 'text-right', 'rtl'].join(' ')}>
                                <Skeleton variant='rectangular' style={{width: '100%', height: '200px'}} />
                                <Skeleton variant='text' className={['mt-2'].join(' ')} style={{fontSize: '15px', width: '100%'}} />
                                <Skeleton variant='text' className={['mt-2'].join(' ')} style={{fontSize: '15px', width: '40%'}} />
                            </div>
                        );
                    })
                }
            </div>
        );
    }


    return(
        <React.Fragment>
            <Drawer anchor="bottom" open={state['bottom']} onClose={filterDrawer('bottom', false)}>
                {phoneFilter}
            </Drawer>
            <div className={[''].join(' ')} style={{backgroundColor: '#F7F7F7'}}>
                <div className={['container'].join(' ')} style={{overflowX: 'hidden'}}>
                   <div className={['row', 'align-items-center', 'rtl', 'py-1', 'py-md-2', 'px-2'].join(' ')} style={{overflowX: 'hidden'}}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/youre_here.svg'} style={{width: '80px'}} />
                        <p className={['p-1', 'mb-0', 'font11', 'd-none'].join(' ')} style={{backgroundColor: 'white', border: '1px solid #D8D8D8', borderRadius: '14px 1px 1px 14px', fontSize: '11px'}}>اینجا هستید</p>
                        {
                            props.breadcrumb.map((cb, count)=>{
                                if(count == 0){
                                    return(
                                        <Link key={count} href={'/shop/product/category/' + cb.url} ><a onClick={props.reduxStartLoading} className={['breadcrumbItem', 'mb-0', 'font11', 'mr-2'].join(' ')} style={{fontSize: '11px'}} >{cb.name}</a></Link>
                                    );
                                }else if(count == props.breadcrumb.length - 1){
                                    return(
                                        <React.Fragment>
                                            <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_black_small.png'} className={['mx-2'].join(' ')} style={{width: '10px'}} />
                                            <p className={['breadcrumbItem', 'mb-0', 'font11'].join(' ')} style={{fontSize: '11px'}} >{cb.name}</p>
                                        </React.Fragment>
                                    );
                                }else{
                                    return(
                                        <React.Fragment>
                                            <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_black_small.png'} className={['mx-2'].join(' ')} style={{width: '10px'}} />
                                            <Link key={count} href={'/shop/product/category/' + cb.url} ><a onClick={props.reduxStartLoading} className={['breadcrumbItem', 'mb-0', 'font11'].join(' ')} style={{fontSize: '11px'}} >{cb.name}</a></Link>
                                        </React.Fragment>
                                    );
                                }
                            })
                        }
                   </div>
                </div>
            </div>
            <div className={['container'].join(' ')} style={{overflowX: 'hidden'}}>
                <div className={['row', 'rtl', 'mt-3', 'd-flex', 'flex-row', 'align-items-stretch'].join(' ')}>
                    {
                        props.banners.map((cb, key)=>{
                            let categoryUrl = cb.url;
                            return(
                                <div className={['col-4', 'p-2', 'align-self-stretch'].join(' ')} style={{}} key={key}>
                                    <Link href={categoryUrl.substring(18)}>
                                        <a onClick={props.reduxStartLoading} className={['w-100', 'd-flex', 'flex-column', 'pointer'].join(' ')} style={{borderRadius: '4px', border: '1px solid #dedede', height: '100%', boxShadow: '0 0.05rem 0.09rem rgba(0, 0, 0, 0.08)'}}>
                                            <img src={cb.image} className={['w-100'].join(' ')} />
                                            <h6 className={['py-3', 'text-center', 'mb-0', 'font11md17', 'font-weight-normal'].join(' ')} style={{lineHeight: '1.2rem'}}>{cb.title}</h6>
                                        </a>
                                    </Link>
                                </div>
                            );
                        })
                    }
                </div>
                <div className={['d-flex', 'flex-column', 'd-md-none', 'align-items-center', 'justify-content-center', 'rtl', 'text-right', 'mt-3'].join(' ')}>
                    <h6 className={['mb-0', 'text-right', 'font-weight-bold'].join(' ')} style={{width: '100%'}}>{props.name}</h6>
                    <div className={['d-flex', 'flex-row', 'rtl', 'py-2', 'px-3', 'mt-3', 'align-items-center', 'justify-content-center', 'w-100', 'pointer'].join(' ')} onClick={filterDrawer('bottom', true)} style={{color: '#00bac6', borderRadius: '4px', border: '2px solid #00bac6'}}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/filter_main.png'} style={{width: '17px', height: '17px'}} />
                        <span className={['mr-2', 'font-weight-bold'].join(' ')} style={{color: '#00bac6', fontSize: '14px'}}>فیلترها</span> 
                        {
                            props.reduxCategoryFilter.options.length !== 0 || isShowOnlyAvailableProductsCheckboxChecked()
                            ?
                            (
                                isShowOnlyAvailableProductsCheckboxChecked()
                                ? 
                                <span className={['bg-danger', 'px-2', 'mr-1'].join(' ')} style={{color: 'white', borderRadius: '9px', fontSize: '11px'}}>{props.reduxCategoryFilter.options.length + 1}</span>
                                :
                                <span className={['bg-danger', 'px-2', 'mr-1'].join(' ')} style={{color: 'white', borderRadius: '9px', fontSize: '11px'}}>{props.reduxCategoryFilter.options.length}</span>
                            )
                            :
                            null
                        }
                    </div>
                </div>
                <div className={['row', 'rtl', 'mt-2', 'mt-md-4'].join(' ')}>
                    <div className={['d-none', 'd-md-block', 'mr-2', 'ml-2'].join(' ')} style={{flex: '1'}}>
                        <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-right'].join(' ')}>
                        <h2 className={['text-right', 'mb-3'].join(' ')} style={{fontSize: '26px', fontWeight: 'bold', color: '#444444', lineHeight: '2.6rem'}}>{props.name}</h2>
                        </div>
                        <div className={['rtl'].join(' ')} style={{borderRadius: '4px'}}>
                            <div className={['d-flex', 'flex-row', 'align-items-center', 'p-3'].join(' ')}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/filter_black.png'} style={{width: '13px'}} />
                                <span className={['font-weight-bold','mr-2'].join(' ')} style={{fontSize: '14px'}} >فیلتر کردن محصولات</span>
                                {
                                    props.reduxCategoryFilter.options.length !== 0 || isShowOnlyAvailableProductsCheckboxChecked()
                                    ?
                                    (
                                        isShowOnlyAvailableProductsCheckboxChecked()
                                        ?
                                            <h6 className={['py-1', 'px-2', 'mr-2', 'bg-danger'].join(' ')} style={{borderRadius: '9px', color: 'white', fontSize: '10px'}}>{props.reduxCategoryFilter.options.length + 1}</h6>
                                        :
                                            <h6 className={['py-1', 'px-2', 'mr-2', 'bg-danger'].join(' ')} style={{borderRadius: '9px', color: 'white', fontSize: '10px'}}>{props.reduxCategoryFilter.options.length}</h6>
                                    )
                                    :
                                    null
                                }
                            </div>
                                <div className={['w-100', 'px-3', 'mt-3'].join(' ')}>
                                    <input type="text" value={props.reduxCategoryFilter.key} className={['form-control', 'text-right', 'rtl'].join(' ')} placeholder="نام محصول را جستجو کنید" style={{fontSize: '13px'}} onChange={searchInputChanged}/>
                                </div>
                                <div className={['d-flex', 'flex-row', 'align-items-center', 'rtl', 'px-3', 'mt-3', 'd-none'].join(' ')}>
                                    <input type='checkbox' className={['d-none'].join(' ')} checked={isShowOnlyAvailableProductsCheckboxChecked()} onChange={showOnlyAvailableProductsCheckboxChanged} style={{accentColor: '#009CA6'}} />
                                    <h6 className={['text-right', 'rtl', 'mb-0', 'mr-2', 'd-none'].join(' ')} style={{fontSize: '13px'}}>عدم نمایش محصولات ناموجود</h6>
                                </div>
                                <div className={['rtl', 'text-right', 'p-3'].join(' ')} style={{borderBottom: '1px solid #dedede'}}>
                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer'].join(' ')} onClick={() => {-2 === visibleFilterGroupId ?  setVisibleFilterGroupId(-1) : setVisibleFilterGroupId(-2)}}>
                                        <h6 className={['mb-0']} style={{fontSize: '13px', color: '#444444'}}>موجود بودن/نبودن</h6>
                                        <img src={-2 === visibleFilterGroupId ? Constants.baseUrl+'/assets/images/main_images/minus_black.png' : Constants.baseUrl+'/assets/images/main_images/plus_black.png'} style={{width: '14px', heigth: '14px'}} />
                                    </div>
                                    {
                                        isShowOnlyAvailableProductsCheckboxChecked() 
                                        ?
                                        (
                                        <div className={['row', 'text-right', 'rtl', 'px-3'].join(' ')}>
                                            <div className={['d-flex', 'flex-row', 'rtl', 'text-right', 'pl-1', 'ml-1', 'align-items-center', 'mt-2', 'pointer'].join(' ')} onClick={showOnlyAvailableProductsCheckboxChanged} style={{borderRadius: '3px'}}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/close_circle_full_main.png'} style={{width: '15px', height: '15px'}} />
                                                <span className={['pr-1', 'mb-0'].join(' ')} style={{color: 'white', fontSize: '12px', color: '#00BAC6'}} >موجود بودن</span>
                                            </div>
                                        </div>
                                        )
                                        : 
                                        null
                                    }
                                    <div hidden={-2 === visibleFilterGroupId ? false : true} className={['mt-2'].join(' ')} style={{maxHeight: '200px', overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: '#dedede, #dedede'}}>
                                        <div >
                                            <input type='checkbox' className={[''].join(' ')} style={{accentColor: '#009CA6'}} checked={isShowOnlyAvailableProductsCheckboxChecked()} onChange={showOnlyAvailableProductsCheckboxChanged} />
                                            <label className={['mr-1', 'mb-1'].join(' ')} style={{fontSize: '14px'}} >عدم نمایش محصولات ناموجود</label>
                                        </div>
                                    </div>
                                </div>
                                {
                                    filters.map((filter, key)=>{
                                        if(filter.type === 'radio'){
                                            //return <CheckboxGroup information={filter} filterUpdated={filterItemUpdated} key={key} deletedFilter={recentlyDeletedFilter} />;
                                            return(
                                                <div key={key} className={['rtl', 'text-right', 'p-3'].join(' ')} style={{borderBottom: '1px solid #dedede'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer'].join(' ')} onClick={() => {key === visibleFilterGroupId ?  setVisibleFilterGroupId(-1) : setVisibleFilterGroupId(key)}}>
                                                        <h6 className={['mb-0']} style={{fontSize: '13px', color: '#444444'}}>{filter.name}</h6>
                                                        <img src={key === visibleFilterGroupId ? Constants.baseUrl+'/assets/images/main_images/minus_black.png' : Constants.baseUrl+'/assets/images/main_images/plus_black.png'} style={{width: '14px', heigth: '14px'}} />
                                                    </div>
                                                    {getFilterSelectedItems(filter.enName)}
                                                    <div hidden={key === visibleFilterGroupId ? false : true} className={['mt-2'].join(' ')} style={{maxHeight: '200px', overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: '#dedede, #dedede'}}>
                                                        {
                                                            JSON.parse(filter.options).map((option, index)=>{
                                                                return(
                                                                    <div key={index}>
                                                                        <input type='checkbox' className={[''].join(' ')} style={{accentColor: '#009CA6'}} value={option} checked={isTheCheckboxSelected({en_name: filter.enName, value: option})} onChange={() => {filterCheckboxChanged({en_name: filter.enName, value: option})}} />
                                                                        <label className={['mr-1', 'mb-1'].join(' ')} style={{fontSize: '14px'}} >{option}</label>
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
                                <div className={['rtl', 'text-right', 'p-3', 'd-none'].join(' ')} style={{borderBottom: '1px solid #dedede'}}>
                                <h6 className={['font-weight-bold', 'text-right', 'd-none'].join(' ')}>قیمت</h6>
                                <div className={['row', 'w-100','px-0', 'mx-0', 'd-none'].join(' ')}>
                                    <div className={['col-6', 'pr-0', 'pl-2'].join(' ')}>
                                        <small>از (تومان)</small>
                                        <input type='number' className={['form-control', 'font-weight-bold'].join(' ')} style={{fontSize: '13px'}} onChange={minPriceChanged} />
                                    </div>
                                    <div className={['col-6', 'pl-0', 'pr-2'].join(' ')}>
                                        <small>تا (تومان)</small>
                                        <input type='number' className={['form-control', 'font-weight-bold'].join(' ')} style={{fontSize: '13px'}} onChange={maxPriceChanged} />
                                    </div>
                                </div>
                                <button className={['btn', 'mt-3', 'd-none'].join(' ')} style={{borderRadius: '4px', color: 'white', backgroundColor: '#00bac6', fontSize: '14px'}} onClick={priceFilterButtonClicked}>اعمال فیلتر قیمت</button>
                            </div>
                            <button className={['text-center', 'mb-0', 'rtl', 'w-100', 'mt-3', 'pointer'].join(' ')} style={{border: 'none', outlineStyle: 'none', fontSize: '12px', color: '#00BAC6', background: 'white'}} onClick={removeAllFilters}>پاک کردن تمام فیلترها</button>
                        </div>
                    </div>
                    <div className={[''].join(' ')} style={{flex: '4'}}>
                        <div className={['container'].join(' ')}>
                            <div className={['row'].join(' ')}>
                                <div className={['col-12', 'd-none', 'd-md-block'].join(' ')}>
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
                                <div className={['container'].join(' ')}>

                                    {
                                        ssrProducts ?
                                        (
                                            <div className={['row', 'd-flex', 'align-items-stretch', 'px-2', 'd-none'].join(' ')}>
                                            {
                                                props.products.map((r, key)=>{
                                                    return(
                                                        <ProductCard information={r} key={key} ssr={true} />
                                                    );
                                                })
                                            }
                                            </div>
                                        )
                                        :
                                        (
                                            props.reduxCategoryFilter.results.length !== 0 && !waitingForData
                                            ?
                                            (
                                                <div className={['row', 'd-flex', 'align-items-stretch', 'px-2'].join(' ')}>
                                                {
                                                    props.reduxCategoryFilter.results.map((r, key)=>{
                                                        return(
                                                            <React.Fragment>
                                                                <ProductCard information={r} key={key} ssr={false} />
                                                            </React.Fragment>
                                                        );
                                                    })
                                                }
                                                </div>
                                            )
                                            :
                                            (
                                                props.reduxCategoryFilter.results.length === 0 && !waitingForData && !firstTime
                                                ?
                                                (
                                                    <div className={['row', 'd-flex', 'align-items-stretch', 'px-2'].join(' ')}>
                                                        <h6 className={['col-12', 'text-center', 'py-3'].join(' ')} style={{color: '#b8cf5f', fontSize: '20px'}}>موردی یافت نشد</h6>
                                                    </div>
                                                )
                                                :
                                                showSkeletonGrid()
                                            )
                                        )
                                    }

                                </div>
                                {
                                    props.reduxCategoryFilter.results.length !== 0 
                                    ?
                                    <div className={['col-12', 'd-flex', 'flex-row', 'justify-content-center', 'align-items-center', 'mt-2'].join(' ')}>
                                        <button className={[props.reduxCategoryFilter.maxPage != 1 ? 'd-flex' : 'd-none', 'flex-row', 'align-items-center', 'pointer', 'px-3'].join(' ')} onClick={paginationPrevButtonClicked} style={{outlineStyle: 'none', borderRadius: '4px', border: '1px solid #dedede', backgroundColor: 'white', paddingTop: '0.37rem', paddingBottom: '0.37rem'}}>
                                            <img src={Constants.baseUrl + '/assets/images/main_images/right_arrow_black.png'} style={{width: '8px', height: '8px'}} />
                                            <span className={['pr-1', 'font-weight-bold'].join(' ')} style={{fontSize: '13px'}}>قبلی</span>
                                        </button>
                                        {
                                            ssrProducts
                                            ?
                                            (
                                                <React.Fragment>
                                                    <div className={['text-right', 'rtl', 'd-none', 'd-md-block'].join(' ')}><Pagination count={props.reduxCategoryFilter.maxPage} shape='rounded' onChange={paginationChanged} page={props.reduxCategoryFilter.page} hideNextButton={true} hidePrevButton={true} /></div>
                                                    <span className={['d-block', 'd-md-none', 'px-3'].join(' ')}>{ 1 + '  از  ' + (Math.ceil(props.count / 12))}</span>
                                                </React.Fragment>
                                            )
                                            :
                                            (
                                                <React.Fragment>
                                                    <div className={['text-right', 'rtl', 'd-none', 'd-md-block'].join(' ')}><Pagination count={props.reduxCategoryFilter.maxPage} shape='rounded' onChange={paginationChanged} page={props.reduxCategoryFilter.page} hideNextButton={true} hidePrevButton={true} /></div>
                                                    <span className={['d-block', 'd-md-none', 'px-3'].join(' ')}>{ props.reduxCategoryFilter.page + '  از  ' + props.reduxCategoryFilter.maxPage}</span>
                                                </React.Fragment>
                                            )
                                        }
                                        <button className={[props.reduxCategoryFilter.maxPage != 1 ? 'd-flex' : 'd-none', 'flex-row', 'align-items-center', 'pointer', 'px-3', 'ltr'].join(' ')} onClick={paginationNextButtonClicked} style={{outlineStyle: 'none', borderRadius: '4px', border: '1px solid #dedede', backgroundColor: 'white', paddingTop: '0.37rem', paddingBottom: '0.37rem'}}>
                                            <img  src={Constants.baseUrl + '/assets/images/main_images/left_arrow_black.png'} style={{width: '8px', height: '8px'}} />
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
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        reduxUser: state.user,
        reduxCart: state.cart,
        reduxLoad: state.loading,
        reduxCategoryFilter: state.categoryFilter
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
        reduxStartLoading: () => dispatch({type: actionTypes.START_LOADING}),
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
        reduxWipeCategoryFilterTotally: () => dispatch({type: actionTypes.WIPE_CATEGORY_FILTER}) ,
        reduxUpdateCategoryFilterOnlyAvailableProducts: (oap) => dispatch({type: actionTypes.UPDATE_CATEGORY_FILTER_ONLY_AVAILABLE_PRODUCTS, onlyAvailableProducts: oap}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryInsight);
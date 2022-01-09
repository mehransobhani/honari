import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import styles from './style.module.css';
import Header from '../Header/Header';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import NewProduct from '../../components/NewProducts/NewProducts.js';
import axios from 'axios';
import * as Constants from '../constants';
import parse from 'html-react-parser'
import SimilarProducts from '../SimilarProducts/SimilarProducts';
import TopSixProducts from '../TopSixProducts/TopSixProducts';
import {useCookies} from 'react-cookie';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';
import Image from 'next/image';
import Skeleton from '@mui/material/Skeleton';
import {Helmet} from 'react-helmet';
import { Apartment } from '@material-ui/icons';

const ProductInsight = (props) =>{
    const [loading, setLoading] = useState(false);
    const [productNameState, setProductNameState] = useState('');
    const [productImageState, setProductImageState] = useState('');
    const [priceState, setPriceState] = useState(0);
    const [stockState, setStockState] = useState(0);
    const [packLabelState, setPackLabelState]= useState(0);
    const [statusState, setStatusState] = useState(-1);
    const [basePriceState, setBasePriceState] = useState(0);
    const [cartButtonOpacity, setCartButtonOpacity] = useState('0.3');
    const [productFeaturesState, setProductFeaturesState] = useState([]);
    const [breadcrumbState, setBreadcrumbState] = useState([]);
    const [id, setId] = useState(props.id);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [productInformation, setProductInformation] = useState({});
    const [orderCount, setOrderCount] = useState(1);
    const [productCartStatus, setProductCartStatus] = useState('');
    const [productCartCount, setProductCartCount] = useState(null);
    const [axiosProcessing, setAxiosProcessing] = useState(false);
    const [mainImageLoaded, setMainImageLoaded] = useState(false);
    const [productInformationReceived, setProductInformationReceived] = useState(false);
    const [mainImageClass, setMainImageClass] = useState('d-none');
    const [aparatContainerDiv, setAparatContainerDiv] = useState(undefined);
    const [aparatScript, setAparatScript] = useState(undefined);
    const [aparatId, setAparatId] = useState(0);
    const [videoFullscreenDisplay, setVideoFullscreenDisplay] = useState('d-none');

    const [cookies , setCookie , removeCookie] = useCookies();

    /*useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/product-basic-information', {
            productId: id,
        }).then((res)=>{
            alert('getting product basic information');
            if(res.data.status === 'done'){
                let response = res.data;
                setProductInformation(response.information);
                console.warn(response.information);
            }else{
                console.log(res.data.umessage);
            }
        }).catch((error)=>{
            console.log(error);
        });
    }, []);*/

    useEffect(()=>{
        setProductInformationReceived(false);
        setMainImageClass('d-none');
        setMainImageLoaded(false);
        axios.post(Constants.apiUrl + '/api/product-basic-information', {
            productId: props.id,
        }).then((res)=>{
            if(res.data.status === 'done'){
                let response = res.data;
                setProductInformation(response.information);
                setProductInformationReceived(true);
                if(response.information.aparat !== ''){
                    let aparat = response.information.aparat;
                    //<div id="18340515441"><script type="text/JavaScript" src="https://www.aparat.com/embed/Oo3Cw?data[rnddiv]=18340515441&data[responsive]=yes"></script></div>    
                    let containerIsGotten = false;
                    let scriptIsGotten = false;
                    let idPermissionIsGranted = false;
                    let scriptPermissionIsGranted = false;
                    let aparatIdString = '';
                    let aparatScriptString = '';
                    let sizeOfString = response.information.aparat.length;
                    for(let i=0; i<sizeOfString ; i++){
                        if(!idPermissionIsGranted && !containerIsGotten && !scriptPermissionIsGranted && aparat.charAt(i) === 'i' && aparat.charAt(i+1) === 'd' && aparat.charAt(i+2) === '=' && aparat.charAt(i+3) === '"'){
                            i=i+3;
                            idPermissionIsGranted = true;
                        }else if(idPermissionIsGranted && !containerIsGotten){
                            if(aparat.charAt(i) !== '"'){
                                aparatIdString += aparat.charAt(i);
                            }else{
                                idPermissionIsGranted = false;
                                containerIsGotten = true;
                            }
                        }
                        if(containerIsGotten && !scriptPermissionIsGranted && aparat.charAt(i) === '<' && aparat.charAt(i+1) === 's' && aparat.charAt(i+2) === 'c' && aparat.charAt(i+3) === 'r'){
                            scriptPermissionIsGranted = true;
                        }
                        if(scriptPermissionIsGranted && !scriptIsGotten){
                            aparatScriptString += aparat.charAt(i);
                        }
                        if(scriptPermissionIsGranted){
                            if(aparat.charAt(i) === '>' && aparat.charAt(i-1) === 't' && aparat.charAt(i-8) === '<' && aparat.charAt(i-7) === '/' && aparat.charAt(i-6) === 's'){
                                scriptPermissionIsGranted = false;
                                scriptIsGotten = true;
                            }
                        }
                    }
                    console.warn("APARAT ID : " + aparatIdString + " AND SCRIPT STRING : " + aparatScriptString);
                    setAparatScript(aparatScriptString);
                    setAparatId(parseInt(aparatIdString));
                    setAparatContainerDiv(<div id={parseInt(aparatIdString)}></div>);
                }
            }else{
                console.log(res.data.umessage);
                props.reduxUpdateSnackbar('warning', true, res.data.umessage);
            }
        }).catch((error)=>{
            console.log(error);
        });
    }, [id, props.id]);

    /*useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/product-description', {
            id: props.id,
        }).then((res)=>{
            let response = res.data;
            setProductDescriptionState(parse(response));
        }).catch((error)=>{
            console.log(error);
        });
    }, [id, props.id]);*/

    useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/product-features', {
            id: props.id,
        }).then((res)=>{
            if(res.data.status === 'done'){
                let response = res.data;
                if(response.features !== null && response.features !== undefined){
                    setProductFeaturesState(response.features);
                }
            }else{
                console.log(res.data.message);
            }
        }).catch((error)=>{
            console.log(error);
        });
    }, [id, props.id]);

    useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/product-breadcrumb', {
            id: props.id,
        }).then((res)=>{
            if(res.data.status === 'done'){
                let response = res.data;
                setBreadcrumbState(response.categories);
            }else{
                console.log(res.data.message);
            }
        }).catch((error)=>{
            console.log(error);
        });
    }, [id, props.id]);

    useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/similar-products', {
            id: props.id,
        }).then((res)=>{
            if(res.data.status === 'done' && res.data.found === true){
                let response = res.data;
                setSimilarProducts(response.products);
            }else{
                console.log(res.data.message);
            }
        }).catch((error)=>{
            console.log(error);
        });
        console.log(cookies.user_cart);
    }, [id, props.id]);

    /*useEffect(() => {
        if(props.reduxCart.status !== 'NI'){
            let found = false;
            props.reduxCart.information.map((cartItem, counter) => {
                if(cartItem.productId == id){
                    found = true;
                }
            });
            if(found){
                setProductExistsInCart(true);
            }else{
                setProductExistsInCart(false);
            }
        }
    }, [props.reduxCart.status, 'NI']);*/

    const productCounterChanged = (event) => {
        if(event.target.value < 1){
            event.target.value = 1;
            setOrderCount(1);
        }else if(event.target.value > productInformation.maxCount){
            event.target.value = productInformation.maxCount;
            setOrderCount(productInformation.maxCount);
        }else{
            setOrderCount(parseInt(event.target.value));
        }
    }

    const increaseOrderCountByOne = () => {
        if(orderCount < productInformation.maxCount){
            setOrderCount(orderCount + 1);
        }
    }

    const decreaseOrderCountByOne = () => {
        if(orderCount > 1){
            setOrderCount(orderCount -1);
        }
    }

    const addToCartButtonClicked = () => {
        if(!axiosProcessing){
            if(props.reduxUser.status === 'LOGIN'){
                setAxiosProcessing(true);
                axios.post(Constants.apiUrl + '/api/user-add-to-cart', {
                    productPackId: productInformation.productPackId,
                    productPackCount: orderCount
                },{
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    let response = res.data;
                    if(response.status === 'done'){
                        props.reduxAddToCart({
                            productId: productInformation.productId,
                            productPackId: productInformation.productPackId,
                            name: productInformation.productName,
                            categoryId: productInformation.categoryId,
                            prodID: productInformation.prodID,
                            url: productInformation.productUrl,
                            count: orderCount,
                            unitCount: productInformation.productUnitCount,
                            unitName: productInformation.productUnitName,
                            label: productInformation.productLabel,
                            basePrice: productInformation.productBasePrice,
                            price: productInformation.productPrice,
                            discountedPrice: productInformation.discountedPrice,
                            discountPercent: productInformation.discountPercent
                        });
                    }else if(response.status === 'failed'){
                        alert(response.umessage);
                    }
                }).catch((error) => {
                    console.log(error);
                    alert('خطا در برقراری ارتباط');
                });
                setAxiosProcessing(false);
            }else if(props.reduxUser.status === 'GUEST'){
                let cart = JSON.parse(localStorage.getItem('user_cart'));
                console.warn(productInformation);
                props.reduxAddToCart({
                    productId: productInformation.productId,
                    productPackId: productInformation.productPackId,
                    name: productInformation.productName,
                    categoryId: productInformation.categoryId,
                    prodID: productInformation.prodID,
                    url: productInformation.productUrl,
                    count: orderCount,
                    unitCount: productInformation.productUnitCount,
                    unitName: productInformation.productUnitName,
                    label: productInformation.productLabel,
                    basePrice: productInformation.productBasePrice,
                    price: productInformation.productPrice,
                    discountedPrice: productInformation.discountedPrice,
                    discountPercent: productInformation.discountPercent
                });
                cart.push({id: productInformation.productPackId, count: orderCount});
                localStorage.setItem('user_cart', JSON.stringify(cart));
            }
        }
    }

    const removeFromCartButtonClicked = () => {
        if(!axiosProcessing){
            if(props.reduxUser.status === 'LOGIN'){
                setAxiosProcessing(true);
                axios.post(Constants.apiUrl + '/api/user-remove-from-cart', {
                    productPackId: productInformation.productPackId
                },{
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    let response = res.data;
                    if(response.status === 'done'){
                        props.reduxRemoveFromCart(productInformation.productPackId);
                        setOrderCount(1);
                    }else if(response.status === 'failed'){
                        alert(response.umessage);
                    }
                }).catch((error) => {
                    console.log(error);
                    alert('خطا در برقراری ارتباط');
                });
                setAxiosProcessing(false);
            }else if(props.reduxUser.status === 'GUEST'){
                let cart = JSON.parse(localStorage.getItem('user_cart'));
                let newCart = [];
                cart.map((cartItem, counter) => {
                    if(productInformation.productPackId !== cartItem.id){
                        newCart.push(cartItem);
                    }
                });
                localStorage.setItem('user_cart', JSON.stringify(newCart));
                props.reduxRemoveFromCart(productInformation.productPackId);
                setOrderCount(1);
            }
        }
    }

    const increaseButtonClicked = () => {
        if(axiosProcessing){
            return;
        }
        if(props.reduxUser.status == 'GUEST'){
            setAxiosProcessing(true);
            axios.post(Constants.apiUrl + '/api/guest-check-cart-changes', {
                productPackId: productInformation.productPackId,
                count: parseInt(orderCount) + 1
            }).then((res) => {
                let response = res.data;
                if(response.status == 'done'){
                    updateProductInLocalStorage(response.count);
                    props.reduxIncreaseCountByOne(productInformation.productPackId);
                    setAxiosProcessing(false);
                    setOrderCount(parseInt(orderCount) + 1);
                }else if(response.status == 'failed'){
                    setAxiosProcessing(false);
                    console.warn(response.umessage);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
            }).catch((error) => {
                setAxiosProcessing(false);
                console.log(error);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            });
        }else if(props.reduxUser.status === 'LOGIN'){
            setAxiosProcessing(true);
            axios.post(Constants.apiUrl + '/api/user-increase-cart-by-one', {
                productPackId: productInformation.productPackId
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.user_server_token, 
                }
            }).then((res) => {
                let response = res.data;
                if(response.status == 'done'){
                    props.reduxIncreaseCountByOne(productInformation.productPackId);
                    setAxiosProcessing(false);
                    //setOrderCount(parseInt(orderCount) + 1);
                }else if(response.status == 'failed'){
                    setAxiosProcessing(false);
                    console.warn(response.message);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
            }).catch((error) => {
                setAxiosProcessing(false);
                console.log(error);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            });
        }
    }

    const decreaseButtonClicked = () => {
        if(axiosProcessing){
            return;
        }
        if(props.reduxUser.status == 'GUEST'){
            setAxiosProcessing(true);
            axios.post(Constants.apiUrl + '/api/guest-check-cart-changes', {
                productPackId: productInformation.productPackId,
                count: parseInt(orderCount) - 1
            }).then((res) => {
                setAxiosProcessing(false);
                let response = res.data;
                if(response.status == 'done'){
                    updateProductInLocalStorage(response.count);
                    props.reduxDecreaseCountByOne(productInformation.productPackId);
                    setOrderCount(parseInt(orderCount) - 1);
                }else if(response.status == 'failed'){
                    setAxiosProcessing(false);
                    console.warn(response.message);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
            }).catch((error) => {
                setAxiosProcessing(false);
                console.log(error);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            });
        }else if(props.reduxUser.status == 'LOGIN'){
            setAxiosProcessing(true);
            axios.post(Constants.apiUrl + '/api/user-decrease-cart-by-one', {
                productPackId: productInformation.productPackId
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.user_server_token, 
                }
            }).then((res) => {
                let response = res.data;
                setAxiosProcessing(false);
                if(response.status == 'done'){
                    props.reduxDecreaseCountByOne(productInformation.productPackId);
                    //setOrderCount(parseInt(orderCount) - 1);
                }else if(response.status === 'failed'){
                    console.log(response.message);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
            }).catch((error) => {
                setAxiosProcessing(true);
                console.log(error);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            });
        }
    }

    const productExistsOrNot = () => {
        let found = false;
        props.reduxCart.information.map((product, index)=> {
            if(product.productPackId == productInformation.productPackId){
                found = true;
            }
        });
        return found;
    }

    const getProductOrderCount = () => {
        let productCount = 0;
        props.reduxCart.information.map((product, index) => {
            if(product.productPackId == productInformation.productPackId){
                productCount = product.count;
            }
        });
        return productCount;
    }

    const updateProductInLocalStorage = (count) => {
        let localStorageCart = JSON.parse(localStorage.getItem('user_cart'));
        for(let item of localStorageCart){
            if(item.id == productInformation.productPackId){
                item.count = count;
            }
        }
        localStorage.setItem('user_cart', JSON.stringify(localStorageCart));
    }

    const mainImageOnLoadListener = () => {
        setMainImageLoaded(true);
        setMainImageClass('d-block');
    }

    const videoImageClicked = () => {
        setVideoFullscreenDisplay('d-flex');
    }

    const setReminderButtonClicked = () => {
        if(props.reduxUser.status === 'GUEST' || props.reduxUser.status === 'NI'){
            alert('برای ایجاد یادآور، ابتدا باید وارد حساب کاربری خود شوید');
            return;
        }
        if(props.reduxUser.status === 'LOGIN'){
            axios.post(Constants.apiUrl + "/api/user-set-product-reminder", {
                productId: props.id,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.user_server_token, 
                }
            }).then((r) => {
                let response = r.data;
                if(response.status === 'done'){
                    props.reduxUpdateSnackbar('success', true, response.umessage);
                }else if(response.status === 'failed'){
                    console.warn(response.message);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
            }).catch((e) => {
                console.error(e);
                props.reduxUpdateSnackbar('error', true, 'خطا در اتصال به اینترنت');
            });
        }
    }

    return(
        <React.Fragment>
            <div className={[videoFullscreenDisplay, 'flex-row', 'align-items-center', 'justify-content-center'].join(' ')} style={{width: '100%', height: '100%', position: 'fixed', top: '0px', left: '0px', background: 'black', zIndex: '99999'}}>
                <div className={['d-flex', 'flex-row', 'align-items-center'].join(' ')} style={{position: 'absolute', top: '10px', right: '10px'}}>
                    <img onClick={() => {setVideoFullscreenDisplay('d-none')}} className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/close_white_small.png'} style={{width: '30px', height: '30px'}} />
                </div>
                <div id={aparatId} className={[''].join(' ')} style={{width: '90%'}}></div>
                <div className={['d-flex', 'd-md-none', 'flex-row', 'align-items-center', 'justify-content-center', 'w-100'].join(' ')} style={{position: 'absolute', bottom: '20px', left: '0px'}}>
                    <button onClick={() => {setVideoFullscreenDisplay('d-none')}} className={['pointer', 'px-3'].join(' ')} style={{fontSize: '17px', color: 'white', background: 'black', borderRadius: '5px', border: '1px solid white'}}>بستن</button>
                </div>
            </div>
            <div className={[''].join(' ')} style={{backgroundColor: '#F2F2F2'}}>
                <div className={['container', 'd-flex', 'flex-row', 'align-items-center', 'rtl', 'py-1', 'py-md-2', 'px-2'].join(' ')}>
                    <Breadcrumbs>
                    <p className={['p-1', 'mb-0', 'font11md14'].join(' ')} style={{backgroundColor: 'white', border: '1px solid #8bf0f7', borderRadius: '14px 1px 1px 14px'}}>اینجا هستید</p>
                        {
                            breadcrumbState.map((bread, count)=>{
                                return(
                                    <Link key={count} href={'/shop/product/category/' + bread.url} ><a className={['breadcrumbItem', 'mb-0', 'font11md14'].join(' ')} style={{}} >{bread.name}</a></Link>
                                );
                            })
                        }
                    </Breadcrumbs>
                </div>
            </div>
            <div className={['container'].join(' ')} >
                <div className={['row', 'rtl', 'mt-0', 'mt-md-3'].join(' ')}>
                    <div className={['col-12', 'col-md-5', 'px-0', 'px-md-2'].join(' ')}>
                        {
                            mainImageLoaded
                            ?
                            null
                            :
                            <Skeleton variant="rectangular" style={{width: '100%', height: '440px'}} />
                        }
                        <img src={'https://honari.com/image/resizeTest/shop/_1000x/thumb_' + productInformation.prodID + '.jpg'} className={[styles.mainImage, mainImageClass].join(' ')} style={{width: '100%'}} onLoad={mainImageOnLoadListener} />
                        {
                            aparatScript !== undefined && productInformation.aparat !== ''
                            ?
                            <Helmet>
                                {parse(aparatScript)}
                            </Helmet>
                            :
                            null
                        }
                        {
                            aparatScript !== undefined && productInformation.aparat !== ''
                            ?
                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-center', 'w-100', 'pb-2'].join(' ')} style={{position: 'relative', bottom: '40px'}}>
                                <img src={Constants.baseUrl + '/assets/images/academy.png'} className={['pointer'].join(' ')} onClick={videoImageClicked} style={{width: '40px', height: '40px'}} />
                            </div>
                            :
                            null
                        }
                        
                    </div>
                    <div className={['col-12', 'col-md-7', 'rtl', 'mt-3', 'mt-md-0'].join(' ')}>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between'].join(' ')}>
                            <h2 className={['mb-0', 'text-right', 'rtl'].join(' ')} style={{fontSize: '20px'}}>{props.name}</h2>
                            {   
                                productInformation.productStatus === 1  ?
                                    <div  className={['d-flex', 'flex-row', 'align-items-center', 'bg-success', 'rtl', 'py-1', 'px-2'].join(' ')} style={{color: 'white', borderRadius: '13px'}}>
                                        <img src={Constants.baseUrl + '/assets/images/main_images/tick_white_small.png'} style={{width: '12px', height: '12px'}} />
                                        <small className={['mb-0', 'mr-1'].join(' ')}>موجود</small>
                                    </div>
                                :
                                    (productInformation.productStatus === -1 ?
                                        <div className={['d-flex', 'flex-row', 'align-items-center', 'bg-danger', 'rtl', 'py-1', 'px-2'].join(' ')} style={{color: 'white', borderRadius: '13px'}}>
                                            <img src={Constants.baseUrl + '/assets/images/main_images/cross_white_small.png'} style={{width: '12px', height: '12px'}} />
                                            <small className={['mb-0', 'mr-1'].join(' ')}>ناموجود</small>
                                        </div>
                                    :
                                        (productInformation.productStatus === 0) ?
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'bg-warning', 'rtl', 'py-1', 'px-2'].join(' ')} style={{color: 'white', borderRadius: '13px'}}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/tick_white_small.png'} style={{width: '12px', height: '12px'}} />
                                                <small className={['mb-0', 'mr-1'].join(' ')}>بزودی</small>
                                            </div>
                                        :
                                            null
                                    )
                            }
                        </div>
                        {
                            productInformationReceived
                            ?
                            (
                                (productInformation.productStatus === 1) ? 
                                <React.Fragment>
                                <div className={['mt-3', 'mt-md-2'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
                                <h6 className={['w-100', 'mb-1', 'text-right', 'mt-4'].join(' ')} style={{fontSize: '18px'}}>انتخاب نوع بسته</h6>
                                <div className={['d-flex', 'flex-row', 'row', 'align-items-center', 'px-1'].join(' ')} style={{border: '1px solid #C4C4C4', borderRadius: '4px'}}>
                                    <input type='radio' className={['form-control'].join(' ')} checked={true} style={{width: '16px'}} value='سلام' />
                                    <label className={['mb-0', 'mr-1', 'text-right', 'rtl'].join(' ')}>{productInformation.productLabel}</label>
                                    {
                                        productInformation.productBasePrice !== undefined
                                        ?
                                        <label className={['mb-0', 'text-danger', 'mr-1', 'text-right', 'rtl'].join(' ')}>{'( هر واحد ' + productInformation.productBasePrice.toLocaleString() + ' تومان )'}</label>
                                        :
                                        null
                                    }
                                </div>
                                {
                                    productInformation.productPrice !== undefined && productInformation.discountedPrice !== undefined
                                    ?
                                    (
                                        productInformation.productPrice != productInformation.discountedPrice
                                        ?
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'mt-4'].join(' ')}>
                                                <h6 className={['mb-0']}>قیمت کالا : </h6>
                                                <h6 className={['text-secondary', 'mb-0', 'mr-2'].join(' ')}><del>{productInformation.productPrice.toLocaleString() + ' تومان '}</del></h6>
                                                <h6 className={['p-1', 'mb-0', 'bg-danger', 'text-white', 'rounded', 'mr-2', 'rtl'].join(' ')} style={{fontSize: '13px'}}>{'تخفیف ٪' + productInformation.discountPercent}</h6>
                                            </div>
                                        :
                                        null
                                    )
                                    : 
                                    null
                                }
                                {
                                    productInformation.productPrice !== productInformation.discountedPrice ?
                                        <div className={['d-flex', 'flex-row', 'align-items-center', 'mt-2'].join(' ')}>
                                            <h5 className={['mb-0']}>قیمت برای شما : </h5>
                                            <h5 className={['mb-0', 'mr-2'].join(' ')} style={{color: '#00bac6'}}>{productInformation.discountedPrice.toLocaleString() + ' تومان '}</h5>
                                        </div>
                                    :
                                        <div className={['d-flex', 'flex-row', 'align-items-center', 'mt-4'].join(' ')}>
                                            <h5 className={['mb-0']}>قیمت کالا : </h5>
                                            <h5 className={['mb-0', 'mr-2'].join(' ')} style={{color: '#00bac6'}}>{productInformation.productPrice.toLocaleString() + ' تومان '}</h5>
                                        </div>
                                }
                                {
                                    !productExistsOrNot() 
                                    ?
                                    (
                                        /*<div className={['d-flex', 'flex-row', 'align-items-center', 'mt-4'].join(' ')}>
                                            <h6 className={['mb-0'].join(' ')}>تعداد : </h6>
                                            <input type='number' className={['mr-1', 'text-center'].join(' ')} defaultValue='1' style={{width: '50px', outline: 'none', outlineStyle: 'none', borderStyle: 'none', border: '1px solid #C4C4C4', borderRadius: '4px'}} onChange={productCounterChanged} />
                                        </div>*/
                                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'mt-3'].join(' ')}>
                                            <img onClick={increaseOrderCountByOne} className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/plus_gray_circle.png'} style={{width: '26px', height: '26px'}} />
                                            <h6 className={['mb-0', 'px-3', 'text-center'].join(' ')} style={{fontSize: '17px', color: '#2B2B2B'}}>{orderCount}</h6>
                                            <img onClick={decreaseOrderCountByOne} className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/minus_gray_circle.png'} style={{width: '26px', height: '26px'}} />
                                        </div>
                                    )
                                    :
                                    null
                                }
                                {
                                    !productExistsOrNot() ?
                                        <button className={['d-flex', 'flex-row', 'align-items-center', 'btn', 'mt-4'].join(' ')} style={{backgroundColor: '#00bac6'}} onClick={addToCartButtonClicked}>
                                            <img src={Constants.baseUrl + '/assets/images/main_images/cart_white_small.png'} style={{width: '20px', height: '20px'}} />
                                            <span className={['text-white', 'mr-2'].join(' ')} >افزودن به سبد خرید</span>
                                        </button>
                                    :
                                    (
                                        productExistsOrNot() ?
                                        <React.Fragment>
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'text-right', 'rtl', 'mt-3'].join(' ')}>
                                                <img onClick={increaseButtonClicked} className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/plus_gray_circle.png'} style={{width: '26px', height: '26px'}} />
                                                <h6 className={['mb-0', 'px-3', 'text-center'].join(' ')} style={{fontSize: '17px', color: '#2B2B2B'}}>{getProductOrderCount()}</h6>
                                                {
                                                    getProductOrderCount() === 1
                                                    ?
                                                    <img onClick={removeFromCartButtonClicked} className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/bin_red.png'} style={{width: '26px', height: '26px'}} />
                                                    :
                                                    <img onClick={decreaseButtonClicked} className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/minus_gray_circle.png'} style={{width: '26px', height: '26px'}} />
                                                }
                                            </div>
                                        </React.Fragment>
                                        :
                                            null
                                        
                                    )
                                }
                                
                                </React.Fragment>
                                : 
                                    (productInformation.productStatus === -1 ?
                                        <div className={['rtl', 'text-right'].join(' ')}>
                                            <div className={['mt-3', 'mt-md-2'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
                                            <span className={['py-3', 'px-4', 'mt-2', 'd-inline-block'].join(' ')} style={{backgroundColor: '#8c8c8c', color: 'white', borderRadius: '4px'}}>موجود نیست</span>
                                            <div onClick={setReminderButtonClicked} className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'mt-3', 'd-none', 'pointer'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/bell_red.png'} style={{width: '24px', height: '24px'}} />
                                                <span className={['mr-1', 'pointer'].join(' ')} style={{color: '#00bac6'}}>درصورت موجود شدن به من اطلاع دهید</span>
                                            </div>
                                        </div>
                                    :
                                    (productInformation.productStatus === 0 ?
                                        <div className={['rtl', 'text-right'].join(' ')}>
                                            <div className={['mt-3', 'mt-md-2'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
                                            <span className={['py-3', 'px-4', 'mt-2', 'd-inline-block', 'bg-warning', 'text-dark'].join(' ')} style={{backgroundColor: '#8c8c8c', color: 'white', borderRadius: '4px'}}>بزودی ارائه میشود</span>
                                        </div>
                                    :
                                        null
                                    )
                                )
                            )
                            :
                            (
                                <React.Fragment>
                                    <Skeleton variant="text" style={{fontSize: '22px'}} />
                                    <Skeleton variant="text" style={{fontSize: '22px'}} />
                                    <Skeleton variant="text" style={{fontSize: '22px'}} />
                                    <Skeleton variant="text" style={{fontSize: '22px'}} />
                                </React.Fragment>
                            )
                        }
                        
                    </div>
                </div>
                <div className={['row', 'rtl', 'py-2', 'mt-4', 'shadow-sm', 'mb-0', 'mx-md-0', styles.banners].join(' ')}>
                    <div className={['col-4', 'd-flex', 'flex-column', 'flex-md-row', 'align-items-center', 'justify-content-center'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/stopwatch_black.png'} className={[styles.infoImage].join(' ')} />
                        <p className={['mb-0', 'mx-md-1', 'font-weight-bold', styles.info].join(' ')}>ارسال سریع سفارش</p>
                        <p className={['mb-0', styles.info].join(' ')}>به سراسر کشور</p>
                    </div>
                    <div className={['col-4', 'd-flex', 'flex-column', 'flex-md-row', 'align-items-center', 'justify-content-center'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/truck_black.png'} className={[styles.infoImage].join(' ')} />
                        <p className={['mb-0', 'mx-md-1', 'font-weight-bold', styles.info].join(' ')}>ارسال رایگان</p>
                        <p className={['mb-0', 'text-center', styles.info].join(' ')}>خرید بالای ۱۰۰ هزار تومان</p>
                    </div>
                    <div className={['col-4', 'd-flex', 'flex-column', 'flex-md-row', 'align-items-center', 'justify-content-center'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/return_black.png'} className={[styles.infoImage].join(' ')} />
                        <p className={['mb-0', 'mx-md-1', 'font-weight-bold', styles.info].join(' ')}>امکان مرجوعی کالا</p>
                        <p className={['mb-0', 'text-center', styles.info].join(' ')}>بدون محدودیت زمانی</p>
                    </div>
                </div>
            </div>
            <div className={['container-fluid', 'mt-0', 'mt-md-4'].join(' ')} style={{backgroundColor: '#F2F2F2'}}>
                <div className={['container', 'rtl'].join(' ')}>
                    <div className={['row', 'py-4', 'py-md-5', 'ltr'].join(' ')}>
                        <div className={['col-12', 'col-md-5', 'pl-1', 'px-0', 'px-md-3', 'rtl'].join(' ')}>
                            <div className={['d-flex', 'flex-row', 'align-items-center', 'mb-2'].join(' ')}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/paragraph_black.png'} style={{width: '16px', height: '16px'}} />
                                <h6 className={['mb-0', 'mr-2', 'font-weight-bold'].join(' ')}>توضیحات محصول</h6>
                            </div>
                            <div className={['mb-0', 'rtl', 'text-right', styles.infoContainer].join(' ')} style={{maxHeight: '250px', overflowY: 'scroll', scrollbarWidth: 'thin'}}>{parse(props.description)}</div>
                        </div>
                        <div className={['col-12', 'col-md-7', 'px-0', 'px-md-3', 'mt-3', 'mt-md-0', 'rtl'].join(' ')} >
                            <div className={['d-flex', 'flex-row', 'align-items-center', 'mb-2'].join(' ')}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/clipboard_black.png'} style={{width: '16px', height: '16px'}} />
                                <h6 className={['mb-0', 'mr-2', 'font-weight-bold'].join(' ')}>مشخصات محصول</h6>
                            </div>
                            <table className={['table', 'table-striped'].join(' ')} style={{border: '1px solid #dedede', borderRadius: '4px', backgroundColor: 'white'}}>
                                <tbody>
                                    {
                                        productFeaturesState.map((feature, index)=>{
                                            return(
                                                <tr key={index}>
                                                    <td className={['text-right', 'ltr'].join(' ')}>{feature.title}</td>
                                                    <td className={['text-right', 'ltr'].join(' ')} style={{borderRight: '1px dashed #DEDEDE'}}>{feature.value}</td>
                                                </tr> 
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className={['container'].join(' ')}>
                {
                    similarProducts.length !== 0
                    ?
                    <TopSixProducts title='محصولات مشابه' entries={similarProducts} />
                    :
                    null
                }
            </div>
        </React.Fragment>
        
    );
}

const mapStateToProps = (state) => {
    return {
        reduxUser: state.user,
        reduxCart: state.cart,
        reduxLoad: state.loading,
        reduxSnackbar: state.snackbars
    };
}

const mapDispatchToProps = (dispatch) => {
    return{
        reduxAddToCart: (d) => dispatch({type: actionTypes.ADD_TO_CART, data: d}),
        reduxUpdateUser: (d) => dispatch({type: actionTypes.UPDATE_USER, data: d}),
        reduxLogoutUser: () => dispatch({type: actionTypes.LOGOUT_USER}),
        reduxSetUserGuest: () => dispatch({type: actionTypes.SET_USER_GUEST}),
        reduxUpdateCart: (d) => dispatch({type: actionTypes.UPDATE_CART, data: d}),
        reduxStartLoading: () => dispatch({type: actionTypes.START_LOADING}),
        reduxStopLoading: () => dispatch({type: actionTypes.STOP_LOADING}),
        reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t}),
        reduxIncreaseCountByOne: (d) => dispatch({type: actionTypes.INCREASE_COUNT_BY_ONE, productPackId: d}),
        reduxDecreaseCountByOne: (d) => dispatch({type: actionTypes.DECREASE_COUNT_BY_ONE, productPackId: d}),
        reduxRemoveFromCart: (d) => dispatch({type: actionTypes.REMOVE_FROM_CART, productPackId: d}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductInsight);
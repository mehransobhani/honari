import React, { useEffect, useState } from 'react';
import * as actionTypes from '../../../store/actions';
import {connect} from 'react-redux';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import Head from 'next/head';
import * as Constants from '../../../components/constants';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

const ShoppingCart = (props) => {

    const [increaseProcessings, setIncreaseProcessings] = useState([]);
    const [decreaseProcessings, setDecreaseProcessings] = useState([]);
    const [removeProcessings, setRemoveProcessings] = useState([]);
    const [wipeProcessign, setWipeProcessing] = useState(false);
    const [axiosProcessInformation, setAxiosProcessInformation] = useState({type: 'nothing', index: -1});

    useEffect(() => {
        let newIncreaseProcessings = [];
        let newDecreaseProcessings = [];
        let newRemoveProcessings = [];
        props.reduxCart.information.map((item, counter) => {
            newIncreaseProcessings.push(false);
            newDecreaseProcessings.push(false);
            newRemoveProcessings.push(false);
        });
        setIncreaseProcessings(newIncreaseProcessings);
        setDecreaseProcessings(newDecreaseProcessings);
        setRemoveProcessings(newRemoveProcessings);
    }, [props.reduxCart.status, 'NI']);

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

    const yourCartIsEmptyComponent = (
        <div className={['container', 'mt-4'].join(' ')}>
            <div className={['row', 'mx-1'].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'p-3'].join(' ')} style={{borderRadius: '3px', border: '1px solid #DEDEDE'}}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/shopping_cart_yellow.png'} style={{width: '100px', height: '100px'}}/> 
                    <h6 className={['text-center', 'mb-0', 'mt-4'].join(' ')}>سبد خرید شما خالی است</h6>
                </div>
            </div>
        </div>
    )

    const getTotalCartPrice = () => {
        let price = 0;
        props.reduxCart.information.map((item, counter) => {
            price += (item.price * item.count);
        });
        return price;
    }

    const getTotalDiscountedPrice = () => {
        let price = 0;
        props.reduxCart.information.map((item, counter) => {
            price += (item.discountedPrice * item.count);
        });
        return price;
    }

    const getTotalDiscount = () => {
        let price = 0;
        props.reduxCart.information.map((item, counter) => {
            price += (item.price - item.discountedPrice) * item.count;
        });
        return price;
    }

    const updateProductInLocalStorage = (index, count) => {
        let localStorageCart = JSON.parse(localStorage.getItem('user_cart'));
        console.warn(localStorageCart);
        localStorageCart[index].count = count;
        localStorage.setItem('user_cart', JSON.stringify(localStorageCart));
    }

    const increaseProductCountByOne = (key) => {
        if(axiosProcessInformation.index !== key){
            if(props.reduxUser.status == 'GUEST'){
                setAxiosProcessInformation({type: 'increase', index: key});
                axios.post(Constants.apiUrl + '/api/guest-check-cart-changes', {
                    productPackId: props.reduxCart.information[key].productPackId,
                    count: props.reduxCart.information[key].count + 1
                }).then((res) => {
                    let response = res.data;
                    if(response.status == 'done'){
                        updateProductInLocalStorage(key, response.count);
                        props.reduxIncreaseCountByOne(props.reduxCart.information[key].productPackId);
                    }else if(response.status == 'failed'){
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                }).catch((error) => {
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                });
            }else if(props.reduxUser.status === 'LOGIN'){
                setAxiosProcessInformation({type: 'increase', index: key});
                axios.post(Constants.apiUrl + '/api/user-increase-cart-by-one', {
                    productPackId: props.reduxCart.information[key].productPackId
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
                    }
                }).then((res) => {
                    let response = res.data;
                    if(response.status == 'done'){
                        props.reduxIncreaseCountByOne(props.reduxCart.information[key].productPackId);
                    }else if(response.status == 'failed'){
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                }).catch((error) => {
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                });
            }
        }
    }

    const decreaseProductCountByOne = (key) => {
        if(props.reduxCart.information[key].count == 1){
            return;
        }
        if(axiosProcessInformation.index !== key){
            if(props.reduxUser.status == 'GUEST'){
                setAxiosProcessInformation({type: 'decrease', index: key});
                axios.post(Constants.apiUrl + '/api/guest-check-cart-changes', {
                    productPackId: props.reduxCart.information[key].productPackId,
                    count: props.reduxCart.information[key].count - 1
                }).then((res) => {
                    let response = res.data;
                    if(response.status == 'done'){
                        updateProductInLocalStorage(key, response.count);
                        props.reduxDecreaseCountByOne(props.reduxCart.information[key].productPackId);
                    }else if(response.status == 'failed'){
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                }).catch((error) => {
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                });
            }else if(props.reduxUser.status == 'LOGIN'){
                setAxiosProcessInformation({type: 'decrease', index: key});
                axios.post(Constants.apiUrl + '/api/user-decrease-cart-by-one', {
                    productPackId: props.reduxCart.information[key].productPackId
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
                    }
                }).then((res) => {
                    let response = res.data;
                    if(response.status == 'done'){
                        props.reduxDecreaseCountByOne(props.reduxCart.information[key].productPackId);
                    }else if(response.status === 'failed'){
                        console.log(response.message);
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                }).catch((error) => {
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                });
            }
        }
    }

    const removeProductFromCart = (key) => {
        if(axiosProcessInformation.index !== key){
            if(props.reduxUser.status === 'GUEST'){              
                props.reduxRemoveFromCart(props.reduxCart.information[key].productPackId);
            }else if(props.reduxUser.status === 'LOGIN'){
                setAxiosProcessInformation({type: 'remove', index: key});
                axios.post(Constants.apiUrl + '/api/user-remove-from-cart', {
                    productPackId: props.reduxCart.information[key].productPackId
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
                    }
                }).then((res) => {
                    let response = res.data;
                    if(response.status == 'done'){
                        props.reduxRemoveFromCart(props.reduxCart.information[key].productPackId);
                    }else if(response.status == 'failed'){
                        console.error(response.message);
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                }).catch((error) => {
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                });
            }
        }
    }

    const wipeTheCart = () => {
        if(!wipeProcessign){
            if(props.reduxUser.status === 'GUEST'){
                localStorage.setItem('[]');
                props.reduxWipeCart();
            }else if(props.reduxUser.status === 'LOGIN'){
                axios.post(Constants.apiUrl + "/api/user-wipe-cart", {}, {
                    headers: {
                        'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
                    }
                }).then((res) => {
                    let response = res.data;
                    if(response.status === 'done'){
                        props.reduxUpdateSnackbar('success', true, 'سبد خرید با موفقیت خالی شد');
                        props.reduxWipeCart();
                    }else if (response.staus === 'failed'){
                        console.warn(response.message);
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                }).catch((error) => {
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                });
            }
        }
    }

    const continueShoppingButtonClicked = () => {
        window.history.go(-1);
    }


    return(
        <React.Fragment>
            <Head>
                <title>سبد خرید کاربر | هنری</title>
                <link rel="icon" href={ Constants.baseUrl + "/favicon.ico"} type="image/x-icon"/>
            </Head>
            <Header menu={props.ssrMenu} />
            {
                props.reduxCart.status === 'HI' && props.reduxCart.information.length !== 0
                ?
                (
                    <React.Fragment>
                    <div className={['container', 'mt-4', 'd-none', 'd-md-block'].join(' ')}>
                        <div className={['row'].join(' ')}>
                            <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between'].join(' ')}>
                                <div className={['d-flex', 'flex-column', 'align-items-right'].join(' ')}>
                                    <div className={['d-flex', 'felx-row', 'rtl', 'align-items-center', 'justify-content-right'].join(' ')}>
                                        <img src={Constants.baseUrl + '/assets/images/header_cart.png'} style={{width: '20px', heigth: '20px'}} />
                                        <h5 className={['text-right', 'rtl', 'mb-0', 'pr-1', 'font-weight-bold'].join(' ')} style={{fontSize: '24px', color: '#444444'}}>سبد خرید شما</h5>
                                    </div>
                                    <p className={['mb-0', 'py-2'].join(' ')} style={{fontSize: '14px', color: '#444444'}}>وجود کالاها در سبدخرید به معنی رزرو آنها نیست و تا زمان موجود بودن در سبد خرید خواهند ماند</p>
                                </div>
                                <Link href={'/cart/payment'}>
                                <div onClick={props.reduxStartLoading} className={['d-flex', 'felx-row', 'px-3', 'py-2', 'align-items-center', 'justify-content-center', 'pointer'].join(' ')} style={{borderRadius: '2px', background: '#00BAC6'}}>
                                    <h6 className={['mb-0'].join(' ')} style={{fontSize: '17px', color: 'white'}}>ادامه ثبت سفارش</h6>
                                    <img className={['mr-2'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/left_arrow_white_small.png'} style={{width: '10px', height: '10px'}} />
                                </div>
                                </Link>
                            </div>
                        </div>
                        <div className={['row', 'px-3'].join(' ')}>
                            <div className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'ltr', 'py-2', 'px-0'].join(' ')} style={{background: '#F7F7F7', border: '1px solid #DEDEDE'}}>
                                <div style={{width: '40px'}}></div>
                                <div className={['d-flex', 'flex-row', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                                    <h6 className={['mb-0', 'text-center'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '1'}}>قیمت کل</h6>
                                    <h6 className={['mb-0', 'text-center'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '1'}}>تعداد</h6>
                                    <h6 className={['mb-0', 'text-center'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '1'}}>قیمت هر واحد</h6>
                                    <h6 className={['mb-0', 'text-center'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '1.3'}}>واحد فروش</h6>
                                    <h6 className={['mb-0', 'text-right', 'pr-3'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '2'}}>محصول</h6>
                                </div>
                            </div>
                            {
                                props.reduxCart.information.map((product, counter) => {
                                    return (
                                        <div key={counter} className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'ltr', 'p-0'].join(' ')} style={{background: 'white', borderRight: '1px solid #DEDEDE', borderBottom: '1px solid #DEDEDE', borderLeft: '1px solid #DEDEDE'}}>
                                            <div className={['d-flex', 'felx-row', 'align-items-center', 'justify-content-center'].join(' ')} style={{width: '40px', height: '100%', borderRight: '1px solid #DEDEDE', background: '#F7F7F7'}}>
                                                <img className={['pointer'].join(' ')} src={Constants.baseUrl + (axiosProcessInformation.type === 'remove' && axiosProcessInformation.index === counter ? '/assets/images/main_images/loading_circle_dotted.png' : '/assets/images/main_images/bin_red.png')} style={{width: '18px', height: '18px'}} onClick={() => {removeProductFromCart(counter)}} />
                                            </div>
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'py-2', 'pr-2'].join(' ')} style={{flex: '1'}}>
                                                {
                                                    product.price === 0
                                                    ?
                                                        <div style={{flex: '1'}}></div>
                                                    :
                                                    (
                                                        product.price === product.discountedPrice
                                                        ?
                                                        <h6 className={['mb-0', 'text-center', 'rtl'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '1'}}>{(product.price * product.count).toLocaleString() + " تومان"}</h6>
                                                        :
                                                        (
                                                            <div className={['d-flex', 'flex-column', 'justify-content-center', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                                                                <h6 className={['mb-0', 'text-center', 'rtl'].join(' ')} style={{fontSize: '17px', color: 'gray'}}><del>{(product.price * product.count).toLocaleString()}</del></h6>
                                                                <h6 className={['mb-0', 'text-center', 'mt-1', 'rtl'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>{(product.discountedPrice * product.count).toLocaleString() + " تومان"}</h6>
                                                            </div>
                                                        )
                                                    )
                                                }
                                                {
                                                    product.price == 0
                                                    ?
                                                        <div style={{flex: '1'}}></div>
                                                    :
                                                    (
                                                        <div className={['mb-0', 'text-center', 'ltr', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-center'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '1'}}>
                                                            <img className={['pointer'].join(' ')} src={Constants.baseUrl + (axiosProcessInformation.type === 'decrease' && axiosProcessInformation.index === counter ? '/assets/images/main_images/loading_circle_dotted.png' : '/assets/images/main_images/minus_gray_circle.png')} style={{width: '20px', height: '20px'}} onClick={() => {decreaseProductCountByOne(counter)}} />
                                                            <h6 className={['mb-0', 'px-2'].join(' ')} style={{fontSize: '17px'}}>{product.count}</h6>
                                                            <img className={['pointer'].join(' ')} src={Constants.baseUrl + (axiosProcessInformation.type === 'increase' && axiosProcessInformation.index === counter ? '/assets/images/main_images/loading_circle_dotted.png' : '/assets/images/main_images/plus_gray_circle.png')} style={{width: '20px', height: '20px'}} onClick={() => {increaseProductCountByOne(counter)}} />
                                                        </div>
                                                    )
                                                }
                                                {
                                                    product.price === 0
                                                    ?
                                                    <div style={{flex: '1'}}></div>
                                                    :
                                                    (
                                                        product.price === product.discountedPrice
                                                        ?
                                                        <h6 className={['mb-0', 'text-center', 'rtl'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '1'}}>{product.price.toLocaleString() + " تومان"}</h6>
                                                        :
                                                        (
                                                            <div className={['d-flex', 'flex-column', 'justify-content-center'].join(' ')} style={{flex: '1'}}>
                                                                    <h6 className={['mb-0', 'text-center'].join(' ')} style={{fontSize: '17px', color: 'gray'}}><del>{product.price.toLocaleString()}</del></h6>
                                                                    <h6 className={['mb-0', 'text-center', 'mt-1', 'rtl'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>{product.discountedPrice.toLocaleString() + " تومان"}</h6>
                                                            </div>
                                                        )
                                                    )
                                                }
                                                <h6 className={['mb-0', 'text-center', 'rtl'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '1.3'}}>{product.price === 0 ? 'موجود نیست !' : product.label}</h6>
                                                <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right'].join(' ')} style={{flex: '2'}}>
                                                    <img src={'https://honari.com/image/resizeTest/shop/_85x/thumb_' + product.prodID + '.jpg'} style={{width: '100px', height: '100px'}} />
                                                    <h6 className={['mb-0', 'pr-1', 'rtl', 'text-right', 'mt-1'].join(' ')} style={{fontSize: '17px', color: '#444444', lineHeight: '1.6rem'}}>{product.name}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            <div className={['col-12', 'd-flex', 'flex-row', 'justify-content-left', 'ltr', 'px-0', 'mt-2'].join(' ')}>
                                <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-center'].join(' ')} style={{width: '40px', background: '#F7F7F7', borderLeft: '1px solid #DEDEDE', borderTop: '1px solid #DEDEDE', borderBottom: '1px solid #DEDEDE'}}>
                                    <img className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/bin_red.png'} style={{width: '20px', height: '20px'}} onClick={() => {wipeTheCart()}} />
                                </div>
                                <div className={['d-flex', 'flex-column', 'rtl'].join(' ')} style={{border: '1px solid #DEDEDE', width: '30%'}}>
                                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                                        <h6 className={['text-right', 'p-2', 'mb-0'].join(' ')} style={{fontSize: '14px', color: '#444444', flex: '1', borderLeft: '1px dashed #DEDEDE'}}>مجموع خرید شما</h6>
                                        <h6 className={['text-center', 'p-2', 'mb-0'].join(' ')} style={{fontSize: '14px', color: '#444444', flex: '1'}}>{getTotalCartPrice().toLocaleString() + " تومان"}</h6>
                                    </div>
                                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                                        <h6 className={['text-right', 'p-2', 'mb-0'].join(' ')} style={{fontSize: '14px', color: '#F15F58', flex: '1', borderLeft: '1px dashed #DEDEDE'}}>تخفیف</h6>
                                        <h6 className={['text-center', 'p-2', 'mb-0'].join(' ')} style={{fontSize: '14px', color: '#F15F58', flex: '1'}}>{getTotalDiscount().toLocaleString() + " تومان"}</h6>
                                    </div>
                                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')}>
                                        <h6 className={['text-right', 'p-2', 'mb-0'].join(' ')} style={{fontSize: '14px', color: '#444444', flex: '1', borderLeft: '1px dashed #DEDEDE'}}>مبلغ قابل پرداخت</h6>
                                        <h6 className={['text-center', 'p-2', 'mb-0'].join(' ')} style={{fontSize: '14px', color: '#444444', flex: '1'}}>{getTotalDiscountedPrice().toLocaleString() + " تومان"}</h6>
                                    </div>
                                </div>
                            </div>
                            <div className={['col-12', 'px-0', 'mt-2', 'd-flex', 'flex-row', 'ltr', 'align-items-center', 'justify-content-between'].join(' ')}>
                                <Link href={'/cart/payment'}>
                                <div onClick={props.reduxStartLoading} className={['d-flex', 'felx-row', 'px-3', 'py-2', 'align-items-center', 'justify-content-center', 'rtl', 'pointer'].join(' ')} style={{borderRadius: '2px', background: '#00BAC6'}}>
                                    <h6 className={['mb-0'].join(' ')} style={{fontSize: '17px', color: 'white'}}>ادامه ثبت سفارش</h6>
                                    <img className={['mr-2'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/left_arrow_white_small.png'} style={{width: '10px', height: '10px'}} />
                                </div>
                                </Link>
                                <div onClick={continueShoppingButtonClicked} className={['d-flex', 'flex-row', 'px-3', 'py-2', 'align-items-center', 'justify-content-center', 'rtl', 'pointer'].join(' ')}>
                                    <img src={Constants.baseUrl + '/assets/images/main_images/right_arrow_black.png'} className={['ml-2'].join(' ')} style={{width: '10px', height: '10px'}} />
                                    <h6 className={['mb-0'].join(' ')} style={{fontSize: '17px'}}>بازگشت به ادامه خرید</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={['container', 'mt-4', 'd-md-none'].join(' ')} style={{}}>
                        <div className={['row'].join(' ')}>
                            <div className={['col-12', 'd-flex', 'flex-column', 'justify-content-right', 'align-items-right'].join(' ')}>
                                <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')}>
                                    <img src={Constants.baseUrl + '/assets/images/header_cart.png'} style={{width: '14px', height: '14px'}} />
                                    <h6 className={['mb-0', 'rtl', 'text-right', 'mr-1'].join(' ')} style={{fontSize: '22px', color: '#444444'}}>سبد خرید شما</h6>
                                </div>
                                <p className={['mb-0', 'text-right', 'rtl', 'mt-1', 'mt-md-0'].join(' ')} style={{fontSize: '14px', color: '#444444'}}>وجود کالاها در سبدخرید به معنی رزرو آنها نیست و تا زمان موجود بودن در سبد خرید خواهند ماند</p>
                            </div>
                            <div className={['col-12', 'px-3', 'pt-3', 'pb-0'].join(' ')}>
                                <div className={['d-flex', 'flex-row', 'rtl', 'justify-content-between', 'px-2', 'py-3'].join(' ')} style={{borderRadius: '2px 2px 0 0', border: '1px solid #D8D8D8'}}>
                                    <h6 className={['text-right', 'mb-0'].join(' ')} style={{fontSize: '14px'}}>مبلغ قابل پرداخت</h6>
                                    {
                                        getTotalCartPrice() === getTotalDiscountedPrice()
                                        ?
                                        <h6 className={['text-left', 'rtl', 'mb-0', 'font-weight-bold'].join(' ')} style={{fontSize: '16px'}}>{getTotalCartPrice().toLocaleString() + " تومان"}</h6>
                                        :
                                        (
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'rtl'].join(' ')}>
                                                <h6 className={['text-right', 'rtl', 'pl-1', 'mb-0'].join(' ')} style={{fontSize: '17px', color: 'gray'}}><del>{getTotalCartPrice().toLocaleString()}</del></h6>
                                                <h6 className={['text-right', 'rtl', 'mb-0'].join(' ')} style={{fontSize: '17px'}}>{getTotalDiscountedPrice().toLocaleString() + " تومان"}</h6>
                                            </div>
                                        )
                                    }
                                </div>
                                <Link href={'/cart/payment'}>
                                <div onClick={props.reduxStartLoading} className={['d-flex', 'felx-row', 'px-3', 'py-2', 'align-items-center', 'justify-content-center', 'rtl', 'mb-0', 'pointer'].join(' ')} style={{borderRadius: '0 0 2px 2px', background: '#00BAC6'}}>
                                    <h6 className={['mb-0'].join(' ')} style={{fontSize: '17px', color: 'white'}}>ادامه ثبت سفارش</h6>
                                    <img className={['mr-2'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/left_arrow_white_small.png'} style={{width: '10px', height: '10px'}} />
                                </div>
                                </Link>
                            </div>
                        </div>
                        <div className={['row', 'px-3', 'mt-0'].join(' ')}>
                            {
                                props.reduxCart.information.map((product, counter) => {
                                    return(
                                        <div key={counter} className={['col-12', 'p-0', 'mt-3'].join(' ')} style={{borderRadius: '2px', border: '1px solid #D8D8D8'}}>
                                            <div className={['d-flex', 'flex-row', 'ltr', 'pb-0', 'pl-1', 'pt-1'].join(' ')}>
                                                <img src={Constants.baseUrl + (axiosProcessInformation.type === 'remove' && axiosProcessInformation.index === counter ? '/assets/images/main_images/loading_circle_dotted.png' : '/assets/images/main_images/bin_red.png')} className={['pointer'].join(' ')} style={{width: '18px', height: '18px', position: 'relative', bottom: '-0.3rem', left: '0.3rem'}} onClick={() => {removeProductFromCart(counter)}} />
                                            </div>
                                            <div className={['d-flex', 'flex-row', 'rtl', 'px-3'].join(' ')}>
                                                <img src={'https://honari.com/image/resizeTest/shop/_85x/thumb_' + product.prodID + '.jpg'} style={{width: '77px', height: '77px'}} />
                                                <div className={['d-flex', 'flex-column', 'pr-2'].join(' ')} style={{flex: '1'}}>
                                                    <h6 className={['text-right', 'rtl', 'mb-0', 'mt-1'].join(' ')} style={{fontSize: '17px', color: '#444444', lineHeight: '1.6rem'}}>{product.name}</h6>
                                                    <h6 className={['text-right', 'rtl', 'mb-0', 'mt-auto'].join(' ')} style={{fontSize: '14px', color: '#444444'}}>{product.price === 0 ? 'موجود نیست !' : product.label}</h6>
                                                </div>
                                            </div>
                                            <div className={['mx-3', 'mt-4', 'mb-3'].join(' ')} style={{height: '1px', background: product.price == 0 ? '#FFFFFF' :'#D8D8D8'}}></div>
                                            <div className={[product.price === 0 ? 'd-none' : 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'rtl', 'px-3',].join(' ')}>
                                                <h6 className={['text-right'].join(' ')} style={{fontSize: '14px'}}>قیمت هر واحد</h6>
                                                {
                                                    product.price === product.discountedPrice
                                                    ?
                                                        <h6 className={['text-right', 'rtl'].join(' ')} style={{fontSize: '17px'}}>{product.price.toLocaleString() + " تومان"}</h6>
                                                    :
                                                    (
                                                        <div className={['d-flex', 'flex-row', 'align-items-center', 'rtl'].join(' ')}>
                                                            <h6 className={['text-right', 'rtl', 'pl-1'].join(' ')} style={{fontSize: '17px', color: 'gray'}}><del>{product.price.toLocaleString()}</del></h6>
                                                            <h6 className={['text-right', 'rtl'].join(' ')} style={{fontSize: '17px'}}>{product.discountedPrice.toLocaleString() + " تومان"}</h6>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className={[product.price === 0 ? 'd-none' : 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'rtl', 'px-3', 'py-1'].join(' ')}>
                                                <h6 className={['text-right', 'mb-0'].join(' ')} style={{fontSize: '14px'}}>تعداد</h6>
                                                <div className={['d-flex', 'flex-row', 'align-items-center', 'ltr'].join(' ')}>
                                                    <img src={Constants.baseUrl + (axiosProcessInformation.type === 'decrease' && axiosProcessInformation.index === counter ? '/assets/images/main_images/loading_circle_dotted.png' : '/assets/images/main_images/minus_gray_circle.png')} className={['pointer'].join(' ')} style={{width: '20px', height: '20px'}} onClick={() => {decreaseProductCountByOne(counter)}} />
                                                    <h6 className={['px-2', 'mb-0'].join(' ')} style={{fontSize: '17px', color: '14px'}}>{product.count}</h6>
                                                    <img src={Constants.baseUrl + (axiosProcessInformation.type === 'increase' && axiosProcessInformation.index === counter ? '/assets/images/main_images/loading_circle_dotted.png' : '/assets/images/main_images/plus_gray_circle.png')} className={['pointer'].join(' ')} style={{width: '20px', height: '20px'}} onClick={() => {increaseProductCountByOne(counter)}} />
                                                </div>
                                            </div>
                                            <div className={[product.price === 0 ? 'd-none' : 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'rtl', 'px-3', 'mt-2', 'pt-2'].join(' ')} style={{background: '#F7F7F7', borderTop: '1px dashed #DEDEDE'}}>
                                                <h6 className={['text-right'].join(' ')} style={{fontSize: '17px'}}>قیمت نهایی کالا</h6>
                                                {
                                                    product.price === product.discountedPrice
                                                    ?
                                                        <h6 className={['text-right', 'rtl'].join(' ')} style={{fontSize: '17px'}}>{(product.price * product.count).toLocaleString() + " تومان"}</h6>
                                                    :
                                                    (
                                                        <div className={['d-flex', 'flex-row', 'align-items-center', 'rtl'].join(' ')}>
                                                            <h6 className={['text-right', 'rtl', 'pl-1'].join(' ')} style={{fontSize: '17px', color: 'gray'}}><del>{(product.price * product.count).toLocaleString()}</del></h6>
                                                            <h6 className={['text-right', 'rtl'].join(' ')} style={{fontSize: '17px'}}>{(product.discountedPrice * product.count).toLocaleString() + " تومان"}</h6>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            <div className={['col-12', 'pt-3', 'pb-0', 'px-0'].join(' ')}>
                                <div className={['d-flex', 'flex-row', 'rtl', 'justify-content-between', 'p-2'].join(' ')} style={{borderRadius: '2px', border: '1px solid #D8D8D8'}}>
                                    <h6 className={['text-right', 'mb-0'].join(' ')} style={{fontSize: '13px'}}>مجموع خرید شما</h6>
                                    {
                                        getTotalCartPrice() === getTotalDiscountedPrice()
                                        ?
                                        <h6 className={['text-left', 'rtl', 'mb-0', 'font-weight-bold'].join(' ')} style={{fontSize: '16px'}}>{getTotalCartPrice().toLocaleString() + " تومان"}</h6>
                                        :
                                        (
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'rtl'].join(' ')}>
                                                <h6 className={['text-right', 'rtl', 'pl-1', 'mb-0'].join(' ')} style={{fontSize: '14px', color: 'gray'}}><del>{getTotalCartPrice().toLocaleString()}</del></h6>
                                                <h6 className={['text-right', 'rtl', 'mb-0'].join(' ')} style={{fontSize: '14px'}}>{getTotalDiscountedPrice().toLocaleString() + " تومان"}</h6>
                                            </div>
                                        )
                                    }
                                </div>
                                <Link href={'/cart/payment'}>
                                <div onClick={props.reduxStartLoading} className={['d-flex', 'felx-row', 'px-3', 'py-2', 'align-items-center', 'justify-content-center', 'rtl', 'mb-0', 'mt-3', 'pointer'].join(' ')} style={{borderRadius: '2px', background: '#00BAC6'}}>
                                    <h6 className={['mb-0'].join(' ')} style={{fontSize: '17px', color: 'white'}}>ادامه ثبت سفارش</h6>
                                    <img className={['mr-2'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/left_arrow_white_small.png'} style={{width: '10px', height: '10px'}} />
                                </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    </React.Fragment>
                )
                :
                (
                    props.reduxCart.status === 'HI' && props.reduxCart.information.length === 0
                    ?
                    yourCartIsEmptyComponent
                    :
                    null
                )
            }
            <Footer />
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        reduxUser: state.user,
        reduxCart: state.cart,
        reduxLoad: state.loading
    };
}

const mapDispatchToProps = (dispatch) => {
    return{
        reduxUpdateCart: (d) => dispatch({type: actionTypes.UPDATE_CART, data: d}),
        //reduxAddToCart: (d) => dispatch({type: actionTypes.ADD_TO_CART, data: d}),
        reduxIncreaseCountByOne: (d) => dispatch({type: actionTypes.INCREASE_COUNT_BY_ONE, productPackId: d}),
        reduxDecreaseCountByOne: (d) => dispatch({type: actionTypes.DECREASE_COUNT_BY_ONE, productPackId: d}),
        reduxRemoveFromCart: (d) => dispatch({type: actionTypes.REMOVE_FROM_CART, productPackId: d}),
        reduxWipeCart: () => dispatch({type: actionTypes.WIPE_CART}),
        reduxUpdateUserTotally: (d) => dispatch({type: actionTypes.UPDATE_USER_TOTALLY, data: d}),
        reduxStopLoading: () => dispatch({type: actionTypes.STOP_LOADING}),
        reduxStartLoading: () => dispatch({type: actionTypes.START_LOADING}),
        reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);

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
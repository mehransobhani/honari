import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../../../../components/Header/Header';
import Footer from '../../../../components/Footer/Footer';
import * as Constants from '../../../../components/constants';
import * as actionTypes from '../../../../store/actions';
import {connect, useStore} from 'react-redux';
import axios from 'axios';
import { NewReleasesRounded } from '@material-ui/icons';

const DeliveryReview = (props) => {

    const [giftCodeCheckboxSelected, setGiftCodeCheckboxSelected] = useState(false);
    const [walletCheckboxSelected, setWalletCheckboxSelected] = useState(false);
    const [giftCodeInputText, setGiftCodeInputText] = useState('');
    const [addedGiftCodes, setAddedGiftCodes] = useState([]);
    const [userOrderPriceInformation, setUserOrderPriceInformation] = useState({price: 0, discountedPrice: 0});
    const [userShippingPriceInformation, setUserShippingPriceInformation] = useState({price: 0, discountedPrice: 0});
    const [approvedGiftCodesInformation, setApprovedGiftCodesInformation] = useState([]);
    const [hasUnjoinableCode, setHasUnjoinableCode] = useState(false);
    const [userStock, setUserStock] = useState(0);
    const [orderId, setOrderId] = useState(0);
    const [orderStage, setOrderStage] = useState('');
    const [paymentButtonText, setPaymentButtonText] = useState('تایید و پرداخت سفارش');
    const [requestWaiting, setRequstWaiting] = useState(false);

    /*useEffect(() => {
        props.reduxUpdateUserTotally(props.ssrUser);
        if(props.ssrUser.status === 'LOGIN'){
            console.warn(props.ssrUser.information);
            axios.post(Constants.apiUrl + "/api/user-special-cart", {},{
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
            window.location.href = 'https://honari.com/user/login';
        }
    }, []);*/

    useEffect(() => {
        props.reduxUpdateUserTotally(props.ssrUser);
        axios.post(Constants.apiUrl + '/api/user-final-cart', {}, {
            headers: {
                'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
            }
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                let information = response.information;
                let cartArray = [];
                information.cart.map((item, counter) => {
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
                setUserOrderPriceInformation({price: information.orderPrice, discountedPrice: information.orderDiscountedPrice});
                setUserShippingPriceInformation({price: information.shippingPrice, discountedPrice: information.shippingDiscountedPrice});
                setUserStock(information.userStock);
            }else if(response.status === 'failed'){ 
                props.reduxUpdateSnackbar('error', 'true', response.umessage);
            }
        }).catch((error) => {
            console.error(error);
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
        });
    }, []);

    useEffect(() => {
        axios.post(Constants.apiUrl + '/api/user-check-temporary-delivery-info-existance', {}, {
            headers: {
                'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
            }
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                if(response.found === false){
                    window.location.href = "/cart/payment";
                }
            }else if(response.status === 'failed'){ 
                console.error(response.message);
                props.reduxUpdateSnackbar('error', true, response.umessage);
            }
        }).catch((error) => {
            console.error(error);
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
        });
    }, []);

    const giftCodeInputChanged = (event) => {
        setGiftCodeInputText(event.target.value);
    }

    const insertGiftCodeClicked = () => {
        if(giftCodeInputText.length == 0){
            props.reduxUpdateSnackbar('warning', true, 'لطفا کد تخفیف موردنظر را وارد کنید');
            return 0;
        }
        let has = 0;
        if(approvedGiftCodesInformation.length !== 0){
            has = 1;
        }
        axios.post(Constants.apiUrl + '/api/user-check-gift-code', {
            has: has,
            giftCode: giftCodeInputText,
        }, {
            headers: {
                'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
            }
        }).then((res) => {
            let response = res.data;
            if(response.status === 'failed' || response.allowed === false){
                console.warn(response.message);
                props.reduxUpdateSnackbar('warning', true, response.umessage);
            }else if(response.allowed === true){
                let found = false;
                approvedGiftCodesInformation.map((item, index) => {
                    if(item.type === response.type && item.discountPrice === response.discountPrice && item.code === giftCodeInputText){
                        found = true;
                    }
                });
                if(!found){
                    if((approvedGiftCodesInformation.length === 0 && response.joinable === 0) || (response.joinable === 1 && !hasUnjoinableCode)){
                        if(response.type === 'order'){
                            if(userOrderPriceInformation.discountedPrice - response.discountPrice < 0){
                                setUserOrderPriceInformation({price: userOrderPriceInformation.price, discountedPrice: 0});
                            }else{
                                setUserOrderPriceInformation({price: userOrderPriceInformation.price, discountedPrice: userOrderPriceInformation.discountedPrice - response.discountPrice});
                            }
                            /*if(response.discountPrice + userOrderPriceInformation.discountedPrice >= userOrderPriceInformation.price){
                                setUserOrderPriceInformation({price: userOrderPriceInformation.price, discountedPrice: 0});
                            }else{
                                
                            }*/
                        }else if(response.type === 'shipping'){
                            if(userShippingPriceInformation.discountedPrice - response.discountedPrice < 0){
                                setUserShippingPriceInformation({price: userShippingPriceInformation.price, discountedPrice: 0});
                            }else{
                                setUserShippingPriceInformation({price: userShippingPriceInformation.price, discountedPrice: userShippingPriceInformation.discountedPrice - response.discountPrice});
                            }
                        }
                        let newApprovedGiftCodes = [];
                        approvedGiftCodesInformation.map((item, counter) => {
                            newApprovedGiftCodes.push(item);
                        });
                        newApprovedGiftCodes.push({code: giftCodeInputText, type: response.type, joinable: response.joinable, discountPrice: response.discountPrice});
                        setApprovedGiftCodesInformation(newApprovedGiftCodes);
                        if(response.joinable === 0){
                            setHasUnjoinableCode(true);
                        }
                    }else{
                        props.reduxUpdateSnackbar('warning', true, 'نمیتوانید این کدهای تخفیف را با هم استفاده کنید');
                    }
                }else{
                    props.reduxUpdateSnackbar('warning', true, 'شما یک بار این کد تخفیف را وارد کرده اید');
                }
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    const toggleUserWalletUsage = (status) => {
        setWalletCheckboxSelected(status);
        /*let orderPrice = userOrderPriceInformation.price;
        let orderDiscountedPrice = userOrderPriceInformation.discountedPrice;
        if(status){
            let newOrderPrice = orderPrice - userStock;
            let newOrderDiscountedPrice = orderDiscountedPrice - userStock;
            setUserOrderPriceInformation({price: newOrderPrice, discountedPrice: newOrderDiscountedPrice});
        }else{
            let newOrderPrice = orderPrice + userStock;
            let newOrderDiscountedPrice = orderDiscountedPrice + userStock;
            setUserOrderPriceInformation({price: newOrderPrice, discountedPrice: newOrderDiscountedPrice});
        }*/
    }

    const totalPriceComponent = () => {
        /*
<div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'px-2', 'py-1'].join(' ')} style={{background: '#F7F7F7'}}>
                                    <h6 className={['mb-0'].join(' ')} style={{fontSize: '17px', color: '#2B2B2B'}}>مبلغ نهایی سفارش : </h6>
                                    {
                                        userOrderPriceInformation.price + userShippingPriceInformation.price === userOrderPriceInformation.discountedPrice + userShippingPriceInformation.discountedPrice
                                        ?
                                        <h6 className={['mb-0'].join(' ')} style={{fontSize: '17px', color: 'red'}}>{(userOrderPriceInformation.price + userShippingPriceInformation.price).toLocaleString() + " تومان"}</h6>
                                        :
                                        <div className={['d-flex', 'flex-row', 'align-items-center', 'rtl'].join(' ')}>
                                            <h6 className={['mb-0', 'pr-2'].join(' ')} style={{fontSize: '17px', color: 'gray'}}><del>{(userOrderPriceInformation.price + userShippingPriceInformation.price).toLocaleString()}</del></h6>
                                            <h6 className={['mb-0', 'pr-2'].join(' ')} style={{fontSize: '17px', color: 'red'}}>{(userOrderPriceInformation.discountedPrice + userShippingPriceInformation.discountedPrice).toLocaleString() + " تومان"}</h6>
                                        </div>
                                    }
                                </div>
        */
       let totalPrice = userOrderPriceInformation.price + userShippingPriceInformation.price;
       let totalDiscountedPrice = userOrderPriceInformation.discountedPrice + userShippingPriceInformation.discountedPrice;
       if(walletCheckboxSelected){
           totalPrice -= userStock;
           totalDiscountedPrice -= userStock;
       }
       if(totalPrice <= 0){
            totalPrice = 0;
       }
       if(totalDiscountedPrice <= 0){
           totalDiscountedPrice = 0;
       }
       if(totalPrice === totalDiscountedPrice){
           return (
            <h6 className={['mb-0'].join(' ')} style={{fontSize: '17px', color: 'red'}}>{(totalPrice).toLocaleString() + " تومان"}</h6>
           );
       }else {
           return(
            <div className={['d-flex', 'flex-row', 'align-items-center', 'rtl'].join(' ')}>
                <h6 className={['mb-0', 'pr-2'].join(' ')} style={{fontSize: '17px', color: 'gray'}}><del>{(totalPrice).toLocaleString()}</del></h6>
                <h6 className={['mb-0', 'pr-2'].join(' ')} style={{fontSize: '17px', color: 'red'}}>{(totalDiscountedPrice).toLocaleString() + " تومان"}</h6>
            </div>
           );
       }
    }

    const successfulOrderWithoutPayment = (
        <div className={['container'].join(' ')} >
            <div className={['row', 'px-2'].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center'].join(' ')}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/checked_green_huge.png'} className={['mt-3'].join(' ')} style={{width: '76px', height: '76px'}} />
                    <h5 className={['mb-0', 'text-center', 'mt-2'].join(' ')} style={{fontSize: '22px', color: 'black'}}><b>سفارش با موفقیت ثبت شد</b></h5>
                    <p className={['mb-0', 'text-center', 'mt-2'].join(' ')} style={{fontSize: '17px'}}>پردازش سفارش شما آغاز شده است و در اولین فرصت آماده تحویل خواهد بود</p>
                </div>
                <div className={['col-12', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'mt-3', 'py-4', 'px-3'].join(' ')} style={{borderRadius: '2px', border: '1px solid #D8D8D8', background: '#F7F7F7'}}>
                    <p className={['text-center', 'mb-0'].join(' ')}>برای کسب اطلاعات بیشتر و آگاهی از وضعیت سفارش خود میتوانید به قسمت سفارش‌های من در حساب کاربری خود مراجعه کنید</p>
                    <h6 className={['mb-0', 'mt-3', 'text-center'].join(' ')} style={{fontSize: '17px', color: '#00BAC6'}}><b>{"کد سفارش شما : " + orderId}</b></h6>
                    <Link href='/' ><a onClick={() => {props.reduxStartLoading()}} className={['mb-0', 'px-3', 'py-2', 'text-center', 'mt-3'].join(" ")} style={{background: '#00BAC6', color: 'white', borderRadius: '2px'}}>بازگشت به صفحه‌ی اصلی</a></Link>
                </div>
            </div>
        </div>
    );

    const confirmOrder = () => {
        if(requestWaiting){
            return;
        }
        setRequstWaiting(true);
        setPaymentButtonText('کمی صبر کنید');
        let giftCodes = [];
        let wallet = 0;
        if(walletCheckboxSelected){
            wallet = 1;
        }
        approvedGiftCodesInformation.map((item, counter) => {
            giftCodes.push(item.code);
        });
        axios.post(Constants.apiUrl + '/api/user-confirm-order', {
            giftCodes: giftCodes,
            userWallet: wallet
        }, {
            headers: {
                'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
            }
        }).then((res) => {
            setRequstWaiting(false);
            setPaymentButtonText('تایید و پرداخت سفارش');
            let response = res.data;
            if(response.status === 'done'){
                if(response.stage === 'payment'){
                    window.location.href = response.bankPaymentLink;
                }else if(response.stage === 'done'){
                    setOrderStage('done');
                    setOrderId(response.orderId);
                    props.reduxWipeCart();
                }
            }else if(response.status === 'failed'){
                console.warn(response.message);
                props.reduxUpdateSnackbar('warning', true, response.umessage);
            }
        }).catch((error) => {
            console.error(error);
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            setRequstWaiting(false);
            setPaymentButtonText('تایید و پرداخت سفارش');
        });
    }

    const getStockDecreasedPrice = () => {
        let total = userOrderPriceInformation.discountedPrice + userShippingPriceInformation.discountedPrice;
        if(userStock > total){
            return total;
        }else{
            return userStock;
        }
    }

    const mobileTotalPriceComponent = () => {
        let totalPrice = userOrderPriceInformation.price + userShippingPriceInformation.price;
        let totalDiscountedPrice = userOrderPriceInformation.discountedPrice + userShippingPriceInformation.discountedPrice;
        if(walletCheckboxSelected){
            totalPrice -= userStock;
            totalDiscountedPrice -= userStock;
        }
        // tomorrow I have to continue from here.
    }

    return(
        <React.Fragment>
            <Head>
                <title>بازبینی نهایی و پرداخت | هنری</title>
                <link rel="icon" href={ Constants.baseUrl + "/favicon.ico"} type="image/x-icon"/>
            </Head>
            <Header menu={props.ssrMenu} />  
                {orderStage === ''
                ?
                (
                <React.Fragment>
                    <div className={['container'].join(' ')}>
                        <div className={['row', 'mt-3', 'mt-md-5'].join(' ')}>
                            <div className={['col-12'].join(' ')}>
                                <div className={['w-100', 'd-flex', 'flex-row', 'align-items-center', 'rtl'].join(' ')}>
                                    <div class={[''].join(' ')} style={{flex: '1', height: '2px', background: '#00BAC6'}}></div>
                                    <div class={[''].join(' ')} style={{flex: '1', height: '2px', background: '#00BAC6'}}></div>
                                </div>
                                <div className={['d-flex', 'flex-row', 'align-items-center', 'rtl'].join(' ')} style={{position: 'relative', top: '-10px'}}>
                                    <div className={['d-flex', 'flex-column', 'text-center', 'justify-content-center'].join(' ')} style={{flex: '1'}}>
                                        <div className={['text-center'].join(' ')}><img src={Constants.baseUrl + '/assets/images/main_images/circle_main.png'} style={{width: '20px', height: '20px'}} /></div>
                                        <h6 className={['text-center', 'mt-2', 'font11md17'].join(' ')} style={{color: '#00BAC6'}}><b>ورود به هنری</b></h6>
                                    </div>
                                    <div className={['d-flex', 'flex-column', 'text-center', 'justify-content-center'].join(' ')} style={{flex: '1'}}>
                                        <div className={['text-center'].join(' ')}><img src={Constants.baseUrl + '/assets/images/main_images/circle_main.png'} style={{width: '20px', height: '20px'}} /></div>
                                        <h6 className={['text-center', 'mt-2', 'font11md17'].join(' ')} style={{color: '#00BAC6'}}><b>اطلاعات ارسال</b></h6>
                                    </div>
                                    <div className={['d-flex', 'flex-column', 'text-center', 'justify-content-center'].join(' ')} style={{flex: '1'}}>
                                        <div className={['text-center'].join(' ')}><img src={Constants.baseUrl + '/assets/images/main_images/circle_main.png'} style={{width: '20px', height: '20px'}} /></div>
                                        <h6 className={['text-center', 'mt-2', 'font11md17'].join(' ')} style={{color: '#00BAC6'}}><b>بازبینی نهایی و ارسال</b></h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={['container', 'px-2', 'px-md-4'].join(' ')} style={{overflowX: 'hidden'}}>
                        <div className={['row'].join(' ')}>
                            <div className={['col-12', 'mt-4', 'px-3'].join(' ')}>
                                <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-right', 'rtl'].join(' ')}>
                                    <img src={Constants.baseUrl + '/assets/images/main_images/form.png'} style={{width: '18px', heigth: '18px'}} />
                                    <h4 className={['text-right', 'mb-0', 'mr-2'].join(' ')} style={{fontSize: '24px', color: '#2b2b2b'}}><b>فاکتور نهایی خرید</b></h4>
                                </div>
                            </div>
                        </div>
                        <div className={['row', 'rtl', 'py-3', 'mt-2', 'align-items-center', 'mx-1', 'mx-md-0', 'd-none', 'd-md-flex'].join(' ')} style={{background: '#F7F7F7', border: '1px solid #D8D8D8'}}>
                            <h6 className={['col-6', 'text-right', 'mb-0', 'pr-2', 'font11md17'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>محصول</h6>
                            <h6 className={['col-1', 'text-center', 'mb-0', 'font11md17'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>تعداد</h6>
                            <h6 className={['col-1', 'text-center', 'mb-0', 'font11md17'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>واحد</h6>
                            <h6 className={['col-2', 'text-center', 'mb-0', 'font11md17'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>قیمت واحد</h6>
                            <h6 className={['col-2', 'text-center', 'mb-0', 'font11md17'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>قیمت کل</h6>
                        </div>
                        {
                            props.reduxCart.information.map((item, counter) => {
                                return (
                                    <React.Fragment>
                                        <div className={['row', 'rtl', 'py-2', 'mt-1', 'align-items-center', 'd-none', 'd-md-flex', 'mx-1'].join(' ')} style={{borderRight: '1px solid #D8D8D8', borderBottom: '1px solid #D8D8D8', borderLeft: '1px solid #D8D8D8'}}>
                                            <div className={['col-6', 'text-right', 'mb-0', 'pr-2', 'd-flex', 'flex-row', 'align-items-center'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>
                                                <img src={'https://honari.com/image/resizeTest/shop/_85x/thumb_' + item.prodID + '.jpg'} style={{width: '75px', height: '75px', borderRadius: '1px'}} />
                                                <div className={['d-flex', 'flex-column', 'text-right', 'mr-2'].join(' ')}>
                                                    <h5 className={['mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px'}}>{item.name}</h5>
                                                    <h5 className={['mb-0', 'font11md17', 'mt-2'].join(' ')} style={{fontSize: '14px'}}>{item.label}</h5>
                                                </div>
                                            </div>
                                            <h6 className={['col-1', 'text-center', 'mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>{item.count}</h6>
                                            <h6 className={['col-1', 'text-center', 'mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>{item.unitName}</h6>
                                            {
                                                item.price === item.discountedPrice
                                                ?
                                                <h6 className={['col-2', 'text-center', 'mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>{item.price.toLocaleString() + " تومان"}</h6>
                                                : 
                                                (
                                                    <div className={['col-2', 'd-flex', 'flex-column', 'font14md17'].join(' ')}>
                                                            <h6 className={['text-center', 'mb-1', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#444444'}}><del>{item.price.toLocaleString() + " تومان"}</del></h6>
                                                            <h6 className={['text-center', 'mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: 'red'}}>{item.discountedPrice.toLocaleString() + " تومان"}</h6>
                                                    </div>
                                                )
                                            }
                                            {
                                                item.price === item.discountedPrice
                                                ?
                                                <h6 className={['col-2', 'text-center', 'mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>{(item.price * item.count).toLocaleString() + " تومان"}</h6>
                                                : 
                                                (
                                                    <div className={['col-2', 'd-flex', 'flex-column', 'font14md17'].join(' ')}>
                                                            <h6 className={['text-center', 'mb-1', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#444444'}}><del>{(item.price * item.count).toLocaleString() + " تومان"}</del></h6>
                                                            <h6 className={['text-center', 'mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: 'red'}}>{(item.discountedPrice * item.count).toLocaleString() + " تومان"}</h6>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </React.Fragment>
                                );
                            })
                        }
                        <div className={['rtl', 'text-right', 'd-md-none', 'mt-2'].join(' ')} style={{width: '100%', overflowX: 'scroll', scrollbarWidth: 'thin', direction: 'rtl'}}>
                            <div className={['rtl', 'py-2', 'mt-1', 'd-flex', 'd-flex-row', 'align-items-center'].join(' ')} style={{border: '1px solid #D8D8D8', width: '700px', background: '#F7F7F7'}}>
                                <h6 className={['text-right', 'mb-0', 'pr-2'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '4'}}>محصول</h6>
                                <h6 className={['text-center', 'mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '1'}}>تعداد</h6>
                                <h6 className={['text-center', 'mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '1'}}>واحد</h6>
                                <h6 className={['text-center', 'mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '2'}}>قیمت واحد</h6>
                                <h6 className={['text-center', 'mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '2'}}>قیمت کل</h6>
                            </div>
                        {
                            props.reduxCart.information.map((item, counter) => {
                                return (
                                    <React.Fragment>
                                            <div className={['rtl', 'py-2', 'mt-1', 'd-flex', 'd-flex-row', 'align-items-center', 'd-md-none'].join(' ')} style={{borderBottom: '1px solid #D8D8D8', width: '700px'}}>
                                                <div className={['text-right', 'mb-0', 'pr-2', 'd-flex', 'flex-row', 'align-items-center'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '4'}}>
                                                    <img src={'https://honari.com/image/resizeTest/shop/_85x/thumb_' + item.prodID + '.jpg'} style={{width: '75px', height: '75px', borderRadius: '1px'}} />
                                                    <div className={['d-flex', 'flex-column', 'text-right', 'mr-2'].join(' ')}>
                                                        <h5 className={['mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px'}}>{item.name}</h5>
                                                        <h5 className={['mb-0', 'font11md17', 'mt-2'].join(' ')} style={{fontSize: '14px'}}>{item.label}</h5>
                                                    </div>
                                                </div>
                                                <h6 className={['text-center', 'mb-0', 'font14md17', 'd-inline-block'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '1'}}>{item.count}</h6>
                                                <h6 className={['text-center', 'mb-0', 'font14md17', 'd-inline-block'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '1'}}>{item.unitName}</h6>
                                                {
                                                    item.price === item.discountedPrice
                                                    ?
                                                    <h6 className={['text-center', 'mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '2'}}>{item.price.toLocaleString() + " تومان"}</h6>
                                                    : 
                                                    (
                                                        <div className={['d-flex', 'flex-column', 'font14md17'].join(' ')} style={{flex: '2'}}>
                                                                <h6 className={['text-center', 'mb-1', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#444444'}}><del>{item.price.toLocaleString() + " تومان"}</del></h6>
                                                                <h6 className={['text-center', 'mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: 'red'}}>{item.discountedPrice.toLocaleString() + " تومان"}</h6>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    item.price === item.discountedPrice
                                                    ?
                                                    <h6 className={['text-center', 'mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#444444', flex: '2'}}>{(item.price * item.count).toLocaleString() + " تومان"}</h6>
                                                    : 
                                                    (
                                                        <div className={['d-flex', 'flex-column', 'font14md17'].join(' ')} style={{flex: '2'}}>
                                                                <h6 className={['text-center', 'mb-1', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#444444'}}><del>{(item.price * item.count).toLocaleString() + " تومان"}</del></h6>
                                                                <h6 className={['text-center', 'mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: 'red'}}>{(item.discountedPrice * item.count).toLocaleString() + " تومان"}</h6>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                    </React.Fragment>
                                );
                            })
                        }
                        </div>
                        <div className={['row', 'mt-5', 'mx-2'].join(' ')}>
                            <div className={['col-12', 'd-flex', 'text-right', 'justify-content-right', 'rtl', 'align-items-center', 'px-0'].join(' ')}>
                                {
                                    giftCodeCheckboxSelected
                                    ?
                                    <img className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/selected_checkbox.png'} style={{width: '15px', height: '15px'}} onClick={() => {setGiftCodeCheckboxSelected(false)}} />
                                    :
                                    <img className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/unselected_checkbox.png'} style={{width: '15px', height: '15px'}} onClick={() => {setGiftCodeCheckboxSelected(true)}} />
                                }
                                <h6 className={['text-right', 'mb-0', 'rtl', 'pr-2'].join(' ')} style={{fontSize: '24px', color: '#2B2B2B'}}><b>کد تخفیف دارم</b></h6>
                            </div>
                            <div className={['col-12', 'px-0'].join(' ')}>
                                <h6 className={['text-right', 'rtl', 'mb-0', 'mt-1'].join(' ')} style={{fontSize: '14px', color: '#2B2B2B'}}>اگر کد تخفیف هنری دارید این گزینه را تیک بزنید و کد خود را وارد کنید</h6>
                            </div>
                        </div>
                        {
                            giftCodeCheckboxSelected
                            ?
                            <div className={['row', 'rtl', 'mt-3', 'mx-2'].join(' ')} style={{borderRadius: '2px', border: '1px solid #D8D8D8'}}>
                                <div className={['col-12', 'col-md-6', 'd-flex', 'd-md-none', 'flex-row', 'rtl', 'align-items-center', 'text-right', 'justify-content-between', 'py-2'].join(' ')}>
                                    <h6 className={['mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>کد تخفیف</h6>
                                    <input type='text' placeholder='کد خود را وارد کنید' className={['mr-2', 'text-center', 'ltr'].join(' ')} style={{height: '40px', border: '1px solid #D8D8D8', flex: '1', borderRadius: '2px', fontFamily: 'IranSansWeb', fontSize: '14px'}} onChange={giftCodeInputChanged} />
                                    <button className={['text-center', 'mb-0', 'mr-2', 'px-2', 'pointer', 'font14md17'].join(' ')} style={{height: '40px', background: '#00BAC6', color: 'white', border: 'none', outline: 'none', borderRadius: '2px'}} onClick={insertGiftCodeClicked}>اعمال کد</button>
                                </div>
                                <div className={['col-12', 'col-md-6', 'd-none', 'd-md-flex', 'flex-row', 'rtl', 'align-items-center', 'text-right', 'justify-content-right', 'py-2'].join(' ')}>
                                    <h6 className={['mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>کد تخفیف</h6>
                                    <input type='text' placeholder='کد خود را وارد کنید' className={['mr-2', 'text-center', 'ltr'].join(' ')} style={{height: '40px', border: '1px solid #D8D8D8', borderRadius: '2px', fontFamily: 'IranSansWeb'}} onChange={giftCodeInputChanged} />
                                    <button className={['text-center', 'mb-0', 'mr-2', 'px-2', 'pointer', 'font14md17'].join(' ')} style={{height: '40px', background: '#00BAC6', color: 'white', border: 'none', outline: 'none', borderRadius: '2px'}} onClick={insertGiftCodeClicked}>اعمال کد</button>
                                </div>
                                {
                                    approvedGiftCodesInformation.map((item, counter) => {
                                        if(counter === 0){
                                            return (
                                                <div className={['col-6', 'd-flex', 'flex-row', 'align-items-center', 'py-2'].join(' ')}>
                                                    <div className={['d-flex', 'flex-column', 'justify-content-right', 'pr-5'].join(' ')} >
                                                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')}>
                                                            <img src={Constants.baseUrl + '/assets/images/main_images/tick.png'} style={{width: '12px', height: '12px'}} />
                                                            <h6 className={['mb-0', 'pr-1'].join(" ")} style={{fontFamily: 'IranSansWeb', color: '#00A128', fontSize: '17px'}}>{
                                                                "کد تخفیف " + item.code + " اعمال شد"
                                                            }</h6>
                                                        </div>
                                                        {
                                                            item.type === 'order'
                                                            ?
                                                            (
                                                                <h6 className={['mb-0', 'text-right'].join(' ')} style={{fontSize: '14px', color: '#2B2B2B'}}>{
                                                                    item.discountPrice.toLocaleString() + " تومان از مبلغ سفارش کاسته شد"
                                                                }</h6>
                                                            )
                                                            :
                                                            (
                                                                <h6 className={['mb-0', 'text-right'].join(' ')} style={{fontSize: '14px', color: '#2B2B2B'}}>{
                                                                    item.discountPrice.toLocaleString() + " تومان از هزینه ارسال کاسته شد"
                                                                }</h6>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            );
                                        }else{
                                            return (
                                                <React.Fragment>
                                                    <div className={['col-6']}></div>
                                                    <div className={['col-6', 'd-flex', 'flex-row', 'align-items-center', 'py-2'].join(' ')}>
                                                        <div className={['d-flex', 'flex-column', 'justify-content-right', 'pr-5'].join(' ')} >
                                                            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')}>
                                                                <img src={Constants.baseUrl + '/assets/images/main_images/tick.png'} style={{width: '12px', height: '12px'}} />
                                                                <h6 className={['mb-0', 'pr-1'].join(" ")} style={{fontFamily: 'IranSansWeb', color: '#00A128', fontSize: '17px'}}>{
                                                                "کد تخفیف " + item.code + " اعمال شد"
                                                            }</h6>
                                                            </div>
                                                            {
                                                                item.type === 'order'
                                                                ?
                                                                (
                                                                    <h6 className={['mb-0', 'text-right'].join(' ')} style={{fontSize: '14px', color: '#2B2B2B'}}>{
                                                                        item.discountPrice.toLocaleString() + " تومان از مبلغ سفارش کاسته شد"
                                                                    }</h6>
                                                                )
                                                                :
                                                                (
                                                                    <h6 className={['mb-0', 'text-right'].join(' ')} style={{fontSize: '14px', color: '#2B2B2B'}}>{
                                                                        item.discountPrice.toLocaleString() + " تومان از هزینه ارسال کاسته شد"
                                                                    }</h6>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            );
                                        }
                                    })
                                }
                            </div>
                            :
                            null
                        }
                        <div className={['row', 'mt-5', 'mx-2'].join(' ')}>
                            <div className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'rtl', 'text-right', 'mb-3', 'px-0'].join(' ')}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/cash_black_small.png'} style={{width: '18px', height: '18px'}} />
                                <h5 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '24px', color: '#2B2B2B'}}><b>شیوه پرداخت</b></h5>
                            </div>
                            <div className={['col-12', 'd-flex', 'flex-row', 'text-right', 'rtl', 'align-items-center', 'justify-content-right', 'py-2', 'mr-3'].join(' ')} style={{borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/rec_main_full.png'} style={{width: '14px', height: '14px'}} />
                                <div className={['d-flex', 'flex-column', 'justify-content-right', 'pr-3'].join(' ')}>
                                    <h6 className={['text-right', 'mb-0'].join(' ')} style={{fontSize: '24px', color: '#2B2B2B'}}>پرداخت آنلاین</h6>
                                    <h6 className={['text-right', 'mb-0', 'mt-1'].join(' ')} style={{fontSize: '14px', color: '#4B4B4B'}}>از طریق درگاه بانک</h6>
                                </div>
                            </div>
                        </div>
                        <div className={['row', 'mt-4', 'mx-2'].join(' ')}>
                            <div className={['col-12', 'd-block', 'd-md-flex', 'flex-md-row', 'align-items-center', 'justify-content-between', 'rtl', 'px-0'].join(' ')}>
                                <div className={['d-block', 'd-md-flex', 'flex-column', 'flex-md-row', 'align-items-center', 'rtl', 'px-0', 'mx-0'].join(' ')}>
                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'text-right'].join(' ')}>
                                        {
                                            walletCheckboxSelected 
                                            ?
                                            <img className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/selected_checkbox.png'} style={{width: '15px', height: '15px'}} onClick={() => {toggleUserWalletUsage(false)}} />
                                            :
                                            <img className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/unselected_checkbox.png'} style={{width: '15px', height: '15px'}} onClick={() => {toggleUserWalletUsage(true)}} />
                                        }
                                        <h5 className={['mb-0', 'px-2', 'text-right'].join(' ')} style={{fontSize: '17px', color: '#2B2B2B', flex: '1'}}><b>استفاده از اعتبار حساب کاربری</b></h5>
                                    </div>
                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'py-1', 'px-0', 'px-md-2', 'justify-content-between','mt-2', 'mt-md-0'].join(' ')} style={{borderRadius: '14px', border: '1px solid #D8D8D8'}}>
                                        <h6 className={['mb-0', 'pl-0', 'pl-md-2', 'text-center'].join(' ')} style={{fontSize: '14px', color: '#444444', borderLeft: '1px solid #D8D8D8', flex: '1', minWidth: '200px'}}>{'اعتبار فعلی ' + userStock.toLocaleString() + 'تومان'}</h6>
                                        <button className={['pr-0', 'pr-md-2', 'pointer', 'text-center'].join(' ')} style={{fontSize: '14px', background: 'white', color: '#00BAC6', border: 'none', flex: '1'}}>افزایش اعتبار</button>
                                    </div>
                                </div>
                                {
                                    walletCheckboxSelected 
                                    ?
                                    <React.Fragment>
                                        <h6 className={['mb-0', 'd-none', 'd-md-block'].join(' ')} style={{fontSize: '14px', color: '#444444'}}>{getStockDecreasedPrice().toLocaleString() + ' تومان از مبلغ سفارش شما کاسته شد '}</h6>
                                        <h6 className={['mb-0', 'd-md-none', 'text-center', 'w-100', 'mt-2'].join(' ')} style={{fontSize: '14px', color: '#444444'}}>{getStockDecreasedPrice().toLocaleString() + ' تومان از مبلغ سفارش شما کاسته شد '}</h6>
                                    </React.Fragment>
                                    :
                                        null
                                } 
                            </div>
                            <h6 className={['col-12', 'px-0', 'mt-2', 'text-right', 'rtl', 'font11md14'].join(' ')} style={{fontSize: '14px', color: '#444444'}}>با تیک زدن این گزینه به میزان اعتبار حسابتان از مبلغ دریافتی سفارشتان کاسته خواهد شد</h6>
                            <div className={['col-12', 'mt-4'].join(' ')} style={{height: '2px', background: '#DEDEDE'}}></div>
                        </div>
                        <div className={['row', 'mt-4', 'd-none', 'd-md-flex', 'mx-2'].join(' ')}>
                            <div className={['col-12', 'd-flex', 'd-flex', 'align-items-center', 'justify-content-between', 'rtl', 'px-0'].join(' ')}>
                                <Link href='/cart/payment'>
                                    <a onClick={props.reduxStartLoading} className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')}>
                                        <img src={Constants.baseUrl + '/assets/images/main_images/right_arrow_black.png'} className={['ml-2'].join(' ')} style={{width: '8px', height: '8px'}} />
                                        <h6 className={['mb-0', 'font14md17'].join(' ')} style={{color: '##2B2B2B'}}><b>بازگشت به صفحه قبل</b></h6>
                                    </a>
                                </Link>
                                <div className={['d-flex', 'flex-row'].join(' ')} style={{borderRadius: '2px', border: '1px solid #D8D8D8'}}>
                                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'px-2', 'py-1'].join(' ')} style={{background: '#F7F7F7'}}>
                                        <h6 className={['mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: '#2B2B2B'}}>مبلغ نهایی سفارش : </h6>
                                        {
                                            totalPriceComponent()
                                        }
                                    </div>
                                    <div onClick={confirmOrder} className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'px-2', 'py-2', 'pointer'].join(' ')} style={{background: '#00bac6'}}>
                                        <h6 className={['pl-2', 'mb-0', 'font14md17'].join(' ')} style={{fontSize: '17px', color: 'white'}}>{paymentButtonText}</h6>
                                        <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_white_small.png'} style={{width: '8px', height: '8px'}} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={['row', 'd-flex', 'd-md-none', 'mt-4', 'mx-2'].join(' ')}>
                            <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'justify-content-between', 'align-items-center', 'py-2'].join(' ')} style={{borderRadius: '2px', border: '1px solid #D8D8D8', background: '#F7F7F7'}}>
                                <h6 className={['mb-0'].join(' ')} style={{fontSize: '17px'}}><b>مبلغ نهایی سفارش</b></h6>
                                {
                                    (userOrderPriceInformation.price + userShippingPriceInformation.price) === (userOrderPriceInformation.discountedPrice + userShippingPriceInformation.discountedPrice)
                                    ?
                                    (
                                        <h6 className={['mb-0', 'text-center'].join(' ')} style={{color: 'red', fontSize: '17px'}}>{(userOrderPriceInformation.discountedPrice + userShippingPriceInformation.discountedPrice).toLocaleString() + ' تومان'}</h6>
                                    )
                                    :
                                    (
                                        <div className={['d-flex', 'flex-column', 'align-items-center'].join(' ')}>
                                            <h6 className={['mb-0', 'text-center'].join(' ')} style={{color: 'gray', fontSize: '17px'}}><del>{(userOrderPriceInformation.price + userShippingPriceInformation.price).toLocaleString()}</del></h6>
                                            <h6 className={['mb-0', 'text-center'].join(' ')} style={{color: 'red', fontSize: '17px'}}>{(userOrderPriceInformation.discountedPrice + userShippingPriceInformation.discountedPrice).toLocaleString() + ' تومان'}</h6>
                                        </div>
                                    )
                                }
                            </div>
                            <button onClick={confirmOrder} className={['col-12', 'py-3', 'mt-3'].join(' ')} style={{color: 'white', fontSize: '17px', borderRadius: '2px', background: '#00BAC6', outline: 'none', border: 'none'}}>{paymentButtonText}</button>
                        </div>
                    </div>
                </React.Fragment>
                )   
                :
                successfulOrderWithoutPayment 
                }
            <Footer />
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        reduxUser: state.user,
        reduxCart: state.cart
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
        reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t}),
        reduxStartLoading: () => dispatch({type: actionTypes.START_LOADING}),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(DeliveryReview);

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
                },
                redirect: {
                    destination: '/'
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
            },
            redirect: {
                destination: 'https://honari.com/user?site=shop&callBack=%2F'
            }
        };
    }
}
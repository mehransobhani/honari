import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Header from '../../../../components/Header/Header';
import Footer from '../../../../components/Footer/Footer';
import Head from 'next/head';
import {useRouter}  from 'next/router';
import {connect} from 'react-redux';
import * as actionTypes from '../../../../store/actions';
import * as Constants from '../../../../components/constants';
//import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';


const PasargadChargePaymentResult = (props) => {
    const router = useRouter();
    const [paymentResult, setPaymentResult] = useState(null);

    useEffect(() => {
        console.log(router);
    }, [router, undefined]);

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
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
            }).catch((error)=>{
                console.error(error);
                props.reduxUpdateCart([]);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            });
        }else if(props.ssrUser.status === 'GUEST'){
            window.location.href = 'https://honari.com/user/login';
        }
    }, []);

    useEffect(() => {
        axios.post(Constants.apiUrl + "/api/user-pasargad-charge-result", {
            iN: router.query.iN,
            iD: router.query.iD,
            tref: router.query.tref,
        },{
            headers: {
                'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
            }
        }).then((res)=>{
            let response = res.data;
            if(response.status === 'done'){
                if(response.successfulPayment === true){
                    props.reduxWipeCart();
                    setPaymentResult(true);
                }else{
                    setPaymentResult(false);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
            }else if(response.status === 'failed'){
                console.warn(response.message);
                props.reduxUpdateSnackbar('warning', true, response.umessage);
            }
        }).catch((error)=>{
            console.error(error);
            props.reduxUpdateCart([]);
            alert('مشکلی پیش آمده لطفا مجددا امتحان کنید');
        });
    }, [paymentResult, null]);

    const successfulPaymentMessage = (
        <div className={['container'].join(' ')} >
            <div className={['row', 'px-2'].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center'].join(' ')}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/checked_green_huge.png'} className={['mt-3'].join(' ')} style={{width: '76px', height: '76px'}} />
                    <h5 className={['mb-0', 'text-center', 'mt-2'].join(' ')} style={{fontSize: '22px', color: 'black'}}><b>کیف پول شما با موفقیت شارژ شد</b></h5>
                    <p className={['mb-0', 'text-center', 'mt-2'].join(' ')} style={{fontSize: '17px'}}>مبلغ حساب کاربری شما افزایش یافت. شما میتوانید از این مبلغ برای پرداخت سفارش‌های خود استفاده کنید</p>
                </div>
                <div className={['col-12', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'mt-3', 'py-4', 'px-3'].join(' ')} style={{borderRadius: '2px', border: '1px solid #D8D8D8', background: '#F7F7F7'}}>
                    <p className={['text-center', 'mb-0'].join(' ')}>برای کسب اطلاعات بیشتر و آگاهی از وضعیت کیف پول خود میتوانید به حساب کاربری خود مراجعه کنید</p>
                    <h6 className={['mb-0', 'mt-3', 'text-center'].join(' ')} style={{fontSize: '17px', color: '#00BAC6'}}><b>{"کد سفارش شما : " + ""}</b></h6>
                    <Link href='/' ><a onClick={() => {props.reduxStartLoading()}} className={['mb-0', 'px-3', 'py-2', 'text-center', 'mt-3'].join(" ")} style={{background: '#00BAC6', color: 'white', borderRadius: '2px'}}>بازگشت به صفحه‌ی اصلی</a></Link>
                </div>
            </div>
        </div>
    );

    const failedPaymentMessage = (
        <div className={['container'].join(' ')} >
            <div className={['row', 'px-2'].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center'].join(' ')}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/cancel_red_huge.png'} className={['mt-3'].join(' ')} style={{width: '76px', height: '76px'}} />
                    <h5 className={['mb-0', 'text-center', 'mt-2'].join(' ')} style={{fontSize: '22px', color: 'black'}}><b>پرداخت شما ناموفق بوده است</b></h5>
                    <p className={['mb-0', 'text-center', 'mt-2'].join(' ')} style={{fontSize: '17px'}}>چنانچه مبلغ از شما کسر شده است معمولا ظرف ۷۲ ساعت آینده به حساب شما بازگردانده خواهد شد</p>
                    <p className={['mb-0', 'text-center', 'mt-2'].join(' ')} style={{fontSize: '17px'}}>درصورت عدم بازگشت مبلغ در این بازه زمانی با پشتیبانی بانک خود تماس حاصل نمایید</p>
                </div>
                <div className={['col-12', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'mt-3', 'py-4', 'px-3'].join(' ')} style={{borderRadius: '2px', border: '1px solid #D8D8D8', background: '#F7F7F7'}}>
                    <p className={['text-center', 'mb-0'].join(' ')}>به علت ناموفق بودن پرداخت، کیف پول شما شارژ نشده است</p>
                    <p className={['text-center', 'mb-0'].join(' ')}>برای افزایش اعتبار حساب کابری خود مجددا درخواست دهید</p>
                    <h6 className={['mb-0', 'mt-3', 'text-center'].join(' ')} style={{fontSize: '17px', color: '#00BAC6'}}><b>{"کد سفارش شما : " + ""}</b></h6>
                    <Link href='/cart/shoppingCart' ><a onClick={() => {props.reduxStartLoading()}} className={['mb-0', 'px-3', 'py-2', 'text-center', 'mt-3'].join(" ")} style={{background: '#00BAC6', color: 'white', borderRadius: '2px'}}>بازگشت به سبد خرید</a></Link>
                </div>
            </div>
        </div>
    );

    return (    
        <React.Fragment>
            <Header /> 
            {
                paymentResult !== null
                ?
                (
                    paymentResult === true
                    ?
                    successfulPaymentMessage
                    :
                    failedPaymentMessage    
                )
                :
                null
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
        reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasargadChargePaymentResult);

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
                },
                redirect: {
                    destination: 'https://honari.com/user?site=shop&callBack=%2F'
                }
            }
        }
        
    }else{
        console.log("DOES NOT HAVE ANY COOKIES");
        return{
            props: {
                ssrUser: {status: 'GUEST', information: {}},
                ssrCookies: context.req.cookies
            },
            redirect: {
                destination: 'https://honari.com/user?site=shop&callBack=%2F'
            }
        };
    }
}
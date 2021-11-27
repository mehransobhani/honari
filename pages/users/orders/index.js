import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import * as Constants from '../../../components/constants';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import {useCookies} from 'react-cookie';
import Link from 'next/link';
import {connect} from 'react-redux';
import * as actionTypes from '../../../store/actions';
import Image from 'next/image';

const UserOrders = (props) => {

    const [cookies , setCookie , removeCookie] = useCookies();
    const [userAllowd, setUserAllowed] = useState(false);
    const [userStatus, setUserStatus] = useState('loggedOut');
    const [userOrders, setUserOrders] = useState(null);

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
            getUserPreviousOrders();
        }else if(props.ssrUser.status === 'GUEST'){
            window.location.href = 'https://honari.com/user/login';
        }
    }, []);

    const getUserPreviousOrders = () => {
        axios.post(Constants.apiUrl + '/api/user-orders-history',
        {}, 
        {
            headers: {
                'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
            }
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                setUserAllowed(true);
                setUserOrders([]);
                if(response.found === true){
                    setUserOrders(response.orders);
                }
            }else if(response.status === 'failed'){
                console.warn(response.message);
                props.reduxUpdateSnackbar('warning', true, response.umessage);
            }
        }).catch((error) => {
            console.log(error);
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط')
        });
    }

    const noPreviousOrder = (
        <div className={['row', 'px-2'].join(' ')}>
            <div className={['col-12', 'd-flex', 'flex-column', 'align-items-center', 'py-3'].join(' ')} style={{background: '#F2F2F2', borderRadius: '4px'}}>
                <Image src='/assets/images/main_images/shopping_cart_yellow.png' style={{width: '50px', height: '50px'}} />
                <h6 className={['mb-0', 'text-center', 'mt-3'].join(' ')} style={{color: '#a67a00', fontSize: '17px', fontWeight: '500'}}>تاکنون سفارشی ثبت نکرده‌اید</h6>
            </div>
        </div>
    );

    const previousOrdersList = (
        <React.Fragment>
            <div className={['row', 'px-2', 'd-none', 'd-md-flex'].join(' ')}>
                <span className={['col-1', 'text-center'].join(' ')} style={{fontSize: '12px', color: '#00BAC6', fontWeight: '500'}}>ردیف</span>
                <span className={['col-2', 'text-center'].join(' ')} style={{fontSize: '12px', color: '#00BAC6', fontWeight: '500'}}>وضعیت</span>
                <span className={['col-2', 'text-center'].join(' ')} style={{fontSize: '12px', color: '#00BAC6', fontWeight: '500'}}>تاریخ</span>
                <span className={['col-2', 'text-center'].join(' ')} style={{fontSize: '12px', color: '#00BAC6', fontWeight: '500'}}>مبلغ</span>
                <span className={['col-2', 'text-center'].join(' ')} style={{fontSize: '12px', color: '#00BAC6', fontWeight: '500'}}>کد رهگیری</span>
                <span className={['col-1', 'text-center'].join(' ')} style={{fontSize: '12px', color: '#00BAC6', fontWeight: '500'}}>مشاهده</span>
                <span className={['col-2', 'text-center'].join(' ')} style={{fontSize: '12px', color: '#00BAC6', fontWeight: '500'}}>مرجوعی / نقص سفارش</span>
            </div>
            {
                userOrders !== null && userOrders.length !== 0 && userOrders !== undefined && userOrders !== '[]'
                ?
                (
                    userOrders.map((item, counter) => {
                        return(
                            <React.Fragment>
                                <div className={['row', 'px-2', 'py-3', 'mt-1', 'd-none', 'd-md-flex'].join(' ')} style={{borderRadius: '3px', background: '#F2F2F2'}}>
                                    <span className={['col-1', 'text-center'].join(' ')} style={{fontSize: '12px', color: 'black', fontWeight: '500'}}>{counter + 1}</span>
                                    {
                                        item.status == 9
                                        ?
                                        <span className={['col-2', 'text-center', 'rtl'].join(' ')} style={{fontSize: '12px', color: 'black', fontWeight: '500'}}>تحویل داده شده</span>
                                        :
                                        <span className={['col-2', 'text-center', 'rtl'].join(' ')} style={{fontSize: '12px', color: 'black', fontWeight: '500'}}>{item.status}</span>
                                    }
                                    <span className={['col-2', 'text-center', 'rtl'].join(' ')} style={{fontSize: '12px', color: 'black', fontWeight: '500'}}>{item.date}</span>
                                    <span className={['col-2', 'text-center', 'rtl'].join(' ')} style={{fontSize: '12px', color: 'black', fontWeight: '500'}}>{item.price + ' تومان'}</span>
                                    <span className={['col-2', 'text-center'].join(' ')} style={{fontSize: '12px', color: 'black', fontWeight: '500'}}>کد رهگیری</span>
                                    <Link href={'/users/factor/' + item.id} ><a className={['col-1', 'text-center', 'pointer'].join(' ')} style={{fontSize: '12px', color: 'black', fontWeight: '500'}}>مشاهده</a></Link>
                                    <span className={['col-2', 'text-center', 'd-none'].join(' ')} style={{fontSize: '12px', color: 'black', fontWeight: '500'}}>مرجوعی / نقص سفارش</span>
                                    <span className={['col-2', 'text-center'].join(' ')} style={{fontSize: '12px', color: 'black', fontWeight: '500'}}>
                                        <Image src='/assets/images/main_images/return_delivery_red.png' className={['pointer'].join(' ')} style={{width: '20px', height: '20px'}} />
                                    </span>
                                </div>
                                <div className={['row', 'px-2', 'py-2', 'mt-1', 'd-md-none'].join(' ')} style={{borderRadius: '3px', background: '#F2F2F2'}}>
                                    <div className={['col-6', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right'].join(' ')}>
                                        <h6 className={['mb-0', 'pl-2'].join(' ')} style={{fontSize: '11px'}}>وضعیت :</h6>
                                        <h6 className={['mb-0'].join(' ')} style={{fontSize: '11px'}}>تحویل داده شده</h6>
                                    </div>
                                    <div className={['col-6', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right'].join(' ')}>
                                        <h6 className={['mb-0', 'pl-2'].join(' ')} style={{fontSize: '11px'}}>تاریخ ثبت :</h6>
                                        <h6 className={['mb-0'].join(' ')} style={{fontSize: '11px'}}>{item.date}</h6>
                                    </div>
                                    <div className={['col-6', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'mt-3'].join(' ')}>
                                        <h6 className={['mb-0', 'pl-2'].join(' ')} style={{fontSize: '11px'}}>مبلغ :</h6>
                                        <h6 className={['mb-0'].join(' ')} style={{fontSize: '11px'}}>{item.price + ' تومان'}</h6>
                                    </div>
                                    <div className={['col-6', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'mt-3'].join(' ')}>
                                        <h6 className={['mb-0', 'pl-2'].join(' ')} style={{fontSize: '11px'}}>کد رهگیری :</h6>
                                        <h6 className={['mb-0'].join(' ')} style={{fontSize: '11px'}}>124654</h6>
                                    </div>
                                    <div className={['col-6', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'mt-3'].join(' ')}>
                                        <Link href={'/users/factor/' + item.id} ><a className={[''].join(' ')} style={{fontSize: '11px', color: '#00BAC6'}}>مشاهده جزئیات</a></Link>
                                    </div>
                                    <div className={['col-6', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'mt-3'].join(' ')}>
                                        <Link href='' ><a className={[''].join(' ')} style={{fontSize: '11px', color: 'red'}}>ثبت مرجوعی</a></Link>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })
                )
                :
                null
            }
        </React.Fragment>
    );

    return(
        <React.Fragment>
            <Head>
                <title>سفارش های من | هنری</title>
                <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
            </Head>
            <Header />
        {
            userAllowd ?
                <React.Fragment>
                    <div className={['container'].join(' ')}>
                            <div className={['row', 'rtl', 'mt-3'].join(' ')}>
                                <div className={['col-2', 'd-none', 'd-md-flex', 'flex-column', 'align-items-center'].join(' ')}>
                                    <Image src='/assets/images/main_images/user_full_circle_main.png' style={{width: '50%'}} />
                                    <Link href='/users/view'><a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-2', 'w-100', 'pointer', 'mt-2'].join(' ')} style={{background: '#F2F2F2', border: '1px solid #DEDEDE', fontSize: '17px',borderRadius: '4px'}}>نمایه کاربر</a></Link>
                                    <h6 className={['text-center', 'py-2', 'w-100', 'pointer', 'mt-2', 'mb-0'].join(' ')} style={{background: '#F2F2F2', border: '1px solid #00BAC6', fontSize: '17px',borderRadius: '4px', color: '#00BAC6'}}>سفارش‌های من</h6>
                                    <Link href='/users/showreturned'><a onClick={() => {props.reduxStartLoading()}} onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-2', 'w-100', 'pointer', 'mt-2'].join(' ')} style={{background: '#F2F2F2', border: '1px solid #DEDEDE', fontSize: '17px',borderRadius: '4px'}}>تاریخچه مرجوعی</a></Link>
                                    <Link href='/users/charge_account'><a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-2', 'w-100', 'pointer', 'mt-2'].join(' ')} style={{background: '#F2F2F2', border: '1px solid #DEDEDE', fontSize: '17px',borderRadius: '4px'}}>موجودی / شارژ حساب</a></Link>
                                    <Link href='https://honari.com/academy/user/courses'><a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-2', 'w-100', 'pointer', 'mt-2'].join(' ')} style={{background: '#F2F2F2', border: '1px solid #DEDEDE', fontSize: '17px',borderRadius: '4px'}}>کلاس‌های من</a></Link>
                                    <Link href='/users/balance'><a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-2', 'w-100', 'pointer', 'mt-2'].join(' ')} style={{background: '#F2F2F2', border: '1px solid #DEDEDE', fontSize: '17px',borderRadius: '4px'}}>تسویه حساب</a></Link>
                                    <Link href='https://docs.google.com/forms/d/e/1FAIpQLSdRYGrhGRHlNk0SlGD6v2UQCmq2gm5hkHFM4hEw4oeIJ5gz0w/viewform'><a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-2', 'w-100', 'pointer', 'mt-2'].join(' ')} style={{background: '#F2F2F2', border: '1px solid #DEDEDE', fontSize: '17px',borderRadius: '4px'}}>همکاری در فروش</a></Link>
                                </div>
                                <div className={['col-12', 'd-md-none'].join(' ')}>
                                    <div className={['container'].join(' ')}>
                                        <div className={['row', 'rtl', 'justify-content-between'].join(' ')}>
                                            <h6 className={['col-12', 'text-center', 'py-1'].join(' ')} style={{background: '#F2F2F2', color: '#00BAC6', borderRadius: '2px', fontSize: '14px', border: '1px solid #00BAC6'}}>سفارش‌های من</h6>
                                            <Link href='/users/view'><a onClick={() => {props.reduxStartLoading()}} className={['col-5', 'text-center', 'py-1', 'font11md17', 'mb-2'].join(' ')} style={{background: '#F2F2F2', borderRadius: '2px', border: '1px solid #DEDEDE'}}>نمایه کاربری</a></Link>
                                            <Link href='/users/showreturned'><a onClick={() => {props.reduxStartLoading()}} className={['col-5', 'text-center', 'py-1', 'font11md17', 'mb-2'].join(' ')} style={{background: '#F2F2F2', borderRadius: '2px', border: '1px solid #DEDEDE'}}>تاریخچه مرجوعی</a></Link>
                                            <Link href='/users/charge_account'><a onClick={() => {props.reduxStartLoading()}} className={['col-5', 'text-center', 'py-1', 'font11md17', 'mb-2'].join(' ')} style={{background: '#F2F2F2', borderRadius: '2px', border: '1px solid #DEDEDE'}}>موجودی / شارژ حساب</a></Link>
                                            <Link href='https://honari.com/academy/user/courses'><a onClick={() => {props.reduxStartLoading()}} className={['col-5', 'text-center', 'py-1', 'font11md17', 'mb-2'].join(' ')} style={{background: '#F2F2F2', borderRadius: '2px', border: '1px solid #DEDEDE'}}>کلاس‌های من</a></Link>
                                            <Link href='/users/balance'><a onClick={() => {props.reduxStartLoading()}} className={['col-5', 'text-center', 'py-1', 'font11md17', 'mb-2'].join(' ')} style={{background: '#F2F2F2', borderRadius: '2px', border: '1px solid #DEDEDE'}}>تسویه حساب</a></Link>
                                            <Link href='https://docs.google.com/forms/d/e/1FAIpQLSdRYGrhGRHlNk0SlGD6v2UQCmq2gm5hkHFM4hEw4oeIJ5gz0w/viewform'><a onClick={() => {props.reduxStartLoading()}} className={['col-5', 'text-center', 'py-1', 'font11md17', 'mb-2'].join(' ')} style={{background: '#F2F2F2', borderRadius: '2px', border: '1px solid #DEDEDE'}}>همکاری در فروش</a></Link>
                                        </div>
                                    </div>
                                </div>
                                <div className={['col-12', 'col-md-10', 'container', 'mt-3'].join(' ')}>
                                    {
                                        userOrders !== null
                                        ?
                                        (
                                            userOrders.length === 0
                                            ?
                                            noPreviousOrder
                                            :
                                            previousOrdersList
                                        )
                                        :
                                        null
                                    }
                                </div>
                            </div>
                            </div>
                </React.Fragment>
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
        reduxAddToCart: (d) => dispatch({type: actionTypes.ADD_TO_CART, data: d}),
        reduxIncreaseCountByOne: (d) => dispatch({type: actionTypes.INCREASE_COUNT_BY_ONE, productId: d}),
        reduxDecreaseCountByOne: (d) => dispatch({type: actionTypes.DECREASE_COUNT_BY_ONE, productId: d}),
        reduxRemoveFromCart: (d) => dispatch({type: actionTypes.REMOVE_FROM_CART, productId: d}),
        reduxWipeCart: () => dispatch({type: actionTypes.WIPE_CART}),
        reduxUpdateUserTotally: (d) => dispatch({type: actionTypes.UPDATE_USER_TOTALLY, data: d}),
        reduxStartLoading: () => dispatch({type: actionTypes.START_LOADING}),
        reduxStopLoading: () => dispatch({type: actionTypes.STOP_LOADING}),
        reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserOrders);

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
                    destination: '/'
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
                destination: '/'
            }
        };
    }
}
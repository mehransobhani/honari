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
    const [loadingOrderIndex, setLoadingOrderIndex] = useState(-1);

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

    const getOrderStatus = (status) => {
        switch (status){
            case 1:
                return 'آماده سازی';
            case 2:
                return 'آماده سازی';
            case 3:
                return 'پایان آماده‌سازی';
            case 4: 
                return 'بررسی سفارش';
            case 5:
                return 'بسته بندی';
            case 6:
                return 'پرداخت نشده';
            case 7:
                return 'لغو شده';
            case 9:
                return 'ارسال شده';
        }
    }

    const updateUserOrderStatus  = (index, status) => {
        let newUserOrders = [];
        for(let i = 0; i< userOrders.length; i++){
            if(i === index){
                let o = userOrders[i];
                o.status = status;
                newUserOrders.push(o);
            }else{
                newUserOrders.push(userOrders[i]);
            }
        }
        setUserOrders(newUserOrders);
    }

    const cancelOrder = (orderIndex) => {
        if(loadingOrderIndex !== -1){
            return;
        }
        setLoadingOrderIndex(orderIndex);
        axios.post(Constants.apiUrl + '/api/user-cancel-order', {
            orderId: userOrders[orderIndex].id
        }, {
            headers: {
                'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
            }
        }).then((res) => {
            setLoadingOrderIndex(-1);
            let response = res.data;
            if(response.status === 'done'){
                updateUserOrderStatus(orderIndex, 7);
                props.reduxUpdateSnackbar('success', true, 'سفارش با موفقیت لغو شد');
            }else if(response.status === 'failed'){
                console.warn(response.message);
                prpos.reduxUpdateSnackbar('warning', true, response.umessage);
            }
        }).catch((error) => {
            setLoadingOrderIndex(-1);
            console.error(error);
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
        });
    }

    const noPreviousOrder = (
        <div className={['row', 'px-2'].join(' ')}>
            <div className={['col-12', 'd-flex', 'flex-column', 'align-items-center', 'py-3'].join(' ')} style={{background: '#F2F2F2', borderRadius: '4px'}}>
                <img src={Constants.baseUrl + '/assets/images/main_images/shopping_cart_yellow.png'} style={{width: '50px', height: '50px'}} />
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
                <span className={['col-2', 'text-center'].join(' ')} style={{fontSize: '12px', color: '#00BAC6', fontWeight: '500'}}>عملیات</span>
            </div>
            {
                userOrders !== null && userOrders.length !== 0 && userOrders !== undefined && userOrders !== '[]'
                ?
                (
                    userOrders.map((item, counter) => {
                        return(
                            <React.Fragment key={counter}>
                                <div className={['row', 'px-2', 'py-3', 'mt-1', 'd-none', 'd-md-flex'].join(' ')} style={{borderRadius: '3px', background: '#F2F2F2'}}>
                                    <span className={['col-1', 'text-center'].join(' ')} style={{fontSize: '12px', color: 'black', fontWeight: '500'}}>{counter + 1}</span>
                                    <span className={['col-2', 'text-center', 'rtl'].join(' ')} style={{fontSize: '12px', color: 'black', fontWeight: '500'}}>{getOrderStatus(item.status)}</span>
                                    <span className={['col-2', 'text-center', 'rtl'].join(' ')} style={{fontSize: '12px', color: 'black', fontWeight: '500'}}>{item.date}</span>
                                    <span className={['col-2', 'text-center', 'rtl'].join(' ')} style={{fontSize: '12px', color: 'black', fontWeight: '500'}}>{item.price + ' تومان'}</span>
                                    <span className={['col-2', 'text-center'].join(' ')} style={{fontSize: '12px', color: 'black', fontWeight: '500'}}>{item.orderReferenceId}</span>
                                    <Link href={'/users/factor/' + item.id} ><a className={['col-1', 'text-center', 'pointer'].join(' ')} style={{fontSize: '12px', color: 'black', fontWeight: '500'}}>مشاهده</a></Link>
                                    <span className={['col-2', 'text-center'].join(' ')} style={{fontSize: '12px', color: 'black', fontWeight: '500'}}>
                                        {
                                            loadingOrderIndex !== counter
                                            ?
                                                (
                                                    item.status === 1
                                                    ?
                                                        <button onClick={() => {cancelOrder(counter)}} className={['text-center', 'mb-0', 'pointer'].join(' ')} style={{fontSize: '11px', background: 'none', color: 'red', border: 'none', outline: 'none'}}>لغو سفارش</button>
                                                    :
                                                        null
                                                )
                                            :
                                            <button className={['text-center', 'mb-0', 'pointer', 'txt-warning'].join(' ')} style={{fontSize: '11px', background: 'none', border: 'none', outline: 'none'}}>کمی صبر کنید</button>
                                        }
                                    </span>
                                </div>
                                <div className={['row', 'px-2', 'py-2', 'mt-1', 'd-md-none'].join(' ')} style={{borderRadius: '3px', background: '#F2F2F2'}}>
                                    <div className={['col-6', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right'].join(' ')}>
                                        <h6 className={['mb-0', 'pl-2'].join(' ')} style={{fontSize: '11px'}}>وضعیت :</h6>
                                        <h6 className={['mb-0'].join(' ')} style={{fontSize: '11px'}}>{getOrderStatus(item.status)}</h6>
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
                                        <h6 className={['mb-0'].join(' ')} style={{fontSize: '11px'}}>{item.orderReferenceId}</h6>
                                    </div>
                                    <div className={['col-6', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'mt-3'].join(' ')}>
                                        <Link href={'/users/factor/' + item.id} ><a className={[''].join(' ')} style={{fontSize: '11px', color: '#00BAC6'}}>مشاهده جزئیات</a></Link>
                                    </div>
                                    <div className={['col-6', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'mt-3'].join(' ')}>
                                        {
                                            item.status === 1
                                            ?
                                                <button onClick={() => {cancelOrder(counter)}} className={['text-center', 'mb-0', 'pointer'].join(' ')} style={{fontSize: '11px', background: 'none', color: 'red', border: 'none', outline: 'none'}}>لغو سفارش</button>
                                            :
                                                null
                                        }
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
                <title>سفارش‌های من | هنری</title>
                <link rel="icon" href={ Constants.baseUrl + "/favicon.ico"} type="image/x-icon"/>
            </Head>
            <Header menu={props.ssrMenu} />
        {
            userAllowd ?
                <React.Fragment>
                    <div className={['container'].join(' ')}>
                            <div className={['row', 'rtl', 'mt-3'].join(' ')}>
                                <div className={['col-2', 'd-none', 'd-md-flex', 'flex-column', 'align-items-center'].join(' ')}>
                                    <img src={Constants.baseUrl + '/assets/images/main_images/user_full_circle_main.png'} style={{width: '50%'}} />
                                    <Link href='/users/view'><a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-2', 'w-100', 'pointer', 'mt-2'].join(' ')} style={{background: '#F2F2F2', border: '1px solid #DEDEDE', fontSize: '17px',borderRadius: '4px'}}>نمایه کاربر</a></Link>
                                    <h6 className={['text-center', 'py-2', 'w-100', 'pointer', 'mt-2', 'mb-0'].join(' ')} style={{background: '#F2F2F2', border: '1px solid #00BAC6', fontSize: '17px',borderRadius: '4px', color: '#00BAC6'}}>سفارش‌های من</h6>
                                    <Link href='/users/showreturned'><a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-2', 'w-100', 'pointer', 'mt-2'].join(' ')} style={{background: '#F2F2F2', border: '1px solid #DEDEDE', fontSize: '17px',borderRadius: '4px'}}>تاریخچه مرجوعی</a></Link>
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
                destination: '/'
            }
        };
    }
}
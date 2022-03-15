import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import * as Constants from '../../../components/constants';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import {useCookies} from 'react-cookie';
import styles from './style.module.css';
import * as actionTypes from '../../../store/actions';
import {connect} from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';

const UserPanel  = (props) => {

    const [userAddressInformation, setUserAddressInformation] = useState(null);

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
        if(props.reduxUser.status === 'GUEST'){
            window.location.href = 'https://honari.com/user';
        }else if(props.reduxUser.status === 'LOGIN'){
            setUserAddressInformation(JSON.parse(props.reduxUser.information.address).addressPack);
        }
    }, [props.reduxUser.status, 'NI']);

    return(
        <React.Fragment>
            <Head>
                <title>نمایه کاربری | هنری</title>
                <link rel="icon" href={ Constants.baseUrl + "/favicon.ico"} type="image/x-icon"/>
            </Head>
                <React.Fragment>
                    <Header menu={props.ssrMenu} />
                        <div className={['container'].join(' ')}>
                            <div className={['row', 'rtl', 'mt-3'].join(' ')}>
                                <div className={['col-2', 'd-none', 'd-md-flex', 'flex-column', 'align-items-center'].join(' ')}>
                                    <img src={Constants.baseUrl + '/assets/images/main_images/panel_user_main.svg'} style={{width: '50%', border: '4px solid #00BAC6', borderRadius: '50%'}} />
                                    <div className={['text-center', 'py-3', 'w-100', 'pointer', 'mt-3'].join(' ')} style={{fontSize: '14px', borderTop: '1px solid #DEDEDE', borderBottom: '1px solid #DEDEDE', borderRight: '1px dashed #DEDEDE', borderLeft: '1px dashed #DEDEDE', background: '#F9F9F9'}}>
                                        <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                            <img src={Constants.baseUrl + '/assets/images/main_images/panel_user_main.svg'} style={{width: '25px', height: '25px'}} />
                                            <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px', color: '#00BAC6'}}>نمایه کاربری</h6>
                                        </div>
                                    </div>
                                    <Link href='/users/orders'>
                                        <a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-3', 'w-100', 'pointer'].join(' ')} style={{fontSize: '14px', borderBottom: '1px solid #DEDEDE'}}>
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/panel_cart_black.svg'} style={{width: '25px', height: '25px'}} />
                                                <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px'}}>سفارش‌های من</h6>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href='/users/showreturned'>
                                        <a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-3', 'w-100', 'pointer'].join(' ')} style={{fontSize: '14px', borderBottom: '1px solid #DEDEDE'}}>
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/panel_return_black.svg'} style={{width: '25px', height: '25px'}} />
                                                <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px'}}>تاریخچه مرجوعی</h6>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href='/users/charge_account'>
                                        <a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-3', 'w-100', 'pointer'].join(' ')} style={{fontSize: '14px', borderBottom: '1px solid #DEDEDE'}}>
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/panel_wallet_black.svg'} style={{width: '25px', height: '25px'}} />
                                                <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px'}}>موجودی/شارژ حساب</h6>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href='https://honari.com/academy/user/courses'>
                                        <a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-3', 'w-100', 'pointer'].join(' ')} style={{fontSize: '14px', borderBottom: '1px solid #DEDEDE'}}>
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/panel_video_black.svg'} style={{width: '25px', height: '25px'}} />
                                                <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px'}}>کلاس‌های من</h6>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href='/users/balance'>
                                        <a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-3', 'w-100', 'pointer'].join(' ')} style={{fontSize: '14px', borderBottom: '1px solid #DEDEDE'}}>
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/panel_checkout_black.svg'} style={{width: '25px', height: '25px'}} />
                                                <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px'}}>تسویه حساب</h6>
                                            </div>
                                        </a>
                                    </Link>
                                    <Link href='https://docs.google.com/forms/d/e/1FAIpQLSdRYGrhGRHlNk0SlGD6v2UQCmq2gm5hkHFM4hEw4oeIJ5gz0w/viewform'>
                                        <a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-3', 'w-100', 'pointer'].join(' ')} style={{fontSize: '14px'}}>
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/panel_cooperation_black.svg'} style={{width: '25px', height: '25px'}} />
                                                <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px'}}>همکاری در فروش</h6>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                                <div className={['col-12', 'd-md-none'].join(' ')}>
                                <div className={['container'].join(' ')}>
                                        <div className={['row', 'rtl', 'justify-content-between'].join(' ')} style={{borderTop: '1px solid #DEDEDE', borderRight: '1px dashed #DEDEDE', borderLeft: '1px dashed #DEDEDE'}}>
                                            <div className={['col-12', 'text-center', 'py-3', 'w-100', 'pointer', 'd-flex', 'flex-row', 'justify-content-center'].join(' ')} style={{fontSize: '14px', borderBottom: '1px solid #DEDEDE', background: '#F9F9F9'}}>
                                                <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-center', 'px-2'].join(' ')} style={{position: 'relative', left: '0.5rem'}}>
                                                    <img src={Constants.baseUrl + '/assets/images/main_images/panel_user_main.svg'} style={{width: '20px', height: '20px'}} />
                                                    <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '13px', color: '#00BAC6'}}>نمایه کاربری</h6>
                                                </div>
                                            </div>
                                            <Link href='/users/orders'>
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{borderBottom: '1px solid #DEDEDE', borderLeft: '1px dashed #DEDEDE'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start'].join(' ')}>
                                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_cart_black.svg'} style={{width: '20px', height: '20px'}} />
                                                        <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '11px'}}>سفارش‌های من</h6>
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href='/users/showreturned'>
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{borderLeft: '1px dashed #DEDEDE', borderBottom: '1px solid #DEDEDE'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start'].join(' ')}>
                                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_return_black.svg'} style={{width: '20px', height: '20px'}} />
                                                        <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '11px'}}>تاریخچه مرجوعی</h6>
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href='/users/charge_account'>
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{borderBottom: '1px solid #DEDEDE', borderLeft: '1px dashed #DEDEDE'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start'].join(' ')}>
                                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_wallet_black.svg'} style={{width: '20px', height: '20px'}} />
                                                        <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '11px'}}>موجودی/شارژ حساب</h6>
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href='https://honari.com/academy/user/courses'>
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{borderLeft: '1px dashed #DEDEDE', borderBottom: '1px solid #DEDEDE'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start'].join(' ')}>
                                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_video_black.svg'} style={{width: '20px', height: '20px'}} />
                                                        <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '11px'}}>کلاس‌های من</h6>
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href='/users/balance'>
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{borderBottom: '1px solid #DEDEDE', borderLeft: '1px dashed #DEDEDE'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start'].join(' ')}>
                                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_checkout_black.svg'} style={{width: '20px', height: '20px'}} />
                                                        <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '11px'}}>تسویه حساب</h6>
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href='https://docs.google.com/forms/d/e/1FAIpQLSdRYGrhGRHlNk0SlGD6v2UQCmq2gm5hkHFM4hEw4oeIJ5gz0w/viewform'>
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{borderLeft: '1px dashed #DEDEDE', borderBottom: '1px solid #DEDEDE'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start'].join(' ')}>
                                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_cooperation_black.svg'} style={{width: '20px', height: '20px'}} />
                                                        <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '11px'}}>همکاری در فروش</h6>
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className={['col-12', 'col-md-10', 'container', 'mt-3', 'mt-md-5', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center'].join(' ')}>
                                    <img src={Constants.baseUrl + '/assets/images/main_images/panel_user_main.svg'} className={['d-md-none'].join(' ')} style={{width: '20%', borderRadius: '50%', border: '4px solid #00BAC6'}} />
                                    <div className={['row', 'mt-3', 'px-2'].join(' ')}>
                                        <div className={['col-12', 'col-md-6', 'p-2'].join(' ')}>
                                            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                                                <h6 className={['py-2', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{background: '#F2F2F2', flex: '0.3', fontWeight: '500'}}>نام</h6>
                                                <h6 className={['py-2', 'mb-0', 'text-right', 'pr-3', 'font11md17'].join(' ')} style={{flex: '1'}}>
                                                {
                                                    props.reduxUser.status === 'NI'
                                                    ?
                                                    ''
                                                    :
                                                    props.reduxUser.information.firstName
                                                }
                                                </h6>
                                            </div>
                                        </div>
                                        <div className={['col-12', 'col-md-6', 'p-2'].join(' ')}>
                                            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                                                <h6 className={['py-2', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{background: '#F2F2F2', flex: '0.3', fontWeight: '500'}}>نام خانوادگی</h6>
                                                <h6 className={['py-2', 'mb-0', 'text-right', 'pr-3', 'font11md17'].join(' ')} style={{flex: '1'}}>
                                                    {
                                                        props.reduxUser.status === 'NI'
                                                        ?
                                                        ''
                                                        :
                                                        props.reduxUser.information.lastName
                                                    }
                                                </h6>
                                            </div>
                                        </div>
                                        <div className={['col-12', 'col-md-6', 'p-2'].join(' ')}>
                                            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                                                <h6 className={['py-2', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{background: '#F2F2F2', flex: '0.3', fontWeight: '500'}}>پست الکترونیک</h6>
                                                <h6 className={['py-2', 'mb-0', 'text-right', 'pr-3', 'font11md17'].join(' ')} style={{flex: '1'}}>
                                                    {
                                                        props.reduxUser.status === 'NI'
                                                        ?
                                                        ''
                                                        :
                                                        props.reduxUser.information.email
                                                    }
                                                </h6>
                                            </div>
                                        </div>
                                        <div className={['col-12', 'col-md-6', 'p-2'].join(' ')}>
                                            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                                                <h6 className={['py-2', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{background: '#F2F2F2', flex: '0.3', fontWeight: '500'}}>نام نمایشی</h6>
                                                <h6 className={['py-2', 'mb-0', 'text-right', 'pr-3', 'font11md17'].join(' ')} style={{flex: '1'}}>
                                                    {
                                                        props.reduxUser.status === 'NI'
                                                        ?
                                                        ''
                                                        :
                                                        props.reduxUser.information.name
                                                    }
                                                </h6>
                                            </div>
                                        </div>
                                        <div className={['col-12', 'col-md-6', 'p-2'].join(' ')}>
                                            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                                                <h6 className={['py-2', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{background: '#F2F2F2', flex: '0.3', fontWeight: '500'}}>موبایل</h6>
                                                <h6 className={['py-2', 'mb-0', 'text-right', 'pr-3', 'font11md17'].join(' ')} style={{flex: '1'}}>
                                                    {
                                                        props.reduxUser.status === 'NI'
                                                        ?
                                                        ''
                                                        :
                                                        props.reduxUser.information.mobile
                                                    }
                                                </h6>
                                            </div>
                                        </div>
                                        <div className={['col-12', 'col-md-6', 'p-2'].join(' ')}>
                                            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                                                <h6 className={['py-2', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{background: '#F2F2F2', flex: '0.3', fontWeight: '500'}}>تلفن ثابت</h6>
                                                <h6 className={['py-2', 'mb-0', 'text-right', 'pr-3', 'font11md17'].join(' ')} style={{flex: '1'}}>
                                                    {
                                                        props.reduxUser.status === 'NI'
                                                        ?
                                                        ''
                                                        :
                                                        props.reduxUser.information.telephone
                                                    }
                                                </h6>
                                            </div>
                                        </div>
                                        <div className={['col-6', 'col-md-4', 'p-2'].join(' ')}>
                                            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                                                <h6 className={['py-2', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{background: '#F2F2F2', flex: '0.3', fontWeight: '500'}}>استان</h6>
                                                <h6 className={['py-2', 'mb-0', 'text-right', 'pr-3', 'font11md17'].join(' ')} style={{flex: '1'}}>
                                                    {
                                                        userAddressInformation === null
                                                        ?
                                                        ''
                                                        :
                                                        userAddressInformation.province
                                                    }
                                                </h6>
                                            </div>
                                        </div>
                                        <div className={['col-6', 'col-md-4', 'p-2'].join(' ')}>
                                            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                                                <h6 className={['py-2', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{background: '#F2F2F2', flex: '0.3', fontWeight: '500'}}>شهر</h6>
                                                <h6 className={['py-2', 'mb-0', 'text-right', 'pr-3', 'font11md17'].join(' ')} style={{flex: '1'}}>
                                                    {
                                                        userAddressInformation === null
                                                        ?
                                                        ''
                                                        :
                                                        userAddressInformation.city
                                                    }
                                                </h6>
                                            </div>
                                        </div>
                                        <div className={['col-12', 'col-md-4', 'p-2'].join(' ')}>
                                            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                                                <h6 className={['py-2', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{background: '#F2F2F2', flex: '0.3', fontWeight: '500'}}>کد پستی</h6>
                                                <h6 className={['py-2', 'mb-0', 'text-right', 'pr-3', 'font11md17'].join(' ')} style={{flex: '1'}}>
                                                    {
                                                        userAddressInformation === null
                                                        ?
                                                        ''
                                                        :
                                                        userAddressInformation.postal
                                                    }
                                                </h6>
                                            </div>
                                        </div>
                                        <div className={['col-12', 'p-2'].join(' ')}>
                                            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                                                <h6 className={['py-2', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{background: '#F2F2F2', flex: '0.12', fontWeight: '500'}}>آدرس</h6>
                                                <h6 className={['py-2', 'mb-0', 'text-right', 'pr-3', 'font11md17'].join(' ')} style={{flex: '1'}}>
                                                    {
                                                        userAddressInformation === null
                                                        ?
                                                        ''
                                                        :
                                                        userAddressInformation.address
                                                    }
                                                </h6>
                                            </div>
                                        </div>
                                        <div className={['col-12', 'mt-3', 'd-flex', 'flex-row', 'justify-content-center'].join(' ')}>
                                            <a href='https://honari.com/user/edit' className={['px-5', 'py-2', 'font11md17'].join(' ')} style={{background: '#00BAC6', color: 'white', fontSize: '17px', borderRadius: '2px'}}>ویرایش</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <Footer />
                </React.Fragment>
         
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

export default connect(mapStateToProps, mapDispatchToProps)(UserPanel);

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
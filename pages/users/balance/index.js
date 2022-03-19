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
import styles from './style.module.css';
import { FormatListNumberedRtlOutlined, MicNone } from '@material-ui/icons';
import Image from 'next/image';

const UserBalance = (props) => {

    const [cookies , setCookie , removeCookie] = useCookies();
    const [userPreviousRequests, setUserPreviousRequests] = useState([]);
    const [shebaPartOne, setShebaPartOne] = useState('');
    const [shebaPartTwo, setShebaPartTwo] = useState('');
    const [shebaPartThree, setShebaPartThree] = useState('');
    const [shebaPartFour, setShebaPartFour] = useState('');
    const [shebaPartFive, setShebaPartFive] = useState('');
    const [accountOwnerName, setAccountOwnerName] = useState('');
    const [httpRequestProcessing, setHttpRequestProcessing] = useState(false);

    useEffect(() => {
        props.reduxUpdateUserTotally(props.ssrUser);
        getUserPreviousWithdrawalRequests();
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
            window.location.href = 'https://honari.com/user/login';
        }
    }, []);

    const getUserPreviousWithdrawalRequests = () => {
        axios.post(Constants.apiUrl + '/api/user-withdrawal-history',{},{
            headers: {
                'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
            }
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                setUserPreviousRequests(response.history);
            }else if(response.status === 'failed'){
                props.reduxUpdateSnackbar('warning', true, response.umessage);
            }
        }).catch((error) => {
            console.error(error);
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
        });
    }

    const shebaPartOneChagned = (event) => {
        if(event.target.value.length <= 2){
            setShebaPartOne(event.target.value);
        }
    }

    const shebaPartTwoChagned = (event) => {
        if(event.target.value.length <= 3){
            setShebaPartTwo(event.target.value);
        }
    }

    const shebaPartThreeChanged = (event) => {
        if(event.target.value.length <= 6){
            setShebaPartThree(event.target.value);
        }
    }

    const shebaPartFourChanged = (event) => {
        if(event.target.value.length <= 6){
            setShebaPartFour(event.target.value);
        }
    }

    const shebaPartFiveChanged = (event) => {
        if(event.target.value.length <= 7){
            setShebaPartFive(event.target.value);
        }
    }

    const accountOwnerNameInputChanged = (event) => {
        setAccountOwnerName(event.target.value);
    }

    const checkWithdrawalRequestInformation = () => {
        if(httpRequestProcessing){
            return;
        }
        let checkSheba = false;
        let checkName = false;
        if(shebaPartOne.length === 2 && shebaPartTwo.length === 3 && shebaPartThree.length === 6 && shebaPartFour.length === 6 && shebaPartFive.length === 7){
            checkSheba = true;
        }
        if(accountOwnerName.length >= 3){
            checkName = true;
        }
        if(checkName && checkSheba){
            setHttpRequestProcessing(true);
            axios.post(Constants.apiUrl + '/api/user-add-withdrawal-request', {
                cardNumber: "IR-" + shebaPartOne + "-" + shebaPartTwo + "-" + shebaPartThree + "-" + shebaPartFour + "-" + shebaPartFive,
                cardOwner: accountOwnerName
            },{
                headers: {
                    'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
                }
            }).then((res) => {
                setHttpRequestProcessing(false);
                let response = res.data;
                if(response.status === 'done'){
                    props.reduxUpdateSnackbar('success', true, 'درخواست شما با موفقیت ثبت شد');
                    getUserPreviousWithdrawalRequests();
                }else if(response.status === 'failed'){
                    console.warn(response.message);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
            }).catch((error) => {
                setHttpRequestProcessing(false);
                console.error(error);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            });
        }else{
            props.reduxUpdateSnackbar('warning', true, 'لطفا موارد خواسته‌شده را به درستی وارد کنید');
        }
    }

    return(
        <React.Fragment>
            <Head>
                <title>درخواست تسویه حساب | هنری</title>
                <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
            </Head>
            <Header menu={props.ssrMenu} />
                <React.Fragment>
                    <div className={['container'].join(' ')}>
                        <div className={['row', 'rtl', 'mt-3'].join(' ')}>
                            <div className={['col-2', 'd-none', 'd-md-flex', 'flex-column', 'align-items-center'].join(' ')}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/panel_checkout_main.svg'} style={{width: '50%', border: '4px solid #00BAC6', borderRadius: '50%'}} />
                                <Link href='/users/view'>
                                    <a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-3', 'w-100', 'pointer', 'mt-3'].join(' ')} style={{fontSize: '14px', borderBottom: '1px solid #DEDEDE'}}>
                                        <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                            <img src={Constants.baseUrl + '/assets/images/main_images/panel_user_black.svg'} style={{width: '25px', height: '25px'}} />
                                            <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px'}}>نمایه کاربری</h6>
                                        </div>
                                    </a>
                                </Link>
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
                                    <a onClick={() => {props.reduxStartLoading()}} className={['text-center', 'py-3', 'w-100', 'pointer'].join(' ')} style={{fontSize: '14px'}}>
                                        <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                            <img src={Constants.baseUrl + '/assets/images/main_images/panel_video_black.svg'} style={{width: '25px', height: '25px'}} />
                                            <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px'}}>کلاس‌های من</h6>
                                        </div>
                                    </a>
                                </Link>
                                <div className={['text-center', 'py-3', 'w-100', 'pointer'].join(' ')} style={{fontSize: '14px', borderTop: '1px solid #DEDEDE', borderBottom: '1px solid #DEDEDE', borderRight: '1px dashed #DEDEDE', borderLeft: '1px dashed #DEDEDE', background: '#F9F9F9'}}>
                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'px-2'].join(' ')}>
                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_checkout_main.svg'} style={{width: '25px', height: '25px'}} />
                                        <h6 className={['mb-0', 'mr-2'].join(' ')} style={{fontSize: '14px', color: '#00BAC6'}}>تسویه حساب</h6>
                                    </div>
                                </div>
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
                                                    <img src={Constants.baseUrl + '/assets/images/main_images/panel_checkout_main.svg'} style={{width: '20px', height: '20px'}} />
                                                    <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '13px', color: '#00BAC6'}}>تسویه حساب</h6>
                                                </div>
                                            </div>
                                            <Link href='/users/view'>
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{borderBottom: '1px solid #DEDEDE', borderLeft: '1px dashed #DEDEDE'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start'].join(' ')}>
                                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_user_black.svg'} style={{width: '20px', height: '20px'}} />
                                                        <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '11px'}}>نمایه کابری</h6>
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href='/users/orders'>
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
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
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start'].join(' ')}>
                                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_wallet_black.svg'} style={{width: '20px', height: '20px'}} />
                                                        <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '11px'}}>موجودی/شارژ حساب</h6>
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href='https://honari.com/academy/user/courses'>
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{ borderBottom: '1px solid #DEDEDE', borderLeft: '1px dashed #DEDEDE'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start'].join(' ')}>
                                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_video_black.svg'} style={{width: '20px', height: '20px'}} />
                                                        <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '11px'}}>کلاس‌های من</h6>
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href='https://docs.google.com/forms/d/e/1FAIpQLSdRYGrhGRHlNk0SlGD6v2UQCmq2gm5hkHFM4hEw4oeIJ5gz0w/viewform'>
                                                <a onClick={() => {props.reduxStartLoading()}} className={['col-6', 'text-center', 'py-2', 'font11md17', 'pr-5'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start'].join(' ')}>
                                                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_cooperation_black.svg'} style={{width: '20px', height: '20px'}} />
                                                        <h6 className={['mb-0', 'mr-1'].join(' ')} style={{fontSize: '11px'}}>همکاری در فروش</h6>
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                </div>
                            </div>
                            <div className={['col-12', 'col-md-10', 'mt-3', 'justify-content-center'].join(' ')}>
                                <h6 className={['text-center', 'mt-2'].join(' ')}>شماره شبا</h6>
                                <div className={['d-flex', 'felx-row', 'justify-content-center', 'ltr', 'align-items-center'].join(' ')}>
                                    <h6 className={['ltr', 'mb-0', 'px-1'].join(' ')}>IR -</h6>
                                    <input type='text' value={shebaPartOne} onChange={shebaPartOneChagned} placeholder='_ _' className={['text-center'].join(' ')} style={{width: '24px', fontSize: '15px', border: 'none'}} />
                                    <h6 className={['ltr', 'mb-0', 'px-1'].join(' ')}>-</h6>
                                    <input type='text' value={shebaPartTwo} onChange={shebaPartTwoChagned} placeholder='_ _ _' className={['text-center'].join(' ')} style={{width: '34px', fontSize: '15px', border: 'none'}} />
                                    <h6 className={['ltr', 'mb-0', 'px-1'].join(' ')}>-</h6>
                                    <input type='text' value={shebaPartThree} onChange={shebaPartThreeChanged} placeholder='_ _ _ _ _ _' className={['text-center'].join(' ')} style={{width: '62px', fontSize: '15px', border: 'none'}} />
                                    <h6 className={['ltr', 'mb-0', 'px-1'].join(' ')}>-</h6>
                                    <input type='text' value={shebaPartFour} onChange={shebaPartFourChanged} placeholder='_ _ _ _ _ _' className={['text-center'].join(' ')} style={{width: '62px', fontSize: '15px', border: 'none'}} />
                                    <h6 className={['ltr', 'mb-0', 'px-1'].join(' ')}>-</h6>
                                    <input type='text' value={shebaPartFive} onChange={shebaPartFiveChanged} placeholder='_ _ _ _ _ _ _' className={['text-center'].join(' ')} style={{width: '72px', fontSize: '15px', border: 'none'}} />
                                </div>
                                <h6 className={['text-center', 'mt-3'].join(' ')}>نام و نام خانوادگی صاحب حساب</h6>
                                <div className={['d-flex', 'flex-column', 'justify-content-center', 'align-items-center'].join(' ')}>
                                    <input type='text' onChange={accountOwnerNameInputChanged} placeholder='.............................................' className={['text-center', styles.noFocus].join(' ')} style={{border: 'none', width: '300px', forcedColorAdjust: 'none'}} />
                                    <button className={['px-3', 'py-2', 'pointer', 'mt-3'].join(' ')} style={{background: 'green', color: 'white', outline: 'none', border: 'none', borderRadius: '3px', fontSize: '14px'}} onClick={checkWithdrawalRequestInformation}>
                                        {
                                            httpRequestProcessing
                                            ?
                                            "کمی صبر کنید"
                                            :
                                            "ارسال جهت بررسی"
                                        }
                                    </button>
                                </div>
                                <div className={['container'].join(' ')}>
                                    {
                                        userPreviousRequests.length !== 0
                                        ?
                                            <React.Fragment>
                                                <h6 className={['text-center', 'font11md17', 'mt-5'].join(' ')} >گزارش درخواست‌های تسویه</h6>
                                                <div className={['row', 'mt-2', 'p-1', 'rtl', 'd-none', 'd-md-flex', 'align-items-center'].join(' ')} style={{background: '#F2F2F2', borderRadius: '3px'}}>
                                                    <span className={['col-1', 'text-center'].join(' ')} style={{fontSize: '14px'}}>ردیف</span>
                                                    <span className={['col-4', 'text-center'].join(' ')} style={{fontSize: '14px'}}>شماره شبا</span>
                                                    <span className={['col-2', 'text-center'].join(' ')} style={{fontSize: '14px'}}>مبلغ درخواستی</span>
                                                    <span className={['col-2', 'text-center'].join(' ')} style={{fontSize: '14px'}}>تاریخ</span>
                                                    <span className={['col-1', 'text-center'].join(' ')} style={{fontSize: '14px'}}>زمان</span>
                                                    <span className={['col-2', 'text-center'].join(' ')} style={{fontSize: '14px'}}>وضعیت</span>
                                                </div>
                                            </React.Fragment>
                                        :
                                        null
                                    }
                                    {
                                        userPreviousRequests.map((item, counter) => {
                                            return(
                                                <div key={counter} className={['row', 'mt-2', 'p-1', 'rtl', 'align-items-center', 'd-none', 'd-md-flex'].join(' ')} style={{background: '#F2F2F2', borderRadius: '3px'}}>
                                                    <span className={['col-1', 'text-center'].join(' ')} style={{fontSize: '14px'}}>{counter + 1}</span>
                                                    <span className={['col-4', 'text-center'].join(' ')} style={{fontSize: '14px'}}>{item.sheba}</span>
                                                    <span className={['col-2', 'text-center', 'rtl'].join(' ')} style={{fontSize: '14px'}}>{parseInt(item.balance).toLocaleString() + ' تومان'}</span>
                                                    <span className={['col-2', 'text-center', 'rtl'].join(' ')} style={{fontSize: '14px'}}>{item.date}</span>
                                                    <span className={['col-1', 'text-center', 'rtl'].join(' ')} style={{fontSize: '14px'}}>{item.time}</span>
                                                    <span className={['col-2', 'text-center'].join(' ')} style={{fontSize: '14px'}}>
                                                        {
                                                            item.status == 0
                                                            ?
                                                            "در انتظار تایید"
                                                            :
                                                            (
                                                                item.status == 1
                                                                ?
                                                                "تایید شد"
                                                                :
                                                                (
                                                                    item.status == 2
                                                                    ?
                                                                    "رد شد"
                                                                    :
                                                                    ""
                                                                )
                                                            )
                                                        }
                                                    </span>
                                                </div> 
                                            );
                                        })
                                    }
                                    {
                                        userPreviousRequests.map((item, counter) => {
                                            return(
                                                <div key={counter} className={['row', 'mt-2', 'p-1', 'rtl', 'align-items-center', 'd-md-none'].join(' ')} style={{background: '#F2F2F2', borderRadius: '3px'}}>
                                                    <span className={['col-12', 'text-right'].join(' ')} style={{fontSize: '14px'}}>{"شماره شبا : ‌" + item.sheba}</span>
                                                    <span className={['col-6', 'text-right', 'rtl'].join(' ')} style={{fontSize: '14px'}}>{"تاریخ : " + item.date}</span>
                                                    <span className={['col-6', 'text-right', 'rtl'].join(' ')} style={{fontSize: '14px'}}>{"زمان :‌ " + item.time}</span>
                                                    <span className={['col-6', 'text-right', 'rtl'].join(' ')} style={{fontSize: '14px'}}>{' تومان' + parseInt(item.balance).toLocaleString()}</span>
                                                    <span className={['col-6', 'text-right'].join(' ')} style={{fontSize: '14px'}}>
                                                        {
                                                            item.status == 0
                                                            ?
                                                            "وضعیت : در انتظار تایید"
                                                            :
                                                            (
                                                                item.status == 1
                                                                ?
                                                                "وضعیت : تایید شد"
                                                                :
                                                                (
                                                                    item.status == 2
                                                                    ?
                                                                    "وضعیت : رد شد"
                                                                    :
                                                                    ""
                                                                )
                                                            )
                                                        }
                                                    </span>
                                                </div> 
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserBalance);

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
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {useCookies} from 'react-cookie';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import * as Constants from '../../../components/constants';
import * as actionTypes from '../../../store/actions';
import {connect} from 'react-redux';
import Image from 'next/image';
import { SkipPreviousOutlined } from '@material-ui/icons';
import Head from 'next/head';

const Payment = (props) => {

    const [userStatus, setUserStatus] = useState('');
    const [cookies , setCookie , removeCookie] = useCookies();
    const [userInformation, setUserInformation] = useState({});
    const [userAddress, setUserAddress] = useState({});
    const [deliverOptions, setDeliveryOptions] = useState([]);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(-1);
    const [userAddressStatus, setUserAddressStatus] = useState(null);
    const [availableWorkTimes, setAvailableWorkTimes] = useState([]);
    const [selectedWorkTimeDate, setSelectedWorkTimeDate] = useState(0);
    const [selectedWorkTimeId, setSelectedWorkTimeId] = useState(0);
    const [requiresWorkTimeId, setRequiresWorkTimeId] = useState(false);

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
                    console.warn(response.umessage);
                }
            }).catch((error)=>{
                console.error(error);
                props.reduxUpdateCart([]);
                alert('?????????? ?????? ???????? ???????? ?????????? ???????????? ????????');
            });
        }else if(props.ssrUser.status === 'GUEST'){
            window.location.href = 'https://honari.com/user/login';
        }
    }, []);

    useEffect(() => {
        if(props.reduxUser.status === 'GUEST'){
            setUserAddressStatus('HAVE_TO_LOGIN');
            window.location.href = 'https://honari.com/user';
        }else if(props.reduxUser.status === 'LOGIN'){
            if(props.reduxUser.information.address === '' || props.reduxUser.information.address === '{"addressPack":{"province":"","city":"","postal":"","address":""}}'){
                setUserAddressStatus('HAVE_TO_EDIT');
            }else{
                setUserAddress(JSON.parse(props.reduxUser.information.address).addressPack);
                setUserAddressStatus('HAS_ADDRESS');
                getUserDeliveryOptions();
            }
        }
    }, [props.reduxUser.status, 'NI']);

    const getActiveDeliveryWorkTimes = () => {
        axios.post(Constants.apiUrl + '/api/user-delivery-service-work-times',{
            deliveryServiceId: 11,
        }, {
            headers: {
                'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
            }
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                setAvailableWorkTimes(response.workTimes);
            }else if(response.status === 'failed'){
                console.warn(response.message);
                props.reduxUpdateSnackbar('warning', true, response.umessage);
            }
        }).catch((error) => {
            console.error(error);
            props.reduxUpdateSnackbar('error', true, '?????? ???? ?????????????? ????????????');
        });
    }

    const getUserDeliveryOptions = () => {
        axios.post(Constants.apiUrl + '/api/user-delivery-options',{},{
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token, 
            }
        }).then((res) => {
            let response = res.data;
            if(response.status == 'done'){
                console.warn(response.options);
                setDeliveryOptions(response.options);
            }else if(response.status === 'failed'){
                console.warn(response.message);
                props.reduxUpdateSnackbar('warning', true, response.umessage);
            }
        }).catch((error) => {
            alert('?????? ???? ?????????????? ????????????');
            console.log(error);
        });
    }

    const setTemporaryInformation = (serviceId, workTime, workTimeId) => {
        axios.post(Constants.apiUrl + '/api/user-set-delivery-service-temporary-information',{
            serviceId: serviceId,
            workTime: workTime,
            workTimeId: workTimeId,
        },{
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token, 
            }
        }).then((res) => {
            let response = res.data;
            if(response.status === 'failed'){
                console.error(response.message);
                props.reduxUpdateSnackbar('error', true, response.umessage);
            }
        }).catch((error) => {
            console.error(error);
            props.reduxUpdateSnackbar('error', true, "?????? ???? ?????????????? ????????????");
        });
    }

    const deliveryServiceSelected =  (serviceId, scheduling) => {
        setSelectedDeliveryId(serviceId);
        if(scheduling == 1){
            setRequiresWorkTimeId(true);
            setTemporaryInformation(serviceId, 0, 0);
            //setAvailableWorkTimes([]);
            getActiveDeliveryWorkTimes(serviceId);
        }else{
            setRequiresWorkTimeId(false);
            setAvailableWorkTimes([]);
            setTemporaryInformation(serviceId, 0, 0);
            setSelectedWorkTimeDate(0);
        }
        
        /*
        if(serviceId == 14){
            setAvailableWorkTimes([]);
            setTemporaryInformation(serviceId, 0, 0);
            setSelectedWorkTimeDate(0);
        }else if (serviceId == 11 || serviceId == 12){
            setTemporaryInformation(serviceId, 0, 0);
            getActiveDeliveryWorkTimes(serviceId);
        }
        */
    }

    const workTimeSelected = (workTime, id) => {
        setSelectedWorkTimeDate(workTime);
        setSelectedWorkTimeId(id);
        setTemporaryInformation(selectedDeliveryId, workTime, id);
    }

    let userDoesNotHaveAddressComponent = (
        <div className={['container']}>
            <div className={['row', 'mt-5', 'px-2'].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'px-0'].join(' ')}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/location_black.png'} style={{width: '20px', height: '20px'}}/>
                    <h6 className={['mb-0', 'pr-1', 'font20md22'].join(' ')} style={{fontWeight: '500', color: '500'}}>????????</h6>
                </div>
                <div className={['col-12', 'mt-2', 'd-flex', 'flex-column', 'align-items-center'].join(' ')} style={{border: '1px dashed #D8D8D8', background: '#F9F9F9'}}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/delivery_location.png'} className={['mt-4'].join(' ')} style={{width: '70px', height: '70px'}} />
                    <p className={['mb-0', 'text-center', 'rtl', 'mt-2'].join(' ')} style={{fontSize: '17px', fontWeight: '500'}}>???????? ???????????????????? ???????? ?????????? ?????????? ???? ?????????? ????????</p>
                    <a href='https://honari.com/user/edit-address' className={['px-4', 'py-3', 'mt-3', 'mb-3', 'rtl'].join(' ')} style={{background: '#00BAC6', color: 'white'}}>
                    + ?????????? ???????? ???????? ????????
                    </a>
                </div>
                <div className={['col-12', 'mt-3', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'rtl', 'px-0'].join(' ')}>
                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/right_arrow_black.png'} style={{width: '8px', height: '8px'}} />
                        <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '444444', fontSize: '17px'}}>???????????? ?? ?????????? ????????</p>
                    </div>
                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'px-3', 'py-2'].join(' ')} style={{borderRadius: '1px', background: '#DEDEDE', cursor: 'none'}}>
                        <p className={['mb-0', 'pl-2'].join(' ')} style={{color: '#949494', fontSize: '17px'}}>?????????? ?? ?????????? ???????? ????????</p>
                        <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_gray_small.png'} style={{width: '8px', height: '8px'}} />
                    </div>
                </div>
            </div>
        </div>
    );

    let userHasAddressComponent = (
        <div className={['container'].join(' ')}>
            <div className={['row', 'mt-3', 'mx-1'].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'px-0'].join(' ')}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/location_black.png'} style={{width: '22px', height: '22px'}}/>
                    <h6 className={['mb-0', 'pr-1', 'font20md22'].join(' ')} style={{fontWeight: '500', color: '500'}}>????????</h6>
                </div>
                <div className={['col-12', 'rtl', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'mt-2'].join(' ')} style={{background: 'linear-gradient(270deg, #DEEEEF 0%, rgba(222, 238, 239, 0) 89.58%)', border: '1px solid #DEDEDE'}}>
                    <div className={['d-flex', 'flex-row', 'align-items-center', 'px-0', 'px-md-3', 'py-2'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/rec_main_full.png'} style={{width: '14px', height: '14px'}}/>
                        <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '#444444', fontSize: '17px'}}>?????????? ???? ?????? ????????</p>
                    </div>
                    <a href='https://honari.com/user/edit-address' className={['d-flex', 'flex-row', 'align-items-center', 'px-0', 'px-md-3', 'py-2'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/pencil_main.png'} style={{width: '14px', height: '14px'}}/>
                        <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '#444444', fontSize: '17px'}}>????????????</p>
                    </a>
                </div>
                <div className={['col-12'].join(' ')} style={{border: '1px solid #D8D8D8'}}>
                    <div className={['d-flex', 'flex-column', 'flex-md-row', 'align-items-center', 'justify-content-right', 'py-2', 'rtl'].join(' ')}>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'w-100'].join(' ')} style={{flex: '1'}}>
                            <p className={['mb-0', 'font14md17'].join(' ')} style={{color: '#949494', fontSize: '17px', fontWeight: '500'}}>?????????? ???????????? :</p>
                            <p className={['mb-0', 'pr-2', 'font14md17'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}>{props.reduxUser.information.name}</p>
                        </div>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'w-100', 'mt-2', 'mt-md-0'].join(' ')} style={{flex: '1'}}>
                            <p className={['mb-0', 'font14md17'].join(' ')} style={{color: '#949494', fontSize: '17px', fontWeight: '500'}}>?????????? ???????????? :</p>
                            <p className={['mb-0', 'pr-2', 'font14md17'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}>{props.reduxUser.information.username}</p>
                        </div>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'w-100', 'mt-2', 'mt-md-0'].join(' ')} style={{flex: '1'}}>
                            <p className={['mb-0', 'font14md17'].join(' ')} style={{color: '#949494', fontSize: '17px', fontWeight: '500'}}>???????? ???????? :</p>
                            <p className={['mb-0', 'pr-2', 'font14md17'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}>{props.reduxUser.information.telephone}</p>
                        </div>
                    </div>
                    <div style={{height: '1px', borderBottom: '1px dashed #D8D8D8'}}></div>
                    <div className={['d-flex', 'flex-column', 'flex-md-row', 'align-items-center', 'py-2', 'rtl'].join(' ')}>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'w-100'].join(' ')} style={{flex: '1'}}>
                            <p className={['mb-0', 'font14md17'].join(' ')} style={{color: '#949494', fontSize: '17px', fontWeight: '500'}}>?????????? :</p>
                            {
                                userAddress !== undefined
                                ?
                                <p className={['mb-0', 'pr-2', 'font14md17'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}>{userAddress.province}</p>
                                :
                                <p className={['mb-0', 'pr-2', 'font14md17'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}></p>
                            }
                        </div>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'w-100', 'mt-2', 'mt-md-0'].join(' ')} style={{flex: '1'}}>
                            <p className={['mb-0', 'font14md17'].join(' ')} style={{color: '#949494', fontSize: '17px', fontWeight: '500'}}>?????? :</p>
                            {
                                userAddress !== undefined
                                ?
                                <p className={['mb-0', 'pr-2', 'font14md17'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}>{userAddress.city}</p>
                                :
                                <p className={['mb-0', 'pr-2', 'font14md17'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}></p>
                            }
                        </div>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'w-100', 'mt-2', 'mt-md-0'].join(' ')} style={{flex: '1'}}>
                            <p className={['mb-0', 'font14md17'].join(' ')} style={{color: '#949494', fontSize: '17px', fontWeight: '500'}}>???? ???????? :</p>
                            {
                                userAddress !== undefined
                                ?
                                <p className={['mb-0', 'pr-2', 'font14md17'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}>{userAddress.postal}</p>
                                :
                                <p className={['mb-0', 'pr-2', 'font14md17'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}></p>
                            }
                        </div>
                    </div>
                    <div style={{height: '1px', borderBottom: '1px dashed #D8D8D8'}}></div>
                    <div className={['d-flex', 'flex-row', 'align-items-center', 'py-2', 'rtl'].join(' ')}>
                        <div className={['d-flex', 'flex-row', 'align-items-center', 'rtl'].join(' ')} style={{flex: '1'}}>
                            <p className={['mb-0', 'font14md17', 'text-right', 'rtl'].join(' ')} style={{color: '#949494', fontSize: '17px', fontWeight: '500'}}>???????? :<span className={['mr-2'].join(' ')} style={{color: '#444444'}}>{userAddress.address}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={['row', 'mt-4', 'mx-1'].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'px-0'].join(' ')}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/delivery_time.png'} style={{width: '22px', height: '22px'}}/>
                    <h6 className={['mb-0', 'pr-1', 'font20md22'].join(' ')} style={{fontWeight: '500', color: '500'}}>???????? ?? ???????? ??????????</h6>
                </div>
            </div>
            <div className={['row', 'mt-2', 'rtl', 'mx-1'].join(' ')}>
                {
                    deliverOptions.length != 0 
                    ?
                    (
                        deliverOptions.map((option, counter) => {
                            let priceTitle = <p className={['mb-0', 'pl-1', 'text-right'].join(' ')} style={{fontSize: '17px', fontWeight: '500'}}>?????????? ?????????? :</p>
                            let previousPrice = <del className={['mb-0', 'px-1', 'text-right'].join(' ')} style={{fontSize: '17px', fontWeight: '500', color: 'gray'}}>{option.price}</del>;
                            let price = <p className={['mb-0', 'px-1', 'text-right'].join(' ')} style={{fontSize: '17px', fontWeight: '500'}}>{option.price + ' ??????????'}</p>;
                            let discountedPrice = <p className={['mb-0', 'px-1', 'text-right'].join(' ')} style={{fontSize: '17px', fontWeight: '500', color: '#00BAC6'}}>{option.discountedPrice + ' ??????????'}</p>
                            if(option.discountedPrice === 0){
                                discountedPrice = <p className={['mb-0']} style={{fontSize: '17px', fontWeight: '500', color: '#00BAC6'}}>????????????</p>
                                price = null;
                            }else if(option.discountedPrice < option.price){
                                price = null;
                            }else if(option.discountedPrice == option.price){
                                discountedPrice = null;
                                previousPrice = null;
                            }
                            let backgroundStyle = {border: '1px solid #DEDEDE', borderRadius: '1px', background: 'white'};
                            if(option.id === selectedDeliveryId){
                                backgroundStyle = {border: '1px solid #DEDEDE', borderRadius: '1px', background: 'linear-gradient(270deg, #DEEEEF 0%, rgba(222, 238, 239, 0) 89.58%)'};
                            }
                            return( 
                                <div key={counter} className={['col-12', 'col-md-6', 'p-3', 'd-flex', 'flex-row', 'align-items-center', 'justify-cotent-right', 'pointer'].join(' ')} style={backgroundStyle} onClick={() => {deliveryServiceSelected(option.id, option.scheduling);}}>
                                    {
                                        selectedDeliveryId === option.id
                                        ?
                                        <img src={Constants.baseUrl + '/assets/images/main_images/rec_main_full.png'} style={{width: '18px', height: '18px'}} />
                                        :
                                        <img src={Constants.baseUrl + '/assets/images/main_images/rec_main_empty.png'} style={{width: '18px', height: '18px'}} />
                                    }
                                    <div className={['d-flex', 'flex-column', 'justify-content-right'].join(' ')}>
                                        <h5 className={['mb-0', 'mr-3', 'text-right'].join(' ')} style={{fontSize: '17px', fontWeight: '500'}}>{option.fname}</h5>
                                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'text-right', 'mr-3'].join(' ')}>
                                            {priceTitle}
                                            {previousPrice}
                                            {price}
                                            {discountedPrice}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )
                    :
                    (
                        <div className={['col-12', 'p-3', 'd-flex', 'flex-row', 'align-items-center', 'justify-cotent-right'].join(' ')} >
                            <h6 className={['text-right', 'mb-0'].join(' ')} style={{fontSize: '16px'}}>?????????? ???????????? ?????????? ???????? ??????. ?????? ???????????????? ?????? ?????????? ???? ???? ???????? ???? ???????????? ?? ???? ???????? ???????????????? ???? ???? ?????????? ????????</h6>     
                        </div>
                    )
                }
            </div>
            {
                availableWorkTimes.length !== 0
                ?
                (
                    <React.Fragment>
                        <div className={['row', 'mt-4', 'mx-1'].join(' ')}>
                            <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'px-0'].join(' ')}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/delivery_time.png'} className={['d-none'].join(' ')} style={{width: '16px', height: '16px'}}/>
                                <h6 className={['mb-0'].join(' ')} style={{fontSize: '16px', fontWeight: '500', color: '500'}}>???????? ?????????? ???????????????? ???? ???? ?????? ????????????????? ?????? ???????????? ????????</h6>
                            </div>
                        </div>
                        <div className={['row', 'mt-2', 'rtl', 'mx-1'].join(' ')}>
                            {
                                availableWorkTimes.map((workTime, counter) => {
                                    let backgroundStyle = {border: '1px solid #DEDEDE', borderRadius: '1px', background: 'white'};
                                    if(workTime.timestamp === selectedWorkTimeDate){
                                        backgroundStyle = {border: '1px solid #DEDEDE', borderRadius: '1px', background: 'linear-gradient(270deg, #DEEEEF 0%, rgba(222, 238, 239, 0) 89.58%)'};
                                    }
                                    return( 
                                        <div key={counter} className={['col-12', 'col-md-4', 'p-3', 'd-flex', 'flex-row', 'align-items-center', 'justify-cotent-right', 'pointer'].join(' ')} style={backgroundStyle} onClick={() => {workTimeSelected(workTime.timestamp, workTime.worktimeId);}}>
                                            {
                                                selectedWorkTimeDate === workTime.timestamp
                                                ?
                                                <img src={Constants.baseUrl + '/assets/images/main_images/rec_main_full.png'} style={{width: '18px', height: '18px'}} />
                                                :
                                                <img src={Constants.baseUrl + '/assets/images/main_images/rec_main_empty.png'} style={{width: '18px', height: '18px'}} />
                                            }
                                            <div className={['d-flex', 'flex-column', 'justify-content-right', 'pr-3'].join(' ')}>
                                                <h6 className={['text-right', 'rtl', 'mb-2'].join(' ')}>{workTime.day + "  " + workTime.label}</h6>
                                                <h6 className={['text-right', 'rtl', 'mb-0'].join(' ')}>{workTime.date}</h6>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </React.Fragment>
                )
                :
                null
            }
            <div className={['row', 'pl-3', 'mr-2', deliverOptions.length == 0 ? 'd-none' : ''].join(' ')}>
                {
                    (selectedDeliveryId != 0 && ((requiresWorkTimeId == false) || (requiresWorkTimeId == true && selectedWorkTimeDate != 0)))
                    ?
                    <Link href={'/cart/payment/deliveryReview'}>
                        <div onClick={() => {props.reduxStartLoading()}} className={['d-flex', 'col-12', 'col-lg-3', 'felx-row', 'px-3', 'py-2', 'align-items-center', 'justify-content-center', 'rtl', 'mb-0', 'mt-3', 'pointer', 'ml-1'].join(' ')} style={{borderRadius: '2px', background: '#00BAC6'}}>
                            <h6 className={['mb-0'].join(' ')} style={{fontSize: '17px', color: 'white'}}>?????????? ?? ?????????? ???????? ????????</h6>
                            <img className={['mr-2X'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/left_arrow_white_small.png'} style={{width: '10px', height: '10px'}} />
                        </div>
                    </Link>
                    :
                    <div onClick={() => {props.reduxUpdateSnackbar('warning', true, '???????? ?????????????? ?????? ?? ???????? ?????????? ???? ???? ?????????? ???????? ????????')}} className={['d-flex', 'col-12', 'col-lg-3', 'felx-row', 'px-3', 'py-2', 'align-items-center', 'justify-content-center', 'rtl', 'mb-0', 'mt-3', 'pointer', 'ml-1'].join(' ')} style={{borderRadius: '2px', background: '#00BAC6'}}>
                        <h6 className={['mb-0'].join(' ')} style={{fontSize: '17px', color: 'white'}}>?????????? ?? ?????????? ???????? ????????</h6>
                        <img className={['mr-2'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/left_arrow_white_small.png'} style={{width: '10px', height: '10px'}} />
                    </div>
                }
            </div>
        </div>
    );

    return(
        <React.Fragment>
            <Head>
                <title>?????????????? ?????????? | ????????</title>
                <link rel="icon" href={ Constants.baseUrl + "/favicon.ico"} type="image/x-icon"/>
            </Head>
            <Header menu={props.ssrMenu} />
                <div className={['container'].join(' ')}>
                    <div className={['row', 'mt-3', 'mt-md-5'].join(' ')}>
                        <div className={['col-12'].join(' ')}>
                            <div className={['w-100', 'd-flex', 'flex-row', 'align-items-center', 'rtl'].join(' ')}>
                                <div class={[''].join(' ')} style={{flex: '1', height: '2px', background: '#00BAC6'}}></div>
                                <div class={[''].join(' ')} style={{flex: '1', height: '2px', background: '#DEDEDE'}}></div>
                            </div>
                            <div className={['d-flex', 'flex-row', 'align-items-center', 'rtl'].join(' ')} style={{position: 'relative', top: '-10px'}}>
                                <div className={['d-flex', 'flex-column', 'text-center', 'justify-content-center'].join(' ')} style={{flex: '1'}}>
                                    <div className={['text-center'].join(' ')}><img src={Constants.baseUrl + '/assets/images/main_images/previous_shopping_step_indicator.svg'} style={{width: '20px', height: '20px'}} /></div>
                                    <h6 className={['text-center', 'mt-2', 'font11md17'].join(' ')} style={{color: '#00BAC6'}}><b>???????? ???? ????????</b></h6>
                                </div>
                                <div className={['d-flex', 'flex-column', 'text-center', 'justify-content-center'].join(' ')} style={{flex: '1'}}>
                                    <div className={['text-center'].join(' ')}><img src={Constants.baseUrl + '/assets/images/main_images/current_shopping_step_indicator.svg'} style={{width: '20px', height: '20px'}} /></div>
                                    <h6 className={['text-center', 'mt-2', 'font11md17'].join(' ')} style={{color: '#00BAC6'}}><b>?????????????? ??????????</b></h6>
                                </div>
                                <div className={['d-flex', 'flex-column', 'text-center', 'justify-content-center'].join(' ')} style={{flex: '1'}}>
                                    <div className={['text-center'].join(' ')}><img src={Constants.baseUrl + '/assets/images/main_images/next_shopping_step_indicator.svg'} style={{width: '20px', height: '20px'}} /></div>
                                    <h6 className={['text-center', 'mt-2', 'font11md17'].join(' ')} style={{color: 'gray'}}><b>?????????????? ?????????? ?? ??????????</b></h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    props.reduxUser.status !== 'NI'
                    ?
                        (
                            userAddressStatus !== null
                            ?
                                (
                                    userAddressStatus == 'HAS_ADDRESS'
                                    ?
                                    userHasAddressComponent
                                    :
                                    userDoesNotHaveAddressComponent
                                )
                            :
                                null
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
        reduxCart: state.cart
    };
}

const mapDispatchToProps = (dispatch) => {
    return{
        reduxUpdateCart: (d) => dispatch({type: actionTypes.UPDATE_CART, data: d}),
        //reduxAddToCart: (d) => dispatch({type: actionTypes.ADD_TO_CART, data: d}),
        reduxIncreaseCountByOne: (d) => dispatch({type: actionTypes.INCREASE_COUNT_BY_ONE, productId: d}),
        reduxDecreaseCountByOne: (d) => dispatch({type: actionTypes.DECREASE_COUNT_BY_ONE, productId: d}),
        reduxRemoveFromCart: (d) => dispatch({type: actionTypes.REMOVE_FROM_CART, productId: d}),
        reduxWipeCart: () => dispatch({type: actionTypes.WIPE_CART}),
        reduxUpdateUserTotally: (d) => dispatch({type: actionTypes.UPDATE_USER_TOTALLY, data: d}),
        reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t}),
        reduxStartLoading: () => dispatch({type: actionTypes.START_LOADING}),
        reduxStopLoading: () => dispatch({type: actionTypes.STOP_LOADING}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment);

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
                    destination: 'https://honari.com/user?site=shop&callBack=%2F'
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
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

const Payment = (props) => {

    const [userStatus, setUserStatus] = useState('');
    const [cookies , setCookie , removeCookie] = useCookies();
    const [userInformation, setUserInformation] = useState({});
    const [userAddress, setUserAddress] = useState({});
    const [deliverOptions, setDeliveryOptions] = useState([]);
    const [selectedDeliverOption, setSelectedDeliveryOption] = useState(-1);
    const [userAddressStatus, setUserAddressStatus] = useState(null);

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
                alert('مشکلی پیش آمده لطفا مجددا امتحان کنید');
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

    const getUserDeliveryOptions = () => {
        axios.post(Constants.apiUrl + '/api/user-delivery-options',{},{
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token, 
            }
        }).then((res) => {
            let response = res.data;
            if(response.status == 'done'){
                setDeliveryOptions(response.options);
            }else if(response.status === 'failed'){
                alert(response.message);
                alert(response.umessage);
            }
        }).catch((error) => {
            alert('مشکل در برقراری ارتباط');
            console.log(error);
        });
    }


    let userDoesNotHaveAddressComponent = (
        <div className={['container']}>
            <div className={['row', 'mt-5', 'px-2'].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'px-0'].join(' ')}>
                    <Image src='/assets/images/main_images/location_black.png' style={{width: '16px', height: '16px'}}/>
                    <h6 className={['mb-0', 'pr-1'].join(' ')} style={{fontSize: '24px', fontWeight: '500', color: '500'}}>آدرس</h6>
                </div>
                <div className={['col-12', 'mt-2', 'd-flex', 'flex-column', 'align-items-center'].join(' ')} style={{border: '1px dashed #D8D8D8', background: '#F9F9F9'}}>
                    <Image src='/assets/images/main_images/delivery_location.png' className={['mt-4'].join(' ')} style={{width: '70px', height: '70px'}} />
                    <p className={['mb-0', 'text-center', 'rtl', 'mt-2'].join(' ')} style={{fontSize: '17px', fontWeight: '500'}}>آدرس موردنظرتان برای ارسال سفارش را اضافه کنید</p>
                    <a href='https://honari.com/user/edit-address' className={['px-4', 'py-3', 'mt-3', 'mb-3', 'rtl'].join(' ')} style={{background: '#00BAC6', color: 'white'}}>
                    + اضافه کردن آدرس جدید
                    </a>
                </div>
                <div className={['col-12', 'mt-3', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'rtl', 'px-0'].join(' ')}>
                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')}>
                        <Image src='/assets/images/main_images/right_arrow_black.png' style={{width: '8px', height: '8px'}} />
                        <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '444444', fontSize: '17px'}}>بازگشت و ادامه خرید</p>
                    </div>
                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'px-3', 'py-2'].join(' ')} style={{borderRadius: '1px', background: '#DEDEDE', cursor: 'none'}}>
                        <p className={['mb-0', 'pl-2'].join(' ')} style={{color: '#949494', fontSize: '17px'}}>تایید و نهایی کردن خرید</p>
                        <Image src='/assets/images/main_images/left_arrow_gray_small.png' style={{width: '8px', height: '8px'}} />
                    </div>
                </div>
            </div>
        </div>
    );

    let userHasAddressComponent = (
        <div className={['container'].join(' ')}>
            <div className={['row', 'mt-3', 'mx-1'].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'px-0'].join(' ')}>
                    <Image src='/assets/images/main_images/location_black.png' style={{width: '16px', height: '16px'}}/>
                    <h6 className={['mb-0', 'pr-1'].join(' ')} style={{fontSize: '24px', fontWeight: '500', color: '500'}}>آدرس</h6>
                </div>
                <div className={['col-12', 'rtl', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'mt-2'].join(' ')} style={{background: 'linear-gradient(270deg, #DEEEEF 0%, rgba(222, 238, 239, 0) 89.58%)', border: '1px solid #DEDEDE'}}>
                    <div className={['d-flex', 'flex-row', 'align-items-center', 'px-3', 'py-2'].join(' ')}>
                        <Image src='/assets/images/main_images/rec.png' style={{width: '14px', height: '14px'}}/>
                        <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '#444444', fontSize: '17px'}}>ارسال به این آدرس</p>
                    </div>
                    <a href='https://honari.com/user/edit-address' className={['d-flex', 'flex-row', 'align-items-center', 'px-3', 'py-2'].join(' ')}>
                        <Image src='/assets/images/main_images/pencil_main.png' style={{width: '14px', height: '14px'}}/>
                        <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '#444444', fontSize: '17px'}}>ویرایش</p>
                    </a>
                </div>
                <div className={['col-12'].join(' ')} style={{border: '1px solid #D8D8D8'}}>
                    <div className={['d-flex', 'flex-row', 'align-items-center', 'py-2', 'rtl'].join(' ')}>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                            <p className={['mb-0'].join(' ')} style={{color: '#949494', fontSize: '17px', fontWeight: '500'}}>تحویل گیرنده :</p>
                            <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}>{props.reduxUser.information.name}</p>
                        </div>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                            <p className={['mb-0'].join(' ')} style={{color: '#949494', fontSize: '17px', fontWeight: '500'}}>شماره موبایل :</p>
                            <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}>{props.reduxUser.information.username}</p>
                        </div>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                            <p className={['mb-0'].join(' ')} style={{color: '#949494', fontSize: '17px', fontWeight: '500'}}>تلفن ثابت :</p>
                            <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}>{props.reduxUser.information.telephone}</p>
                        </div>
                    </div>
                    <div style={{height: '1px', borderBottom: '1px dashed #D8D8D8'}}></div>
                    <div className={['d-flex', 'flex-row', 'align-items-center', 'py-2', 'rtl'].join(' ')}>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                            <p className={['mb-0'].join(' ')} style={{color: '#949494', fontSize: '17px', fontWeight: '500'}}>استان :</p>
                            {
                                userAddress !== undefined
                                ?
                                <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}>{userAddress.province}</p>
                                :
                                <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}></p>
                            }
                        </div>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                            <p className={['mb-0'].join(' ')} style={{color: '#949494', fontSize: '17px', fontWeight: '500'}}>شهر :</p>
                            {
                                userAddress !== undefined
                                ?
                                <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}>{userAddress.city}</p>
                                :
                                <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}></p>
                            }
                        </div>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                            <p className={['mb-0'].join(' ')} style={{color: '#949494', fontSize: '17px', fontWeight: '500'}}>کد پستی :</p>
                            {
                                userAddress !== undefined
                                ?
                                <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}>{userAddress.postal}</p>
                                :
                                <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}></p>
                            }
                        </div>
                    </div>
                    <div style={{height: '1px', borderBottom: '1px dashed #D8D8D8'}}></div>
                    <div className={['d-flex', 'flex-row', 'align-items-center', 'py-2', 'rtl'].join(' ')}>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                            <p className={['mb-0'].join(' ')} style={{color: '#949494', fontSize: '17px', fontWeight: '500'}}>آدرس :</p>
                            {
                                userAddress !== undefined 
                                ?
                                <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}>{userAddress.address}</p>
                                :
                                <p className={['mb-0', 'pr-2'].join(' ')} style={{color: '#444444', fontSize: '17px', fontWeight: '500'}}></p>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={['row', 'mt-4', 'mx-1'].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'px-0'].join(' ')}>
                    <Image src='/assets/images/main_images/delivery_time.png' style={{width: '16px', height: '16px'}}/>
                    <h6 className={['mb-0', 'pr-1'].join(' ')} style={{fontSize: '24px', fontWeight: '500', color: '500'}}>شیوه و زمان ارسال</h6>
                </div>
            </div>
            <div className={['row', 'mt-2', 'rtl', 'mx-1'].join(' ')}>
                {
                    deliverOptions.map((option, counter) => {
                        let priceTitle = <p className={['mb-0', 'pl-1', 'text-right'].join(' ')} style={{fontSize: '17px', fontWeight: '500'}}>هزینه ارسال :</p>
                        let previousPrice = <del className={['mb-0', 'px-1', 'text-right'].join(' ')} style={{fontSize: '17px', fontWeight: '500', color: 'gray'}}>{option.price}</del>;
                        let price = <p className={['mb-0', 'px-1', 'text-right'].join(' ')} style={{fontSize: '17px', fontWeight: '500'}}>{option.price + ' تومان'}</p>;
                        let discountedPrice = <p className={['mb-0', 'px-1', 'text-right'].join(' ')} style={{fontSize: '17px', fontWeight: '500', color: '#00BAC6'}}>{option.discountedPrice + ' تومان'}</p>
                        if(option.discountedPrice === 0){
                            discountedPrice = <p className={['mb-0']} style={{fontSize: '17px', fontWeight: '500', color: '#00BAC6'}}>رایگان</p>
                            price = null;
                        }else if(option.discountedPrice < option.price){
                            price = null;
                        }
                        let backgroundStyle = {border: '1px solid #DEDEDE', borderRadius: '1px', background: 'white'};
                        if(counter === selectedDeliverOption){
                            backgroundStyle = {border: '1px solid #DEDEDE', borderRadius: '1px', background: '#F2F2F2'};
                        }
                        return( 
                            <div key={counter} className={['col-12', 'col-md-6', 'p-3', 'd-flex', 'flex-row', 'align-items-center', 'justify-cotent-right', 'pointer'].join(' ')} style={backgroundStyle} onClick={() => {setSelectedDeliveryOption(counter);}}>
                                {
                                    selectedDeliverOption === counter
                                    ?
                                    <Image src='/assets/images/main_images/rec_main_full.png' style={{width: '18px', height: '18px'}} />
                                    :
                                    <Image src='/assets/images/main_images/rec_black_empty.png' style={{width: '18px', height: '18px'}} />
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
                }
            </div>
        </div>
    );

    //<div className={['col-12'].join(' ')} style={{height: '1px', width: '100%', display: 'relative', top: '11px', background: '#00BAC6'}}></div>

    /*
<div className={['w-100'].join(' ')} style={{display: 'relative', top: '20px'}}>
                            <div className={['d-flex', 'flex-row', 'rtl', 'w-100'].join(' ')} style={{height: '20px', paddingTop: '20px'}}>
                                <div style={{flex: '1', height: '2px', width: '100%', background: '#00ABC6'}}></div>
                                <div style={{flex: '1', height: '2px', width: '100%', background: '#00ABC6'}}></div>
                                <div style={{flex: '1', height: '2px', width: '100%', background: '#00ABC6'}}></div>
                                <div style={{flex: '1', height: '2px', width: '100%', background: '#00ABC6'}}></div>
                                <div style={{flex: '1', height: '2px', width: '100%', background: '#00ABC6'}}></div>
                                <div style={{flex: '1', height: '2px', width: '100%', background: 'yellow'}}></div>
                            </div>
                        </div>

                        <div className={['row', 'rtl', 'py-4'].join(' ')} style={{backgroundColor: '#F7F7F7'}}>
                        
                        <div className={['col-4', 'text-center'].join(' ')}>
                            <immg src='/assets/images/main_images/checked_main_circle.png' style={{width: '20px', height: '20px'}} />
                        </div>
                        <div className={['col-4', 'text-center'].join(' ')}>
                            <immg src='/assets/images/main_images/checked_main_circle.png' style={{width: '20px', height: '20px'}} />
                        </div>
                        <div className={['col-4', 'text-center'].join(' ')}>
                            <immg src='/assets/images/main_images/checked_gray_circle.png' style={{width: '20px', height: '20px'}} />
                        </div>
                    </div>
    */
    return(
        <React.Fragment>
            <Header />
                <Image src='/assets/images/main_images/secondStep.png' style={{width: '100%'}} />
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
        reduxUpdateUserTotally: (d) => dispatch({type: actionTypes.UPDATE_USER_TOTALLY, data: d})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment);

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
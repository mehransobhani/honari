import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../../../../components/Header/Header';
import Footer from '../../../../components/Footer/Footer';
import * as Constants from '../../../../components/constants';
import * as actionTypes from '../../../../store/actions';
import {connect} from 'react-redux';
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
            props.reduxUpdateSnackbar('warning', 'true', 'لطفا کد تخفیف موردنظر را وارد کنید');
            return 0;
        }
        let has = 0;
        if(addedGiftCodes.length !== 0){
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
                    if(!found){
                        if(response.type === 'order'){
                            if(response.discountPrice + userOrderPriceInformation.discountedPrice >= userOrderPriceInformation.price){
                                setUserOrderPriceInformation({price: userOrderPriceInformation.price, discountedPrice: 0});
                            }else{
                                setUserOrderPriceInformation({price: userOrderPriceInformation.price, discountedPrice: userOrderPriceInformation.discountedPrice - response.discountPrice});
                            }
                        }else if(response.type === 'shipping'){
                            if(response.discountPrice + userShippingPriceInformation.discountedPrice >= userShippingPriceInformation.price){
                                setUserShippingPriceInformation({price: userShippingPriceInformation.price, discountedPrice: 0});
                            }else{
                                setUserShippingPriceInformation({price: userShippingPriceInformation.price, discountedPrice: userShippingPriceInformation.discountedPrice - response.discountPrice});
                            }
                        }
                        let newApprovedGiftCodes = [];
                        approvedGiftCodesInformation.map((item, counter) => {
                            newApprovedGiftCodes.push(item);
                        });
                        newApprovedGiftCodes.push({code: giftCodeInputText, type: response.type, discountPrice: response.discountPrice});
                        setApprovedGiftCodesInformation(newApprovedGiftCodes);
                        // I have to start warking from here by the way
                    }else{
                        props.reduxUpdateSnackbar('warning', true, 'شما یک بار این کد تخفیف را وارد کرده اید');
                    }
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    return(
        <React.Fragment>
            <Header />  
                <div className={['container-fluid'].join(' ')}>
                    <div className={['row'].join(' ')}>
                        <div className={['col-12', 'px-0'].join(' ')}>
                            <img src='/assets/images/main_images/thirdStep.png' className={['w-100'].join(" ")} />
                        </div>
                    </div>
                </div>
                <div className={['container', 'px-4'].join(' ')}>
                    <div className={['row'].join(' ')}>
                        <div className={['col-12', 'mt-4', 'px-0'].join(' ')}>
                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-right', 'rtl'].join(' ')}>
                                <img src='/assets/images/main_images/form.png' style={{width: '18px', heigth: '18px'}} />
                                <h4 className={['text-right', 'mb-0', 'mr-2'].join(' ')} style={{fontSize: '24px', color: '#2b2b2b'}}><b>فاکتور نهایی خرید</b></h4>
                            </div>
                        </div>
                    </div>
                    <div className={['row', 'rtl', 'py-3', 'mt-2'].join(' ')} style={{background: '#F7F7F7', border: '1px solid #D8D8D8'}}>
                        <h6 className={['col-6', 'text-right', 'mb-0', 'pr-2'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>محصول</h6>
                        <h6 className={['col-1', 'text-center', 'mb-0'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>تعداد</h6>
                        <h6 className={['col-1', 'text-center', 'mb-0'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>واحد</h6>
                        <h6 className={['col-2', 'text-center', 'mb-0'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>قیمت واحد</h6>
                        <h6 className={['col-2', 'text-center', 'mb-0'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>قیمت کل</h6>
                    </div>
                    {
                        props.reduxCart.information.map((item, counter) => {
                            return (
                                <div className={['row', 'rtl', 'py-2', 'mt-1', 'align-items-center'].join(' ')} style={{borderRight: '1px solid #D8D8D8', borderBottom: '1px solid #D8D8D8', borderLeft: '1px solid #D8D8D8'}}>
                                    <div className={['col-6', 'text-right', 'mb-0', 'pr-2', 'd-flex', 'flex-row', 'align-items-center'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>
                                        <img src={'https://honari.com/image/resizeTest/shop/_85x/thumb_' + item.prodID + '.jpg'} style={{width: '85px', height: '85px', borderRadius: '1px'}} />
                                        <div className={['d-flex', 'flex-column', 'text-right', 'mr-2'].join(' ')}>
                                            <h5 className={['mb-0'].join(' ')} style={{fontSize: '17px'}}>{item.name}</h5>
                                            <h5 className={['mb-0'].join(' ')} style={{fontSize: '14px'}}>{item.label}</h5>
                                        </div>
                                    </div>
                                    <h6 className={['col-1', 'text-center', 'mb-0'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>{item.count}</h6>
                                    <h6 className={['col-1', 'text-center', 'mb-0'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>{item.unitName}</h6>
                                    {
                                        item.price === item.discountedPrice
                                        ?
                                        <h6 className={['col-2', 'text-center', 'mb-0'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>{item.price.toLocaleString() + " تومان"}</h6>
                                        : 
                                        (
                                            <div className={['col-2', 'd-flex', 'flex-column'].join(' ')}>
                                                    <h6 className={['text-center', 'mb-1'].join(' ')} style={{fontSize: '17px', color: '#444444'}}><del>{item.price.toLocaleString() + " تومان"}</del></h6>
                                                    <h6 className={['text-center', 'mb-0'].join(' ')} style={{fontSize: '17px', color: 'red'}}>{item.discountedPrice.toLocaleString() + " تومان"}</h6>
                                            </div>
                                        )
                                    }
                                    {
                                        item.price === item.discountedPrice
                                        ?
                                        <h6 className={['col-2', 'text-center', 'mb-0'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>{(item.price * item.count).toLocaleString() + " تومان"}</h6>
                                        : 
                                        (
                                            <div className={['col-2', 'd-flex', 'flex-column'].join(' ')}>
                                                    <h6 className={['text-center', 'mb-1'].join(' ')} style={{fontSize: '17px', color: '#444444'}}><del>{(item.price * item.count).toLocaleString() + " تومان"}</del></h6>
                                                    <h6 className={['text-center', 'mb-0'].join(' ')} style={{fontSize: '17px', color: 'red'}}>{(item.discountedPrice * item.count).toLocaleString() + " تومان"}</h6>
                                            </div>
                                        )
                                    }
                                </div>
                            );
                        })
                    }
                    <div className={['row', 'mt-5'].join(' ')}>
                        <div className={['col-12', 'd-flex', 'text-right', 'justify-content-right', 'rtl', 'align-items-center', 'px-0'].join(' ')}>
                            {
                                giftCodeCheckboxSelected
                                ?
                                <img className={['pointer'].join(' ')} src='/assets/images/main_images/selected_checkbox.png' style={{width: '15px', height: '15px'}} onClick={() => {setGiftCodeCheckboxSelected(false)}} />
                                :
                                <img className={['pointer'].join(' ')} src='/assets/images/main_images/unselected_checkbox.png' style={{width: '15px', height: '15px'}} onClick={() => {setGiftCodeCheckboxSelected(true)}} />
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
                        <div className={['row', 'rtl', 'mt-3'].join(' ')} style={{borderRadius: '2px', border: '1px solid #D8D8D8'}}>
                            <div className={['col-6', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'text-right', 'align-items-right', 'py-2'].join(' ')}>
                                <h6 className={['mb-0'].join(' ')} style={{fontSize: '17px', color: '#444444'}}>کد تخفیف</h6>
                                <input type='text' placeholder='کد خود را وارد کنید' className={['mr-2', 'text-center', 'ltr'].join(' ')} style={{height: '40px', border: '1px solid #D8D8D8', borderRadius: '2px', fontFamily: 'IranSansWeb'}} onChange={giftCodeInputChanged} />
                                <button className={['text-center', 'mb-0', 'mr-2', 'px-2', 'pointer'].join(' ')} style={{height: '40px', background: '#00BAC6', color: 'white', border: 'none', outline: 'none', borderRadius: '2px'}} onClick={insertGiftCodeClicked}>اعمال کد تخفیف</button>
                            </div>
                            {
                                approvedGiftCodesInformation.map((item, counter) => {
                                    if(counter === 0){
                                        return (
                                            <div className={['col-6', 'd-flex', 'flex-row', 'align-items-center', 'py-2'].join(' ')}>
                                                <div className={['d-flex', 'flex-column', 'justify-content-right', 'pr-5'].join(' ')} >
                                                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')}>
                                                        <img src='/assets/images/main_images/tick.png' style={{width: '12px', height: '12px'}} />
                                                        <h6 className={['mb-0', 'pr-1'].join(" ")} style={{fontFamily: 'IranSansWeb', color: '#00A128', fontSize: '17px'}}>کد تخفیف EF210A اعمال شد</h6>
                                                    </div>
                                                    <h6 className={['mb-0'].join(' ')} style={{fontSize: '14px', color: '#2B2B2B'}}>۶۰۰۰ تومان از مبلغ سفارش شما کاسته شد</h6>
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
                                                            <img src='/assets/images/main_images/tick.png' style={{width: '12px', height: '12px'}} />
                                                            <h6 className={['mb-0', 'pr-1'].join(" ")} style={{fontFamily: 'IranSansWeb', color: '#00A128', fontSize: '17px'}}>کد تخفیف EF210A اعمال شد</h6>
                                                        </div>
                                                        <h6 className={['mb-0'].join(' ')} style={{fontSize: '14px', color: '#2B2B2B'}}>۶۰۰۰ تومان از مبلغ سفارش شما کاسته شد</h6>
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
                    <div className={['row', 'mt-5'].join(' ')}>
                        <div className={['col-12', 'rtl', 'text-right', 'mb-3', 'px-0'].join(' ')}>
                            <h5 className={['mb-0'].join(' ')} style={{fontSize: '24px', color: '#2B2B2B'}}><b>شیوه پرداخت</b></h5>
                        </div>
                        <div className={['col-12', 'd-flex', 'flex-row', 'text-right', 'rtl', 'align-items-center', 'justify-content-right', 'py-2', 'mr-3'].join(' ')} style={{borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                            <img src='/assets/images/main_images/rec_main_full.png' style={{width: '14px', height: '14px'}} />
                            <div className={['d-flex', 'flex-column', 'justify-content-right', 'pr-3'].join(' ')}>
                                <h6 className={['text-right', 'mb-0'].join(' ')} style={{fontSize: '24px', color: '#2B2B2B'}}>پرداخت آنلاین</h6>
                                <h6 className={['text-right', 'mb-0', 'mt-1'].join(' ')} style={{fontSize: '14px', color: '#4B4B4B'}}>از طریق درگاه بانک</h6>
                            </div>
                        </div>
                    </div>
                    <div className={['row', 'mt-4'].join(' ')}>
                        <div className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'rtl', 'px-0'].join(' ')}>
                            <div className={['d-flex', 'flex-row', 'align-items-center', 'rtl', 'px-0', 'mx-0'].join(' ')}>
                                {
                                    walletCheckboxSelected 
                                    ?
                                    <img className={['pointer'].join(' ')} src='/assets/images/main_images/selected_checkbox.png' style={{width: '15px', height: '15px'}} onClick={() => {setWalletCheckboxSelected(false)}} />
                                    :
                                    <img className={['pointer'].join(' ')} src='/assets/images/main_images/unselected_checkbox.png' style={{width: '15px', height: '15px'}} onClick={() => {setWalletCheckboxSelected(true)}} />
                                }
                                <h5 className={['mb-0', 'px-2'].join(' ')} style={{fontSize: '17px', color: '#2B2B2B'}}><b>استفاده از اعتبار حساب کاربری</b></h5>
                                <div className={['d-flex', 'flex-row', 'align-items-center', 'py-1', 'px-2'].join(' ')} style={{borderRadius: '14px', border: '1px solid #D8D8D8'}}>
                                    <h6 className={['mb-0', 'pl-2'].join(' ')} style={{fontSize: '14px', color: '#444444', borderLeft: '1px solid #D8D8D8'}}>{'اعتبار فعلی : ' + '۲ تومان'}</h6>
                                    <button className={['pr-2', 'pointer'].join(' ')} style={{fontSize: '14px', background: 'white', color: '#00BAC6', border: 'none'}}>افزایش اعتبار</button>
                                </div>
                            </div>
                            {
                                walletCheckboxSelected 
                                ?
                                <div>
                                    <h6 className={['mb-0'].join(' ')} style={{fontSize: '14px', color: '#444444'}}>{'۲' + ' تومان از مبلغ سفارش شما کاسته شد '}</h6>
                                </div>
                                :
                                null
                            } 
                        </div>
                        <h6 className={['col-12', 'px-0', 'mt-2', 'text-right', 'rtl'].join(' ')} style={{fontSize: '14px', color: '#444444'}}>با تیک زدن این گزینه به میزان اعتبار حسابتان از مبلغ دریافتی سفارشتان کاسته خواهد شد</h6>
                        <div className={['col-12', 'mt-4'].join(' ')} style={{height: '2px', background: '#DEDEDE'}}></div>
                    </div>
                    <div className={['row', 'mt-4'].join(' ')}>
                        <div className={['col-12', 'd-flex', 'd-flex', 'align-items-center', 'justify-content-between', 'rtl', 'px-0'].join(' ')}>
                            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')}>
                                <img src='/assets/images/main_images/right_arrow_black.png' className={['ml-2'].join(' ')} style={{width: '8px', height: '8px'}} />
                                <h6 className={['mb-0'].join(' ')} style={{color: '##2B2B2B'}}><b>بازگشت به صفحه قبل</b></h6>
                            </div>
                            <div className={['d-flex', 'flex-row'].join(' ')} style={{borderRadius: '2px', border: '1px solid #D8D8D8'}}>
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
                                <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'px-2', 'py-2', 'pointer'].join(' ')} style={{background: '#00bac6'}}>
                                    <h6 className={['pl-2', 'mb-0'].join(' ')} style={{fontSize: '17px', color: 'white'}}>تایید و پرداخت سفارش</h6>
                                    <img src='/assets/images/main_images/left_arrow_white_small.png' style={{width: '8px', height: '8px'}} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
        reduxIncreaseCountByOne: (d) => dispatch({type: actionTypes.INCREASE_COUNT_BY_ONE, productId: d}),
        reduxDecreaseCountByOne: (d) => dispatch({type: actionTypes.DECREASE_COUNT_BY_ONE, productId: d}),
        reduxRemoveFromCart: (d) => dispatch({type: actionTypes.REMOVE_FROM_CART, productId: d}),
        reduxWipeCart: () => dispatch({type: actionTypes.WIPE_CART}),
        reduxUpdateUserTotally: (d) => dispatch({type: actionTypes.UPDATE_USER_TOTALLY, data: d}),
        reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(DeliveryReview);

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
                destination: 'https://honari.com/user?site=shop&callBack=%2F'
            }
        };
    }
}
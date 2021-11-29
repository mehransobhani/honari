import React, { useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../../../../components/Header/Header';
import Footer from '../../../../components/Footer/Footer';
import * as Constants from '../../../../components/constants';
import * as actionTypes from '../../../../store/actions';
import {connect} from 'react-redux';
import axios from 'axios';

const DeliveryReview = (props) => {

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
                                <h4 className={['text-right', 'mb-0', 'mr-2'].join(' ')} style={{fontSize: '24px', color: '#2b2b2b'}}>فاکتور نهایی خرید</h4>
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
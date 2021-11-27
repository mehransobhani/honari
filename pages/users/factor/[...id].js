import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useRouter} from 'next/router';
import * as Constants from '../../../components/constants';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import {useCookies} from 'react-cookie';
import Link from 'next/link';
import * as actionTypes from '../../../store/actions';
import {connect} from 'react-redux';

const usersOrderInfo = (props) => {

    const [cookies , setCookie , removeCookie] = useCookies();
    const router = useRouter();
    const {id} = router.query;
    const [userOrderInformation, setUserOrderInformation] = useState([]);

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
        if(id != undefined){
            axios.post(Constants.apiUrl + '/api/user-order-details', {
                orderId: parseInt(id)
            }, {
                headers: {
                    'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
                }
            }).then((res) => {
                let response = res.data;
                if(response.status === 'done'){
                    setUserOrderInformation(response.orderItems);
                }else{
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
                console.log(response);
            }).catch((error) => {
                console.log(error);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            });
        }
    }, [id, undefined]);

    const informationHeaders = (
        <div className={['row', 'rtl', 'py-3', 'mt-3', 'align-items-center'].join(' ')} style={{borderRadius: '3px', background: '#F2F2F2', border: '1px solid #DEDEDE'}}>
            <span className={['col-1', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{fontSize: '14px'}}>ردیف</span>
            <span className={['col-1', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{fontSize: '14px'}}>تصویر</span>
            <span className={['col-4', 'mb-0', 'text-right', 'font11md17'].join(' ')} style={{fontSize: '14px'}}>نام محصول</span>
            <span className={['col-1', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{fontSize: '14px'}}>تعداد</span>
            <span className={['col-1', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{fontSize: '14px'}}>واحد</span>
            <span className={['col-2', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{fontSize: '14px'}}>قیمت واحد</span>
            <span className={['col-2', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{fontSize: '14px'}}>قیمت کل</span>
        </div>
    );

    const clicked = () => {
        console.warn(props.reduxUser);
    }

    return(
        <React.Fragment>
            <Header />
                <div className={['container', 'px-4'].join(' ')}>
                    <div className={['row'].join(' ')}>
                        <p className={['col-12', 'px-2', 'font11md17', 'text-right', 'rtl', 'mb-0', 'mt-3'].join(' ')} style={{color: 'red', fontSize: '14px'}}>* تمامی قیمت‌ها به تومان می‌باشند</p>
                    </div>
                    {informationHeaders}
                    {
                        (
                            userOrderInformation.map((item, counter) => {
                                return(
                                    <div onClick={clicked} className={['row', 'rtl', 'py-3', 'mt-2', 'align-items-center'].join(' ')} style={{borderRadius: '3px', background: '#F2F2F2'}}>
                                        <span className={['col-1', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{fontSize: '14px'}}>{counter + 1}</span>
                                        <span className={['col-1', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{fontSize: '14px'}}>
                                            <img src={'https://honari.com/image/resizeTest/shop/_85x/thumb_' + item.prodID + '.jpg'} style={{width: '30px', height: '30px'}} />
                                        </span>
                                        <Link href={'/' + item.url}><a className={['col-4', 'mb-0', 'text-right', 'font11md17'].join(' ')} style={{fontSize: '14px'}}>{item.productName}</a></Link>
                                        <span className={['col-1', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{fontSize: '14px'}}>{item.count * item.packCount}</span>
                                        <span className={['col-1', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{fontSize: '14px'}}>{item.productUnit}</span>
                                        <span className={['col-2', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{fontSize: '14px'}}>{item.basePrice / item.packCount}</span>
                                        <span className={['col-2', 'mb-0', 'text-center', 'font11md17'].join(' ')} style={{fontSize: '14px'}}>{item.basePrice * item.count}</span>
                                    </div>
                                );
                            })
                        )
                        
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

export default connect(mapStateToProps, mapDispatchToProps)(usersOrderInfo);

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
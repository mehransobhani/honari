import React, { useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import * as Constants from '../../components/constants';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';

const buyTraining = (props) => {

    //window.erxesSettings = { knowledgeBase: { topic_id: "kDCkbQzKTuwGfSRva" }, }; (function() { var script = document.createElement(\'script\'); script.src = "https://crm.honari.com/widgets/build/knowledgebaseWidget.bundle.js"; script.async = true; var entry = document.getElementsByTagName(\'script\')[0]; entry.parentNode.insertBefore(script, entry); })();

    useEffect(() => {
        window.erxesSettings = { knowledgeBase: { topic_id: "kDCkbQzKTuwGfSRva" }, };

        const sc = document.createElement('script');
        sc.src = "https://crm.honari.com/widgets/build/knowledgebaseWidget.bundle.js";
        sc.async = true;

        let  script = document.createElement('script'); 
        script.src = "https://crm.honari.com/widgets/build/knowledgebaseWidget.bundle.js"; 
        script.async = true; 
        let entry = document.getElementsByTagName('script')[0]; 
        entry.parentNode.insertBefore(script, entry);
    }, []);

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
            let cart = localStorage.getItem('user_cart');
            if(cart === undefined || cart === null){
                localStorage.setItem('user_cart', '[]');
                props.reduxUpdateCart([]);
            }else{
                axios.post(Constants.apiUrl + '/api/guest-cart',{
                    cart: localStorage.getItem('user_cart')
                }).then((res) => {
                    const response = res.data;
                    if(response.status === 'done'){
                        let cartArray = [];
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
                    }
                }).catch((error) => {
                    console.log(error);
                    alert('مشکل در برقراری ارتباط');
                })
            }
        }
    }, [props.reduxUser.status, 'NI']);

    return (
        <React.Fragment>
            <Head>
                <title>آموزش نحوه ثبت نام در سایت، خرید و عضویت در کلاس‌های مجازی | هنری</title>
                <link rel="icon" href={ Constants.baseUrl + "/favicon.ico"} type="image/x-icon"/>
            </Head>
            <Header menu={props.ssrMenu} />
            <div className={['container'].join(' ')}>
                <div className={['row', 'justify-content-center', 'pt-3 '].join(' ')}>
                <div id='erxes-helper' data-erxes-kbase='' style={{width: '900px', height: '800px', margin: 'auto auto'}} ></div>
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
      reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(buyTraining);

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
        }
    };
  }
}
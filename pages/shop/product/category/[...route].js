import Head from 'next/head';
import {useRouter} from 'next/router';
import Header from '../../../../components/Header/Header';
import ProductItems from '../../../../components/ProductItems/ProductItems';
import Script from 'next/script';
import SideFilter from '../../../../components/SideFilter/SideFilter';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Constants from '../../../../components/constants';
import Footer from '../../../../components/Footer/Footer';
import ProductInsight from '../../../../components/ProductInsight/ProductInsight';
import CategoryInsight from '../../../../components/CategoryInsight/CategoryInsight';
import RootCategory from '../../../../components/RootCategory/RootCategory';
import * as actionTypes from '../../../../store/actions';
import {connect} from 'react-redux';

const Category = (props) => {
    const router = useRouter();
    const {route} = router.query;
    const [urlString, setUrlString] = useState(''); 
    const [component, setComponent] = useState(null);
    const [pageTitle, setPageTitle] = useState('');
    let ran = 0;

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

    useEffect(()=>{
        /*if(route !== undefined){
            let url = '';
            for(let i=0; i<route.length; i++){
                if(i == route.length - 1){
                    url = url + route[i];
                }else{
                    url = url + route[i] + '/';
                }                
            }
            axios.post(Constants.apiUrl + '/api/route-info', {
                route: url
            }).then((res)=>{
                let response = res.data;
                if(response.status !== 'failed'){
                    if(response.found === true && response.type === 'product'){
                        setPageTitle(response.name);
                        setComponent(null);
                        setComponent(<ProductInsight id={response.id}/>);
                    }else if(response.found === true && response.type === 'category'){
                        setPageTitle(response.name);
                        //setComponent(null);
                        //if(response.level === 1){
                        //    setComponent(null);
                        //    setComponent(<RootCategory id={response.id} name={response.name} route={route[0]} />);
                        //}else{
                            setComponent(null);
                            setComponent(<CategoryInsight id={response.id} />);
                        //}
                    }
                    console.log(response);
                }
            }).catch((error)=>{
            console.log(error);
            });
        }*/
        if(props.ssrUrlInfo.status !== 'failed'){
            if(props.ssrUrlInfo.found === true && props.ssrUrlInfo.type === 'product'){
                setPageTitle('خرید ' + props.ssrUrlInfo.name + ' | هنری');
                setComponent(null);
                setComponent(<ProductInsight id={props.ssrUrlInfo.id}/>);
            }else if(props.ssrUrlInfo.found === true && props.ssrUrlInfo.type === 'category'){
                setPageTitle('خرید ' + props.ssrUrlInfo.name + ' | هنری');
                //setComponent(null);
                //if(response.level === 1){
                //    setComponent(null);
                //    setComponent(<RootCategory id={response.id} name={response.name} route={route[0]} />);
                //}else{
                    setComponent(null);
                    setComponent(<CategoryInsight id={props.ssrUrlInfo.id} />);
                //}
            }
        }
        console.warn(props.ssrUrlInfo);
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>{pageTitle}</title>
                <link rel="icon" href={ Constants.baseUrl + "/favicon.ico"} type="image/x-icon"/>
            </Head>
            <Header menu={props.ssrMenu} />
            {
                component
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
        reduxIncreaseCountByOne: (d) => dispatch({type: actionTypes.INCREASE_COUNT_BY_ONE, productPackId: d}),
        reduxDecreaseCountByOne: (d) => dispatch({type: actionTypes.DECREASE_COUNT_BY_ONE, productPackId: d}),
        reduxRemoveFromCart: (d) => dispatch({type: actionTypes.REMOVE_FROM_CART, productPackId: d}),
        reduxWipeCart: () => dispatch({type: actionTypes.WIPE_CART}),
        reduxUpdateUserTotally: (d) => dispatch({type: actionTypes.UPDATE_USER_TOTALLY, data: d})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Category);

export async function getServerSideProps(context){
    let url = context.req.url.substr(1);
    let newUrl = '';
    if(url.charAt(0) === '_'){
        ///_next/data/development/shop/product/category/painting/ghalammo-abzar-rang/polet/pallet-guash-21-28cm.json?route=painting&route=ghalammo-abzar-rang&route=polet&route=pallet-guash-21-28cm
        for(let i=23; i<url.length; i++){
            if(url.charAt(i) == '.' && url.charAt(i+1) == 'j' && url.charAt(i+2) == 's'){
                break;
            }else{
                newUrl += url.charAt(i);
            }
        }
        console.log("new url: " + newUrl);
        if(newUrl.length !== 0){
            url = newUrl;
        }
    }
    const urlInfo = await fetch(Constants.apiUrl + '/api/route-info', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({route: url})
    });
    let urlResponse = await urlInfo.json();
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
                    ssrUrlInfo: await urlResponse,
                    ssrMenu: await menu
                }
            }
        }else{
            return {
                props: {
                    ssrUser: {status: 'GUEST', information: {}},
                    ssrCookies: context.req.cookies,
                    ssrUrlInfo: await urlResponse,
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
                ssrUrlInfo: await urlResponse,
                ssrMenu: await menu
            }
        };
    }
}
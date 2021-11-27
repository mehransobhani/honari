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
        if(route !== undefined){
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
                        setComponent(null);
                        if(response.level === 1){
                            setComponent(null);
                            setComponent(<RootCategory id={response.id} name={response.name} route={route[0]} />);
                        }else{
                            setComponent(null);
                            setComponent(<CategoryInsight id={response.id} />);
                        }
                    }
                    console.log(response);
                }
            }).catch((error)=>{
            console.log(error);
            });
        }
    },[route, undefined]);

    return (
        <React.Fragment>
            <Head>
                <title>{pageTitle}</title>
            </Head>
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
        reduxIncreaseCountByOne: (d) => dispatch({type: actionTypes.INCREASE_COUNT_BY_ONE, productId: d}),
        reduxDecreaseCountByOne: (d) => dispatch({type: actionTypes.DECREASE_COUNT_BY_ONE, productId: d}),
        reduxRemoveFromCart: (d) => dispatch({type: actionTypes.REMOVE_FROM_CART, productId: d}),
        reduxWipeCart: () => dispatch({type: actionTypes.WIPE_CART}),
        reduxUpdateUserTotally: (d) => dispatch({type: actionTypes.UPDATE_USER_TOTALLY, data: d})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Category);

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
                }
            }
        }
        
    }else{
        console.log("DOES NOT HAVE ANY COOKIES");
        return{
            props: {
                ssrUser: {status: 'GUEST', information: {}},
                ssrCookies: context.req.cookies
            }
        };
    }
}
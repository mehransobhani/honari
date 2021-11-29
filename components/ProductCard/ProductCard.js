import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import Link from 'next/link';
import PopTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import QuickView from '../QickView/QuickView';
import { LocalConvenienceStoreOutlined, PortraitSharp } from '@material-ui/icons';
import axios from 'axios';
import * as Constants from '../constants';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
import {useCookies} from 'react-cookie';
import Image from 'next/image';

const ProductCard = (props) => {

    const [productExistsInCart, setProductExistInCart] = useState(false);
    const [axiosProcessing, setAxiosProcessing] = useState(false);

    const [cookies , setCookie , removeCookie] = useCookies();

    const useStyles = makeStyles((theme) => ({
        modal: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        paper: {
          backgroundColor: theme.palette.background.paper,
          borderRadius: '4px',
          boxShadow: theme.shadows[5],
          padding: theme.spacing(2, 4, 3),
        },
    }));

    useEffect(() => {
        let found = false;
        props.reduxCart.information.map((item, counter) => {
            if(props.information.productId === item.productId){
                found = true;
            }
        });
        if(found){
            setProductExistInCart(true);
        }
    }, [props.reduxCart.status, 'NI']);

    const checkProductExistsInCart = () => {
        let found = false;
        props.reduxCart.information.map((item, counter) => {
            if(item.productId == props.information.productId){
                found = true;
            }
        });
        return found;
    }

    const addToCartButtonClicked = () => {
        if(!checkProductExistsInCart() && props.reduxCart.status !== 'NI'){
            if(props.reduxUser.status === 'LOGIN'){
                setAxiosProcessing(true);
                axios.post(Constants.apiUrl + '/api/user-add-to-cart', {
                    productId: props.information.productId,
                    productCount: 1
                },{
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    setAxiosProcessing(false);
                    let response = res.data;
                    if(response.status === 'done'){
                        let info = response.information;
                        /*props.reduxAddToCart({
                            productId: info.productId,
                            name: info.productName,
                            categoryId: info.categoryId,
                            prodID: info.prodID,
                            url: info.productUrl,
                            count: info.productCount,
                            unitCount: info.productUnitCount,
                            unitName: info.productUnitName,
                            label: info.productLabel,
                            basePrice: info.productBasePrice,
                            price: info.productPrice,
                            discountedPrice: info.discountedPrice,
                            discountPercent: info.discountPercent
                        });*/
                        props.reduxAddToCart({
                            productId: props.information.productId,
                            name: props.information.productName,
                            categoryId: props.information.categoryId,
                            prodID: props.information.prodID,
                            url: props.information.productUrl,
                            count: props.information.productCount,
                            unitCount: props.information.productUnitCount,
                            unitName: props.information.productUnitName,
                            label: props.information.productLabel,
                            basePrice: props.information.productBasePrice,
                            price: props.information.productPrice,
                            discountedPrice: props.information.discountedPrice,
                            discountPercent: props.information.discountPercent 
                        });
                        setProductExistInCart(true);
                    }else if(response.status === 'failed'){
                        console.log(response.message);
                        alert(response.umessage);
                    }
                }).catch((error) => {
                    setAxiosProcessing(false);
                    console.log(error);
                    alert('خطا در برقراری ارتباط');
                });
            }else if(props.reduxUser.status === 'GUEST'){
                setAxiosProcessing(true);
                axios.post(Constants.apiUrl + '/api/guest-add-to-cart',{
                    productId: props.information.productId,
                    productCount: 1
                }).then((res) => {
                    setAxiosProcessing(false);
                    let response = res.data;
                    if(response.status === 'done'){
                        let info = response.information;
                        let cart = JSON.parse(localStorage.getItem('user_cart')); 
                        let newItem = {};
                        newItem.id = props.information.productId;
                        newItem.count = 1;
                        cart.push(newItem);
                        localStorage.setItem('user_cart', JSON.stringify(cart));
                        /*props.reduxAddToCart({
                            productId: info.productId,
                            name: info.productName,
                            categoryId: info.categoryId,
                            prodID: info.prodID,
                            url: info.productUrl,
                            count: 1,
                            unitCount: info.productUnitCount,
                            unitName: info.productUnitName,
                            label: info.productLabel,
                            basePrice: info.productBasePrice,
                            price: info.productPrice,
                            discountedPrice: info.discountedPrice,
                            discountPercent: info.discountPercent
                        });*/
                        props.reduxAddToCart({
                            productId: props.information.productId,
                            name: props.information.productName,
                            categoryId: props.information.categoryId,
                            prodID: props.information.prodID,
                            url: props.information.productUrl,
                            count: 1,
                            unitCount: props.information.productUnitCount,
                            unitName: props.information.productUnitName,
                            label: props.information.productLabel,
                            basePrice: props.information.productBasePrice,
                            price: props.information.productPrice,
                            discountedPrice: props.information.discountedPrice,
                            discountPercent: props.information.discountPercent
                        });
                        setProductExistInCart(true);
                    }else if(response.status === 'failed'){
                        alert(response.umessage);
                    }
                }).catch((error) => {
                    setAxiosProcessing(false);
                    console.log(error);
                    alert('خطا در برقراری ارتباط');
                });
            }
        }
    }

    const removeFromCartButtonClicked = () => {
        if(checkProductExistsInCart() && props.reduxCart.status !== 'NI'){    
            if(props.reduxUser.status === 'LOGIN'){
                setAxiosProcessing(true);
                axios.post(Constants.apiUrl + '/api/user-remove-from-cart', {
                    productId: props.information.productId
                },{
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    setAxiosProcessing(false);
                    let response = res.data;
                    if(response.status === 'done'){
                        props.reduxRemoveFromCart(props.information.productId);
                        setProductExistInCart(false);
                    }else if(response.status === 'failed'){
                        console.warn(response.message)
                        alert(response.umessage);
                    }
                }).catch((error) => {
                    setAxiosProcessing(false);
                    console.error(error);
                    alert('خطا در برقراری ارتباط');
                });
            }else if(props.reduxUser.status === 'GUEST'){
                let cart = JSON.parse(localStorage.getItem('user_cart'));
                let newCart = [];
                cart.map((item, counter) => {
                    if(item.id !== props.information.productId){
                        newCart.push(item);
                    }
                });
                localStorage.setItem('user_cart', JSON.stringify(newCart));
                props.reduxRemoveFromCart(props.information.productId);
                setProductExistInCart(false);
            }
        }
    }

    return(
        <div className={['col-6', 'col-md-3', 'p-2'].join(' ')}>
            <div className={['d-flex', 'flex-column'].join(' ')} style={{borderRadius: '4px', border: '1px solid #dedede', height: '100%'}} >
                <div style={{position: 'relative'}}>
                    <img src={'https://honari.com/image/resizeTest/shop/_200x/thumb_' + props.information.prodID + '.jpg'} style={{width: '100%', height: 'auto', borderRadius: '4px 4px 0 0'}} />
                </div>
                <div className={['p-3', 'text-right', 'rtl'].join(' ')}>
                    <Link href={'/' + props.information.productUrl}><a><h6 className={['font-weight-bold', 'text-right', 'rtl', 'mb-3'].join(' ')}>{props.information.productName}</h6></a></Link>
                    {
                        props.information.productPrice != -1 ?
                        props.information.productPrice != props.information.discountedPrice ?
                        props.information.discountedPrice == 0 ?
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'align-self-end'].join(' ')}>
                            <h6 className={['text-danger', 'text-right', 'rtl', 'mb-0', 'p-1', 'text-muted'].join(' ')} style={{borderRadius: '4px', backgroundColor: '#f2f2f2', fontSize: '14px'}}><del>{props.information.productPrice.toLocaleString()}</del></h6>
                            <h6 className={['text-danger', 'text-right', 'rtl', 'mb-0', 'mr-1'].join(' ')}>رایگان</h6>
                        </div>
                        :
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'align-self-end'].join(' ')}>
                            <h6 className={['text-danger', 'text-right', 'rtl', 'mb-0', 'p-1', 'text-muted'].join(' ')} style={{borderRadius: '4px', backgroundColor: '#f2f2f2', fontSize: '14px'}}><del>{props.information.productPrice.toLocaleString()}</del></h6>
                            <h6 className={['text-danger', 'text-right', 'rtl', 'mb-0', 'mr-1'].join(' ')}>{props.information.discountedPrice.toLocaleString() + ' تومان '}</h6>
                        </div>
                        :
                        <h6 className={['text-danger', 'text-right', 'rtl', 'mb-0', 'align-self-end'].join(' ')}>{props.information.productPrice.toLocaleString() + ' تومان '}</h6>        
                        :
                        <span className={['text-right', 'rtl', 'mb-0', 'px-2', 'align-self-end'].join(' ')} style={{backgroundColor: 'white', color: 'white', borderRadius: '4px'}}>ناموجود</span>
                    }
                </div>
                {
                    axiosProcessing
                    ?
                    <button className={['w-100', 'py-2', 'mt-auto', styles.axiosProcessingButton].join(' ')} style={{outline: 'none', outlineStyle: 'none', borderStyle: 'none', borderRadius: '0 0 4px 4px', borderTop: '1px solid #dedede'}}>کمی صبر کنید</button>   
                    :
                    (
                        props.information.productPrice === -1
                        ?
                            <button className={['w-100', 'py-2', 'mt-auto', styles.productDoesNotExist].join(' ')} style={{outline: 'none', outlineStyle: 'none', borderStyle: 'none', borderRadius: '0 0 4px 4px', borderTop: '1px solid #dedede'}}>ناموجود</button>   
                        :
                        (
                            checkProductExistsInCart()
                            ?
                            <button className={['w-100', 'py-2', 'pointer', 'mt-auto', styles.removeFromCartButton].join(' ')} style={{outline: 'none', outlineStyle: 'none', borderStyle: 'none', borderRadius: '0 0 4px 4px', borderTop: '1px solid #dedede'}} onClick={removeFromCartButtonClicked}>حذف از سبد خرید</button>
                            :
                            <button className={['w-100', 'py-2', 'pointer', 'mt-auto', styles.addToCartButton].join(' ')} style={{outline: 'none', outlineStyle: 'none', borderStyle: 'none', borderRadius: '0 0 4px 4px', borderTop: '1px solid #dedede'}} onClick={addToCartButtonClicked}>اضافه به سبد خرید</button>    
                        )
                    )
                }
            </div>
        </div>
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
        reduxAddToCart: (d) => dispatch({type: actionTypes.ADD_TO_CART, data: d}),
        reduxRemoveFromCart: (d) => dispatch({type: actionTypes.REMOVE_FROM_CART, productId: d})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
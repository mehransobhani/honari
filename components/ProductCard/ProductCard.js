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
import Skeleton from '@mui/material/Skeleton';

const ProductCard = (props) => {

    const [productExistsInCart, setProductExistInCart] = useState(false);
    const [axiosProcessing, setAxiosProcessing] = useState(false);
    const [isImageLoaded , setIsImageLoaded] = useState(false);
    const [increaseAxiosWaiting, setIncreaseAxiosWaiting] = useState(false);
    const [decreaseAxiosWaiting, setDecreaseAxiosWaiting] = useState(false);
    const [productIndexInCart, setProductIndexInCart] = useState(-1);
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
            if(props.information.productPackId === item.productPackId){
                found = true;
            }
        });
        if(found){
            setProductExistInCart(true);
        }
        getIndexOfProductInCart();
    }, [props.reduxCart.status, 'NI']);

    const checkProductExistsInCart = () => {
        let found = false;
        props.reduxCart.information.map((item, counter) => {
            if(item.productPackId == props.information.productPackId){
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
                    productPackId: props.information.productPackId,
                    productPackCount: 1
                },{
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    setAxiosProcessing(false);
                    let response = res.data;
                    if(response.status === 'done'){
                        let info = response.information;
                        props.reduxAddToCart({
                            productId: props.information.productId,
                            productPackId: props.information.productPackId,
                            name: props.information.productName,
                            categoryId: props.information.categoryId,
                            prodID: props.information.prodID,
                            url: props.information.productUrl,
                            //count: props.information.productCount,
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
                        getIndexOfProductInCart();
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
                    productPackId: props.information.productPackId,
                    productPackCount: 1
                }).then((res) => {
                    setAxiosProcessing(false);
                    let response = res.data;
                    if(response.status === 'done'){
                        let info = response.information;
                        let cart = JSON.parse(localStorage.getItem('user_cart')); 
                        let newItem = {};
                        newItem.id = props.information.productPackId;
                        newItem.count = 1;
                        cart.push(newItem);
                        localStorage.setItem('user_cart', JSON.stringify(cart));
                        props.reduxAddToCart({
                            productId: props.information.productId,
                            productPackId: props.information.productPackId,
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
                        getIndexOfProductInCart();
                        setProductExistInCart(true);
                        //setProductIndexInCart(props.reduxCart.information.length + 1);
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
                    productPackId: props.information.productPackId
                },{
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    setAxiosProcessing(false);
                    let response = res.data;
                    if(response.status === 'done'){
                        props.reduxRemoveFromCart(props.information.productPackId);
                        setProductIndexInCart(-1);
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
                    if(item.id !== props.information.productPackId){
                        newCart.push(item);
                    }
                });
                localStorage.setItem('user_cart', JSON.stringify(newCart));
                props.reduxRemoveFromCart(props.information.productPackId);
                setProductExistInCart(false);
                setProductIndexInCart(-1);
            }
        }
    }

    const increaseProductCountByOne = () => {
        if(!increaseAxiosWaiting){
            if(props.reduxUser.status == 'GUEST'){
                getIndexOfProductInCart();
                setIncreaseAxiosWaiting(true);
                axios.post(Constants.apiUrl + '/api/guest-check-cart-changes', {
                    productPackId: props.information.productPackId,
                    count: props.reduxCart.information[productIndexInCart].count + 1,
                }).then((res) => {
                    let response = res.data;
                    if(response.status == 'done'){
                        updateProductInLocalStorage(response.count);
                        props.reduxIncreaseCountByOne(props.reduxCart.information[productIndexInCart].productPackId);
                        
                    }else if(response.status == 'failed'){
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                    setIncreaseAxiosWaiting(false);
                }).catch((error) => {
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                    setIncreaseAxiosWaiting(false);
                });
            }else if(props.reduxUser.status === 'LOGIN'){
                setIncreaseAxiosWaiting(true);
                axios.post(Constants.apiUrl + '/api/user-increase-cart-by-one', {
                    productPackId: props.information.productPackId
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    let response = res.data;
                    if(response.status == 'done'){
                        props.reduxIncreaseCountByOne(props.information.productPackId);
                    }else if(response.status == 'failed'){
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                    setIncreaseAxiosWaiting(false);
                }).catch((error) => {
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                    setIncreaseAxiosWaiting(false);
                });
            }
        }
    }

    const getIndexOfProductInCart = () => {
        props.reduxCart.information.map((info, index) => {
            if(props.information.productPackId == info.productPackId){
                setProductIndexInCart(index);
            }
        })
    }

    const decreaseProductCountByOne = (key) => {
        if(!decreaseAxiosWaiting){
            let i = 0;
            for(i = 0; i< props.reduxCart.information.length; i++){
                if(props.reduxCart.information[i].productPackId === props.information.productPackId && props.reduxCart.information[i].count === 1){
                    removeFromCartButtonClicked();
                    return;
                }
            }
            if(props.reduxUser.status == 'GUEST'){
                setDecreaseAxiosWaiting(true);
                axios.post(Constants.apiUrl + '/api/guest-check-cart-changes', {
                    productPackId: props.information.productPackId,
                    count: props.reduxCart.information[productIndexInCart].count - 1
                }).then((res) => {
                    let response = res.data;
                    if(response.status == 'done'){
                        updateProductInLocalStorage(response.count);
                        props.reduxDecreaseCountByOne(props.reduxCart.information[productIndexInCart].productPackId);
                    }else if(response.status == 'failed'){
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                    setDecreaseAxiosWaiting(false);
                }).catch((error) => {
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                    setDecreaseAxiosWaiting(true);
                });
                setDecreaseAxiosWaiting(true);
                updateProductInLocalStorage(props.reduxCart.information[productIndexInCart].count - 1);
                setDecreaseAxiosWaiting(false);
            }else if(props.reduxUser.status == 'LOGIN'){
                setDecreaseAxiosWaiting(true);
                axios.post(Constants.apiUrl + '/api/user-decrease-cart-by-one', {
                    productPackId: props.information.productPackId
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    let response = res.data;
                    if(response.status == 'done'){
                        props.reduxDecreaseCountByOne(props.information.productPackId);
                    }else if(response.status === 'failed'){
                        console.log(response.message);
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                    setDecreaseAxiosWaiting(false);
                }).catch((error) => {
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                    setDecreaseAxiosWaiting(false);
                });
            }
        }
    }


    const updateProductInLocalStorage = (count) => {
        // props.information.productPackId
        let localStorageProducts = JSON.parse(localStorage.getItem('user_cart'));
        localStorageProducts.map((item, id) => {
            if(item.id == props.information.productPackId){
                item.count = count;
            }
        });
        localStorage.setItem('user_cart', JSON.stringify(localStorageProducts));    
    }

    const imageLoadingCompleted = () => {
        setIsImageLoaded(true);
    }

    return(
        <div className={['col-6', 'col-md-3', 'p-2'].join(' ')}>
            <div className={['d-flex', 'flex-column'].join(' ')} style={{borderRadius: '4px', border: '1px solid #dedede', height: '100%'}} >
                <Link href={'/' + props.information.productUrl}>
                    <a style={{position: 'relative'}} onClick={props.reduxStartLoading}>
                        {
                            !isImageLoaded && !props.ssr
                            ?
                                <Skeleton variant="rectangular" style={{width: '100%', height: '300px'}} />
                            :
                            null
                        }
                        <img src={'https://honari.com/image/resizeTest/shop/_200x/thumb_' + props.information.prodID + '.jpg'} className={[isImageLoaded || props.ssr ? '' : 'd-none'].join(' ')} onLoad={() => {imageLoadingCompleted()}} style={{width: '100%', height: 'auto', borderRadius: '4px 4px 0 0'}} />
                    </a>
                </Link>
                <Link href={'/' + props.information.productUrl}>
                    <a className={['p-3', 'text-right', 'rtl'].join(' ')} onClick={props.reduxStartLoading}>
                        <h6 className={['font-weight-bold', 'text-right', 'rtl', 'mb-3'].join(' ')} style={{lineHeight: '1.6rem', color: '#444444'}}>{props.information.productName}</h6>
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
                    </a>
                </Link>
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
                            (
                                <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-center', 'py-2', 'mt-auto'].join(' ')} style={{borderTop: '1px solid #DEDEDE'}}>
                                    <button className={['w-100', 'py-2', 'pointer', 'mt-auto', styles.removeFromCartButton, 'd-none'].join(' ')} style={{outline: 'none', outlineStyle: 'none', borderStyle: 'none', borderRadius: '0 0 4px 4px', borderTop: '1px solid #dedede'}} onClick={removeFromCartButtonClicked}>حذف از سبد خرید</button>
                                    <img src={Constants.baseUrl + (increaseAxiosWaiting ? '/assets/images/main_images/loading_circle_dotted.png' : '/assets/images/main_images/plus_gray_circle.png')} onClick={increaseProductCountByOne} className={['pointer'].join(' ')} style={{width: '20px'}} />
                                    <h6 className={['text-center', 'mb-0', 'px-4', 'd-none'].join(' ')}>{productIndexInCart === -1 || props.reduxCart.information[productIndexInCart] === undefined ? '' : props.reduxCart.information[productIndexInCart].count}</h6>
                                    <h6 className={['text-center', 'mb-0', 'px-4'].join(' ')}>
                                        {
                                            props.reduxCart.information.map((info, i) => {
                                                if(info.productPackId == props.information.productPackId){
                                                    return info.count;
                                                }
                                            })
                                        }
                                    </h6>
                                    <img src={Constants.baseUrl + (decreaseAxiosWaiting ? '/assets/images/main_images/loading_circle_dotted.png' : '/assets/images/main_images/minus_gray_circle.png')} onClick={decreaseProductCountByOne} className={['pointer'].join(' ')} style={{width: '20px'}} />
                                </div>
                            )
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
        reduxCart: state.cart,
        reduxLoad: state.loading,
        reduxSnackbar: state.snackbars
    };
}

const mapDispatchToProps = (dispatch) => {
    return{
        reduxAddToCart: (d) => dispatch({type: actionTypes.ADD_TO_CART, data: d}),
        reduxUpdateUser: (d) => dispatch({type: actionTypes.UPDATE_USER, data: d}),
        reduxLogoutUser: () => dispatch({type: actionTypes.LOGOUT_USER}),
        reduxSetUserGuest: () => dispatch({type: actionTypes.SET_USER_GUEST}),
        reduxUpdateCart: (d) => dispatch({type: actionTypes.UPDATE_CART, data: d}),
        reduxStartLoading: () => dispatch({type: actionTypes.START_LOADING}),
        reduxStopLoading: () => dispatch({type: actionTypes.STOP_LOADING}),
        reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t}),
        reduxIncreaseCountByOne: (d) => dispatch({type: actionTypes.INCREASE_COUNT_BY_ONE, productPackId: d}),
        reduxDecreaseCountByOne: (d) => dispatch({type: actionTypes.DECREASE_COUNT_BY_ONE, productPackId: d}),
        reduxRemoveFromCart: (d) => dispatch({type: actionTypes.REMOVE_FROM_CART, productPackId: d}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import styles from './style.module.css';
import Header from '../Header/Header';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import NewProduct from '../../components/NewProducts/NewProducts.js';
import axios from 'axios';
import * as Constants from '../constants';
import parse from 'html-react-parser'
import SimilarProducts from '../SimilarProducts/SimilarProducts';
import TopSixProducts from '../TopSixProducts/TopSixProducts';
import {useCookies} from 'react-cookie';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';
import Image from 'next/image';

const ProductInsight = (props) =>{
    const [loading, setLoading] = useState(false);
    const [productNameState, setProductNameState] = useState('');
    const [productImageState, setProductImageState] = useState('');
    const [priceState, setPriceState] = useState(0);
    const [stockState, setStockState] = useState(0);
    const [packLabelState, setPackLabelState]= useState(0);
    const [statusState, setStatusState] = useState(-1);
    const [basePriceState, setBasePriceState] = useState(0);
    const [cartButtonOpacity, setCartButtonOpacity] = useState('0.3');
    const [productDescriptionState, setProductDescriptionState] = useState(undefined);
    const [productFeaturesState, setProductFeaturesState] = useState([]);
    const [breadcrumbState, setBreadcrumbState] = useState([]);
    const [id, setId] = useState(props.id);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [productInformation, setProductInformation] = useState({});
    const [orderCount, setOrderCount] = useState(1);
    const [productCartStatus, setProductCartStatus] = useState('');
    const [productCartCount, setProductCartCount] = useState(null);
    const [productExistsInCart, setProductExistsInCart] = useState(null);
    const [axiosProcessing, setAxiosProcessing] = useState(false);


    const [cookies , setCookie , removeCookie] = useCookies();

    useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/product-basic-information', {
            productId: id,
        }).then((res)=>{
            if(res.data.status === 'done'){
                let response = res.data;
                setProductInformation(response.information);
                console.warn(response.information);
            }else{
                console.log(res.data.umessage);
            }
        }).catch((error)=>{
            console.log(error);
        });
    }, []);

    useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/product-description', {
            id: id,
        }).then((res)=>{
            let response = res.data;
            setProductDescriptionState(parse(response));
        }).catch((error)=>{
            console.log(error);
        });
    }, []);

    useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/product-features', {
            id: id,
        }).then((res)=>{
            if(res.data.status === 'done'){
                let response = res.data;
                if(response.features !== null && response.features !== undefined){
                    setProductFeaturesState(response.features);
                }
            }else{
                console.log(res.data.message);
            }
        }).catch((error)=>{
            console.log(error);
        });
    }, []);

    useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/product-breadcrumb', {
            id: id,
        }).then((res)=>{
            if(res.data.status === 'done'){
                let response = res.data;
                setBreadcrumbState(response.categories);
            }else{
                console.log(res.data.message);
            }
        }).catch((error)=>{
            console.log(error);
        });
    }, []);

    useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/similar-products', {
            id: id,
        }).then((res)=>{
            if(res.data.status === 'done' && res.data.found === true){
                let response = res.data;
                setSimilarProducts(response.products);
            }else{
                console.log(res.data.message);
            }
        }).catch((error)=>{
            console.log(error);
        });
        console.log(cookies.user_cart);
    }, []);

    useEffect(() => {
        if(props.reduxCart.status !== 'NI'){
            let found = false;
            props.reduxCart.information.map((cartItem, counter) => {
                if(cartItem.productId == id){
                    found = true;
                }
            });
            if(found){
                setProductExistsInCart(true);
            }else{
                setProductExistsInCart(false);
            }
        }
    }, [props.reduxCart.status, 'NI']);

    const productCounterChanged = (event) => {
        if(event.target.value < 1){
            event.target.value = 1;
            setOrderCount(1);
        }else if(event.target.value > productInformation.maxCount){
            event.target.value = productInformation.maxCount;
            setOrderCount(productInformation.maxCount);
        }else{
            setOrderCount(event.target.value);
        }
    }

    const addToCartButtonClicked = () => {
        if(!productExistsInCart && !axiosProcessing){
            if(props.reduxUser.status === 'LOGIN'){
                setAxiosProcessing(true);
                axios.post(Constants.apiUrl + '/api/user-add-to-cart', {
                    productPackId: productInformation.productPackId,
                    productPackCount: orderCount
                },{
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    let response = res.data;
                    if(response.status === 'done'){
                        props.reduxAddToCart({
                            productId: productInformation.productId,
                            productPackId: productInformation.productPackId,
                            name: productInformation.productName,
                            categoryId: productInformation.categoryId,
                            prodID: productInformation.prodID,
                            url: productInformation.productUrl,
                            count: orderCount,
                            unitCount: productInformation.productUnitCount,
                            unitName: productInformation.productUnitName,
                            label: productInformation.productLabel,
                            basePrice: productInformation.productBasePrice,
                            price: productInformation.productPrice,
                            discountedPrice: productInformation.discountedPrice,
                            discountPercent: productInformation.discountPercent
                        });
                        setProductExistsInCart(true);
                    }else if(response.status === 'failed'){
                        alert(response.umessage);
                    }
                }).catch((error) => {
                    console.log(error);
                    alert('خطا در برقراری ارتباط');
                });
                setAxiosProcessing(false);
            }else if(props.reduxUser.status === 'GUEST'){
                let cart = JSON.parse(localStorage.getItem('user_cart'));
                console.warn(productInformation);
                props.reduxAddToCart({
                    productId: productInformation.productId,
                    productPackId: productInformation.productPackId,
                    name: productInformation.productName,
                    categoryId: productInformation.categoryId,
                    prodID: productInformation.prodID,
                    url: productInformation.productUrl,
                    count: orderCount,
                    unitCount: productInformation.productUnitCount,
                    unitName: productInformation.productUnitName,
                    label: productInformation.productLabel,
                    basePrice: productInformation.productBasePrice,
                    price: productInformation.productPrice,
                    discountedPrice: productInformation.discountedPrice,
                    discountPercent: productInformation.discountPercent
                });
                cart.push({id: productInformation.productPackId, count: orderCount});
                localStorage.setItem('user_cart', JSON.stringify(cart));
                setProductExistsInCart(true);
            }
        }
    }

    const removeFromCartButtonClicked = () => {
        if(productExistsInCart && !axiosProcessing){
            if(props.reduxUser.status === 'LOGIN'){
                setAxiosProcessing(true);
                axios.post(Constants.apiUrl + '/api/user-remove-from-cart', {
                    productPackId: productInformation.productPackId
                },{
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    let response = res.data;
                    if(response.status === 'done'){
                        props.reduxRemoveFromCart(productInformation.productPackId);
                        setProductExistsInCart(false);
                    }else if(response.status === 'failed'){
                        alert(response.umessage);
                    }
                }).catch((error) => {
                    console.log(error);
                    alert('خطا در برقراری ارتباط');
                });
                setAxiosProcessing(false);
            }else if(props.reduxUser.status === 'GUEST'){
                let cart = JSON.parse(localStorage.getItem('user_cart'));
                let newCart = [];
                cart.map((cartItem, counter) => {
                    if(id !== cartItem.id){
                        newCart.push(cartItem);
                    }
                });
                localStorage.setItem('user_cart', JSON.stringify(newCart));
                props.reduxRemoveFromCart(productInformation.productPackId);
                setProductExistsInCart(false);
            }
        }
    }

    

    return(
        <React.Fragment>
            <Header newCartCount={productCartCount} />
            <div className={['d-none', 'd-md-block'].join(' ')} style={{backgroundColor: '#F2F2F2'}}>
                <div className={['container', 'd-flex', 'flex-row', 'align-items-center', 'rtl', 'py-2', 'px-2'].join(' ')}>
                    <Breadcrumbs>
                    <p className={['p-1', 'mb-0', 'd-none', 'd-md-block'].join(' ')} style={{backgroundColor: 'white', border: '1px solid #8bf0f7', borderRadius: '14px 1px 1px 14px'}}>اینجا هستید</p>
                        {
                            breadcrumbState.map((bread, count)=>{
                                return(
                                    <Link key={count} href={'/shop/product/category/' + bread.url} ><a className={['breadcrumbItem', 'mb-0'].join(' ')} style={{fontSize: '14px'}} >{bread.name}</a></Link>
                                );
                            })
                        }
                    </Breadcrumbs>
                </div>
            </div>
            <div className={['container'].join(' ')} >
                {parse('<div id="15444215659775694"><script type="text/JavaScript" src="https://www.aparat.com/embed/eVMWk?data[rnddiv]=15444215659775694&data[responsive]=yes"></script></div>')}
                <div className={['row', 'rtl', 'mt-0', 'mt-md-3'].join(' ')}>
                    <div className={['col-12', 'col-md-5', 'px-0', 'px-md-2'].join(' ')}>
                        <img src={'https://honari.com/image/resizeTest/shop/_1000x/thumb_' + productInformation.prodID + '.jpg'} className={[styles.mainImage].join(' ')} style={{width: '100%'}} />
                    </div>
                    <div className={['col-12', 'col-md-7', 'rtl', 'mt-3', 'mt-md-0'].join(' ')}>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between'].join(' ')}>
                            <h2 className={['mb-0'].join(' ')} style={{fontSize: '20px'}}>{productInformation.productName}</h2>
                            {
                                productInformation.productStatus === 1  ?
                                    <div  className={['d-flex', 'flex-row', 'align-items-center', 'bg-success', 'rtl', 'py-1', 'px-2'].join(' ')} style={{color: 'white', borderRadius: '13px'}}>
                                        <img src={Constants.baseUrl + '/assets/images/main_images/tick_white_small.png'} style={{width: '12px', height: '12px'}} />
                                        <small className={['mb-0', 'mr-1'].join(' ')}>موجود</small>
                                    </div>
                                :
                                    (productInformation.productStatus === -1 ?
                                        <div className={['d-flex', 'flex-row', 'align-items-center', 'bg-danger', 'rtl', 'py-1', 'px-2'].join(' ')} style={{color: 'white', borderRadius: '13px'}}>
                                            <img src={Constants.baseUrl + '/assets/images/main_images/cross_white_small.png'} style={{width: '12px', height: '12px'}} />
                                            <small className={['mb-0', 'mr-1'].join(' ')}>ناموجود</small>
                                        </div>
                                    :
                                        (productInformation.productStatus === 0) ?
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'bg-warning', 'rtl', 'py-1', 'px-2'].join(' ')} style={{color: 'white', borderRadius: '13px'}}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/tick_white_small.png'} style={{width: '12px', height: '12px'}} />
                                                <small className={['mb-0', 'mr-1'].join(' ')}>بزودی</small>
                                            </div>
                                        :
                                            null
                                    )
                            }
                        </div>
                        {
                            (productInformation.productStatus === 1) ? 
                            <React.Fragment>
                            <div className={['mt-3', 'mt-md-2'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
                            <h6 className={['w-100', 'mb-1', 'text-right', 'mt-4'].join(' ')} style={{fontSize: '18px'}}>انتخاب نوع بسته</h6>
                            <div className={['d-flex', 'flex-row', 'align-items-center', 'px-1'].join(' ')} style={{border: '1px solid #C4C4C4', borderRadius: '4px'}}>
                                <input type='radio' className={['form-control'].join(' ')} checked={true} style={{width: '16px'}} value='سلام' />
                                <label className={['mb-0', 'mr-1'].join(' ')}>{productInformation.productLabel}</label>
                                {
                                    productInformation.productBasePrice !== undefined
                                    ?
                                    <label className={['mb-0', 'text-danger', 'mr-1'].join(' ')}>{'( هر واحد ' + productInformation.productBasePrice.toLocaleString() + ' تومان )'}</label>
                                    :
                                    null
                                }
                            </div>
                            {
                                productInformation.productPrice !== undefined && productInformation.discountedPrice !== undefined
                                ?
                                (
                                    productInformation.productPrice != productInformation.discountedPrice
                                    ?
                                        <div className={['d-flex', 'flex-row', 'align-items-center', 'mt-4'].join(' ')}>
                                            <h6 className={['mb-0']}>قیمت کالا : </h6>
                                            <h6 className={['text-secondary', 'mb-0', 'mr-2'].join(' ')}><del>{productInformation.productPrice.toLocaleString() + ' تومان '}</del></h6>
                                            <h6 className={['p-1', 'mb-0', 'bg-danger', 'text-white', 'rounded', 'mr-2', 'rtl'].join(' ')} style={{fontSize: '13px'}}>{'تخفیف ٪' + productInformation.discountPercent}</h6>
                                        </div>
                                    :
                                    null
                                )
                                : 
                                null
                            }
                            {
                                productInformation.productPrice !== productInformation.discountedPrice ?
                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'mt-2'].join(' ')}>
                                        <h5 className={['mb-0']}>قیمت برای شما : </h5>
                                        <h5 className={['mb-0', 'mr-2'].join(' ')} style={{color: '#00bac6'}}>{productInformation.discountedPrice.toLocaleString() + ' تومان '}</h5>
                                    </div>
                                :
                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'mt-4'].join(' ')}>
                                        <h5 className={['mb-0']}>قیمت کالا : </h5>
                                        <h5 className={['mb-0', 'mr-2'].join(' ')} style={{color: '#00bac6'}}>{productInformation.productPrice.toLocaleString() + ' تومان '}</h5>
                                    </div>
                            }
                            
                            <div className={['d-flex', 'flex-row', 'align-items-center', 'mt-4'].join(' ')}>
                                <h6 className={['mb-0'].join(' ')}>تعداد : </h6>
                                <input type='number' className={['mr-1', 'text-center'].join(' ')} defaultValue='1' style={{width: '50px', outline: 'none', outlineStyle: 'none', borderStyle: 'none', border: '1px solid #C4C4C4', borderRadius: '4px'}} onChange={productCounterChanged} />
                            </div>
                            {
                                productExistsInCart === false ?
                                    <button className={['d-flex', 'flex-row', 'align-items-center', 'btn', 'mt-4'].join(' ')} style={{backgroundColor: '#00bac6'}} onClick={addToCartButtonClicked}>
                                        <img src={Constants.baseUrl + '/assets/images/main_images/cart_white_small.png'} style={{width: '20px', height: '20px'}} />
                                        <span className={['text-white', 'mr-2'].join(' ')} >افزودن به سبد خرید</span>
                                    </button>
                                :
                                (
                                    productExistsInCart === true ?
                                        <button className={['d-flex', 'flex-row', 'align-items-center', 'btn', 'mt-4'].join(' ')} style={{backgroundColor: '#de3c31'}} onClick={removeFromCartButtonClicked}>
                                            <img src={Constants.baseUrl + '/assets/images/main_images/cart_white_small.png'} style={{width: '20px', height: '20px'}} />
                                            <span className={['text-white', 'mr-2'].join(' ')} >حذف از سبد خرید</span>
                                        </button>
                                    :
                                        null
                                    
                                )
                            }
                            
                        </React.Fragment>
                        : 
                            (productInformation.productStatus === -1 ?
                                <div className={['rtl', 'text-right'].join(' ')}>
                                    <div className={['mt-3', 'mt-md-2'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
                                    <span className={['py-3', 'px-4', 'mt-2', 'd-inline-block'].join(' ')} style={{backgroundColor: '#8c8c8c', color: 'white', borderRadius: '4px'}}>موجود نیست</span>
                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'mt-3'].join(' ')}>
                                        <img src={Constants.baseUrl + '/assets/images/main_images/bell_red.png'} style={{width: '24px', height: '24px'}} />
                                        <span className={['mr-1', 'pointer'].join(' ')} style={{color: '#00bac6'}}>درصورت موجود شدن به من اطلاع دهید</span>
                                    </div>
                                </div>
                            :
                            (productInformation.productStatus === 0 ?
                                <div className={['rtl', 'text-right'].join(' ')}>
                                    <div className={['mt-3', 'mt-md-2'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
                                    <span className={['py-3', 'px-4', 'mt-2', 'd-inline-block', 'bg-warning', 'text-dark'].join(' ')} style={{backgroundColor: '#8c8c8c', color: 'white', borderRadius: '4px'}}>بزودی ارائه میشود</span>
                                </div>
                            :
                                null
                            )
                        )
                        }
                        
                    </div>
                </div>
                <div className={['row', 'rtl', 'py-2', 'mt-4', 'shadow-sm', 'mb-0', 'mx-md-0', styles.banners].join(' ')}>
                    <div className={['col-4', 'd-flex', 'flex-column', 'flex-md-row', 'align-items-center', 'justify-content-center'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/stopwatch_black.png'} className={[styles.infoImage].join(' ')} />
                        <p className={['mb-0', 'mx-md-1', 'font-weight-bold', styles.info].join(' ')}>ارسال سریع سفارش</p>
                        <p className={['mb-0', styles.info].join(' ')}>به سراسر کشور</p>
                    </div>
                    <div className={['col-4', 'd-flex', 'flex-column', 'flex-md-row', 'align-items-center', 'justify-content-center'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/truck_black.png'} className={[styles.infoImage].join(' ')} />
                        <p className={['mb-0', 'mx-md-1', 'font-weight-bold', styles.info].join(' ')}>ارسال رایگان</p>
                        <p className={['mb-0', 'text-center', styles.info].join(' ')}>خرید بالای ۱۰۰ هزار تومان</p>
                    </div>
                    <div className={['col-4', 'd-flex', 'flex-column', 'flex-md-row', 'align-items-center', 'justify-content-center'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/return_black.png'} className={[styles.infoImage].join(' ')} />
                        <p className={['mb-0', 'mx-md-1', 'font-weight-bold', styles.info].join(' ')}>امکان مرجوعی کالا</p>
                        <p className={['mb-0', 'text-center', styles.info].join(' ')}>بدون محدودیت زمانی</p>
                    </div>
                </div>
            </div>
            <div className={['container-fluid', 'mt-0', 'mt-md-4'].join(' ')} style={{backgroundColor: '#F2F2F2'}}>
                <div className={['container', 'rtl'].join(' ')}>
                    <div className={['row', 'py-4', 'py-md-5'].join(' ')}>
                        <div className={['col-12', 'col-md-5', 'pl-1', 'px-0', 'px-md-3'].join(' ')}>
                            <div className={['d-flex', 'flex-row', 'align-items-center', 'mb-2'].join(' ')}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/paragraph_black.png'} style={{width: '16px', height: '16px'}} />
                                <h6 className={['mb-0', 'mr-2', 'font-weight-bold'].join(' ')}>توضیحات محصول</h6>
                            </div>
                            <div className={['mb-0', 'rtl', 'text-right', styles.infoContainer].join(' ')} style={{maxHeight: '250px', overflowY: 'scroll', scrollbarWidth: 'thin'}}>{productDescriptionState}</div>
                        </div>
                        <div className={['col-12', 'col-md-7', 'px-0', 'px-md-3', 'mt-3', 'mt-md-0'].join(' ')} >
                            <div className={['d-flex', 'flex-row', 'align-items-center', 'mb-2'].join(' ')}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/clipboard_black.png'} style={{width: '16px', height: '16px'}} />
                                <h6 className={['mb-0', 'mr-2', 'font-weight-bold'].join(' ')}>مشخصات محصول</h6>
                            </div>
                            <table className={['table', 'table-striped'].join(' ')} style={{border: '1px solid #dedede', borderRadius: '4px', backgroundColor: 'white'}}>
                                <tbody>
                                    {
                                        productFeaturesState.map((feature, index)=>{
                                            return(
                                                <tr key={index}>
                                                    <td className={['text-right', 'ltr'].join(' ')}>{feature.title}</td>
                                                    <td className={['text-right', 'ltr'].join(' ')}>{feature.value}</td>
                                                </tr> 
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className={['container'].join(' ')}>
                <TopSixProducts title='محصولات مشابه' entries={similarProducts} />
            </div>
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
        reduxRemoveFromCart: (d) => dispatch({type: actionTypes.REMOVE_FROM_CART, productPackId: d})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductInsight);
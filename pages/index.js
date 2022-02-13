import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header/Header';
import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import Discounts from '../components/Discounts/Discounts';
import NewStuffs from '../components/NewStuffs/NewStuffs';
import styles from './index.module.css';
import SpecialOffers from '../components/SpecialOffers/SpecialOffers.js';
import NewProducts from '../components/NewProducts/NewProducts.js';
import Footer from '../components/Footer/Footer.js';
import LatestCourses from '../components/LatestCourses/LatestCourses.js';
import * as Constants from '../components/constants';
import axios from 'axios';
import { urlObjectKeys } from 'next/dist/next-server/lib/utils';
import { Repeat } from '@material-ui/icons';
import {useCookies} from 'react-cookie';
import {GetServerSideProps} from 'next';
import * as actionTypes from '../store/actions';
import {connect} from 'react-redux';
import Image from 'next/image';

const Home = (props) => {

  const searchFormSubmited = (event) => {
    event.preventDefault();
    alert('search form submitted');
  }

  const [firstBannerImageState, setFirstBannerImageState] = useState(null);
  const [secondBannerImageState, setSecondBannerImageState] = useState(null);
  const [thirdBannerImageState, setThirdBannerImageState] = useState(null);
  const [mainBanners, setMainBanners] = useState([]);
  const [topCategories, setTopCategories] = useState([]);

  useEffect(()=>{
    axios.get(Constants.apiUrl + '/api/top-three-home-banners').then((res)=>{
      let response = res.data;
      if(response.status === 'done'){
        let banners = response.banners;
        setMainBanners(banners)
        //setFirstBannerImageState(banners[0]);
        //setSecondBannerImageState(banners[1]);
        //setThirdBannerImageState(banners[2]);
      }else if(response.status === 'failed'){
        console.warn(response.message);
        props.reduxUpdateSnackbar('warning', true, response.umessage);
      }
    }).catch((error)=>{
      console.log(error);
      props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
    });
  }, []);

  useEffect(() => {
    axios.get(Constants.apiUrl + '/api/top-six-categories').then((r) => { 
      let response = r.data; 
      if(response.status === 'done' && response.found === true){  
        setTopCategories(response.categories); 
      }else if(response.status === 'failed'){ 
        console.warn(response.message); 
        props.reduxUpdateSnackbar('warning', true, response.umessage); 
      }
    }).catch((e) => {
      console.error(e);
      props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
    });
  }, []);

  useEffect(() => {
    axios.post(Constants.apiUrl + '/api/filtered-paginated-new-products', {
      page: 1
    }).then((res) => {
      let response = res.data;
      if(response.status === 'done'){
        console.warn(response);
      }else if(response.status === 'failed'){
        console.warn("an error occured while getting information from server by the way");
      }
    }).catch((error) => {
      console.error(error);
      alert('مشکلی در برقراری ارتباط رخ داده است');
    });
  }, []);

  useEffect(() => {
    props.reduxUpdateUserTotally(props.ssrUser);
    if(props.ssrUser.status === 'LOGIN'){
      if(localStorage.getItem('user_cart') !== '[]' && localStorage.getItem('user_cart') !== undefined && localStorage.getItem('user_cart') !== null){
        axios.post(Constants.apiUrl + "/api/user-cart-change", {
          cart: JSON.parse(localStorage.getItem('user_cart')),
        }, {
          headers: {
            'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
          }
        }).then((res) => {
          let response = res.data;
          if(response.status === 'done'){ 
            let cartArray = [];
            console.warn(response.cart);
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
            localStorage.setItem('user_cart', '[]');
          }else if(response.status === 'failed'){
            console.warn(response.message);
            props.reduxUpdateSnackbar('warning', true, response.umessage);
          }
        }).catch((error) => {
          console.error(error);
          props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
        });
      }else{
        axios.post(Constants.apiUrl + "/api/user-cart", {},{
          headers: {
              'Authorization': 'Bearer ' + props.ssrCookies.user_server_token, 
          }
        }).then((res)=>{
            let response = res.data;
            if(response.status === 'done'){
                let cartArray = [];
                console.warn(response.cart);
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
      }
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
}, []);


  return (
    <React.Fragment>
      <Head>
          <title>هنری | تحقق رویای هنرمندانه تو</title>
          <link rel="icon" href={ Constants.baseUrl + "/favicon.ico"} type="image/x-icon"/>
      </Head>
      <Header home={true} menu={props.ssrMenu} />
      <div className={['container', 'ltr'].join(' ')}>
        <div className={['row', 'rtl', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pb-2', 'px-2', 'd-md-none', 'mt-2'].join(' ')}>
            <button className={['px-3', 'pointer', 'py-2'].join(' ')} style={{borderRadius: '16px', background: '#EAEAEA', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none'}}>دسته‌بندی محصولات</button>
            <a href='https://honari.com/academy' className={['px-3', 'py-2', 'pointer'].join(' ')} style={{borderRadius: '16px', background: '#EAEAEA', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none'}}>دوره‌های آنلاین</a>
            <Link href='/site/help'><a onClick={props.reduxStartLoading} className={['px-3', 'pointer', 'py-2'].join(' ')} style={{borderRadius: '16px', background: '#EAEAEA', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none'}}>راهنمای خرید</a></Link>
        </div>
        {
          mainBanners.length !== 0
          ?
          (
            <React.Fragment>
            <div className={['row', 'rtl', 'mt-0', 'mt-md-4', 'px-md-2', 'align-items-stretch'].join(' ')} style={{}}>
              <div className={['col-12', 'col-md-6', 'pr-0', 'pl-0', 'pl-md-2', ].join(' ')}>
                <Link href={mainBanners[0].anchor}><img src={'https://s4.uupload.ir/files/b1_gbk5.jpg' /*mainBanners[0].img*/} className={['pointer', 'shadow-sm'].join(' ')} style={{width: '100%', height: '100%', borderRadius: '4px'}} /></Link>
              </div>
              <div className={['col-12', 'col-md-6', 'pr-3', 'pl-md-0', 'd-flex', 'flex-row', 'flex-md-column'].join(' ')}>
                <div style={{flex: '1'}}>
                <Link href={mainBanners[1].anchor}><img src={'https://s4.uupload.ir/files/b2_efw.jpg' /*mainBanners[1].img*/} className={['pointer', 'mt-3', 'mt-md-0', 'shadow-sm'].join(' ')} style={{width: '100%', borderRadius: '4px'}} /></Link>
                </div>
                <div className={['ml-3', 'ml-md-0', 'mt-0', 'mt-md-2'].join(' ')} style={{flex: '1'}}>
                <Link href={mainBanners[2].anchor}><img src={'https://s4.uupload.ir/files/b2_efw.jpg'/*mainBanners[2].img*/} className={['pointer', 'mt-3', 'mt-md-4', 'mr-3', 'mr-md-0', 'shadow-sm'].join(' ')} style={{width: '100%', borderRadius: '4px'}} /></Link>
                </div>
              </div>
            </div>
          </React.Fragment>
          )
          :
          null
        }
        <div className={['row', 'rtl', 'mt-3', 'mt-md-4', 'px-md-2', styles.tripleBanner].join(' ')}>
          <div className={['col-12', 'd-flex', 'flex-row', 'justify-content-between', 'align-items-center', 'px-0', 'mx-0', 'py-2', 'shadow-sm'].join(' ')} style={{border: '1px solid #dedede', borderRadius: '4px'}}>
            <Link href='/site/help#delivery_type'><a onClick={props.reduxStartLoading} className={['d-flex', 'flex-column', 'flex-lg-row', 'justify-content-center', 'align-items-center'].join(' ')} style={{flex: '1'}}>
              <img src={Constants.baseUrl + '/assets/images/main_images/fast_delivery.png'} className={[styles.tripleBannerImage]} />
              <div className={['d-flex', 'flex-column', 'text-center', 'text-lg-right', 'pr-2', 'py-0'].join(' ')}>
                <h6 className={['mb-0', 'font-weight-bold', styles.tripleBannerTitle].join(' ')} style={{color: '#707070'}}>ارسال سریع</h6>
                <h6 className={['mb-0', 'mt-auto', 'font-weight-bold', styles.tripleBannerTitle].join(' ')}>به سراسر کشور</h6>
              </div>
            </a></Link>
            <Link href='/site/help#free_post'><a onClick={props.reduxStartLoading} className={['d-flex', 'flex-column', 'flex-lg-row', 'justify-content-center', 'align-items-center'].join(' ')} style={{flex: '1'}}>
              <img src={Constants.baseUrl + '/assets/images/main_images/free_delivery.png'} className={[styles.tripleBannerImage]} />
              <div className={['d-flex', 'flex-column', 'text-center', 'text-lg-right', 'pr-2', 'py-0'].join(' ')}>
                <h6 className={['mb-0', 'font-weight-bold', styles.tripleBannerTitle].join(' ')} style={{color: '#707070'}}>ارسال رایگان</h6>
                <h6 className={['mb-0', 'mt-auto', 'font-weight-bold', styles.tripleBannerTitle].join(' ')}> خرید بالای ۱۰۰ هزارتومان</h6>
              </div>
            </a></Link>
            <Link href='/site/help#return_product'><a className={['d-flex', 'flex-column', 'flex-lg-row', 'justify-content-center', 'align-items-center'].join(' ')} style={{flex: '1'}}>
              <img src={Constants.baseUrl + '/assets/images/main_images/return_delivery.png'} className={[styles.tripleBannerImage]} />
              <div className={['d-flex', 'flex-column', 'text-center', 'text-md-right', 'pr-2', 'py-0'].join(' ')}>
                <h6 className={['mb-0', 'font-weight-bold', styles.tripleBannerTitle].join(' ')} style={{color: '#707070'}}>امکان مرجوعی کالا</h6>
                <h6 className={['mb-0', 'mt-auto', 'font-weight-bold', styles.tripleBannerTitle].join(' ')}>بدون محدودیت زمانی</h6>
              </div>
            </a></Link>
          </div>
        </div>
        <div className={['row', 'mt-5', 'mb-2', 'rtl', 'align-items-stretch', 'px-2', 'd-flex', 'flex-column', 'justify-content-center'].join(' ')}>
          <h5 className={['pb-1', 'text-center', 'mb-0', 'align-self-center', 'd-none', 'd-md-block'].join(' ')} style={{borderBottom: '1px solid #00BAC6'}}>دسته محصولات پرطرفدار</h5>
          <h5 className={['pb-1', 'text-center', 'mb-0', 'align-self-center', 'font-weight-bold', 'd-md-none'].join(' ')} style={{borderBottom: '1px solid #00BAC6'}}>دسته محصولات پرطرفدار</h5>
          <div className={['col-12', 'mb-2', 'd-none', 'd-md-block'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
        </div>
        <div className={['row', 'px-2', 'px-md-0'].join(' ')}>
          {
            topCategories.map((category, index) => {
              return (
                <Link href={'/shop/product/category/' + category.categoryUrl}>
                  <a onClick={props.reduxStartLoading} className={['col-6', 'col-md-2', 'px-2', 'py-0', 'my-0', index >= 2 ? 'mt-3' : '' , 'mt-md-0'].join(' ')} style={{position: 'relative'}}>
                    <img src={category.categoryImage} style={{width: '100%'}} />
                    {/*<div className={['d-flex', 'pointer', 'flex-row', 'justify-content-center', 'align-items-center', 'shadow-sm'].join(' ')} style={{height: '200px', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' , border: '1px solid #dedede', borderRadius: '4px', background: 'url(' + category.categoryImage + ')'}}>
                      <div className={['d-flex', 'flex-column', 'align-items-center'].join(' ')}>
                        <h6 className={['w-100', 'rtl', 'text-center', 'm-0', 'px-1'].join(' ')} style={{fontSize: '24px', fontWeight: 'bold', color: 'white'}}>{category.categoryName}</h6>
                        <div className={['mt-2'].join(' ')} style={{height: '3px', width: '64px', background: 'white'}}></div>
                      </div>
                    </div> 
                    */}
                    <div className={[''].join(' ')} style={{position: 'absolute', borderRadius: '2px', backgroundColor: 'black', opacity: '0.2', top: '0', left: '0.5rem', right: '0.5rem', height: '100%'}}>

                    </div>
                    <div className={['d-flex', 'flex-column', 'align-items-center', 'justify-content-center'].join(' ')} style={{position: 'absolute', top: '0', left: '0.5rem', right: '0.5rem', height: '100%'}}>
                        <h6 className={['w-100', 'rtl', 'text-center', 'm-0', 'px-1'].join(' ')} style={{fontSize: '24px', fontWeight: 'bold', color: 'white'}}>{category.categoryName}</h6>
                        <div className={['mt-2'].join(' ')} style={{height: '3px', width: '64px', background: 'white'}}></div>
                    </div>
                  </a>
                </Link>
              );
            })
          }
        </div>
        <SpecialOffers />
      </div>
      <LatestCourses />
      <div className={['container'].join(' ')}>
        <NewProducts title='جدیدترین کالاها' />
      </div>
      <div className={['container', 'mt-5'].join(' ')}>
          <div className={['row', 'rtl'].join(' ')}>
            <div className={['col-12', 'col-md-6', 'd-flex', 'flex-row', 'pl-md-2'].join(' ')}>
              <a href='https://honari.com/academy' className={['d-flex', 'flex-row', 'rtl', 'w-100', 'pointer'].join(' ')} style={{borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                <div className={['d-flex', 'flex-column', 'p-2'].join(' ')} style={{flex: '1', background: '#F2F2F2'}}>
                  <h5 className={['text-right', 'rtl'].join(' ')}>هنری آکادمی</h5>
                  <h6 className={['text-right', 'rtl', 'mb-0'].join(' ')}>چی دوست داری یاد بگیری؟</h6>
                  <h6 className={['text-right', 'rtl'].join(' ')}>دسترسی به بهترین هنرمندان که یادگیری هنرهای جدید را آسان میکنند</h6>
                  <div className={['d-flex', 'flex-row', 'mt-auto', 'align-items-center', 'text-right', 'justify-content-right'].join(' ')}>
                    <h6 className={['mb-0', 'pl-2'].join(' ')} style={{color: '#00BAC6'}}>مشاهده کلاس‌ها</h6>
                    <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_main_small.png'} style={{width: '14px', height: '14px'}} />
                  </div>
                </div>
                <img src={Constants.baseUrl + '/assets/images/one.png'} style={{flex: '1'}} />
              </a>
            </div>
            <div className={['col-12', 'col-md-6', 'd-none', 'flex-row', 'pr-md-2', 'mt-3', 'mt-md-0', 'd-none'].join(' ')}>
              <a href='/site/help' className={['d-flex', 'flex-row', 'rtl', 'w-100', 'pointer'].join(' ')} style={{borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                <div className={['d-flex', 'flex-column', 'p-2'].join(' ')} style={{flex: '1', background: '#F2F2F2'}}>
                  <h5 className={['text-right', 'rtl'].join(' ')}>برای خرید به مشکل خوردید؟</h5>
                  <h6 className={['text-right', 'rtl', 'mb-0'].join(' ')}>راهنمای ثبت‌نام و خرید از وبسایت هنری</h6>
                  <div className={['d-flex', 'flex-row', 'mt-auto', 'align-items-center', 'text-right', 'justify-content-right'].join(' ')}>
                    <h6 className={['mb-0', 'pl-2'].join(' ')} style={{color: '#00BAC6'}}>مشاهده راهنما</h6>
                    <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_main_small.png'} style={{width: '14px', height: '14px'}} />
                  </div>
                </div>
                <img src={Constants.baseUrl + '/assets/images/two.png'} style={{flex: '1'}} />
              </a>
            </div>
            <div className={['col-12', 'col-md-6', 'd-flex', 'flex-row', 'pr-md-2', 'mt-3', 'mt-md-0'].join(' ')}>
              <a href='/site/help' className={['d-flex', 'flex-row', 'rtl', 'w-100', 'pointer'].join(' ')} style={{borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                <div className={['d-flex', 'flex-column', 'p-2'].join(' ')} style={{flex: '1', background: '#F2F2F2'}}>
                <h5 className={['text-right', 'rtl'].join(' ')}>برای خرید به مشکل خوردید؟</h5>
                  <h6 className={['text-right', 'rtl', 'mb-0'].join(' ')}>راهنمای ثبت‌نام و خرید از وبسایت هنری</h6>
                  <div className={['d-flex', 'flex-row', 'mt-auto', 'align-items-center', 'text-right', 'justify-content-right'].join(' ')}>
                    <h6 className={['mb-0', 'pl-2'].join(' ')} style={{color: '#00BAC6'}}>مشاهده راهنما</h6>
                    <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_main_small.png'} style={{width: '14px', height: '14px'}} />
                  </div>
                </div>
                <img src={Constants.baseUrl + '/assets/images/one.png'} style={{flex: '1'}} />
              </a>
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
      reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t}),
      reduxStartLoading: () => dispatch({type: actionTypes.START_LOADING}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

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
    console.log(await response.information);
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
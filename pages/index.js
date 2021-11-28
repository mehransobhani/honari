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

  const [firstBannerImageState, setFirstBannerImageState] = useState(['', '']);
  const [secondBannerImageState, setSecondBannerImageState] = useState(['', '']);
  const [thirdBannerImageState, setThirdBannerImageState] = useState(['', '']);

  const [sixNewProductsState, setSixNewProductsState] = useState([]);

  useEffect(()=>{
    axios.get(Constants.apiUrl + '/api/get-banners').then((response)=>{
      console.log(response);
        if(response.data.status === 'done'){
          setFirstBannerImageState([response.data.banners.firstImage, response.data.banners.firstAnchor]);
          setSecondBannerImageState([response.data.banners.secondImage, response.data.banners.secondAnchor]);
          setThirdBannerImageState([response.data.banners.thirdImage, response.data.banners.thirdAnchor]);
        }
    }).catch((error)=>{
      console.log(error);
    });
  }, []);

  useEffect(() => {
    console.warn(props.context);
  });

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
}, []);

  return (
    <React.Fragment>
      <Head>
        <title>هنری | تحقق رویای هنرمندانه‌ی تو</title>
      </Head>
      <Header home={true} />
      <div className={['container'].join(' ')}>
        <div className={['row', 'rtl', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pb-2', 'px-2', 'd-md-none'].join(' ')}>
            <button className={['px-3', 'pointer'].join(' ')} style={{height: '36px', borderRadius: '16px', background: '#EAEAEA', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none'}}>دسته‌بندی محصولات</button>
            <button className={['px-3', 'pointer'].join(' ')} style={{height: '36px', borderRadius: '16px', background: '#EAEAEA', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none'}}>دوره‌های آنلاین</button>
            <button className={['px-3', 'pointer'].join(' ')} style={{height: '36px', borderRadius: '16px', background: '#EAEAEA', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none'}}>راهنمای خرید</button>
        </div>
        <div className={['row', 'rtl', 'mt-0', 'mt-md-4', 'px-md-2', 'align-items-stretch'].join(' ')} style={{}}>
          <div className={['col-12', 'col-md-7', 'pr-0', 'pl-0', 'pl-md-2', ].join(' ')}>
            <Link href={secondBannerImageState[1]}><img src='/assets/images/f.jpg' className={['pointer', 'shadow-sm', styles.topThreeBanners].join(' ')} style={{width: '100%', height: '100%', borderRadius: '4px'}} /></Link>
          </div>
          <div className={['col-12', 'col-md-5', 'pl-3', 'pr-3', 'pr-md-3', 'pl-md-0', 'd-flex', 'flex-row', 'flex-md-column'].join(' ')}>
            <Link href={firstBannerImageState[1]}><img src='/assets/images/f.jpg' className={['pointer', 'mt-3', 'mt-md-0', 'shadow-sm', styles.topThreeBanners].join(' ')} style={{height: 'auto', width: '100%', flex: '1', borderRadius: '4px'}} /></Link>
            <Link href={thirdBannerImageState[1]}><img src='/assets/images/f.jpg' className={['pointer', 'mt-3', 'mt-md-4', 'mr-3', 'mr-md-0', 'shadow-sm', styles.topThreeBanners].join(' ')} style={{height: 'auto', width: '100%', flex: '1', borderRadius: '4px'}} /></Link>
          </div>
        </div>
        <div className={['row', 'rtl', 'mt-3', 'mt-md-4', 'px-md-2', styles.tripleBanner].join(' ')}>
          <div className={['col-12', 'd-flex', 'flex-row', 'justify-content-between', 'align-items-center', 'px-0', 'mx-0', 'py-2', 'shadow-sm'].join(' ')} style={{border: '1px solid #dedede', borderRadius: '4px'}}>
            <div className={['d-flex', 'flex-column', 'flex-lg-row', 'justify-content-center', 'align-items-center'].join(' ')} style={{flex: '1'}}>
              <img src='/assets/images/main_images/fast_delivery.png' className={[styles.tripleBannerImage]} />
              <div className={['d-flex', 'flex-column', 'text-center', 'text-lg-right', 'pr-2', 'py-0'].join(' ')}>
                <h6 className={['mb-0', 'font-weight-bold', styles.tripleBannerTitle].join(' ')} style={{color: '#707070'}}>ارسال سریع</h6>
                <h6 className={['mb-0', 'mt-auto', 'font-weight-bold', styles.tripleBannerTitle].join(' ')}>به سراسر کشور</h6>
              </div>
            </div>
            <div className={['d-flex', 'flex-column', 'flex-lg-row', 'justify-content-center', 'align-items-center'].join(' ')} style={{flex: '1'}}>
              <img src='/assets/images/main_images/free_delivery.png' className={[styles.tripleBannerImage]} />
              <div className={['d-flex', 'flex-column', 'text-center', 'text-lg-right', 'pr-2', 'py-0'].join(' ')}>
                <h6 className={['mb-0', 'font-weight-bold', styles.tripleBannerTitle].join(' ')} style={{color: '#707070'}}>ارسال رایگان</h6>
                <h6 className={['mb-0', 'mt-auto', 'font-weight-bold', styles.tripleBannerTitle].join(' ')}> خرید بالای ۱۰۰ هزارتومان</h6>
              </div>
            </div>
            <div className={['d-flex', 'flex-column', 'flex-lg-row', 'justify-content-center', 'align-items-center'].join(' ')} style={{flex: '1'}}>
              <img src='/assets/images/main_images/free_delivery.png' className={[styles.tripleBannerImage]} />
              <div className={['d-flex', 'flex-column', 'text-center', 'text-md-right', 'pr-2', 'py-0'].join(' ')}>
                <h6 className={['mb-0', 'font-weight-bold', styles.tripleBannerTitle].join(' ')} style={{color: '#707070'}}>امکان مرجوعی کالا</h6>
                <h6 className={['mb-0', 'mt-auto', 'font-weight-bold', styles.tripleBannerTitle].join(' ')}>بدون محدودیت زمانی</h6>
              </div>
            </div>
          </div>
        </div>
        <div className={['row', 'mt-5', 'mb-2', 'rtl', 'align-items-stretch', 'px-2', 'd-flex', 'flex-column', 'justify-content-center'].join(' ')}>
          <h5 className={['pb-1', 'text-center', 'mb-0', 'align-self-center'].join(' ')} style={{borderBottom: '1px solid black'}}>دسته محصولات پرطرفدار</h5>
          <div className={['col-12', 'mb-2', 'd-none', 'd-md-block'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
        </div>
        <div className={['row', 'px-2', 'px-md-0'].join(' ')}>
          <div className={['col-6', 'col-md-2', 'px-2', 'py-0', 'my-0'].join(' ')}>
            <div className={['d-flex', 'pointer', 'flex-row', 'justify-content-center', 'align-items-center', 'shadow-sm'].join(' ')} style={{height: '200px', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' , border: '1px solid #dedede', borderRadius: '4px', background: 'url(/assets/images/banner_images/banner_thread.jpg)'}}>
              <div className={['d-flex', 'flex-column', 'align-items-center'].join(' ')}>
                <h6 className={['w-100', 'rtl', 'text-center', 'm-0', 'px-1'].join(' ')} style={{fontSize: '24px', fontWeight: 'bold', color: 'white'}}>انواع نخ</h6>
                <div className={['mt-2'].join(' ')} style={{height: '3px', width: '64px', background: 'white'}}></div>
              </div>
            </div> 
          </div>
          <div className={['col-6', 'col-md-2', 'px-2', 'py-0', 'my-0'].join(' ')}>
            <div className={['d-flex', 'pointer', 'flex-row', 'justify-content-center', 'align-items-center', 'shadow-sm'].join(' ')} style={{height: '200px', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' , border: '1px solid #dedede', borderRadius: '4px', background: 'url(/assets/images/banner_images/banner_thread.jpg)'}}>
              <div className={['d-flex', 'flex-column', 'align-items-center'].join(' ')}>
                <h6 className={['w-100', 'rtl', 'text-center', 'm-0', 'px-1'].join(' ')} style={{fontSize: '24px', fontWeight: 'bold', color: 'white'}}>انواع نخ</h6>
                <div className={['mt-2'].join(' ')} style={{height: '3px', width: '64px', background: 'white'}}></div>
              </div>
            </div> 
          </div>
          <div className={['col-6', 'col-md-2', 'px-2', 'py-0', 'my-0', 'mt-3', 'mt-md-0'].join(' ')}>
            <div className={['d-flex', 'pointer', 'flex-row', 'justify-content-center', 'align-items-center', 'shadow-sm'].join(' ')} style={{height: '200px', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' , border: '1px solid #dedede', borderRadius: '4px', background: 'url(/assets/images/banner_images/banner_thread.jpg)'}}>
              <div className={['d-flex', 'flex-column', 'align-items-center'].join(' ')}>
                <h6 className={['w-100', 'rtl', 'text-center', 'm-0', 'px-1'].join(' ')} style={{fontSize: '24px', fontWeight: 'bold', color: 'white'}}>انواع نخ</h6>
                <div className={['mt-2'].join(' ')} style={{height: '3px', width: '64px', background: 'white'}}></div>
              </div>
            </div> 
          </div>
          <div className={['col-6', 'col-md-2', 'px-2', 'py-0', 'my-0', 'mt-3', 'mt-md-0'].join(' ')}>
            <div className={['d-flex', 'pointer', 'flex-row', 'justify-content-center', 'align-items-center', 'shadow-sm'].join(' ')} style={{height: '200px', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' , border: '1px solid #dedede', borderRadius: '4px', background: 'url(/assets/images/banner_images/banner_thread.jpg)'}}>
              <div className={['d-flex', 'flex-column', 'align-items-center'].join(' ')}>
                <h6 className={['w-100', 'rtl', 'text-center', 'm-0', 'px-1'].join(' ')} style={{fontSize: '24px', fontWeight: 'bold', color: 'white'}}>انواع نخ</h6>
                <div className={['mt-2'].join(' ')} style={{height: '3px', width: '64px', background: 'white'}}></div>
              </div>
            </div> 
          </div>
          <div className={['col-6', 'col-md-2', 'px-2', 'py-0', 'my-0', 'd-none', 'd-md-block'].join(' ')}>
            <div className={['d-flex', 'pointer', 'flex-row', 'justify-content-center', 'align-items-center', 'shadow-sm'].join(' ')} style={{height: '200px', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' , border: '1px solid #dedede', borderRadius: '4px', background: 'url(/assets/images/banner_images/banner_thread.jpg)'}}>
              <div className={['d-flex', 'flex-column', 'align-items-center'].join(' ')}>
                <h6 className={['w-100', 'rtl', 'text-center', 'm-0', 'px-1'].join(' ')} style={{fontSize: '24px', fontWeight: 'bold', color: 'white'}}>انواع نخ</h6>
                <div className={['mt-2'].join(' ')} style={{height: '3px', width: '64px', background: 'white'}}></div>
              </div>
            </div> 
          </div>
          <div className={['col-6', 'col-md-2', 'px-2', 'py-0', 'my-0', 'd-none', 'd-md-block'].join(' ')}>
            <div className={['d-flex', 'pointer', 'flex-row', 'justify-content-center', 'align-items-center', 'shadow-sm'].join(' ')} style={{height: '200px', backgroundPositionX: 'center', backgroundPositionY: 'center', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat, no-repeat' , border: '1px solid #dedede', borderRadius: '4px', background: 'url(assets/images/banner_images/banner_thread.jpg)'}}>
                <div className={['d-flex', 'flex-column', 'align-items-center'].join(' ')}>
                  <h6 className={['w-100', 'rtl', 'text-center', 'm-0', 'px-1'].join(' ')} style={{fontSize: '24px', fontWeight: 'bold', color: 'white'}}>انواع نخ</h6>
                  <div className={['mt-2'].join(' ')} style={{height: '3px', width: '64px', background: 'white'}}></div>
                </div>
            </div>
          </div>            
        </div>
        <SpecialOffers />
      </div>
      <LatestCourses />
      <div className={['container'].join(' ')}>
          <NewProducts title='جدیدترین کالاها' />
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
      reduxUpdateUserTotally: (d) => dispatch({type: actionTypes.UPDATE_USER_TOTALLY, data: d})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

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


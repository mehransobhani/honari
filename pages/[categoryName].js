import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import axios from 'axios';
import {useRouter} from 'next/router';
import RootCategory from '../components/RootCategory/RootCategory';
import Head from 'next/head';
import * as Constants from '../components/constants';
import {connect} from 'react-redux';
import * as actionTypes from '../store/actions';
import styles from './categoryName.module.css';
import parse from 'html-react-parser'
import Link from 'next/link';
import TopSixProducts from '../components/TopSixProducts/TopSixProducts';

const CategoryLandingPage = (props) => {

    const router = useRouter();
    const {categoryName} = router.query;
    const [pageTitle, setPageTitle] = useState('');
    const [component, setComponent] = useState(null);
    const [artInformation, setArtInformation] = useState(null);
    const categories = useRef(null)

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
        if(props.ssrArtInfo.status === 'done'){
            setArtInformation(props.ssrArtInfo.result);
        }else{
            alert('آدرس وارد شده اشتباه است');
        }
    }, [props.reduxUser.status, 'NI']);

    /*useEffect(()=>{
        
        if(categoryName !== undefined){
            axios.post(Constants.apiUrl + '/api/art-information', {
                url: categoryName
            }).then((res) => {
                let response = res.data;
                console.warn(response);
                if(response.status === 'done'){
                    setArtInformation(response.result);
                }else if(response.status === 'failed'){
                    console.warn(response.message);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
            }).catch((err) => {
                console.error(err);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            });
            setComponent(null);
        }
    }, [categoryName, undefined]);*/

    const ArtComponent = () => {
        if(artInformation !== null){
            return (
                <React.Fragment>
                    <div className={['container'].join(' ')}>
                        <div className={['row', 'rtl',' mt-3', 'mt-md-4', 'px-2', 'align-items-stretch'].join(' ')}>
                            <div className={['col-12', 'col-md-4', 'px-2', 'px-md-0', 'pl-md-2'].join(' ')}>
                                <div className={['d-flex', 'flex-column', 'p-3', 'shadow-sm'].join(' ')} style={{border: '1px solid #dedede', height: '100%', borderRadius: '4px'}}>
                                    <div className={['d-flex', 'flex-row'].join(' ')}>
                                        <h1 className={['my-0', 'pr-2', 'rtl', 'text-right'].join(' ')} style={{fontSize: '42px'}} >{artInformation.name}</h1>
                                    </div>
                                    <p className={['my-0', 'text-right', 'pt-3'].join(' ')}>{''}</p>
                                    <div className={['rtl', 'text-right', 'artpage-description-div'].join(' ')} style={{maxHeight: '200px', overflowY: 'scroll'}}>
                                        {parse(artInformation.description)}
                                    </div>
                                    <div className={['d-flex', 'flex-row', 'rtl', 'mt-auto', 'align-items-center', 'justify-content-center', 'w-100', 'mr-0'].join(' ')} onClick={()=>{categories.current.scrollIntoView()}}>
                                        <img src={Constants.baseUrl + '/assets/images/main_images/down_arrow_main.png'} style={{width: '14px', borderRadius: '4px'}} />
                                        <h6 className={['my-0', 'pr-1', 'pointer', 'font-weight-bold'].join(' ')} style={{color: '#00bac6'}} ref={categories}>دسته‌بندی محصولات</h6>
                                    </div>
                                </div>
                            </div>
                            <div className={['col-12', 'col-md-8', 'px-2', 'p-md-0', 'pr-md-2', 'mt-3', 'mt-md-0'].join(' ')}>
                                <img src={'https://honari.com/image/art_banners/' + artInformation.image} style={{width: '100%', height: '100%', maxHeight: '400px', borderRadius: '4px'}} />
                            </div>
                        </div>
                        {
                            artInformation.banners.length !== 0
                            ?
                            (
                                <div className={['row', 'rtl', 'mt-5', 'px-1'].join(' ')}>
                                    <div className={['col-12', 'd-flex', 'flex-column', 'px-md-1'].join(' ')}>
                                        <div className={['d-flex', 'flex-row'].join(' ')}>
                                            <h5 className={['pb-2', 'mb-0', 'font-weight-bold', 'd-none', 'd-md-block'].join(' ')} style={{borderBottom: '1px solid #00BAC6'}}>{' دسته‌بندی محصولات '}</h5>
                                        </div>
                                        <div style={{height: '1px', width: '100%', backgroundColor: '#dedede'}}></div>
                                    </div>
                                </div>
                            )
                            :
                            null
                            }
                        <div className={['row', 'rtl', 'px-2', 'px-md-0', 'd-flex', 'align-items-stretch'].join(' ')}>
                            {
                                artInformation !== null ?
                                (
                                    artInformation.banners.map((banner, counter)=>{
                                        return(
                                            <Link key={counter} href={banner.anchor}>
                                                <a className={['col-6', 'col-md-2', 'px-2', 'mt-3'].join(' ')}>
                                                    <div className={['d-flex', 'flex-column', 'pointer', 'shadow-sm'].join(' ')} style={{border: '1px solid #dedede', borderRadius: '4px', height: '100%'}} onClick={props.clicked}>
                                                        <img src={banner.img} style={{width: '100%', height: 'auto', borderRadius: '4px 4px 0 0'}} />
                                                        {/*<h6 className={['my-3', 'text-right', 'mx-2', 'font-weight-bold'].join(' ')}>{props.name}</h6>*/}
                                                    </div>            
                                                </a>
                                            </Link>
                                        );
                                    })
                                )
                                : 
                                null
                            }
                        </div>
                        {
                            //sixNewProducts.length !== 0 ? <TopSixProducts title='جدیدترین کالاها' entries={sixNewProducts} /> : null
                        }
                        
                    </div>
                    <div className={['container-fluid', 'mt-5', 'py-5', 'd-none'].join(' ')} style={{backgroundColor: '#f0efd8'}}>
                        <div className={['container', 'px-0', 'pb-3'].join(' ')}>
                            <div className={['row', 'rtl'].join(' ')}>
                                <div className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-center', 'mt-3'].join(' ')}>
                                    <img src={Constants.baseUrl + '/assets/images/main_images/scissors_black.png'} style={{width: '20px'}} />
                                    <h5 className={['mb-0', 'mr-1'].join(' ')}>جدیدترین آموزش‌ها</h5>
                                </div>
                            </div>
                            <div className={['row', 'rtl', 'py-2', 'px-3'].join(' ')}>
                                <div className={['col-12', 'col-md-6', 'px-2'].join(' ')}>
                                    <div className={['rounded', 'd-flex', 'flex-column', 'flex-md-row', 'pointer', 'shadow-sm'].join(' ')} style={{border: '1px solid #dedede'}}>
                                        <div style={{flex: '1.3'}}>
                                            <img src={Constants.baseUrl + '/assets/images/banner_images/banner_leather.jpg'} className={[styles.firstCourseImage].join(' ')} style={{width: '100%', height: '100%'}} />
                                        </div>
                                        <div className={['d-flex', 'flex-column', 'rounded-left', 'p-2', styles.firstCourseInfoBody].join(' ')} style={{flex: '2', backgroundColor: 'white'}}>
                                            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'p-1'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/college_hat_white.png'} className={['p-1'].join(' ')} style={{width: '26px', borderRadius: '0 4px 4px 0', backgroundColor: '#00bac6'}} />
                                                <p className={['text-white', 'font-weight-bold', 'mr-0', 'mb-0', 'p-1'].join(' ')} style={{fontSize: '12px', borderRadius: '4px 0 0 4px', backgroundColor: '#00bac6'}}>دوره آنلاین</p>
                                            </div>
                                            <h6 className={['mb-0','mr-1', 'text-right', 'mt-3'].join(' ')}>آموزش مقدماتی چرم دوزی</h6>
                                            <div className={['d-flex', 'flex-row', 'mt-2', 'mb-0'].join(' ')}>
                                                <p className={['px-2', 'py-1', 'mr-1', 'mb-2'].join(' ')} style={{backgroundColor: '#F2F2F2', borderRadius: '4px'}}>۲۳۰,۰۰۰ تومان</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={['col-12', 'col-md-6', 'px-2'].join(' ')}>
                                    <div className={['rounded', 'd-flex', 'flex-row', 'mt-4', 'mt-md-0', 'pointer', 'shadow-sm'].join(' ')} style={{border: '1px solid #dedede'}}>
                                        <div style={{flex: '1.3'}}>
                                            <img src={Constants.baseUrl + '/assets/images/banner_images/banner_leather.jpg'} className={[styles.firstCourseImage].join(' ')} style={{width: '100%', height: '100%'}} />
                                        </div>
                                        <div className={['d-flex', 'flex-column', 'rounded-left', 'p-2', styles.firstCourseInfoBody].join(' ')} style={{flex: '2', backgroundColor: 'white'}}>
                                            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'p-1'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/college_hat_white.png'} className={['p-1'].join(' ')} style={{width: '26px', borderRadius: '0 4px 4px 0', backgroundColor: '#00bac6'}} />
                                                <p className={['text-white', 'font-weight-bold', 'mr-0', 'mb-0', 'p-1'].join(' ')} style={{fontSize: '12px', borderRadius: '4px 0 0 4px', backgroundColor: '#00bac6'}}>دوره آنلاین</p>
                                            </div>
                                            <h6 className={['mb-0','mr-1', 'text-right', 'mt-3'].join(' ')}>آموزش مقدماتی چرم دوزی</h6>
                                            <div className={['d-flex', 'flex-row', 'mt-2', 'mb-0'].join(' ')}>
                                                <p className={['px-2', 'py-1', 'mr-1', 'mb-2'].join(' ')} style={{backgroundColor: '#F2F2F2', borderRadius: '4px'}}>۲۳۰,۰۰۰ تومان</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                        </div>
                    </div>
                    <div className={['container'].join(' ')}>
                        <TopSixProducts moreUrl={'/shop/product/category/' + artInformation.categoryUrl} entries={artInformation.topSixProducts} title='جدیدترین کالاها' />
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
                        
                </React.Fragment>
            );
        }else{
            return null;
        }
    };

    return(
        <React.Fragment>
            <Header menu={props.ssrMenu} />
            <Head>
                {
                    artInformation !== null
                    ?
                        <title>{artInformation.title}</title>
                    :
                    null
                }
            </Head>
            {
                artInformation !== null
                ?
                ArtComponent()
                :
                null
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
        reduxAddToCart: (d) => dispatch({type: actionTypes.ADD_TO_CART, data: d}),
        reduxIncreaseCountByOne: (d) => dispatch({type: actionTypes.INCREASE_COUNT_BY_ONE, productId: d}),
        reduxDecreaseCountByOne: (d) => dispatch({type: actionTypes.DECREASE_COUNT_BY_ONE, productId: d}),
        reduxRemoveFromCart: (d) => dispatch({type: actionTypes.REMOVE_FROM_CART, productId: d}),
        reduxWipeCart: () => dispatch({type: actionTypes.WIPE_CART}),
        reduxUpdateUserTotally: (d) => dispatch({type: actionTypes.UPDATE_USER_TOTALLY, data: d}),
        reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t}),
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(CategoryLandingPage);
  
  export async function getServerSideProps(context){
    let url = context.req.url.substr(1);
    let newUrl = '';
    url = decodeURI(url);
    let slashCount = 0;
    if(url.charAt(0) === '_' && url.charAt(1) === 'n' && url.charAt(2) === 'e' && url.charAt(3) === 'x' && url.charAt(4) === 't'){
        let collect = true;
        for(let i=0; i<url.length; i++){
            if(url.charAt(i) === '.' && url.charAt(i+1) === 'j' && url.charAt(i+2) === 's' && url.charAt(i+3) === 'o' && url.charAt(i+4) === 'n'){
                collect = false;
            }
            if(slashCount < 3 && url.charAt(i) === '/' && collect){
                slashCount++;
            }else if(slashCount >= 3 && collect){
                newUrl += url.charAt(i);
            }
        }
        if(newUrl.length !== 0){
            url = newUrl;
        }
    }
    const artInfo = await fetch(Constants.apiUrl + '/api/art-information', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({url: url})
    });
    let result = await artInfo.json();
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
                  ssrMenu: await menu,
                  ssrArtInfo: await result
              }
          }
      }else{
          return {
              props: {
                  ssrUser: {status: 'GUEST', information: {}},
                  ssrCookies: context.req.cookies,
                  ssrMenu: await menu,
                  ssrArtInfo: await result
              }
          }
      }
        
    }else{
      console.log("DOES NOT HAVE ANY COOKIES");
      return{
          props: {
              ssrUser: {status: 'GUEST', information: {}},
              ssrCookies: context.req.cookies,
              ssrMenu: await menu,
              ssrArtInfo: await result
          }
      };
    }
}
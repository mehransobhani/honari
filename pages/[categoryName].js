import React, { useEffect, useState } from 'react';
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
            /*alert(categoryName);
            switch(categoryName){
                case 'چرم-دوزی':
                    setPageTitle('حرفه‌ای چرم دوزی کنید | هنری');
                    setComponent(<RootCategory id={1} name='چرم دوزی' route={'charm'} />);
                    break;
                case 'نمد-دوزی':
                    setPageTitle('نمد دوزی | کاردستی نمدی با الگو کیف نمدی، عروسک و... | هنری');
                    setComponent(<RootCategory id={10} name='نمد دوزی' route={'namad'} />);
                    break;
                case 'نقاشی-دکوراتیو-پتینه':
                    setPageTitle('پتینه کاری | آموزش پتینه روی چوب ،سفال ،شیشه و ... | هنری');
                    setComponent(<RootCategory id={94} name='نقاشی دکوراتیو' route={'painting'} />);
                    break;
                case 'نقاشی-روی-شیشه-ویترای' :
                    setPageTitle('نقاشی روی شیشه یا ویترای | هنری');
                    setComponent(<RootCategory id={95} name='نقاشی روی شیشه' route={'vitray'} />);
                    break;
                case 'نقاشی-روی-پارچه' :
                    setPageTitle('نقاشی روی پارچه | لوازم و ابزار ، تکنیک ها وطرح های نقاشی روی پارچه | هنری');
                    setComponent(<RootCategory id={117} name='نقاشی روی پارچه' route={'naghashi-parch'} />);
                    break;
                case 'معرق-کاشی' :
                    setPageTitle('آموزش معرق کاشی ، آموزش کاشی شکسته ، مواد و ابزار معرق کاشی | هنری');
                    setComponent(<RootCategory id={149} name='معرق کاشی' route={'kashi-taziini-kochak'} />);
                    break;
                case 'روبان-دوزی' :
                    setPageTitle('روبان دوزی | روبان دوزی به سبک جدید | هنری');
                    setComponent(<RootCategory id={156} name='روبان دوزی' route={'ribbon'} />);
                    break;
                case 'مکرومه-بافی' :
                    setPageTitle('مکرومه بافی | هنری');
                    setComponent(<RootCategory id={203} name='مکرومه بافی' route={'baftani'} />);
                    break;
                case 'زیورآلات' :
                    setPageTitle('زیورآلات دست ساز دلخواهت رو بساز | هنری');
                    setComponent(<RootCategory id={310} name='زیورآلات' route={'zivar_alat'} />);
                    break;
                case 'شماره-دوزی' :
                    setPageTitle('آموزش شماره دوزی الگو و پترن و خرید نخ و پارچه دمسه گلدوزی | هنری');
                    setComponent(<RootCategory id={321} name='شماره دوزی' route={'shomaredozi'} />);
                    break;
                case 'کچه-دوزی' :
                    setPageTitle('کچه دوزی | هنری');
                    setComponent(<RootCategory id={290} name='کچه دوزی' route={'namad/namad_dozi_kache_dozi'} />);
                    break;
                case 'جواهردوزی' :
                    setPageTitle('جواهر دوزی | هنری');
                    setComponent(<RootCategory id={835} name='جواهردوزی' route={'zivar_alat/bead-embroidery'} />);
                    break;
                case '' :
                    setPageTitle('');
                    setComponent(<RootCategory id={94} name='نقاشی دکوراتیو' route={'painting'} />);
                    break;
            }*/
        }
    }, [categoryName, undefined]);

    const ArtComponent = () => {
        if(artInformation !== null){
            return (
                <React.Fragment>
                    <div className={['container'].join(' ')}>
                        <div className={['row', 'rtl',' mt-3', 'mt-md-4', 'px-2', 'align-items-stretch'].join(' ')}>
                            <div className={['col-12', 'col-md-4', 'px-2', 'px-md-0', 'pl-md-2'].join(' ')}>
                                <div className={['d-flex', 'flex-column', 'p-3', 'shadow-sm'].join(' ')} style={{border: '1px solid #dedede', height: '100%', borderRadius: '4px'}}>
                                    <div className={['d-flex', 'flex-row'].join(' ')}>
                                        <h1 className={['my-0', 'pr-2', 'rtl', 'text-right'].join(' ')} style={{fontSize: '32px'}} >{artInformation.name}</h1>
                                    </div>
                                    <p className={['my-0', 'text-right', 'pt-3'].join(' ')}>{''}</p>
                                    <div className={['rtl', 'text-right'].join(' ')} style={{maxHeight: '200px', overflowY: 'scroll'}}>
                                        {parse(artInformation.description)}
                                    </div>
                                    <div className={['d-flex', 'flex-row', 'rtl', 'mt-4', 'align-items-center', 'w-100', 'mr-0'].join(' ')}>
                                        <img src={Constants.baseUrl + '/assets/images/main_images/down_arrow_main.png'} style={{width: '14px', borderRadius: '4px'}} />
                                        <h6 className={['my-0', 'pr-1', 'pointer', 'font-weight-bold'].join(' ')} style={{color: '#00bac6'}}>دسته‌بندی محصولات</h6>
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
                                            <h5 className={['pb-2', 'mb-0', 'font-weight-bold', 'd-none', 'd-md-block'].join(' ')} style={{borderBottom: '1px solid black'}}>{' دسته‌بندی محصولات '}</h5>
                                            <h5 className={['pb-2', 'mb-0', 'd-block', 'd-md-none', 'font-weight-bold'].join(' ')}>{' دسته محصولات '}</h5>
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
                    <div className={['container-fluid', 'mt-5', 'py-5'].join(' ')} style={{backgroundColor: '#f0efd8'}}>
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
                        <TopSixProducts entries={artInformation.topSixProducts} title='جدیدترین کالاها' />
                    </div>
                        
                </React.Fragment>
            );
        }else{
            return null;
        }
    };

    return(
        <React.Fragment>
            <Header />
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
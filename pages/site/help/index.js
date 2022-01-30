import React, { useEffect } from 'react';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import axios from 'axios';
import Head from 'next/head';
import * as actionTypes from '../../../store/actions';
import {connect} from 'react-redux';
import * as Constants from '../../../components/constants';

const Help = (props) => {

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
                <title>راهنما | هنری</title>
            </Head>
            <Header menu={props.ssrMenu} />
            <div className={['container'].join(' ')}>
                <div className={['row'].join(' ')}>
                    <div className={['col-12', 'text-center', 'mt-3'].join(' ')}>
                        <h2 className={['text-right', 'rtl', 'text-danger'].join(' ')} style={{fontSize: '17px'}} id='return_product'>- امکان مرجوع کالا بدون محدودیت</h2>
                        <p className={['text-right', 'rtl', 'mb-1'].join(' ')} style={{fontSize: '16px'}}>همه‌ی تلاش ما این است که کالای خریداری شده در شرایط مطلوب به دست ما برسد، با وجود این ممکن است پس از خرید به هر دلیلی تصمیم به بازگرداندن کالا بگیرید. ما این امکان را برای شما در نظر گرفته‌ایم که با آسودگی خاطر در مدت ۱۰ روز بعد از دریافت کالا، برای بازگرداندن آن با هزینه خود اقدام نمایید. کالا باید در شرایط اولیه همراه با بسته‌بندی و لیبل بدون آسیب دیدگی و پارگی باشد. در صورت بازشدن پلمپ کالا امکان مرجوع کردن آن وجود ندارد. </p>
                        <p className={['text-right', 'rtl', 'mb-5'].join(' ')} style={{fontSize: '16px'}}>توجه : کالاهایی که به دلیل ماهیت خاص و نوع دسته‌بندی امکان تشخیص در استفاده محصول نیست، امکان مرجوع کردن ندارند، مانند : سیم چین</p>
                        
                        <h2 className={['text-right', 'rtl'].join(' ')} style={{color: '#00BAC6', fontSize: '17px'}}>روند رسیدگی به درخواست مرجوعی کالا چگونه است؟</h2>
                        <p className={['text-right', 'rtl', 'mb-1'].join(' ')} style={{fontSize: '16px'}}>پس از بررسی علت مرجوعی توسط کارشناسان خدمت پس از فروش هماهنگی های الزم با شما جهت مرجوع وجه صورت میگیرد، لازم به ذکر است که امکان تعویض کالا وجود ندارد و شما میتوانید پس از مرجوع وجه مجدد خرید خود را انجام دهید. </p>
                        <p className={['text-right', 'rtl', 'mb-1'].join(' ')} style={{fontSize: '16px'}}>هزینه‌ی کالای مرجوع شده بعد از دریافت محصول و بررسی توسط کارشناسان هنری طی ۲ روز کاری به حساب شما واریز میگردد.</p>
                        <p className={['text-right', 'rtl', 'mb-5'].join(' ')} style={{fontSize: '16px'}}>درصورت تمایل برای واریز وجه به حساب بانکی، میتوانید از منوی کاربری درخواست تسویه حساب نمایید.</p>

                        <h2 className={['text-right', 'rtl'].join(' ')} style={{fontSize: '17px', color: '#00BAC6'}}>چطور میتونم بدون برقراری تماس، درخواست مرجوعی کالای خریداری شده را اعلام کنم؟</h2>
                        <p className={['text-right', 'rtl', 'mb-5'].join(' ')} style={{fontSize: '16px'}}>شما میتوانید وارد پروفایل خود شوید و از قسمت درخواست مرجوعی، فرم درخواست را تکمیل کنید.</p>
                        
                        <h2 className={['text-right', 'rtl'].join(' ')} style={{fontSize: '17px', color: '#00BAC6'}}>اگر کالای خریداری شده ایراد یا مغایرت داشته باشد باید چگونه اقدام کنم؟</h2>
                        <p className={['text-right', 'rtl', 'mb-1'].join(' ')} style={{fontSize: '16px'}}>وجود مغایرت یا کسری کالا،‌باید طی ۲۴ ساعت کاری پس از دریافت کالا، از طریق ثبت درخواست نقص سفارش در بخش سفارش‌های من اطلاع داده شود.</p>
                        <p className={['text-right', 'rtl', 'mb-1'].join(' ')} style={{fontSize: '16px'}}>اگر ایراد، وجود مغایرت یا آسیب‌دیدگی ظاهری، به تایید کارشناسان خدمات پس از فروش هنری برسد، هزینه‌ی ارسال و مرجوع کردن کالا به عهده هنری است.</p>
                        <p className={['text-right', 'rtl', 'mb-5'].join(' ')} style={{fontSize: '16px'}}>توجه داشته باشید که عکاسی از محصولات توسط بهترین تجهیزات عکاسی انجام میشود. اما با توجه به متفاوت بودن کیفیت و تنظیمات مانیتورها ممکن است تفاوت اندکی در رنگ و ... وجود داشته باشد که این اختلاف مغایرت محسوب نمیشود.</p>
                    
                        <h2 className={['text-right', 'rtl'].join(' ')} style={{fontSize: '17px', color: '#00BAC6'}} id='delivery_type'>کالا را چگونه ارسال کنم؟</h2>
                        <p className={['text-right', 'rtl', 'mb-1'].join(' ')} style={{fontSize: '16px'}}>لطفا قبل از هر اقدامی با کارشناسان پشتیبانی هنری تماس بگیرید و درخواست مرجوعی خود را در سایت و در بخش سفارش‌های من ثبت کنید.</p>
                        <p className={['text-right', 'rtl', 'mb-1'].join(' ')} style={{fontSize: '16px'}}>از ارسال کالا بدون هماهنگی با پشتیبانی هنری جدا خودداری کنید</p>
                        <p className={['text-right', 'rtl', 'mb-1'].join(' ')} style={{fontSize: '16px'}}>برای ارسال، کالا باید در جعبه یا کارتن اصلی خود به خوبی بسته‌بندی شود.</p>
                        <p className={['text-right', 'rtl', 'mb-1'].join(' ')} style={{fontSize: '16px'}}>کالا باید به انبار هنری واقع در کیلومتر ۱۰ جاده مخصوص کرج ارسال شود.</p>
                        <p className={['text-right', 'rtl', 'mb-5'].join(' ')} style={{fontSize: '16px'}}>دریافت کالاهایی که ایراد، وجود مغایرت، یا آسیب‌دیدگی ظاهری آنها توسط کارشناسان خدمات پس از فروش ما تایید شده باشد، به عهده هنری است و درصورتی که خود مشتری اقدام به ارسال محصول نماید هزینه‌ی ارسال توسط پست سفارشی صرفا عودت داده میشود.</p>
                    
                        <h2 className={['text-right', 'rtl', 'text-danger'].join(' ')} style={{fontSize: '17px'}} id='free_post'>- ارسال رایگان سفارشات</h2>
                        <p className={['text-right', 'rtl', 'mb-1'].join(' ')} style={{fontSize: '17px'}}>کلیه سفارشات پست و پیک که مجموع سبدخرید آنها بیش از ۲۵۰ هزارتومان باشد به صورت رایگان ارسال میشود. پست پیشتاز شامل ارسال رایگان نمیشود.</p>
                        <p className={['text-right', 'rtl', 'mb-1'].join(' ')} style={{fontSize: '16px'}}>ارسال سریع ارسال در شهر تهران با پیک انجام میشود و زمان رسیدن سفارش توسط شما انتخاب شده و در بازه انتخابی به دست شما میرسد.</p>
                        <p className={['text-right', 'rtl', 'mb-1'].join(' ')} style={{fontSize: '16px'}}>ارسال در سایر شهرهای ایران به انتخاب شما توسط پست سفارشی، پیشتاز و ارسال سریع انجام میشود.</p>
                        <p className={['text-right', 'rtl', 'mb-5'].join(' ')} style={{fontSize: '16px'}}>ارسال سریع به بیش از ۲۰ استان کشور و با دریافت طی ۲۴ ساعت کاری میباشد و شامل ارسال رایگان میشود.</p>

                        <h2 className={['text-right', 'rtl', 'text-danger'].join(' ')} style={{fontSize: '17px'}}>- پیگیری سفارش‌های پستی</h2>
                        <p className={['text-right', 'rtl', 'mb-5'].join(' ')} style={{fontSize: '16px'}}>درصورتی که منتظر دریافت سفارش خود توسط پست هستید، میتوانید مرسوله را از طریق سایت شرکت پست به آدرس زیر پیگیری کنید (کد پیگیری پستی به شماره همراهتان پیامک میشود)</p>

                        <a href='https://tracking.post.ir'><b className={['px-2', 'mb-5'].join(' ')} style={{fontSize: '18px', background: '#F2F2F2', borderRadius: '3px', color: '#00BAC6'}}>tracking.post.ir</b></a>
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
        reduxCart: state.cart,
        reduxLoad: state.loading,
    };
}

const mapDispatchToProps = (dispatch) => {
    return{
        reduxUpdateCart: (d) => dispatch({type: actionTypes.UPDATE_CART, data: d}),
        reduxAddToCart: (d) => dispatch({type: actionTypes.ADD_TO_CART, data: d}),
        reduxIncreaseCountByOne: (d) => dispatch({type: actionTypes.INCREASE_COUNT_BY_ONE, productPackId: d}),
        reduxDecreaseCountByOne: (d) => dispatch({type: actionTypes.DECREASE_COUNT_BY_ONE, productPackId: d}),
        reduxRemoveFromCart: (d) => dispatch({type: actionTypes.REMOVE_FROM_CART, productPackId: d}),
        reduxWipeCart: () => dispatch({type: actionTypes.WIPE_CART}),
        reduxUpdateUserTotally: (d) => dispatch({type: actionTypes.UPDATE_USER_TOTALLY, data: d}),
        reduxStopLoading: () => dispatch({type: actionTypes.STOP_LOADING}),
        reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Help);

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
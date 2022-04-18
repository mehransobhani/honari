import styles from './Header.module.css';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from "@material-ui/core/styles";
import CartMenu from '../CartTopMenu/CartTopMenu';
import {useCookies} from 'react-cookie';
import axios from 'axios';
import * as Constants from '../../components/constants';
import RightMenuParentCategoryItem from './RightMenuParentCategoryItem';
import Login from './Login';
import UserInformationComponent from './UserInformation';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';
import Image from 'next/image';

function BigHeader(props){

    const router = useRouter();
    const desktopSearchBar = useRef(null)

    const [drawerState, setDrawerState] = React.useState({right: false});
    const [expanded, setExpanded] = React.useState(false);
    const [otherMenuItems, setOtherMenuItems] = useState('d-flex');
    const [menuSearchBar, setMenuSearchBar] = useState('d-none');
    const [cartOpenState, setCartOpenState] = useState(false);
    const [smallSearchBarState, setSmallSearchBarState] = useState(false);
    const [cookies , setCookie , removeCookie] = useCookies();
    const [userStatus, setUserStatus] = useState('');
    const [userToken ,setUserToken] = useState('');
    const [userInformation, setUserInformation] = useState({});
    const [cartProductsNumber, setCartProductsNumber] = useState(0);
    const [newCartProductsNumber, setNewCartProductsNumber] = useState(props.newCartCount);
    const [cartInformation, setCartInformation] = useState([]);
    const [menu, setMenu] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(-1);
    const [rightMenuHeaderNumber, setRightMenuHeaderNumber] = useState(0);
    const [academyClasses, setAcademyClasses] = useState([]);
    const [academyArts, setAcademyArts] = useState([]);
    const [successNotificationShowing, setSuccessNotificationShowing] = useState(false);
    const [increaseProcessings, setIncreaseProcessings] = useState([]);
    const [decreaseProcessings, setDecreaseProcessings] = useState([]);
    const [removeProcessings, setRemoveProcessings] = useState([]);
    const [windowWidth, setWindowWidth] = useState(0);
    const [searchResults, setSearchResults] = useState([]);
    const [classSearchResults, setClassSearchResults] = useState([]);
    const [desktopSearchBarWidth, setDesktopSearchBarWidth] = useState(0);
    const [moreSearchCategoriesClass, setMoreSearchCategoriesClass] = useState('d-none');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showUserPofileSummary, setShowUserProfileSummery] = useState(false);
    const [windowHeight, setWindowHeight] = useState(undefined);
    const [dsw, setDsw] = useState("300px");
    const [shouldDesktopSearchBarBeOpen, setShouldDesktopSearchBarBeOpen] = useState(false);
    const [phoneSearchInput, setPhoneSearchInput] = useState('');
    const [axiosProcessInformation, setAxiosProcessInformation] = useState({type: 'nothing', index: -1});
    const [showDesktopAcademyArts, setShowDesktopAcademyArts] = useState(false);
    const [showDesktopMoreMenus, setShowDesktopMoreMenus] = useState(false);
    

    useEffect(() => {
        setWindowWidth(window.outerWidth);
        setWindowHeight(window.outerHeight);
        setShowSearchResults(false);
        setDesktopSearchBarWidth(86.5 * desktopSearchBar.current.offsetWidth / 100);
    }, []);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')){
            return;
        }
        setDrawerState({ right: open });
    };

    const toggleSearchDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')){
            return;
        }
        setDrawerState({ top: open });
    };


    const toggleCartDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerState({left: open});
    }

    useEffect(() => {
        props.reduxStopLoading();
    }, []);

    useEffect(() => {
        let newIncreaseProcessings = [];
        let newDecreaseProcessings = [];
        let newRemoveProcessings = [];
        props.reduxCart.information.map((item, counter) => {
            newIncreaseProcessings.push(false);
            newDecreaseProcessings.push(false);
            newRemoveProcessings.push(false);
        });
        setIncreaseProcessings(newIncreaseProcessings);
        setDecreaseProcessings(newDecreaseProcessings);
        setRemoveProcessings(newRemoveProcessings);    
        setDrawerState({right: false});
        console.info(props.menu.menu); 
    }, [props.reduxCart.information.length, 0]);       

    const updateProductInLocalStorage = (index, count) => {
        let localStorageCart = JSON.parse(localStorage.getItem('user_cart'));
        console.warn(localStorageCart);
        localStorageCart[index].count = count;
        localStorage.setItem('user_cart', JSON.stringify(localStorageCart));
    }

    const startSuccessSnackBarTimer = () => {
        let timeLeft = 2000;
        let interval = setInterval(() => {
            if(timeLeft <= 0){
                props.reduxUpdateSnackbar('success', false, '');
                clearInterval(interval);
            }else{
                timeLeft = timeLeft - 500;
            }
        }, 500);
    }
    const startWarningSnackBarTimer = () => {
        let timeLeft = 2000;
        let interval = setInterval(() => {
            if(timeLeft <= 0){
                props.reduxUpdateSnackbar('warning', false, '');
                clearInterval(interval);
            }else{
                timeLeft = timeLeft - 500;
            }
        }, 500);
    }
    const startErrorSnackBartTimer = () => {
        let timeLeft = 2000;
        let interval = setInterval(() => {
            if(timeLeft <= 0){
                props.reduxUpdateSnackbar('error', false, '');
                clearInterval(interval);
            }else{
                timeLeft = timeLeft - 500;
            }
        }, 500);
    }



    let rightMenuHeaderShopActivedComponent = 
        <div className={['d-flex', 'flex-right', 'rtl'].join(' ')}>
            <button className={['text-center', 'py-3', 'pointer'].join(' ')} style={{flex: '1', background: 'white', color: '#02959F', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none'}}>فروشگاه</button>
            <button className={['text-center', 'py-3', 'pointer'].join(' ')} style={{flex: '1', background: '#F7F7F7', color: '#949494', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none', borderBottom: '1px solid #DEDEDE', borderRight: '1px solid #DEDEDE'}} onClick={()=>{setRightMenuHeaderNumber(1);}} >آموزش‌ها</button>
            <button className={['text-center', 'py-3', 'pointer'].join(' ')} style={{flex: '1', background: '#F7F7F7', color: '#949494', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none', borderBottom: '1px solid #DEDEDE', borderRight: '1px solid #DEDEDE'}} onClick={()=>{setRightMenuHeaderNumber(2);}} >حساب کاربری</button>
        </div>;
    let rightMenuHeaderAcademyActivedComponent = 
        <div className={['d-flex', 'flex-right', 'rtl'].join(' ')}>
            <button className={['text-center', 'py-3', 'pointer'].join(' ')} style={{flex: '1', background: '#F7F7F7', color: '#949494', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none', borderLeft: '1px solid #DEDEDE', borderBottom: '1px solid #DEDEDE'}} onClick={() => {setRightMenuHeaderNumber(0);}}>فروشگاه</button>
            <button className={['text-center', 'py-3', 'pointer'].join(' ')} style={{flex: '1', background: 'white', color: '#02959F', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none'}} onClick={()=>{setRightMenuHeaderNumber(1);}} >آموزش‌ها</button>
            <button className={['text-center', 'py-3', 'pointer'].join(' ')} style={{flex: '1', background: '#F7F7F7', color: '#949494', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none', borderBottom: '1px solid #DEDEDE', borderRight: '1px solid #DEDEDE'}} onClick={()=>{setRightMenuHeaderNumber(2);}} >حساب کاربری</button>
        </div>;
    let rightMenuHeaderUserActivedComponent = 
        <div className={['d-flex', 'flex-right', 'rtl'].join(' ')}>
            <button className={['text-center', 'py-3', 'pointer'].join(' ')} style={{flex: '1', background: '#F7F7F7', color: '#949494', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none', borderLeft: '1px solid #DEDEDE', borderBottom: '1px solid #DEDEDE'}} onClick={() => {setRightMenuHeaderNumber(0);}}>فروشگاه</button>
            <button className={['text-center', 'py-3', 'pointer'].join(' ')} style={{flex: '1', background: '#F7F7F7', color: '#949494', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none', borderLeft: '1px solid #DEDEDE', borderBottom: '1px solid #DEDEDE'}} onClick={()=>{setRightMenuHeaderNumber(1);}} >آموزش‌ها</button>
            <button className={['text-center', 'py-3', 'pointer'].join(' ')} style={{flex: '1', background: 'white', color: '#02959F', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none'}}>حساب کاربری</button>
        </div>;

    useEffect(() => {
        if(props.menu.status === 'done' && props.menu.found == true){
            setMenu(props.menu.menu);
            setShowSearchResults(false);
        }
    }, [props.menu, undefined]);

    //##### HARDCODED ACADEMY LINKS #####//
    useEffect(() => {
        let classes = [];
        classes.push({name: 'چرم دوزی',                 url: 'https://honari.com/academy/category/charm_doozi'});
        classes.push({name: 'نقاشی روی شیشه',           url: 'https://honari.com/academy/category/naghashi'});
        classes.push({name: 'نمد دوزی',                 url: 'https://honari.com/academy/category/namad_doozi'});
        classes.push({name: 'دکوراتیو',                 url: 'https://honari.com/academy/category/decorative'});
        classes.push({name: 'نقاشی روی پارچه',          url: 'https://honari.com/academy/category/naghashi-parche'});
        classes.push({name: 'معرق کاشی',                url: 'https://honari.com/academy/category/mosaic_art'});
        classes.push({name: 'عروسک خمیری',              url: 'https://honari.com/academy/category/polymer_clay'});
        classes.push({name: 'روبان دوزی',               url: 'https://honari.com/academy/category/Ribbon_embroidery'});
        classes.push({name: 'بافتنی و تریکو بافی',      url: 'https://honari.com/academy/category/knitting'});
        classes.push({name: 'زیورآلات',                  url: 'https://honari.com/academy/category/jewlery'});
        classes.push({name: 'شماره دوزی',               url: 'https://honari.com/academy/category/shomaredozi'});
        classes.push({name: 'گلدوزی',                   url: 'https://honari.com/academy/category/goldoozi'});
        classes.push({name: 'منجوق بافی',               url: 'https://honari.com/academy/category/beadweaving'});
        classes.push({name: 'رزین',                     url: 'https://honari.com/academy/category/resin'});
        classes.push({name: 'کچه دوزی',                 url: 'https://honari.com/academy/category/%DA%A9%DA%86%D9%87%D9%80%D8%AF%D9%88%D8%B2%DB%8C'});
        classes.push({name: 'جواهر دوزی و دربار دوزی',  url: 'https://honari.com/academy/category/beadembroidery'});
        classes.push({name: 'مکرومه بافی',              url: 'https://honari.com/academy/category/macrame'});
        classes.push({name: 'دریم کچر',                 url: 'https://honari.com/academy/category/dreamcatcher'});
        classes.push({name: 'شمع سازی',                 url: 'https://honari.com/academy/category/candle'});
        classes.push({name: 'مینا کاری',                url: 'https://honari.com/academy/category/underglaze'});
        classes.push({name: 'صابون سازی',               url: 'https://honari.com/academy/category/handmadesoap'});
        classes.push({name: 'تیفانی',                   url: 'https://honari.com/academy/category/stainedglass'});
        classes.push({name: 'لوازم آرایشی طبیعی',       url: 'https://honari.com/academy/category/%D9%84%D9%88%D8%A7%D8%B2%D9%85-%D8%A2%D8%B1%D8%A7%DB%8C%D8%B4-%D8%B7%D8%A8%DB%8C%D8%B9%DB%8C'});
        classes.push({name: 'اسماج و عود',              url: 'https://honari.com/academy/category/%D8%A7%D8%B3%D9%85%D8%A7%D8%AC-%D9%88-%D8%B9%D9%88%D8%AF'});
        setAcademyClasses(classes);

        axios.get(Constants.academyApiUrl + '/api/shop/arts').then((r) => {
            let response = r.data;
            if(response.status === 'done' && response.found === true){
                setAcademyArts(response.arts);
            }
        }).catch((e) => {
            console.error(e);
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
        });
    }, []);

    const increaseProductCountByOne = (key) => {
        if(axiosProcessInformation.index !== key){
            if(props.reduxUser.status == 'GUEST'){
                setAxiosProcessInformation({type: 'increase', index: key});
                axios.post(Constants.apiUrl + '/api/guest-check-cart-changes', {
                    productPackId: props.reduxCart.information[key].productPackId,
                    count: props.reduxCart.information[key].count + 1
                }).then((res) => {
                    let response = res.data;
                    if(response.status == 'done'){
                        updateProductInLocalStorage(key, response.count);
                        props.reduxIncreaseCountByOne(props.reduxCart.information[key].productPackId);
                        
                    }else if(response.status == 'failed'){
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                }).catch((error) => {
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                });
            }else if(props.reduxUser.status === 'LOGIN'){
                setAxiosProcessInformation({type: 'increase', index: key});
                axios.post(Constants.apiUrl + '/api/user-increase-cart-by-one', {
                    productPackId: props.reduxCart.information[key].productPackId
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    let response = res.data;
                    if(response.status == 'done'){
                        props.reduxIncreaseCountByOne(props.reduxCart.information[key].productPackId);
                    }else if(response.status == 'failed'){
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                }).catch((error) => {
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                });
            }
        }
    }

    const decreaseProductCountByOne = (key) => {
        if(props.reduxCart.information[key].count == 1){
            return;
        }
        if(axiosProcessInformation.index !== key){
            if(props.reduxUser.status == 'GUEST'){
                setAxiosProcessInformation({type: 'decrease', index: key});
                axios.post(Constants.apiUrl + '/api/guest-check-cart-changes', {
                    productPackId: props.reduxCart.information[key].productPackId,
                    count: props.reduxCart.information[key].count - 1
                }).then((res) => {
                    let response = res.data;
                    if(response.status == 'done'){
                        updateProductInLocalStorage(key, response.count);
                        props.reduxDecreaseCountByOne(props.reduxCart.information[key].productPackId);
                    }else if(response.status == 'failed'){
                        /*newCart = [];
                        i = 0;
                        for(let item of cart){
                            if(i === key){
                                item.decreaseProcessing = false;
                            }
                            newCart.push(item);
                            i++;
                        }
                        setCart(newCart);*/
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                }).catch((error) => {
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                });
            }else if(props.reduxUser.status == 'LOGIN'){
                setAxiosProcessInformation({type: 'decrease', index: key});
                axios.post(Constants.apiUrl + '/api/user-decrease-cart-by-one', {
                    productPackId: props.reduxCart.information[key].productPackId
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    let response = res.data;
                    if(response.status == 'done'){
                        props.reduxDecreaseCountByOne(props.reduxCart.information[key].productPackId);
                    }else if(response.status === 'failed'){
                        console.log(response.message);
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                }).catch((error) => {
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                });
            }
        }
    }

    const removeProductFromCart = (key) => {
        if(!removeProcessings[key]){
            if(props.reduxUser.status === 'GUEST'){              
                let localStorageCart = JSON.parse(localStorage.getItem('user_cart'));
                let newLocalStorageCart = [];
                localStorageCart.map((item, counter) => {
                    if(item.id !== props.reduxCart.information[key].productPackId){
                        newLocalStorageCart.push(item);
                    }
                });
                localStorage.setItem('user_cart', JSON.stringify(newLocalStorageCart));
                props.reduxRemoveFromCart(props.reduxCart.information[key].productPackId);
                toggleCartDrawer('left', true);
            }else if(props.reduxUser.status === 'LOGIN'){
                setAxiosProcessInformation({type: 'remove', index: key});
                axios.post(Constants.apiUrl + '/api/user-remove-from-cart', {
                    productPackId: props.reduxCart.information[key].productPackId
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    let response = res.data;
                    if(response.status == 'done'){
                        props.reduxRemoveFromCart(props.reduxCart.information[key].productPackId);
                    }else if(response.status == 'failed'){
                        console.error(response.message);
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                }).catch((error) => {
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                    setAxiosProcessInformation({type: 'nothing', index: -1});
                });
                toggleCartDrawer('left', true);
            }
        }
    }

    const getLoggedInUsersCartInformation = () => {
        axios.post(Constants.apiUrl + "/api/user-cart", {},{
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token, 
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
            alert('مشکلی پیش آمده لطفا مجددا امتحان کنید');
        });
    }

    const getGuestUsersCartInformation = () => {
        let cart = localStorage.getItem('user_cart');
        if(cart === undefined || cart === null){
            localStorage.setItem('user_cart', '[]');
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

    const [hover, setHover] = useState({status: false, title: ''});
    const [rightHover, setRightHover] = useState({status: false, title: ''});

    const setActived = (title) => {
        if(hover.status && hover.title === title){
            return styles.menuItemHovered;
        }else{
            return '';
        }
    }

    let upArrow = '/assets/images/main_images/up_arrow_gray_small.png';
    let downArrow = '/assets/images/main_images/down_arrow_gray_small.png';

    const StyledLinearProgressActive = withStyles({
        colorPrimary: {
          backgroundColor: 'white'
        },
        barColorPrimary: {
          backgroundColor: '#00bac6'
        }
    })(LinearProgress);

    const rightMenuItemClicked = (title) => {
        if(title === rightHover.title){
            setRightHover({status: false, title: ''});
        }else{
            setRightHover({status: true, title: title});
        }
    }

    const searchFormSubmited = () => {
        alert('searched');
    }

    const sumOfCartPrices = () => {
        let price = 0;
        props.reduxCart.information.map((item, counter) => {
            price += item.count * item.price;
        });
        return price;
    }

    const sumOfCartDiscountedPrices = () => {
        let price = 0;
        props.reduxCart.information.map((item, counter) => {
            price += item.count * item.discountedPrice;
        });
        return price;
    }

    const getFreeDeliveryFlexNumber = () => {
        if(sumOfCartPrices() >= 250000){
            return 1;
        }else{
            //props.reduxUpdateSnackbar('error', true, (sumOfCartPrices() / 250000.0) );
            return sumOfCartPrices() / 250000;
        }
    }

    const getDeliveryPriceText = () => {
        let text = "هزینه ارسال رایگان است";
        if (sumOfCartPrices() >= 250000){
            return (<p className={['col-12', 'mb-0', 'text-right', 'mt-1', 'px-0'].join(' ')} style={{fontSize: '12px', color: '#00BAC6'}}>هزینه ارسال رایگان است</p>);
        }else {
            return(
                <p className={['col-12', 'mb-0', 'text-right', 'mt-1', 'px-0'].join(' ')} style={{fontSize: '12px'}}>تنها{
                    <span style={{color: '#00BAC6', paddingRight: '3px', paddingLeft: '3px'}}>{(250000 - sumOfCartPrices()).toLocaleString()}</span>
                }تومان تا ارسال <span style={{color: '#00BAC6'}}>رایگان</span></p>
            );
        }
    }

    const DesktopCart = (
        <div className={['container-fluid', 'shadow-sm', 'rounded-sm', 'pr-2', 'pl-3'].join(' ')} style={{width: '500px', backgroundColor: 'white', position: 'absolute', left: '0.3rem', top: '2.2rem', zIndex: '600', cursor: 'auto'}}>
            {
                props.reduxCart.information.length !== 0 ? (
                    <React.Fragment>
                        <div className={['row', 'mt-2', 'pr-3', 'pl-1'].join(' ')}>
                            <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'pr-0'].join(' ')} style={{background: '#DEDEDE', borderRadius: '4px', marginTop: '0.9rem', paddingLeft: '2.85rem'}}>
                                <div style={{flex: getFreeDeliveryFlexNumber(), background: '#00BAC6', height: '14px', borderRadius: '4px'}}></div>
                            </div>
                            {getDeliveryPriceText()}
                            <div className={['d-flex', 'flex-column', 'justify-content-center', 'p-2'].join(' ')} style={{background: sumOfCartPrices() >= 250000 ? "#00BAC6" : '#DEDEDE', borderRadius: '2.6rem', position: 'absolute', top: '0.3rem', left: '0.3rem'}}>
                                <h6 className={['text-center', 'mb-1'].join(' ')} style={{color: sumOfCartPrices() >= 250000 ? 'white': '#949494', fontSize: '0.6rem'}}>ارسال</h6>
                                <h6 className={['text-center', 'mb-0'].join(' ')} style={{color: sumOfCartPrices() >= 250000 ? 'white': '#949494', fontSize: '0.8rem'}}>رایگان</h6>
                            </div>
                            <h6 className={['text-left', 'rtl'].join(' ')} style={{color: '#00BAC6', fontSize: '12px'}}>{props.reduxCart.information.length + " مورد در سبد خرید"}</h6>
                            <div className={['col-12'].join(' ')} style={{background: '#DEDEDE', height: '1px'}}></div>
                        </div>
                        <div className={['row'].join(' ')} style={{overflowY: 'scroll', overflowX: 'hidden', maxHeight: '250px'}}>
                            <div className={['col-12', 'mx-0', 'px-1'].join(' ')}>
                                {
                                    props.reduxCart.information.map((item, counter) => {
                                        return(
                                            <div key={counter} className={['rtl', 'd-flex', 'flex-row', 'py-3'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                                                <Link href={'/' + item.url}><img className={['pointer'].join(' ')} onClick={props.reduxStartLoading}  src={'https://honari.com/image/resizeTest/shop/_85x/thumb_' + item.prodID + '.jpg'} style={{width: '70px', height: '70px', borderRadius: '2px'}} /></Link>
                                                <div className={['d-flex', 'flex-column'].join(' ')} style={{flex: '1'}}>
                                                    <div className={['d-flex', 'flex-row', 'ltr', 'justify-content-between'].join(' ')}>
                                                        <img className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/bin_red.png'} style={{width: '16px', height: '16px'}} onClick={() => {removeProductFromCart(counter)}} />
                                                        <Link href={"/" + item.url}><a onClick={props.reduxStartLoading} className={['mb-0', 'rtl', 'text-right', 'px-1'].join(' ')} style={{fontSize: '14px', color: "#444444"}}>{item.name}</a></Link>
                                                    </div>
                                                    <div className={['d-flex', 'flex-row', 'ltr', 'justify-content-between', 'align-items-center'].join(' ')} style={{marginTop: 'auto'}}>
                                                        {
                                                            item.price !== 0
                                                            ?
                                                            (
                                                                <div className={['d-flex', 'flex-row', 'ltr', 'align-items-center'].join(' ')}>
                                                                    <img className={['pointer'].join(' ')} src={Constants.baseUrl + (axiosProcessInformation.type === 'decrease' && axiosProcessInformation.index === counter ? '/assets/images/main_images/loading_circle_dotted.png' : '/assets/images/main_images/minus_gray_circle.png')} style={{width: '18px', height: '18px'}} onClick={() => {decreaseProductCountByOne(counter)}}/>
                                                                    <span className={['px-2', 'mb-0', 'mx-1'].join(' ')} style={{fontSize: '16px', color: '#444444'}}>{item.count}</span>
                                                                    <img className={['pointer'].join(' ')} src={Constants.baseUrl + (axiosProcessInformation.type === 'increase' && axiosProcessInformation.index === counter ? '/assets/images/main_images/loading_circle_dotted.png' : '/assets/images/main_images/plus_gray_circle.png')} style={{width: '18px', height: '18px'}} onClick={() => {increaseProductCountByOne(counter)}}/>
                                                                </div>
                                                            )
                                                            :
                                                                null
                                                        }
                                                        <div className={['d-flex', 'flex-row', 'text-right', 'rtl'].join(' ')} style={{flex: '1'}}>
                                                            {
                                                                item.price === 0
                                                                ?
                                                                (
                                                                    <p className={['mb-0', 'rtl', 'mr-1', 'rtl', 'px-2'].join(' ')} style={{fontSize: '13px', color: '#444444', borderRadius: '2px', background: '#F2F2F2'}}>ناموجود</p>
                                                                )
                                                                :
                                                                (
                                                                    item.price !== item.discountedPrice
                                                                    ?
                                                                    (
                                                                        <React.Fragment>
                                                                            <p className={['mb-0', 'rtl', 'mr-1', 'rtl'].join(' ')} style={{fontSize: '13px', color: '#444444'}}><del className={['px-1'].join(' ')} style={{color: 'gray'}}>{(item.price * item.count).toLocaleString()}</del></p>
                                                                            <p className={['mb-0', 'rtl', 'mr-1', 'rtl'].join(' ')} style={{fontSize: '13px', color: '#00BAC6'}}>{(item.discountedPrice * item.count).toLocaleString() + " تومان"}</p>
                                                                        </React.Fragment>
                                                                    )
                                                                    :
                                                                    (
                                                                        <p className={['mb-0', 'rtl', 'mr-1'].join(' ')} style={{fontSize: '13px', color: '#444444'}}>{(item.price * item.count).toLocaleString() + " تومان"}</p>
                                                                    )
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                } 
                            </div>
                        </div>
                        <div className={['row', 'rtl', 'd-flex', 'flex-row', 'align-items-center', 'text-right', 'py-4', 'mb-1', 'pr-3', 'pl-2'].join(' ')}>
                            <p className={['mb-0'].join(' ')} style={{fontSize: '13px', color: '#444444'}}> مبلغ قابل پرداخت : </p>
                            {
                            sumOfCartDiscountedPrices() !== sumOfCartPrices()
                            ?
                            (
                                <React.Fragment>
                                    <p className={['mb-0', 'rtl'].join(' ')}><del style={{color: 'gray'}}>{sumOfCartPrices().toLocaleString()}</del></p>
                                    <p className={['mb-0', 'rtl', 'px-1'].join(' ')} style={{color: '#00BAC6'}}>{sumOfCartDiscountedPrices().toLocaleString() + " تومان "}</p>
                                </React.Fragment>
                            )  
                            :
                            (
                                <p className={['mb-0', 'rtl', 'px-1'].join(' ')} style={{color: '#00BAC6'}}>{sumOfCartDiscountedPrices().toLocaleString()}</p>
                            )
                            }
                            <Link href='/cart/shoppingCart' ><a onClick={()=>{props.reduxStartLoading()}} className={['col-12', 'py-1', 'text-center', 'mb-1', 'mt-2'].join(' ')} style={{fontSize: '17px', fontWeight: '500', color: 'white', background: '#00BAC6', border: 'none', borderRadius: '2px', outline: 'none'}}>تکمیل فرآیند خرید</a></Link>
                        </div>
                    </React.Fragment>
                )
                :
                (
                    <div className={['d-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'py-3'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_cart_main.svg'} style=   {{width: '60px', height: '60px'}}/>
                        <p className={['rtl', 'text-center', 'mb-0', 'mt-2'].join(" ")}>سبد خرید شما خالی است</p>
                    </div>
                )
            }
                               
        </div>
    );

    const phoneCartLayout = (
        <div style={{width: windowWidth, overflowX: 'hidden'}}>
            {
                props.reduxCart.information.length !== 0
                ?
                (
                    <React.Fragment>
                        <div className={['container'].join(' ')} style={{position: 'fixed', zIndex: '600', background: 'white', borderBottom: '1px solid #DEDEDE'}}>
                            <div className={['d-flex', 'flex-row', 'text-right', 'justify-content-right', 'align-items-center', 'rtl', 'px-3', 'pt-2', 'pb-1'].join(' ')}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/close_gray_small.png'} style={{width: '22px', height: '22px'}} onClick={toggleCartDrawer('left', false)} />
                            </div>
                            <div className={['row', 'mt-2', 'px-3'].join(' ')} style={{height: '3.8rem'}}>
                                <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'pr-0'].join(' ')} style={{background: '#DEDEDE', borderRadius: '4px', paddingLeft: '2.1rem'}}>
                                    <div style={{flex: getFreeDeliveryFlexNumber(), background: '#00BAC6', height: '14px', borderRadius: '4px'}}></div>
                                </div>
                                {getDeliveryPriceText()}
                                <div className={['d-flex', 'flex-column', 'justify-content-center', 'p-2', 'pointer'].join(' ')} style={{background: sumOfCartPrices() >= 250000 ? "#00BAC6" : '#DEDEDE', borderRadius: '2.6rem', position: 'relative', top: '-3.3rem', left: '-0.3rem'}}>
                                    <h6 className={['text-center', 'mb-1'].join(' ')} style={{color: sumOfCartPrices() >= 250000 ? 'white': '#949494', fontSize: '0.6rem'}}>ارسال</h6>
                                    <h6 className={['text-center', 'mb-0'].join(' ')} style={{color: sumOfCartPrices() >= 250000 ? 'white': '#949494', fontSize: '0.8rem'}}>رایگان</h6>
                                </div>
                                <h6 className={['text-left', 'rtl', 'mb-0', 'pb-0'].join(' ')} style={{color: '#00BAC6', height: '0rem', fontSize: '12px', position: 'relative', left: '-3.1rem'}}>{props.reduxCart.information.length + " مورد در سبد خرید"}</h6>
                            </div>
                        </div>
                        <div className={['row'].join(' ')} style={{overflowY: 'scroll', overflowX: 'hidden', marginBottom: '8rem', position: 'relative', top: '6.6rem'}}>
                            <div className={['col-12', 'd-none'].join(' ')} style={{height: '1px', background: '#DEDEDE', position: 'relative', top: '0rem'}}></div>
                            <div className={['col-12', 'pr-3', 'pl-4'].join(' ')}>
                                {
                                    props.reduxCart.information.map((item, counter) => {
                                        return(
                                            <div key={counter} className={['rtl', 'd-flex', 'flex-row', 'py-3'].join(' ')} style={{borderBottom: counter != props.reduxCart.information.length - 1 ? '1px solid #DEDEDE' : ''}}>
                                                <img src={'https://honari.com/image/resizeTest/shop/_85x/thumb_' + item.prodID + '.jpg'} style={{width: '70px', height: '70px', borderRadius: '2px'}} />
                                                <div className={['d-flex', 'flex-column', 'pl-1'].join(' ')} style={{flex: '1'}}>
                                                    <div className={['d-flex', 'flex-row', 'ltr', 'justify-content-between'].join(' ')}>
                                                        <img className={['pointer']} src={Constants.baseUrl + '/assets/images/main_images/bin_red.png'} style={{width: '20px', height: '20px'}} onClick={() => {removeProductFromCart(counter)}} />
                                                        <Link href={"/" + item.url}><a onClick={toggleCartDrawer('left', false)} className={['mb-0', 'rtl', 'text-right', 'px-1'].join(' ')} style={{fontSize: '16px', color: "#444444", width: '70%'}}><span onClick={props.reduxStartLoading}>{item.name}</span></a></Link>
                                                    </div>
                                                    <div className={['d-flex', 'flex-row', 'ltr', 'justify-content-between', 'align-items-center'].join(' ')} style={{marginTop: 'auto'}}>
                                                        {
                                                            item.price !== 0
                                                            ?
                                                            (
                                                                <div className={['d-flex', 'flex-row', 'ltr', 'align-items-center'].join(' ')}>
                                                                    <img className={['pointer'].join(' ')} src={Constants.baseUrl + (axiosProcessInformation.type === 'decrease' && axiosProcessInformation.index === counter ? '/assets/images/main_images/loading_circle_dotted.png' : '/assets/images/main_images/minus_gray_circle.png')} style={{width: '20px', height: '20px'}} onClick={() => {decreaseProductCountByOne(counter)}}/>
                                                                    <span className={['px-2', 'mb-0', 'mx-1'].join(' ')} style={{fontSize: '16px', color: '#444444'}}>{item.count}</span>
                                                                    <img className={['pointer'].join(' ')} src={Constants.baseUrl + (axiosProcessInformation.type === 'increase' && axiosProcessInformation.index === counter ? '/assets/images/main_images/loading_circle_dotted.png' : '/assets/images/main_images/plus_gray_circle.png')} style={{width: '20px', height: '20px'}} onClick={() => {increaseProductCountByOne(counter)}}/>
                                                                </div>
                                                            )
                                                            :
                                                            null
                                                        }
                                                        <div className={['d-flex', 'flex-row', 'text-right', 'rtl'].join(' ')} style={{flex: '1'}}>
                                                            {
                                                                item.price === 0 
                                                                ?
                                                                <p className={['px-2', 'mr-1'].join(' ')} style={{backgroundColor: '#F2F2F2', borderRadius: '2px', position: 'relative', top: '0.6rem'}}>ناموجود</p>
                                                                :
                                                                (
                                                                    item.price !== item.discountedPrice
                                                                    ?
                                                                    (
                                                                        <React.Fragment>
                                                                            <p className={['mb-0', 'rtl', 'mr-1', 'rtl'].join(' ')} style={{fontSize: '15px', color: '#444444'}}><del className={['px-1'].join(' ')} style={{color: 'gray'}}>{(item.price * item.count).toLocaleString()}</del></p>
                                                                            <p className={['mb-0', 'rtl', 'mr-1', 'rtl'].join(' ')} style={{fontSize: '15px', color: '#00BAC6'}}>{(item.discountedPrice * item.count).toLocaleString() + " تومان"}</p>
                                                                        </React.Fragment>
                                                                    )
                                                                    :
                                                                    (
                                                                        <p className={['mb-0', 'rtl', 'mr-1'].join(' ')} style={{fontSize: '15px', color: '#444444'}}>{(item.price * item.count).toLocaleString() + " تومان"}</p>
                                                                    )
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                } 
                            </div>
                        </div>
                        <div className={['row', 'rtl', 'd-flex', 'flex-row', 'align-items-center', 'text-right', 'mt-1', 'mr-3', 'ml-3'].join(' ')} style={{marginBottom: '7.5rem'}}>
                            <div className={['col-12', 'd-flex', 'flex-column', 'px-2'].join(' ')} style={{position: 'absolute', bottom: '0', left: '0', background: 'white', borderTop: props.reduxCart.information.length >= 5 ? '1px solid #DEDEDE' : ''}}>
                                <div className={['d-flex', 'flex-row', 'w-100', 'rtl', 'align-items-center', 'justify-content-right', 'mt-2', 'py-1'].join(' ')} style={{background: '#F7F7F7', borderTop: '1px solid #DEDEDE'}}>
                                    <p className={['mb-0', 'p-2'].join(' ')} style={{fontSize: '16px', color: '#444444'}}> مبلغ قابل پرداخت : </p>
                                    {
                                    sumOfCartDiscountedPrices() !== sumOfCartPrices()
                                    ?
                                    (
                                        <React.Fragment>
                                            <p className={['mb-0', 'rtl'].join(' ')} style={{fontSize: '19px'}}><del style={{color: 'gray'}}>{sumOfCartPrices().toLocaleString()}</del></p>
                                            <p className={['mb-0', 'rtl', 'px-1'].join(' ')} style={{fontSize: '19px', color: '#00BAC6'}}>{sumOfCartDiscountedPrices().toLocaleString() + " تومان "}</p>
                                        </React.Fragment>
                                    )  
                                    :
                                    (
                                        <p className={['mb-0', 'rtl', 'px-1'].join(' ')} style={{fontSize: '19px', color: '#00BAC6'}}>{sumOfCartDiscountedPrices().toLocaleString()}</p>
                                    )
                                    }
                                </div>
                                <Link href='/cart/shoppingCart' ><a onClick={() => {props.reduxStartLoading()}} className={['col-12', 'py-2', 'text-center', 'mb-1'].join(' ')} style={{fontSize: '17px', fontWeight: '500', color: 'white', background: '#00BAC6', border: 'none', borderRadius: '2px', outline: 'none'}}>تکمیل فرآیند خرید</a></Link>
                                <button onClick={toggleCartDrawer('left', false)} className={['col-12', 'py-1', 'text-center', 'mb-1', 'mt-2', 'pointer'].join(' ')} style={{fontSize: '17px', fontWeight: '500', color: 'white', background: 'white', border: 'none', borderRadius: '2px', outline: 'none', color: '#949494', borderRadius: '2px'}}>بستن</button>
                            </div>
                        </div> 
                    </React.Fragment>
                )
                :
                (
                    <div className={['d-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'py-3'].join(' ')}>
                        <div className={['d-flex', 'flex-row', 'text-right', 'justify-content-right', 'align-items-center', 'rtl', 'px-3', 'pb-1', 'w-100'].join(' ')}>
                            <img src={Constants.baseUrl + '/assets/images/main_images/close_gray_small.png'} style={{width: '22px', height: '22px'}} onClick={toggleCartDrawer('left', false)} />
                        </div>
                        <img src={Constants.baseUrl + '/assets/images/main_images/panel_cart_main.svg'} style=   {{width: '60px', height: '60px'}}/>
                        <p className={['rtl', 'text-center', 'mb-0', 'mt-2'].join(" ")}>سبدخرید شما خالی است</p>
                    </div> 
                )
            }
        </div>
    );

    const rightTileItems = (
        <React.Fragment>
            <ul className={['row', 'rtl', 'px-2'].join(' ')} style={{backgroundColor: '#F2F2F2'}}>
                <li className={['col-12', 'shadow-sm', 'm-0', 'p-0'].join(' ')} style={{backgroundColor: 'white', fontSize: '1px'}}> </li>
                <li className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'py-2', styles.dropdownItem].join(' ')}>
                    کاشی
                    <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_gray_small.png'} className={['ml-1'].join(' ')} style={{width: '10px'}} />
                </li>
                <li className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'py-2', styles.dropdownItem].join(' ')}>
                    آجر تزئینی
                    <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_gray_small.png'} className={['ml-1'].join(' ')} style={{width: '10px'}} />
                </li>
                <li className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'py-2', styles.dropdownItem].join(' ')}>
                    آینه
                    <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_gray_small.png'} className={['ml-1'].join(' ')} style={{width: '10px'}} />
                </li>
                <li className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'py-2', styles.dropdownItem].join(' ')}>
                    ابزار
                    <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_gray_small.png'} className={['ml-1'].join(' ')} style={{width: '10px'}} />
                </li>
                <li className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'py-2', styles.dropdownItem].join(' ')}>
                    شیشه تایل رنگی
                    <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_gray_small.png'} className={['ml-1'].join(' ')} style={{width: '10px'}} />
                </li>
                <li className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'py-2', styles.dropdownItem].join(' ')}>
                    بیس چوبی
                    <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_gray_small.png'} className={['ml-1'].join(' ')} style={{width: '10px'}} />
                </li>
                <li className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'py-2', styles.dropdownItem].join(' ')}>
                    <div className={['d-flex', 'flex-row', 'align-items-center']}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/college_hat_main.png'} className={['ml-1'].join(' ')} style={{width: '24px'}} />
                        <span style={{color: '#00bac6'}}>آموزش معرق کاشی</span>
                    </div>
                    <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_gray_small.png'} className={['ml-1'].join(' ')} style={{width: '10px'}} />
                </li>
            </ul>
        </React.Fragment>
    );

    const rightMenuItemDivider = (
        <div className={['col-12', 'mx-auto'].join(' ')} style={{height: '1px', backgroundColor: '#F2F2F2'}}>
        </div>
    )

    const RightMenu = () => {
        return (
            <div className={['']} style={{minWidth: '270px', overflowX: 'hidden'}}>
                {
                props.reduxLoad === true ? <div className={['w-100'].join(' ')} style={{position: 'absolute', top: '0', left: '0', zIndex: '3000'}}><StyledLinearProgressActive /></div> : null
                }
                <div className={['d-flex', 'flex-row', 'rtl'].join(' ')} style={{}}>
                    <Link href={'/'}><img onClick={props.reduxStartLoading} src={Constants.baseUrl + '/assets/images/main_images/honari.png'} className={['poniter'].join(' ')} style={{width: '36px', height: '36px', marginRight: '10px', marginTop: '10px', marginBottom: '10px'}} /></Link>
                    <div className={['d-flex', 'flex-column', 'rtl'].join(' ')} style={{marginTop: '10px', marginBottom: '10px'}}>
                        <Link href={'/'}><a onClick={props.reduxStartLoading}><h2 className={['mr-2', 'mb-0', 'text-right', 'pointer'].join(' ')} style={{color: '#00BAC6', fontSize: '20px', fontWeight: '500'}}>هنری</h2></a></Link>
                        <h4 className={['mr-2', 'mb-0', 'text-right'].join(' ')} style={{color: '#949494', fontSize: '10px'}}>آموزش، الگو، مواداولیه</h4>
                    </div>
                    <div className={[''].join(' ')} style={{position: 'relative', top: '0', left: '-2.6rem', width: '5.4rem', height: '3.5rem', background: 'url(' + Constants.baseUrl + '/assets/images/main_images/desktop_flower_left.png)', backgroundRepeat: 'no-repeat', backgroundPosition: 'left', backgroundSize: 'cover'}}></div>
                </div>  
                {
                    rightMenuHeaderNumber == 0 
                    ?
                        rightMenuHeaderShopActivedComponent
                    :
                        (
                            rightMenuHeaderNumber == 1
                            ?
                                rightMenuHeaderAcademyActivedComponent
                            :
                                (
                                    rightMenuHeaderNumber == 2
                                    ?
                                        rightMenuHeaderUserActivedComponent
                                    :
                                        null
                                )
                        )
                }
                {
                    rightMenuHeaderNumber == 0
                    ?
                        (
                            menu !== [] && menu !== undefined
                            ?
                                props.menu.menu.map((info, counter) => {
                                    return <RightMenuParentCategoryItem information={info} key={counter} />
                                })  
                            :
                                null
                        )
                    :
                        (
                            rightMenuHeaderNumber == 1
                            ?
                            (
                                academyClasses !== [] && academyClasses !== undefined
                                ?
                                    academyClasses.map((academyClass, counter) => {
                                        return (
                                            <Link href={academyClass.url}>
                                                <a key={counter} className={['px-2', 'py-3', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                                                    <h5 className={['mb-0'].join(' ')} style={{fontSize: '15px'}}>{academyClass.name}</h5>
                                                </a>
                                            </Link>
                                        );
                                    })
                                :
                                    null
                            )
                            :
                                (
                                    rightMenuHeaderNumber == 2 
                                    ?
                                        (
                                            props.reduxUser.status !== 'LOGIN'
                                            ?
                                                <Login />
                                            :
                                                <UserInformationComponent information={props.reduxUser.information} />
                                        ) 
                                    :
                                        null
                                )
                        )
                    
                }
            </div>
        );
    }

    const getSubMenus = (number) => {
        if(menu != [] && menu != undefined && menu[number] != undefined){
            let subMenus = menu[number].children;
            return (
                <ul className={['row', 'rtl', 'px-3', 'py-3', number === hover.number ? '' : 'd-none'].join(' ')}>
                    {
                        subMenus.map((sm, counter) => {
                            return(
                                <li className={['col-3', 'd-flex', 'flex-row', 'align-items-center', 'pointer', 'mt-2', styles.dropdownItem].join(' ')}>
                                    <Link key={counter} href={sm.url.substr(18)}>
                                        <a style={{fontSize: '13px'}} onClick={props.reduxStartLoading}>
                                            {sm.name}
                                        </a>
                                    </Link>
                                </li>
                            );
                        })
                    }
                </ul>
            );
        }
    }

    const desktopMenu = (
        <div className={['container-fluid', 'mx-0', 'px-0', hover.status ? 'd-flex' : 'd-none', 'flex-row', 'justify-content-center', 'align-items-center', 'bbb'].join(' ')} style={{position: 'fixed', zIndex: '400'}}>
            <div className={['container', 'px-2'].join(' ')} >
                <div className={['shadow-sm'].join(' ')} style={{borderRadius: '0 0 3px 3px', backgroundColor: 'white', border: '1px solid #DEDEDE', width: '100%'}} onMouseEnter={()=>{setHover({status: true, number: hover.number, title: hover.title})}} onMouseLeave={()=>{setHover({status: false, number: hover.number, title: ''})}}>
                {
                    props.menu.menu.map((item, c) => {
                        return (
                            getSubMenus(c)
                        )
                    })
                }
                </div>
            </div>
        </div>
    );

    const getSearchResults = (event) => {
        let input= event.target.value;
        if(input.length === 0){
            setSearchResults([]);
            setClassSearchResults([]);
            setShowSearchResults(false);
            return;
        }
        setPhoneSearchInput(input);
        axios.post(Constants.apiUrl + '/api/search-autocomplete', {
            input: input,
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                response.result.map((r, i) => {
                    if(r.indexName === 'products'){
                        setSearchResults(r.autoComplete);
                    }else if(r.indexName === 'courses'){
                        setClassSearchResults(r.autoComplete);
                    }
                });
                if(response.result[0].autoComplete.length === 0 && response.result[1].autoComplete.length === 0){
                    props.reduxUpdateSnackbar('warning', true, 'موردی یافت نشد');
                }
                //setSearchResults(response.result[0].autoComplete);
                //setClassSearchResults(response.result[1].autoComplete);
                setShowSearchResults(true);
                setMoreSearchCategoriesClass('d-none');
            }
            console.warn(response);
        }).catch((err) => {
            console.error(err);
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
        });
    }

    const userMouseEntered = () => {
        setShowUserProfileSummery(true);
    }

    const userMouseLeft = () => {
        setShowUserProfileSummery(false);
    }

    const academyMouseEntered = () => {
        setShowDesktopAcademyArts(true);
    }

    const academyMouseLeft = () => {
        setShowDesktopAcademyArts(false);
    }

    const logoutUserButtonClicked = () => {
        removeCookie('user_server_token', {domain: '.honari.com', path: '/'});
        //window.location.href = '/';
        router.reload(window.location.pathname);
    }

    const getHoveredItemColor = (item) => {
        if(hover.title === item){
            return "#00BAC6";
        }else{
            return "#2B2B2B";
        }
    }

    const desktopAcademyArts = (
        <React.Fragment>
            <div onMouseEnter={academyMouseEntered} onMouseLeave={academyMouseLeft} className={['row' , showDesktopAcademyArts ? '' : 'd-none'].join(' ')} style={{width: '8rem', height: '1rem', position: 'absolute', left: '-4.8rem', top: '1.0rem'}}>
            </div>
            <div onMouseEnter={academyMouseEntered} onMouseLeave={academyMouseLeft} className={['row' , showDesktopAcademyArts ? '' : 'd-none'].join(' ')} style={{width: '44rem', background: 'white', borderRadius: '2px', position: 'absolute', left: '-4.8rem', top: '1.5rem', border: '1px solid #DEDEDE'}}>
                <div className={['d-none'].join(' ')} style={{width: '44rem', height: '1px', boxShadow: '0 0.09rem 0.2rem rgba(0, 0, 0, 0.22)', marginTop: '0.4rem', background: '#F7F7F7'}}></div>
                <div className={['container-fluid'].join(' ')}>
                    <div className={['row', 'p-2'].join(' ')}>
                    {
                        academyArts.map((art, index) => {
                            return (
                                <a className={['col-4', 'mb-2'].join(' ')} href={'https://honari.com/academy/category/' + art.url}><h3 key={index} className={['text-right', 'rtl', styles.menuArts].join(' ')} style={{fontSize: '14px'}}>{art.name}</h3></a>
                            )
                        })
                    }
                    </div>
                </div>
            </div>
        </React.Fragment>
    );

    const slashesCountInUrl = (url) => {
        let c = 0;
        for(let i=0; i<url.length; i++){
            if(url.charAt(i) === '/'){
                c++;
            }
        }
        return c;
    }

    const desktopSearchResults = () => {
        if(searchResults.length !== 0 && showSearchResults){
            return (
                <div className={['d-flex', 'flex-column'].join(' ')} style={{background: 'white', display: 'flex', position: 'absolute', top: '2.6rem', minWidth: '10rem', width: desktopSearchBarWidth, zIndex: '999999999', borderRadius: '2px', border: '1px solid #D8D8D8'}}>
                    <div className={['d-flex', 'flex-row', 'ltr', 'text-left', 'justify-content-left', 'pt-2', 'px-2'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/close_gray_small.png'} className={['pointer'].join(' ')} style={{width: '17px', heigth: '17px'}} onClick={() => {setShowSearchResults(false); setShouldDesktopSearchBarBeOpen(false); setDsw('300px');}} />
                    </div>
                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between', 'px-2', 'pt-2'].join(' ')}>
                        <h5 className={['mb-0', 'pb-2'].join(' ')} style={{fontSize: '14px', color: '#949494'}}><b>پیشنهاد در دسته‌ها</b></h5>
                        <h6 className={['mb-0', 'pointer'].join(' ')} style={{fontSize: '12px', color: '#00BAC6'}} onClick={()=>{setMoreSearchCategoriesClass('d-flex')}}>{moreSearchCategoriesClass === 'd-none' ? "مشاهده همه" : ''}</h6>
                    </div>
                    {
                        searchResults.map((item, index) => {
                            if(item.fields === null){
                                if(index <= 2){
                                    return(
                                        <Link key={index} href={'/search/SearchWithCategory/?query=' + item.category}>
                                            <a onClick={props.reduxStartLoading} className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'px-2', 'mt-2', ].join(' ')}>
                                                <h6 className={['mt-1', 'mb-0'].join(' ')} style={{fontSize: '13px', color: 'black'}} key={index}>{item.category}</h6>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/vector.png'} style={{width: '10px', height: '10px'}} />
                                            </a>
                                        </Link>
                                    );
                                }else{
                                    return(
                                        <Link key={index} href={'/search/SearchWithCategory/?query=' + item.category}>
                                            <a onClick={props.reduxStartLoading} className={['flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'px-2', 'mt-2', moreSearchCategoriesClass].join(' ')}>
                                                <h6 className={['mt-1', 'mb-0'].join(' ')} style={{fontSize: '13px', color: 'black'}} key={index}>{item.category}</h6>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/vector.png'} style={{width: '10px', height: '10px'}} />
                                            </a>
                                        </Link>
                                    );
                                }
                            }
                        })
                    }
                    <div className={['w-100', 'mt-3'].join(' ')} style={{background: '#DEDEDE', height: '1px'}}></div>
                    <h6 className={['text-right', 'px-2', 'py-3', 'mb-0'].join(' ')} style={{fontSize: '14px', color: '#949494'}}><b>پیشنهاد در محصولات</b></h6>
                    <div className={['d-flex', 'flex-column'].join(' ')} style={{maxHeight: '200px', overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: '#D8D8D8'}}>
                    {
                        searchResults.map((item, index) => {
                            if(item.fields !== null){
                                return(
                                    <Link key={index} href={item.fields.product_url}>
                                        <a onClick={props.reduxStartLoading} key={index} className={['d-flex', 'flex-row', 'align-items-center', 'pointer', 'p-2', 'm-2'].join(' ')} style={{border: '1px solid rgba(216, 216, 216, 0.1)', borderRadius: '3px', boxShadow: '0 2px 4px 0 rgba(222, 222, 222, 0.4)'}}>
                                            <img src={item.fields.product_image} style={{width: '46px', height: '46px'}} />
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between'].join(' ')} style={{flex: '1'}}>
                                                <h6 className={['mb-0', 'rtl', 'pr-2'].join(' ')} style={{fontSize: '13px', color: 'black'}}>{item.fields.product_title}</h6>
                                                {
                                                    item.fields.has_stock === 'true'
                                                    ?
                                                        <h6 className={['mb-0', 'rtl'].join(' ')} style={{fontSize: '13px', color: 'black'}}>{parseInt(item.fields.product_price).toLocaleString() + " تومان"}</h6>
                                                    :
                                                        <h6 className={['mb-0', 'px-2', 'py-1'].join(' ')} style={{fontSize: '13px', color: '#00BAC6', background: '#F7F7F7', borderRadius: '2px'}}>ناموجود</h6>
                                                }
                                            </div>
                                        </a>
                                    </Link>
                                );
                            }
                        })
                    }
                    </div>
                    <div className={['w-100', 'mt-0'].join(' ')} style={{background: '#DEDEDE', height: '1px'}}></div>
                    <h6 className={['text-right', 'px-2', 'py-3', 'mb-0'].join(' ')} style={{fontSize: '14px', color: '#949494'}}><b>آموزش‌ها و کلاس‌ها</b></h6>
                    <div className={['d-flex', 'flex-column', 'pb-2'].join(' ')} style={{maxHeight: '200px', overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: '#D8D8D8'}}>
                    {
                        classSearchResults.map((item, index) => {
                            if(item.fields !== null){
                                if(slashesCountInUrl(item.fields.url) < 6 || item.fields.name.search("جلسه اول") >= 0){
                                    return(
                                        <Link key={index} href={item.fields.url}>
                                            <a onClick={props.reduxStartLoading} key={index} className={['d-flex', 'flex-row', 'align-items-center', 'pointer', 'p-2', 'm-2'].join(' ')} style={{border: '1px solid rgba(216, 216, 216, 0.1)', borderRadius: '3px', boxShadow: '0 1px 4px 0 rgba(222, 222, 222, 0.4), 0 1px 5px 0 rgba(222, 222, 222, 0.4)'}}>
                                                <img src={item.fields.image_url} style={{width: '46px', height: '46px'}} />
                                                <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between'].join(' ')} style={{flex: '1'}}>
                                                    <h6 className={['mb-0', 'rtl', 'pr-2'].join(' ')} style={{fontSize: '13px', color: 'black'}}>{item.fields.name}</h6>
                                                    {/*
                                                        item.fields.has_stock === 'true'
                                                        ?
                                                            <h6 className={['mb-0', 'rtl'].join(' ')} style={{fontSize: '13px', color: 'black'}}>{parseInt(item.fields.product_price).toLocaleString() + " تومان"}</h6>
                                                        :
                                                            <h6 className={['mb-0', 'px-2', 'py-1'].join(' ')} style={{fontSize: '13px', color: '#00BAC6', background: '#F7F7F7', borderRadius: '2px'}}>ناموجود</h6>
                                                    */}
                                                </div>
                                            </a>
                                        </Link>
                                    );
                                }
                            }
                        })
                    }
                    </div>
                </div>
            );
        }else{
            return null;
        }
    }

    

    const phoneSearchResults = (
                <div className={['d-md-none', 'w-100'].join(' ')} style={{background: 'white', width: windowWidth, height: windowHeight, overflowY: 'scroll', overflowX: 'hidden'}}>
                    <form method='GET' action='/search/SearchResult' className={['d-flex', 'flex-row', 'ltr', 'text-left', 'justify-content-between', 'align-items-center', 'pt-2', 'px-2'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/close_gray_small.png'} className={['pointer'].join(' ')} style={{width: '17px', heigth: '17px'}} onClick={toggleSearchDrawer('top', false)} />
                        <input name='query' type='search' autoComplete='off' placeholder='جست و جو کنید' onChange={getSearchResults} className={['rtl', 'px-2', 'mx-2'].join(' ')} style={{fontSize: '16px', height: '30px', border: 'none', outlineStyle: 'none', outlineOffset: 'none', outlineColor: 'none', background: 'white', flex: '1', borderBottom: '1px solid #DEDEDE'}} />
                        <img src={Constants.baseUrl + '/assets/images/main_images/search_main.png'} onClick={() => {if(phoneSearchInput.length !== 0){window.location.href = '/search/SearchResult?query=' + phoneSearchInput}}} className={['pointer'].join(' ')} style={{width: '17px', height: '17px'}}  />
                    </form>
                    {
                        searchResults.length !== 0
                        ?
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between', 'px-2', 'pt-2'].join(' ')}>
                            <h5 className={['mb-0'].join(' ')} style={{fontSize: '14px', color: '#949494'}}><b>پیشنهاد در دسته‌ها</b></h5>
                            <h6 className={['mb-0', 'pointer'].join(' ')} style={{fontSize: '12px', color: '#00BAC6'}} onClick={()=>{setMoreSearchCategoriesClass('d-flex')}}>{moreSearchCategoriesClass === 'd-none' ? "مشاهده همه" : ''}</h6>
                        </div>
                        :
                        null
                    }
                    {
                        searchResults.map((item, index) => {
                            if(item.fields === null){
                                if(index <= 2){
                                    return(
                                        <Link key={index} href={'/search/SearchWithCategory/?query=' + item.category}>
                                            <a onClick={props.reduxStartLoading} className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'px-2', 'mt-2', 'rtl'].join(' ')}>
                                                <h6 className={['mt-1', 'mb-0'].join(' ')} style={{fontSize: '13px', color: 'black'}} key={index}>{item.category}</h6>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/vector.png'} style={{width: '10px', height: '10px'}} />
                                            </a>
                                        </Link>
                                    );
                                }else{
                                    return(
                                        <Link key={index} href={'/search/SearchWithCategory/?query=' + item.category}>
                                            <a className={['flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'px-2', 'mt-2', 'rtl', moreSearchCategoriesClass].join(' ')}>
                                                <h6 className={['mt-1', 'mb-0'].join(' ')} style={{fontSize: '13px', color: 'black'}} key={index}>{item.category}</h6>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/vector.png'} style={{width: '10px', height: '10px'}} />
                                            </a>
                                        </Link>
                                    );
                                }
                            }
                        })
                    }
                    {
                        searchResults.length !== 0 
                        ?
                        <React.Fragment>
                            <div className={['w-100', 'mt-2'].join(' ')} style={{background: '#DEDEDE', height: '1px'}}></div>
                            <h6 className={['text-right', 'px-2', 'pt-2', 'pb-0', 'mb-2'].join(' ')} style={{fontSize: '14px', color: '#949494'}}><b>پیشنهاد در محصولات</b></h6>
                        </React.Fragment>
                        :
                        null
                    }
                    <div className={['d-flex', 'flex-column'].join(' ')} style={{ maxHeight: '200px', overflowY: 'scroll', overflowX: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#D8D8D8' }}>
                    {
                        searchResults.map((item, index) => {
                            if(item.fields !== null){
                                return(
                                    <Link key={index} href={item.fields.product_url}>
                                        <a onClick={props.reduxStartLoading} key={index} className={['d-flex', 'flex-row', 'align-items-center', 'pointer', 'p-2', 'm-2', 'rtl'].join(' ')} style={{border: '1px solid rgba(216, 216, 216, 0.1)', borderRadius: '3px', boxShadow: '0 2px 4px 0 rgba(222, 222, 222, 0.4)'}}>
                                            <img src={item.fields.product_image} style={{width: '36px', height: '36px'}} />
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between'].join(' ')} style={{flex: '1'}}>
                                                <h6 className={['mb-0', 'rtl', 'pr-2', 'text-right'].join(' ')} style={{fontSize: '13px', color: 'black'}}>{item.fields.product_title}</h6>
                                                {
                                                    item.fields.has_stock === 'true'
                                                    ?
                                                        <h6 className={['mb-0', 'rtl'].join(' ')} style={{fontSize: '13px', color: 'black'}}>{parseInt(item.fields.product_price).toLocaleString() + " تومان"}</h6>
                                                    :
                                                        <h6 className={['mb-0', 'px-2', 'py-1'].join(' ')} style={{fontSize: '13px', color: '#00BAC6', background: '#F7F7F7', borderRadius: '2px'}}>ناموجود</h6>
                                                }
                                            </div>
                                        </a>
                                    </Link>
                                );
                            }
                        })
                    }
                    </div>
                    {
                        searchResults.length !== 0
                        ?
                        <React.Fragment>
                            <div className={['w-100', 'mt-0'].join(' ')} style={{background: '#DEDEDE', height: '1px'}}></div>
                            <h6 className={['text-right', 'px-2', 'pt-2', 'pb-0', 'mb-2'].join(' ')} style={{fontSize: '14px', color: '#949494'}}><b>آموزش‌ها و کلاس‌ها</b></h6>
                        </React.Fragment>
                        :
                        null
                    }
                    <div className={['d-flex', 'flex-column', 'pb-2'].join(' ')} style={{maxHeight: '200px', overflowY: 'scroll', overflowX: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#D8D8D8'}}>
                    {
                        classSearchResults.map((item, index) => {
                            if(item.fields !== null){
                                if(slashesCountInUrl(item.fields.url) < 6 || item.fields.name.search("جلسه اول") >= 0){
                                    return(
                                        <Link key={index} href={item.fields.url}>
                                            <a onClick={props.reduxStartLoading} key={index} className={['d-flex', 'flex-row', 'align-items-center', 'pointer', 'p-2', 'm-2', 'rtl'].join(' ')} style={{border: '1px solid rgba(216, 216, 216, 0.1)', borderRadius: '3px', boxShadow: '0 1px 4px 0 rgba(222, 222, 222, 0.4), 0 1px 5px 0 rgba(222, 222, 222, 0.4)'}}>
                                                <img src={item.fields.image_url} style={{width: '36px', height: '36px'}} />
                                                <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between'].join(' ')} style={{flex: '1'}}>
                                                    <h6 className={['mb-0', 'rtl', 'pr-2', 'text-right'].join(' ')} style={{fontSize: '13px', color: 'black'}}>{item.fields.name}</h6>
                                                    {/*
                                                        item.fields.has_stock === 'true'
                                                        ?
                                                            <h6 className={['mb-0', 'rtl'].join(' ')} style={{fontSize: '13px', color: 'black'}}>{parseInt(item.fields.product_price).toLocaleString() + " تومان"}</h6>
                                                        :
                                                            <h6 className={['mb-0', 'px-2', 'py-1'].join(' ')} style={{fontSize: '13px', color: '#00BAC6', background: '#F7F7F7', borderRadius: '2px'}}>ناموجود</h6>
                                                    */}
                                                </div>
                                            </a>
                                        </Link>
                                    );
                                }
                            }
                        })
                    }
                    </div>
                </div>
       
    ); 

    return (
        <React.Fragment>
            <Drawer anchor="right" open={drawerState['right']} onClose={toggleDrawer('right', false)}>
                <RightMenu />
            </Drawer>
            <Drawer anchor="left" open={drawerState['left']} onClose={toggleCartDrawer('left', false)}>
                {phoneCartLayout}
            </Drawer>
            <Drawer anchor="top" open={drawerState['top']} onClose={toggleSearchDrawer('top', false)}>
                {phoneSearchResults}
            </Drawer>
            {
                props.reduxSnackbar.success.show
                ?
                    startSuccessSnackBarTimer()
                :
                    null
            }
            {
                props.reduxSnackbar.warning.show
                ?
                    startWarningSnackBarTimer()
                :
                    null
            }
            {
                props.reduxSnackbar.error.show
                ?
                    startErrorSnackBartTimer()
                :
                    null
            }
            {
                props.reduxSnackbar.success.show
                ?
                <div className={['d-flex', 'flex-row', 'rtl', 'mr-2', 'mb-2', 'px-3', 'py-2', 'align-items-center'].join(' ')} style={{background: '#108a00', color: 'white', position: 'fixed', bottom: '0', right: '0', borderRadius: '2px', zIndex: '5000'}}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/tick_white_small.png'} className={['ml-2'].join(' ')} style={{width: '20px', height: '20px'}} />
                    <span>{props.reduxSnackbar.success.title}</span>
                </div>
                :
                null
            }
            {
                props.reduxSnackbar.warning.show
                ?
                <div className={['d-flex', 'flex-row', 'rtl', 'mr-2', 'mb-2', 'px-3', 'py-2', 'align-items-center'].join(' ')} style={{background: '#E8A138', color: 'white', position: 'fixed', bottom: '0', right: '0', borderRadius: '2px', zIndex: '5000'}}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/alert_white_small.png'} className={['ml-2'].join(' ')} style={{width: '20px', height: '20px'}} />
                    <span>{props.reduxSnackbar.warning.title}</span>
                </div>
                :
                null
            }
            {
                props.reduxSnackbar.error.show
                ?
                <div className={['d-flex', 'flex-row', 'rtl', 'mr-2', 'mb-2', 'px-3', 'py-2', 'align-items-center'].join(' ')} style={{background: '#a60000', color: 'white', position: 'fixed', bottom: '0', right: '0', borderRadius: '2px', zIndex: '5000'}}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/close_white_small.png'} className={['ml-2'].join(' ')} style={{width: '20px', height: '20px'}} />
                    <span>{props.reduxSnackbar.error.title}</span>
                </div>
                :
                null
            }
            <div className={['container-fluid', 'p-0', props.reduxUser.status == 'LOGIN' ? 'desktopHeaderBackgroundFlowers' : ''].join(' ')} style={{position: 'sticky', top: '0', zIndex: '500', backgroundColor: '#FFFFFF'}}>
            {
                props.reduxUser.status === 'LOGIN'
                ?
                (
                    <React.Fragment>
                        <div className={['d-none', 'd-xl-none'].join(' ')} style={{position: 'absolute', top: '0', left: '0', bottom: '3rem'}}>
                            <img src={Constants.baseUrl + '/assets/images/main_images/desktop_flower_left.png'} className={[''].join(' ')} style={{height: '100%'}} />
                        </div>
                        <div className={['d-none', 'd-xl-none'].join(' ')} style={{position: 'absolute', top: '0', right: '0.7rem', bottom: '3rem'}}>
                            <img src={Constants.baseUrl + '/assets/images/main_images/desktop_flower_right.png'} className={[''].join(' ')} style={{height: '100%'}} />
                        </div>
                    </React.Fragment>
                )
                :
                null
            }
            {
                props.reduxLoad === true ? <div className={['w-100'].join(' ')} style={{position: 'absolute', top: '0', left: '0', zIndex: '3000'}}><StyledLinearProgressActive /></div> : null
            }
            <div className={['container'].join(' ')}>
                {/*
                    props.home == true 
                    ?
                    <React.Fragment>
                    <div className={['row', 'rtl', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'd-lg-none', 'p-2', 'mt-2'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/menu_black_small.png'} style={{width: '27px', height: '27px'}} onClick={toggleDrawer('right', true)} />
                        <img src={Constants.baseUrl + '/assets/images/main_images/honari.png'} style={{width: '40px', height: '40px'}} />
                        {
                            props.reduxUser.status == 'LOGIN'
                            ?
                                <div onClick={() => {setRightMenuHeaderNumber(2)}} className={['pointer'].join(' ')}><img onClick={toggleDrawer('right', true)} src={Constants.baseUrl + '/assets/images/main_images/user_black.png'} className={['d-lg-none'].join(' ')} style={{width: '27px', height: '27px'}}/></div>
                            :
                            (
                                <Link href='/user'>
                                    <a onClick={props.reduxStartLoading} className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-left'].join(' ')}>
                                        <img src={Constants.baseUrl + '/assets/images/main_images/login_rtl_black.png'} style={{width: '27px', height: '27px'}}/>
                                        <h5 className={['mr-2', 'mb-0'].join(' ')} style={{fontSize: '14px'}}>ورود</h5>
                                    </a>
                                </Link>
                            )
                        }
                    </div>
                    <div className={['row', 'mt-2', 'd-none'].join(' ')} style={{height: '1px', background: '#DEDEDE'}}></div>
                    </React.Fragment>
                    :
                    null
                */}
                <div className={['row', 'py-0', 'mb-0', 'px-1', 'd-none', 'd-lg-flex'].join(' ')} style={{direction: 'rtl'}}>
                    <div className={['col-7', 'col-lg-9', 'rtl', 'text-right', 'd-flex', 'flex-row', 'pr-0', 'pr-lg-1', 'align-items-center',  'pl-0', 'pb-2', 'pt-2', 'justify-content-lg-between'].join(' ')} >
                        <div className={['d-flex', 'flex-row', 'rtl', 'desktopInfo  '].join(' ')}>
                            <Link href={'/'}><img onClick={props.reduxStartLoading} src={Constants.baseUrl + '/assets/images/main_images/honari.png'} className={['pointer', 'd-none', 'd-lg-block'].join(' ')} style={{width: '50px', height: '50px', position: 'relative', top: '0.28rem'}} /></Link>
                            <div className={['pr-0', 'flex-column', 'align-items-center', 'd-none', 'd-lg-flex'].join(' ')}>
                                <Link href={'/'}><a onClick={props.reduxStartLoading} className={['w-100'].join(' ')}><h1 className={['pr-3', 'align-self-start', 'm-0', 'pointer', 'text-right'].join(' ')} style={{fontSize: '24px', color: '#00bac6'}}>هـنـری</h1></a></Link>
                                <p className={['pr-3', 'align-self-end', 'mb-0', 'mt-2'].join(' ')}>آموزش، الگو، مواداولیه</p>
                            </div>
                        </div>
                        <form action='/search/SearchResult' method='GET' ref={desktopSearchBar} className={['rounded-sm', 'd-none', 'd-lg-flex', 'flex-row', 'rtl', 'w-100'].join(' ')} style={{position: 'relative', right: '3rem'}}>
                            <button type='submin' className={['p-2', 'pointer'].join(' ')} style={{borderRadius: '0 4px 4px 0', border: 'none', backgroundColor: '#00bac6', width: '40px'}}><img src={Constants.baseUrl + '/assets/images/main_images/search_white.png'} style={{width: '100%', padding: '2px'}}/></button>
                            <input onMouseEnter={() => {setDsw('80%');}} onMouseLeave={()=>{if(!shouldDesktopSearchBarBeOpen){setDsw('300px')}}} onClick={()=>{setDsw('80%'); setShouldDesktopSearchBarBeOpen(true)}} name='query' type='text' onChange={getSearchResults} placeholder='عبارت مورد نظر را جستجو کنید' className={['pr-2', styles.desktopSearchBar].join(' ')} style={{fontSize: '14px', width: dsw, height: '42px', outline: 'none', outlineOffset: 'none', border: '1px solid #C4C4C4', borderRadius: '4px 0 0 4px'}} />
                            {desktopSearchResults()}
                        </form> 
                    </div>
                    <div className={['col-5', 'col-lg-3', 'text-left', 'd-flex', 'align-items-center', 'ltr', 'px-0', 'pt-2', 'pb-2'].join(' ')} >
                        <div className={['ltr', 'align-items-center', 'p-2', 'pointer', 'd-none', 'd-md-flex', 'flex-row'].join(' ')} style={{position: 'relative'}} onMouseEnter={()=>{setCartOpenState(true)}} onMouseLeave={()=>{setCartOpenState(false)}}>
                            {
                                props.reduxCart.status === 'HI'
                                ?
                                (
                                    <span className={['bg-danger', 'px-2', 'mr-1', 'rounded'].join(' ')} style={{color: 'white', fontSize: '14px'}}>{props.reduxCart.information.length}</span>
                                )
                                :
                                <span className={['bg-danger', 'px-2', 'mr-1', 'rounded'].join(' ')} style={{color: 'white', fontSize: '14px'}}>0</span>
                            }
                            {/*
                                newCartProductsNumber !== null || newCartProductsNumber !== undefined
                                ?
                                    <span className={['bg-danger', 'px-2', 'mr-1', 'rounded'].join(' ')} style={{color: 'white', fontSize: '14px'}}>{cartProductsNumber}</span>
                                :
                                    <span className={['bg-danger', 'px-2', 'mr-1', 'rounded'].join(' ')} style={{color: 'white', fontSize: '14px'}}>{newCartProductsNumber}</span>
                            */}
                            <Link href='/cart/shoppingCart'><a onClick={props.reduxStartLoading} className={['m-0', 'd-none', 'd-md-block'].join(' ')} style={{}}><small>سبد خرید</small></a></Link>
                            <img src={Constants.baseUrl + '/assets/images/cart.svg'} className={['ml-1'].join(' ')} style={{width: '20px'}} />    
                            {
                                cartOpenState === true 
                                ? 
                                    DesktopCart 
                                :
                                    null
                            }
                        </div>
                        <div>
                        {
                            props.reduxUser.status === 'GUEST' || props.reduxUser.status === 'NI'
                            ?
                            <a href="https://honari.com/user" className={['ltr', 'align-items-center', 'ml-1', 'p-2', 'pointer', 'd-none', 'd-md-flex'].join(' ')}>
                                <small className={['m-0'].join(' ')} style={{fontSize: '11px'}}>ورود</small>
                                <img src={Constants.baseUrl + '/assets/images/user.svg'} className={['ml-1'].join(' ')} style={{width: '20px'}} />    
                            </a>
                            :
                            (
                                props.reduxUser.status === 'LOGIN'
                                ?
                                <Link href={'/users/view'}>
                                    <a onClick={props.reduxStartLoading} className={['ltr', 'align-items-center', 'ml-1', 'p-2', 'pointer', 'd-none', 'd-md-flex'].join(' ')} onMouseEnter={userMouseEntered} onMouseLeave={userMouseLeft}>
                                        <small className={['m-0'].join(' ')} style={{}}>{props.reduxUser.information.name}</small>
                                        <img src={Constants.baseUrl + '/assets/images/user.svg'} className={['ml-1'].join(' ')} style={{width: '20px'}} />    
                                    </a>
                                </Link>
                                :
                                null
                            )
                        }
                        <div onMouseEnter={userMouseEntered} onMouseLeave={userMouseLeft} className={['flex-column', showUserPofileSummary ? 'd-flex' : 'd-none', 'shadow-sm'].join(' ')} style={{position: 'absolute', left: '0.3rem', top: '3rem', width: '16rem', zIndex: '888888888888888888', background: 'white', borderRadius: '2px'}}>
                            <Link href='/users/view'>
                                <a onClick={props.reduxStartLoading} className={['d-flex', 'flex-row', 'align-items-center', 'rtl', 'justify-content-right', 'p-2'].join(' ')}>
                                    <img src={Constants.baseUrl + '/assets/images/user.svg'} style={{width: '30px', height: '30px'}} />
                                    <div className={['d-flex', 'flex-column', 'pr-2'].join(' ')}>
                                        <h6 className={['mb-0', 'text-right', 'rtl', 'font-weight-bold'].join(' ')} style={{fontSize: '12px', color: '#00BAC6'}}>{props.reduxUser.information.name}</h6>
                                        <h6 className={['mb-0', 'text-right', 'rtl', 'mt-1'].join(' ')} style={{fontSize: '12px', color: '#00BAC6'}}>{props.reduxUser.information.username}</h6>
                                    </div>
                                </a>
                            </Link>
                            <Link href='/users/charge_account'>
                                <a onClick={props.reduxStartLoading} className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-right', 'rtl', 'text-right', 'pr-2', 'mt-2'].join(' ')}>
                                    <img src={Constants.baseUrl + '/assets/images/main_images/panel_wallet_black.svg'} style={{width: '20px', height: '20px'}} />
                                    <h6 className={['mb-0', 'pr-2', 'rtl', 'text-right'].join(' ')} style={{fontSize: '13px'}}>شارژ حساب کاربری</h6> 
                                </a>
                            </Link>
                            <Link href='/users/orders'>
                                <a onClick={props.reduxStartLoading} className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-right', 'rtl', 'text-right', 'mt-4', 'pr-2'].join(' ')}>
                                    <img src={Constants.baseUrl + '/assets/images/main_images/panel_cart_black.svg'} style={{width: '20px', height: '20px'}} />
                                    <h6 className={['mb-0', 'pr-2', 'rtl', 'text-right'].join(' ')} style={{fontSize: '13px'}}>سفارشات من</h6> 
                                </a>
                            </Link>
                            <a href='https://honari.com/academy/user/courses' className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-right', 'rtl', 'text-right', 'mt-4', 'pr-2'].join(' ')}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/panel_video_black.svg'} style={{width: '20px', height: '20px'}} />
                                <h6 className={['mb-0', 'pr-2', 'rtl', 'text-right'].join(' ')} style={{fontSize: '13px'}}>کلاس‌های من</h6> 
                            </a>
                            <div onClick={logoutUserButtonClicked} className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-right', 'rtl', 'text-right', 'mt-4', 'pr-2', 'pointer', 'mb-3'].join(' ')}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/logout_red.png'} style={{width: '20px', height: '20px'}} />
                                <h6 className={['mb-0', 'pr-2', 'rtl', 'text-right'].join(' ')} style={{fontSize: '13px', color: 'red'}}>خروج از حساب کاربری</h6> 
                            </div>
                            <Link href='/users/view'>
                                <a onClick={props.reduxStartLoading} className={['text-center', 'py-2', 'mx-2', 'mb-2'].join(' ')} style={{background: '#00BAC6', color: 'white', fontSize: '17px', borderRadius: '3px'}}>اطلاعات حساب من</a>
                            </Link>
                        </div>  
                        </div>
                        <form onSubmit={searchFormSubmited} onSubmitCapture={null} className={['col-12', 'm-0', 'p-2', 'align-items-center', 'ml-2', 'ml-md-0', menuSearchBar].join(' ')} style={{border: '1px solid #00bac6', borderRadius: '18px'}}>
                            <img src={Constants.baseUrl + '/assets/images/main_images/cross_main.png'} style={{width: '22px'}} className={['ml-1', 'pointer'].join(' ')} onClick={()=>{setMenuSearchBar('d-none'); setOtherMenuItems('d-flex');}}/>
                            <input onSubmit={null} type="search" className={['w-100', 'text-right'].join(' ')} style={{direction: 'rtl', outline: 'none', outlineOffset: 'none',  borderStyle: 'none', fontSize: '12px'}} placeholder='در هنری جستجو کنید ...'/>
                            <img src={Constants.baseUrl + '/assets/images/main_images/search_main.png'} style={{width: '22px'}} className={['ml-1', 'pointer'].join(' ')} onClick={searchFormSubmited}/>
                        </form>
                    </div>
                </div>
                <div className={['row', 'pt-2', 'mb-0', 'pb-2', 'px-1', 'd-lg-none', 'align-items-center'].join(' ')} style={{direction: 'rtl'}}>
                    
                    <img src={Constants.baseUrl + '/assets/images/main_images/menu_black_small.png'} className={['pointer'].join(' ')} style={{width: '30px'}} onClick={toggleDrawer('right', true)} />
                    <Link href='/'><img onClick={props.reduxStartLoading} src={Constants.baseUrl + '/assets/images/main_images/honari.png'} className={['mr-2', 'ml-1', 'pointer'].join(' ')} style={{width: '30px', height: '30px'}} /></Link>
                       
                    <div onClick={toggleSearchDrawer('top', true)} className={['d-flex', 'flex-row', 'ltr', 'd-lg-none', 'pr-1', 'align-items-center', 'justify-content-right', 'ml-2'].join(' ')} style={{height: '30px', flex: '1'}} >
                        <div onClick={() => {if(phoneSearchInput.length !== 0){window.location.href = '/search/SearchResult?query=' + phoneSearchInput}}} className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-center', 'p-0', 'pointer'].join(' ')} style={{width: '30px', height: '30px', background: '#FFFFFF', borderTop: '1px solid #D8D8D8', borderBottom: '1px solid #D8D8D8', borderLeft: '1px solid #D8D8D8', borderRadius: '3px 0px 0px 3px'}}>
                            <img src={Constants.baseUrl + '/assets/images/main_images/search_main.png'} className={['pointer'].join(' ')} style={{width: '15px', height: '15px'}}/>
                        </div>
                        <div className={['d-none'].join(' ')} style={{height: '30px', background: '#F7F7F7'}}>
                        </div>
                        <p className={['rtl', 'px-2', 'mb-0', 'pt-1', 'text-right'].join(' ')} style={{fontSize: '14px', width: '100%', height: '30px', border: 'none', color: '#C4C4C4', outlineStyle: 'none', background: '#FFFFFF', border: '1px solid #D8D8D8', borderRadius: '0px 3px 3px 0px'}} >جست و جو کنید</p> 
                    </div>
                    
                    <div className={['ltr', 'align-items-center', 'pointer'].join(' ')} onClick={() => {setRightMenuHeaderNumber(2)}}>
                        {
                            props.reduxUser.status === 'GUEST' || props.reduxUser.status == 'NI' ?
                                <a href='https://honari.com/user' className={['px-3', 'py-1', 'pointer'].join(' ')} style={{borderRadius: '3px', fontSize: '11px', backgroundColor: '#00BAC6', color: 'white', position: 'relative', bottom: '0.06rem'}}>ورود</a>
                            :
                            null
                        }
                    </div>    
                       
                    <div className={['ltr', 'align-items-center', 'p-2', 'pr-0', 'mr-0', 'pointer', 'd-lg-none', 'flex-row'].join(' ')} style={{position: 'relative'}}>
                        <img src={Constants.baseUrl + '/assets/images/cart.svg'} className={['ml-0'].join(' ')} style={{width: '25px'}} onClick={toggleCartDrawer('left', true)} />
                            {
                                props.reduxCart.status === 'HI'
                                ?
                                (
                                    <span className={['pl-2', 'pr-2', 'mr-0', 'rounded'].join(' ')} style={{color: 'white', fontSize: '11px', position: 'relative', bottom: '0.7rem', left: '-0.2rem', background: '#F15F58'}}>{props.reduxCart.information.length}</span>
                                )
                                :
                                null
                            }
                            {/*
                                newCartProductsNumber !== null || newCartProductsNumber !== undefined
                                ?
                                    <span className={['bg-danger', 'px-2', 'mr-1', 'rounded'].join(' ')} style={{color: 'white', fontSize: '14px'}}>{cartProductsNumber}</span>
                                :
                                    <span className={['bg-danger', 'px-2', 'mr-1', 'rounded'].join(' ')} style={{color: 'white', fontSize: '14px'}}>{newCartProductsNumber}</span>
                            */}    
                    </div>
                </div>
            </div>
            <div className={['container-fluid', 'd-none', 'd-lg-block', 'align-items-center'].join(' ')} style={{backgroundColor: '#F7F7F7', height: '48px', borderBottom: '0px solid #EDEDED'}}>
                <div className={['row', 'rtl', 'shadow-sm'].join(' ')} style={{borderTop: '1px solid #EDEDED', borderBottom: '1px solid #EDEDED'}}>
                    <div className={['row', 'py-0'].join(' ')} style={{height: '1px', backgroundColor: '#C4C4C4'}}></div>
                    <div className={['container', 'rtl', 'px-0', 'd-flex', 'flex-row', 'align-items-center'].join(' ')}>
                        <div className={['row', 'd-flex', 'flex-row', 'align-items-center', 'w-100', 'pr-4'].join(' ')} style={{height: '48px', borderBottom: '1px solid #F7F7F7'}}>
                            <ul className={['px-2', 'rtl','d-flex', 'justify-content-between'].join(' ')} style={{backgroundColor: '#F7F7F7', boxShadow: 'none', paddingBottom: '1px', marginBottom: '0px', marginTop: '14px', height: '35px'}}>
                                {
                                    props.menu.menu.map((item, counter)=>{
                                        if(counter < 10){
                                            return <Link href={item.parentUrl.substr(18)}><a onClick={props.reduxStartLoading}><li className={[styles.desktopHeaderParentMenu, 'list-group-item', 'pointer', 'm-0', 'text-center', 'rounded-0','pr-2', 'pl-2', 'mt-0', 'font-weight-normal  ', setActived(selectedMenu)].join(' ')} style={{height: '100%', color: getHoveredItemColor(item.parentName)}}  onMouseEnter={()=>{setHover({status: true, number: counter, title: item.parentName})}} onMouseLeave={()=>{setHover({status: false, number: counter, title: ''})}}>{item.parentName}</li></a></Link>
                                        }
                                    })
                                }
                                <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'pointer'].join(' ')} onMouseEnter={() => {setShowDesktopMoreMenus(true)}} onMouseLeave={() => {setShowDesktopMoreMenus(false)}} style={{position: 'relative', fontSize: '14px'}}>
                                    <li className={['mr-3', 'mb-2', 'pb-1'].join(' ')} style={{listStyleType: 'none'}}>سایر</li>
                                    <img src={Constants.baseUrl + '/assets/images/main_images/down_arrow_black_small.png'} className={['mr-1', 'mb-2'].join(' ')} style={{width: '7px', height: '7px'}} />
                                    
                                    <ul className={['flex-column', 'shadow-sm', 'p-2', showDesktopMoreMenus ? 'd-flex' : 'd-none'].join(' ')} onMouseEnter={() => {setShowDesktopMoreMenus(true)}} onMouseLeave={() => {setShowDesktopMoreMenus(false)}} style={{position: 'absolute', width: '7rem', right: '0', top: '2.1rem', background: 'white', borderRadius: '2px', border: '1px solid #DEDEDE', zIndex: '5000'}}>
                                    {
                                        props.menu.menu.map((item, cntr) => {
                                            if(cntr >= 10){
                                                return (
                                                    <Link href={item.parentUrl.substr(18)}><a onClick={props.reduxStartLoading} className={['text-right', 'mb-2', styles.desktopMoreItems].join(' ')}>{item.parentName}</a></Link>
                                                );
                                            }
                                        })
                                    }
                                    </ul>
                                </div>
                            </ul>
                            <div className={['text-center', 'mr-auto'].join(' ')} style={{position: 'relative'}}>
                                {
                                desktopAcademyArts
                                }
                                <a  href={'https://honari.com/academy'} onMouseEnter={academyMouseEntered} onMouseLeave={academyMouseLeft} className={[styles.desktopHeaderAcademyButton, 'px-0', 'py-1', 'text-center'].join(' ')} style={{position: 'absolute', top: '-0.95rem', left: '-5.8rem', width: '8rem'}}>هنری آکادمی</a>
                                <div onMouseOver={academyMouseEntered} onMouseLeave={academyMouseLeft} className={[''].join(' ')} style={{position: 'absolute', bottom: '-0.8rem', right: '1.25rem', height: '0.5rem', width: '100%'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={['d-lg-none'].join(' ')} style={{width: '100%', height: '1px', backgroundColor: '#C4C4C4'}}></div>
            {
                smallSearchBarState === true ? 
                    <form className={['d-flex', 'd-lg-none', 'flex-row', 'rtl', 'px-2', 'py-3', 'shadow-sm', 'align-items-center'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/search_main.png'} className={['pointer'].join(' ')} style={{width: '30px', padding: '4px'}} />
                        <input type='text' placeholder='جستجو کنید ...' className={['mx-1'].join(' ')} style={{outline: 'none', outlineOffset: 'none', borderStyle: 'none', width: '100%'}} />
                        <img src={Constants.baseUrl + '/assets/images/main_images/cross_main.png'} className={['pointer'].join(' ')} style={{width: '30px', padding: '4px'}} onClick={()=>{setSmallSearchBarState(false)}} />
                    </form>
                :
                null
            }
            
            </div>
            {
                
                    desktopMenu 
               
            }
            {
                props.home == true
                ?
                (
                <div className={['container'].join(' ')} style={{overflow: 'hidden'}}>
                    <div onClick={() => {setRightMenuHeaderNumber(0);}} className={['row', 'rtl', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'px-2', 'd-md-none', 'mt-3'].join(' ')}>
                        <button onClick={toggleDrawer('right', true)} className={['px-3', 'pointer', 'py-2'].join(' ')} style={{borderRadius: '16px', background: '#F2F2F2', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none'}}>دسته‌بندی محصولات</button>
                        <a href='https://honari.com/academy' className={['px-3', 'py-2', 'pointer'].join(' ')} style={{borderRadius: '16px', background: '#F2F2F2', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none'}}>دوره‌های آنلاین</a>
                        <Link href='/site/help'><a onClick={props.reduxStartLoading} className={['px-3', 'pointer', 'py-2'].join(' ')} style={{borderRadius: '16px', background: '#F2F2F2', fontSize: '11px', outlineStyle: 'none', borderStyle: 'none'}}>راهنمای خرید</a></Link>
                    </div>
                </div>
                )
                : 
                null
            }
        </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(BigHeader);
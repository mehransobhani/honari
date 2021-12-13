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

    const [state, setState] = React.useState({right: false});
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
    const [successNotificationShowing, setSuccessNotificationShowing] = useState(false);
    const [increaseProcessings, setIncreaseProcessings] = useState([]);
    const [decreaseProcessings, setDecreaseProcessings] = useState([]);
    const [removeProcessings, setRemoveProcessings] = useState([]);
    const [windowWidth, setWindowWidth] = useState(0);
    const [searchResults, setSearchResults] = useState([]);
    const [desktopSearchBarWidth, setDesktopSearchBarWidth] = useState(0);
    const [moreSearchCategoriesClass, setMoreSearchCategoriesClass] = useState('d-none');
    const [showSearchResults, setShowSearchResults] = useState(false);
    

    useEffect(() => {
        setWindowWidth(window.outerWidth);
        setShowSearchResults(false);
        setDesktopSearchBarWidth(desktopSearchBar.current.offsetWidth);
    }, []);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ right: open });
    };

    const toggleCartDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({left: open});
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
        axios.get(Constants.apiUrl + '/api/menu').then((res) => {
            let response = res.data;
            if(response.status == 'done'){
                if(response.found == true){
                    setMenu(response.menu);
                }else{
                    alert('موردی یافت نشد');
                }
            }
        }).catch((error) => {
            console.log(error);
        });
    }, []);

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
    }, []);

    const increaseProductCountByOne = (key) => {
        if(increaseProcessings[key] === false){
            if(props.reduxUser.status == 'GUEST'){
                let newIncreaseProcessings = [];
                let i = 0;
                for(i; i < increaseProcessings.length; i++){
                    if(key === i){
                        newIncreaseProcessings.push(true);
                    }else{
                        newIncreaseProcessings.push(increaseProcessings[i]);
                    }
                }
                setIncreaseProcessings(newIncreaseProcessings);
                axios.post(Constants.apiUrl + '/api/guest-check-cart-changes', {
                    productPackId: props.reduxCart.information[key].productPackId,
                    count: props.reduxCart.information[key].count + 1
                }).then((res) => {
                    let response = res.data;
                    if(response.status == 'done'){
                        updateProductInLocalStorage(key, response.count);
                        props.reduxIncreaseCountByOne(props.reduxCart.information[key].productPackId);
                        let newIncreaseProcessings = [];
                        let i =0;
                        for(i=0; i < increaseProcessings.length; i++){
                            if(key === i){
                                newIncreaseProcessings.push(false);
                            }else{
                                newIncreaseProcessings.push(increaseProcessings[i]);
                            }
                        }
                        setIncreaseProcessings(newIncreaseProcessings);
                        
                    }else if(response.status == 'failed'){
                        newIncreaseProcessings = [];
                        let i = 0;
                        for(i=0; i < increaseProcessings.length; i++){
                            if(key === i){
                                newIncreaseProcessings.push(false);
                            }else{
                                newIncreaseProcessings.push(increaseProcessings[i]);
                            }
                        }
                        setIncreaseProcessings(newIncreaseProcessings);
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                }).catch((error) => {
                    newIncreaseProcessings = [];
                    let i = 0;
                    for(i=0; i < increaseProcessings.length; i++){
                        if(key === i){
                            newIncreaseProcessings.push(false);
                        }else{
                            newIncreaseProcessings.push(increaseProcessings[i]);
                        }
                    }
                    setIncreaseProcessings(newIncreaseProcessings);
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                });
            }else if(props.reduxUser.status === 'LOGIN'){
                let newIncreaseProcessings = [];
                let i = 0;
                for(i; i < increaseProcessings.length; i++){
                    if(key === i){
                        newIncreaseProcessings.push(true);
                    }else{
                        newIncreaseProcessings.push(increaseProcessings[i]);
                    }
                }
                setIncreaseProcessings(newIncreaseProcessings);
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
                        let newIncreaseProcessings = [];
                        let i = 0;
                        for(i; i < increaseProcessings.length; i++){
                            if(key === i){
                                newIncreaseProcessings.push(false);
                            }else{
                                newIncreaseProcessings.push(increaseProcessings[i]);
                            }
                        }
                        setIncreaseProcessings(newIncreaseProcessings);
                    }else if(response.status == 'failed'){
                        let newIncreaseProcessings = [];
                        let i = 0;
                        for(i; i < increaseProcessings.length; i++){
                            if(key === i){
                                newIncreaseProcessings.push(false);
                            }else{
                                newIncreaseProcessings.push(increaseProcessings[i]);
                            }
                        }
                        setIncreaseProcessings(newIncreaseProcessings);
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                }).catch((error) => {
                    let newIncreaseProcessings = [];
                    let i = 0;
                    for(i; i < increaseProcessings.length; i++){
                        if(key === i){
                            newIncreaseProcessings.push(false);
                        }else{
                            newIncreaseProcessings.push(increaseProcessings[i]);
                        }
                    }
                    setIncreaseProcessings(newIncreaseProcessings);
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                });
            }
        }
    }

    const decreaseProductCountByOne = (key) => {
        if(props.reduxCart.information[key].count == 1){
            return;
        }
        if(decreaseProcessings[key]=== false){
            if(props.reduxUser.status == 'GUEST'){
                let newDecreaseProcessings = [];
                let i = 0;
                for(i; i < decreaseProcessings.length; i++){
                    if(key === i){
                        newDecreaseProcessings.push(true);
                    }else{
                        newDecreaseProcessings.push(decreaseProcessings[i]);
                    }
                }
                setDecreaseProcessings(newDecreaseProcessings);
                axios.post(Constants.apiUrl + '/api/guest-check-cart-changes', {
                    productPackId: props.reduxCart.information[key].productPackId,
                    count: props.reduxCart.information[key].count - 1
                }).then((res) => {
                    let newDecreaseProcessings = [];
                    let i = 0;
                    for(i; i < decreaseProcessings.length; i++){
                        if(key === i){
                            newDecreaseProcessings.push(false);
                        }else{
                            newDecreaseProcessings.push(decreaseProcessings[i]);
                        }
                    }
                    setDecreaseProcessings(newDecreaseProcessings);
                    let response = res.data;
                    if(response.status == 'done'){
                        updateProductInLocalStorage(key, response.count);
                        props.reduxDecreaseCountByOne(props.reduxCart.information[key].productPackId);
                    }else if(response.status == 'failed'){
                        newCart = [];
                        i = 0;
                        for(let item of cart){
                            if(i === key){
                                item.decreaseProcessing = false;
                            }
                            newCart.push(item);
                            i++;
                        }
                        setCart(newCart);
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                }).catch((error) => {
                    let newDecreaseProcessings = [];
                    let i = 0;
                    for(i; i < decreaseProcessings.length; i++){
                        if(key === i){
                            newDecreaseProcessings.push(false);
                        }else{
                            newDecreaseProcessings.push(decreaseProcessings[i]);
                        }
                    }
                    setDecreaseProcessings(newDecreaseProcessings);
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                });
            }else if(props.reduxUser.status == 'LOGIN'){
                let newDecreaseProcessings = [];
                let i = 0;
                for(i; i < decreaseProcessings.length; i++){
                    if(key === i){
                        newDecreaseProcessings.push(true);
                    }else{
                        newDecreaseProcessings.push(decreaseProcessings[i]);
                    }
                }
                setDecreaseProcessings(newDecreaseProcessings);
                axios.post(Constants.apiUrl + '/api/user-decrease-cart-by-one', {
                    productPackId: props.reduxCart.information[key].productPackId
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    let response = res.data;
                    if(response.status == 'done'){
                        let newDecreaseProcessings = [];
                        let i = 0;
                        for(i; i < decreaseProcessings.length; i++){
                            if(key === i){
                                newDecreaseProcessings.push(false);
                            }else{
                                newDecreaseProcessings.push(decreaseProcessings[i]);
                            }
                        }
                        setDecreaseProcessings(newDecreaseProcessings);
                        props.reduxDecreaseCountByOne(props.reduxCart.information[key].productPackId);
                    }else if(response.status === 'failed'){
                        let newDecreaseProcessings = [];
                        let i = 0;
                        for(i; i < decreaseProcessings.length; i++){
                            if(key === i){
                                newDecreaseProcessings.push(false);
                            }else{
                                newDecreaseProcessings.push(decreaseProcessings[i]);
                            }
                        }
                        setDecreaseProcessings(newDecreaseProcessings);
                        console.log(response.message);
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                }).catch((error) => {
                    let newDecreaseProcessings = [];
                    let i = 0;
                    for(i; i < decreaseProcessings.length; i++){
                        if(key === i){
                            newDecreaseProcessings.push(false);
                        }else{
                            newDecreaseProcessings.push(decreaseProcessings[i]);
                        }
                    }
                    setDecreaseProcessings(newDecreaseProcessings);
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
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
            }else if(props.reduxUser.status === 'LOGIN'){
                let newRemoveProcessings = [];
                let i = 0;
                for(i; i < removeProcessings.length; i++){
                    if(key === i){
                        newRemoveProcessings.push(true);
                    }else{
                        newRemoveProcessings.push(removeProcessings[i]);
                    }
                }
                setRemoveProcessings(newRemoveProcessings);
                axios.post(Constants.apiUrl + '/api/user-remove-from-cart', {
                    productPackId: props.reduxCart.information[key].productPackId
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    let newRemoveProcessings = [];
                    let i = 0;
                    for(i; i < removeProcessings.length; i++){
                        if(key === i){
                            newRemoveProcessings.push(false);
                        }else{
                            newRemoveProcessings.push(removeProcessings[i]);
                        }
                    }
                    setRemoveProcessings(newRemoveProcessings);
                    let response = res.data;
                    if(response.status == 'done'){
                        props.reduxRemoveFromCart(props.reduxCart.information[key].productPackId);
                    }else if(response.status == 'failed'){
                        console.error(response.message);
                        props.reduxUpdateSnackbar('warning', true, response.umessage);
                    }
                }).catch((error) => {
                    let newRemoveProcessings = [];
                    let i = 0;
                    for(i; i < removeProcessings.length; i++){
                        if(key === i){
                            newRemoveProcessings.push(false);
                        }else{
                            newRemoveProcessings.push(removeProcessings[i]);
                        }
                    }
                    setRemoveProcessings(newRemoveProcessings);
                    console.log(error);
                    props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
                });
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
        if(sumOfCartPrices() >= 200000){
            return 1;
        }else{
            //props.reduxUpdateSnackbar('error', true, (sumOfCartPrices() / 200000.0) );
            return sumOfCartPrices() / 200000;
        }
    }

    const getDeliveryPriceText = () => {
        let text = "هزینه ارسال رایگان است";
        if (sumOfCartPrices() >= 200000){
            return (<p className={['col-12', 'mb-0', 'text-right', 'mt-1', 'px-0'].join(' ')} style={{fontSize: '12px', color: '#00BAC6'}}>هزینه ارسال رایگان است</p>);
        }else {
            return(
                <p className={['col-12', 'mb-0', 'text-right', 'mt-1', 'px-0'].join(' ')} style={{fontSize: '12px'}}>تنها{
                    <span style={{color: '#00BAC6', paddingRight: '3px', paddingLeft: '3px'}}>{(200000 - sumOfCartPrices()).toLocaleString()}</span>
                }تومان تا ارسال رایگان</p>
            );
        }
    }

    const DesktopCart = (
        <div className={['container-fluid', 'shadow-sm', 'rounded-sm', 'pr-2', 'pl-3'].join(' ')} style={{width: '500px', backgroundColor: 'white', position: 'absolute', left: '0.7rem', top: '32px', zIndex: '600'}}>
            {
                props.reduxCart.information.length !== 0 ? (
                    <React.Fragment>
                        <div className={['row', 'mt-2', 'pr-3', 'pl-1'].join(' ')}>
                            <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'px-0'].join(' ')} style={{background: '#B3FFFE', borderRadius: '4px'}}>
                                <div style={{flex: getFreeDeliveryFlexNumber(), background: '#00BAC6', height: '14px', borderRadius: '4px'}}></div>
                            </div>
                            {getDeliveryPriceText()}
                        </div>
                        <div className={['row'].join(' ')} style={{overflow: 'scroll', maxHeight: '250px'}}>
                            <div className={['col-12', 'mx-0', 'px-1'].join(' ')}>
                                {
                                    props.reduxCart.information.map((item, counter) => {
                                        return(
                                            <div key={counter} className={['rtl', 'd-flex', 'flex-row', 'py-2'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                                                <img src={'https://honari.com/image/resizeTest/shop/_85x/thumb_' + item.prodID + '.jpg'} style={{width: '60px', height: '60px', borderRadius: '2px'}} />
                                                <div className={['d-flex', 'flex-column'].join(' ')} style={{flex: '1'}}>
                                                    <div className={['d-flex', 'flex-row', 'ltr', 'justify-content-between'].join(' ')}>
                                                        <img src='/assets/images/main_images/bin_red.png' style={{width: '16px', height: '16px'}} onClick={() => {removeProductFromCart(counter)}} />
                                                        <Link href={"/" + item.url}><a className={['mb-0', 'rtl', 'text-right', 'px-1'].join(' ')} style={{fontSize: '14px', color: "#444444", flex: '1'}}>{item.name}</a></Link>
                                                    </div>
                                                    <div className={['d-flex', 'flex-row', 'ltr', 'justify-content-between', 'align-items-center'].join(' ')} style={{marginTop: 'auto'}}>
                                                        <div className={['d-flex', 'flex-row', 'ltr', 'align-items-center'].join(' ')}>
                                                            <img src='/assets/images/main_images/minus_gray_circle.png' style={{width: '18px', height: '18px'}} onClick={() => {decreaseProductCountByOne(counter)}}/>
                                                            <span className={['px-1', 'mb-0'].join(' ')} style={{fontSize: '16px', color: '#444444'}}>{item.count}</span>
                                                            <img src='/assets/images/main_images/plus_gray_circle.png' style={{width: '18px', height: '18px'}} onClick={() => {increaseProductCountByOne(counter)}}/>
                                                        </div>
                                                        <div className={['d-flex', 'flex-row', 'text-right', 'rtl'].join(' ')} style={{flex: '1'}}>
                                                            {
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
                        <div className={['row', 'rtl', 'd-flex', 'flex-row', 'align-items-center', 'text-right', 'mt-1', 'pr-3', 'pl-2'].join(' ')}>
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
                        <img src='/assets/images/main_images/cart.png' style=   {{width: '60px', height: '60px'}}/>
                        <p className={['rtl', 'text-center', 'mb-0', 'mt-2'].join(" ")}>سبدخرید شما خالی است</p>
                    </div>
                )
            }
                               
        </div>
    );

    const phoneCartLayout = (
        <div style={{width: windowWidth, overflowX: 'hidden'}}>
            <div className={['d-flex', 'flex-row', 'text-right', 'justify-content-right', 'align-items-center', 'rtl', 'px-3', 'pt-2', 'pb-1'].join(' ')} style={{position: 'sticky'}}>
                <img src='/assets/images/main_images/cross_red.png' style={{width: '22px', height: '22px'}} onClick={toggleCartDrawer('left', false)} />
            </div>
            {
                props.reduxCart.information.length !== 0
                ?
                (
                    <React.Fragment>
                        <div className={['container'].join(' ')}>
                            <div className={['row', 'mt-2', 'px-3'].join(' ')}>
                                <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-right', 'px-0'].join(' ')} style={{background: '#B3FFFE', borderRadius: '4px'}}>
                                    <div style={{flex: getFreeDeliveryFlexNumber(), background: '#00BAC6', height: '14px', borderRadius: '4px'}}></div>
                                </div>
                                {getDeliveryPriceText()}
                            </div>
                        </div>
                        <div className={['row'].join(' ')} style={{overflow: 'scroll', maxHeight: '250px'}}>
                            <div className={['col-12', 'pr-3', 'pl-4'].join(' ')}>
                                {
                                    props.reduxCart.information.map((item, counter) => {
                                        return(
                                            <div key={counter} className={['rtl', 'd-flex', 'flex-row', 'py-2'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                                                <img src={'https://honari.com/image/resizeTest/shop/_85x/thumb_' + item.prodID + '.jpg'} style={{width: '60px', height: '60px', borderRadius: '2px'}} />
                                                <div className={['d-flex', 'flex-column', 'pl-1'].join(' ')} style={{flex: '1'}}>
                                                    <div className={['d-flex', 'flex-row', 'ltr', 'justify-content-between'].join(' ')}>
                                                        <img src='/assets/images/main_images/bin_red.png' style={{width: '16px', height: '16px'}} onClick={() => {removeProductFromCart(counter)}} />
                                                        <Link href={"/" + item.url}><a className={['mb-0', 'rtl', 'text-right', 'px-1'].join(' ')} style={{fontSize: '14px', color: "#444444", flex: '1'}}>{item.name}</a></Link>
                                                    </div>
                                                    <div className={['d-flex', 'flex-row', 'ltr', 'justify-content-between', 'align-items-center'].join(' ')} style={{marginTop: 'auto'}}>
                                                        <div className={['d-flex', 'flex-row', 'ltr', 'align-items-center'].join(' ')}>
                                                            <img src='/assets/images/main_images/minus_gray_circle.png' style={{width: '18px', height: '18px'}} onClick={() => {decreaseProductCountByOne(counter)}}/>
                                                            <span className={['px-1', 'mb-0'].join(' ')} style={{fontSize: '16px', color: '#444444'}}>{item.count}</span>
                                                            <img src='/assets/images/main_images/plus_gray_circle.png' style={{width: '18px', height: '18px'}} onClick={() => {increaseProductCountByOne(counter)}}/>
                                                        </div>
                                                        <div className={['d-flex', 'flex-row', 'text-right', 'rtl'].join(' ')} style={{flex: '1'}}>
                                                            {
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
                        <div className={['row', 'rtl', 'd-flex', 'flex-row', 'align-items-center', 'text-right', 'mt-1', 'mr-3', 'ml-3'].join(' ')}>
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
                            <Link href='/cart/shoppingCart' ><a onClick={() => {props.reduxStartLoading()}} className={['col-12', 'py-1', 'text-center', 'mb-1', 'mt-2'].join(' ')} style={{fontSize: '17px', fontWeight: '500', color: 'white', background: '#00BAC6', border: 'none', borderRadius: '2px', outline: 'none'}}>تکمیل فرآیند خرید</a></Link>
                            <button onClick={toggleCartDrawer('left', false)} className={['col-12', 'py-1', 'text-center', 'mb-1', 'mt-2', 'pointer'].join(' ')} style={{fontSize: '17px', fontWeight: '500', color: 'white', background: 'white', border: 'none', borderRadius: '2px', outline: 'none', color: 'red', borderRadius: '2px', border: '1px solid red'}}>بستن</button>
                        </div> 
                    </React.Fragment>
                )
                :
                (
                    <div className={['d-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'py-3'].join(' ')}>
                        <img src='/assets/images/main_images/cart.png' style=   {{width: '60px', height: '60px'}}/>
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
                    <img src='/assets/images/main_images/left_arrow_gray_small.png' className={['ml-1'].join(' ')} style={{width: '10px'}} />
                </li>
                <li className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'py-2', styles.dropdownItem].join(' ')}>
                    آجر تزئینی
                    <img src='/assets/images/main_images/left_arrow_gray_small.png' className={['ml-1'].join(' ')} style={{width: '10px'}} />
                </li>
                <li className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'py-2', styles.dropdownItem].join(' ')}>
                    آینه
                    <img src='/assets/images/main_images/left_arrow_gray_small.png' className={['ml-1'].join(' ')} style={{width: '10px'}} />
                </li>
                <li className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'py-2', styles.dropdownItem].join(' ')}>
                    ابزار
                    <img src='/assets/images/main_images/left_arrow_gray_small.png' className={['ml-1'].join(' ')} style={{width: '10px'}} />
                </li>
                <li className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'py-2', styles.dropdownItem].join(' ')}>
                    شیشه تایل رنگی
                    <img src='/assets/images/main_images/left_arrow_gray_small.png' className={['ml-1'].join(' ')} style={{width: '10px'}} />
                </li>
                <li className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'py-2', styles.dropdownItem].join(' ')}>
                    بیس چوبی
                    <img src='/assets/images/main_images/left_arrow_gray_small.png' className={['ml-1'].join(' ')} style={{width: '10px'}} />
                </li>
                <li className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'py-2', styles.dropdownItem].join(' ')}>
                    <div className={['d-flex', 'flex-row', 'align-items-center']}>
                        <img src='/assets/images/main_images/college_hat_main.png' className={['ml-1'].join(' ')} style={{width: '24px'}} />
                        <span style={{color: '#00bac6'}}>آموزش معرق کاشی</span>
                    </div>
                    <img src='/assets/images/main_images/left_arrow_gray_small.png' className={['ml-1'].join(' ')} style={{width: '10px'}} />
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
                <div className={['d-flex', 'flex-row', 'rtl'].join(' ')} style={{background: '#E0F6F2', padding: '10px'}}>
                    <Link href={'/'}><img src='/assets/images/main_images/honari.png' style={{width: '36px', height: '36px'}} /></Link>
                    <div className={['d-flex', 'flex-column', 'rtl'].join(' ')}>
                        <Link href={'/'}><h2 className={['mr-2', 'mb-0', 'text-right'].join(' ')} style={{color: '#00BAC6', fontSize: '20px', fontWeight: '500'}}>هنری</h2></Link>
                        <h4 className={['mr-2', 'mb-0', 'text-right'].join(' ')} style={{color: '#949494', fontSize: '10px'}}>آموزش، الگو، مواداولیه</h4>
                    </div>
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
                                menu.map((info, counter) => {
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
                                            <div key={counter} className={['px-2', 'py-3', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                                                <h5 className={['mb-0'].join(' ')} style={{fontSize: '13px'}}>{academyClass.name}</h5>
                                                <img src='/assets/images/main_images/left_arrow_black_small.png' className={['pointer'].join(' ')} style={{width: '12px', height: '12px'}} />
                                            </div>
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
                <ul className={['row', 'rtl', 'px-3', 'py-3'].join(' ')}>
                    {
                        subMenus.map((sm, counter) => {
                            return(
                                <Link key={counter} href={sm.url.substr(18)}><li className={['col-3', 'd-flex', 'flex-row', 'align-items-center', 'pointer', 'mt-2', styles.dropdownItem].join(' ')}>
                                    {sm.name}
                                </li></Link>
                            );
                        })
                    }
                </ul>
            );
        }
    }

    const desktopMenu = (
        <div className={['container-fluid', 'mx-0', 'px-0', 'd-flex', 'flex-row', 'justify-content-center', 'align-items-center'].join(' ')} style={{position: 'fixed', zIndex: '500'}}>
            <div className={['container', 'px-2'].join(' ')} >
                <div style={{borderRadius: '0 0 6px 6px', backgroundColor: '#F7F7F7', width: '100%'}} onMouseEnter={()=>{setHover({status: true, number: hover.number, title: hover.title})}} onMouseLeave={()=>{setHover({status: false, number: hover.number, title: hover.title})}}>
                {
                    getSubMenus(hover.number)
                }
                </div>
            </div>
        </div>
    );

    const getSearchResults = (event) => {
        //?apiToken=21bb3b6e-0f96-4718-8d6c-8f03a538927e&query=' + encodeURIComponent('منجوق')
        let input= event.target.value;
        axios.post(Constants.apiUrl + '/api/search-autocomplete', {
            input: input,
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                setSearchResults(response.result[0].autoComplete);
                setShowSearchResults(true);
                setMoreSearchCategoriesClass('d-none');
            }
            console.warn(response);
        }).catch((err) => {
            console.error(err);
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
        });
    }

    const desktopSearchResults = () => {
        if(searchResults.length !== 0 && showSearchResults){
            return (
                <div className={['d-flex', 'flex-column'].join(' ')} style={{background: 'white', display: 'flex', position: 'absolute', top: '3.3rem', minWidth: '330px', width: desktopSearchBarWidth, zIndex: '999999999', borderRadius: '2px'}}>
                    <div className={['d-flex', 'flex-row', 'ltr', 'text-left', 'justify-content-left', 'pt-2', 'px-2'].join(' ')}>
                        <img src='/assets/images/main_images/close_gray_small.png' className={['pointer'].join(' ')} style={{width: '17px', heigth: '17px'}} onClick={() => {setShowSearchResults(false)}} />
                    </div>
                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between', 'px-2', 'pt-2'].join(' ')}>
                        <h5 className={['mb-0'].join(' ')} style={{fontSize: '14px', color: '#949494'}}><b>پیشنهاد در دسته‌ها</b></h5>
                        <h6 className={['mb-0', 'pointer'].join(' ')} style={{fontSize: '12px', color: '#00BAC6'}} onClick={()=>{setMoreSearchCategoriesClass('d-flex')}}>{moreSearchCategoriesClass === 'd-none' ? "مشاهده همه" : ''}</h6>
                    </div>
                    {
                        searchResults.map((item, index) => {
                            if(item.fields === null){
                                if(index <= 2){
                                    return(
                                        <Link href={'/search/SearchWithCategory/?query=' + item.category}>
                                            <a onClick={props.reduxStartLoading} className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'px-2', 'mt-1', ].join(' ')}>
                                                <h6 className={['mt-1', 'mb-0'].join(' ')} style={{fontSize: '13px', color: 'black'}} key={index}>{item.category}</h6>
                                                <img src='/assets/images/main_images/link_arrow_gray_small.png' style={{width: '10px', height: '10px'}} />
                                            </a>
                                        </Link>
                                    );
                                }else{
                                    return(
                                        <Link href={'/search/SearchWithCategory/?query=' + item.category}>
                                            <a onClick={props.reduxStartLoading} className={['flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'px-2', 'mt-1', moreSearchCategoriesClass].join(' ')}>
                                                <h6 className={['mt-1', 'mb-0'].join(' ')} style={{fontSize: '13px', color: 'black'}} key={index}>{item.category}</h6>
                                                <img src='/assets/images/main_images/link_arrow_gray_small.png' style={{width: '10px', height: '10px'}} />
                                            </a>
                                        </Link>
                                    );
                                }
                            }
                        })
                    }
                    <div className={['w-100', 'mt-2'].join(' ')} style={{background: '#949494', height: '1px'}}></div>
                    <h6 className={['text-right', 'px-2', 'pt-2', 'pb-0', 'mb-0'].join(' ')} style={{fontSize: '14px', color: '#949494'}}><b>پیشنهاد در محصولات</b></h6>
                    <div className={['d-flex', 'flex-column'].join(' ')} style={{maxHeight: '100px', overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: '#D8D8D8'}}>
                    {
                        searchResults.map((item, index) => {
                            if(item.fields !== null){
                                return(
                                    <Link href={item.fields.product_url}>
                                        <a onClick={props.reduxStartLoading} key={index} className={['d-flex', 'flex-row', 'align-items-center', 'pointer', 'px-2', 'mt-1'].join(' ')}>
                                            <img src={item.fields.product_image} style={{width: '36px', height: '36px'}} />
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
                </div>
            );
        }else{
            return null;
        }
    }

    const phoneSearchResults = () => {
        if(searchResults.length !== 0 && showSearchResults){
            return (
                <div className={['d-md-none', 'w-100'].join(' ')} style={{background: 'white', width: '100%', position: 'relative', top: '0.5rem', left: '0', zIndex: '1000'}}>
                    <div className={['d-flex', 'flex-row', 'ltr', 'text-left', 'justify-content-left', 'pt-2', 'px-2'].join(' ')}>
                        <img src='/assets/images/main_images/close_gray_small.png' className={['pointer'].join(' ')} style={{width: '17px', heigth: '17px'}} onClick={() => {setShowSearchResults(false)}} />
                    </div>
                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between', 'px-2', 'pt-2'].join(' ')}>
                        <h5 className={['mb-0'].join(' ')} style={{fontSize: '14px', color: '#949494'}}><b>پیشنهاد در دسته‌ها</b></h5>
                        <h6 className={['mb-0', 'pointer'].join(' ')} style={{fontSize: '12px', color: '#00BAC6'}} onClick={()=>{setMoreSearchCategoriesClass('d-flex')}}>{moreSearchCategoriesClass === 'd-none' ? "مشاهده همه" : ''}</h6>
                    </div>
                    {
                        searchResults.map((item, index) => {
                            if(item.fields === null){
                                if(index <= 2){
                                    return(
                                        <Link href={'/search/SearchWithCategory/?query=' + item.category}>
                                            <a onClick={props.reduxStartLoading} className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'px-2', 'mt-1', ].join(' ')}>
                                                <h6 className={['mt-1', 'mb-0'].join(' ')} style={{fontSize: '13px', color: 'black'}} key={index}>{item.category}</h6>
                                                <img src='/assets/images/main_images/link_arrow_gray_small.png' style={{width: '10px', height: '10px'}} />
                                            </a>
                                        </Link>
                                    );
                                }else{
                                    return(
                                        <Link href={'/search/SearchWithCategory/?query=' + item.category}>
                                            <a className={['flex-row', 'align-items-center', 'justify-content-between', 'pointer', 'px-2', 'mt-1', moreSearchCategoriesClass].join(' ')}>
                                                <h6 className={['mt-1', 'mb-0'].join(' ')} style={{fontSize: '13px', color: 'black'}} key={index}>{item.category}</h6>
                                                <img src='/assets/images/main_images/link_arrow_gray_small.png' style={{width: '10px', height: '10px'}} />
                                            </a>
                                        </Link>
                                    );
                                }
                            }
                        })
                    }
                    <div className={['w-100', 'mt-2'].join(' ')} style={{background: '#949494', height: '1px'}}></div>
                    <h6 className={['text-right', 'px-2', 'pt-2', 'pb-0', 'mb-0'].join(' ')} style={{fontSize: '14px', color: '#949494'}}><b>پیشنهاد در محصولات</b></h6>
                    <div className={['d-flex', 'flex-column'].join(' ')} style={{maxHeight: '100px', overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: '#D8D8D8'}}>
                    {
                        searchResults.map((item, index) => {
                            if(item.fields !== null){
                                return(
                                    <Link href={item.fields.product_url}>
                                        <a onClick={props.reduxStartLoading} key={index} className={['d-flex', 'flex-row', 'align-items-center', 'pointer', 'px-2', 'mt-1'].join(' ')}>
                                            <img src={item.fields.product_image} style={{width: '36px', height: '36px'}} />
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
                </div>
            );
        }else{
            return null;
        }
    }

    return (
        <React.Fragment>
            <Drawer anchor="right" open={state['right']} onClose={toggleDrawer('right', false)}>
                <RightMenu />
            </Drawer>
            <Drawer anchor="left" open={state['left']} onClose={toggleCartDrawer('left', false)}>
                {phoneCartLayout}
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
                    <img src='/assets/images/main_images/tick_white_small.png' className={['ml-2'].join(' ')} style={{width: '20px', height: '20px'}} />
                    <span>{props.reduxSnackbar.success.title}</span>
                </div>
                :
                null
            }
            {
                props.reduxSnackbar.warning.show
                ?
                <div className={['d-flex', 'flex-row', 'rtl', 'mr-2', 'mb-2', 'px-3', 'py-2', 'align-items-center'].join(' ')} style={{background: '#a1a100', color: 'white', position: 'fixed', bottom: '0', right: '0', borderRadius: '2px', zIndex: '5000'}}>
                    <img src='/assets/images/main_images/alert_white_small.png' className={['ml-2'].join(' ')} style={{width: '20px', height: '20px'}} />
                    <span>{props.reduxSnackbar.warning.title}</span>
                </div>
                :
                null
            }
            {
                props.reduxSnackbar.error.show
                ?
                <div className={['d-flex', 'flex-row', 'rtl', 'mr-2', 'mb-2', 'px-3', 'py-2', 'align-items-center'].join(' ')} style={{background: '#a60000', color: 'white', position: 'fixed', bottom: '0', right: '0', borderRadius: '2px', zIndex: '5000'}}>
                    <img src='/assets/images/main_images/close_white_small.png' className={['ml-2'].join(' ')} style={{width: '20px', height: '20px'}} />
                    <span>{props.reduxSnackbar.error.title}</span>
                </div>
                :
                null
            }
            <div className={['container-fluid', 'p-0'].join(' ')} style={{position: 'sticky', top: '0', zIndex: '500', backgroundColor: 'white'}}>
            {
                props.reduxLoad === true ? <div className={['w-100'].join(' ')} style={{position: 'absolute', top: '0', left: '0'}}><StyledLinearProgressActive /></div> : null
            }
            <div className={'container'}>
                {
                    props.home == true 
                    ?
                    <React.Fragment>
                    <div className={['row', 'rtl', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'd-md-none', 'p-2', 'mt-1'].join(' ')}>
                        <img src='/assets/images/main_images/menu_black_small.png' style={{width: '27px', height: '27px'}} onClick={toggleDrawer('right', true)} />
                        <img src='/assets/images/main_images/honari.png' style={{width: '40px', height: '40px'}} />
                        <img src='/assets/images/main_images/headphone.png' style={{width: '27px', height: '27px'}}/>
                    </div>
                    <div className={['row', 'mt-2', 'd-md-none'].join(' ')} style={{height: '1px', background: '#C4C4C4'}}></div>
                    </React.Fragment>
                    :
                    null
                }
                <div className={['row', 'pt-2', 'mb-0', 'pb-2', 'px-1'].join(' ')} style={{direction: 'rtl'}}>
                    <div className={['col-3', 'col-lg-7', 'rtl', 'text-right', 'd-flex', 'flex-row', 'pr-0', 'pr-lg-1', 'align-items-center', 'justify-content-lg-between'].join(' ')}>
                        <div className={['d-flex', 'flex-row', 'rtl'].join(' ')}>
                            <Link href={'/'}><img src='/assets/images/main_images/honari.png' className={['pointer', 'd-none', 'd-lg-block'].join(' ')} style={{width: '60px'}} /></Link>
                            <div className={['pr-1', 'flex-column', 'align-items-center', 'd-none', 'd-lg-flex'].join(' ')}>
                                <Link href={'/'}><h1 className={['pr-1', 'align-self-start', 'm-0', 'pointer'].join(' ')} style={{fontSize: '24px', color: '#00bac6'}}>هنری</h1></Link>
                                <p className={['pr-1', 'align-self-end', 'mb-0', 'mt-2'].join(' ')}>آموزش، الگو، مواداولیه</p>
                            </div>
                        </div>
                        <form action='/search/SearchResult' method='GET' ref={desktopSearchBar} className={['rounded-sm', 'd-none', 'd-lg-flex', 'flex-row', 'rtl'].join(' ')}>
                            <button type='submin' className={['p-2', 'pointer'].join(' ')} style={{borderRadius: '0 4px 4px 0', border: 'none', backgroundColor: '#00bac6', width: '40px'}}><img src='/assets/images/main_images/search_white.png' style={{width: '100%', padding: '2px'}}/></button>
                            <input name='query' type='text' onChange={getSearchResults} placeholder='عبارت مورد نظر را جستجو کنید' className={['pr-2'].join(' ')} style={{fontSize: '14px', height: '42px', width: '340px', outline: 'none', outlineOffset: 'none', border: '1px solid #C4C4C4', borderRadius: '4px 0 0 4px'}} />
                            {desktopSearchResults()}
                        </form>
                        {
                                props.home != true 
                            ?
                                <img src='/assets/images/main_images/menu_black_small.png' className={['pointer', 'd-block', 'd-lg-none'].join(' ')} style={{width: '30px'}} onClick={toggleDrawer('right', true)} />
                            :
                                null
                        }
                        {/*##### searchbox for mobile view #####*/}
                        <form method='GET' action='/search/SearchResult' className={['d-flex', 'flex-row', 'ltr', 'd-md-none', 'pr-1'].join(' ')} style={{height: '30px'}} >
                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-center', 'p-0', 'pointer'].join(' ')} style={{width: '30px', height: '30px', background: '#F7F7F7', borderTop: '1px solid #D8D8D8', borderBottom: '1px solid #D8D8D8', borderLeft: '1px solid #D8D8D8', borderRadius: '3px 0px 0px 3px'}}>
                                <img src='/assets/images/main_images/search_main.png' className={['pointer'].join(' ')} style={{width: '15px', height: '15px'}}/>
                            </div>
                            <div style={{height: '30px', background: '#F7F7F7'}}>
                                <input name='query' type='search' placeholder='جست و جو کنید' onChange={getSearchResults} className={['rtl', 'px-2'].join(' ')} style={{fontSize: '14px', height: '30px', border: 'none', outlineStyle: 'none', outlineOffset: 'none', outlineColor: 'none', background: '#F7F7F7', border: '1px solid #D8D8D8', borderRadius: '0px 3px 3px 0px'}} /> 
                            </div>
                        </form>
                        {/*<h1 className={['pr-1', 'm-0', 'd-block', 'd-lg-none'].join(' ')} style={{fontSize: '22px', color: '#00bac6'}}>هنری</h1>*/}
                    </div>
                    <div className={['col-9', 'col-lg-5', 'text-left', 'd-flex', 'align-items-center', 'ltr', 'p-0'].join(' ')}>
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
                            <small className={['m-0', 'd-none', 'd-md-block'].join(' ')}>سبد خرید</small>
                            <img src='/assets/images/header_cart.png' className={['ml-1'].join(' ')} style={{width: '20px'}} />    
                            {
                                cartOpenState === true 
                                ? 
                                    DesktopCart 
                                :
                                    null
                            }
                        </div>
                        <div className={['ltr', 'align-items-center', 'p-2', 'pointer', 'd-md-none', 'flex-row'].join(' ')} style={{position: 'relative'}} onMouseEnter={()=>{setCartOpenState(true)}} onMouseLeave={()=>{setCartOpenState(false)}}>
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
                            <img src='/assets/images/header_cart.png' className={['ml-1'].join(' ')} style={{width: '20px'}} onClick={toggleCartDrawer('left', true)} />    
                        </div>
                        {
                            props.reduxUser.status === 'GUEST'
                            ?
                            <a href="https://honari.com/user" className={['ltr', 'align-items-center', 'ml-1', 'p-2', 'pointer', 'd-none', 'd-md-flex'].join(' ')}>
                                <small className={['m-0'].join(' ')}>ورود</small>
                                <img src='/assets/images/header_user.png' className={['ml-1'].join(' ')} style={{width: '20px'}} />    
                            </a>
                            :
                            (
                                props.reduxUser.status === 'LOGIN'
                                ?
                                <div className={['ltr', 'align-items-center', 'ml-1', 'p-2', 'pointer', 'd-none', 'd-md-flex'].join(' ')}>
                                    <small className={['m-0'].join(' ')}>{props.reduxUser.information.name}</small>
                                    <img src='/assets/images/header_user.png' className={['ml-1'].join(' ')} style={{width: '20px'}} />    
                                </div>
                                :
                                null
                            )
                        }
                        <div className={['ltr', 'align-items-center', 'ml-1', 'p-2', 'pointer', 'd-md-none'].join(' ')}>
                            {
                                props.reduxUser.status !== 'LOGIN' ?
                                    <a href='https://honari.com/user' className={['px-3', 'py-1', 'pointer'].join(' ')} style={{borderRadius: '6px', fontSize: '11px', backgroundColor: '#00BAC6', color: 'white'}}>ورود</a>
                                :
                                    <Link href='/users/view'><a className={['px-2', 'py-1', 'mb-0'].join(' ')} style={{borderStyle: 'none', borderRadius: '6px', fontSize: '11px', backgroundColor: '#00BAC6', color: 'white', height: '30px'}}>حساب کاربری</a></Link>
                            }
                        </div>
                        <form onSubmit={searchFormSubmited} onSubmitCapture={null} className={['col-12', 'm-0', 'p-2', 'align-items-center', 'ml-2', 'ml-md-0', menuSearchBar].join(' ')} style={{border: '1px solid #00bac6', borderRadius: '18px'}}>
                            <img src='/assets/images/main_images/cross_main.png' style={{width: '22px'}} className={['ml-1', 'pointer'].join(' ')} onClick={()=>{setMenuSearchBar('d-none'); setOtherMenuItems('d-flex');}}/>
                            <input onSubmit={null} type="search" className={['w-100', 'text-right'].join(' ')} style={{direction: 'rtl', outline: 'none', outlineOffset: 'none',  borderStyle: 'none', fontSize: '12px'}} placeholder='در هنری جستجو کنید ...'/>
                            <img src='/assets/images/main_images/search_main.png' style={{width: '22px'}} className={['ml-1', 'pointer'].join(' ')} onClick={searchFormSubmited}/>
                        </form>
                    </div>
                    {phoneSearchResults()}
                </div>
            </div>
            <div className={['container-fluid', 'd-none', 'd-lg-block', 'shadow-sm', 'align-items-center'].join(' ')} style={{backgroundColor: '#F7F7F7', height: '48px'}}>
                <div className={['row', 'rtl'].join(' ')}>
                    <div className={['row', 'py-0'].join(' ')} style={{height: '1px', backgroundColor: '#C4C4C4'}}></div>
                    <div className={['container', 'rtl', 'px-0', 'd-flex', 'flex-row', 'align-items-center'].join(' ')}>
                        <div className={['row', 'd-flex', 'flex-row', 'align-items-center', 'w-100', 'pr-4'].join(' ')} style={{height: '48px'}}>
                            <ul className={['px-2', 'rtl','d-flex', 'justify-content-between'].join(' ')} style={{backgroundColor: '#F7F7F7', boxShadow: 'none', paddingBottom: '1px', marginBottom: '0px', marginTop: '14px', height: '35px'}}>
                                {
                                    menu.map((item, counter)=>{
                                        if(counter < 10){
                                            return <Link href={item.parentUrl.substr(18)}><a><li className={[styles.desktopHeaderParentMenu, 'list-group-item', 'pointer', 'm-0', 'text-center', 'rounded-0','pr-2', 'pl-2', 'mt-0', setActived(selectedMenu)].join(' ')} style={{height: '100%'}}  onMouseEnter={()=>{setHover({status: true, number: counter, title: 'tile'})}} onMouseLeave={()=>{setHover({status: false, number: counter, title: hover.title})}}>{item.parentName}</li></a></Link>
                                        }
                                    })
                                }
                            </ul>
                            <div className={['text-center', 'mr-auto'].join(' ')} style={{}}>
                                <a href={'https://honari.com/academy'} className={[styles.desktopHeaderAcademyButton, 'px-4', 'py-1'].join(' ')}>هنری آکادمی</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                props.home == true
                ?
                    null
                :
                    <div className={['d-lg-none'].join(' ')} style={{width: '100%', height: '1px', backgroundColor: '#C4C4C4'}}></div>
            }
            {
                smallSearchBarState === true ? 
                    <form className={['d-flex', 'd-lg-none', 'flex-row', 'rtl', 'px-2', 'py-3', 'shadow-sm', 'align-items-center'].join(' ')}>
                        <img src='/assets/images/main_images/search_main.png' className={['pointer'].join(' ')} style={{width: '30px', padding: '4px'}} />
                        <input type='text' placeholder='جستجو کنید ...' className={['mx-1'].join(' ')} style={{outline: 'none', outlineOffset: 'none', borderStyle: 'none', width: '100%'}} />
                        <img src='/assets/images/main_images/cross_main.png' className={['pointer'].join(' ')} style={{width: '30px', padding: '4px'}} onClick={()=>{setSmallSearchBarState(false)}} />
                    </form>
                :
                null
            }
            
            </div>
            {
                hover.status 
                ? 
                    desktopMenu 
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
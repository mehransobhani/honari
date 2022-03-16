import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import styles from './style.module.css';
import Header from '../Header/Header';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
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
import Skeleton from '@mui/material/Skeleton';
import {Helmet} from 'react-helmet';
import { Apartment } from '@material-ui/icons';

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
    const [productFeaturesState, setProductFeaturesState] = useState([]);
    const [breadcrumbState, setBreadcrumbState] = useState([]);
    const [id, setId] = useState(props.id);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [productInformation, setProductInformation] = useState({});
    const [orderCount, setOrderCount] = useState(1);
    const [productCartStatus, setProductCartStatus] = useState('');
    const [productCartCount, setProductCartCount] = useState(null);
    const [axiosProcessing, setAxiosProcessing] = useState(false);
    const [mainImageLoaded, setMainImageLoaded] = useState(false);
    const [productInformationReceived, setProductInformationReceived] = useState(false);
    const [mainImageClass, setMainImageClass] = useState('d-none');
    const [aparatContainerDiv, setAparatContainerDiv] = useState(undefined);
    const [aparatScript, setAparatScript] = useState(undefined);
    const [aparatId, setAparatId] = useState(0);
    const [videoFullscreenDisplay, setVideoFullscreenDisplay] = useState('d-none');
    const [selectedSection, setSelectedSection] = useState(0);
    const [comments, setComments] = useState([]);
    const [replyCommentIndex, setReplyCommentIndex] = useState(-1);
    const [cookies , setCookie , removeCookie] = useCookies();
    const [replyInput, setReplyInput] = useState('');
    const [commentInput, setCommentInput] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const [sendingComment, setSendingComment] = useState(false);
    const [otherImages, setOtherImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);

    const informationRef = useRef(null);

    let helpSectionBigPart = 'همه تلاش ما این است که کالای خریداری شده در شرایط مطلوب به دست شما برسد، باوجود این ممکن است پس از خرید به هر دلیل تصمیم به بازگرداندن کالا بگیرید.';
    helpSectionBigPart += ' ما این امکان را برای شما درنظر گرفته‌ایم که با آسودگی خاطر تا مدت ۱۰ روز بعد از دریافت کالا، برای بازگرداندن با هزینه‌ی خود اقدام نمایید.';
    helpSectionBigPart += ' کالا باید در شرایط اولیه همراه با بسته بندی و لیبل بدون آسیب دیدگی و پارگی باشد. درصورت بازشدن پلمپ کالا امکان مرجوع کردن آن وجود ندارد.';

    useEffect(()=>{
        setOtherImages([]);
        setSelectedImage(0);
        setAparatId(0);
        setAparatScript(undefined);
        setProductInformationReceived(false);
        setMainImageClass('d-none');
        setMainImageLoaded(false);
        
        if(props.information.aparat !== ''){
            let aparat = props.information.aparat;
            //<div id="18340515441"><script type="text/JavaScript" src="https://www.aparat.com/embed/Oo3Cw?data[rnddiv]=18340515441&data[responsive]=yes"></script></div>    
            let containerIsGotten = false;
            let scriptIsGotten = false;
            let idPermissionIsGranted = false;
            let scriptPermissionIsGranted = false;
            let aparatIdString = '';
            let aparatScriptString = '';
            let sizeOfString = props.information.aparat.length;
            for(let i=0; i<sizeOfString ; i++){
                if(!idPermissionIsGranted && !containerIsGotten && !scriptPermissionIsGranted && aparat.charAt(i) === 'i' && aparat.charAt(i+1) === 'd' && aparat.charAt(i+2) === '=' && aparat.charAt(i+3) === '"'){
                    i=i+3;
                    idPermissionIsGranted = true;
                }else if(idPermissionIsGranted && !containerIsGotten){
                    if(aparat.charAt(i) !== '"'){
                        aparatIdString += aparat.charAt(i);
                    }else{
                        idPermissionIsGranted = false;
                        containerIsGotten = true;
                    }
                }
                if(containerIsGotten && !scriptPermissionIsGranted && aparat.charAt(i) === '<' && aparat.charAt(i+1) === 's' && aparat.charAt(i+2) === 'c' && aparat.charAt(i+3) === 'r'){
                    scriptPermissionIsGranted = true;
                }
                if(scriptPermissionIsGranted && !scriptIsGotten){
                    aparatScriptString += aparat.charAt(i);
                }
                if(scriptPermissionIsGranted){
                    if(aparat.charAt(i) === '>' && aparat.charAt(i-1) === 't' && aparat.charAt(i-8) === '<' && aparat.charAt(i-7) === '/' && aparat.charAt(i-6) === 's'){
                        scriptPermissionIsGranted = false;
                        scriptIsGotten = true;
                    }
                }
            }
            console.info(aparatScriptString);
            setAparatScript(aparatScriptString);
            setAparatId(parseInt(aparatIdString));
            setAparatContainerDiv(<div id={parseInt(aparatIdString)}></div>);
        }

        let imgs = [];
        imgs.push(props.information.prodID);

        if(props.information.productOtherImages.length !== 0){
            let images = props.information.productOtherImages;
            let image = '';
            let i = 0;
            
            for(i = 0; i< images.length; i++){
                if(images[i] != ','){
                    image += images[i];
                }else{
                    imgs.push(image);
                    image = '';
                }
            }
            imgs.push(image);
            //checkImagesExistance(imgs);
        }
        setOtherImages(imgs);
    }, [id, props.id]);

    const checkImagesExistance = (names) => {
        let a = [1,2,3];
        names.map((name, index) => {
            let url = 'https://honari.com/image/resizeTest/shop/_85x/thumb_' + name + '.jpg';
            axios.get(url).then((r) => {
                let ois = otherImages;
                ois.push(name);
                setOtherImages(ois);
                console.error(a);
            }).catch((e) => {
            });
        });
    }

    useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/product-features', {
            id: props.id,
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
    }, [id, props.id]);

    useEffect(() => {
        axios.post(Constants.apiUrl + '/api/product-gtm-information', {
            productId: props.id,
        }).then((r) => {
            let response = r.data;
            if(response.status === 'done'){
                const googleTagmanager = document.createElement('script');
                googleTagmanager.src = '/newtest/assets/js/google_tagmanager.js';
                googleTagmanager.async = true;
                document.body.appendChild(googleTagmanager);
                googleTagmanager.onload = () => {
                dataLayer.push({
                    event: 'gtm.load',
                    productPrice: response.productPrice,
                    productUnit: response.productUnit,
                    productCategory: response.productCategory
                });
                }
               
            }else if(response.status === 'failed'){
                console.warn(response.message);
            }
        }).catch((e) => {
            console.error(e);
        });
    }, [id, props.id]);

    /*
    useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/product-breadcrumb', {
            id: props.id,
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
    }, [id, props.id]);
    */

    /*
    useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/similar-products', {
            id: props.id,
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
    }, [id, props.id]);
    */

    useEffect(() => {
        axios.post(Constants.apiUrl + '/api/product-comments', {
            productId: props.id,
        }).then((r) => {
            let response = r.data;
            if(response.status === 'done'){
                setComments(response.comments);
            }else if(response.status === 'failed'){
                props.reduxUpdateSnackbar('warning', true, response.umessage);
            }
        }).catch((e) => {
            console.error(e);
            props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
        });
    }, []);

    const productCounterChanged = (event) => {
        if(event.target.value < 1){
            event.target.value = 1;
            setOrderCount(1);
        }else if(event.target.value > props.information.maxCount){
            event.target.value = props.information.maxCount;
            setOrderCount(props.information.maxCount);
        }else{
            setOrderCount(parseInt(event.target.value));
        }
    }

    const increaseOrderCountByOne = () => {
        if(orderCount < props.information.maxCount){
            setOrderCount(orderCount + 1);
        }
    }

    const decreaseOrderCountByOne = () => {
        if(orderCount > 1){
            setOrderCount(orderCount -1);
        }
    }

    const addToCartButtonClicked = () => {
        if(!axiosProcessing){
            if(props.reduxUser.status === 'LOGIN'){
                setAxiosProcessing(true);
                axios.post(Constants.apiUrl + '/api/user-add-to-cart', {
                    productPackId: props.information.productPackId,
                    productPackCount: orderCount
                },{
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    let response = res.data;
                    if(response.status === 'done'){
                        props.reduxAddToCart({
                            productId: props.information.productId,
                            productPackId: props.information.productPackId,
                            name: props.information.productName,
                            categoryId: props.information.categoryId,
                            prodID: props.information.prodID,
                            url: props.information.productUrl,
                            count: orderCount,
                            unitCount: props.information.productUnitCount,
                            unitName: props.information.productUnitName,
                            label: props.information.productLabel,
                            basePrice: props.information.productBasePrice,
                            price: props.information.productPrice,
                            discountedPrice: props.information.discountedPrice,
                            discountPercent: props.information.discountPercent
                        });
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
                console.warn(props.information);
                props.reduxAddToCart({
                    productId: props.information.productId,
                    productPackId: props.information.productPackId,
                    name: props.information.productName,
                    categoryId: props.information.categoryId,
                    prodID: props.information.prodID,
                    url: props.information.productUrl,
                    count: orderCount,
                    unitCount: props.information.productUnitCount,
                    unitName: props.information.productUnitName,
                    label: props.information.productLabel,
                    basePrice: props.information.productBasePrice,
                    price: props.information.productPrice,
                    discountedPrice: props.information.discountedPrice,
                    discountPercent: props.information.discountPercent
                });
                cart.push({id: props.information.productPackId, count: orderCount});
                localStorage.setItem('user_cart', JSON.stringify(cart));
            }
        }
    }

    const removeFromCartButtonClicked = () => {
        if(!axiosProcessing){
            if(props.reduxUser.status === 'LOGIN'){
                setAxiosProcessing(true);
                axios.post(Constants.apiUrl + '/api/user-remove-from-cart', {
                    productPackId: props.information.productPackId
                },{
                    headers: {
                        'Authorization': 'Bearer ' + cookies.user_server_token, 
                    }
                }).then((res) => {
                    let response = res.data;
                    if(response.status === 'done'){
                        props.reduxRemoveFromCart(props.information.productPackId);
                        setOrderCount(1);
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
                    if(props.information.productPackId !== cartItem.id){
                        newCart.push(cartItem);
                    }
                });
                localStorage.setItem('user_cart', JSON.stringify(newCart));
                props.reduxRemoveFromCart(props.information.productPackId);
                setOrderCount(1);
            }
        }
    }

    const increaseButtonClicked = () => {
        if(axiosProcessing){
            return;
        }
        if(props.reduxUser.status == 'GUEST'){
            setAxiosProcessing(true);
            axios.post(Constants.apiUrl + '/api/guest-check-cart-changes', {
                productPackId: props.information.productPackId,
                count: parseInt(orderCount) + 1
            }).then((res) => {
                let response = res.data;
                if(response.status == 'done'){
                    updateProductInLocalStorage(response.count);
                    props.reduxIncreaseCountByOne(props.information.productPackId);
                    setAxiosProcessing(false);
                    setOrderCount(parseInt(orderCount) + 1);
                }else if(response.status == 'failed'){
                    setAxiosProcessing(false);
                    console.warn(response.umessage);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
            }).catch((error) => {
                setAxiosProcessing(false);
                console.log(error);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            });
        }else if(props.reduxUser.status === 'LOGIN'){
            setAxiosProcessing(true);
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
                    setAxiosProcessing(false);
                    //setOrderCount(parseInt(orderCount) + 1);
                }else if(response.status == 'failed'){
                    setAxiosProcessing(false);
                    console.warn(response.message);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
            }).catch((error) => {
                setAxiosProcessing(false);
                console.log(error);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            });
        }
    }

    const decreaseButtonClicked = () => {
        if(axiosProcessing){
            return;
        }
        if(props.reduxUser.status == 'GUEST'){
            setAxiosProcessing(true);
            axios.post(Constants.apiUrl + '/api/guest-check-cart-changes', {
                productPackId: props.information.productPackId,
                count: parseInt(orderCount) - 1
            }).then((res) => {
                setAxiosProcessing(false);
                let response = res.data;
                if(response.status == 'done'){
                    updateProductInLocalStorage(response.count);
                    props.reduxDecreaseCountByOne(props.information.productPackId);
                    setOrderCount(parseInt(orderCount) - 1);
                }else if(response.status == 'failed'){
                    setAxiosProcessing(false);
                    console.warn(response.message);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
            }).catch((error) => {
                setAxiosProcessing(false);
                console.log(error);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            });
        }else if(props.reduxUser.status == 'LOGIN'){
            setAxiosProcessing(true);
            axios.post(Constants.apiUrl + '/api/user-decrease-cart-by-one', {
                productPackId: props.information.productPackId
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.user_server_token, 
                }
            }).then((res) => {
                let response = res.data;
                setAxiosProcessing(false);
                if(response.status == 'done'){
                    props.reduxDecreaseCountByOne(props.information.productPackId);
                    //setOrderCount(parseInt(orderCount) - 1);
                }else if(response.status === 'failed'){
                    console.log(response.message);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
            }).catch((error) => {
                setAxiosProcessing(true);
                console.log(error);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            });
        }
    }

    const productExistsOrNot = () => {
        let found = false;
        props.reduxCart.information.map((product, index)=> {
            if(product.productPackId == props.information.productPackId){
                found = true;
            }
        });
        return found;
    }

    const getProductOrderCount = () => {
        let productCount = 0;
        props.reduxCart.information.map((product, index) => {
            if(product.productPackId == props.information.productPackId){
                productCount = product.count;
            }
        });
        return productCount;
    }

    const updateProductInLocalStorage = (count) => {
        let localStorageCart = JSON.parse(localStorage.getItem('user_cart'));
        for(let item of localStorageCart){
            if(item.id == props.information.productPackId){
                item.count = count;
            }
        }
        localStorage.setItem('user_cart', JSON.stringify(localStorageCart));
    }

    const mainImageOnLoadListener = () => {
        setMainImageLoaded(true);
        setMainImageClass('d-block');
    }

    const videoImageClicked = () => {
        setVideoFullscreenDisplay('d-flex');
    }

    const setReminderButtonClicked = () => {
        if(props.reduxUser.status === 'GUEST' || props.reduxUser.status === 'NI'){
            alert('برای ایجاد یادآور، ابتدا باید وارد حساب کاربری خود شوید');
            return;
        }
        if(props.reduxUser.status === 'LOGIN'){
            axios.post(Constants.apiUrl + "/api/user-set-product-reminder", {
                productId: props.id,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.user_server_token, 
                }
            }).then((r) => {
                let response = r.data;
                if(response.status === 'done'){
                    props.reduxUpdateSnackbar('success', true, response.umessage);
                }else if(response.status === 'failed'){
                    console.warn(response.message);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
            }).catch((e) => {
                console.error(e);
                props.reduxUpdateSnackbar('error', true, 'خطا در اتصال به اینترنت');
            });
        }
    }

    const getSectionBackground = (secitonId) => {
        if(selectedSection === secitonId){
            return "#F7F7F7"
        }else{
            return "#E9E9E9";
        }
    }

    const getSectionBorderStyles = (sectionId) => {
        if(selectedSection === sectionId){
            //
        }else{
            //
        }
    }

    const replyInputChanged = (event) => {
        setReplyInput(event.target.value);
    }

    const submitReply = () => {
        if(sendingReply){
            return;
        }
        if(replyInput.length < 3){
            props.reduxUpdateSnackbar('warning', true, 'پاسخ شما حداقل باید شامل ۳ حرف باشد');
        }else{
            setSendingReply(true);
            let commentId = comments[replyCommentIndex].id;
            let cmi = replyCommentIndex;
            let reply = replyInput;
            axios.post(Constants.apiUrl + '/api/reply-to-comment', {
                productId: props.id,
                commentId: commentId,
                reply: replyInput,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.user_server_token, 
                }
            }).then((r) => {
                let response = r.data;
                if(response.status === 'done'){
                    props.reduxUpdateSnackbar('success', true, 'پاسخ شما با موفقیت ثبت شد');
                    setReplyCommentIndex(-1);
                    setReplyInput('');
                    addTemporaryResponse(cmi, reply, response.senderName);
                }else if(response.status === 'failed'){
                    console.warn(response.message);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
                setSendingReply(false);
            }).catch((e) => {
                setSendingReply(false);
                console.error(e);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            });
        }
    }

    const submitComment = () => {
        if(sendingComment){
            return;
        }
        if(commentInput.length < 3){
            props.reduxUpdateSnackbar('warning', true, 'نظر وارد شده حداقل باید شامل ۳ حرف باشد');
        }else{
            setSendingComment(true);
            let comment = commentInput;
            axios.post(Constants.apiUrl + '/api/add-comment', {
                productId: props.id,
                comment: commentInput,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.user_server_token, 
                }
            }).then((r) => {
                let response = r.data;
                if(response.status === 'done'){
                    addTemporaryComment(comment, response.senderName, response.commentId);
                    props.reduxUpdateSnackbar('success', true, 'نظر شما با موفقیت ثبت شد');
                }else if(response.status === 'failed'){
                    console.warn(response.message);
                    props.reduxUpdateSnackbar('warning', true, response.umessage);
                }
                setSendingComment(false);
            }).catch((e) => {
                setSendingComment(false);
                console.error(e);
                props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
            });
        }
    }

    const commentInputChanged = (event) => {
        setCommentInput(event.target.value);
    }

    const addTemporaryResponse = (index, reply, senderName) => {
        let newComments = [];
        comments.map((comment, i) => {
            if(i !== index){
                newComments.push(comment);
            }else{
                let newCommentResponses = comment.response;
                newCommentResponses.push({
                    comment: reply,
                    senderName: senderName,
                    date: 'لحظاتی پیش'
                });
                comment.response = newCommentResponses;
                newComments.push(comment);
            }
        });
        setComments(newComments);
    }

    const addTemporaryComment = (c, senderName, commentId) => {
        let newComments = [];
        newComments = comments;
        newComments.push({
            id: commentId,
            comment: c,
            senderName: senderName, 
            date: 'لحظاتی پیش', 
            response: []
        });
        setComments(newComments)
        /*comments.map((comment, i) => {
            if(i !== index){
                newComments.push(comment);
            }else{
                let newCommentResponses = comment.response;
                newCommentResponses.push({
                    comment: reply,
                    senderName: senderName,
                    date: 'لحظاتی پیش'
                });
                comment.response = newCommentResponses;
                newComments.push(comment);
            }
        });
        setComments(newComments);*/
    }

    const descriptionSection = (
        <div className={['row', 'py-4', 'py-md-5', 'rtl', 'px-md-5', selectedSection == 0 ? '' : 'd-none'].join(' ')} style={{backgroundColor: '#F7F7F7'}}>
            <div className={['col-12', 'px-md-5', 'mt-3', 'mt-md-0', 'rtl'].join(' ')} >
                <div className={['d-flex', 'flex-row', 'align-items-center', 'mb-2'].join(' ')}>
                    <h6 className={['mb-0', 'mr-2'].join(' ')}>مشخصات محصول</h6>
                </div>
                <table className={['table', 'table-striped', 'mt-3'].join(' ')} style={{border: '1px solid #dedede', borderRadius: '4px', backgroundColor: 'white'}}>
                    <tbody>
                        {
                            props.features.map((feature, index)=>{
                                return(
                                    <tr key={index} className={['d-flex', 'flex-row', 'align-items-center'].join(' ')}>
                                        <td className={['text-right', 'ltr', 'font-weight-bold'].join(' ')} style={{fontSize: '14px', flex: '1'}}>{feature.title}</td>
                                        <td className={['text-right', 'ltr'].join(' ')} style={{borderRight: '1px dashed #DEDEDE', fontSize: '14px', flex: '3'}}>{feature.value}</td>
                                    </tr> 
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className={['col-12', 'pl-1', 'px-5', 'rtl', 'mt-3', 'productSecondDescription'].join(' ')}>
                <div className={['mb-0', 'rtl', 'text-right', styles.infoContainer].join(' ')} style={{fontSize: '13px'}}>{parse(props.description)}</div>
            </div>
        </div>
    );

    const helpSection = (
        <div className={['row', 'py-4', 'py-md-5', 'rtl', 'px-md-5', selectedSection == 1 ? '' : 'd-none'].join(' ')} style={{backgroundColor: '#F7F7F7'}}>
            <div className={['col-12', 'text-right', 'px-md-5'].join(' ')}>
                <h6 className={['rtl'].join(' ')} style={{color: '#00BAC6'}}>- امکان مرجوه کردن کالا بدون محدودیت</h6>
                <h6 className={['rtl', 'font-weight-normal'].join(' ')} style={{lineHeight: '1.6rem', fontSize: '13px'}}>{helpSectionBigPart}</h6>
                <h6 className={['rtl', 'font-weight-normal'].join(' ')} style={{lineHeight: '1.6rem', fontSize: '13px'}}>توجه : کالاهایی که به دلیل ماهیت خاص و نوع بسته‌بندی امکان تشخیص در استفاده محصول نیست، امکان مرجوع کردن ندارند.</h6>
            </div>
            <div className={['col-12', 'mt-3', 'text-right', 'px-md-5'].join(' ')}>
                <h6 className={['rtl'].join(' ')} style={{color: '#00BAC6'}}>- ارسال رایگان سفارشات</h6>
                <h6 className={['rtl', 'font-weight-normal'].join(' ')} style={{lineHeight: '1.6rem', fontSize: '13px'}}>کلیه سفارشات پست و پیک که مجموع سبد خرید آنها بیش از ۲۰۰ هزار تومان باشد به صورت رایگان ارسال میشود. پست پیشتاز شامل ارسال رایگان نمیشود.</h6>
                <h6 className={['rtl', 'font-weight-normal'].join(' ')} style={{lineHeight: '1.6rem', fontSize: '13px'}}>ارسال سریع در شهر تهران با پیک انجام میشود و زمان رسیدن سفارش توسط شما انتخاب شده و در بازه انتخابی به دست شما میرسد</h6>
                <h6 className={['rtl', 'font-weight-normal'].join(' ')} style={{lineHeight: '1.6rem', fontSize: '13px'}}>ارسال در سایر شهرهای ایران به انتخاب خود شما توسط پست سفارشی، پیشتاز و ارسال سریع انجام میشود.</h6>
                <h6 className={['rtl', 'font-weight-normal'].join(' ')} style={{lineHeight: '1.6rem', fontSize: '13px'}}>ارسال سریع به بیش از ۲۰ استان کشور و با دریافت طی ۲۴ ساعت کاری میباشد و شامل ارسال رایگان نمیشود</h6>
            </div>
        </div>
    );

    const commentsSection = (
        <div className={['row', 'py-4', 'py-md-5', 'rtl', 'px-3', 'px-md-5', 'justify-content-left', selectedSection == 2 ? '' : 'd-none'].join(' ')} style={{background: '#F7F7F7'}}>
            {
                comments.length != 0
                ?
                (
                    <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'justify-content-between', 'align-items-center', 'px-0'].join(' ')}>
                        <div className={['d-flex', 'flex-row', 'align-items-center', 'rtl'].join(' ')}>
                            <img src={Constants.baseUrl + '/assets/images/main_images/rectangle_comment_black.png'} style={{width: '22px', height: '22px'}} />
                            <h6 className={['mb-0', 'mr-2', 'font-weight-bold'].join(' ')}>نظرات کاربران</h6>
                        </div>
                        <p className={['px-2', 'py-1', 'ml-5'].join(' ')} style={{background: '#E9E9E9', fontSize: '14px'}}>{comments.length + ' نظر'}</p>
                    </div>
                )
                : 
                (
                    null
                )
            }
            {
                comments.map((comment, index) => {
                    return (
                        <React.Fragment>
                            <div className={['col-12', index == 0 ? 'mt-1' : 'mt-3', 'px-0'].join(' ')}>
                                <div className={['p-3', 'ml-5'].join(' ')} style={{background: '#FFFFFF', borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                                    <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between'].join(' ')}>
                                        <h4 className={['mb-2', 'text-right', 'rtl', 'font11md14', 'font-weight-bold'].join(' ')} style={{color: '#00BAC6'}}>{comment.senderName}</h4>
                                        <button onClick={() => {setReplyCommentIndex(index)}} className={['font11md14', 'py-1', 'px-2', 'comment-reply-button', 'pointer'].join(' ')} style={{borderStyle: 'none', outlineStyle: 'none', border: '1px solid #00BAC6'}}>پاسخ</button>
                                    </div>
                                    <h5 className={['font11md14', 'text-right', 'rtl', 'mt-1'].join(' ')} style={{lineHeight: '1.6rem'}}>{parse(comment.comment)}</h5>
                                    <div className={['text-left', 'ltr', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-left'].join(' ')}>
                                        <h6 className={['text-center', 'rtl', 'mb-0', 'font-weight-normal'].join(' ')} style={{fontSize: '11px', color: '#F15F58'}}>{comment.date}</h6>
                                        <h6 className={['text-center', 'rtl', 'mb-0', 'px-1'].join(' ')} style={{fontSize: '11px'}}>ارسال شده در : </h6>
                                    </div>
                                </div>
                            </div>
                            {
                                replyCommentIndex === index
                                ?
                                (
                                    <React.Fragment>
                                        <div className={['col-1'].join(' ')}></div>
                                        <div className={['col-11', 'mt-3', 'p-3'].join(' ')} style={{borderRadius: '2px'}}>
                                            <h4 className={['mb-2', 'text-right', 'rtl', 'font14md17'].join(' ')} style={{color: 'black'}}>ایجاد پاسخ</h4>
                                            <textarea onChange={replyInputChanged} placeholder='پاسخ خود را وارد کنید...' className={['w-100', 'font11md14', 'text-right', 'rtl'].join(' ')} rows={2} style={{border: '1px solid #DEDEDE'}} />
                                            <div className={['d-flex', 'flex-row', 'justify-content-right', 'align-items-center', 'rtl', 'mt-2'].join(' ')}>
                                                <button onClick={submitReply} className={['font14', 'pointer', 'px-3', 'comment-reply-button'].join(' ')} style={{borderStyle: 'none', outlineStyle: 'none', border: '1px solid #00BAC6'}}>{sendingReply ? 'درحال ارسال' : 'ارسال'}</button>
                                                <button onClick={() => {setReplyCommentIndex(-1); setReplyInput('')}} className={['font14', 'pointer', 'mr-2', 'px-3', 'comment-cancel-reply-button'].join(' ')} style={{borderStyle: 'none', outlineStyle: 'none', border: '1px solid #AB0311'}}>لغو</button>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )
                                :
                                null
                            }
                            {
                                comment.response.map((r, index) => {
                                    return (
                                        <React.Fragment>
                                            <div className={['col-1'].join(' ')}></div>
                                            <div className={['col-11', 'mt-3', 'p-3'].join(' ')} style={{background: '#FBFBFB', borderRadius: '2px', border: '1px solid #DEDEDE'}}>
                                                <h4 className={['mb-2', 'text-right', 'rtl', 'font11md14'].join(' ')} style={{color: '#00BAC6'}}>{r.senderName}</h4>
                                                <h5 className={['font11md14', 'text-right', 'rtl'].join(' ')} style={{lineHeight: '1.6rem'}}>{parse(r.comment)}</h5>
                                                <div className={['text-left', 'ltr', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-left'].join(' ')}>
                                                    <h6 className={['text-center', 'rtl', 'mb-0'].join(' ')} style={{fontSize: '11px', color: '#00BAC6'}}>{r.date}</h6>
                                                    <h6 className={['text-center', 'rtl', 'mb-0', 'px-1'].join(' ')} style={{fontSize: '11px'}}>ارسال شده در : </h6>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })
                            }
                        </React.Fragment>
                    );
                })
            }
            {
                props.reduxUser.status === 'NI' || props.reduxUser.status === 'GUEST' 
                ?
                (
                    <div className={['col-12', 'd-flex', 'flex-column', 'justify-content-center', 'py-3'].join(' ')} style={{background: '#F7F7F7'}}>
                        <h6 className={['text-right', 'rtl', 'text-center'].join(' ')} style={{flex: '1'}}>برای ثبت نظر ابتدا باید وارد حساب کاربری خود شوید</h6>
                        <a href='https://honari.com/login' className={['font14md17', 'align-self-center', 'text-center', 'rtl', 'py-2', 'mt-2'].join(' ')} style={{borderRadius: '3px', background: '#00BAC6', color: 'white', width: '9rem'}}>ورود / ثبت نام</a>
                    </div>
                )
                :
                (
                    <React.Fragment>
                        <div className={['col-12', 'text-right', 'rtl', 'mt-4', 'p-0', 'm-0'].join(' ')} style={{}}>
                            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')}>
                                <img src={Constants.baseUrl + '/assets/images/main_images/add_comment_black.png'} style={{width: '22px', height: '22px'}}/>
                                <h5 className={['text-right', 'rtl', 'font14md17', 'mb-0', 'mr-2'].join(' ')} style={{color: 'black'}}>ایجاد نظر</h5>
                            </div>
                            <h6 className={['mt-1', 'pr-4'].join(' ')} style={{fontSize: '14px', color: '#00BAC6'}}>{props.reduxUser.information.name}</h6>
                            <div className={['mr-4', 'mr-md-5', 'pr-0', 'pr-md-5'].join(' ')}>
                            <textarea onChange={commentInputChanged} className={['rtl', 'text-right', 'font11md14', 'p-2', 'w-100'].join(' ')} rows={2} placeholder='نظر خود را وارد کنید...' style={{border: '1px solid #DEDEDE'}} />
                            </div>
                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'ltr', 'pr-4', 'pr-md-0'].join(' ')}>
                                <button onClick={submitComment} className={['font11md14', 'mt-2', 'py-1', 'pointer', 'col-12', 'col-md-3', 'font-weight-bold'].join(' ')} style={{borderStyle: 'none', outlineStyle: 'none', border: '1px solid #00BAC6', background: '#00BAC6', color: 'white', paddingLeft: '5rem', paddingRight: '5rem'}}>{sendingComment ? 'درحال ارسال' : 'ارسال نظر'}</button>
                            </div>
                        </div>
                    </React.Fragment>
                )
            }
        </div>
    );

    const changeSelectedImage = (index) => {
        if(selectedImage !== index){
            setSelectedImage(index);
        }
    }

    const gotoNexImage = () => {
        if(selectedImage < otherImages.length-1){
            setSelectedImage(selectedImage + 1);
        }else{
            setSelectedImage(0);
        }
    }   

    const gotoPreviousImage = () => {
        if(selectedImage > 0){
            setSelectedImage(selectedImage - 1);
        }else{
            setSelectedImage(otherImages.length - 1);
        }
    }

    return(
        <React.Fragment>
            <div className={[videoFullscreenDisplay, 'flex-row', 'align-items-center', 'justify-content-center'].join(' ')} style={{width: '100%', height: '100%', position: 'fixed', top: '0px', left: '0px', background: 'black', zIndex: '99999'}}>
                <div className={['d-flex', 'flex-row', 'align-items-center'].join(' ')} style={{position: 'absolute', top: '10px', right: '10px'}}>
                    <img onClick={() => {setVideoFullscreenDisplay('d-none')}} className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/close_white_small.png'} style={{width: '30px', height: '30px'}} />
                </div>
                <div id={aparatId} className={[''].join(' ')} style={{width: '90%'}}></div>
                <div className={['d-flex', 'd-md-none', 'flex-row', 'align-items-center', 'justify-content-center', 'w-100'].join(' ')} style={{position: 'absolute', bottom: '20px', left: '0px'}}>
                    <button onClick={() => {setVideoFullscreenDisplay('d-none')}} className={['pointer', 'px-3'].join(' ')} style={{fontSize: '17px', color: 'white', background: 'black', borderRadius: '5px', border: '1px solid white'}}>بستن</button>
                </div>
            </div>
            <div className={[''].join(' ')} style={{backgroundColor: '#F7F7F7'}}>
                <div className={['container'].join(' ')} style={{overflowX: 'hidden'}}>
                   <div className={['row', 'align-items-center', 'rtl', 'py-1', 'py-md-2', 'px-2'].join(' ')} style={{overflowX: 'hidden'}}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/youre_here.svg'} style={{width: '80px'}} />
                        <p className={['p-1', 'mb-0', 'font11', 'd-none'].join(' ')} style={{backgroundColor: 'white', border: '1px solid #D8D8D8', borderRadius: '14px 1px 1px 14px', fontSize: '11px'}}>اینجا هستید</p>
                        {
                            props.breadcrumb.map((bread, count)=>{
                                if(count == 0){
                                    return(
                                        <Link key={count} href={'/shop/product/category/' + bread.url} ><a onClick={props.reduxStartLoading} className={['breadcrumbItem', 'mb-0', 'font11', 'mr-2'].join(' ')} style={{fontSize: '11px'}} >{bread.name}</a></Link>
                                    );
                                }else{
                                    return(
                                        <React.Fragment>
                                            <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_black_small.png'} className={['mx-2'].join(' ')} style={{width: '10px'}} />
                                            <Link key={count} href={'/shop/product/category/' + bread.url} ><a onClick={props.reduxStartLoading} className={['breadcrumbItem', 'mb-0', 'font11'].join(' ')} style={{fontSize: '11px'}} >{bread.name}</a></Link>
                                        </React.Fragment>
                                    );
                                }
                            })
                        }
                   </div>
                </div>
            </div>
            <div className={['container'].join(' ')} style={{overflowX: 'hidden'}} >
                <div className={['row', 'rtl', 'mt-0', 'mt-md-4'].join(' ')}>
                    <div className={['col-12', 'col-md-5', 'px-0', 'px-md-2', 'p-3', 'p-md-0', 'mt-md-3'].join(' ')}>
                        {
                            mainImageLoaded
                            ?
                            null
                            :
                            <Skeleton variant="rectangular" style={{width: '100%', height: '440px'}} />
                        }
                        <img src={'https://honari.com/image/resizeTest/shop/_1000x/thumb_' + otherImages[selectedImage] + '.jpg'} className={[styles.mainImage, mainImageClass].join(' ')} style={{width: '100%'}} onLoad={mainImageOnLoadListener} />
                        {
                            aparatScript !== undefined && props.information.aparat !== ''
                            ?
                            <Helmet>
                                {parse(aparatScript)}
                            </Helmet>
                            :
                            null
                        }
                        <div className={['d-flex', 'flex-column', styles.otherImages, 'ml-3', 'mt-3', 'ml-md-0', 'mt-md-0'  ].join(' ')} style={{width: '3rem', height: '100%', borderRadius: '2px', zIndex: '50'}}>
                            {
                                otherImages.map((oi, index) => {
                                    return (
                                        <img src={'https://honari.com/image/resizeTest/shop/_85x/thumb_' + oi + '.jpg'} onClick={() => {changeSelectedImage(index)}} className={['pointer'].join(' ')} key={index} style={{width: '3rem', borderRadius: '2px', border: '1px solid #DEDEDE'}} />
                                    );
                                })
                            }
                            {
                                aparatScript !== undefined && props.information.aparat !== ''
                                ?
                                <div className={['pointer'].join(' ')} style={{width: '3rem', height: '3rem', position: 'relative', borderRadius: '2px'}} onClick={videoImageClicked}>
                                    <img style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: '2', opacity: '100%', border: '1px solid #DEDEDE', borderRadius: '2px'}} src={'https://honari.com/image/resizeTest/shop/_85x/thumb_' + otherImages[0] + '.jpg'} className={['pointer', otherImages.length > 1 ? 'mt-2' : ''].join(' ')} />
                                    <img src={Constants.baseUrl + '/assets/images/main_images/square_black.png'} className={[''].join(' ')} style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', opacity: '40%', zIndex: '3', border: '1px solid #DEDEDE', borderRadius: '2px'}} />
                                    <img src={Constants.baseUrl + '/assets/images/main_images/play_white_small.png'} className={[''].join(' ')} style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', opacity: '100%', zIndex: '4', border: '1px solid #DEDEDE', borderRadius: '2px'}} />
                                </div>
                                :
                                null
                            }
                        </div>
                        <div className={['d-none', 'flex-column', 'justify-content-center', 'productInsightLeftSemicircular', 'pointer'].join(' ')} style={{position: 'absolute', top: '0', height: '100%', zIndex: '50'}}>
                            
                        </div>
                        <div className={['d-none', 'flex-column', 'justify-content-center', 'productInsightRightSemicircular', 'pointer'].join(' ')} style={{position: 'absolute', top: '0', height: '100%', zIndex: '50'}}>
                            
                        </div>
                        <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'ltr'].join(' ')} style={{position: 'absolute', left: '0', top: '13rem', width: '100%', zIndex: '100'}}>
                            <img src={Constants.baseUrl + '/assets/images/main_images/left_semicircular_arrow.png'} onClick={gotoNexImage} className={['productInsightLeftSemicircular', 'pointer'].join(' ')} style={{width: '3rem', position: 'relative'}} />
                            <img src={Constants.baseUrl + '/assets/images/main_images/right_semicircular_arrow.png'} onClick={gotoPreviousImage} className={['productInsightRightSemicircular', 'pointer'].join(' ')} style={{width: '3rem', position: 'relative'}} />
                        </div>
                    </div>
                    <div className={['col-12', 'col-md-7', 'rtl', 'mt-3', 'mt-md-0', 'pr-md-4'].join(' ')}>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-start', 'justify-content-between', 'pr-md-3', 'mt-md-5'].join(' ')}>
                            <h2 className={['mb-0', 'text-right', 'rtl', 'font-weight-bold'].join(' ')} style={{fontSize: '20px', color: '#2B2B2B', lineHeight: '2.2rem'}}>{props.information.productName}</h2>
                            {   
                                props.information.productStatus === 1  ?
                                    <div  className={['d-flex', 'flex-row', 'align-items-center', 'bg-success', 'rtl', 'py-1', 'px-2', 'align-self-top'].join(' ')} style={{color: 'white', borderRadius: '2px'}}>
                                        <img src={Constants.baseUrl + '/assets/images/main_images/tick_white_small.png'} className={['d-none'].join(' ')} style={{width: '12px', height: '12px'}} />
                                        <small className={['mb-0', 'mr-1'].join(' ')}>موجود</small>
                                    </div>
                                :
                                    (props.information.productStatus === -1 ?
                                        <div className={['d-flex', 'flex-row', 'align-items-center', 'bg-danger', 'rtl', 'py-1', 'px-2', 'align-self-top'].join(' ')} style={{color: 'white', borderRadius: '2px'}}>
                                            <img src={Constants.baseUrl + '/assets/images/main_images/cross_white_small.png'} className={['d-none'].join(' ')} style={{width: '12px', height: '12px'}} />
                                            <small className={['mb-0', 'mr-1'].join(' ')}>ناموجود</small>
                                        </div>
                                    :
                                        (props.information.productStatus === 0) ?
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'bg-warning', 'rtl', 'py-1', 'px-2', 'align-self-top'].join(' ')} style={{color: 'white', borderRadius: '2px'}}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/tick_white_small.png'} className={['d-none'].join(' ')} style={{width: '12px', height: '12px'}} />
                                                <small className={['mb-0', 'mr-1'].join(' ')}>بزودی</small>
                                            </div>
                                        :
                                            null
                                    )
                            }
                        </div>
                        {
                            props.information
                            ?
                            (
                                (props.information.productStatus === 1) ? 
                                <React.Fragment>
                                {
                                    props.information.type === 'product'
                                    ?
                                    (
                                        <React.Fragment>
                                            <h6 className={['w-100', 'mb-1', 'text-right', 'mt-5', 'pr-md-3'].join(' ')} style={{fontSize: '17px', color: '#949494'}}>انتخاب نوع بسته</h6>
                                            <div className={['d-flex', 'flex-row', 'row', 'align-items-center', 'mx-0', 'px-2', 'py-1', 'mr-md-3'].join(' ')} style={{border: '1px solid #D8D8D8'}}>
                                                <input type='radio' className={['form-control', 'd-none'].join(' ')} checked={true} style={{width: '14px'}} value='' />
                                                <img src={Constants.baseUrl + '/assets/images/main_images/radio_button_main.png'} style={{width: '14px', height: '14px'}} />
                                                <label className={['mb-0', 'mr-2', 'text-right', 'rtl'].join(' ')} style={{fontSize: '14px'}}>{props.information.productLabel}</label>
                                                {
                                                    props.information.productBasePrice !== undefined
                                                    ?
                                                    <label className={['mb-0', 'text-danger', 'mr-1', 'text-right', 'rtl'].join(' ')} style={{fontSize: '14px'}}>{'( هر واحد ' + props.information.productBasePrice.toLocaleString() + ' تومان )'}</label>
                                                    :
                                                    null
                                                }
                                            </div>
                                        </React.Fragment>
                                    )
                                    :
                                    (
                                        <React.Fragment>
                                            <h5 className={['font-wieight-normal', 'text-right', 'mr-3', 'mt-3'].join(' ')} style={{fontSize: '17px', color: '#949494'}}>محتویات بسته</h5>
                                            <div className={['d-flex', 'flex-column', 'rtl', 'p-4', 'mr-3'].join(' ')} style={{border: '1px solid #DEDEDE', maxHeight: '200px', overflowY: 'scroll'}}>
                                                
                                                {
                                                    props.information.subProducts.map((subProduct, index) => {
                                                        return (
                                                            <Link href={subProduct.url}>
                                                                <a className={[index == 0 ? '' : 'mt-4'].join(' ')}>
                                                                    <div className={['d-flex', 'flex-row', 'justify-content-start', 'rtl', 'align-items-center', 'pr-2'].join(' ')}>
                                                                        <img src={Constants.baseUrl + '/assets/images/main_images/circle_main.png'} style={{width: '8px', height: '8px'}} />
                                                                        <h6 className={['mb-0', 'text-right', 'mr-2'].join(' ')} style={{fontSize: '13px'}}>{subProduct.name}</h6>
                                                                    </div>
                                                                </a>
                                                            </Link>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </React.Fragment>
                                    )
                                }
                                <div className={['row', 'align-items-center', 'mt-5', 'pt-2', 'pr-md-3'].join(' ')}>
                                {
                                    props.information.productPrice !== undefined && props.information.discountedPrice !== undefined
                                    ?                                                   
                                    (
                                        props.information.productPrice != props.information.discountedPrice
                                        ?
                                            <div className={['col-12', 'col-md-6', 'd-flex', 'flex-row', 'align-items-center'].join(' ')}>
                                                <h6 className={['mb-0']} style={{fontSize: '17px'}}>قیمت برای شما : </h6>
                                                <h6 className={['text-secondary', 'mb-0', 'mr-2'].join(' ')} style={{fontSize: '20px'}}><del>{props.information.productPrice.toLocaleString() + ' تومان '}</del></h6>
                                                <h6 className={['p-1', 'mb-0', 'bg-danger', 'text-white', 'mr-2', 'rtl'].join(' ')} style={{fontSize: '17px', borderRadius: '2px'}}>{'تخفیف ٪' + props.information.discountPercent}</h6>
                                            </div>  
                                        :
                                        null
                                    )
                                    : 
                                    null
                                }
                                {
                                    props.information.productPrice !== props.information.discountedPrice ?
                                        <div className={['col-12', 'col-md-6', 'd-flex', 'flex-row', 'align-items-center', 'mt-2', 'mt-md-0'].join(' ')}>
                                            <h5 className={['mb-0']} style={{fontSize: '17px'}}>قیمت برای شما : </h5>
                                            <h5 className={['mb-0', 'mr-2'].join(' ')} style={{color: '#00bac6', fontSize: '20px'}}>{props.information.discountedPrice.toLocaleString() + ' تومان '}</h5>
                                        </div>
                                    :
                                        <div className={['col-12', 'col-md-6', 'd-flex', 'flex-row', 'align-items-center'].join(' ')}>
                                            <h5 className={['mb-0']} style={{fontSize: '17px'}}>قیمت برای شما : </h5>
                                            <h5 className={['mb-0', 'mr-2'].join(' ')} style={{color: '#00bac6', fontSize: '20px'}}>{props.information.productPrice.toLocaleString() + ' تومان '}</h5>
                                        </div>
                                }
                                </div>
                                {
                                    !productExistsOrNot() 
                                    ?
                                    (
                                        <div className={['row', 'rtl', 'align-items-center', 'mt-5', 'pr-md-3'].join(' ')}>
                                            <div className={['col-6', 'd-flex', 'flex-row', 'rtl', 'align-items-center'].join(' ')}>
                                                <h6 className={['mb-0', 'ml-2'].join(' ')} style={{fontSize: '14px'}}>تعداد : </h6>
                                                <img onClick={increaseOrderCountByOne} className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/plus_gray_circle.png'} style={{width: '26px', height: '26px'}} />
                                                <h6 className={['mb-0', 'px-3', 'text-center'].join(' ')} style={{fontSize: '17px', color: '#2B2B2B'}}>{orderCount}</h6>
                                                <img onClick={decreaseOrderCountByOne} className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/minus_gray_circle.png'} style={{width: '26px', height: '26px'}} />
                                            </div>
                                            <div onClick={() => {informationRef.current.scrollIntoView(); window.scrollBy(0, -120)}} className={['col-6', 'd-flex', 'flex-row', 'align-items-center', 'pointer'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/down_arrow_black_small.png'} style={{width: '7px', height: '7px'}} />
                                                <span className={['mr-2'].join(' ')} style={{fontSize: '14px'}}>توضیحات بیشتر</span>
                                            </div>
                                        </div>
                                    )
                                    :
                                    (
                                        <div className={['row', 'align-items-center', 'mt-5', 'pr-md-3', 'mb-5'].join(' ')}>
                                            <div className={['col-6', 'd-flex', 'flex-row', 'align-items-center', 'text-right', 'rtl'].join(' ')}>
                                                <h6 className={['mb-0', 'ml-2'].join(' ')} style={{fontSize: '14px'}}>تعداد : </h6>
                                                <img onClick={increaseButtonClicked} className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/plus_gray_circle.png'} style={{width: '26px', height: '26px'}} />
                                                <h6 className={['mb-0', 'px-3', 'text-center'].join(' ')} style={{fontSize: '17px', color: '#2B2B2B'}}>{getProductOrderCount()}</h6>
                                                {
                                                    getProductOrderCount() === 1
                                                    ?
                                                    <img onClick={removeFromCartButtonClicked} className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/bin_red.png'} style={{width: '26px', height: '26px'}} />
                                                    :
                                                    <img onClick={decreaseButtonClicked} className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/minus_gray_circle.png'} style={{width: '26px', height: '26px'}} />
                                                }
                                            </div>
                                            <div onClick={() => {informationRef.current.scrollIntoView(); window.scrollBy(0, -120)}} className={['col-6', 'd-flex', 'flex-row', 'align-items-center', 'pointer'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/down_arrow_black_small.png'} style={{width: '7px', height: '7px'}} />
                                                <span className={['mr-2'].join(' ')} style={{fontSize: '14px'}}>توضیحات بیشتر</span>
                                            </div>
                                        </div>
                                    )
                                }
                                <div className={['d-flex', 'flex-row', 'justify-content-center', 'mr-md-3'].join(' ')}>
                                {
                                    !productExistsOrNot() ?
                                        <button className={['d-flex', 'flex-row', 'align-items-center', 'mt-5', 'py-2', 'pointer', 'mb-2', 'mb-md-0'].join(' ')} style={{backgroundColor: '#00bac6', color: 'white', borderStyle: 'none', borderRadius: '2px', outlineStyle: 'none', paddingRight: '6rem', paddingLeft: '6rem'}} onClick={addToCartButtonClicked}>اضافه به سبد خرید</button>
                                    :
                                    null
                                }
                                </div>
                                
                                </React.Fragment>
                                : 
                                    (props.information.productStatus === -1 ?
                                        <div className={['rtl', 'text-right'].join(' ')}>
                                            <div className={['mt-3', 'mt-md-2', 'd-none'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
                                            <span className={['py-3', 'px-4', 'mt-5', 'd-inline-block', 'mr-md-3'].join(' ')} style={{backgroundColor: '#8c8c8c', color: 'white', borderRadius: '4px'}}>موجود نیست</span>
                                            <div onClick={setReminderButtonClicked} className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'mt-5', 'mr-md-3', 'pointer'].join(' ')}>
                                                <img src={Constants.baseUrl + '/assets/images/main_images/bell_red.png'} style={{width: '24px', height: '24px'}} />
                                                <span className={['mr-1', 'pointer'].join(' ')} style={{color: '#00bac6'}}>درصورت موجود شدن به من اطلاع دهید</span>
                                            </div>
                                        </div>
                                    :
                                    (props.information.productStatus === 0 ?
                                        <div className={['rtl', 'text-right'].join(' ')}>
                                            <div className={['mt-3', 'mt-md-2'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
                                            <span className={['py-3', 'px-4', 'mt-2', 'd-inline-block', 'bg-warning', 'text-dark'].join(' ')} style={{backgroundColor: '#8c8c8c', color: 'white', borderRadius: '4px'}}>بزودی ارائه میشود</span>
                                        </div>
                                    :
                                        null
                                    )
                                )
                            )
                            :
                            (
                                <React.Fragment>
                                    <Skeleton variant="text" style={{fontSize: '22px'}} />
                                    <Skeleton variant="text" style={{fontSize: '22px'}} />
                                    <Skeleton variant="text" style={{fontSize: '22px'}} />
                                    <Skeleton variant="text" style={{fontSize: '22px'}} />
                                </React.Fragment>
                            )
                        }
                        
                    </div>
                </div>
                <div className={['row', 'rtl', 'mt-3', 'mt-md-5', 'px-md-2', styles.tripleBanner].join(' ')}>
                    <div className={['col-12', 'd-flex', 'flex-row', 'justify-content-between', 'align-items-center', 'px-0', 'mx-0', 'py-2'].join(' ')} style={{border: '1px solid #dedede', borderRadius: '4px', boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.05)'}}>
                    <Link href='/site/help#delivery_type'><a onClick={props.reduxStartLoading} className={['d-flex', 'flex-column', 'flex-lg-row', 'justify-content-center', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/time.svg'} className={[styles.tripleBannerImage]} />
                    <div className={['d-flex', 'flex-column', 'text-center', 'text-lg-right', 'pr-2', 'py-0'].join(' ')}>
                        <h6 className={['mb-1', styles.tripleBannerTitle].join(' ')} style={{color: '#444444', fontWeight: '400'}}>ارسال سریع</h6>
                        <h6 className={['mb-0', 'mt-auto', styles.tripleBannerTitle].join(' ')} style={{color: '#494949', fontWeight: '500'}}>به سراسر کشور</h6>
                    </div>
                    </a></Link>
                    <Link href='/site/help#free_post'><a onClick={props.reduxStartLoading} className={['d-flex', 'flex-column', 'flex-lg-row', 'justify-content-center', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/delivery.svg'} className={[styles.tripleBannerImage]} style={{height: '100%'}} />
                    <div className={['d-flex', 'flex-column', 'text-center', 'text-lg-right', 'pr-2', 'py-0'].join(' ')}>
                        <h6 className={['mb-1', styles.tripleBannerTitle].join(' ')} style={{color: '#444444', fontWeight: '400'}}>ارسال رایگان</h6>
                        <h6 className={['mb-0', 'mt-auto', styles.tripleBannerTitle].join(' ')} style={{color: '#494949', fontWeight: '500'}}> خرید بالای ۲۵۰ هزارتومان</h6>
                    </div>
                    </a></Link>
                    <Link href='/site/help#return_product'><a className={['d-flex', 'flex-column', 'flex-lg-row', 'justify-content-center', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/return.svg'} className={[styles.tripleBannerImage]} />
                    <div className={['d-flex', 'flex-column', 'text-center', 'text-md-right', 'pr-2', 'py-0'].join(' ')}>
                        <h6 className={['mb-1', styles.tripleBannerTitle].join(' ')} style={{color: '#444444', fontWeight: '400'}}>امکان مرجوعی کالا</h6>
                        <h6 className={['mb-0', 'mt-auto', styles.tripleBannerTitle].join(' ')} style={{color: '#494949', fontWeight: '500'}}>بدون محدودیت زمانی</h6>
                    </div>
                    </a></Link>
                </div>
            </div>
            </div>
            <div className={['container', 'mt-5'].join(' ')} ref={informationRef}>
                <div className={['row', 'rtl', 'mt-3'].join(' ')}>
                    <h6 className={['py-3', 'col-4', 'pointer', 'text-center', 'mb-0', 'font14md17'].join(' ')} style={{background: getSectionBackground(0), borderTop: selectedSection !== 0 ? '2px solid #DEDEDE' : '', borderBottom: selectedSection !== 0 ? '2px solid #DEDEDE' : '', borderRight: selectedSection !== 0 ? '1px solid #DEDEDE' : '', borderLeft: selectedSection !== 0 ? '1px solid #DEDEDE' : ''}} onClick={()=>{setSelectedSection(0)}}>توضیحات محصول</h6>
                    <h6 className={['py-3', 'col-4', 'pointer', 'text-center', 'mb-0', 'font14md17'].join(' ')} style={{background: getSectionBackground(1), borderTop: selectedSection !== 1 ? '2px solid #DEDEDE' : '', borderBottom: selectedSection !== 1 ? '2px solid #DEDEDE' : '', borderRight: selectedSection !== 1 ? '1px solid #DEDEDE' : '', borderLeft: selectedSection !== 1 ? '1px solid #DEDEDE' : ''}} onClick={()=>{setSelectedSection(1)}}>ارسال و مرجوعی</h6>
                    <h6 className={['py-3', 'col-4', 'pointer', 'text-center', 'mb-0', 'font14md17'].join(' ')} style={{background: getSectionBackground(2), borderTop: selectedSection !== 2 ? '2px solid #DEDEDE' : '', borderBottom: selectedSection !== 2 ? '2px solid #DEDEDE' : '', borderRight: selectedSection !== 2 ? '1px solid #DEDEDE' : '', borderLeft: selectedSection !== 2 ? '1px solid #DEDEDE' : ''}} onClick={()=>{setSelectedSection(2)}}>نظر کاربران</h6>
                </div>
                {/*
                    selectedSection == 0 
                    ?
                    descriptionSection
                    :
                    (
                        selectedSection == 1
                        ?
                        helpSection
                        :
                        (
                            selectedSection == 2
                            ?
                            commentsSection
                            :
                            null
                        )
                    )
                        */
                    }
                    {descriptionSection}
                    {helpSection}
                    {commentsSection}
            </div>
            <div className={['container'].join(' ')}>
                    <TopSixProducts title='محصولات مشابه' entries={props.similarProducts} />   
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductInsight);
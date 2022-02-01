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

    let helpSectionBigPart = 'همه تلاش ما این است که کالای خریداری شده در شرایط مطلوب به دست شما برسد، باوجود این ممکن است پس از خرید به هر دلیل تصمیم به بازگرداندن کالا بگیرید.';
    helpSectionBigPart += ' ما این امکان را برای شما درنظر گرفته‌ایم که با آسودگی خاطر تا مدت ۱۰ روز بعد از دریافت کالا، برای بازگرداندن با هزینه‌ی خود اقدام نمایید.';
    helpSectionBigPart += ' کالا باید در شرایط اولیه همراه با بسته بندی و لیبل بدون آسیب دیدگی و پارگی باشد. درصورت بازشدن پلمپ کالا امکان مرجوع کردن آن وجود ندارد.';

    /*useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/product-basic-information', {
            productId: id,
        }).then((res)=>{
            alert('getting product basic information');
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
    }, []);*/

    useEffect(()=>{
        setOtherImages([]);
        setSelectedImage(0);
        setAparatId(0);
        setAparatScript(undefined);
        setProductInformationReceived(false);
        setMainImageClass('d-none');
        setMainImageLoaded(false);
        axios.post(Constants.apiUrl + '/api/product-basic-information', {
            productId: props.id,
        }).then((res)=>{
            if(res.data.status === 'done'){
                let response = res.data;
                setProductInformation(response.information);
                setProductInformationReceived(true);
                if(response.information.aparat !== ''){
                    let aparat = response.information.aparat;
                    //<div id="18340515441"><script type="text/JavaScript" src="https://www.aparat.com/embed/Oo3Cw?data[rnddiv]=18340515441&data[responsive]=yes"></script></div>    
                    let containerIsGotten = false;
                    let scriptIsGotten = false;
                    let idPermissionIsGranted = false;
                    let scriptPermissionIsGranted = false;
                    let aparatIdString = '';
                    let aparatScriptString = '';
                    let sizeOfString = response.information.aparat.length;
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
                    setAparatScript(aparatScriptString);
                    setAparatId(parseInt(aparatIdString));
                    setAparatContainerDiv(<div id={parseInt(aparatIdString)}></div>);
                }

                let imgs = [];
                imgs.push(response.information.prodID);

                if(response.information.productOtherImages.length !== 0){
                    let images = response.information.productOtherImages;
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
            }else{
                console.log(res.data.umessage);
                props.reduxUpdateSnackbar('warning', true, res.data.umessage);
            }
        }).catch((error)=>{
            console.log(error);
        });
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

    /*useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/product-description', {
            id: props.id,
        }).then((res)=>{
            let response = res.data;
            setProductDescriptionState(parse(response));
        }).catch((error)=>{
            console.log(error);
        });
    }, [id, props.id]);*/

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

    /*useEffect(() => {
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
    }, [props.reduxCart.status, 'NI']);*/

    const productCounterChanged = (event) => {
        if(event.target.value < 1){
            event.target.value = 1;
            setOrderCount(1);
        }else if(event.target.value > productInformation.maxCount){
            event.target.value = productInformation.maxCount;
            setOrderCount(productInformation.maxCount);
        }else{
            setOrderCount(parseInt(event.target.value));
        }
    }

    const increaseOrderCountByOne = () => {
        if(orderCount < productInformation.maxCount){
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
            }
        }
    }

    const removeFromCartButtonClicked = () => {
        if(!axiosProcessing){
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
                    if(productInformation.productPackId !== cartItem.id){
                        newCart.push(cartItem);
                    }
                });
                localStorage.setItem('user_cart', JSON.stringify(newCart));
                props.reduxRemoveFromCart(productInformation.productPackId);
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
                productPackId: productInformation.productPackId,
                count: parseInt(orderCount) + 1
            }).then((res) => {
                let response = res.data;
                if(response.status == 'done'){
                    updateProductInLocalStorage(response.count);
                    props.reduxIncreaseCountByOne(productInformation.productPackId);
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
                productPackId: productInformation.productPackId
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.user_server_token, 
                }
            }).then((res) => {
                let response = res.data;
                if(response.status == 'done'){
                    props.reduxIncreaseCountByOne(productInformation.productPackId);
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
                productPackId: productInformation.productPackId,
                count: parseInt(orderCount) - 1
            }).then((res) => {
                setAxiosProcessing(false);
                let response = res.data;
                if(response.status == 'done'){
                    updateProductInLocalStorage(response.count);
                    props.reduxDecreaseCountByOne(productInformation.productPackId);
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
                productPackId: productInformation.productPackId
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.user_server_token, 
                }
            }).then((res) => {
                let response = res.data;
                setAxiosProcessing(false);
                if(response.status == 'done'){
                    props.reduxDecreaseCountByOne(productInformation.productPackId);
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
            if(product.productPackId == productInformation.productPackId){
                found = true;
            }
        });
        return found;
    }

    const getProductOrderCount = () => {
        let productCount = 0;
        props.reduxCart.information.map((product, index) => {
            if(product.productPackId == productInformation.productPackId){
                productCount = product.count;
            }
        });
        return productCount;
    }

    const updateProductInLocalStorage = (count) => {
        let localStorageCart = JSON.parse(localStorage.getItem('user_cart'));
        for(let item of localStorageCart){
            if(item.id == productInformation.productPackId){
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
            return "#F2F2F2"
        }else{
            return "#DEDEDE";
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
        <div className={['row', 'py-4', 'py-md-5', 'rtl', 'px-md-5'].join(' ')} style={{backgroundColor: '#F2F2F2'}}>
            <div className={['col-12', 'px-md-5', 'mt-3', 'mt-md-0', 'rtl'].join(' ')} >
                <div className={['d-flex', 'flex-row', 'align-items-center', 'mb-2'].join(' ')}>
                    <h6 className={['mb-0', 'mr-2'].join(' ')}>مشخصات محصول</h6>
                </div>
                <table className={['table', 'table-striped', 'mt-3'].join(' ')} style={{border: '1px solid #dedede', borderRadius: '4px', backgroundColor: 'white'}}>
                    <tbody>
                        {
                            productFeaturesState.map((feature, index)=>{
                                return(
                                    <tr key={index}>
                                        <td className={['text-right', 'ltr'].join(' ')}>{feature.title}</td>
                                        <td className={['text-right', 'ltr'].join(' ')} style={{borderRight: '1px dashed #DEDEDE'}}>{feature.value}</td>
                                    </tr> 
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className={['col-12', 'pl-1', 'px-5', 'rtl', 'mt-3'].join(' ')}>
                <div className={['mb-0', 'rtl', 'text-right', styles.infoContainer].join(' ')} style={{}}>{parse(props.description)}</div>
            </div>
        </div>
    );

    const helpSection = (
        <div className={['row', 'py-4', 'py-md-5', 'rtl', 'px-md-5'].join(' ')} style={{backgroundColor: '#F2F2F2'}}>
            <div className={['col-12', 'text-right', 'px-md-5'].join(' ')}>
                <h6 className={['rtl'].join(' ')} style={{color: '#00BAC6'}}>- امکان مرجوه کردن کالا بدون محدودیت</h6>
                <h6 className={['rtl'].join(' ')}>{helpSectionBigPart}</h6>
                <h6 className={['rtl'].join(' ')}>توجه : کالاهایی که به دلیل ماهیت خاص و نوع بسته‌بندی امکان تشخیص در استفاده محصول نیست، امکان مرجوع کردن ندارند.</h6>
            </div>
            <div className={['col-12', 'mt-3', 'text-right', 'px-md-5'].join(' ')}>
                <h6 className={['rtl'].join(' ')} style={{color: '#00BAC6'}}>- ارسال رایگان سفارشات</h6>
                <h6 className={['rtl'].join(' ')}>کلیه سفارشات پست و پیک که مجموع سبد خرید آنها بیش از ۲۰۰ هزار تومان باشد به صورت رایگان ارسال میشود. پست پیشتاز شامل ارسال رایگان نمیشود.</h6>
                <h6 className={['rtl'].join(' ')}>ارسال سریع در شهر تهران با پیک انجام میشود و زمان رسیدن سفارش توسط شما انتخاب شده و در بازه انتخابی به دست شما میرسد</h6>
                <h6 className={['rtl'].join(' ')}>ارسال در سایر شهرهای ایران به انتخاب خود شما توسط پست سفارشی، پیشتاز و ارسال سریع انجام میشود.</h6>
                <h6 className={['rtl'].join(' ')}>ارسال سریع به بیش از ۲۰ استان کشور و با دریافت طی ۲۴ ساعت کاری میباشد و شامل ارسال رایگان نمیشود</h6>
            </div>
        </div>
    );

    const commentsSection = (
        <div className={['row', 'py-4', 'py-md-5', 'rtl', 'px-3', 'px-md-5', 'justify-content-left'].join(' ')} style={{background: '#F2F2F2'}}>
            {
                comments.map((comment, index) => {
                    return (
                        <React.Fragment>
                            <div className={['col-12', 'mt-3', 'p-3'].join(' ')} style={{background: '#FFFFFF', borderRadius: '2px'}}>
                                <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between'].join(' ')}>
                                    <h4 className={['mb-2', 'text-right', 'rtl', 'font11md14'].join(' ')} style={{color: '#00BAC6'}}>{comment.senderName}</h4>
                                    <button onClick={() => {setReplyCommentIndex(index)}} className={['font11md14', 'py-1', 'px-2', 'comment-reply-button', 'pointer'].join(' ')} style={{borderStyle: 'none', outlineStyle: 'none', border: '1px solid #00BAC6'}}>پاسخ</button>
                                </div>
                                <h5 className={['font11md14', 'text-right', 'rtl'].join(' ')}>{parse(comment.comment)}</h5>
                                <div className={['text-left', 'ltr', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-left'].join(' ')}>
                                    <h6 className={['text-center', 'rtl', 'mb-0'].join(' ')} style={{fontSize: '11px', color: '#00BAC6'}}>{comment.date}</h6>
                                    <h6 className={['text-center', 'rtl', 'mb-0', 'px-1'].join(' ')} style={{fontSize: '11px'}}>ارسال شده در : </h6>
                                </div>
                            </div>
                            {
                                replyCommentIndex === index
                                ?
                                (
                                    <React.Fragment>
                                        <div className={['col-1'].join(' ')}></div>
                                        <div className={['col-11', 'mt-3', 'p-3'].join(' ')} style={{background: '#FFFFFF', borderRadius: '2px'}}>
                                            <h4 className={['mb-2', 'text-right', 'rtl', 'font14md17'].join(' ')} style={{color: '#00BAC6'}}>ایجاد پاسخ</h4>
                                            <textarea onChange={replyInputChanged} placeholder='پاسخ خود را وارد کنید...' className={['w-100', 'font11md14', 'text-right', 'rtl'].join(' ')} rows={2} />
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
                                            <div className={['col-11', 'mt-3', 'p-3'].join(' ')} style={{background: '#FFFFFF', borderRadius: '2px'}}>
                                                <h4 className={['mb-2', 'text-right', 'rtl', 'font11md14'].join(' ')} style={{color: '#00BAC6'}}>{r.senderName}</h4>
                                                <h5 className={['font11md14', 'text-right', 'rtl'].join(' ')}>{parse(r.comment)}</h5>
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
                    <div className={['col-12', 'd-flex', 'flex-column', 'justify-content-center', 'py-3'].join(' ')} style={{background: '#F2F2F2'}}>
                        <h6 className={['text-right', 'rtl', 'text-center'].join(' ')} style={{flex: '1'}}>برای ثبت نظر ابتدا باید وارد حساب کاربری خود شوید</h6>
                        <a href='https://honari.com/login' className={['font14md17', 'align-self-center', 'text-center', 'rtl', 'py-2', 'mt-2'].join(' ')} style={{borderRadius: '3px', background: '#00BAC6', color: 'white', width: '9rem'}}>ورود / ثبت نام</a>
                    </div>
                )
                :
                (
                    <div className={['col-12', 'text-right', 'rtl', 'mt-3', 'p-3'].join(' ')} style={{background: 'white'}}>
                        <h5 className={['text-right', 'rtl', 'font14md17'].join(' ')} style={{background: 'white', color: '#00BAC6'}}>ایجاد نظر</h5>
                        <textarea onChange={commentInputChanged} className={['rtl', 'text-right', 'w-100', 'font11md14'].join(' ')} rows={2} placeholder='نظر خود را وارد کنید...' />
                        <button onClick={submitComment} className={['font11md14', 'mt-2', 'px-3', 'py-1', 'comment-reply-button', 'pointer'].join(' ')} style={{borderStyle: 'none', outlineStyle: 'none', borderRadius: '3px', border: '1px solid #00BAC6'}}>{sendingComment ? 'درحال ارسال' : 'ثبت نظر'}</button>
                    </div>
                )
            }
        </div>
    );

    const changeSelectedImage = (index) => {
        if(selectedImage !== index){
            setSelectedImage(index);
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
            <div className={[''].join(' ')} style={{backgroundColor: '#F2F2F2'}}>
                <div className={['container', 'd-flex', 'flex-row', 'align-items-center', 'rtl', 'py-1', 'py-md-2', 'px-2'].join(' ')}>
                    <Breadcrumbs>
                    <p className={['p-1', 'mb-0', 'font11md14'].join(' ')} style={{backgroundColor: 'white', border: '1px solid #8bf0f7', borderRadius: '14px 1px 1px 14px'}}>اینجا هستید</p>
                        {
                            breadcrumbState.map((bread, count)=>{
                                return(
                                    <Link key={count} href={'/shop/product/category/' + bread.url} ><a onClick={props.reduxStartLoading} className={['breadcrumbItem', 'mb-0', 'font11md14'].join(' ')} style={{}} >{bread.name}</a></Link>
                                );
                            })
                        }
                    </Breadcrumbs>
                </div>
            </div>
            <div className={['container'].join(' ')} >
                <div className={['row', 'rtl', 'mt-0', 'mt-md-3'].join(' ')}>
                    <div className={['col-12', 'col-md-5', 'px-0', 'px-md-2'].join(' ')}>
                        {
                            mainImageLoaded
                            ?
                            null
                            :
                            <Skeleton variant="rectangular" style={{width: '100%', height: '440px'}} />
                        }
                        <img src={'https://honari.com/image/resizeTest/shop/_1000x/thumb_' + otherImages[selectedImage] + '.jpg'} className={[styles.mainImage, mainImageClass].join(' ')} style={{width: '100%'}} onLoad={mainImageOnLoadListener} />
                        {
                            aparatScript !== undefined && productInformation.aparat !== ''
                            ?
                            <Helmet>
                                {parse(aparatScript)}
                            </Helmet>
                            :
                            null
                        }
                        <div className={['d-flex', 'flex-column', 'justify-content-center'].join(' ')} style={{width: '3rem', height: '100%', borderRadius: '2px', position: 'absolute', top: '0', left: '0.6rem'}}>
                            {
                                otherImages.map((oi, index) => {
                                    return (
                                        <img src={'https://honari.com/image/resizeTest/shop/_1000x/thumb_' + oi + '.jpg'} onClick={() => {changeSelectedImage(index)}} className={[index !== 0 ? 'mt-2' : '', 'pointer'].join(' ')} key={index} style={{width: '3rem', borderRadius: '2px', border: '1px solid #DEDEDE'}} />
                                    );
                                })
                            }
                            {
                                aparatScript !== undefined && productInformation.aparat !== ''
                                ?
                                <img src={Constants.baseUrl + '/assets/images/main_images/video.png'} className={['pointer', otherImages.length > 1 ? 'mt-2' : ''].join(' ')} onClick={videoImageClicked} style={{width: '3rem'}} />
                                :
                                null
                            }
                        </div>
                    </div>
                    <div className={['col-12', 'col-md-7', 'rtl', 'mt-3', 'mt-md-0'].join(' ')}>
                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between'].join(' ')}>
                            <h2 className={['mb-0', 'text-right', 'rtl'].join(' ')} style={{fontSize: '20px'}}>{props.name}</h2>
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
                            productInformationReceived
                            ?
                            (
                                (productInformation.productStatus === 1) ? 
                                <React.Fragment>
                                <div className={['mt-3', 'mt-md-2'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
                                <h6 className={['w-100', 'mb-1', 'text-right', 'mt-4', 'd-none'].join(' ')} style={{fontSize: '18px'}}>انتخاب نوع بسته</h6>
                                <div className={['d-flex', 'flex-row', 'row', 'align-items-center', 'mx-0', 'px-1', 'mt-4', 'py-1'].join(' ')} style={{border: '1px solid #C4C4C4', borderRadius: '4px'}}>
                                    <input type='radio' className={['form-control', 'd-none'].join(' ')} checked={true} style={{width: '16px'}} value='سلام' />
                                    <label className={['mb-0', 'mr-1', 'text-right', 'rtl'].join(' ')}>{productInformation.productLabel}</label>
                                    {
                                        productInformation.productBasePrice !== undefined
                                        ?
                                        <label className={['mb-0', 'text-danger', 'mr-1', 'text-right', 'rtl'].join(' ')}>{'( هر واحد ' + productInformation.productBasePrice.toLocaleString() + ' تومان )'}</label>
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
                                {
                                    !productExistsOrNot() 
                                    ?
                                    (
                                        /*<div className={['d-flex', 'flex-row', 'align-items-center', 'mt-4'].join(' ')}>
                                            <h6 className={['mb-0'].join(' ')}>تعداد : </h6>
                                            <input type='number' className={['mr-1', 'text-center'].join(' ')} defaultValue='1' style={{width: '50px', outline: 'none', outlineStyle: 'none', borderStyle: 'none', border: '1px solid #C4C4C4', borderRadius: '4px'}} onChange={productCounterChanged} />
                                        </div>*/
                                        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'mt-3'].join(' ')}>
                                            <img onClick={increaseOrderCountByOne} className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/plus_gray_circle.png'} style={{width: '26px', height: '26px'}} />
                                            <h6 className={['mb-0', 'px-3', 'text-center'].join(' ')} style={{fontSize: '17px', color: '#2B2B2B'}}>{orderCount}</h6>
                                            <img onClick={decreaseOrderCountByOne} className={['pointer'].join(' ')} src={Constants.baseUrl + '/assets/images/main_images/minus_gray_circle.png'} style={{width: '26px', height: '26px'}} />
                                        </div>
                                    )
                                    :
                                    null
                                }
                                {
                                    !productExistsOrNot() ?
                                        <button className={['d-flex', 'flex-row', 'align-items-center', 'btn', 'mt-4'].join(' ')} style={{backgroundColor: '#00bac6'}} onClick={addToCartButtonClicked}>
                                            <img src={Constants.baseUrl + '/assets/images/main_images/cart_white_small.png'} style={{width: '20px', height: '20px'}} />
                                            <span className={['text-white', 'mr-2'].join(' ')} >افزودن به سبد خرید</span>
                                        </button>
                                    :
                                    (
                                        productExistsOrNot() ?
                                        <React.Fragment>
                                            <div className={['d-flex', 'flex-row', 'align-items-center', 'text-right', 'rtl', 'mt-3'].join(' ')}>
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
                                        </React.Fragment>
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
                                            <div onClick={setReminderButtonClicked} className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-start', 'mt-3', 'd-none', 'pointer'].join(' ')}>
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
                <div className={['row', 'rtl', 'mt-3', 'mt-md-4', 'px-md-2', styles.tripleBanner].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-row', 'justify-content-between', 'align-items-center', 'px-0', 'mx-0', 'py-2', 'shadow-sm'].join(' ')} style={{border: '1px solid #dedede', borderRadius: '4px'}}>
                    <Link href='/site/help#delivery_type'><a onClick={props.reduxStartLoading} className={['d-flex', 'flex-column', 'flex-lg-row', 'justify-content-center', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/fast_delivery.png'} className={[styles.tripleBannerImage]} />
                    <div className={['d-flex', 'flex-column', 'text-center', 'text-lg-right', 'pr-2', 'py-0'].join(' ')}>
                        <h6 className={['mb-0', 'font-weight-bold', styles.tripleBannerTitle].join(' ')} style={{color: '#707070'}}>ارسال سریع</h6>
                        <h6 className={['mb-0', 'mt-auto', 'font-weight-bold', styles.tripleBannerTitle].join(' ')}>به سراسر کشور</h6>
                    </div>
                    </a></Link>
                    <Link href='/site/help#post_free'><a onClick={props.reduxStartLoading} className={['d-flex', 'flex-column', 'flex-lg-row', 'justify-content-center', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/free_delivery.png'} className={[styles.tripleBannerImage]} />
                    <div className={['d-flex', 'flex-column', 'text-center', 'text-lg-right', 'pr-2', 'py-0'].join(' ')}>
                        <h6 className={['mb-0', 'font-weight-bold', styles.tripleBannerTitle].join(' ')} style={{color: '#707070'}}>ارسال رایگان</h6>
                        <h6 className={['mb-0', 'mt-auto', 'font-weight-bold', styles.tripleBannerTitle].join(' ')}> خرید بالای ۱۰۰ هزارتومان</h6>
                    </div>
                    </a></Link>
                    <Link href='/site/help#return_product'><a onClick={props.reduxStartLoading} className={['d-flex', 'flex-column', 'flex-lg-row', 'justify-content-center', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/return_delivery.png'} className={[styles.tripleBannerImage]} />
                    <div className={['d-flex', 'flex-column', 'text-center', 'text-md-right', 'pr-2', 'py-0'].join(' ')}>
                        <h6 className={['mb-0', 'font-weight-bold', styles.tripleBannerTitle].join(' ')} style={{color: '#707070'}}>امکان مرجوعی کالا</h6>
                        <h6 className={['mb-0', 'mt-auto', 'font-weight-bold', styles.tripleBannerTitle].join(' ')}>بدون محدودیت زمانی</h6>
                    </div>
                    </a></Link>
                </div>
                </div>
            </div>
            <div className={['container', 'mt-4'].join(' ')}>
                <div className={['row', 'rtl'].join(' ')}>
                    <h6 className={['py-3', 'col-4', 'pointer', 'text-center', 'mb-0', 'font14md17'].join(' ')} style={{background: getSectionBackground(0), borderTop: selectedSection !== 0 ? '2px solid #CFCFCF' : '', borderBottom: selectedSection !== 0 ? '2px solid #CFCFCF' : '', borderRight: selectedSection !== 0 ? '1px solid #CFCFCF' : '', borderLeft: selectedSection !== 0 ? '1px solid #CFCFCF' : ''}} onClick={()=>{setSelectedSection(0)}}>توضیحات محصول</h6>
                    <h6 className={['py-3', 'col-4', 'pointer', 'text-center', 'mb-0', 'font14md17'].join(' ')} style={{background: getSectionBackground(1), borderTop: selectedSection !== 1 ? '2px solid #CFCFCF' : '', borderBottom: selectedSection !== 1 ? '2px solid #CFCFCF' : '', borderRight: selectedSection !== 1 ? '1px solid #CFCFCF' : '', borderLeft: selectedSection !== 1 ? '1px solid #CFCFCF' : ''}} onClick={()=>{setSelectedSection(1)}}>ارسال و مرجوعی</h6>
                    <h6 className={['py-3', 'col-4', 'pointer', 'text-center', 'mb-0', 'font14md17'].join(' ')} style={{background: getSectionBackground(2), borderTop: selectedSection !== 2 ? '2px solid #CFCFCF' : '', borderBottom: selectedSection !== 2 ? '2px solid #CFCFCF' : '', borderRight: selectedSection !== 2 ? '1px solid #CFCFCF' : '', borderLeft: selectedSection !== 2 ? '1px solid #CFCFCF' : ''}} onClick={()=>{setSelectedSection(2)}}>نظر کاربران</h6>
                </div>
                {
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
                }
            </div>
            <div className={['container'].join(' ')}>
                {
                    similarProducts.length !== 0
                    ?
                    <TopSixProducts title='محصولات مشابه' entries={similarProducts} />
                    :
                    null
                }
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
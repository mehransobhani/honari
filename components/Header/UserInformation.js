import React, { useState } from 'react';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
import Link from 'next/link';
import Image from 'next/image';
import * as Constants from '../constants';
import {useCookies} from 'react-cookie';
import { useRouter } from 'next/router';

const UserInformation = (props) => {

    const router = useRouter();
    const [cookies , setCookie , removeCookie] = useCookies();

    const logOut = () => {
        removeCookie('user_server_token', {domain: '.honari.com', path: '/'});
        router.reload(window.location.pathname);
    }

    return (
        <div>
            <div className={['d-flex', 'felx-row', 'align-items-center', 'justify-content-right', 'rtl', 'py-2', 'pr-2'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                <img src={Constants.baseUrl + '/assets/images/main_images/panel_user_black.svg'} style={{width: '40px', height: '40px'}} />
                <div className={['d-flex', 'flex-column', 'mr-2'].join(' ')} style={{}}>
                    <h5 className={['text-right'].join(' ')} style={{fontSize: '15px', fontWeight: '500', color: '#444444'}}>{props.reduxUser.information.name}</h5>
                    <h6 className={['text-right', 'mb-0'].join(' ')} style={{fontSize: '12px', color: '#444444'}}>{props.reduxUser.information.username}</h6>
                </div>
            </div>
            
            <Link href={'/users/charge_account'}>
                <a onClick={props.reduxStartLoading} className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'py-3', 'px-2'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/panel_wallet_black.svg'} style={{width: '20px', height: '20px'}} className={['ml-2'].join(' ')} />
                    <h5 className={['mb-0'].join(' ')} style={{fontSize: '15px'}}>شارژ حساب کاربری</h5>
                </a>
            </Link>
            <Link href={'/users/orders'}>
                <a onClick={props.reduxStartLoading} className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'py-3', 'px-2'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/panel_cart_black.svg'} style={{width: '20px', height: '20px'}} className={['ml-2'].join(' ')} />
                    <h5 className={['mb-0'].join(' ')} style={{fontSize: '15px'}}>سفارشات من</h5>
                </a>
            </Link>
            <Link href={'https://honari.com/academy/user/courses'}>
                <a className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'py-3', 'px-2'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/panel_video_black.svg'} style={{width: '20px', height: '20px'}} className={['ml-2'].join(' ')} />
                    <h5 className={['mb-0'].join(' ')} style={{fontSize: '15px'}}>کلاس‌های من</h5>
                </a>
            </Link>
            <div onClick={logOut} className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'py-3', 'px-2', 'pointer'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                <img src={Constants.baseUrl + '/assets/images/main_images/logout_red.png'} style={{width: '20px', height: '20px'}} className={['ml-2'].join(' ')} />
                <h5 className={['mb-0'].join(' ')} style={{fontSize: '15px'}}>خروج از حساب کاربری</h5>
            </div>
            <div className={['d-flex', 'flex-row', 'justify-content-center', 'mt-3'].join(' ')}>
                <Link href='/users/view'><a onClick={props.reduxStartLoading} className={['text-center', 'p-2'].join(' ')} style={{background: '#00BAC6', color: 'white', fontSize: '15px', fontWeight: '500', borderStyle: 'none', outlineStyle: 'none'}}>اطلاعات حساب من</a></Link>
            </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserInformation);
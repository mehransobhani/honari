import React, { useState } from 'react';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';
import Link from 'next/link';
import Image from 'next/image';

const UserInformation = (props) => {
    return (
        <div>
            <div className={['d-flex', 'felx-row', 'align-items-center', 'justify-content-right', 'rtl', 'py-2', 'pr-2'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                <img src='/assets/images/main_images/user_black_circle.png' style={{width: '40px', height: '40px'}} />
                <div className={['d-flex', 'flex-column', 'mr-2'].join(' ')} style={{}}>
                    <h5 className={['text-right'].join(' ')} style={{fontSize: '13px', fontWeight: '500', color: '#444444'}}>{props.reduxUser.information.name}</h5>
                    <h6 className={['text-right', 'mb-0'].join(' ')} style={{fontSize: '10px', color: '#444444'}}>{props.reduxUser.information.username}</h6>
                </div>
            </div>
            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between', 'py-3', 'px-2'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                <h5 className={['mb-0'].join(' ')} style={{fontSize: '13px'}}>شارژ حساب کاربری</h5>
                <img src='/assets/images/main_images/left_arrow_black_small.png' className={['pointer'].join(' ')} style={{width: '12px', height: '12px'}} />        
            </div>
            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between', 'py-3', 'px-2'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                <h5 className={['mb-0'].join(' ')} style={{fontSize: '13px'}}>سفارشات من</h5>
                <img src='/assets/images/main_images/left_arrow_black_small.png' className={['pointer'].join(' ')} style={{width: '12px', height: '12px'}} />        
            </div>
            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between', 'py-3', 'px-2'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                <h5 className={['mb-0'].join(' ')} style={{fontSize: '13px'}}>کلاس‌های من</h5>
                <img src='/assets/images/main_images/left_arrow_black_small.png' className={['pointer'].join(' ')} style={{width: '12px', height: '12px'}} />        
            </div>
            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between', 'py-3', 'px-2'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                <h5 className={['mb-0'].join(' ')} style={{fontSize: '13px'}}>مدیریت محصولات</h5>
                <img src='/assets/images/main_images/left_arrow_black_small.png' className={['pointer'].join(' ')} style={{width: '12px', height: '12px'}} />        
            </div>
            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between', 'py-3', 'px-2'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
                <h5 className={['mb-0'].join(' ')} style={{fontSize: '13px'}}>خروج از حساب کاربری</h5>
                <img src='/assets/images/main_images/left_arrow_black_small.png' className={['pointer'].join(' ')} style={{width: '12px', height: '12px'}} />        
            </div>
            <div className={['d-flex', 'flex-row', 'justify-content-center', 'mt-3'].join(' ')}>
                <Link href='/users/view'><a className={['text-center', 'p-2'].join(' ')} style={{background: '#00BAC6', color: 'white', fontSize: '14px', fontWeight: '500', borderStyle: 'none', outlineStyle: 'none'}}>اطلاعات حساب من</a></Link>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        reduxUser: state.user,
        reduxCart: state.cart
    };
}

export default connect(mapStateToProps)(UserInformation);
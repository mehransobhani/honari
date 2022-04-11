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
import { TramRounded } from '@material-ui/icons';
import NewProducts from '../components/NewProducts/NewProducts';
import {useCookies} from 'react-cookie';


const ServerError = () => {

    const [windowHeight, setWindowHeight] = useState(0);

    useEffect(() => {
        setWindowHeight(window.outerHeight);
    }, []);

    return(
        <React.Fragment>
            <Head>
                <title>بروز خط از سمت سرور</title>
            </Head>
            <div className={['container', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center'].join(' ')} style={{height: windowHeight != 0 ? (windowHeight - 100) + 'px' : '100%'}}>
                <div className={['row', 'align-items-center'].join(' ')}>
                    <div className={['col-12', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-center'].join(' ')}>
                        <h2 className={['serverErrorNumber', 'mb-0', 'd-md-none', 'px-2'].join(' ')} style={{background: 'white', zIndex: '3'}}><span style={{color: '#656565'}}>5</span><span style={{color: '#00BAC6'}}>00</span></h2>
                        <div className={['d-md-none'].join(' ')} style={{height: '1px', background: '#2B2B2B', width: '20rem', position: 'relative', top: '-2rem', zIndex: '1'}}></div>
                    </div>
                    <div className={['col-12', 'col-md-5', 'd-flex', 'flex-row', 'justify-content-center', 'justify-content-md-start'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/wrench_main.svg'} className={['serverErrorImage'].join(' ')} style={{}} />
                    </div>
                    <div className={['col-12', 'col-md-7', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center'].join(' ')}>
                        <h2 className={['serverErrorNumber', 'mb-0', 'd-none', 'd-md-block'].join(' ')} style={{background: 'white', zIndex: '3'}}><span style={{color: '#656565'}}>5</span><span style={{color: '#00BAC6'}}>00</span></h2>
                        <div className={['d-none', 'd-md-block'].join(' ')} style={{height: '1px', background: '#2B2B2B', width: '44rem', position: 'relative', top: '-7rem', zIndex: '1'}}></div>
                        <h3 className={['rtl', 'serverErrorMessage', 'text-center', 'mt-4', 'mt-md-0'].join(' ')} style={{color: '#7A7A7A'}}>بروز خطا از سمت سرور!</h3>
                        <h3 className={['rtl', 'serverErrorMessage', 'text-center', 'mt-2', 'mt-md-4'].join(' ')} style={{color: '#7A7A7A'}}>در حال حل مشکل هستیم، لطفا تا دقایقی دیگر دوباره تلاش کنید</h3>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ServerError;

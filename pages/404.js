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

const PageNotFound = (props) => {

    const router = useRouter();
    const {categoryName} = router.query;
    const [pageTitle, setPageTitle] = useState('');
    const [component, setComponent] = useState(null);
    const [artInformation, setArtInformation] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const categories = useRef(null);

    const [cookies , setCookie , removeCookie] = useCookies();

    useEffect(() => {
        props.reduxUpdateCart([]);
    }, [props.reduxUser.status, 'NI']);


    return(
        <React.Fragment>
            <Header menu={props.ssrMenu} />
            <Head>
                <title>صفحه‌ی مورد نظر یافت نشد | هنری</title>
            </Head>
            <div className={['container', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center', 'mt-2'].join(' ')} style={{overflowX: 'hidden'}}>
                <h2 className={['text-center', 'mt-3', 'mb-0', 'pr-2', 'pl-3'].join(' ')} style={{color: '#2B2B2B', fontSize: '80px', background: 'white', position: 'relative', top: '1.7rem'}}>404</h2>
                <div className={[''].join(' ')} style={{height: '1px', background: '#2B2B2B', width: '40rem'}}></div>
                <img src={Constants.baseUrl + '/assets/images/main_images/sad_main.svg'} className={['notFoundSadImage', 'mt-5'].join(' ')} />
                <h3 className={['text-center', 'mt-5', 'notFoundMessage'].join(' ')} style={{color: '#7A7A7A'}}>متاسفانه صفحه‌ی موردنظر یافت نشد</h3>
                <Link href="/"><a className={['px-3', 'py-2', 'mt-4', 'font17md20'].join(' ')} style={{background: '#00BAC6', color: 'white'}}>بازگشت به صفحه اصلی</a></Link>
            </div>
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
        reduxStartLoading: () => dispatch({type: actionTypes.START_LOADING}),
        reduxStopLoading: () => dispatch({type: actionTypes.STOP_LOADING}),
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(PageNotFound);
  
  export async function getStaticProps(context){

    const m = await fetch(Constants.apiUrl + '/api/menu', {
        method: 'GET'
    });
    let menu = await m.json();
    return{
        props: {
            ssrUser: {status: 'GUEST', information: {}},
            ssrCookies: '',
            ssrMenu: await menu,
        }
    };
}
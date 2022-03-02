import React, {useEffect, useState} from 'react';
import NewProductCard from './NewProductCard.js';
import styles from './style.module.css';
import axios from 'axios';
import * as Constants from '../constants';
import Image from 'next/image';
import Link from 'next/link';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';

const NewProduct = (props) => {

    const [products, setProducts] = useState([]);

    useEffect(()=>{
        axios.get(Constants.apiUrl + '/api/six-new-products').then((response)=>{
          if(response.data.status === 'done'){
            console.log(response.data.products);
            setProducts(response.data.products);
          }else{
            alert(response.data.status);
            console.log('somethign went wrong');
          }
        }).catch((error)=>{
          console.log(error);
        });
      }, []);

    let mainTitle = props.title;

    return(
        <React.Fragment>
        <div className={['row', 'mt-5', 'd-none', 'd-md-block', 'px-2'].join(' ')}>
            <div className={['col-12', 'd-flex', 'flex-row', 'w-100', 'rtl', 'text-right', 'align-items-center', 'p-0', 'mb-0', 'justify-content-center'].join(' ')}>
                <h5 className='mb-0 mr-2 pb-2 px-2' style={{borderBottom: '1px solid #00BAC6'}}>{mainTitle}</h5>
            </div>
            <div className={['col-12', 'mb-2', 'mt-0'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
        </div>
        <div className={['row', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'rtl', 'd-md-none', 'mt-4'].join(' ')}>
            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'px-3'].join(' ')}>
                <h5 className={['mb-0', 'font-weight-bold'].join(' ')}>{mainTitle}</h5>
            </div>
            <Link href='/products'>
                <a className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'px-3', 'pointer'].join(' ')}>
                    <span className={['ml-1'].join(' ')} style={{fontSize: '13px'}}>مشاهده همه</span>
                    <img src={Constants.baseUrl + '/assets/images/main_images/left_main_small.png'} style={{width: '18px', height: '18px'}} />
                </a>
            </Link>
        </div>
        <div className={['row','mt-2', 'mt-md-3', 'rtl'].join(' ')}>
            <div className={['w-100', 'd-flex', 'flex-row', 'rtl', 'px-2', 'p-md-0', 'align-items-stretch', styles.newProductContainer].join(' ')} style={{overflowX: 'scroll'}}>
                {
                    props.products.map((product, counter) => {
                            return(
                                <NewProductCard key={counter} information={product}/>
                            );
                    })
                }
            </div>
        </div>
        <Link href='/products'>
            <a onClick={props.reduxStartLoading} className={['pointer', 'w-100', 'd-none', 'd-md-flex', 'flex-row', 'align-items-center', 'justify-content-center', 'text-center', 'mt-2'].join(' ')} style={{borderRadius: '8px'}}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/left_main_small.png'} style={{width: '18px', height: '18px'}} />
                    <span className={['ml-1'].join(' ')} style={{fontSize: '13px'}}>مشاهده همه</span>
            </a>
        </Link>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        reduxLoad: state.loading,
    };
}

const mapDispatchToProps = (dispatch) => {
    return{
        reduxStartLoading: () => dispatch({type: actionTypes.START_LOADING}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewProduct);
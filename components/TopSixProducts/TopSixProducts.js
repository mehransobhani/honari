import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Constants from '../constants';
import Link from 'next/link';
import styles from './style.module.css';
import Image from 'next/image';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions';


const TopSixProducts = (props) => {
    const [items, setItems] = useState([]);
    const [title, setTitle] = useState(props.title);
    const [moreHref, setMoreHref] = useState(props.more);

    useEffect(()=>{
        setItems(props.entries);
        console.log(props.entries);
    }, [items, []]);

    return(
        <React.Fragment>
        <div className={['row', 'mt-5', 'd-none', 'd-md-block', 'px-3'].join(' ')}>
            <div className={['col-12', 'd-flex', 'flex-row', 'w-100', 'rtl', 'text-right', 'align-items-center', 'p-0', 'mb-0', 'justify-content-center'].join(' ')}>
                <h5 className='mb-0 mr-2 pb-2 px-2' style={{borderBottom: '1px solid #00BAC6'}}>{props.title}</h5>
            </div>
            <div className={['col-12', 'mb-2', 'mt-0', 'px-1'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
        </div>
        <div className={['row', 'px-1', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'rtl', 'd-md-none', 'mt-4'].join(' ')}>
            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'px-3'].join(' ')}>
                <h5 className={['mb-0', 'font-weight-bold'].join(' ')}>{props.title}</h5>
            </div>
            {
            props.moreUrl !== undefined
            ?
            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'px-3', 'pointer'].join(' ')}>
                <span className={['ml-1'].join(' ')} style={{fontSize: '13px'}}>مشاهده همه</span>
                <img src={Constants.baseUrl + '/assets/images/main_images/left_main_small.png'} style={{width: '18px', height: '18px'}} />
            </div>
            :
                null
            }
        </div>
        <div className={['row','mt-2', 'mt-md-3', 'px-1'].join(' ')}>
            <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'px-2', 'p-md-0', 'align-items-stretch', styles.topSixContainer].join(' ')} style={{overflowX: 'scroll'}}>
                {
                    props.entries.map((item, counter) => {
                        let imageUrl='https://honari.com/image/resizeTest/shop/_600x/thumb_' + item.prodID + '.jpg';
                        return (
                            <div className={['col-5', 'col-md-2', 'px-2', 'py-0', 'my-0', 'mb-2'].join(' ')} key={counter}>
                                <Link href={'/' + item.productUrl}>
                                    <a onClick={() => {props.reduxStartLoading()}} className={['d-flex', 'pointer', 'flex-column', 'shadow-sm', styles.banner].join(' ')} style={{border: '1px solid #dedede', borderRadius: '4px', height: '100%'}}>
                                        <img src={imageUrl} className={['rounded-top'].join(' ')} style={{width: '100%', height: 'auto'}} />
                                        <div className={['w-100'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
                                        <p className={['text-muted', 'rtl', 'w-100', 'pt-2', 'px-2', 'text-right', 'm-0', 'font11'].join(' ')} style={{fontSize: '11px'}}>{item.categoryName}</p>
                                        <p className={['w-100', 'rtl', 'text-right', 'm-0', 'pb-2', 'px-2', 'pt-1'].join(' ')}>{item.productName}</p>
                                        <div className={['mt-auto'].join(' ')}>
                                            {
                                                item.discountedPrice != item.productPrice 
                                                ?
                                                    <p className={['text-muted', 'rtl', 'w-100', 'pt-2', 'px-2', 'text-right', 'm-0'].join(' ')} style={{fontSize: '14px'}}><del>{item.discountedPrice.toLocaleString()}</del></p>
                                                :
                                                    null
                                            }
                                            <p className={['w-100', 'rtl', 'text-right', 'm-0', 'pb-2', 'px-2', 'text-danger', 'font-weight-strong'].join(' ')}>{item.productPrice.toLocaleString() + ' تومان '}</p>
                                        </div>
                                        {
                                            item.discountedPrice != item.productPrice
                                            ?
                                                <small className={['bg-danger', 'mb-0', 'px-2', 'py-1', 'mr-2', 'mt-1'].join(' ')} style={{color: 'white', position: 'absolute', right: '0', borderRadius: '4px 0 0 4px'}}>{item.discountPercent + '%'}</small>
                                            :
                                                null
                                        }
                                    </a>
                                </Link>
                            </div>
                        );
                    })
                }
            </div>
        </div>
        {
            props.moreUrl !== undefined
            ?
            <Link href={props.moreUrl}>
                <a onClick={() => {props.reduxStartLoading()}} className={['pointer', 'd-none', 'd-md-flex', 'w-100', 'align-items-center', 'justify-content-center', 'text-center', 'mt-2'].join(' ')} style={{borderRadius: '8px'}}>
                    <img src={Constants.baseUrl + '/assets/images/main_images/left_main_small.png'} style={{width: '18px', height: '18px'}} />
                    <span className={['ml-1'].join(' ')} style={{fontSize: '13px'}}>مشاهده همه</span>
                </a>
            </Link>
            :
            null
        }
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        
        reduxLoad: state.loading
    };
}

const mapDispatchToProps = (dispatch) => {
    return{
        reduxStartLoading: () => dispatch({type: actionTypes.START_LOADING}),
        reduxStopLoading: () => dispatch({type: actionTypes.STOP_LOADING}),
        reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopSixProducts);
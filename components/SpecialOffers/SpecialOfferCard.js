import React, { useState, useEffect } from 'react';
import styles from './style.module.css';
import Countdown from 'react-countdown';
import Image from 'next/image';
import Link from 'next/link';
import {connect} from 'react-redux';

const SpecialOfferCard = (props) => {
    let discountPercent = ((props.price - props.discountedPrice) / props.price ) * 100 ;
    discountPercent = Number((discountPercent).toFixed(1)) + '%';

    let seconds = props.timeLeft;
    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <h6 className={['text-center', 'mb-0'].join(' ')} style={{color: '#575757', fontSize: '17px'}}>زمان تخفیف به پایان رسیده‌است</h6>;
        } else {
            let s1 = parseInt(seconds / 10);
            let s2 = seconds % 10;
            let m1 = parseInt(minutes / 10);
            let m2 = minutes % 10;
            let h1 = parseInt(hours / 10);
            let h2 = hours % 10;
            return(
                <React.Fragment>
                    <p className={['text-right', 'rtl', 'font-weight-bold', 'mb-1', 'd-none', 'd-md-block'].join(' ')} style={{color: '#575757'}}>زمان باقی‌مانده پیشنهاد</p>
                    <div className={['ltr', 'align-self-center'].join(' ')}>
                        <span className={[styles.counterElement].join(' ')}>{h1}</span>
                        <span className={[styles.counterElement].join(' ')}>{h2}</span>
                        <span className={['font-weight-bold', 'mx-1'].join(' ')}>:</span>
                        <span className={[styles.counterElement].join(' ')}>{m1}</span>
                        <span className={[styles.counterElement].join(' ')}>{m2}</span>
                        <span className={['font-weight-bold', 'mx-1', 'd-none', 'd-md-inline-block'].join(' ')}>:</span>
                        <span className={[styles.counterElement, 'd-none', 'd-md-inline-block'].join(' ')}>{s1}</span>
                        <span className={[styles.counterElement, 'd-none', 'd-md-inline-block'].join(' ')}>{s2}</span>
                    </div>
                </React.Fragment>
            );
        }
    };  

    return(
        <Link href={props.url} className={[''].join(' ')}>
            <a onClick={props.reduxStartLoading} className={['col-6', 'px-2'].join(' ')}>
                <div className={['container-fluid', 'shadow-sm', 'h-100'].join(' ')} style={{border: '1px solid #dedede', borderRadius: '4px', background: props.bgColor}}>
                    <div className={['row', 'ltr'].join(' ')}>
                        <div className={['col-12', 'col-md-6', 'm-0','p-3', 'd-flex'].join(' ')} style={{background: 'white'}}>
                            <img className={['rounded-circle'].join(' ')} src={props.imageUrl} style={{flex: '1', width: '100%', height: 'auto'}} />
                        </div>
                        <div className={['col-12', 'col-md-6', 'd-flex', 'flex-column', 'p-0', 'pb-3', 'p-md-3', 'h-100'].join(' ')} style={{backgroundColor: props.bgColor}}>
                            <h5 className={['mb-1', 'mb-md-4', 'mx-1', 'px-3', 'px-md-0', 'pt-3', 'pt-md-0', 'text-right', 'rtl', 'font-weight-bold', styles.specialTitle].join(' ')}>{props.title}</h5>
                            <div className={['w-100', 'rtl', 'mt-2', 'mt-md-0', 'mb-1', 'mb-md-4', styles.prices].join(' ')} style={{flex: '1'}}>
                                <h5 className={['text-secondary', 'text-right', 'py-1', 'px-2', 'd-inline-block', 'mb-1', styles.specialTitle].join(' ')} style={{color: '#2B2B2B', background: '#DEDEDE', borderRadius: '2px'}}><del>{props.price.toLocaleString()}</del></h5>
                                <br className={['d-block', 'd-md-none', 'mb-0'].join(' ')} />
                                <h5 className={['mr-md-2', 'text-right', 'py-1', 'px-2', 'rounded', 'd-inline-block', styles.specialTitle].join(' ')} style={{color: '#2B2B2B', background: '#F15F58', borderRadius: '2px'}}>{props.discountedPrice.toLocaleString() + ' تومان '}</h5>
                            </div>
                            <div className={['text-center', 'mt-2', 'd-block', 'd-md-none'].join(' ')} style={{}}>
                                <div className={[].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
                                <small className={['px-1']} style={{backgroundColor: props.bgColor, position: 'relative', bottom: '0.77rem', left: '0'}}>زمان باقی‌مانده</small>
                            </div>
                            <Countdown
                                date={Date.now() + (seconds * 1000)}
                                renderer={renderer}
                            />
                        </div>
                    </div>
                </div>
            </a>
        </Link>
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
        reduxAddToCart: (d) => dispatch({type: actionTypes.ADD_TO_CART, data: d}),
        reduxIncreaseCountByOne: (d) => dispatch({type: actionTypes.INCREASE_COUNT_BY_ONE, productId: d}),
        reduxDecreaseCountByOne: (d) => dispatch({type: actionTypes.DECREASE_COUNT_BY_ONE, productId: d}),
        reduxRemoveFromCart: (d) => dispatch({type: actionTypes.REMOVE_FROM_CART, productId: d}),
        reduxWipeCart: () => dispatch({type: actionTypes.WIPE_CART}),
        reduxUpdateUserTotally: (d) => dispatch({type: actionTypes.UPDATE_USER_TOTALLY, data: d}),
        reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t}),
        reduxStartLoading: () => dispatch({type: actionTypes.START_LOADING}),
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(SpecialOfferCard);
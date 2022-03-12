import React, { useEffect, useState } from 'react';
import SpecialOfferCard from './SpecialOfferCard.js';
import styles from './style.module.css';
import Image from 'next/image';
import axios from 'axios';
import * as Constants from '../constants';

const SpecialOffer = (props) => {

    const [page, setPage] = useState(0);
    //const [offers, setOffers] = useState([]);

    /*
    useEffect(() => {
        axios.get(Constants.apiUrl + '/api/top-six-discounted-products', {

        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                if(response.found == true){
                    setOffers(response.products);
                }
            }else if(response.status === 'failed'){
                console.warn(response.message);
                alert(response.umessage);
            }
        }).catch((error) => {
            console.error('error');
            alert('خطا در برقراری ارتباط');
        });
    }, []);
    */

    const changePage = (p) => {
        setPage(p);
    }

    const gotoNextPage = () => {
        setPage(page + 1);
    }

    const gotoPreviousePage = () => {
        setPage(page - 1);
    }

    const pageIndicators = (
        <div className={['col-12', 'text-center', 'rtl', 'mt-2', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-center']}>
            <img onClick={() => {changePage(1)}} src={page == 1 ? '/assets/images/main_images/circle_red_small.png' : '/assets/images/main_images/circle_gray_small.png'} style={{width: '14px'}} className={['pointer', props.offers.length > 0 ? '' : 'd-none'].join(' ')} />
            <img onClick={() => {changePage(2)}} src={page == 2 ? '/assets/images/main_images/circle_red_small.png' : '/assets/images/main_images/circle_gray_small.png'} style={{width: '14px'}} className={['pointer', 'mr-2', props.offers.length > 2 ? '' : 'd-none'].join(' ')} />
            <img onClick={() => {changePage(2)}} src={page == 3 ? '/assets/images/main_images/circle_red_small.png' : '/assets/images/main_images/circle_gray_small.png'} style={{width: '14px'}} className={['pointer', 'mr-2', props.offers.length > 4 ? '' : 'd-none'].join(' ')} />
        </div>
    );

    const specialOfferComponent = () => {
        return (
            <div className={['row', 'mt-5'].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-row', 'w-100', 'rtl', 'text-center', 'justify-content-center', 'align-items-center', 'p-0', 'mb-1'].join(' ')}>
                    <h5 className={['mb-0'].join(' ')} style={{color: '#2B2B2B'}}>پیشنهادهای ویژه</h5>
                </div>
                <div className={['container-fluid'].join(' ')} style={{position: 'relative'}}>
                    <div className={['row', 'rtl', 'px-2', 'px-md-0', 'mt-2'].join(' ')}>
                        {
                            props.offers[page*2] !== undefined 
                            ?
                            <SpecialOfferCard url={props.offers[page*2].productUrl} imageUrl={'https://honari.com/image/resizeTest/shop/_200x/thumb_' + props.offers[page*2].prodID + '.jpg'} title={props.offers[page*2].productName} price={props.offers[page*2].productPrice} discountedPrice={props.offers[page*2].productDiscountedPrice} timeLeft={props.offers[page*2].timeLeft} bgColor='#dff1f5' />
                            :
                            null
                        }
                        {
                            props.offers[(page*2) + 1] !== undefined 
                            ?
                            <SpecialOfferCard url={props.offers[(page*2) + 1 ].productUrl} imageUrl={'https://honari.com/image/resizeTest/shop/_200x/thumb_' + props.offers[(page*2) + 1].prodID + '.jpg'} title={props.offers[(page*2)+1].productName} price={props.offers[(page*2)+1].productPrice} discountedPrice={props.offers[(page*2)+1].productDiscountedPrice} timeLeft={props.offers[(page*2)+1].timeLeft} bgColor='#f0efd8'/>
                            :
                            null
                        }
                    </div>
                    <div className={['d-flex', 'flext-column', 'px-2', 'justify-content-center', 'align-items-center', 'd-none'].join(' ')} style={{position: 'absolute', left: '-0.8rem', top: '0', height: '100%'}}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/left_semicircular_arrow.png'} onClick={gotoNextPage} className={['pointer'].join(' ')} />
                    </div>
                    <div className={['d-flex', 'flext-column', 'px-2', 'justify-content-center', 'align-items-center', 'd-none'].join(' ')} style={{position: 'absolute', right: '-0.9rem', top: '0', height: '100%'}}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/right_semicircular_arrow.png'} onClick={gotoPreviousePage} className={['pointer'].join(' ')} />
                    </div>
                </div>
                <div className={['col-12', 'text-center', 'rtl', 'mt-2', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-center'].join(' ')}>
                    <img onClick={() => {changePage(0)}} src={page == 0 ? '/assets/images/main_images/circle_red_small.png' : '/assets/images/main_images/circle_gray_small.png'} style={{width: '14px'}} className={['pointer', props.offers.length > 0 ? '' : 'd-none'].join(' ')} />
                    <img onClick={() => {changePage(1)}} src={page == 1 ? '/assets/images/main_images/circle_red_small.png' : '/assets/images/main_images/circle_gray_small.png'} style={{width: '14px'}} className={['pointer', 'mr-2', props.offers.length > 2 ? '' : 'd-none'].join(' ')} />
                    <img onClick={() => {changePage(2)}} src={page == 2 ? '/assets/images/main_images/circle_red_small.png' : '/assets/images/main_images/circle_gray_small.png'} style={{width: '14px'}} className={['pointer', 'mr-2', props.offers.length > 4 ? '' : 'd-none'].join(' ')} />
                </div>
                <div className={['col-12', 'text-center', 'rtl', 'mt-2', 'd-none'].join(' ')}>
                    {
                       props.offers.length > 0 && props.offers.length <= 2 
                        ?
                        <img onClick={() => {changePage(0)}} src={page == 0 ? '/assets/images/main_images/circle_red_small.png' : '/assets/images/main_images/circle_gray_small.png'}  style={{width: '14px'}} className={['pointer'].join(' ')} />
                        :
                        (
                            props.offers.length <= 4
                            ?
                            <img onClick={() => {changePage(1)}} src={page == 1 ? '/assets/images/main_images/circle_red_small.png' : '/assets/images/main_images/circle_gray_small.png'} style={{width: '14px'}} className={['pointer', 'mx-2'].join(' ')} />
                            :
                            (
                                props.offers.length <= 6
                                ?
                                <img onClick={() => {changePage(2)}} src={page == 2 ? '/assets/images/main_images/circle_red_small.png' : '/assets/images/main_images/circle_gray_small.png'} style={{width: '14px'}} className={['pointer'].join(' ')}/>
                                :
                                null
                            )
                        )
                    }
                </div>
            </div>
        );
    }

    return(
        <React.Fragment>
            {
                props.offers.length !== 0 
                ?
                specialOfferComponent()
                :
                null
            }
        </React.Fragment>
    );
}

export default SpecialOffer;
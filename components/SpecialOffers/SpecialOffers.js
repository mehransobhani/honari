import React, { useEffect, useState } from 'react';
import SpecialOfferCard from './SpecialOfferCard.js';
import styles from './style.module.css';
import Image from 'next/image';
import axios from 'axios';
import * as Constants from '../constants';

const SpecialOffer = () => {

    const [page, setPage] = useState(0);
    const [offers, setOffers] = useState([]);

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

    const changePage = (p) => {
        setPage(p);
    }

    const specialOfferComponent = () => {
        return (
            <div className={['row', 'mt-5'].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-row', 'w-100', 'rtl', 'text-center', 'justify-content-center', 'align-items-center', 'p-0', 'mb-1'].join(' ')}>
                    <p className={['mb-0'].join(' ')} style={{fontSize: '24px'}}>پیشنهادهای ویژه</p>
                </div>
                <div className={['container-fluid'].join(' ')}>
                    <div className={['row', 'rtl', 'px-2', 'px-md-0', 'mt-2'].join(' ')}>
                        {
                            offers[page*2] !== undefined 
                            ?
                            <SpecialOfferCard url={offers[page*2].productUrl} imageUrl={'https://honari.com/image/resizeTest/shop/_200x/thumb_' + offers[page*2].prodID + '.jpg'} title={offers[page*2].productName} price={offers[page*2].productPrice} discountedPrice={offers[page*2].productDiscountedPrice} timeLeft={offers[page*2].timeLeft} bgColor='#dff1f5' />
                            :
                            null
                        }
                        {
                            offers[(page*2) + 1] !== undefined 
                            ?
                            <SpecialOfferCard url={offers[(page*2) + 1 ].productUrl} imageUrl={'https://honari.com/image/resizeTest/shop/_200x/thumb_' + offers[(page*2) + 1].prodID + '.jpg'} title={offers[(page*2)+1].productName} price={offers[(page*2)+1].productPrice} discountedPrice={offers[(page*2)+1].productDiscountedPrice} timeLeft={offers[(page*2)+1].timeLeft} bgColor='#f0efd8'/>
                            :
                            null
                        }
                    </div>
                </div>
                <div className={['col-12', 'text-center', 'rtl', 'mt-2'].join(' ')}>
                    {
                        offers.length > 0 && offers.length <= 2 
                        ?
                        <img onClick={() => {changePage(0)}} src={page == 0 ? '/assets/images/main_images/circle_red_small.png' : '/assets/images/main_images/circle_gray_small.png'}  style={{width: '14px'}} className={['pointer'].join(' ')} />
                        :
                        (
                            offers.length <= 4
                            ?
                            <img onClick={() => {changePage(1)}} src={page == 1 ? '/assets/images/main_images/circle_red_small.png' : '/assets/images/main_images/circle_gray_small.png'} style={{width: '14px'}} className={['pointer', 'mx-2'].join(' ')} />
                            :
                            (
                                offers.length <= 6
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
                offers.length !== 0 
                ?
                specialOfferComponent()
                :
                null
            }
        </React.Fragment>
    );
}

export default SpecialOffer;
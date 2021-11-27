import React, { useState } from 'react';
import SpecialOfferCard from './SpecialOfferCard.js';
import styles from './style.module.css';

const SpecialOffer = () => {

    const [page, setPage] = useState(0);

    const offers = [{title: 'منجوق تلا نوع الف شماره ۱۰', imageUrl: '/assets/images/stuff_images/one.jpg', price: 12000, discountedPrice: 10000, timeLeft: 500},
    {title: 'منجوق تلا نوع ب شماره ۱۱', imageUrl: '/assets/images/stuff_images/two.jpg', price: 10500, discountedPrice: 9500, timeLeft: 600},
    {title: 'منجوق تلا نوع پ شماره ۱۲', imageUrl: '/assets/images/stuff_images/three.jpg', price: 8500, discountedPrice: 8000, timeLeft: 700},
    {title: 'منجوق تلا نوع ت شماره ۱۳', imageUrl: '/assets/images/stuff_images/four.jpg', price: 5000, discountedPrice: 3500, timeLeft: 800},
    {title: 'منجوق تلا نوع ث شماره ۱۴', imageUrl: '/assets/images/stuff_images/five.jpg', price: 7900, discountedPrice: 7100, timeLeft: 900},
    {title: 'منجوق تلا نوع ج شماره ۱۵', imageUrl: '/assets/images/stuff_images/three.jpg', price: 5200, discountedPrice: 4800, timeLeft: 1000}];

    const changePage = (p) => {
        setPage(p);
    }

    return(
        <div className={['row', 'mt-5'].join(' ')}>
            <div className={['col-12', 'd-flex', 'flex-row', 'w-100', 'rtl', 'text-center', 'justify-content-center', 'align-items-center', 'p-0', 'mb-1'].join(' ')}>
                <p className={['mb-0'].join(' ')} style={{fontSize: '24px'}}>پیشنهادهای ویژه</p>
            </div>
            <div className={['container-fluid'].join(' ')}>
                <div className={['row', 'rtl', 'px-2', 'px-md-0', 'mt-2'].join(' ')}>
                    <SpecialOfferCard imageUrl={offers[page*2].imageUrl} title={offers[page*2].title} price={offers[page*2].price} discountedPrice={offers[page*2].discountedPrice} timeLeft={offers[page*2].timeLeft} bgColor='#dff1f5' />
                    <SpecialOfferCard imageUrl={offers[(page*2)+1].imageUrl} title={offers[(page*2)+1].title} price={offers[(page*2)+1].price} discountedPrice={offers[(page*2)+1].discountedPrice} timeLeft={offers[(page*2)+1].timeLeft} bgColor='#f0efd8'/>
                </div>
            </div>
            <div className={['col-12', 'text-center', 'rtl', 'mt-2'].join(' ')}>
                <img onClick={() => {changePage(0)}} src={page == 0 ? '/assets/images/main_images/circle_red_small.png' : '/assets/images/main_images/circle_gray_small.png'}  style={{width: '14px'}} className={['pointer'].join(' ')} />
                <img onClick={() => {changePage(1)}} src={page == 1 ? '/assets/images/main_images/circle_red_small.png' : '/assets/images/main_images/circle_gray_small.png'} style={{width: '14px'}} className={['pointer', 'mx-2'].join(' ')} />
                <img onClick={() => {changePage(2)}} src={page == 2 ? '/assets/images/main_images/circle_red_small.png' : '/assets/images/main_images/circle_gray_small.png'} style={{width: '14px'}} className={['pointer'].join(' ')}/>
            </div>
        </div>
    )
}

export default SpecialOffer;
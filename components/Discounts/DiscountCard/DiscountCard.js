import React from 'react';
import Image from 'next/image';
const DiscountCard = () =>{
    return (
        <div className={['col-2', 'rounded', 'shadow', 'p-2', 'text-center'].join(' ')} style={{backgroundColor: 'white'}}>
            <Image src="/assets/images/stuff_images/cup.jpg" className={['m-2'].join(' ')} />
            <div className={['text-right'].join(' ')} style={{direction: 'rtl'}}>
                <Image src="/assets/images/main_images/bookmark.png" style={{width: '24px'}} />
                <h6 className={['mr-2', 'd-inline'].join(' ')}>فنجان سفالی کد ۴۱۳۵۴۲۳</h6>
            </div>
            <div className={['d-flex', 'align-items-center', 'mt-3'].join(' ')}>
                <Image src="/assets/images/main_images/percentage.png" style={{width: '30px'}} />
                <span className={['rounded', 'ml-1', 'p-1', 'text-light'].join(' ')} style={{background: '#FC7C49'}}>42%</span>
            </div>
            <h5 className={['text-right', 'text-muted'].join(' ')} style={{width: '100%', direction: 'rtl'}}><del>۱۲,۳۰۰ تومان</del></h5>
            <h5 className={['text-right'].join(' ')} style={{width: '100%', direction: 'rtl'}}>۱۰,۱۲۳ تومان</h5>
            <div className={['container-fluid', 'd-flex', 'justify-content-around'].join(' ')}>
                <button className={['btn', 'btn-success', 'd-none'].join(' ')}>افزودن به سبد خرید</button>
                <Image src="/assets/images/main_images/add_to_cart.png" style={{width: '36px'}}/>
            </div>
        </div>
    );
}

export default DiscountCard;
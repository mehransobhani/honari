import React from 'react';
import Image from 'next/image';

const ProductItem = (props) => {
    return (
            <div className={['col-6', 'col-md-4', 'col-lg-3', 'rounded-sm', 'shadow-sm', 'product-item', 'mb-2', 'pb-2'].join(' ')}>
                <div className={['row'].join(' ')}>
                    <img src="/assets/images/stuff_images/cup.jpg" className={['col-12', 'mt-2'].join(' ')}/>
                    <div style={{direction: 'rtl'}} className={['d-flex', 'align-items-center', 'text-right', 'col-12', 'p-1'].join(' ')}>
                        <h6 className={['d-none', 'd-lg-block','text-right', 'm-0', 'p-0', 'mr-1'].join(' ')} style={{direction: 'rtl'}}><span><img src='/assets/images/main_images/bookmark.png' style={{width: '20px'}}/></span>فنجان سفالی کد ۳۲۴۲۳۳۴۵</h6>
                        <small className={['d-lg-none', 'text-right', 'm-0', 'p-0', 'mr-1'].join(' ')} style={{direction: 'rtl'}}><span><img src='/assets/images/main_images/bookmark.png' style={{width: '20px'}}/></span>فنجان سفالی کد ۲۳۴۴۲۵</small>
                    </div>
                    <div className={['col-12', 'd-flex', 'text-left', 'align-items-center', 'pr-0', 'pl-1', 'mt-3'].join(' ')} style={{direction: 'ltr'}}>
                        <img src='/assets/images/main_images/price_tag.png' style={{width: '20px'}}/>
                        <h6 className={['text-left', 'm-0', 'p-0', 'ml-1'].join(' ')} style={{direction: 'rtl'}}>۲۴,۰۰۰ تومان</h6>
                    </div>
                    <div className={['col-12', 'd-flex', 'text-right', 'align-items-center', 'pr-2', 'pl-0', 'mt-3'].join(' ')} style={{direction: 'rtl'}}>
                        <img src='/assets/images/main_images/tick.png' style={{width: '20px'}}/>
                        <h6 className={['text-left', 'm-0', 'p-0', 'mr-1'].join(' ')} style={{direction: 'rtl'}}>موجود</h6>
                    </div>
                </div>
            </div>
    );
}

export default ProductItem;
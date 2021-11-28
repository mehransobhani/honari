import React from 'react';
import styles from './style.module.css';
import Link from 'next/link';
import Image from 'next/image';

const NewProductCard = (props) => {

    let discountPercent = ((props.price - props.discountedPrice) / props.price ) * 100 ;
    discountPercent = Number((discountPercent).toFixed(1)) + '%';

    return(
        <div className={['col-5', 'col-md-2', 'px-2', 'py-0', 'my-0', 'mb-2'].join(' ')}>
            <Link href={{
              pathname: 'http://localhost:3000/' + props.anchor
            }}>
                <a className={['d-flex', 'pointer', 'flex-column', 'shadow-sm', styles.banner].join(' ')} style={{border: '1px solid #dedede', borderRadius: '4px', height: '100%'}}>
                    <img src={props.imageUrl} className={['rounded-top'].join(' ')} style={{width: '100%', height: 'auto'}} />
                    <div className={['w-100'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
                    <p className={['text-muted', 'rtl', 'w-100', 'pt-2', 'px-2', 'text-right', 'm-0'].join(' ')} style={{fontSize: '14px'}}>{props.categoryName}</p>
                    <p className={['w-100', 'rtl', 'text-right', 'm-0', 'pb-2', 'px-2'].join(' ')}>{props.name}</p>
                    <div className={['mt-auto'].join(' ')}>
                        <p className={['text-muted', 'rtl', 'w-100', 'pt-2', 'px-2', 'text-right', 'm-0'].join(' ')} style={{fontSize: '14px'}}><del>9,000</del></p>
                        <p className={['w-100', 'rtl', 'text-right', 'm-0', 'pb-2', 'px-2', 'text-danger', 'font-weight-strong'].join(' ')}>{props.price.toLocaleString() + ' تومان '}</p>
                    </div>
                    <small className={['bg-danger', 'mb-0', 'px-2', 'py-1', 'mr-2', 'mt-1'].join(' ')} style={{color: 'white', position: 'absolute', right: '0', borderRadius: '4px 0 0 4px'}}>10%</small>
                </a>
            </Link>
        </div>
    );
}

export default NewProductCard;

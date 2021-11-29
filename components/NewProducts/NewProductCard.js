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
              pathname: '/' + props.information.productUrl
            }}>
                <a className={['d-flex', 'pointer', 'flex-column', 'shadow-sm', styles.banner].join(' ')} style={{border: '1px solid #dedede', borderRadius: '4px', height: '100%'}}>
                    <img src={'https://honari.com/image/resizeTest/shop/_85x/thumb_' + props.information.prodID + '.jpg'} className={['rounded-top'].join(' ')} style={{width: '100%', height: 'auto'}} />
                    <div className={['w-100'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
                    <p className={['text-muted', 'rtl', 'w-100', 'pt-2', 'px-2', 'text-right', 'm-0'].join(' ')} style={{fontSize: '14px'}}>{props.information.categoryName}</p>
                    <p className={['w-100', 'rtl', 'text-right', 'm-0', 'pb-2', 'px-2'].join(' ')}>{props.information.productName}</p>
                    <div className={['mt-auto'].join(' ')}>
                        {
                            props.information.discountedPrice === props.information.productPrice
                            ?
                            <p className={['w-100', 'rtl', 'text-right', 'm-0', 'pb-2', 'px-2', 'text-danger', 'font-weight-strong'].join(' ')}>{props.information.productPrice.toLocaleString() + ' تومان '}</p>
                            :
                            (
                                <React.Fragment>
                                    <p className={['text-muted', 'rtl', 'w-100', 'pt-2', 'px-2', 'text-right', 'm-0'].join(' ')} style={{fontSize: '14px'}}><del>{props.information.productPrice.toLocaleString()}</del></p>
                        <p className={['w-100', 'rtl', 'text-right', 'm-0', 'pb-2', 'px-2', 'text-danger', 'font-weight-strong'].join(' ')}>{props.information.discountedPrice.toLocaleString() + ' تومان '}</p>
                                </React.Fragment>
                            )
                        }
                    </div>
                    {
                        props.information.discountPercent !== 0
                        ?
                        <small className={['bg-danger', 'mb-0', 'px-2', 'py-1', 'mr-2', 'mt-1'].join(' ')} style={{color: 'white', position: 'absolute', right: '0', borderRadius: '4px 0 0 4px'}}>{props.information.discountPercent + "%"}</small>
                        :
                        null
                    }
                </a>
            </Link>
        </div>
    );
}

export default NewProductCard;

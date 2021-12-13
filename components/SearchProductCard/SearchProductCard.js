import React from 'react';
import Link from 'next/link';

const SearchProductcard = (props) => {

    let price = parseInt(props.information.product_price);

    return (
        <div className={['col-6', 'col-md-3', 'p-2'].join(' ')}>
            <div className={['d-flex', 'flex-column'].join(' ')} style={{borderRadius: '4px', border: '1px solid #dedede', height: '100%'}} >
                <img src={props.information.product_image} style={{width: '100%', height: 'auto', borderRadius: '4px 4px 0 0'}} />
                <div className={['text-right', 'rtl', 'd-flex', 'flex-column', 'mt-auto'].join(' ')} style={{heigth: '100%'}}>
                    <Link href={'/' + props.information.product_url}><a><h6 className={['font-weight-bold', 'text-right', 'rtl', 'p-3'].join(' ')}>{props.information.product_title}</h6></a></Link>
                    {
                        props.information.has_stock === "true"  
                        ?
                        <h6 className={['text-danger', 'text-right', 'rtl', 'px-3', 'mb-2', 'text-right'].join(' ')}>{price.toLocaleString() + ' تومان '}</h6>        
                        :
                        <h6 className={['text-center', 'rtl', 'mb-0', 'py-2', 'mt-auto', 'w-100'].join(' ')} style={{background: '#F7F7F7', color: 'gray', borderRadius: '4px', borderTop: '1px solid #D8D8D8', marginTop: 'auto'}}>ناموجود</h6>
                    }
                </div>
            </div>
        </div>
    );
}

export default SearchProductcard;
import React from 'react';
import Link from 'next/link';

const SearchProductcard = (props) => {

    let price = parseInt(props.information.product_price);

    return (
        <div className={['col-6', 'col-md-3', 'p-2'].join(' ')} onClick={warn}>
            <div className={['d-flex', 'flex-column'].join(' ')} style={{borderRadius: '4px', border: '1px solid #dedede', height: '100%'}} >
                <div style={{position: 'relative'}}>
                    <img src={props.information.product_image} style={{width: '100%', height: 'auto', borderRadius: '4px 4px 0 0'}} />
                </div>
                <div className={['p-3', 'text-right', 'rtl'].join(' ')}>
                    <Link href={'/' + props.information.product_url}><a><h6 className={['font-weight-bold', 'text-right', 'rtl', 'mb-3'].join(' ')}>{props.information.product_title}</h6></a></Link>
                    {
                        props.information.has_stock === "true"  
                        ?
                        <h6 className={['text-danger', 'text-right', 'rtl', 'mb-0', 'align-self-end'].join(' ')}>{price.toLocaleString() + ' تومان '}</h6>        
                        :
                        <span className={['text-right', 'rtl', 'mb-0', 'px-2', 'align-self-end'].join(' ')} style={{backgroundColor: 'white', color: 'white', borderRadius: '4px'}}>ناموجود</span>
                    }
                </div>
            </div>
        </div>
    );
}

export default SearchProductcard;
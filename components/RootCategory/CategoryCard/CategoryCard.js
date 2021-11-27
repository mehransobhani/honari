import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CategoryProductCard = (props) => {
    return(
        <Link href={props.url}>
            <a className={['col-6', 'col-md-2', 'px-2', 'mt-3'].join(' ')}>
                <div className={['d-flex', 'flex-column', 'pointer', 'shadow-sm'].join(' ')} style={{border: '1px solid #dedede', borderRadius: '4px', height: '100%'}} onClick={props.clicked}>
                    <Image src={props.image} style={{width: '100%', height: 'auto', borderRadius: '4px 4px 0 0'}} />
                    <h6 className={['my-3', 'text-right', 'mx-2', 'font-weight-bold'].join(' ')}>{props.name}</h6>
                </div>            
            </a>
        </Link>
    );
}

export default CategoryProductCard;
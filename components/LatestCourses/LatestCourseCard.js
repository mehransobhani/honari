import React from 'react';
import styles from './style.module.css';
import Image from 'next/image';
import * as Constants from '../constants';
import Link from 'next/link';

const LatestCourseCard = (props) => {
    return(
        <div className={['col-8', 'col-md-3', 'px-2'].join(' ')}>
          <Link href={props.info.url}>
            <a className={['d-flex', 'pointer', 'flex-column', 'shadow-sm', styles.banner].join(' ')} style={{border: '1px solid #dedede', backgroundColor: 'white', borderRadius: '4px'}}>
              <img src={props.info.image} style={{width: '100%', height: '100%', borderRadius: '4px 4px 0 0'}} />
              <div className={['w-100'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
              <p className={['w-100', 'rtl', 'text-right', 'mb-0', 'mt-3', 'pb-2', 'px-3'].join(' ')}>{props.info.title}</p>
              <div className={['d-flex', 'flex-row', 'rtl', 'px-3', 'pb-3'].join(' ')}>
                <p className={['rtl', 'py-1', 'px-2', 'text-right', 'm-0', 'rounded'].join(' ')} style={{fontSize: '14px', backgroundColor: '#d3dbdb'}}>{props.info.price.toLocaleString() + ' تومان'}</p>
                <p className={['rtl', 'text-right', 'mb-0', 'mr-1', 'py-1', 'px-2', 'd-none'].join(' ')} style={{fontSize: '14px', color: '#00bac6'}}>رایگان</p>
              </div>
            </a>
          </Link>
        </div>
    );
}

export default LatestCourseCard;
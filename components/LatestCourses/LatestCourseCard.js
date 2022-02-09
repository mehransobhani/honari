import React from 'react';
import styles from './style.module.css';
import Image from 'next/image';
import * as Constants from '../constants';
import Link from 'next/link';

const LatestCourseCard = (props) => {
    return(
        <div className={['col-8', 'col-md-3', 'px-2'].join(' ')}>
          <Link href={props.info.url}>
            <a className={['d-flex', 'pointer', 'flex-column', styles.banner].join(' ')} style={{border: '1px solid #dedede', backgroundColor: 'white', borderRadius: '4px'}}>
              <div className={['w-100'].join(' ')} style={{height: '12rem', background: 'url(' + props.info.image + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover'}} >

              </div>
              <img src={props.info.image} className={['d-none'].join(' ')} style={{width: '100%', height: '100%', borderRadius: '4px 4px 0 0'}} />
              <div className={['w-100'].join(' ')} style={{height: '1px', backgroundColor: '#dedede'}}></div>
              <p className={['w-100', 'rtl', 'text-right', 'mb-0', 'mt-3', 'pb-2', 'px-3'].join(' ')}>{props.info.name}</p>
              <div className={['d-flex', 'flex-row', 'rtl', 'px-3', 'pb-3'].join(' ')}>
                {
                  props.info.off === 0
                  ?
                  <p className={['rtl', 'py-1', 'px-2', 'text-right', 'm-0', 'rounded'].join(' ')} style={{fontSize: '14px', backgroundColor: '#d3dbdb'}}>{props.info.price.toLocaleString() + ' تومان'}</p>
                  :
                  (
                    <React.Fragment>
                      <p className={['rtl', 'py-1', 'px-2', 'text-right', 'm-0', 'rounded'].join(' ')} style={{fontSize: '14px', backgroundColor: '#d3dbdb'}}><del>{props.info.price.toLocaleString()}</del></p>
                      <p className={['rtl', 'text-right', 'mb-0', 'mr-1', 'py-1', 'px-2', 'rounded'].join(' ')} style={{fontSize: '14px', color: '#00bac6'}}>{props.info.off.toLocaleString() + ' تومان'}</p>
                    </React.Fragment>
                  )  
                }
              </div>
            </a>
          </Link>
        </div>
    );
}

export default LatestCourseCard;
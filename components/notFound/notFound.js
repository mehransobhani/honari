import React, { useEffect, useRef, useState } from 'react';
import * as Constants from '../constants';
import Link from 'next/link';

const NotFoundBody = () => {
    return(
        <React.Fragment>
            <div className={['container', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center', 'mt-2'].join(' ')} style={{overflowX: 'hidden'}}>
                <h2 className={['text-center', 'mt-3', 'mb-0', 'pr-2', 'pl-3'].join(' ')} style={{color: '#2B2B2B', fontSize: '80px', background: 'white', position: 'relative', top: '1.7rem'}}>404</h2>
                <div className={[''].join(' ')} style={{height: '1px', background: '#2B2B2B', width: '40rem'}}></div>
                <img src={Constants.baseUrl + '/assets/images/main_images/sad_main.svg'} className={['notFoundSadImage', 'mt-5'].join(' ')} />
                <h3 className={['text-center', 'mt-5', 'notFoundMessage'].join(' ')} style={{color: '#7A7A7A'}}>متاسفانه صفحه‌ی موردنظر یافت نشد</h3>
                <Link href="/"><a className={['px-3', 'py-2', 'mt-4', 'font17md20'].join(' ')} style={{background: '#00BAC6', color: 'white'}}>بازگشت به صفحه اصلی</a></Link>
            </div>
        </React.Fragment>
    );
}
  
export default NotFoundBody;
  
import React from 'react';
import LatestCourseCard from './LatestCourseCard.js';
import styles from './style.module.css';

const LatestCoures = (props) => {
    return(
        <div style={{backgroundColor: '#f0efd8'}}>
            <div className={['container', 'pt-4', 'mt-5', 'py-2'].join(' ')} style={{overflowX: 'hidden'}}>
                <div className={['row', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'rtl'].join(' ')}>
                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'px-3', 'px-md-2'].join(' ')}>
                        <img src='/assets/images/main_images/college_hat_black.png' style={{width: '40px', height: '40px'}} />
                        <h5 className={['mr-1', 'mb-0', 'd-none', 'd-md-block', 'font-weight-bold'].join(' ')}>جدیدترین دوره‌های آنلاین</h5>
                        <h5 className={['mr-1', 'mb-0', 'd-md-none', 'font-weight-bold'].join(' ')}>دوره‌های آنلاین</h5>
                    </div>
                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'px-3', 'px-md-2', 'pointer'].join(' ')}>
                        <span className={['ml-1'].join(' ')} style={{fontSize: '13px'}}>مشاهده همه</span>
                        <img src='/assets/images/main_images/left_black_small.png' style={{width: '18px', height: '18px'}} />
                    </div>
                </div>
                <div className={['row'].join(' ')}>
                    <div className={['w-100', 'd-flex', 'flex-row', 'pt-2', 'pb-5', 'px-2', 'px-md-0', 'rtl' , styles.classContainer].join(' ')} style={{overflowX: 'scroll'}}>
                    <LatestCourseCard />
                    <LatestCourseCard />
                    <LatestCourseCard />
                    <LatestCourseCard />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LatestCoures;
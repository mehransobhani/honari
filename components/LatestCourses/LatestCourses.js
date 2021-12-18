import React from 'react';
import LatestCourseCard from './LatestCourseCard.js';
import styles from './style.module.css';
import Image from 'next/image';
import * as Constants from '../constants';
import Link from 'next/link';

const LatestCoures = (props) => {

    const coursesInformation = [
        {
            title: 'دوره پیشرفته آموزش کالیگرافی', 
            image: 'https://academy.honari.com/warehouse/images/classes/_600_300/YsLuM7UoA40UnrzXsUnmqxwu90Okzu0N8uJK3z8c.jpg', 
            url: 'https://honari.com/academy/courses/%D8%AF%D9%88%D8%B1%D9%87-%D9%BE%DB%8C%D8%B4%D8%B1%D9%81%D8%AA%D9%87-%D8%A2%D9%85%D9%88%D8%B2%D8%B4-%DA%A9%D8%A7%D9%84%DB%8C%DA%AF%D8%B1%D8%A7%D9%81%DB%8C', 
            price: 330000
        }, {
            title: 'دوره مقدماتی آموزش کالیگرافی',
            image: 'https://academy.honari.com/warehouse/images/classes/_600_300/oHpvE714FyC1pwsiEY9RBlaBSw1sg0FQGweDRZ7B.jpg',
            url: 'https://honari.com/academy/courses/%D8%AF%D9%88%D8%B1%D9%87-%D9%85%D9%82%D8%AF%D9%85%D8%A7%D8%AA%DB%8C-%D8%A2%D9%85%D9%88%D8%B2%D8%B4-%DA%A9%D8%A7%D9%84%DB%8C%DA%AF%D8%B1%D8%A7%D9%81%DB%8C',
            price: 300000
        },
        {
            title: 'آموزش ساخت شمع گل',
            image: 'https://academy.honari.com/warehouse/images/classes/_600_300/zgBvXQFc7EvLdswXxjnsdlrsXlW0OYsMugQtiBj2.jpg',
            url: 'https://honari.com/academy/courses/%D8%A2%D9%85%D9%88%D8%B2%D8%B4-%D8%B3%D8%A7%D8%AE%D8%AA-%D8%B4%D9%85%D8%B9-%DA%AF%D9%84',
            price: 240000
        },
        {
            title: 'آموزش دوخت دفتر دست سازی',
            image: 'https://academy.honari.com/warehouse/images/classes/_600_300/jRRCuir51GBFmcgLfZ1U6uaT6yGkFz2oVJnPe0II.jpg',
            url: 'https://honari.com/academy/courses/%D8%A2%D9%85%D9%88%D8%B2%D8%B4-%D8%AF%D9%88%D8%AE%D8%AA-%D8%AF%D9%81%D8%AA%D8%B1-%D8%AF%D8%B3%D8%AA-%D8%B3%D8%A7%D8%B2',
            price: 100000
        }
    ];

    return(
        <div style={{backgroundColor: '#f0efd8'}}>
            <div className={['container', 'pt-4', 'mt-5', 'py-2'].join(' ')} style={{overflowX: 'hidden'}}>
                <div className={['row', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'rtl'].join(' ')}>
                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'px-3', 'px-md-2'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/college_hat_black.png'} style={{width: '40px', height: '40px'}} />
                        <h5 className={['mr-1', 'mb-0', 'd-none', 'd-md-block', 'font-weight-bold'].join(' ')}>جدیدترین دوره‌های آنلاین</h5>
                        <h5 className={['mr-1', 'mb-0', 'd-md-none', 'font-weight-bold'].join(' ')}>دوره‌های آنلاین</h5>
                    </div>
                    <Link href='honari.com/academy'>
                        <a className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'px-3', 'px-md-2', 'pointer'].join(' ')}>
                            <span className={['ml-1'].join(' ')} style={{fontSize: '13px'}}>مشاهده همه</span>
                            <img src={Constants.baseUrl + '/assets/images/main_images/left_black_small.png'} style={{width: '18px', height: '18px'}} />
                        </a>
                    </Link>
                </div>
                <div className={['row'].join(' ')}>
                    <div className={['w-100', 'd-flex', 'flex-row', 'pt-2', 'pb-5', 'px-2', 'px-md-0', 'rtl' , styles.classContainer].join(' ')} style={{overflowX: 'scroll'}}>
                    {
                        coursesInformation.map((information, index) => {
                            return (
                                <LatestCourseCard key={index} info={information} />
                            );
                        })
                    }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LatestCoures;
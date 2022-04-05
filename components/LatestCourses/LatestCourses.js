import React, { useEffect, useState } from 'react';
import LatestCourseCard from './LatestCourseCard.js';
import styles from './style.module.css';
import Image from 'next/image';
import * as Constants from '../constants';
import Link from 'next/link';
import axios from 'axios';

const LatestCoures = (props) => {

    const [topFourNewCourses, setTopFourNewCourses] = useState([]);

    /*useEffect(() => {
        axios.get(Constants.academyApiUrl + '/api/shop/new-four-courses').then((r) => {
          let response = r.data;
          if(response.status === 'done' && response.found === true){
            setTopFourNewCourses(response.courses);
          }
        }).catch((e) => {
          console.error(e);
          alert('خطا در برقراری ارتباط');
          //props.reduxUpdateSnackbar('error', true, 'خطا در برقراری ارتباط');
        });
      }, []);
    */

    return(
        <div style={{backgroundImage: 'url(' + Constants.baseUrl + '/assets/images/main_images/course_background.jpeg)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
            <div className={['container', 'pt-4', 'mt-5', 'py-2'].join(' ')} style={{overflowX: 'hidden'}}>
                <div className={['row', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'rtl'].join(' ')}>
                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'px-3', 'px-md-2'].join(' ')}>
                        <img src={Constants.baseUrl + '/assets/images/main_images/college_hat_main.png'} draggable='false' className={['mainCarouselImage'].join(' ')} style={{width: '27px', height: '27px'}} />
                        <h5 className={['mr-2', 'mb-0', 'd-none', 'd-md-block'].join(' ')} style={{color: '#2B2B2B'}}>جدیدترین دوره‌های آنلاین</h5>
                        <h5 className={['mr-2', 'mb-0', 'd-md-none'].join(' ')} style={{color: '#2B2B2B'}}>دوره‌های آنلاین</h5>
                    </div>
                    <Link href='https://honari.com/academy'>
                        <a className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'px-3', 'px-md-2', 'pointer'].join(' ')}>
                            <span className={['ml-1'].join(' ')} style={{fontSize: '13px'}}>مشاهده همه</span>
                            <img src={Constants.baseUrl + '/assets/images/main_images/left_main_small.png'} style={{width: '18px', height: '18px'}} />
                        </a>
                    </Link>
                </div>
                <div className={['row'].join(' ')}>
                    <div className={['w-100', 'd-flex', 'flex-row', 'pt-2', 'pb-5', 'px-2', 'px-md-0', 'rtl', 'horizontal-scrollable' , styles.classContainer].join(' ')}>
                    {
                        props.courses.map((information, index) => {
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
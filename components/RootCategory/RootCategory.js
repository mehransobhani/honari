import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from 'next/link';
import Card from './CategoryCard/CategoryCard';
import NewProducts from '../NewProducts/NewProducts';
import styles from './style.module.css';
import axios from 'axios';
import * as Constants from '../constants';
import TopSixProducts from '../TopSixProducts/TopSixProducts';
import Image from 'next/image';

const Category = (props) => {

    const router = useRouter()
    const [id, setId] = useState(props.id);
    const [categoryBanners, setCategoryBanners] = useState([]);
    const [sixNewProducts, setSixNewProducts] = useState([]);
    const [bigImage, setBigImage] = useState('');

    useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/category-banners', {
            id: id,
        }).then((res)=>{
            if(res.data.status === 'done' && res.data.found === true){
                let response = res.data;
                setCategoryBanners(response.banners);
            }else{
                console.log(res.data.message);
            }
        }).catch((error)=>{
            console.log(error);
        });
    }, []);

    useEffect(()=>{
        axios.post(Constants.apiUrl + '/api/root-category-six-new-products', {
            id: id,
        }).then((res)=>{
            if(res.data.status === 'done' && res.data.found === true){
                let response = res.data;
                setSixNewProducts(response.products);
            }else{
                console.log(res.data.message);
            }
        }).catch((error)=>{
            console.log(error);
        });
    }, []);

    useEffect(()=>{
        alert('hi');
        let i = props.id;
        if(i === 1){
            setBigImage('/assets/images/main_images/leather_black_big.png');
        }else if(i === 10){
            setBigImage('/assets/images/main_images/rug_black_big.png');
        }else if(i === 94){
            setBigImage('/assets/images/main_images/painting_black_big.png')
        }else if(i === 95){
            setBigImage('/assets/images/main_images/glass_painting_black_big.png');
        }else if(i === 117){
            setBigImage('/assets/images/main_images/rug_painting_black_big.png');
        }else if(i === 149){
            setBigImage('/assets/images/main_images/tile_black_big.png');
        }else if(i === 156){
            setBigImage('/assets/images/main_images/ribbon_black_big.png');
        }else if(i === 203){
            setBigImage('/assets/images/main_images/weave_black_big.png');
        }else if(i === 310){
            setBigImage('/assets/images/main_images/jewelry_black_big.png');
        }else if(i === 321){
            setBigImage('/assets/images/main_images/embroider_black_big.png');
        }else if(i === 1){
            
        }
        else if(i === 928){
            setBigImage('/assets/images/main_images/candle_black_big.png');
        }
    }, []);
    

    let info = 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطر آنچنان لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع است';

    return(
        <React.Fragment>
            <div className={['d-none', 'd-md-block'].join(' ')} style={{backgroundColor: '#F2F2F2'}}>
                <div className={['container', 'd-flex', 'flex-row', 'align-items-center', 'rtl', 'py-2', 'px-2'].join(' ')}>
                    <Breadcrumbs>
                    <p className={['p-1', 'mb-0', 'd-none', 'd-md-block'].join(' ')} style={{backgroundColor: 'white', border: '1px solid #8bf0f7', borderRadius: '14px 1px 1px 14px'}}>اینجا هستید</p>
                        <Link href={'/shop/product/category/' + props.route} ><a className={['breadcrumbItem', 'mb-0'].join(' ')} style={{fontSize: '14px'}} >{props.name}</a></Link>
                    </Breadcrumbs>
                </div>
            </div>
            <div className={['container'].join(' ')}>
                <div className={['row', 'rtl',' mt-3', 'mt-md-4', 'px-2'].join(' ')}>
                    <div className={['col-12', 'col-md-4', 'px-2', 'px-md-0', 'pl-md-2'].join(' ')}>
                        <div className={['d-flex', 'flex-column', 'p-3', 'shadow-sm'].join(' ')} style={{border: '1px solid #dedede', height: '100%', borderRadius: '4px'}}>
                            <div className={['d-flex', 'flex-row'].join(' ')}>
                                <Image src={bigImage} style={{width: '40px', height: '40px'}} />
                                <h1 className={['my-0', 'pr-2'].join(' ')} style={{fontSize: '32px'}} >{props.name}</h1>
                            </div>
                            <p className={['my-0', 'text-right', 'pt-3'].join(' ')}>{info}</p>
                            <div className={['d-flex', 'flex-row', 'rtl', 'mt-4', 'align-items-center', 'w-100', 'mr-0'].join(' ')}>
                                <Image src='/assets/images/main_images/down_arrow_main.png' style={{width: '14px', borderRadius: '4px'}} />
                                <h6 className={['my-0', 'pr-1', 'pointer', 'font-weight-bold'].join(' ')} style={{color: '#00bac6'}}>دسته‌بندی محصولات</h6>
                            </div>
                        </div>
                    </div>
                    <div className={['col-12', 'col-md-8', 'px-2', 'p-md-0', 'pr-md-2', 'mt-3', 'mt-md-0'].join(' ')}>
                        <Image src='/assets/images/banner_images/banner_leather.jpg'style={{width: '100%', height: '100%', maxHeight: '400px', borderRadius: '4px'}} />
                    </div>
                </div>
                <div className={['row', 'rtl', 'mt-5', 'px-1'].join(' ')}>
                    <div className={['col-12', 'd-flex', 'flex-column', 'px-md-1'].join(' ')}>
                        <div className={['d-flex', 'flex-row'].join(' ')}>
                            <h5 className={['pb-2', 'mb-0', 'font-weight-bold', 'd-none', 'd-md-block'].join(' ')} style={{borderBottom: '1px solid black'}}>{' دسته‌بندی محصولات '}</h5>
                            <h5 className={['pb-2', 'mb-0', 'd-block', 'd-md-none', 'font-weight-bold'].join(' ')}>{' دسته محصولات '}</h5>
                        </div>
                        <div style={{height: '1px', width: '100%', backgroundColor: '#dedede'}}></div>
                    </div>
                </div>
                <div className={['row', 'rtl', 'px-2', 'px-md-0', 'd-flex', 'align-items-stretch'].join(' ')}>
                    {
                        categoryBanners.map((cb, counter)=>{
                            return <Card id={cb.id} name={cb.title} url={cb.url} image={cb.image} key={counter} />;
                        })
                    }
                </div>
                {
                    sixNewProducts.length !== 0 ? <TopSixProducts title='جدیدترین کالاها' entries={sixNewProducts} /> : null
                }
                
            </div>
            <div className={['container-fluid', 'mt-5', 'py-5'].join(' ')} style={{backgroundColor: '#f0efd8'}}>
                <div className={['container', 'px-0', 'pb-3'].join(' ')}>
                    <div className={['row', 'rtl'].join(' ')}>
                        <div className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'justify-content-center', 'mt-3'].join(' ')}>
                            <Image src='/assets/images/main_images/scissors_black.png' style={{width: '20px'}} />
                            <h5 className={['mb-0', 'mr-1'].join(' ')}>جدیدترین آموزش‌ها</h5>
                        </div>
                    </div>
                    <div className={['row', 'rtl', 'py-2', 'px-3'].join(' ')}>
                        <div className={['col-12', 'col-md-6', 'px-2'].join(' ')}>
                            <div className={['rounded', 'd-flex', 'flex-column', 'flex-md-row', 'pointer', 'shadow-sm'].join(' ')} style={{border: '1px solid #dedede'}}>
                                <div style={{flex: '1.3'}}>
                                    <Image src='/assets/images/banner_images/banner_leather.jpg' className={[styles.firstCourseImage].join(' ')} style={{width: '100%', height: '100%'}} />
                                </div>
                                <div className={['d-flex', 'flex-column', 'rounded-left', 'p-2', styles.firstCourseInfoBody].join(' ')} style={{flex: '2', backgroundColor: 'white'}}>
                                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'p-1'].join(' ')}>
                                        <Image src='/assets/images/main_images/college_hat_white.png' className={['p-1'].join(' ')} style={{width: '26px', borderRadius: '0 4px 4px 0', backgroundColor: '#00bac6'}} />
                                        <p className={['text-white', 'font-weight-bold', 'mr-0', 'mb-0', 'p-1'].join(' ')} style={{fontSize: '12px', borderRadius: '4px 0 0 4px', backgroundColor: '#00bac6'}}>دوره آنلاین</p>
                                    </div>
                                    <h6 className={['mb-0','mr-1', 'text-right', 'mt-3'].join(' ')}>آموزش مقدماتی چرم دوزی</h6>
                                    <div className={['d-flex', 'flex-row', 'mt-2', 'mb-0'].join(' ')}>
                                        <p className={['px-2', 'py-1', 'mr-1', 'mb-2'].join(' ')} style={{backgroundColor: '#F2F2F2', borderRadius: '4px'}}>۲۳۰,۰۰۰ تومان</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={['col-12', 'col-md-6', 'px-2'].join(' ')}>
                            <div className={['rounded', 'd-flex', 'flex-row', 'mt-4', 'mt-md-0', 'pointer', 'shadow-sm'].join(' ')} style={{border: '1px solid #dedede'}}>
                                <div style={{flex: '1.3'}}>
                                    <Image src='/assets/images/banner_images/banner_leather.jpg' className={[styles.firstCourseImage].join(' ')} style={{width: '100%', height: '100%'}} />
                                </div>
                                <div className={['d-flex', 'flex-column', 'rounded-left', 'p-2', styles.firstCourseInfoBody].join(' ')} style={{flex: '2', backgroundColor: 'white'}}>
                                    <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'p-1'].join(' ')}>
                                        <Image src='/assets/images/main_images/college_hat_white.png' className={['p-1'].join(' ')} style={{width: '26px', borderRadius: '0 4px 4px 0', backgroundColor: '#00bac6'}} />
                                        <p className={['text-white', 'font-weight-bold', 'mr-0', 'mb-0', 'p-1'].join(' ')} style={{fontSize: '12px', borderRadius: '4px 0 0 4px', backgroundColor: '#00bac6'}}>دوره آنلاین</p>
                                    </div>
                                    <h6 className={['mb-0','mr-1', 'text-right', 'mt-3'].join(' ')}>آموزش مقدماتی چرم دوزی</h6>
                                    <div className={['d-flex', 'flex-row', 'mt-2', 'mb-0'].join(' ')}>
                                        <p className={['px-2', 'py-1', 'mr-1', 'mb-2'].join(' ')} style={{backgroundColor: '#F2F2F2', borderRadius: '4px'}}>۲۳۰,۰۰۰ تومان</p>
                                    </div>
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
                <div className={['container'].join(' ')}>
                    <NewProducts title='پرفروش‌ترین کالاها' />
                </div>
        </React.Fragment>
    );
}

export default Category;
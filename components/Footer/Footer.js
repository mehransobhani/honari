import React from 'react';
import styles from './style.module.css';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    return(
        <div className={['container-fluid'].join(' ')}>
            <div className={['row', 'mt-5'].join(' ')} style={{backgroundColor: '#78dde3'}}>
                <div className={['container', 'py-2'].join(' ')}>
                    <div className={['row', 'rtl'].join(' ')}>
                        <div className={['col-4', 'd-flex','flex-column', 'flex-lg-row', 'justify-content-center', 'align-items-center'].join(' ')}>
                            <img src='/assets/images/main_images/envelope_black_small.png' style={{width: '24px', height: '24px'}} />
                            <p className={['mb-0', 'mr-1', styles.topBarText].join(' ')} style={{color: 'black'}}>ایمیل</p>
                            <p className={['mb-0', 'mr-1'].join(' ')} style={{color: 'black'}}>info@honari.com</p>
                        </div>
                        <div className={['col-4', 'd-flex','flex-column', 'flex-lg-row', 'justify-content-center', 'align-items-center', 'pointer'].join(' ')} style={{borderRight: '1px dashed gray'}}>
                            <img src='/assets/images/main_images/telegram_black_small.png' style={{width: '24px', height: '24px'}} />
                            <p className={['mb-0', 'mr-1', styles.topBarText].join(' ')} style={{color: 'black'}}>پشتیبانی تلگرام</p>
                            <p className={['mb-0', 'mr-1'].join(' ')} style={{color: 'black'}}>t.me/honaricom</p>
                        </div>
                        <div className={['col-4', 'd-flex','flex-column', 'flex-lg-row', 'justify-content-center', 'align-items-center'].join(' ')} style={{borderRight: '1px dashed gray'}}>
                            <img src='/assets/images/main_images/phone_black_small.png' style={{width: '24px', height: '24px'}} />
                            <p className={['mb-0', 'mr-1', styles.topBarText].join(' ')} style={{color: 'black'}}>تلفن پشتیبانی</p>
                            <p className={['mb-0', 'mr-1', 'ltr'].join(' ')} style={{color: 'black'}}>021 44232779</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={['row', 'rtl'].join(' ')} style={{backgroundColor: '#F2F2F2'}}>
                <div className={['container'].join(' ')}>
                    <div className={['row', 'ltr', 'py-4'].join(' ')}>
                        <div className={['col-12', 'col-md-6', 'd-flex', 'flex-column', 'py-2', 'rtl', styles.dashBoardered].join(' ')}>
                            <p className={['text-danger', 'mb-1', 'font-weight-bold', styles.floatAlignedText].join(' ')}>از آخرین آموزش‌ها، محصولات و تخفیف‌ها باخبر شوید!</p>
                            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between'].join(' ')}>
                                <input type="text" className={['p-1', 'shadow-sm'].join(' ')} style={{flex: '0.68', outline: 'none', border: '1px solid #dedede', borderRadius: '4px', fontSize: '14px'}} placeholder="آدرس ایمیل خود را وارد کنید"/>
                                <button className={['btn', 'btn-danger', 'py-1'].join(' ')} style={{flex: '0.3', fontSize: '14px'}}>تایید ایمیل</button>
                            </div>
                            <p className={['text-info', 'text-right', 'mb-1', 'mt-4', 'font-weight-bold', 'd-none', 'd-md-block'].join(' ')}>هنری در شبکه‌های اجتماعی</p>
                            <p className={['text-center', 'font-weight-bold', 'd-block', 'd-md-none','mt-4', 'mb-1'].join(' ')} style={{color: '#575757'}}>با ما در شبکه‌های اجتماعی همراه باشید</p>
                            <div className={['d-flex', 'flex-row', 'justify-content-start'].join(' ')}>
                                <div className={['pointer', 'd-flex', 'flex-row', 'py-2', 'align-items-center', 'justify-content-center', 'px-3', styles.social].join(' ')}>
                                    <img src='/assets/images/main_images/telegram_small.png' style={{width: '26px', height: '26px'}} />
                                    <p className={['mb-0', 'mr-1'].join(' ')}>تلگرام</p>
                                </div>
                                <div className={['pointer', 'd-flex', 'flex-row', 'mr-2', 'py-2', 'align-items-center', 'justify-content-center', 'px-3', styles.social].join(' ')}>
                                    <img src='/assets/images/main_images/instagram_small.png' style={{width: '26px', height: '26px'}} />
                                    <p className={['mb-0', 'mr-1'].join(' ')}>اینستاگرم</p>
                                </div>
                                <div className={['pointer', 'd-flex', 'flex-row', 'mr-2', 'py-2', 'align-items-center', 'justify-content-center', 'px-3', styles.social].join(' ')}>
                                    <img src='/assets/images/main_images/aparat_small.png' style={{width: '26px', height: '26px'}} />
                                    <p className={['mb-0', 'mr-1'].join(' ')}>آپارات</p>
                                </div>
                            </div>
                        </div>
                        <div className={['col-12', 'col-md-6', 'rtl'].join(' ')}>
                            <div className={['w-100', 'd-flex', 'flex-column', 'flex-md-row', 'py-2'].join(' ')}>
                                <div style={{flex: '1'}}>
                                    <div className={['w-100', 'd-flex', 'flex-column', 'flex-md-row', 'align-items-center'].join(' ')}>
                                        <img src='/assets/images/main_images/honari.png' style={{width: '50px', height: '50px'}} />
                                        <div className={['d-flex', 'flex-column', 'mr-2'].join(' ')}>
                                            <h2 className={['mb-0', 'mt-1', 'align-self-right', styles.floatAlignedText].join(' ')} style={{fontSize: '18px', color: '#00bac6'}}>هنری</h2>
                                            <h5 className={['align-md-self-end', 'mb-0', 'mt-2', 'text-secondary'].join(' ')} style={{fontSize: '14px'}}>آموزش، الگو، مواد اولیه</h5>
                                        </div>
                                    </div>
                                    <p className={['mb-0', 'mt-2', styles.floatAlignedText].join(' ')} style={{fontSize: '15px'}}>تهران، بلوار مرزداران، خیابان اطاعتی ،خیابان پاس فرهنگیان (فروش حضوری نداریم)</p>
                                    <Link href=''><p className={['mt-3', 'text-center', 'link', 'pointer', 'font-weight-bold', 'w-100', 'mb-0', 'd-md-none'].join(' ')}>راهنمای ثبت‌نام و خرید از وب‌سایت</p></Link>
                                    <Link href=''><p className={['mt-1', 'text-center', 'link', 'pointer', 'font-weight-bold', 'w-100', 'mb-0', 'd-md-none'].join(' ')}>خدمات مشتریان هنری</p></Link>
                                </div>
                                <div className={['w-100', 'd-flex', 'flex-row', 'ltr', 'align-items-center', 'justify-content-center', 'justify-content-md-start', 'mt-3', 'mt-md-0'].join(' ')} style={{flex: '1'}}>
                                    <img src='/assets/images/main_images/enamad.png' style={{width: '70px', height: '70px'}} />
                                    <img src='/assets/images/main_images/reza.png' style={{width: '70px', height: '70px'}} />
                                </div>
                            </div>
                            <div className={['d-none', 'd-md-flex', 'flex-row', 'rtl', 'mt-3'].join(' ')} style={{fontSize: '14px'}}>
                                <a className={['link', 'px-1', 'font-weight-bold'].join(' ')} href=''>راهنمای ثبت‌نام و خرید از وبسایت</a>
                                |
                                <a className={['link', 'px-1', 'font-weight-bold'].join(' ')} href=''>خدمات مشتریان هنری</a>
                                |
                                <a className={['link', 'px-1', 'font-weight-bold'].join(' ')} href=''>درخواست کالای جدید</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={['row'].join(' ')}>
                <p className={['col-12', 'text-center', 'rtl', 'm-0', 'py-2', 'text-secondary'].join(' ')}>تمامی حقوق برای شرکت هنربخشان نوین شایگان محفوض است و انتشار با ذکر دقیق مطلب و لینک به سایت هنری بلامانع است</p>
            </div>
        </div>
    );
}

export default Footer;
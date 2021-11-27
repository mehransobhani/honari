import React from 'react';
import Image from 'next/image';
const SideFilter = () => {
    return (
        <div className={['container-fluid']}>
            <div className={['row'].join(' ')}>
                <div className={['col-12', 'd-flex', 'align-items-center', 'text-right', 'pr-1'].join(' ')} style={{direction: 'rtl'}}>
                    <Image src='/assets/images/main_images/filter.png' style={{width: '36px'}}/>
                    <h5 className={['mb-0', 'mr-2'].join(' ')}>فیلتر موارد</h5>
                </div>
                <div className={['container-fluid'].join(' ')}>
                    <div className={['row', 'mt-4', 'rounded', 'border', 'border-info', 'p-2'].join(' ')}>
                        <div className={['col-4', 'text-left', 'p-0'].join(' ')}>
                            <Image src="/assets/images/main_images/double_up_arrow.png" style={{width: '20px'}} className={['side-filter-toggler'].join(' ')} />
                        </div>
                        <div className={['col-8', 'text-right', 'p-0', 'd-flex', 'align-items-center'].join(' ')} style={{direction: 'rtl'}} >
                            <Image src="/assets/images/main_images/sort.png" style={{width: '20px'}} />
                            <h6 className={['d-inline', 'mb-0', 'mr-1'].join(' ')}>ترتیب</h6>
                        </div>
                        <div className={['container', 'detail'].join(' ')}>
                            <div className={['row'].join(' ')}>
                                <div className={['col-12', 'text-right', 'pl-0', 'pr-0', 'd-flex', 'align-items-center', 'mt-2'].join(' ')} style={{direction: 'rtl'}}>
                                    <input type='checkbox'/>
                                    <small className={['text-right', 'mb-0', 'mr-1'].join(' ')}>جدیدترین</small>
                                </div>
                                <div className={['col-12', 'text-right', 'pl-0', 'pr-0', 'd-flex', 'align-items-center', 'mt-2'].join(' ')} style={{direction: 'rtl'}}>
                                    <input type='checkbox'/>
                                    <small className={['text-right', 'mb-0', 'mr-1'].join(' ')}>محبوب‌ترین</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={['row', 'mt-4', 'rounded', 'border', 'border-info', 'p-2'].join(' ')}>
                        <div className={['col-4', 'text-left', 'p-0'].join(' ')}>
                            <Image src="/assets/images/main_images/double_down_arrow.png" style={{width: '20px'}} className={['side-filter-toggler'].join(' ')} />
                        </div>
                        <div className={['col-8', 'text-right', 'p-0', 'd-flex', 'align-items-center'].join(' ')} style={{direction: 'rtl'}} >
                            <Image src="/assets/images/main_images/view.png" style={{width: '20px'}} />
                            <h6 className={['d-inline', 'mb-0', 'mr-1'].join(' ')}>نمایش</h6>
                        </div>
                        <div className={['container', 'detail', 'd-none'].join(' ')}>
                            <div className={['row'].join(' ')}>
                                <div className={['col-12', 'text-right', 'pl-0', 'pr-0', 'd-flex', 'align-items-center', 'mt-2'].join(' ')} style={{direction: 'rtl'}}>
                                    <input type='checkbox'/>
                                    <small className={['text-right', 'mb-0', 'mr-1'].join(' ')}>همه</small>
                                </div>
                                <div className={['col-12', 'text-right', 'pl-0', 'pr-0', 'd-flex', 'align-items-center', 'mt-2'].join(' ')} style={{direction: 'rtl'}}>
                                    <input type='checkbox'/>
                                    <small className={['text-right', 'mb-0', 'mr-1'].join(' ')}>موجود</small>
                                </div>
                                <div className={['col-12', 'text-right', 'pl-0', 'pr-0', 'd-flex', 'align-items-center', 'mt-2'].join(' ')} style={{direction: 'rtl'}}>
                                    <input type='checkbox'/>
                                    <small className={['text-right', 'mb-0', 'mr-1'].join(' ')}>ناموجود</small>
                                </div>
                                <div className={['col-12', 'text-right', 'pl-0', 'pr-0', 'd-flex', 'align-items-center', 'mt-2'].join(' ')} style={{direction: 'rtl'}}>
                                    <input type='checkbox'/>
                                    <small className={['text-right', 'mb-0', 'mr-1'].join(' ')}>دارای تخفیف</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={['row', 'mt-4', 'rounded', 'border', 'border-info', 'p-2'].join(' ')}>
                        <div className={['col-4', 'text-left', 'p-0'].join(' ')}>
                            <Image src="/assets/images/main_images/double_down_arrow.png" style={{width: '20px'}} />
                        </div>
                        <div className={['col-8', 'text-right', 'p-0', 'd-flex', 'align-items-center'].join(' ')} style={{direction: 'rtl'}} >
                            <Image src="/assets/images/main_images/layers.png" style={{width: '20px'}} />
                            <h6 className={['d-inline', 'mb-0', 'mr-1'].join(' ')}>دسته‌بندی</h6>
                        </div>
                    </div>
                    <div className={['row', 'mt-4', 'rounded', 'border', 'border-info', 'p-2'].join(' ')}>
                        <div className={['col-4', 'text-left', 'p-0'].join(' ')}>
                            <Image src="/assets/images/main_images/double_down_arrow.png" style={{width: '20px'}} />
                        </div>
                        <div className={['col-8', 'text-right', 'p-0', 'd-flex', 'align-items-center'].join(' ')} style={{direction: 'rtl'}} >
                            <Image src="/assets/images/main_images/star.png" style={{width: '20px'}} />
                            <h6 className={['d-inline', 'mb-0', 'mr-1'].join(' ')}>برند</h6>
                        </div>
                    </div>
                    <div className={['row', 'mt-4', 'rounded', 'border', 'border-info', 'p-2'].join(' ')}>
                        <div className={['col-4', 'text-left', 'p-0'].join(' ')}>
                            <Image src="/assets/images/main_images/double_down_arrow.png" style={{width: '20px'}} />
                        </div>
                        <div className={['col-8', 'text-right', 'p-0', 'd-flex', 'align-items-center'].join(' ')} style={{direction: 'rtl'}} >
                            <Image src="/assets/images/main_images/measure.png" style={{width: '20px'}} />
                            <h6 className={['d-inline', 'mb-0', 'mr-1'].join(' ')}>حجم</h6>
                        </div>
                    </div>
                    <div className={['row', 'mt-4', 'rounded', 'border', 'border-info', 'p-2'].join(' ')}>
                        <div className={['col-4', 'text-left', 'p-0'].join(' ')}>
                            <Image src="/assets/images/main_images/double_down_arrow.png" style={{width: '20px'}} className={['side-filter-toggler'].join(' ')} />
                        </div>
                        <div className={['col-8', 'text-right', 'p-0', 'd-flex', 'align-items-center'].join(' ')} style={{direction: 'rtl'}} >
                            <Image src="/assets/images/main_images/earth.png" style={{width: '20px'}} />
                            <h6 className={['d-inline', 'mb-0', 'mr-1'].join(' ')}>کشور سازنده</h6>
                        </div>
                        <div className={['container', 'detail', 'd-none'].join(' ')}>
                            <div className={['row'].join(' ')}>
                                <div className={['col-12', 'text-right', 'pl-0', 'pr-0', 'd-flex', 'align-items-center', 'mt-2'].join(' ')} style={{direction: 'rtl'}}>
                                    <input type='checkbox'/>
                                    <small className={['text-right', 'mb-0', 'mr-1'].join(' ')}>ایران</small>
                                </div>
                                <div className={['col-12', 'text-right', 'pl-0', 'pr-0', 'd-flex', 'align-items-center', 'mt-2'].join(' ')} style={{direction: 'rtl'}}>
                                    <input type='checkbox'/>
                                    <small className={['text-right', 'mb-0', 'mr-1'].join(' ')}>چین</small>
                                </div>
                                <div className={['col-12', 'text-right', 'pl-0', 'pr-0', 'd-flex', 'align-items-center', 'mt-2'].join(' ')} style={{direction: 'rtl'}}>
                                    <input type='checkbox'/>
                                    <small className={['text-right', 'mb-0', 'mr-1'].join(' ')}>ترکیه</small>
                                </div>
                                <div className={['col-12', 'text-right', 'pl-0', 'pr-0', 'd-flex', 'align-items-center', 'mt-2'].join(' ')} style={{direction: 'rtl'}}>
                                    <input type='checkbox'/>
                                    <small className={['text-right', 'mb-0', 'mr-1'].join(' ')}>ژاپن</small>
                                </div>
                                <div className={['col-12', 'text-right', 'pl-0', 'pr-0', 'd-flex', 'align-items-center', 'mt-2'].join(' ')} style={{direction: 'rtl'}}>
                                    <input type='checkbox'/>
                                    <small className={['text-right', 'mb-0', 'mr-1'].join(' ')}>آلمان</small>
                                </div>
                                <div className={['col-12', 'text-right', 'pl-0', 'pr-0', 'd-flex', 'align-items-center', 'mt-2'].join(' ')} style={{direction: 'rtl'}}>
                                    <input type='checkbox'/>
                                    <small className={['text-right', 'mb-0', 'mr-1'].join(' ')}>فرانسه</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={['row', 'mt-4', 'rounded', 'border', 'border-info', 'p-2'].join(' ')}>
                        <div className={['col-4', 'text-left', 'p-0'].join(' ')}>
                            <Image src="/assets/images/main_images/double_down_arrow.png" style={{width: '20px'}} className={['side-filter-toggler'].join(' ')} />
                        </div>
                        <div className={['col-8', 'text-right', 'p-0', 'd-flex', 'align-items-center'].join(' ')} style={{direction: 'rtl'}} >
                            <Image src="/assets/images/main_images/color_palette.png" style={{width: '20px'}} />
                            <h6 className={['d-inline', 'mb-0', 'mr-1'].join(' ')}>رنگ</h6>
                        </div>
                        <div className={['container', 'mt-2', 'detail', 'd-none'].join(' ')}>
                            <div className={['row'].join(' ')}>
                                <div className={['col-12', 'd-flex', 'justify-content-between', 'align-items-center', 'p-0', 'mt-2'].join(' ')}>
                                    <Image src="/assets/images/main_images/circle_white.png" style={{width: '20px'}}/>
                                    <span className={['d-flex', 'align-items-center'].join(' ')} style={{direction: 'rtl'}}><input type='checkbox' id='red'/><small className={['mb-0', 'mr-1', 'd-inline'].join(' ')}>سفید</small></span>
                                </div>
                                <div className={['col-12', 'd-flex', 'justify-content-between', 'align-items-center', 'p-0', 'mt-2'].join(' ')}>
                                    <Image src="/assets/images/main_images/circle_black.png" style={{width: '20px'}}/>
                                    <span className={['d-flex', 'align-items-center'].join(' ')} style={{direction: 'rtl'}}><input type='checkbox' id='red'/><small className={['mb-0', 'mr-1', 'd-inline'].join(' ')}>مشکی</small></span>
                                </div>
                                <div className={['col-12', 'd-flex', 'justify-content-between', 'align-items-center', 'p-0', 'mt-2'].join(' ')}>
                                    <Image src="/assets/images/main_images/circle_red.png" style={{width: '20px'}}/>
                                    <span className={['d-flex', 'align-items-center'].join(' ')} style={{direction: 'rtl'}}><input type='checkbox' id='red'/><small className={['mb-0', 'mr-1', 'd-inline'].join(' ')}>قرمز</small></span>
                                </div>
                                <div className={['col-12', 'd-flex', 'justify-content-between', 'align-items-center', 'p-0', 'mt-2'].join(' ')}>
                                    <Image src="/assets/images/main_images/circle_yellow.png" style={{width: '20px'}}/>
                                    <span className={['d-flex', 'align-items-center'].join(' ')} style={{direction: 'rtl'}}><input type='checkbox' id='red'/><small className={['mb-0', 'mr-1', 'd-inline'].join(' ')}>زرد</small></span>
                                </div>
                                <div className={['col-12', 'd-flex', 'justify-content-between', 'align-items-center', 'p-0', 'mt-2'].join(' ')}>
                                    <Image src="/assets/images/main_images/circle_green.png" style={{width: '20px'}}/>
                                    <span className={['d-flex', 'align-items-center'].join(' ')} style={{direction: 'rtl'}}><input type='checkbox' id='red'/><small className={['mb-0', 'mr-1', 'd-inline'].join(' ')}>سبز</small></span>
                                </div>
                                <div className={['col-12', 'd-flex', 'justify-content-between', 'align-items-center', 'p-0', 'mt-2'].join(' ')}>
                                    <Image src="/assets/images/main_images/circle_pink.png" style={{width: '20px'}}/>
                                    <span className={['d-flex', 'align-items-center'].join(' ')} style={{direction: 'rtl'}}><input type='checkbox' id='red'/><small className={['mb-0', 'mr-1', 'd-inline'].join(' ')}>صورتی</small></span>
                                </div>
                                <div className={['col-12', 'd-flex', 'justify-content-between', 'align-items-center', 'p-0', 'mt-2'].join(' ')}>
                                    <Image src="/assets/images/main_images/circle_blue.png" style={{width: '20px'}}/>
                                    <span className={['d-flex', 'align-items-center'].join(' ')} style={{direction: 'rtl'}}><input type='checkbox' id='red'/><small className={['mb-0', 'mr-1', 'd-inline'].join(' ')}>آبی</small></span>
                                </div>
                                <div className={['col-12', 'd-flex', 'justify-content-between', 'align-items-center', 'p-0', 'mt-2'].join(' ')}>
                                    <Image src="/assets/images/main_images/circle_brown.png" style={{width: '20px'}}/>
                                    <span className={['d-flex', 'align-items-center'].join(' ')} style={{direction: 'rtl'}}><input type='checkbox' id='red'/><small className={['mb-0', 'mr-1', 'd-inline'].join(' ')}>قهوه‌ای</small></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SideFilter;
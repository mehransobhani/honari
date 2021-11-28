import DiscountCard from './DiscountCard/DiscountCard';
import Image from 'next/image';
const Discount = () =>{
    return (
        <div className={['row', 'pt-3', 'pb-3'].join(' ')} style={{background: '#00BAC6'}}>
            <div className={['col-12', 'text-center'].join(' ')}><img src="/assets/images/gift.png" style={{width: '120px'}}/></div>
            <h4 className={['col-12', 'text-light', 'text-center', 'mt-3'].join(' ')}>تخفیفات ویژه</h4>
            <div className={['container-fluid', 'mt-3', 'mb-3'].join(' ')}>
                <div className={['row', 'justify-content-around', 'm-0', 'pr-0', 'pl-0'].join(' ')} style={{width: '100%'}}>
                    <DiscountCard />
                    <DiscountCard />
                    <DiscountCard />
                    <DiscountCard />
                    <DiscountCard />
                </div>
            </div>
            <div className={['col-12', 'd-flex', 'justify-content-around'].join(' ')}>
                <button className={['btn', 'btn-outline-light', 'pr-5', 'pl-5'].join(' ')}>مشاهده همه</button>
            </div>
        </div>
    );
}

export default Discount;
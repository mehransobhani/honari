import NewStuffCard from './NewStuffCard.js';

const newStuffs = () =>{
    return (
        <div className={['row', 'pt-3', 'pb-3'].join(' ')} style={{background: '#00BAC6'}}>
            <div className={['col-12', 'text-center'].join(' ')}><img src="/assets/images/main_images/package.png" style={{width: '120px'}}/></div>
            <h4 className={['col-12', 'text-light', 'text-center', 'mt-3'].join(' ')}>محصولات جدید</h4>
            <div className={['col-12', 'mt-3', 'mb-3'].join(' ')}>
                <div className={['row', 'justify-content-around', 'pr-0', 'pl-0', 'm-0'].join(' ')} style={{width: '100%'}}>
                    <NewStuffCard />
                    <NewStuffCard />
                    <NewStuffCard />
                    <NewStuffCard />
                    <NewStuffCard />
                </div>
            </div>
            <div className={['col-12', 'd-flex', 'justify-content-around'].join(' ')}>
                <button className={['btn', 'btn-outline-light', 'pr-5', 'pl-5'].join(' ')}>مشاهده همه</button>
            </div>
        </div>
    );
}

export default newStuffs;
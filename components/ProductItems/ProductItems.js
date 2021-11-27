import ProductItem from './ProductItem/ProductItem';

const productItem = () => {
    return (
        <div className={['container-fluid'].join(' ')}>
            <div className={['row'].join(' ')} style={{direction: 'rtl'}}>
                < ProductItem />
                < ProductItem />
                < ProductItem />
                < ProductItem />
                < ProductItem />
                < ProductItem />
                < ProductItem />
            </div>
        </div>
    );
}

export default productItem;
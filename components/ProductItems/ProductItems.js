import ProductItem from './ProductItem/ProductItem';

const ProductIt = () => {
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

export default ProductIt;
import React from 'react';
import Header from '../../components/Header/Header.js';

const Test = () => {
    return(
        <div className={['container-fluid', 'p-0'].join(' ')} style={{paddingBottom: '2000px'}}>
            <p>This is the text</p>
            <p style={{marginTop: '1500px'}}>This is another header</p>
        </div>
    );
}

export default Test;
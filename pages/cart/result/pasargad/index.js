import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../../../components/Header/Header';
import Footer from '../../../../components/Footer/Footer';
import Head from 'next/head';

const Pasargad = () => {

    const [i, setI] = useState(1);

    useEffect(() => {
        setI(i+1);
        console.log(i);
    });

    return (
        <React.Fragment>
            <Header />
                <div className={['container'].join(' ')}>
                    <div className={['row'].join(' ')}>
                        <div className={['col-12'].join(' ')}>

                        </div>
                    </div>
                </div>
            <Footer />
        </React.Fragment>
    );
}

export default Pasargad;
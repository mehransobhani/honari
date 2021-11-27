import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import * as Constants from '../constants';
import Image from 'next/image';

const QuickView = (props) => {

    const [productBasicInformation, setProductBasicInformation] = useState({});

    useEffect(()=>{
        if(props.id !== undefined){
            axios.post(Constants.apiUrl + '/api/product-basic-information', {
                id: props.id,
            }).then((res)=>{
                let response = res.data;
                if(response.status === 'done'){
                    setProductBasicInformation(response);      
                }else if(response.status === 'failed'){
                    console.log(response.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
        }
    }, []);

    return(
        <div className={['container', 'p-2'].join(' ')}>
            <div className={['row', 'd-flex', 'justify-content-center', 'p-2'].join(' ')}>
                <div className={['col-7', 'row'].join(' ')} style={{borderRadius: '4px', backgroundColor: 'white', minHeight: '240px'}}>
                    <div className={['col-5']}>
                        <Image src={'https://honari.com/image/resizeTest/shop/_600x/thumb_' + productBasicInformation.prodID + '.jpg'} style={{width: '100%', height: 'auto', borderRadius: '4px'}} />
                    </div>
                    <div className={['col-7'].join(' ')}>
                        <h4>{props.id}</h4>
                        <div className={['mt-2'].join(' ')} style={{height: '1px', width: '100%', backgroundColor: '#dedede'}}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuickView;
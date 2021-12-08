import React, { useState } from 'react';
import axios from 'axios';

const Bank = () => {

    const [responseState, setResponseState] = useState('');

    const buttonClicked = () => {
        axios.post('https://pep.shaparak.ir/Api/v1/Payment/GetToken', {
            MerchantCode: '4483845',
            TerminalCode: '1664157',
            InvoiceNumber: '15',
            InvoiceDate: '2021/12/06 11:51:24',
            Amount: 1000,
            RedirectAddress: 'https://honari.com',
            Action: 1003, 
            Timestamp: '2021/12/06 11:51:24'
        }, {
            headers: {
                'Content-Type': 'Application/json',
                'Sign': 'Hd0IspBFZZVJd/94TyyUV94xZwbCVIZgjWcIwrii0M4/Hc6x2pa67DmQfn04yOLOb4NRJ0Kz6aqvJUgac9+pK4q9H8rE/6mP3skG15XXxRhrYiMkyrqyY5NBGxe8ot45Ql7/VhTiAjtVtEigCb58t9oktbaSJCIMWBNxoY5Ks2c='
            }
        }).then((res) => {
            let response = res.data;
            setResponseState(JSON.stringify(response));
        }).catch((error) => {
            console.log(error);
            alert('an error occured');
        });
    }

    return(
        <div className={['container', 'd-flex', 'flex-column', 'justify-content-center', 'text-center'].join(' ')}>
            <button className={['mt-3'].join(' ')} onClick={buttonClicked}>Receive Bank Token</button>
            <h6 className={['text-center','my-3'].join(' ')}>Response</h6>
            <h5 className={['text-center', 'ltr'].join(' ')}>{responseState}</h5>
        </div>
    );
}
export default Bank;
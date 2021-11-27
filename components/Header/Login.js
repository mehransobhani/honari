import React from 'react';
import Image from 'next/image';

const Login = () => {
    return(
        <div className={['d-flex', 'flex-column', 'align-items-center', 'py-3'].join(' ')}>
            <Image src='/assets/images/main_images/user_black_circle.png' style={{width: '40px', height: '40px'}} />
            <h4 className={['text-center', 'px-3', 'py-2', 'mt-2', 'pointer'].join(' ')} style={{color: 'white', background: '#00BAC6', fontSize: '14px', borderRadius: '3px'}}>ورود / عضویت</h4>
        </div>
    );
}

export default Login;
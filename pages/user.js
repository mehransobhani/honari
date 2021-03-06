import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {useCookies} from 'react-cookie';
import { Today } from '@material-ui/icons';
import {useRouter} from 'next/router';
import * as Constants from '../components/constants';
import Image from 'next/image';

const User = () => {

    const [cookies , setCookie , removeCookie] = useCookies();
    const [cookieExists, setCookieExists] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [invalidInput, setInvalidInput] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmButtonText, setConfirmButtonText] = useState('ورود به هنری');

    const router = useRouter();

    useEffect(()=>{
        //setCookie('user_server_token', 'hello world', Date() + 100000);
        //console.log(cookies);
        //setCookie("hi", "hello world", {
        //    maxAge: 3600 * 24 * 365
        // });
        if(cookies.user_server_token !== undefined){
            //router.replace('/');
        }else{
            setCookieExists(false);
        }
    }, []);

    useEffect(()=>{

    });

    const checkPhoneNumber = () => {
        axios.post(Constants.userApiUrl + '/check-phone-number', {
            username: phoneNumber
        }).then((res)=>{
            let response = res.data;
            if(response.success === true){
                if(response.data.action === 'login'){
                    alert('login');
                }else if(response.data.action === 'confirmMobile'){
                    alert('get more information');
                }
            }else{
                setErrorMessage('مشکلی رخ داده است');
                setInvalidInput(true);
            }
            setConfirmButtonText('ورود به هنری');
        }).catch((error)=>{
            console.log(error);
            setConfirmButtonText('ورود به هنری');
            setErrorMessage('شماره تلفن معتبر نیست');
            setInvalidInput(true);
        });
    }

    const phoneInputChanged = (event) => {
        setPhoneNumber(event.target.value);
    }
    
    const submitButtonClicked = () => {
        createToken();
        //removeToken();
    }

    const createToken = () => {
        setCookie('user_server_token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiODA5ZjUxNWY1NDBkYzAwYWE2OTE3ZDcwY2IzNTU5OWM5ZDM1OTZiYmZjZWIyMTU5ZmY4ZTRkMGRjNGQ3NDhlMTg4Nzc2OGVhZGMwOTViZmIiLCJpYXQiOiIxNjMzMTcyMjQzLjYxNDM5MSIsIm5iZiI6IjE2MzMxNzIyNDMuNjE0Mzk2IiwiZXhwIjoiMTY2NDcwODI0My42MDk2NjEiLCJzdWIiOiIyNDAzMDgiLCJzY29wZXMiOltdfQ.NwO_7z4HlW86La2Vd20fOsaHkgBlehZeZrlznEOdyhhgWemWhcTck3_nz-6v0lIOttKotWHh-H1zXZ3icWCyjaiLp_n07aRyH6j8e_djEvAaHxhjnTpHk2V1xEsZmrrUqYYySMBRTlf4oFzbeLwYtC5lkzs4Ub4v8hyK6VavdXhAslcmbEhWmSq8hWBJNvZ3D3kYanp9RRmVBsZ0pmLPKm08QFSPJUkBoLElrsDJCcnUW7BGBoXQlEfjpKiR3G_9v3fBBOZpYhtWKv21BqBySGw5Vjeq4M6MXjps8htnt2sYNJcudiTYAg5_F6h3y734JjAFijWpAnaLVVf155ySmJ8AVV05l20w0WZW4YvPySSgry3nIxocivZZKvD2Fi8vM57hBHO92HFQd3KkIzB9xMUlvyPJE3539tPXs38HVQvh1MGYTYr8EtU4LY0pCCSW0PH7VNg5W8mwFe5cNmGZcYKugI9628R0lMy_crBp1B0ZEzFQhjEcRTbo91a_8579lJqb7xCeRl53lpiiVo6fBbCXU74agl4LTHgdWP1BpcLmB7vb107ymgUKxlZqV7QKZfNoCBlujuJaKf90P6wrksiFNfRFBMp8NRW0HVgFuv7klJe5B59kV6eqUqBMTATgZe8XLiHX313cQ1yWwleNjIqTuFMs9QDCNr7OCOxjNL0', {maxAge: 3600 * 24 * 365});
    }

    const removeToken = () => {
        removeCookie('user_server_token');
    }
    
    return(
        <div>
            
        </div>
    );

}

export default User;
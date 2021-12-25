import '../styles/globals.css';
import '../public/assets/css/bootstrap4.css';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducer from '../store/reducer';

function MyApp({ Component, pageProps }) {

  const store = createStore(reducer);

  return <Provider store={store}><Component {...pageProps} /></Provider>
}

export default MyApp

/*
import '../styles/bootstrap.css';
import '../styles/IRANSans/Farsi_numerals/webFonts/css/fontiran.css';
import '../styles/IRANSans/WebFonts/css/fontiran.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import '../styles/globals.css';
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import React, {useEffect} from "react";
import Router from "next/router"
import { Provider } from "react-redux";
import store from "../redux/store/index";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Head from 'next/head'
import NProgress from "nprogress"
import Custom500 from "./500";
import Custom404 from "./404";
import * as constants from "../components/constants";
import {parseCookies} from "../components/helpers";
import Cookies from 'cookies'
import {toast, ToastContainer} from "react-toastify";
import md5 from "crypto-js/md5";
import axios from "axios";

import 'simplebar/dist/simplebar.min.css';
import('nprogress/nprogress.css')

Router.onRouteChangeStart = url => NProgress.start()
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()


const theme = createMuiTheme({
    breakpoints: {
        // Define custom breakpoint values.
        // These will apply to Material-UI components that use responsive
        // breakpoints, such as `Grid` and `Hidden`. You can also use the
        // theme breakpoint functions `up`, `down`, and `between` to create
        // media queries for these breakpoints
        values: {
            xs: 0,
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200
        }
    }
});



function MyApp(props) {
    const { Component, pageProps } = props;
    let content;
    if (pageProps && pageProps.error){
        if (pageProps.error.status === 404){
            content = <Custom404 />
        }
        else if (pageProps.error.status === 403){
            content = <React.Fragment>
                <div id="step-single">
                    <div className="container-fluid step-area text-right py-5">
                        <div className="alert alert-danger" >
                            شما عضو این دوره نیستید<br />
                            لطفا برای دیدن محتویات در این دوره ثبت نام کنید
                        </div>
                    </div>
                </div>
            </React.Fragment>
        }
        else if (pageProps.error.status === 401){
            content = <React.Fragment>
                <div id="step-single">
                    <div className="container-fluid step-area text-right py-5">
                        <div className="alert alert-danger" >
                            لطفا وارد حساب کاربری خود شوید
                        </div>
                    </div>
                </div>
            </React.Fragment>

        }
        else {
            content = <Custom500 />;
        }
    }
    else {
        content = <Component {...pageProps} />
    }

    useEffect(()=>{
        if (props.user_info) {
            let formData = new FormData()
            formData.append('id', props.user_info.ex_user_id);
            axios.post('https://honari.com/api/GetUserOrderDetails' , formData , {
                headers : {
                    "token" : md5(md5(props.user_info.ex_user_id + "." + "12345^&*(H0n@r!54321)*&^54321").toString()).toString()
                }
            }).then((response) => {
                if (props.user_info.courses_count > 0){
                    window.erxesSettings = {
                        messenger: {
                            brand_id: "BHe9Ep",
                            css: `
                            .welcome-info{
                                text-align: right;
                            }
                            .erxes-home-container .integration-box h4{
                                text-align: center;
                            }
                            .faq-item .erxes-right-side,.erxes-content .erxes-article-content h2 {
                                text-align: right;
                            }
                            .erxes-message-sender{
                                direction: rtl !important;
                            }
                            .erxes-message-sender textarea{
                                padding-left: 80px;
                                padding-right: 25px;
                            }
                            .erxes-message-sender .ctrl{
                                right: unset;
                                left: 15px;
                            }
                            .erxes-messenger {
                              left: 8px;
                              transform-origin: 0% 100%;
                            }
                          .erxes-launcher {
                              left: 8px;
                              right: auto;
                            }
                            @media screen and (max-width: 420px){
                                .erxes-messenger {
                                    left: 0;
                                    transform-origin: 0% 100%;
                                }
                            }
                          `,
                            email: props.user_info.email,
                            phone: props.user_info.user_mobile,
                            data: {
                                // avatar: 'https://cdn1.iconfinder.com/data/icons/female-avatars-vol-1/256/female-portrait-avatar-profile-woman-sexy-afro-2-512.png',
                                firstName: props.user_info.user_name,
                                // lastName: 'lastName1111',
                                // birthDate: new Date('2020-01-01'),
                                // sex: 1,
                                // emailValidationStatus: 'valid',
                                // phoneValidationStatus: 'valid',
                                state: "customer",
                                // position: 'position',
                                // department: 'department',
                                // leadStatus: 'working',
                                // hasAuthority: 'Yes',
                                // description: 'bio',
                                // doNotDisturb: 'Yes',
                                code: props.user_info.ex_user_id,
                                customFieldsData: [
                                    {field: "cDsQAxPHM7CZgM2Cy", value: response.data.city},
                                    {field: "cP8WbyyZRmQRe7jx6", value: parseInt(response.data.orders_count)},
                                    {field: "KfGJQxfWrofDofXcX", value: parseInt(response.data.total_buy)},
                                    {field: "9qcL4ePyZG6bQe6tf", value: response.data.gregorian_date ?? "1970-01-01"},
                                    {field: "eizk6dNh2qCnoXBsD", value: response.data.persian_date},
                                    {field: "bCM9yutCCD4Korrzs", value: parseInt(props.user_info.courses_count)},
                                    {field: "eygKaxWL7BvDBLYod", value: props.user_info.courses},
                                    {field: "85zuZbbJ7ZnNHxBdT", value: parseInt(props.user_info.courses_price)},
                                    {field: "5WTbRJ57qLKPitPsz", value: props.user_info.last_purchase_created_at !== "" ? props.user_info.last_purchase_created_at :  "1970-01-01"},
                                    {field: "8WDwWS8Ao6tgCkpCw", value: props.user_info.last_purchase_created_at_shamsi}
                                ]
                                //   'links.linkedIn': 'http://linkedin.com/test',
                                //   'links.twitter': 'http://twitter.com/test',
                                //   'links.facebook': 'http://facebook.com/test',
                                //   'links.github': 'http://github.com/test',
                                //   'links.youtube': 'http://youtube.com/test',
                                //   'links.website': 'http://website.com/test',

                                //custom fields ===========


                                //  // createdAt is reserved field
                                //   updatePlan: new Date('2020-04-25'),
                                //   plan: 'paid',


                            },
                        },
                    };

                }
                else{
                    window.erxesSettings = {
                        messenger: {
                            brand_id: "2a4ghQ",
                            css: `
                            .welcome-info{
                                text-align: right;
                            }
                            .erxes-home-container .integration-box h4{
                                text-align: center;
                            }
                            .faq-item .erxes-right-side,.erxes-content .erxes-article-content h2 {
                                text-align: right;
                            }
                            .erxes-message-sender{
                                direction: rtl !important;
                            }
                            .erxes-message-sender textarea{
                                padding-left: 80px;
                                padding-right: 25px;
                            }
                            .erxes-message-sender .ctrl{
                                right: unset;
                                left: 15px;
                            }
                            .erxes-messenger {
                              left: 8px;
                              transform-origin: 0% 100%;
                            }
                          .erxes-launcher {
                              left: 8px;
                              right: auto;
                            }
                            @media screen and (max-width: 420px){
                                .erxes-messenger {
                                    left: 0;
                                    transform-origin: 0% 100%;
                                }
                            }
                          `,
                            email: props.user_info.email,
                            phone: props.user_info.user_mobile,
                            data: {
                                // avatar: 'https://cdn1.iconfinder.com/data/icons/female-avatars-vol-1/256/female-portrait-avatar-profile-woman-sexy-afro-2-512.png',
                                firstName: props.user_info.user_name,
                                // lastName: 'lastName1111',
                                // birthDate: new Date('2020-01-01'),
                                // sex: 1,
                                // emailValidationStatus: 'valid',
                                // phoneValidationStatus: 'valid',
                                state: "customer",
                                // position: 'position',
                                // department: 'department',
                                // leadStatus: 'working',
                                // hasAuthority: 'Yes',
                                // description: 'bio',
                                // doNotDisturb: 'Yes',
                                code: props.user_info.ex_user_id,
                                customFieldsData: [
                                    {field: "cDsQAxPHM7CZgM2Cy", value: response.data.city},
                                    {field: "cP8WbyyZRmQRe7jx6", value: parseInt(response.data.orders_count)},
                                    {field: "KfGJQxfWrofDofXcX", value: parseInt(response.data.total_buy)},
                                    {field: "9qcL4ePyZG6bQe6tf", value: response.data.gregorian_date ?? "1970-01-01"},
                                    {field: "eizk6dNh2qCnoXBsD", value: response.data.persian_date},
                                    {field: "bCM9yutCCD4Korrzs", value: parseInt(props.user_info.courses_count)},
                                    {field: "eygKaxWL7BvDBLYod", value: props.user_info.courses},
                                    {field: "85zuZbbJ7ZnNHxBdT", value: parseInt(props.user_info.courses_price)},
                                    {field: "5WTbRJ57qLKPitPsz", value: props.user_info.last_purchase_created_at !== "" ? props.user_info.last_purchase_created_at :  "1970-01-01"},
                                    {field: "8WDwWS8Ao6tgCkpCw", value: props.user_info.last_purchase_created_at_shamsi}
                                ]
                                //   'links.linkedIn': 'http://linkedin.com/test',
                                //   'links.twitter': 'http://twitter.com/test',
                                //   'links.facebook': 'http://facebook.com/test',
                                //   'links.github': 'http://github.com/test',
                                //   'links.youtube': 'http://youtube.com/test',
                                //   'links.website': 'http://website.com/test',

                                //custom fields ===========


                                //  // createdAt is reserved field
                                //   updatePlan: new Date('2020-04-25'),
                                //   plan: 'paid',


                            },
                        },
                    };
                }

                (() => {
                    const script = document.createElement('script');
                    script.src = "https://crm.honari.com/widgets/build/messengerWidget.bundle.js";
                    script.async = true;

                    const entry = document.getElementsByTagName('script')[0];
                    entry.parentNode.insertBefore(script, entry);
                })();
            })
                .catch(err => {
                    console.log(err)
                })
        }
        else {
            window.erxesSettings = {
                messenger: {
                    brand_id: "2a4ghQ",
                    data:
                        {
                            customFieldsData: [
                                {field: "9qcL4ePyZG6bQe6tf", value: "1970-01-01"},
                                {field: "5WTbRJ57qLKPitPsz", value: "1970-01-01"},
                            ]
                        },
                css: `
                            .welcome-info{
                                text-align: right;
                            }
                            .erxes-home-container .integration-box h4{
                                text-align: center;
                            }
                            .faq-item .erxes-right-side,.erxes-content .erxes-article-content h2 {
                                text-align: right;
                            }
                            .erxes-message-sender{
                                direction: rtl !important;
                            }
                            .erxes-message-sender textarea{
                                padding-left: 80px;
                                padding-right: 25px;
                            }
                            .erxes-message-sender .ctrl{
                                right: unset;
                                left: 15px;
                            }
                            .erxes-messenger {
                              left: 8px;
                              transform-origin: 0% 100%;
                            }
                          .erxes-launcher {
                              left: 8px;
                              right: auto;
                            }
                                                        @media screen and (max-width: 420px){
                                .erxes-messenger {
                                    left: 0;
                                    transform-origin: 0% 100%;
                                }
                            }
                          `,
                },

            };

            (() => {
                const script = document.createElement('script');
                script.src = "https://crm.honari.com/widgets/build/messengerWidget.bundle.js";
                script.async = true;

                const entry = document.getElementsByTagName('script')[0];
                entry.parentNode.insertBefore(script, entry);
            })();
        }

            (function () {
            var now = new Date();
            var version = now.getFullYear().toString() + "0" + now.getMonth() + "0" + now.getDate() +
            "0" + now.getHours();
            var head = document.getElementsByTagName("head")[0];
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://app.najva.com/static/css/local-messaging.css" + "?v=" + version;
            head.appendChild(link);
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src = "https://app.najva.com/static/js/scripts/honari-967-306cf3f4-e6db-4753-88ce-6f942a4e264e.js" + "?v=" + version;
            head.appendChild(script);
        })()


const script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-84ZXK7F4J1';
        document.body.appendChild(script);


        script.onload = () => {

            // Google Analytics
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', 'https://honari.com/themes/bmr/js/honari_js/analytics.js', 'ga');
            //(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
            //const ga = window.ga;

            ga('async', 'true');
            ga('create', 'UA-106970326-1', 'auto');
            ga('send', 'pageview');
        }

 







    } , [])


    return (
        <React.Fragment>
            <Head>
                <title>هنری</title>
                <meta name="theme-color" content="#01AAB2" />
                <link rel="icon" href={constants.classNextURL+'/favicon.ico'} type="image/x-icon"/>
            </Head>
            <MuiThemeProvider theme={theme}>
                <Provider store={store}>
                    <Header user_info={props.user_info} />
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                    {content}
                    <Footer />
                </Provider>
            </MuiThemeProvider>
        </React.Fragment>
  )

}

    MyApp.getInitialProps = async ({ Component, ctx }) => {

        const { req , res} = ctx;
        const cookies = new Cookies(req, res)


        let class_token = parseCookies(req).class_token;
        const user_server_token = parseCookies(req).user_server_token;
        let user_info;

        if (req) {
            const loginUser = async (token) => {
                const target = encodeURI(constants.apiURL + '/api/login');

                let data = {}
                try {
                    const serverResponse = await fetch(target, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            token: token
                        }),
                    });
                    const json = await serverResponse.json();
                    if (serverResponse.status !== 200) {
                        throw ({data: json, status: serverResponse.status})
                    }
                    data = {
                        token: json.data,
                    };

                    let oneYear = Date.now() + 365 * 24 * 60 * 60 * 1000;
                    // setCookie('class_token', response.data.data.token, { domain: constants.cookieURL , path: '/' , expires: new Date(oneYear)});
                    // console.log(oneYear)

                    class_token = json.data.token;
                    cookies.set('class_token', json.data.token, {
                        httpOnly: false,
                        expires: new Date(oneYear),
                        domain: constants.cookieURL,
                        path: '/'
                    })
                    user_info = json.data.user_info;
                } catch (error) {
                    let oneYear = Date.now() - 365 * 24 * 60 * 60 * 1000;
                    cookies.set('class_token', '', {
                        httpOnly: false,
                        expires: new Date(oneYear),
                        domain: constants.cookieURL,
                        path: '/'
                    })
                    cookies.set('user_server_token', '', {
                        httpOnly: false,
                        expires: new Date(oneYear),
                        domain: constants.cookieURL,
                        path: '/'
                    })
                }
            }
            const checkToken = async (token , user_server_token) => {
                const target = encodeURI(constants.apiURL + '/api/user/check-token');
                try {
                    const serverResponse = await fetch(target, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": 'Bearer '+token,
                            "Cookie": "user_server_token="+user_server_token,
                        },
                    });
                    const json = await serverResponse.json();
                    if (serverResponse.status !== 200) {
                        throw ({data: json, status: serverResponse.status})
                    }
                    if (!json.success) {
                        let oneYear = Date.now() - 365 * 24 * 60 * 60 * 1000;
                        cookies.set('class_token', '', {
                            httpOnly: false,
                            expires: new Date(oneYear),
                            domain: constants.cookieURL,
                            path: '/'
                        })
                        cookies.set('user_server_token', '', {
                            httpOnly: false,
                            expires: new Date(oneYear),
                            domain: constants.cookieURL,
                            path: '/'
                        })
                    }
                    user_info = json.data.user_info;
                } catch (error) {
                    let oneYear = Date.now() - 365 * 24 * 60 * 60 * 1000;
                    cookies.set('class_token', '', {
                        httpOnly: false,
                        expires: new Date(oneYear),
                        domain: constants.cookieURL,
                        path: '/'
                    })
                    cookies.set('user_server_token', '', {
                        httpOnly: false,
                        expires: new Date(oneYear),
                        domain: constants.cookieURL,
                        path: '/'
                    })
                }
            }

            if (class_token) {
                if (user_server_token) {
                    await checkToken(class_token , user_server_token)
                }
                else {
                    let oneYear = Date.now() - 365 * 24 * 60 * 60 * 1000;
                    cookies.set('class_token', '', {
                        httpOnly: false,
                        expires: new Date(oneYear),
                        domain: constants.cookieURL,
                        path: '/'
                    })
                    cookies.set('user_server_token', '', {
                        httpOnly: false,
                        expires: new Date(oneYear),
                        domain: constants.cookieURL,
                        path: '/'
                    })
                }
            } else if (user_server_token) {
                await loginUser(user_server_token);
            }
        }

        let pageProps = {};
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx , class_token);
        }
        return { pageProps , user_info : user_info };
    };


export default MyApp;*/
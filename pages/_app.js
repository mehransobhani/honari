import '../styles/globals.css';
import '../public/assets/css/bootstrap4.css';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducer from '../store/reducer';
import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useCookies} from 'react-cookie';
import axios from 'axios';
import * as Constants from '../components/constants';


function MyApp({ Component, pageProps }) {

  const store = createStore(reducer);
  const [cookies, setCookie, removecookie] = useCookies();

  let userInformaion = {};

  useEffect(() => {
    if(cookies.user_server_token !== undefined){
      axios.post(Constants.apiUrl + '/api/user-information', {}, {
        headers: {
          'Authorization': 'Bearer ' + cookies.user_server_token, 
        }
      }).then((r) => {
        let response = r.data;
        if(response.status === 'done' && response.found === true){
          userInformaion = response.information;
        }
      }).catch((e) => {
        console.error(e);
        alert('خطا در برقراری ارتباط');
      });
    }
    /*
    window.erxesSettings = {
      messenger: {
          brand_id: "2a4ghQ",
          css: `
          .welcome-info{
              text-align: left;
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
          email: userInformaion.email !== undefined ? userInformaion.email : '',
          phone: userInformaion.username !== undefined ? userInformaion.username : '',
          data: {
              // avatar: 'https://cdn1.iconfinder.com/data/icons/female-avatars-vol-1/256/female-portrait-avatar-profile-woman-sexy-afro-2-512.png',
              firstName: userInformaion.name !== undefined ? userInformaion.name : '',
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
              code: userInformaion.eui !== undefined ? userInformaion.eui : '' ,
              customFieldsData: [
                  {field: "cDsQAxPHM7CZgM2Cy", value: ''},
                  {field: "cP8WbyyZRmQRe7jx6", value: 0},
                  {field: "KfGJQxfWrofDofXcX", value: 0},
                  {field: "9qcL4ePyZG6bQe6tf", value: "1970-01-01"},
                  {field: "eizk6dNh2qCnoXBsD", value: ''},
                  {field: "bCM9yutCCD4Korrzs", value: 0},
                  {field: "eygKaxWL7BvDBLYod", value: ''},
                  {field: "85zuZbbJ7ZnNHxBdT", value: 0},
                  {field: "5WTbRJ57qLKPitPsz", value: "1970-01-01"},
                  {field: "8WDwWS8Ao6tgCkpCw", value: ''}
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
    const script = document.createElement('script');
    script.src = "https://crm.honari.com/widgets/build/messengerWidget.bundle.js";
    script.async = true;
  
    const entry = document.getElementsByTagName('script')[0];
    entry.parentNode.insertBefore(script, entry);*/

      //const script = document.createElement('script');

      const googleAnalyticsScript = document.createElement('script');
      googleAnalyticsScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-84ZXK7F4J1';
      //document.body.appendChild(script);
      googleAnalyticsScript.onload = () => {
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
          ga('create', 'UA-55136021-1', 'auto');
          ga('send', 'pageview');
      }

      
      const googleTagmanager = document.createElement('script');
      googleTagmanager.src = '/assets/js/google_tagmanager.js';
      googleTagmanager.async = true;
      document.body.appendChild(googleTagmanager);
      
      //googleTagmanager.onload = () => {
        //let confirmButton = document.getElementById('gtm-testing-button');
        //confirmButton.addEventListener('click', () => {
            //dataLayer.push({
              //event: 'homePageViewed'
            //});
            //alert('data pushed');
        //});
      //}

      const chatwoot = document.createElement('script');
      chatwoot.src = Constants.baseUrl + '/assets/js/empty.js'
      chatwoot.async = true;
      document.body.appendChild(chatwoot);
      chatwoot.onload = () => {
        (function(d,t) {
          var BASE_URL="https://chatwoot.honari.com";
          var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
          g.src=BASE_URL+"/packs/js/sdk.js";
          g.defer = true;
          g.async = true;
          s.parentNode.insertBefore(g,s);
          g.onload=function(){
            window.chatwootSDK.run({
              websiteToken: '5pRR26SehjSNWbKoezHiQbVD',
              baseUrl: BASE_URL
            })
          }
        })(document,"script");  
      }

      
      /*const noscriptTagmanager = document.createElement('noscript');
      const iframeTagmanager = document.createElement('iframe');
      iframeTagmanager.src = "https://www.googletagmanager.com/ns.html?id=GTM-PWJGW4";
      iframeTagmanager.width= "0";
      iframeTagmanager.height= "0";
      iframeTagmanager.style = "display:none;visibility:hidden";

      noscriptTagmanager.appendChild(iframeTagmanager);
      document.body.prepend(noscriptTagmanager);
      */
  }, []);

  return (
      <Provider store={store}><Component {...pageProps} /></Provider>
  );
}

const mapStateToProps = (state) => {
  return {
      reduxUser: state.user,
      reduxCart: state.cart
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
      reduxUpdateCart: (d) => dispatch({type: actionTypes.UPDATE_CART, data: d}),
      reduxAddToCart: (d) => dispatch({type: actionTypes.ADD_TO_CART, data: d}),
      reduxIncreaseCountByOne: (d) => dispatch({type: actionTypes.INCREASE_COUNT_BY_ONE, productId: d}),
      reduxDecreaseCountByOne: (d) => dispatch({type: actionTypes.DECREASE_COUNT_BY_ONE, productId: d}),
      reduxRemoveFromCart: (d) => dispatch({type: actionTypes.REMOVE_FROM_CART, productId: d}),
      reduxWipeCart: () => dispatch({type: actionTypes.WIPE_CART}),
      reduxUpdateUserTotally: (d) => dispatch({type: actionTypes.UPDATE_USER_TOTALLY, data: d}),
      reduxUpdateSnackbar: (k,s,t) => dispatch({type: actionTypes.UPDATE_SNACKBAR, kind: k, show: s, title: t}),
  }
}

export default MyApp;

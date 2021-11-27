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

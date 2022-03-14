import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';

const Login = (props) => {
    return(
        <div className={['d-flex', 'flex-column', 'align-items-center', 'py-3'].join(' ')}>
            <Link href='https://honari.com/user'><a onClick={props.reduxStartLoading} ><h4 className={['text-center', 'px-3', 'py-2', 'mt-2', 'pointer'].join(' ')} style={{color: 'white', background: '#00BAC6', fontSize: '14px', borderRadius: '3px'}}>ورود / عضویت</h4></a></Link>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        reduxLoad: state.loading,
    };
}

const mapDispatchToProps = (dispatch) => {
    return{
        reduxStartLoading: () => dispatch({type: actionTypes.START_LOADING}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
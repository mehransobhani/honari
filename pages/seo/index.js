import React from 'react';

const Seo = (props) => {
    return (
        <h1>{props.ssrSeo}    </h1>
    );
    
}

/*Seo.getInitialProps = ({ctx, token}) => {
    console.log(token);
    console.log(ctx);
    return {name: 'hadi'}
}*/

export default Seo;

export async function getServerSideProps(context){
    return {props: {ssrSeo: "Hadi Hosseinpour"}};
}
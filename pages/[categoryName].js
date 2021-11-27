import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import axios from 'axios';
import {useRouter} from 'next/router';
import RootCategory from '../components/RootCategory/RootCategory';
import Head from 'next/head';


const CategoryLandingPage = () => {

    const router = useRouter();
    const {categoryName} = router.query;
    const [pageTitle, setPageTitle] = useState('');
    const [component, setComponent] = useState(null);

    useEffect(()=>{
        
        if(categoryName !== undefined){
            setComponent(null);
            switch(categoryName){
                case 'چرم-دوزی':
                    setPageTitle('حرفه‌ای چرم دوزی کنید | هنری');
                    setComponent(<RootCategory id={1} name='چرم دوزی' route={'charm'} />);
                    break;
                case 'نمد-دوزی':
                    setPageTitle('نمد دوزی | کاردستی نمدی با الگو کیف نمدی، عروسک و... | هنری');
                    setComponent(<RootCategory id={10} name='نمد دوزی' route={'namad'} />);
                    break;
                case 'نقاشی-دکوراتیو-پتینه':
                    setPageTitle('پتینه کاری | آموزش پتینه روی چوب ،سفال ،شیشه و ... | هنری');
                    setComponent(<RootCategory id={94} name='نقاشی دکوراتیو' route={'painting'} />);
                    break;
                case 'نقاشی-روی-شیشه-ویترای' :
                    setPageTitle('نقاشی روی شیشه یا ویترای | هنری');
                    setComponent(<RootCategory id={95} name='نقاشی روی شیشه' route={'vitray'} />);
                    break;
                case 'نقاشی-روی-پارچه' :
                    setPageTitle('نقاشی روی پارچه | لوازم و ابزار ، تکنیک ها وطرح های نقاشی روی پارچه | هنری');
                    setComponent(<RootCategory id={117} name='نقاشی روی پارچه' route={'naghashi-parch'} />);
                    break;
                case 'معرق-کاشی' :
                    setPageTitle('آموزش معرق کاشی ، آموزش کاشی شکسته ، مواد و ابزار معرق کاشی | هنری');
                    setComponent(<RootCategory id={149} name='معرق کاشی' route={'kashi-taziini-kochak'} />);
                    break;
                case 'روبان-دوزی' :
                    setPageTitle('روبان دوزی | روبان دوزی به سبک جدید | هنری');
                    setComponent(<RootCategory id={156} name='روبان دوزی' route={'ribbon'} />);
                    break;
                case 'مکرومه-بافی' :
                    setPageTitle('مکرومه بافی | هنری');
                    setComponent(<RootCategory id={203} name='مکرومه بافی' route={'baftani'} />);
                    break;
                case 'زیورآلات' :
                    setPageTitle('زیورآلات دست ساز دلخواهت رو بساز | هنری');
                    setComponent(<RootCategory id={310} name='زیورآلات' route={'zivar_alat'} />);
                    break;
                case 'شماره-دوزی' :
                    setPageTitle('آموزش شماره دوزی الگو و پترن و خرید نخ و پارچه دمسه گلدوزی | هنری');
                    setComponent(<RootCategory id={321} name='شماره دوزی' route={'shomaredozi'} />);
                    break;
                case 'کچه-دوزی' :
                    setPageTitle('کچه دوزی | هنری');
                    setComponent(<RootCategory id={290} name='کچه دوزی' route={'namad/namad_dozi_kache_dozi'} />);
                    break;
                case 'جواهردوزی' :
                    setPageTitle('جواهر دوزی | هنری');
                    setComponent(<RootCategory id={835} name='جواهردوزی' route={'zivar_alat/bead-embroidery'} />);
                    break;
                case '' :
                    setPageTitle('');
                    setComponent(<RootCategory id={94} name='نقاشی دکوراتیو' route={'painting'} />);
                    break;
            }
        }
    }, [categoryName, undefined]);

    return(
        <React.Fragment>
            <Header />
            <Head>
                <title>{pageTitle}</title>
            </Head>
            {
                component
            }
            <Footer />
        </React.Fragment>
    );
}

export default CategoryLandingPage;
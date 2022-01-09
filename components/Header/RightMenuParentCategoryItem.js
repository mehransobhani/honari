import { ChildFriendly, CopyrightOutlined } from '@material-ui/icons';
import React, {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as Constants from '../constants';

const RightMenuParentCategoryItem = (props) => {
    const [information, setInformation] = useState(props.information);
    const [showChildrenCategories, setShowChildrenCategories] = useState(false);

    return(
        <div className={['px-2', 'py-3'].join(' ')} style={{borderBottom: '1px solid #DEDEDE'}}>
            <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'justify-content-between'].join(' ')}>
                <Link href={information.parentUrl.substr(18)}><a className={['mb-0'].join(' ')} style={{fontSize: '13px', color: showChildrenCategories ? "#00BAC6" : "#2B2B2B"}}>{information.parentName}</a></Link>
                {
                    showChildrenCategories == true
                    ?
                        <img src={Constants.baseUrl + '/assets/images/main_images/down_arrow_black_small.png'} className={['pointer'].join(' ')} style={{width: '12px', height: '12px'}} onClick={() => {setShowChildrenCategories(false)}} /> 
                    :
                        <img src={Constants.baseUrl + '/assets/images/main_images/left_arrow_black_small.png'} className={['pointer'].join(' ')} style={{width: '12px', height: '12px'}} onClick={() => {setShowChildrenCategories(true)}} />        
                }
            </div>
            {
                showChildrenCategories == true && information.children != [] && information.children != undefined
                ?
                    information.children.map((child, counter) => {
                        return <Link key={counter} href={child.url.substr(18)}><a><h6 className={['text-right', 'rtl', 'pr-3', 'mt-3', 'mb-0', 'pointer'].join(' ')} style={{fontSize: '12px'}}>{child.name}</h6></a></Link>
                    })
                :
                    null
            }
        </div>
    );
}

export default RightMenuParentCategoryItem;
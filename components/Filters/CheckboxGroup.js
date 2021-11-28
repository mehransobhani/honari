import React, {useEffect, useState} from 'react';
import Styles from './style.module.css';
import Image from 'next/image';

const Checkbox = (props) => {

    const [options, setOptions] = useState([]);
    const [showStatus, setShowStatus] = useState(true);
    const [filterImage, setFilterImage] = useState('/assets/images/main_images/down_arrow_gray_small.png');
    const [itemsChecked, setItemsChecked] = useState([]);
    const [newItemsChecked, setNewItemsChecked] = useState([]);

    useEffect(()=>{
        setOptions(JSON.parse(props.information.options));
    }, []);

    useEffect(()=>{
        let ic = [];
        for(let option of props.information.options){
            ic.push(false);
        }
        setItemsChecked(ic);
    }, []);

    useEffect(()=>{
        if(props.deletedFilter.enName == props.information.enName){
            console.log(props.deletedFilter.enName);
            setDeletedValue(props.deletedFilter.enName);
            let i = 0;
            for(let item of options){
                if(item == deletedFilter.enName){
                    console.log('use effect : ' + i);
                    break;
                }
                i++;
            }
            let j = 0;
            let newItemsChecked = [];
            for(let ic of itemsChecked);{
                if(i == j){
                    newItemsChecked.push(false);
                }else{
                    newItemsChecked.push(ic);
                }
            }
            setItemsChecked(newItemsChecked);
        }
    });

    const filterHeaderClicked = () => {
        if(showStatus === true){
            setShowStatus(false);
            setFilterImage('/assets/images/main_images/up_arrow_gray_small.png');
        }else if(showStatus === false){
            setShowStatus(true);
            setFilterImage('/assets/images/main_images/down_arrow_gray_small.png');
        }
    };  

    const checkboxChanged = (event) => {
        let property = {
            en_name: props.information.enName,
            value: event.target.value
        };
        props.filterUpdated(property);
    }

    const removedCheckboxChanged = (event) => {
        event.target.checked = true;
        let property = {
            en_name: props.information.enName,
            value: event.target.value
        };
        props.filterUpdated(property);
    }

    const checkboxClicked = (index) => {
        let i = 0
        let newItemsChecked = [];
        for( let ic of itemsChecked){
            if(index == i){
                if(ic == false){
                    newItemsChecked.push(true);
                }else{
                    newItemsChecked.push(false);
                }
            }else{
                newItemsChecked.push(ic);
            }
            i++;
        }
        setItemsChecked(newItemsChecked);
    }

    const foundDeletedItem = (index) => {
        //let newArray = itemsChecked;
        //newArray[index] = false;
        //setItemsChecked(newArray);
        console.log(index);
        let newArray = [];
        itemsChecked.map((ic, i)=>{
            if(index == i){
                newArray.push(false);
            }else{
                newArray.push(ic);
            }
        });
        //setNewItemsChecked(newArray);
    }

    return(
        <div className={['rtl', 'text-right', 'p-3'].join(' ')} style={{borderBottom: '1px solid #dedede'}}>
            <div className={['d-flex', 'flex-row', 'align-items-center', 'justify-content-between', 'pointer'].join(' ')} onClick={filterHeaderClicked}>
                <h6 className={['font-weight-bold', 'text-right', 'mb-1'].join(' ')} style={{fontSize: '15px'}}>{props.information.name}</h6>
                <img src={filterImage} style={{width: '10px', height: '10px'}} />
            </div>
            <div className={['d-none'].join} hidden={showStatus} style={{maxHeight: '200px', overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: '#dedede, #dedede'}}>
                {
                    options.map((option, index)=>{
                        if(props.deletedFilter.en_name == props.information.enName && props.deletedFilter.value == option){
                            foundDeletedItem(index);
                            return(
                                <div>
                                    <input type='checkbox' className={[''].join(' ')} value={option} onChange={removedCheckboxChanged} checked={false}/>
                                    <label className={['mr-1', 'mb-1'].join(' ')} style={{fontSize: '14px'}} >{option}</label>
                                </div>
                            );
                        }else{
                            return(
                                <div>
                                    <input type='checkbox' className={[''].join(' ')} value={option} onChange={checkboxChanged} />
                                    <label className={['mr-1', 'mb-1'].join(' ')} style={{fontSize: '14px'}} >{option}</label>
                                </div>
                            );
                        }
                    })
                }
            </div>
        </div>
    );
}

export default Checkbox;
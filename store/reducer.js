import { CallToActionTwoTone, StarRateSharp } from '@material-ui/icons';
import * as actionTypes from './actions';

const initialState = {
    cart: {
        status: 'NI', // it can be <NI> and <HI>
        information: []
    },
    user: {
        status: 'NI', // it can be <GUEST> AND <LOGIN> AND <NI>
        information: {}
    },
    categoryFilter: {
        id: -1,
        maxPrice: 0,
        minPrice: 0,
        page: 1,
        maxPage: 1,
        order: "new",
        key: "",
        options: [],
        results: []
    },
    loading: false,
    snackbars: {
        success: {
            show: false,
            title: ''
        },
        warning: {
            show: false,
            title: ''
        },
        error: {
            show: false,
            title: ''
        }
    }
}
/*
    ## user.status is a string and these can be its values :
    -> NI <-- default (No information || No Idea)
    -> GUEST
    -> LOGIN

    ## user.information is an object and these are its properties :
    -> userId,
    -> name,
    -> firstName,
    -> secondName,
    -> userName, 
    -> wallet,
    -> email

    ## cart.status is a string and these can be its values :
    -> NI <-- default (No Information || No Idea)
    -> HI <-- (Have Information) 
    ## cart.information is an array and it can have objects containing these properties :
    -> productId,
    -> categoryId,
    -> prodId,
    -> url,
    -> name,
    -> count,
    -> price,
    -> discount
*/

const reducer = (state = initialState, action) => {
    let newCartProducts = [];
    let categoryFilter = state.categoryFilter;
    switch(action.type){
        case actionTypes.UPDATE_USER :
            return {
                ...state,
                user:{
                    status: 'LOGIN',
                    information: action.data
                }
            };
        case actionTypes.UPDATE_USER_TOTALLY :
            return{
                ...state,
                user: action.data
            };
        case actionTypes.SET_USER_GUEST :
            return {
                ...state,
                user:{
                    status: 'GUEST',
                    information: {}
                }
            };
        case actionTypes.UPDATE_CART :
            return {
                ...state,
                cart: {
                    status: 'HI',
                    information: action.data
                }
            };
        case actionTypes.ADD_TO_CART :
            newCartProducts = state.cart.information;
            console.log(action.data);
            newCartProducts.push(action.data);
            return {    
                ...state,
                cart: {
                    status: 'HI',
                    information: newCartProducts
                }
            };
        case actionTypes.REMOVE_FROM_CART :
            newCartProducts = [];
            state.cart.information.map((item, counter) => {
                if(item.productPackId !== action.productPackId){
                    newCartProducts.push(item);
                }
            });
            return {
                ...state,
                cart: {
                    status: 'HI',
                    information: newCartProducts
                }
            };
        case actionTypes.INCREASE_COUNT_BY_ONE:
            newCartProducts = [];
            state.cart.information.map((item, counter) => {
                if(item.productPackId === action.productPackId){
                    let newItem = item;
                    newItem.count = item.count + 1;
                    newCartProducts.push(newItem);
                }else{
                    newCartProducts.push(item);
                }
            });
            return {
                ...state,
                cart: {
                    status: 'HI',
                    information: newCartProducts
                }
            };
        case actionTypes.DECREASE_COUNT_BY_ONE:
            newCartProducts = [];
            state.cart.information.map((item, counter) => {
                if(item.productPackId === action.productPackId){
                    let newItem = item;
                    newItem.count = item.count - 1;
                    newCartProducts.push(newItem);
                }else{
                    newCartProducts.push(item);
                }
            });
            return {
                ...state,
                cart: {
                    status: 'HI',
                    information: newCartProducts
                }
            };
        case actionTypes.START_LOADING:
            return {
                ...state,
                loading: true  
        };
        case actionTypes.STOP_LOADING:
            return {
                ...state,
                loading: false
            };
        case actionTypes.UPDATE_SUCCESS_SNACKBAR:
            return {
                ...state,
                snackbars: {
                    ...snackbars,
                    success: {
                        show: action.show,
                        title: action.title
                    }
                }
            };
        case actionTypes.UPDATE_WARNING_SNACKBAR:
            return{
                ...state,
                snackbars: {
                    ...snackbars,
                    warning: {
                        show: action.show,
                        title: action.title
                    }
                }
            };
        case actionTypes.UPDATE_ERROR_SNACKBAR:
            return{
                ...state,
                snackbars: {
                    ...snackbars,
                    error: {
                        show: action.show,
                        title: action.title
                    }
                }
            };
        case actionTypes.UPDATE_SNACKBAR :
            let sb = state.snackbars;
            if(action.kind === 'success'){
                return {
                    ...state,
                    snackbars: {
                        ...sb,
                        success: {
                            show: action.show,
                            title: action.title
                        }
                    }
                };
            }else if(action.kind === 'warning'){
                return{
                    ...state,
                    snackbars: {
                        ...sb,
                        warning: {
                            show: action.show,
                            title: action.title
                        }
                    }
                };
            }else if(action.kind === 'error'){
                return{
                    ...state,
                    snackbars: {
                        ...sb,
                        error: {
                            show: action.show,
                            title: action.title
                        }
                    }
                };
            }else{
                return state;
            }
        case actionTypes.WIPE_CART:
            return{
                ...state,
                cart: {
                    status: 'HI',
                    information: []
                }
            }
        case actionTypes.ADD_CATEGORY_FILTER_OPTION:
            let filterOptions = categoryFilter.options;
            let found = false;
            filterOptions.map((item, counter) => {
                if(item.en_name === action.en_name && item.value === action.value){
                    found = true;
                }
            });
            if(!found){
                filterOptions.push({en_name: action.en_name, value: action.value});
                return {
                    ...state,
                    categoryFilter: {
                        ...categoryFilter,
                        options: filterOptions
                    }
                };
            }else{
                return state;
            }
        case actionTypes.REMOVE_CATEGORY_FILTER_OPTION:
            let fos = [];
            state.categoryFilter.options.map((item, counter) => {
                if(item.en_name !== action.en_name || item.value !== action.value){
                    fos.push({en_name: item.en_name, value: item.value});    
                }
            });
            return{
                ...state,
                categoryFilter: {
                    ...categoryFilter,
                    options: fos
                }
            };
        case actionTypes.UPDATE_CATEGORY_FILTER_ID:
            return {
                ...state,
                categoryFilter: {
                    ...categoryFilter,
                    id: action.id
                }
            };
        case actionTypes.UPDATE_CATEGORY_FILTER_KEY:
            return {
                ...state,
                categoryFilter: {
                    ...categoryFilter,
                    key: action.key
                }
            };
        case actionTypes.UPDATE_CATEGORY_FILTER_PAGE:
            return {
                ...state,
                categoryFilter: {
                    ...categoryFilter,
                    page: action.page
                }
            };
        case actionTypes.UPDATE_CATEGORY_FILTER_PRICE:
            return {
                ...state,
                categoryFilter: {
                    ...categoryFilter,
                    minPrice: action.minPrice,
                    maxPrice: action.maxPrice
                }
            };
        case actionTypes.UPDATE_CATEGORY_FILTER_ORDER:
            return {
                ...state,
                categoryFilter: {
                    ...categoryFilter,
                    order: action.order
                }
            };
        case actionTypes.UPDATE_CATEGORY_FILTER_MAX_PAGE:
            return {
                ...state,
                categoryFilter: {
                    ...categoryFilter,
                    maxPage: action.maxPage
                }
            };
        case actionTypes.UPDATE_CATEGORY_FILTER_RESULTS:
            return {
                ...state,
                categoryFilter: {
                    ...categoryFilter,
                    results: action.results
                }
            };
        case actionTypes.WIPE_CATEGORY_FILTER:
            return {
                ...state,
                categoryFilter: {
                    id: -1,
                    maxPrice: 0,
                    minPrice: 0,
                    page: 1,
                    maxPage: 1,
                    order: "new",
                    key: "",
                    options: [],
                    results: []
                }
            };
        default:
            return state;

    }
}

export default reducer;
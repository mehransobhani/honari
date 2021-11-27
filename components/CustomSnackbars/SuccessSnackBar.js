import react from 'react';

const SuccessSnackBar = () => {
    return(
        <div className={['d-flex', 'flex-row', 'rtl', 'align-items-center', 'mr-2', 'mb-2', 'px-3',' py-2', 'font11md17'].join(' ')}>
            <span>عملیات با موفقیت انجام شد</span>
        </div>  
    );
}

export default SuccessSnackBar;
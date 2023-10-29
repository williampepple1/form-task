import React from "react";
import { SpinnerCircular } from 'spinners-react';
import styles from '../styles.module.css'


const Spinner = () => {
    return (
        <div className={styles.spinnerDiv}>
            <SpinnerCircular color={'#5a9370'}  size={'30%'}/>
        </div>
    );
}

export default Spinner;

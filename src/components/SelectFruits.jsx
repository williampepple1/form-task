import React, { useState, useRef } from 'react';
import arrowDownIcon from '../icons/arrow-down.svg'
import closeIcon from '../icons/close.svg'
import { useOnClickOutside } from '../helpers';
import styles from '../styles.module.css'

const SelectFruit = ({ selectedFruits, fruits, handleChange }) => {
    const [infocus, setInfocus] = useState(false)
    const [show, changeShow] = useState(false)

    const closeFocus = () => {
        changeShow(false)
        setInfocus(false)
    }
    const containerRef = useRef(null);
    useOnClickOutside(containerRef, closeFocus)

    const showDropdown = () => changeShow(!show)
    const dropdownRef = useRef(null);
    useOnClickOutside(dropdownRef, showDropdown)

    const handleSelectFruit = (fruit) => {
        handleChange('fruits', fruit);
        setInfocus(true)
        showDropdown()
    }

    return (
        <section className={styles['container']} ref={containerRef}>
            <div className={`${styles['selectField']} ${infocus && styles['infocus']}`} onClick={showDropdown} >
                {
                    selectedFruits?.length === 0
                        ?
                        <span className={styles['placeholder']}>Select fruits</span>
                        :
                        <div className={styles['selectPills']} >
                            {
                                selectedFruits.map((fruit, index) => (
                                    <div className={styles['selectPill']} key={index} onClick={(e) => { e.stopPropagation(); handleChange('fruits', fruit); }} >
                                        {fruit}
                                        <img src={closeIcon} alt="delete fruit" />
                                    </div>
                                ))
                            }
                        </div>
                }
                <img className={`${show && styles['rotate']}`} src={arrowDownIcon} alt="Arrow Down" />
            </div>
            {
                show &&
                <div className={styles['selectDropdown']} ref={dropdownRef}>
                    {
                        fruits.map((fruit, index) => (
                            <div className={`${selectedFruits.includes(fruit) ? styles['selected'] : styles['unselected']}`} key={index} onClick={() => handleSelectFruit(fruit)}>
                                {fruit}
                            </div>
                        ))
                    }
                </div>
            }
        </section >
    )
}

export default SelectFruit;
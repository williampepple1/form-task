import React, { useState, useRef } from 'react';
import arrowDownIcon from '../icons/arrow-down.svg'
import { useOnClickOutside } from '../helpers';
import styles from '../styles.module.css'

const SelectColor = ({ color, colors, handleChange }) => {
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

    const handleSelectColor = (color) => {
        handleChange('color', color);
        setInfocus(true)
        showDropdown()
    }

    return (
        <section className={styles['container']} ref={containerRef}>
            <div className={`${styles['selectField']} ${infocus && styles['infocus']}`} onClick={showDropdown} >
                {
                    color === ''
                        ?
                        <span className={styles['placeholder']}>Select a color</span>
                        :
                        color
                }
                <img className={`${show && styles['rotate']}`} src={arrowDownIcon} alt="Arrow Down" />
            </div>
            {
                show &&
                <div className={styles['selectDropdown']} ref={dropdownRef}>
                    {
                        colors.map((c, index) => (
                            <div className={`${color === c ? styles['selected'] : styles['unselected']}`} key={index} onClick={() => handleSelectColor(c)}>
                                {c}
                            </div>
                        ))
                    }
                </div>
            }
        </section>
    )
}

export default SelectColor;
import React, { useLayoutEffect, useState } from 'react';
import SelectColor from './SelectColor'
import SelectFruits from './SelectFruits';
import Spinner from './Spinner';
import closeIcon from '../icons/close.svg'
import styles from '../styles.module.css'
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, set, onValue, off } from "firebase/database";

const DataForm = ({ logout, setUser }) => {
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;
  const userRef = ref(db, 'formData/' + userId);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true); 

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null)
        logout()
      }).catch((error) => {
        setSuccessMessage('');
        setErrorMessage('Logout was unsuccessful')
      });
  }

  const defaultData = {
    name: '',
    color: '',
    fruits: []
  }
  const [formData, setData] = useState(defaultData)

  const colors = ["Red", "Blue", "Green"]
  const fruits = ["Apple", "Banana", "Cherry", "Date"]

  const handleChange = (field, value) => {
    const newData = { ...formData }
    if (field === 'name') {
      newData[field] = value
    }
    else if (field === 'color') {
      newData[field] = value
    }
    else if (field === 'fruits') {
      if (formData[field].includes(value)) {
        newData[field] = formData[field].filter(fruit => fruit !== value)
      }
      else {
        newData[field] = [...formData[field], value];
      }
    }
    else {
      console.error('Invalid Operation')
    }
    setData(newData)
  }

  useLayoutEffect(() => {
    const handleData = (snapshot) => {
      const newData = snapshot.val() || formData;
      setData(newData);
      setLoading(false); // Set loading to false once data is loaded
    };

    onValue(userRef, handleData);

    return () => {
      off(userRef, handleData);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update the user data
      await set(userRef, formData);

      setSuccessMessage('Form data saved successfully!');
      setErrorMessage('');
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('Failed to save form data.');
    }
  };

  return (
    <form className={styles['dataForm']}>
      {
        loading &&
        <Spinner />
      }
      <img className={styles['closeButton']} src={closeIcon} alt="logout" onClick={handleLogout} />
      <div className={styles['formElement']}>
        <label className={styles['dataFormLabel']}>
          Name:
        </label>
        <input type="text" value={formData.name} alt={'name'} placeholder='Input your name' onChange={(e) => { handleChange('name', e.target.value) }} />
      </div>

      <div className={styles['formElement']}>
        <label className={styles['dataFormLabel']}>
          Color:
        </label>
        <SelectColor color={formData.color} colors={colors} handleChange={handleChange} />
      </div>

      <div className={styles['formElement']}>
        <label className={styles['dataFormLabel']}>
          Fruits:
        </label>
        <SelectFruits selectedFruits={formData.fruits} fruits={fruits} handleChange={handleChange} />
      </div>

      <button onClick={handleSubmit}>Submit</button>
      <div className={styles['otherText']}>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
    </form >
  );
};

export default DataForm;

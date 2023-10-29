import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from "firebase/firestore";
import eyeIcon from '../icons/visible.svg';
import eyeStrikeIcon from '../icons/not-visible.svg';
import styles from '../styles.module.css';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const AuthForm = ({ login, user, setUser }) => {
  const [isSignedUp, setSignedUp] = useState(true)
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setUser(null)
    setErrorMessage('')
    setSuccessMessage('')
  }, [isSignedUp])

  const defaultData = {
    email: '',
    password: ''
  }
  const [authData, setData] = useState(defaultData)
  const [confirmPassword, setPassword] = useState('')

  const [visibility, setVisibility] = useState({ password: false, confirmPassword: false })

  const changeVisibity = (field) => {
    const newBools = { ...visibility }
    newBools[field] = !visibility[field]
    setVisibility(newBools)
  }

  const handleChange = (field, value) => {
    if (field === 'confirmPassword') {
      setPassword(value)
    }
    else {
      const newData = { ...authData }
      newData[field] = value
      setData(newData)
    }
  }

  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('')
    setSuccessMessage('')

    try {
      if (isSignedUp) {
        if (authData.email.length === 0) {
          throw new Error('Email is required')
        }
        if (authData.password.length === 0) {
          throw new Error('Password is required')
        }
        await signInWithEmailAndPassword(auth, authData.email, authData.password)
          .then((userCredential) => {
            setUser(userCredential.user)
            login()
            setSuccessMessage('succesful login')
          })
          .catch((error) => {
            const errorCode = error.code;
            let errorMessage = error.message;

            switch (errorCode) {
              case "auth/invalid-email":
                errorMessage = "Invalid Email/Password";
                break;

              case "auth/user-not-found":
                errorMessage = "Invalid Email/Password";
                break;

              case "auth/wrong-password":
                errorMessage = "Invalid Email/Password";
                break;

              case "auth/invalid-login-credentials":
                errorMessage = "Invalid Email/Password";
                break;

              default:
                errorMessage = "Couldn't log you in at this time.";
                break;
            }

            throw new Error(errorMessage);
          });
      }
      else {
        if (authData.email.length === 0) {
          throw new Error('Email is required')
        }
        if (authData.password.length === 0) {
          throw new Error('Password is required')
        }
        if (authData.password.length < 8) {
          throw new Error('Password must be atleast 8 characters')
        }
        if (authData.password !== confirmPassword) {
          throw new Error('Passwords do not match')
        }
        await createUserWithEmailAndPassword(auth, authData.email, authData.password)
          .then((userCredential) => {
            setUser(userCredential.user)
            login()
            setSuccessMessage('succesful signup')
          })
          .catch((error) => {
            const errorCode = error.code;
            let errorMessage = error.message;

            switch (errorCode) {
              case "auth/invalid-email":
                errorMessage = "Use a valid email address.";
                break;

              case "auth/email-already-in-use":
                errorMessage = "Email is already in use.";
                break;

              default:
                errorMessage = "Couldn't sign you up at this time.";
                break;
            }
            throw new Error(errorMessage)
          });
      }
      // setData(defaultData)
    } catch (e) {
      setErrorMessage(e.message)
    }
  };

  return (
    <form className={styles['authForm']}>
      <div className={styles['authFormElement']}>
        <label className={styles['authFormLabel']}>
          Email:
        </label>
        <input
          type="text"
          value={authData.email}
          alt={'Email'}
          placeholder='Input your Email'
          onChange={(e) => { handleChange('email', e.target.value) }}
        />
      </div>

      <div className={styles['authFormElement']}>
        <label className={styles['authFormLabel']}>
          Password:
        </label>
        <input
          className={styles['passwordInput']}
          type={visibility['password'] ? 'text' : 'password'}
          value={authData.password}
          alt={'password'}
          placeholder={`${isSignedUp ? 'Input' : 'Set your'} Password`}
          onChange={(e) => { handleChange('password', e.target.value) }}
        />
        <img
          className={styles['eyes']}
          src={visibility['password'] ? eyeStrikeIcon : eyeIcon} alt="logout"
          onClick={(e) => changeVisibity('password')}
        />
      </div>

      {
        !isSignedUp &&
        <div className={styles['authFormElement']}>
          <label className={styles['authFormLabel']}>
            Confirm Password:
          </label>
          <input
            className={styles['passwordInput']}
            type={visibility['confirmPassword'] ? 'text' : 'password'}
            value={confirmPassword}
            alt={'confirm password'}
            placeholder='Confirm your Password'
            onChange={(e) => { handleChange('confirmPassword', e.target.value) }}
          />
          <img
            className={styles['eyes']}
            src={visibility['confirmPassword'] ? eyeStrikeIcon : eyeIcon} alt="logout"
            onClick={(e) => changeVisibity('confirmPassword')}
          />
        </div>
      }

      <button onClick={handleSubmit}>
        {
          isSignedUp ?
            'LogIn'
            :
            'SignUp'
        }
      </button>

      <div className={styles['otherText']}>
        {
          errorMessage &&
          <p style={{ color: 'red' }}>{errorMessage}</p>
        }
        {
          successMessage &&
          <p style={{ color: 'green' }}>{successMessage}</p>
        }
        {
          isSignedUp ?
            <p>Don't have an account? <span onClick={() => setSignedUp(false)}>SignUp</span></p>
            :
            <p>Already have an account? <span onClick={() => setSignedUp(true)}>LogIn</span></p>
        }
      </div>
    </form >
  );
};

export default AuthForm;

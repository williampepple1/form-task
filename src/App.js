// src/App.js
import React, { useState } from 'react';
import styles from './styles.module.css'
import AuthForm from './components/AuthForm';
import MainForm from './components/DataForm';

function App() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState(null)

    return (
        <div className={styles['app']}>
            <h1>
                Welcome to my Form Project!
            </h1>
            {
                loggedIn ?
                    <MainForm user={user} setUser={setUser} logout={() => setLoggedIn(false)} />
                    :
                    <AuthForm user={user} setUser={setUser} login={() => setLoggedIn(true)} />
            }
        </div>
    )
}

export default App;
import './AppHeader.css'
import React from 'react'

const Header = () => {
    return (
        <header className="header-container">
            <h1 className="header-logo">
                Petitboxd
                <img src="logo.png" alt="petitboxd logo" width="50" height="50"/>
            </h1>
        </header>
    )
}

export default Header
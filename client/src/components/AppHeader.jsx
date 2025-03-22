import styles from './AppHeader.module.css'
import React, { useContext } from 'react'
import { useState } from 'react';
import MovieForm from './forms/MovieForm';
import MovieService from '../services/MovieService';
import PropTypes from 'prop-types';
import { API_BASE_URL } from '../config';
import Modal from './Modal';
import LoginService from '../services/LoginService';
import { UserContext } from '../providers/UserProvider';

const AppHeader = ({ setMovies }) => {
    const { user, setUser } = useContext(UserContext)
    const [showModal, setShowModal] = useState(false);

    const handleAddMovie = (formData) => {
        const newMovie = {
            title: formData.title,
            poster: formData.poster,
            year: formData.year,
            director: formData.director,
            genres: formData.genres,
            length: Number(formData.hours*60) + Number(formData.minutes),
            country: formData.country.length > 1 ? formData.country : null,
            seenBy: formData.seenBy
        }

        MovieService
            .create(newMovie)
            .then(addedMovie => {
                console.log("Added movie: " + JSON.stringify(addedMovie))
                setMovies((prevState) => prevState.concat(addedMovie))
            })
    };

    return (
        <header className={styles["header-container"]}>
            <h1 className={styles["header-logo"]}>
                Petitboxd
                <img src={API_BASE_URL + "/uploads/logo.png"} alt="petitboxd logo" width="50" height="50"/>
            </h1>

            <div className={styles["header-controls"]}>
                {user && (
                    <button 
                        className={styles["header-button"]}
                        onClick={() => setShowModal(true)}
                    >
                        ➕ Add movie
                    </button>
                )}
                {showModal && 
                    <Modal>
                        <MovieForm handleAddMovie={handleAddMovie} setShowModal={setShowModal}/>
                    </Modal>}                

                <button className={styles["header-button"]}>💬 Suggest movie</button>
                {user ? ( 
                    <div className={styles["logged-message"]}>
                        {user}
                        <button className={styles["logout-button"]} onClick={() => {setUser(null)}}>logout</button>
                    </div>
                ) : (
                    <input 
                        type="password" 
                        placeholder="Enter your petit key" 
                        className={styles["access-input"]}
                        onKeyDown={(e) => {
                            if (e.key !== "Enter") return
                            
                            LoginService
                                .login(e.target.value)
                                .then(({token, user}) => {
                                    console.log("Petit! User: " + user)
                                    window.localStorage.setItem('loggedPetit', JSON.stringify({user, token}))
                                    MovieService.setToken(token)
                                    setUser(user)
                                })
                                .catch(() => {
                                    alert("Invalid petit key")
                                })
                        }}
                    />
                )}
            </div>
        </header>
    )
}
AppHeader.propTypes = {
    setMovies: PropTypes.func.isRequired
}

export default AppHeader
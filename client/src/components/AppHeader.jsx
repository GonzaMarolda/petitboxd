import './AppHeader.css'
import React from 'react'
import { useState } from 'react';
import MovieForm from './forms/MovieForm';
import MovieService from '../services/MovieService';
import PropTypes from 'prop-types';

const AppHeader = ({ setMovies }) => {
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
        <header className="header-container">
            <h1 className="header-logo">
                Petitboxd
                <img src="http://localhost:3001/uploads/logo.png" alt="petitboxd logo" width="50" height="50"/>
            </h1>

            <div className="header-controls">
                <button 
                    className="header-button"
                    onClick={() => setShowModal(true)}
                >
                    ➕ Add movie
                </button>
                {showModal && <MovieForm handleAddMovie={handleAddMovie} setShowModal={setShowModal}/>}                

                <button className="header-button">💬 Suggest movie</button>
                <input 
                    type="password" 
                    placeholder="Enter your petit key" 
                    className="access-input"
                />
            </div>
        </header>
    )
}
AppHeader.propTypes = {
    setMovies: PropTypes.func.isRequired
}

export default AppHeader
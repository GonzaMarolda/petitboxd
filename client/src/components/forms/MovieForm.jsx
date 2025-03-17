import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './MovieForm.css'
import '../Movies.css'
import PetitService from '../../services/PetitService'
import GenreDropdown from './GenreDropdown'
import CountryDropdown from './CountryDropdown'
import PosterInsert from './PosterInsert'

const MovieForm = ({ handleAddMovie, setShowModal }) => {
    const [formData, setFormData] = useState({
        title: '',
        year: '',
        director: '',
        hours: '0',
        minutes: '0',
        genres: [],
        seenBy: [],
        country: '',
        poster: null
    });

    const [petits, setPetits] = useState([])

    useEffect(() => {
        PetitService
            .getAll()
            .then(petits => 
                setPetits(petits)
            )
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let processedValue = correctInputLength(name, value)

        setFormData({...formData, [name]: processedValue });
    }

    const handlePosterUpload = (file) => {
        setFormData({...formData, ["poster"]: file })
    }

    const handlePetitSelection = (petit) => {
        formData.seenBy.includes(petit.id) ? 
            setFormData({...formData, ["seenBy"]: formData.seenBy.filter(pId => pId !== petit.id) }) :
            setFormData({...formData, ["seenBy"]: formData.seenBy.concat(petit.id) });
    }

    const handleGenreModification = (genre, isSelection) => {
        isSelection ?  
            setFormData({ ...formData, genres: formData.genres.concat(genre.id) }) :
            setFormData({ ...formData, genres: formData.genres.filter(gId => gId !== genre.id) })
    }

    const handleCountrySelection = (country) => {
        setFormData({...formData, ["country"]: country.id })
    }

    const correctInputLength = (name, value) => {
        let processedValue = value

        if (name === "hours") {
            processedValue = processedValue.replace(/[^0-9]/g, '')
            processedValue = processedValue[processedValue.length - 1]
            return processedValue
        } else if (name === "minutes") {
            processedValue = processedValue.replace(/[^0-9]/g, '')
            if (processedValue.length <= 2) return processedValue
            processedValue = processedValue[processedValue.length - 2] + processedValue[processedValue.length - 1]
            return processedValue
        } else return value
    }

    return (
        <div className="modal-overlay">
            <div className="movie-card">
                <PosterInsert 
                    onUpload={handlePosterUpload}
                />

                <header className="movie-header">
                    <h3 className="movie-title">
                        {
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter a title"
                                className='title-input'
                                required
                            />
                        }
                        <span className="movie-year"> 
                            ({
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    placeholder="Enter a year"
                                    className='year-input'
                                    required
                                />
                            })
                        </span>
                        <CountryDropdown
                            onSelection={handleCountrySelection}
                        />
                    </h3>
                </header>

                <div className="movie-details">
                    <div className="detail-row">
                        <span className="detail-label">Director:</span>
                        <span className="detail-value">
                            <input
                                type="text"
                                name="director"
                                value={formData.director}
                                onChange={handleInputChange}
                                placeholder="Enter a director"
                                className='director-input'
                                required
                            />
                        </span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Length:</span>
                        <span className="detail-value">
                            {
                                <input
                                    type="text"
                                    name="hours"
                                    value={formData.hours}
                                    onChange={handleInputChange}
                                    className='length-input'
                                    required
                                />
                            }h {" "}
                            {
                                <input
                                    type="text"
                                    name="minutes"
                                    value={formData.minutes}
                                    onChange={handleInputChange}
                                    className='length-input'
                                    required
                                />
                            }m
                        </span>
                    </div>
                </div>

                <div className="genres-container">
                    <h4 className="section-title">Genres</h4> 
                    <GenreDropdown
                        onModify={handleGenreModification}
                    />
                </div>

                <div className="seen-by-container">
                    <h4 className="section-title">Seen by</h4>
                    <div className="seen-by-list">
                        {petits
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(petit => (
                            <span 
                                key={petit.id} 
                                className={"petit-tag " + (formData.seenBy.includes(petit.id) ? "petit-selected" : "petit-unselected")}
                                onClick={() => handlePetitSelection(petit)}>
                                    {petit.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="modal-action">
                    <button 
                        type="cancel" 
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        onClick={(e) => {
                            e.preventDefault()
                            handleAddMovie(formData)
                            setShowModal(false)
                            }}>
                        Add Movie
                    </button>
                </div>
            </div>  
        </div>
    )
}
MovieForm.propTypes = {
    handleAddMovie: PropTypes.func.isRequired,
    setShowModal: PropTypes.func.isRequired
}

export default MovieForm
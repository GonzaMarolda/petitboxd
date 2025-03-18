import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styles from './MovieForm.module.css'
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
        <div className={styles["modal-overlay"]}>
            <div className={styles["movie-card"]}>
                <PosterInsert 
                    onUpload={handlePosterUpload}
                />

                <header className={styles["movie-header"]}>
                    <h3 className={styles["movie-title"]}>
                        {
                            <input
                                type="text"
                                name="title"
                                data-testid="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter a title"
                                className={styles['title-input']}
                                required
                            />
                        }
                        <span className={styles["movie-year"]}> 
                            ({
                                <input
                                    type="number"
                                    name="year"
                                    data-testid="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    placeholder="Enter a year"
                                    className={styles['year-input']}
                                    required
                                />
                            })
                        </span>
                        <CountryDropdown
                            onSelection={handleCountrySelection}
                        />
                    </h3>
                </header>

                <div className={styles["movie-details"]}>
                    <div className={styles["detail-row"]}>
                        <span className={styles["detail-label"]}>Director:</span>
                        <span className={styles["detail-value"]}>
                            <input
                                type="text"
                                name="director"
                                data-testid="director"
                                value={formData.director}
                                onChange={handleInputChange}
                                placeholder="Enter a director"
                                className={styles['director-input']}
                                required
                            />
                        </span>
                    </div>

                    <div className={styles["detail-row"]}>
                        <span className={styles["detail-label"]}>Length:</span>
                        <span className={styles["detail-value"]}>
                            {
                                <input
                                    type="text"
                                    name="hours"
                                    data-testid="hours"
                                    value={formData.hours}
                                    onChange={handleInputChange}
                                    className={styles['length-input']}
                                    required
                                />
                            }h {" "}
                            {
                                <input
                                    type="text"
                                    name="minutes"
                                    data-testid="minutes"
                                    value={formData.minutes}
                                    onChange={handleInputChange}
                                    className={styles['length-input']}
                                    required
                                />
                            }m
                        </span>
                    </div>
                </div>

                <div className={styles["genres-container"]}>
                    <h4 className={styles["section-title"]}>Genres</h4> 
                    <GenreDropdown
                        onModify={handleGenreModification}
                        placeholder={"Enter up to 4 genders"}
                        selectLimit={4}
                    />
                </div>

                <div className={styles["seen-by-container"]}>
                    <h4 className={styles["section-title"]}>Seen by</h4>
                    <div className={styles["seen-by-list"]}>
                        {petits
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(petit => (
                            <span 
                                key={petit.id} 
                                className={styles["petit-tag"] + " " + (formData.seenBy.includes(petit.id) ? styles["petit-selected"] : styles["petit-unselected"])}
                                onClick={() => handlePetitSelection(petit)}>
                                    {petit.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className={styles["modal-action"]}>
                    <button 
                        type="cancel" 
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        data-testid="add_movie"
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
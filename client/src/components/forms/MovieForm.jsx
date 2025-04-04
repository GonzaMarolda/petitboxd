import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styles from './MovieForm.module.css'
import PetitService from '../../services/PetitService'
import GenreDropdown from './GenreDropdown'
import PosterInsert from './PosterInsert'
import MovieFormDetails from './MovieFormDetails'
import MovieFormHeader from './MovieFormHeader'

const MovieForm = ({ handleAddMovie, setShowModal, initialFormData }) => {
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

        if (initialFormData) {
            setFormData({
                ...initialFormData,
                country: initialFormData.country?.id,
                genres: initialFormData.genres?.map(g => g.id)
            })
        }
    }, [])

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

    const validateSubmit = () => {
        const requiredData = ["title", "year", "director"]
        const isLengthMissing = formData.hours === "0" && formData.minutes === "0"
        if (requiredData.some(d => formData[d] === "") || isLengthMissing) {
            let lackingData = requiredData.filter(d => formData[d] === "")
            if (isLengthMissing) lackingData = lackingData.concat("length")
            lackingData = lackingData.join(", ")
            
            alert("Missing required information: " + lackingData)
            return
        }

        setShowModal(false)
        handleAddMovie(formData)
    }

    return (
        <div className={styles["movie-card"]}>
            <PosterInsert 
                onUpload={handlePosterUpload}
                initialPoster={initialFormData?.poster}
            />

            <MovieFormHeader
                title={formData.title}
                year={formData.year}
                initialCountry={initialFormData?.country}
                setFormData={setFormData}
            />
            
            <MovieFormDetails
                hours={formData.hours}
                minutes={formData.minutes}
                director={formData.director}
                setFormData={setFormData}
            />

            <div className={styles["genres-container"]}>
                <h4 className={styles["section-title"]}>Genres</h4> 
                <GenreDropdown
                    onModify={handleGenreModification}
                    placeholder={"Enter up to 4 genders"}
                    selectLimit={4}
                    initialSelectedGenres={initialFormData?.genres}
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
                            onClick={() => handlePetitSelection(petit)}
                            data-testid={"form_" + petit.name}
                            >
                                {petit.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className={styles["modal-action"]}>
                <button 
                    type="cancel" 
                    onClick={() => {
                        setShowModal(false)
                    }}
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    data-testid="add_movie"
                    onClick={(e) => {
                        e.preventDefault()
                        validateSubmit()
                        }}>
                    Submit
                </button>
            </div>
        </div>  
    )
}
MovieForm.propTypes = {
    handleAddMovie: PropTypes.func.isRequired,
    setShowModal: PropTypes.func.isRequired,
    initialFormData: PropTypes.object
}

export default MovieForm
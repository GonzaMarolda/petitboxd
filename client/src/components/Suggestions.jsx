import PropTypes from 'prop-types';
import styles from './Suggestions.module.css';
import React, { useContext, useState } from 'react';
import { UserContext } from '../providers/UserProvider';
import Modal from './Modal';
import MovieForm from './forms/MovieForm';
import MovieService from '../services/MovieService';
import SuggestionService from '../services/SuggestionService';

const Suggestions = ({suggestions, setMovies, setSuggestions}) => {
    const [clickedSuggestionId, setClickedSuggestionId] = useState('')

    const onClick = (suggestionId) => {
        if (clickedSuggestionId === suggestionId) setClickedSuggestionId('')
        else setClickedSuggestionId(suggestionId)
    }

    if (suggestions.length === 0) {
        return (
            <div className={styles["noResultsContainer"]}>
                    <div className={styles["noResultsContent"]}>
                            <h3 className={styles["noResultsTitle"]}>No suggestions found</h3>
                    </div>
            </div>
        )
    }


    return (
        <div className={styles["suggestions-container"]}>
            {suggestions.map(suggestion => 
                <Suggestion 
                    key={suggestion.id} 
                    suggestion={suggestion} 
                    clickedSuggestionId={clickedSuggestionId} 
                    onClick={onClick}
                    setMovies={setMovies}
                    setSuggestions={setSuggestions}
                />)}
        </div> 
    )
}
Suggestions.propTypes = {
  suggestions: PropTypes.array.isRequired,
  setSuggestions: PropTypes.func.isRequired,
  setMovies: PropTypes.func.isRequired
}

const Suggestion = ({ suggestion, clickedSuggestionId, onClick, setMovies, setSuggestions }) => {
    const clicked = suggestion.id === clickedSuggestionId
    const { user } = useContext(UserContext)
    const [formOpen, setFormOpen] = useState(false)

    const handleAddMovie = (formData) => {
        const movie = {
            ...formData,
            length: Number(formData.hours*60) + Number(formData.minutes),
            country: formData.country !== "" ? formData.country : null,
        }

        MovieService
            .create(movie)
            .then(addedMovie => {
                console.log("Added movie: " + JSON.stringify(addedMovie))
                setMovies(prev => prev.concat(addedMovie))
                setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
            })
    }

    const handleDeleteSuggestion = () => {
        SuggestionService
            .remove(suggestion.id)
            .then(() => {
                setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
            })
    }

    return (
    <div 
        className={styles["suggestion-card"] + " " + (clicked ? "" : styles["hoverable"])}
        onClick={() => {
                if (clicked) return
                onClick(suggestion.id)
            }} 
        style={{cursor: user ? "pointer" : "default"}}
    >
        {user && (
            <div 
                className={styles["suggestion-config-container"]} 
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onClick(suggestion.id);
                    }
                }} 
                style={clicked ? {visibility: "visible"} : {visibility: "hidden"}}
            >
				<div 
                    className={styles["config-button"]} 
                    onClick={() => {
                        if (!formOpen) setFormOpen(true)
                    }}
                >
                    <svg width="36" height="36" viewBox="0 0 36 36" className={styles["accept-button"]} fill="currentColor" >
                        <path d="M34.459 1.375a2.999 2.999 0 0 0-4.149.884L13.5 28.17l-8.198-7.58a2.999 2.999 0 1 0-4.073 4.405l10.764 9.952s.309.266.452.359a2.999 2.999 0 0 0 4.15-.884L35.343 5.524a2.999 2.999 0 0 0-.884-4.149z"/>
                    </svg>
					{formOpen &&
					(
						<Modal>
							<MovieForm
								handleAddMovie={handleAddMovie}
                                setShowModal={setFormOpen}
								initialFormData={{        
                                    title: suggestion.title,
                                    year: '',
                                    director: '',
                                    hours: '0',
                                    minutes: '0',
                                    genres: [],
                                    seenBy: [],
                                    country: '',
                                    poster: null}}
							/>
						</Modal>
					)}
				</div>
                <div className={styles["config-button"]} onClick={handleDeleteSuggestion}>
                    <svg fill="currentColor" height="33x" width="33px" viewBox="0 0 490 490" className={styles["discard-button"]}>
                        <polygon 
                            points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490   489.292,457.678 277.331,245.004 489.292,32.337 " 
                            stroke="currentColor"
                            strokeWidth="25" 
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>
        )}

        <h3 className={styles.suggestionTitle}>
            {suggestion.title}
        </h3>
        
        <div className={styles["comment"]}>
            &quot;{suggestion.comment}&quot;
        </div>

        <div className={styles["suggested-by-container"]}>
            <p>Movie suggested by:</p>
            <p><strong>{suggestion.name}</strong></p>
        </div>
    </div>
    )
}
Suggestion.propTypes = {
    suggestion: PropTypes.object.isRequired,
    clickedSuggestionId: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    setSuggestions: PropTypes.func.isRequired,
    setMovies: PropTypes.func.isRequired
}

export default Suggestions
import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import GenreService from '../../services/GenreService'
import styles from './GenresFilter.module.css'

const GenresFilter = ({ onModify, placeholder, startingIncludedGenresId, startingExcludedGenresId }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [genres, setGenres] = useState([])
    const [filteredGenres, setFilteredGenres] = useState([])
    const [includedGenres, setIncludedGenres] = useState([])
    const [excludedGenres, setExcludedGenres] = useState([])
    const selectedGenres = includedGenres.concat(excludedGenres)
    const dropdownRef = useRef(null);

    useEffect(() => {
        GenreService
            .getAll()
            .then(genres => {
                setGenres(genres)
                setFilteredGenres(genres)
                checkStartingGenres(genres)
            })
    }, [])

    // Handle clicks for dropdown closure
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
            }
        };
    
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } 
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const checkStartingGenres = (genres) => {
        if (!startingIncludedGenresId && !startingExcludedGenresId) return

        startingIncludedGenresId.forEach(genreId => {
            const includedGenre = genres.find(g => g.id === genreId)
            setIncludedGenres(prev => prev.concat(includedGenre))
        });

        startingExcludedGenresId.forEach(genreId => {
            const excludedGenre = genres.find(g => g.id === genreId)
            setExcludedGenres(prev => prev.concat(excludedGenre))
        });
    }

    const handleEnter = (event) => {
        event.preventDefault(); 
        if (filteredGenres.length == 0) return

        const firstMatch = filteredGenres[0]
        handleSelection(firstMatch)
    };

    const handleSelection = (genre) => {
        if (includedGenres.includes(genre)) {
            setIncludedGenres(includedGenres.filter(i => i.id !== genre.id))
            setExcludedGenres(prev => prev.concat(genre))
        } else {
            setExcludedGenres(excludedGenres.filter(i => i.id !== genre.id))
            setIncludedGenres(prev => prev.concat(genre))
        }

        const newFilteredGenres = filterGenres('').filter(i => i.id !== genre.id)
        setFilteredGenres(newFilteredGenres)
        setSearchQuery('')
        
        onModify(genre)
    }

    const handleRemove = (genre) => {
        setIncludedGenres(includedGenres.filter(i => i.id !== genre.id))
        setExcludedGenres(excludedGenres.filter(i => i.id !== genre.id))
        const newFilteredGenres = filterGenres(searchQuery).concat(genre)
        setFilteredGenres(newFilteredGenres)

        onModify(genre, true)
    }

    const filterGenres = (searchQueryValue) => {
        return genres.filter(i => 
            i.name.toLowerCase().startsWith(searchQueryValue.toLowerCase()) &&
            !selectedGenres.some(selected => selected.id === i.id)
        )
    }

    return (
        <div className={styles["multiple-dropdown-container"]}>
            <div className={styles["filter-dropdown-container"]}>
                <div 
                    className={styles["filter-genre-input"]}
                    data-testid="filter-genre-input"
                >
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={searchQuery}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleEnter(e)}}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            const newFilteredGenres = filterGenres(e.target.value)
                            setFilteredGenres(newFilteredGenres)}}
                        onClick={() => {
                            setIsOpen(true)
                            filterGenres(searchQuery)
                        }}
                    />

                    <div className={styles['filter-genres-text']}><span style={{color: "#daecdd"}}>Include</span> or <span style={{color: "#ecdeda"}}>Exclude</span> genres from the search</div>

                </div>
                
                {isOpen && (
                    <div 
                        className={styles["filter-dropdown-menu"]}
                        role="listbox"
                        ref={dropdownRef}
                    >
                        {filteredGenres
                            .sort((a, b) => {
                                if (a.name < b.name) {
                                    return -1;
                                }
                                if (a.name > b.name) {
                                    return 1;
                                }
                                return 0;})
                            .map(genre => (
                                <div
                                    key={genre.id}
                                    className={styles["filter-dropdown-genre"]}
                                    onClick={() => {
                                        handleSelection(genre)
                                        setIsOpen(false)
                                        setSearchQuery('')}}
                                    role="option"
                                >
                                    {genre.name}
                                </div>))
                        }
                    </div>
                )}
            </div>
            <div className={styles["filter-selected-genre-container"]}>
                    {selectedGenres.map(genre => (
                        <div 
                            key={genre.id} 
                            className=
                                {styles["filter-selected-genre"] + " " +
                                (includedGenres.includes(genre) ? styles["filter-included"] : styles["filter-excluded"])}                      
                        >
                            <span style={{cursor: "pointer"}} onClick={() => handleSelection(genre)}>{genre.name}</span>
                            <button 
                                type="button" 
                                className={styles["filter-remove-genre"]}
                                onClick={() => handleRemove(genre)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    )
}
GenresFilter.propTypes = {
    onModify: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    startingIncludedGenresId: PropTypes.array.isRequired,
    startingExcludedGenresId: PropTypes.array.isRequired
}

export default GenresFilter
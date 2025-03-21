import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import GenreService from '../../services/GenreService'
import styles from './GenreDropdown.module.css'

const GenreDropdown = ({ onModify, placeholder, selectLimit, initialSelectedGenres }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [genres, setGenres] = useState([])
    const [filteredGenres, setFilteredGenres] = useState([])
    const [selectedGenres, setSelectedGenres] = useState([])
    const dropdownRef = useRef(null);
    const inputRef = useRef(null)

    useEffect(() => {
        GenreService
            .getAll()
            .then(genres => {
                setGenres(genres)
                setFilteredGenres(genres);
            })

        if (initialSelectedGenres) {
            setSelectedGenres(initialSelectedGenres)
        }
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

    const handleEnter = (event) => {
        event.preventDefault(); 
        if (filteredGenres.length == 0) return

        const firstMatch = filteredGenres[0]
        handleSelection(firstMatch)
    };

    const handleSelection = (genre) => {
        if (selectedGenres ? selectedGenres.length >= selectLimit : false) return;

        setSelectedGenres(selectedGenres.concat(genre))
        const newFilteredGenres = filterGenres('').filter(i => i.id !== genre.id)
        setFilteredGenres(newFilteredGenres)
        setSearchQuery('')
        
        onModify(genre, true)
    }

    const handleRemove = (genre) => {
        setSelectedGenres(selectedGenres.filter(i => i.id !== genre.id))
        const newFilteredGenres = filterGenres(searchQuery).concat(genre)
        setFilteredGenres(newFilteredGenres)

        onModify(genre, false)
    }

    const filterGenres = (searchQueryValue) => {
        return genres.filter(i => 
            i.name.toLowerCase().startsWith(searchQueryValue.toLowerCase()) &&
            !selectedGenres.some(selected => selected.id === i.id)
        )
    }

    return (
        <div className={styles["multiple-dropdown-container"]}>
            <div className={styles["dropdown-container"]}>
                <div 
                    className={styles["genre-input"]}
                    data-testid="genre_input"
                    onClick={() => {
                        setIsOpen(true)
                        filterGenres(searchQuery)
                    }}
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
                        ref={inputRef}
                    />
                </div>
                
                {isOpen && (
                    <div 
                        className={styles["dropdown-menu"]}
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
                                    className={styles["dropdown-genre"]}
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
            <div className={styles["selected-genre-container"]}>
                    {selectedGenres.map(genre => (
                        <div key={genre.id} className={styles["selected-genre"]}>
                            <span>{genre.name}</span>
                            <button 
                                type="button" 
                                className={styles["remove-genre"]}
                                onClick={() => handleRemove(genre)}
                                data-testid={"remove_" + genre.name}
                            >
                                ×
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    )
}
GenreDropdown.propTypes = {
    onModify: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    selectLimit: PropTypes.number,
    initialSelectedGenres: PropTypes.array
}

export default GenreDropdown
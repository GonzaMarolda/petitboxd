import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import GenreService from '../../services/GenreService'
import './GenreDropdown.css'
import './MovieForm.css'

const GenreDropdown = ({ onModify }) => {
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
        if (selectedGenres.length >= 4) return;

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
        <div className="multiple-dropdown-container">
            <div className="dropdown-container">
                <div 
                    className="genre-input"
                    onClick={() => {
                        setIsOpen(true)
                        filterGenres(searchQuery)
                    }}
                >
                    <input
                        type="text"
                        placeholder="Select up to 4 genders"
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
                        className="dropdown-menu"
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
                                    className="dropdown-genre"
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
            <div className="selected-genre-container">
                    {selectedGenres.map(genre => (
                        <div key={genre.id} className="selected-genre">
                            <span>{genre.name}</span>
                            <button 
                                type="button" 
                                className="remove-genre"
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
GenreDropdown.propTypes = {
    onModify: PropTypes.func.isRequired
}

export default GenreDropdown
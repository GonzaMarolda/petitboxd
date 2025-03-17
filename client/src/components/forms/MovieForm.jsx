import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './MovieForm.css'
import '../Movies.css'
import GenreService from '../../services/GenreService';
import CountryService from '../../services/CountryService';
import PetitService from '../../services/PetitService'
import Dropdown from './common/Dropdown'

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

    const [posterPreview, setPosterPreview] = useState(null);
    const [petits, setPetits] = useState([])
    // Countries
    const [countries, setCountries] = useState([])
    const [filteredCountries, setFilteredCountries] = useState([])
    const [countryFlag, setCountryFlag] = useState('missing')
    const [isCountriesOpen, setIsCountriesOpen] = useState(false)
    const [countryQuery, setCountryQuery] = useState('')

    useEffect(() => {
        PetitService
            .getAll()
            .then(petits => 
                setPetits(petits)
            )
        CountryService
            .getAll()
            .then(countries => {
                setCountries(countries)
                setFilteredCountries(countries)
            })
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let processedValue = correctLengthInput(name, value)

        setFormData({...formData, [name]: processedValue });
    };

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
        setCountryQuery('')
        setFilteredCountries(countries)
        setIsCountriesOpen(false)
        setCountryFlag(country.name)
        setFormData({...formData, ["country"]: country.id })
    }

    const handleEnterOnCountries = (event) => {
        event.preventDefault(); 
        if (filteredCountries.length == 0) return

        const firstMatch = filteredCountries[0]
        handleCountrySelection(firstMatch) 
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        if (!file.type.startsWith('image/')) {
          alert('Invalid image file');
          return;
        }
    
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => setPosterPreview(reader.result);


        setFormData({...formData, ["poster"]: file })
      };

    const correctLengthInput = (name, value) => {
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
                <label className="poster-insert-container" htmlFor="poster-upload">
                    <input 
                        type="file" 
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                        id="poster-upload"
                    />
                    {posterPreview ? (
                        <img
                            src={posterPreview} 
                            alt="Poster preview" 
                            className="poster-inserted"
                        />
                    ) : (
                        <>
                        <img
                            src={"posters/insertImage.jpg"} 
                            alt="Poster preview" 
                            className="poster-insert"
                        />
                        <div className="poster-insert-text">
                            Insert movie poster
                        </div>
                        </>
                    )}
                </label>

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
                        <span className='country-container'>
                            <img 
                                src={
                                    "flags/" + 
                                    countryFlag.toLowerCase().replace(/\s+/g, '-')  + ".png"
                                }
                                alt={name + " flag"} 
                                onError={() => {setCountryFlag("missing")}}
                                className="clickable-flag-icon"
                                onClick={() => setIsCountriesOpen(!isCountriesOpen)}
                            />
                            {isCountriesOpen && (
                                <div className='countries-dropdown'>
                                    <input 
                                        type="text" 
                                        className='country-input'
                                        value={countryQuery}
                                        onChange={(e) => {
                                            const newQuery = e.target.value
                                            setFilteredCountries(countries.filter(c => c.name.toLowerCase().startsWith(newQuery.toLowerCase())))
                                            setCountryQuery(newQuery)
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleEnterOnCountries(e)}}
                                        placeholder='Select a country'
                                    />
                                    <div 
                                        className="countries-dropdown-menu"
                                    >
                                        {filteredCountries
                                            .sort((a, b) => {
                                                if (a.name < b.name) {
                                                    return -1;
                                                }
                                                if (a.name > b.name) {
                                                    return 1;
                                                }
                                                return 0;})
                                            .map(country => (
                                                <div
                                                    key={country.id}
                                                    className="dropdown-item"
                                                    onClick={() => {
                                                        handleCountrySelection(country) 
                                                    }}
                                                >
                                                    {country.name}
                                                </div>))
                                        }
                                    </div>
                                </div>
                            )}
                        </span>
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
                    <Dropdown
                        DataService={GenreService}
                        isMultiple={true}
                        onModify={handleGenreModification}
                        placeholder={"Select up to 4 genres"}
                        classNameSelected={"selected-genre"}
                        classNameInput={"genre-input"}
                        maxSelections={4}
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

/*
<MovieImage 
    src={"insertImage.png"}
    alt={"test poster"}
    className={"poster-insert"}
/>
*/
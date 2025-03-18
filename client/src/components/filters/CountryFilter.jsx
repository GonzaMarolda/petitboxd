import React, { useEffect, useState, useRef } from 'react'
import CountryService from '../../services/CountryService'
import PropTypes from 'prop-types'
import styles from './CountryFilter.module.css'

const CountryFilter = ( {onSelection, startingCountryId} ) => {
    const [countries, setCountries] = useState([])
    const [filteredCountries, setFilteredCountries] = useState([])
    const [countryFlag, setCountryFlag] = useState('missing')
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = useRef(null);

    useEffect(() => {
        CountryService
            .getAll()
            .then(countries => {
                setCountries(countries.concat({name: '-', id: null}))
                setFilteredCountries(countries.concat({name: '-', id: null}))
                checkStartingCountry(countries)
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

    const checkStartingCountry = (countries) => {
        if (!startingCountryId) return

        const startingCountry = countries.find(c => c.id === startingCountryId)
        setCountryFlag(startingCountry.name)
    }

    const handleEnter = (event) => {
        event.preventDefault(); 
        if (filteredCountries.length == 0) return

        const firstMatch = filteredCountries[0]
        handleSelection(firstMatch) 
    };

    const handleSelection = (country) => {
        setSearchQuery('')
        setFilteredCountries(countries)
        setIsOpen(false)
        setCountryFlag(country.name)
        onSelection(country)
    }

    return (
        <div className={styles["dropdown-container"]}>
            <div 
                className={styles["country-input"]}
                data-testid="country-input"
            >
                <input
                    type="text"
                    placeholder="Select a country"
                    value={searchQuery}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleEnter(e)}}
                    onChange={(e) => {
                        const newQuery = e.target.value
                        setFilteredCountries(countries.filter(c => c.name.toLowerCase().startsWith(newQuery.toLowerCase())))
                        setSearchQuery(newQuery)
                    }}
                    onClick={() => {
                        setIsOpen(true)
                    }}
                />
            </div>
            
            {isOpen && (
                <div 
                    className={styles["dropdown-menu"]}
                    role="listbox"
                    ref={dropdownRef}
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
                                className={styles["dropdown-genre"]}
                                onClick={() => {
                                    handleSelection(country)
                                    setIsOpen(false)
                                    setSearchQuery('')}}
                                role="option"
                            >
                                {country.name}
                            </div>))
                    }
                </div>
            )}
            <img 
                src={
                    "http://localhost:3001/uploads/flags/" + 
                    countryFlag.toLowerCase().replace(/\s+/g, '-')  + ".png"
                }
                alt={countryFlag + " flag"} 
                onError={() => {setCountryFlag("missing")}}
                className={styles["flag-icon"]}
                data-testid="flag-icon"
            />
        </div>
    )
}
CountryFilter.propTypes = {
    onSelection: PropTypes.func.isRequired,
    startingCountryId: PropTypes.string.isRequired
}

export default CountryFilter
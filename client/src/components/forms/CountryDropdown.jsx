import React, { useEffect, useState } from 'react'
import CountryService from '../../services/CountryService'
import PropTypes from 'prop-types'
import styles from './CountryDropdown.module.css'
import { API_BASE_URL } from '../../config'

const CountryDropdown = ( {onSelection, initialCountry} ) => {
    const [countries, setCountries] = useState([])
    const [filteredCountries, setFilteredCountries] = useState([])
    const [countryFlag, setCountryFlag] = useState('missing')
    const [isCountriesOpen, setIsCountriesOpen] = useState(false)
    const [countryQuery, setCountryQuery] = useState('')

    useEffect(() => {
        CountryService
            .getAll()
            .then(countries => {
                setCountries(countries)
                setFilteredCountries(countries)
            })
        if (initialCountry) {
            setCountryFlag(initialCountry.name)
        }
    }, [])

    const handleEnter = (event) => {
        event.preventDefault(); 
        if (filteredCountries.length == 0) return

        const firstMatch = filteredCountries[0]
        handleSelection(firstMatch) 
    };

    const handleSelection = (country) => {
        setCountryQuery('')
        setFilteredCountries(countries)
        setIsCountriesOpen(false)
        setCountryFlag(country.name)
        onSelection(country)
    }

    return (
        <span className={styles["flag-dropdown-container"]}>
            <img 
                src={
                    API_BASE_URL + "/uploads/flags/" +
                    countryFlag.toLowerCase().replace(/\s+/g, '-')  + ".png"
                }
                alt={countryFlag + " flag"} 
                onError={() => {setCountryFlag("missing")}}
                className={styles["clickable-flag-icon"]}
                data-testid="flag_button"
                onClick={() => setIsCountriesOpen(!isCountriesOpen)}
            />
            {isCountriesOpen && (
                <div className={styles['countries-dropdown']}>
                    <input 
                        type="text" 
                        className={styles['country-input']}
                        value={countryQuery}
                        onChange={(e) => {
                            const newQuery = e.target.value
                            setFilteredCountries(countries.filter(c => c.name.toLowerCase().startsWith(newQuery.toLowerCase())))
                            setCountryQuery(newQuery)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleEnter(e)}}
                        placeholder='Select a country'
                    />
                    <div 
                        className={styles["countries-dropdown-menu"]}
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
                                    className={styles["dropdown-country"]}
                                    onClick={() => {
                                        handleSelection(country) 
                                    }}
                                >
                                    {country.name}
                                </div>))
                        }
                    </div>
                </div>
            )}
    </span>
    )
}
CountryDropdown.propTypes = {
    onSelection: PropTypes.func.isRequired,
    initialCountry: PropTypes.object
}

export default CountryDropdown
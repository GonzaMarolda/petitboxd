import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import styles from './Filters.module.css'
import GenresFilter from './GenresFilter'
import CountryFilter from './CountryFilter';
import PetitService from '../../services/PetitService';

const Filters = ({selectedFilters ,setSelectedFilters, toggleFilters}) => {
    const [unappliedFilters, setUnappliedFilters] = useState(selectedFilters)
    const [petits, setPetits] = useState([])

    useEffect(() => {
        PetitService.getAll()
            .then(petits => {
                setPetits(petits)
            })
    }, [])

    const handleGenreFilter = (genre, isRemove = false) => {
        if (isRemove) {
            setUnappliedFilters(prev => ({...prev, ["includedGenres"]: prev.includedGenres.filter(id => id !== genre.id)}))
            setUnappliedFilters(prev => ({...prev, ["excludedGenres"]: prev.excludedGenres.filter(id => id !== genre.id)}))
        } else {
            if (unappliedFilters.includedGenres.includes(genre.id)) {
                setUnappliedFilters(prev => ({...prev, ["includedGenres"]: prev.includedGenres.filter(id => id !== genre.id)}))
                setUnappliedFilters(prev => ({...prev, ["excludedGenres"]: prev.excludedGenres.concat(genre.id)}))
            } else {
                setUnappliedFilters(prev => ({...prev, ["excludedGenres"]: prev.excludedGenres.filter(id => id !== genre.id)}))
                setUnappliedFilters(prev => ({...prev, ["includedGenres"]: prev.includedGenres.concat(genre.id)}))
            }
        }
    }

    const handleFilterChange = (filterType, value) => {
        let processedValue = correctInputLength(filterType, value)

        setUnappliedFilters(prev => ({
          ...prev,
          [filterType]: processedValue
        }));
    };

    const validateApply = (e) => {
        e.preventDefault()
        // Year range validation
        if ((unappliedFilters.minYear && unappliedFilters.maxYear) && unappliedFilters.minYear > unappliedFilters.maxYear) {
            alert("Invalid year range, minimum year must be lower than maximum year")
            return
        }

        setSelectedFilters(unappliedFilters)
        toggleFilters()
    }

    const correctInputLength = (filterType, value) => {
        let processedValue = value

        if (filterType === "minYear" || filterType === "maxYear") {
            if (processedValue.length <= 4) return value
            processedValue = processedValue.replace(/[^0-9]/g, '')
            processedValue = processedValue.substring(0, processedValue.length - 1)
            return processedValue
        } else return value
    }

    return (
        <div className={styles["filters-panel"]}>
            <div className={styles["filter-section"]}>
                <div className={styles["filter-subsection"]}>
                    <h4 className={styles["filter-title"]}>Genres</h4>
                    <GenresFilter 
                        onModify={handleGenreFilter}
                        placeholder={"Select genres"}
                        startingIncludedGenresId = {selectedFilters.includedGenres}
                        startingExcludedGenresId = {selectedFilters.excludedGenres}
                    />
                </div>
            </div>

            <div className={styles["filter-section"]}>
                <div className={styles["filter-subsection"]}> 
                    <h4 className={styles["filter-title"]}>Country</h4>
                    <CountryFilter
                        startingCountryId={selectedFilters.country}
                        onSelection={(country) => setUnappliedFilters(prev => ({...prev, ["country"]: country.id}))
                    }
                    />
                </div>
                <div className={styles["filter-subsection"]}> 
                    <h4 className={styles["filter-title"]} style={{textAlign: "right"}}>Seen By</h4>
                    <div className={styles["seen-by-list"]}> 
                        {petits
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(petit => (
                            <span 
                                key={petit.id} 
                                className={styles["petit-tag"] + " " + (unappliedFilters.seenBy.includes(petit.id) ? styles["petit-selected"] : styles["petit-unselected"])}
                                data-testid={"filter-" + petit.name}
                                onClick={() => {     
                                    setUnappliedFilters(prev => ({...prev, ["seenBy"]: prev.seenBy.filter(pId => pId !== 'any') }))   
                                    unappliedFilters.seenBy.includes(petit.id) ? 
                                        setUnappliedFilters(prev => ({...prev, ["seenBy"]: prev.seenBy.filter(pId => pId !== petit.id) })) :
                                        setUnappliedFilters(prev => ({...prev, ["seenBy"]: prev.seenBy.concat(petit.id) }))
                                    }}
                            >
                                    {petit.name}
                            </span>
                        ))}
                        <span 
                            className={styles["petit-any-tag"] + " " + (unappliedFilters.seenBy.includes('any') ? styles["petit-selected"] : styles["petit-unselected"])}
                            onClick={() => {        
                                setUnappliedFilters(prev => ({...prev, ["seenBy"]: ['any'] }))
                            }}
                        >
                            Any
                        </span>
                    </div>
                </div>
            </div>
            

            <div className={styles["filter-section"]}>
                <div className={styles["filter-subsection"]} style={{width: "100%"}}>
                    <h4 className={styles["filter-title"]}>Year</h4>
                    <div className={styles["year-range-container"]}>
                        <input
                            type="number"
                            placeholder="Min"
                            className={styles["year-input"]}
                            value={unappliedFilters.minYear}
                            onChange={(e) => handleFilterChange('minYear', e.target.value)}
                        />
                        <span className={styles["year-separator"]}>-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            className={styles["year-input"]}
                            value={unappliedFilters.maxYear}
                            onChange={(e) => handleFilterChange('maxYear', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className={styles["filter-submit"]}>
                <button 
                    type="submit"
                    data-testid="submit_filters"
                    onClick={(e) => validateApply(e)}>
                    Apply
                </button>
            </div>           
        </div>
    )
}
Filters.propTypes = {
    toggleFilters: PropTypes.func.isRequired,
    selectedFilters: PropTypes.object.isRequired,
    setSelectedFilters: PropTypes.func.isRequired
}

export default Filters
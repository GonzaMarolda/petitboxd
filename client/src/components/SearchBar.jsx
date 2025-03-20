import styles from './SearchBar.module.css'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Filters from './filters/Filters'

const SearchBar = ({ searchQuery, setSearchQuery, selectedFilters, setSelectedFilters }) => {
    const [showFilters, setShowFilters] = useState(false);
  
    const toggleFilters = () => setShowFilters(!showFilters);

    return (
        <div className={styles["search-filter-container"]}>
            <div className={styles["searchBar-container"]}>
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search a movie..."
                    className={styles["search-input"]}
                    data-testid="search-input"
                />
                <button 
                    className={styles["filter-button"] + " " + (showFilters ? styles["active"] : "")}
                    onClick={toggleFilters}
                >
                <svg className={styles["filter-icon"]} viewBox="0 0 24 24" data-testid="filters-button">
                    <path d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
                </button>
            </div>

            {showFilters && 
                <Filters
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    toggleFilters={toggleFilters}
                />}
        </div>
    )
}
SearchBar.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
    selectedFilters: PropTypes.object.isRequired,
    setSelectedFilters: PropTypes.func.isRequired
}

export default SearchBar
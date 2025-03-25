import styles from './SearchBar.module.css'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Filters from './filters/Filters'
import { API_BASE_URL } from '../config'
import Sort from './Sort'

const SearchBar = ({ searchQuery, setSearchQuery, selectedFilters, setSelectedFilters, selectedSort, setSelectedSort }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [showSorting, setShowSorting] = useState(false)
  
    const toggleFilters = () => setShowFilters(!showFilters);

    return (
        <div className={styles["search-filter-container"]}>
            <div className={styles["searchBar-container"]}>
                <div className={styles["sort-container"]}>
                    <button 
                        className={styles["sort-button"] + " " + (showSorting ? styles["active"] : "")}
                        onClick={() => setShowSorting(!showSorting)}
                    >
                        <img 
                            src={API_BASE_URL + "/uploads/sort-icon.png"} 
                            alt="sort" 
                            width="20px"
                            height="20px"
                        />
                    </button>
                    {showSorting && (
                        <Sort
                            selectedSort={selectedSort}
                            setSelectedSort={setSelectedSort}
                            toggleSort={() => setShowSorting(false)}
                        />
                    )}
                </div>
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
    setSelectedFilters: PropTypes.func.isRequired,
    selectedSort: PropTypes.object.isRequired,
    setSelectedSort: PropTypes.func.isRequired
}

export default SearchBar
import './SearchBar.css'
import React from 'react'
import PropTypes from 'prop-types'

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="searchBar-container">
            <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search a movie..."
                className="search-input"
            />
            <button 
                className="filter-button" 
                disabled
            >
            <svg className="filter-icon" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            </button>
        </div>
    )
}
SearchBar.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    setSearchQuery: PropTypes.func.isRequired
}

export default SearchBar
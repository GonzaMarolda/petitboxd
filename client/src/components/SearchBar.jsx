import styles from './SearchBar.module.css'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Filters from './filters/Filters'
import { API_BASE_URL } from '../config'
import Sort from './Sort'

const SearchBar = ({ searchQuery, setSearchQuery, selectedFilters, setSelectedFilters, selectedSort, setSelectedSort }) => {
    const [showFilters, setShowFilters] = useState(false)
    const [showSorting, setShowSorting] = useState(false)
    const [showPrioritized, setShowPrioritized] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
  
    const toggleFilters = () => {
        setShowFilters(!showFilters)
        setShowSorting(false)
    };

    const getButtonStyle = (styleName) => {
        if (showSuggestions) {
            return styles[styleName] + " " + styles["disabled"]
        } else {
            return styles[styleName] + " " + (showSorting ? styles["active"] : styles["hoverable"])
        }
    }

    return (
        <div className={styles["search-filter-container"]}>
            <div className={styles["searchBar-container"]}>
                <div className={styles["sort-container"]}>
                    <button
                        disabled={showSuggestions}
                        className={getButtonStyle("sort-button")}
                        onClick={() => {
                            setShowSorting(!showSorting)
                            setShowFilters(false)
                        }}
                        data-testid="sort-button"
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
                    disabled={showSuggestions}
                    className={getButtonStyle("filter-button")}
                    onClick={toggleFilters}
                >
                    <svg className={styles["filter-icon"]} viewBox="0 0 24 24" data-testid="filters-button">
                        <path d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>

            <div className={styles["extras-container"]}>
                <button 
                    className={styles["prioritized-button"] + " " + (showPrioritized ? styles["active"] : "")}
                    onClick={() => {
                        setShowPrioritized(prev => !prev)
                        setSelectedFilters(prev => ({...prev, showPrioritized: !prev.showPrioritized}))
                    }}
                >
                    <svg 
                        x="0px" 
                        y="0px" 
                        width="20px" 
                        height="20px" 
                        viewBox="0 0 122.879 122.867" 
                        fill='currentColor'
                    >
                        <g><path d="M83.88,0.451L122.427,39c0.603,0.601,0.603,1.585,0,2.188l-13.128,13.125 c-0.602,0.604-1.586,0.604-2.187,0l-3.732-3.73l-17.303,17.3c3.882,14.621,0.095,30.857-11.37,42.32 c-0.266,0.268-0.535,0.529-0.808,0.787c-1.004,0.955-0.843,0.949-1.813-0.021L47.597,86.48L0,122.867l36.399-47.584L11.874,50.76 c-0.978-0.98-0.896-0.826,0.066-1.837c0.24-0.251,0.485-0.503,0.734-0.753C24.137,36.707,40.376,32.917,54.996,36.8l17.301-17.3 l-3.733-3.732c-0.601-0.601-0.601-1.585,0-2.188L81.691,0.451C82.295-0.15,83.279-0.15,83.88,0.451L83.88,0.451z"/></g>
                    </svg>
                </button>

                <button 
                    className={styles["suggestions-button"] + " " + (showSuggestions ? styles["active"] : "")}
                    onClick={() => {
                        setShowSuggestions(prev => !prev)
                        setSelectedFilters(prev => ({...prev, showSuggestions: !prev.showSuggestions}))
                        setShowSorting(false)
                    }}
                >
                    Suggestions
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
import React, { useState, useEffect, useContext } from 'react'
import { filterMovies, filterSearchQuery } from './utils/movieFilters';
import { sortMovies } from './utils/movieSorting';

import {Movies} from './components/Movies'
import MovieService from './services/MovieService';
import AppHeader from './components/AppHeader';
import SearchBar from './components/SearchBar';
import PageSwitch from './components/PageSwitch';
import { UserContext } from './providers/UserProvider';
import { setToken } from './services/token';
import SuggestionService from './services/SuggestionService';
import Suggestions from './components/Suggestions';

const App = () => {
  const { setUser } = useContext(UserContext)
  const [movies, setMovies] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    includedGenres: [],
    excludedGenres: [],
    minYear: '',
    maxYear: '',
    country: '',
    seenBy: ['any'],
    showPrioritized: false,
    showSuggestions: false
  });
  const [selectedSort, setSelectedSort] = useState({type: "ASC", name: "Year"})
  const moviesPerPage = 12
  const [page, setPage] = useState(0)

  const sortedMovies = sortMovies(movies, selectedSort)
  const filteredSortedMovies = filterMovies(sortedMovies, searchQuery, selectedFilters)
  const filteredSuggestions = filterSearchQuery(suggestions, searchQuery)

  useEffect(() => {
    MovieService
      .getAll()
      .then(movies => {
        setMovies(movies);
    SuggestionService
        .getAll()
        .then(suggestions => {
          setSuggestions(suggestions)
        })

    const loggedPetitJSON = window.localStorage.getItem('loggedPetit')
    if (loggedPetitJSON) {
      const loggedPetit = JSON.parse(loggedPetitJSON)
      setToken(loggedPetit.token)
      setUser(loggedPetit.user)
    }
      })
  }, []);

  const handleSearchQuery = (searchQuery) => {
    setSearchQuery(searchQuery)
    setPage(0)
  }

  return (
    <>
      <AppHeader setMovies={setMovies} setSuggestions={setSuggestions}/>
      <div className="main-content">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={handleSearchQuery}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
        />
        {selectedFilters.showSuggestions ? (
          <Suggestions
            suggestions={filteredSuggestions}
            setMovies={setMovies}
            setSuggestions={setSuggestions}
          />
        ) : (
          <Movies 
            movies={filteredSortedMovies.slice(moviesPerPage*page, moviesPerPage*page + moviesPerPage)} 
            setMovies={setMovies}
          />
        )}
        <PageSwitch
          page={page}
          setPage={setPage}
          totalPages={
            selectedFilters.showSuggestions ? 
            Math.ceil(filteredSuggestions.length / moviesPerPage) :
            Math.ceil(filteredSortedMovies.length / moviesPerPage)
          }
        />
      </div>
    </>
  )
}

export default App
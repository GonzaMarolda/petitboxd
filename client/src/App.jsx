import React, { useState, useEffect, useContext } from 'react'
import { filterMovies } from './utils/movieFilters';
import { sortMovies } from './utils/movieSorting';

import {Movies} from './components/Movies'
import MovieService from './services/MovieService';
import AppHeader from './components/AppHeader';
import SearchBar from './components/SearchBar';
import PageSwitch from './components/PageSwitch';
import { UserContext } from './providers/UserProvider';
import { setToken } from './services/token';

const App = () => {
  const { setUser } = useContext(UserContext)
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    includedGenres: [],
    excludedGenres: [],
    minYear: '',
    maxYear: '',
    country: '',
    seenBy: ['any']
  });
  const [selectedSort, setSelectedSort] = useState({type: "ASC", name: "Year"})
  const moviesPerPage = 12
  const [page, setPage] = useState(0)

  const sortedMovies = sortMovies(movies, selectedSort)
  const filteredSortedMovies = filterMovies(sortedMovies, searchQuery, selectedFilters)

  useEffect(() => {
    MovieService
      .getAll()
      .then(movies => {
        setMovies(movies);
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
      <AppHeader setMovies={setMovies}/>
      <div className="main-content">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={handleSearchQuery}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
        />
        <Movies 
          movies={filteredSortedMovies.slice(moviesPerPage*page, moviesPerPage*page + moviesPerPage)} 
          setMovies={setMovies}
        />
        <PageSwitch
          page={page}
          setPage={setPage}
          totalPages={Math.ceil(filteredSortedMovies.length / moviesPerPage)}
        />
      </div>
    </>
  )
}

export default App
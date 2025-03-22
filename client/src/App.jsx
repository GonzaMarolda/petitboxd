import React, { useState, useEffect, useContext } from 'react'
import { filterMovies } from './utils/movieFilters';

import {Movies} from './components/Movies'
import MovieService from './services/MovieService';
import AppHeader from './components/AppHeader';
import SearchBar from './components/SearchBar';
import PageSwitch from './components/PageSwitch';
import { UserContext } from './providers/UserProvider';

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
  const moviesPerPage = 8
  const [page, setPage] = useState(0)

  const filteredMovies = filterMovies(movies, searchQuery, selectedFilters)

  useEffect(() => {
    MovieService
      .getAll()
      .then(movies => {
        setMovies(movies);
    const loggedPetitJSON = window.localStorage.getItem('loggedPetit')
    if (loggedPetitJSON) {
      const loggedPetit = JSON.parse(loggedPetitJSON)
      MovieService.setToken(loggedPetit.token)
      setUser(loggedPetit.user)
    }
      })
  }, []);

  return (
    <>
      <AppHeader setMovies={setMovies}/>
      <div className="main-content">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
        <Movies movies={filteredMovies.slice(moviesPerPage*page, moviesPerPage*page + moviesPerPage)} setMovies={setMovies}/>
        <PageSwitch
          page={page}
          setPage={setPage}
          totalPages={Math.ceil(filteredMovies.length / moviesPerPage)}
        />
      </div>
    </>
  )
}

export default App
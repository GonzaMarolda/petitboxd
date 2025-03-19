import React, { useState, useEffect } from 'react'
import { filterMovies } from './utils/movieFilters';

import {Movies} from './components/Movies'
import MovieService from './services/MovieService';
import AppHeader from './components/AppHeader';
import SearchBar from './components/SearchBar';
import { API_BASE_URL } from './config';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    includedGenres: [],
    excludedGenres: [],
    minYear: '',
    maxYear: '',
    country: ''
  });

  console.log("Env: " + import.meta.env.VITE_LOCAL_URL)
  console.log("URL: " + API_BASE_URL)

  const filteredMovies = filterMovies(movies, searchQuery, selectedFilters)

  useEffect(() => {
    MovieService
      .getAll()
      .then(movies => {
        setMovies(movies);
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
        <Movies movies={filteredMovies}/>
      </div>
    </>
  )
}

export default App
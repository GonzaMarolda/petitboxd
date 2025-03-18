import React, { useState, useEffect } from 'react'
import { filterMovies } from './utils/movieFilters';

import {Movies} from './components/Movies'
import MovieService from './services/MovieService';
import AppHeader from './components/AppHeader';
import SearchBar from './components/SearchBar';

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
import React, { useState, useEffect } from 'react'

import Movies from './components/Movies'
import MovieService from './services/MovieService';
import AppHeader from './components/AppHeader';
import SearchBar from './components/SearchBar';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    MovieService
      .getAll()
      .then(movies => {
        setMovies(movies);
      })
  }, []);

  return (
    <>
      <AppHeader/>
      <div className="main-content">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
        <Movies movies={filteredMovies}/>
      </div>
    </>
  )
}

export default App
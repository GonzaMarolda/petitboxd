import './Movies.css'
import React from 'react'
import PropTypes from 'prop-types'

const Movies = ({movies}) => {
    return (
        <div className="movies-container">
            {movies.map(movie => <MovieCard key={movie.id} movie={movie}/>)}
        </div> 
    )
}
Movies.propTypes = {
  movies: PropTypes.array.isRequired
}

const MovieCard = ({movie}) => {
    return (
        <div className="movie-card">
          <img 
            src={"posters/" + movie.poster} 
            alt={movie.title + " poster"} 
            className="movie-poster"
          />

          <header className="movie-header">
            <h3 className="movie-title">
              {movie.title}
              <span className="movie-year"> ({movie.year})</span>
              <Flag name={movie.country.name}/>
            </h3>
          </header>

          <div className="movie-details">
            <div className="detail-row">
              <span className="detail-label">Director:</span>
              <span className="detail-value">{movie.director}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Length:</span>
              <span className="detail-value">{minsToStringHours(movie.length)}</span>
            </div>
          </div>

          <div className="genres-container">
            <h4 className="section-title">Genres</h4>
            <ul className="genres-list">
              {movie.genres.map(genre => (
                <Genre key={genre.id} name={genre.name} />
              ))}
            </ul>
          </div>

          <div className="seen-by-container">
            <h4 className="section-title">Seen by</h4>
            <div className="seen-by-list">
              {[...movie.seenBy]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(petit => (
                  <Petit key={petit.id} name={petit.name} />
                ))}
            </div>
          </div>
        </div>
      )
}
MovieCard.propTypes = {
  movie: PropTypes.object.isRequired
}

const Genre = ({name}) => {
  return (
    <li className="genre-item">
      {name} 
    </li>
  ) 
}
Genre.propTypes = {
  name: PropTypes.string.isRequired
}

const Petit = ({name}) => {
  return (
    <span className="petit-user">
      {name}
    </span>
  )
}
Petit.propTypes = {
  name: PropTypes.string.isRequired
}

const Flag = ({name}) => {
  const convertName = (name) => {
    return name
      .toLowerCase()    
      .replace(/\s+/g, '-') 
  };

  return (
    <img 
      src={"flags/" + convertName(name) + ".png"}
      alt={name + " flag"} 
      className="flag-icon"
    />
  )
}
Flag.propTypes = {
  name: PropTypes.string.isRequired
}

const minsToStringHours = (mins) => {
  const hoursString = Math.floor(mins/60).toString() + "h"
  const minsString = Math.ceil((mins/60 - Math.floor(mins/60))*60) + "m"
  return hoursString + " " + minsString
}

export default Movies
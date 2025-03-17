import './Movies.css'
import React, { useState } from 'react'
import PropTypes from 'prop-types'

export const Movies = ({movies}) => {
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

          <MovieImage 
            src={movie.poster}
            alt={movie.title + " poster"}
            className={"movie-poster"}
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
  const [isMissing, setIsMissing] = useState(false);

  const convertName = (name = "missing") => {
    return name
      .toLowerCase()    
      .replace(/\s+/g, '-') 
  };

  const convertedName = isMissing ? "missing" : convertName(name)

  return (
    <img 
      src={"http://localhost:3001/uploads/flags/" + convertedName + ".png"}
      alt={name + " flag"} 
      onError={() => {setIsMissing(true)}}
      className="flag-icon"
    />
  )
}
Flag.propTypes = {
  name: PropTypes.string.isRequired
}

export const MovieImage = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState(src)

  return (
    <img 
      src={"http://localhost:3001/uploads/posters/" + imageSrc}
      alt={alt}
      onError={() => {setImageSrc("missing.jpg")}}
      className={className}
    />
  )
}
MovieImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string
}

const minsToStringHours = (mins) => {
  const hoursString = Math.floor(mins/60).toString() + "h"
  const minsString = Math.ceil((mins/60 - Math.floor(mins/60))*60) + "m"
  return hoursString + " " + minsString
}
import styles from './Movies.module.css'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { POSTERS_BASE_PATH } from '../config'

export const Movies = ({movies}) => {
    return (
        <div className={styles["movies-container"]}>
            {movies.map(movie => <MovieCard key={movie.id} movie={movie}/>)}
        </div> 
    )
}
Movies.propTypes = {
  movies: PropTypes.array.isRequired
}

const MovieCard = ({movie}) => {
    return (
        <div className={styles["movie-card"]}>
          
          <MovieImage 
            src={movie.poster}
            alt={movie.title + " poster"}
            className={styles["movie-poster"]}
          />

          <header className={styles["movie-header"]}>
            <h3 className={styles["movie-title"]}>
              {movie.title}
              <span className={styles["movie-year"]}> ({movie.year})</span>
              <Flag name={movie.country?.name}/>
            </h3>
          </header>

          <div className={styles["movie-details"]}>
            <div className={styles["detail-row"]}>
              <span className={styles["detail-label"]}>Director:</span>
              <span className={styles["detail-value"]}>{movie.director}</span>
            </div>

            <div className={styles["detail-row"]}>
              <span className={styles["detail-label"]}>Length:</span>
              <span className={styles["detail-value"]}>{minsToStringHours(movie.length)}</span>
            </div>
          </div>

          <div className={styles["genres-container"]}>
            <h4 className={styles["section-title"]}>Genres</h4>
            <ul className={styles["genres-list"]}>
              {movie.genres.map(genre => (
                <Genre key={genre.id} name={genre.name} />
              ))}
            </ul>
          </div>

          <div className={styles["seen-by-container"]}>
            <h4 className={styles["section-title"]}>Seen by</h4>
            <div className={styles["seen-by-list"]}>
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
    <li className={styles["genre-item"]}>
      {name} 
    </li>
  ) 
}
Genre.propTypes = {
  name: PropTypes.string.isRequired
}

const Petit = ({name}) => {
  return (
    <span className={styles["petit-user"]}>
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
      src={POSTERS_BASE_PATH + convertedName + ".png"}
      alt={name + " flag"} 
      onError={() => {setIsMissing(true)}}
      className={styles["flag-icon"]}
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
      src={POSTERS_BASE_PATH + imageSrc}
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
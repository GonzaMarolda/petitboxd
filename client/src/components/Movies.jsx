import styles from './Movies.module.css'
import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { POSTERS_BASE_PATH, API_BASE_URL } from '../config'
import MovieForm from './forms/MovieForm'
import Modal from './Modal'
import MovieService from '../services/MovieService'
import { UserContext } from '../providers/UserProvider'

export const Movies = ({movies, setMovies}) => {
	const [clickedMovieId, setClickedMovieId] = useState('')

	const onClick = (movieId, isOpen) => {
		if (!isOpen) setClickedMovieId('')
		else setClickedMovieId(movieId)
	}

	if (movies.length === 0) {
		return (
			<div className={styles.noResultsContainer}>
					<div className={styles.noResultsContent}>
							<h3 className={styles.noResultsTitle}>No movies found</h3>
							<p className={styles.noResultsMessage}>
									Try adjusting your search or filters to find what you&apos;re looking for.
							</p>
					</div>
			</div>
		)
	}


	return (
			<div className={styles["movies-container"]}>
					{movies.map(movie => 
						<MovieCard 
							key={movie.id} 
							movie={movie} 
							setMovies={setMovies}
							clickedMovieId={clickedMovieId} 
							onClick={onClick}
						/>)}
			</div> 
	)
}
Movies.propTypes = {
  movies: PropTypes.array.isRequired,
  setMovies: PropTypes.func.isRequired
}

const MovieCard = ({movie, setMovies, clickedMovieId, onClick}) => {
	const { user } = useContext(UserContext)
	const clicked = movie.id === clickedMovieId
	const [editOpen, setEditOpen] = useState(false)
	const handleEdit = (formData) => {
		const editedMovie = {
			...formData,
			length: Number(formData.hours*60) + Number(formData.minutes),
			country: formData.country !== "" ? formData.country : null,
		}

		MovieService
			.update(movie.id, editedMovie)
			.then(updatedMovie => {
				console.log("Updated movie: " + JSON.stringify(updatedMovie))
				setMovies((prevState) => prevState.map(m => m.id === updatedMovie.id ? updatedMovie : m))
			})
	}
	const seeetEditOpen = (daBool) => {
		console.log(daBool)
		setEditOpen(false)
	}

	return (
		<div 
			className={styles["movie-card"] + " " + (clicked || !user ? "" : styles["hoverable"])} 
			onClick={() => {if (!clicked && user) onClick(movie.id, true)}} 
			style={clicked || !user ? {cursor: "auto"} : {cursor: "pointer"}}
			data-testid={"card_" + movie.title}
		>
			<div className={styles["movie-config-container"]} style={clicked ? {visibility: "visible"} : {visibility: "hidden"}}>
					<div className={styles["config-button"]} onClick={() => {if (!editOpen) setEditOpen(true)}}>
						<img 
							className={styles["edit-button"]}
							src={API_BASE_URL + "/uploads/edit.png"} 
							alt="edit-image" 
							data-testid="button_edit"
						/>
						{editOpen &&
						(
							<Modal>
								<MovieForm
									handleAddMovie={handleEdit}
									setShowModal={seeetEditOpen}
									initialFormData={{
										...movie,
										hours: Math.floor(movie.length / 60),
										minutes: movie.length - Math.floor(movie.length / 60)*60,
										seenBy: movie.seenBy.map(p => p.id)
									}}
								/>
							</Modal>
						)}
					</div>

					<div 	className={styles["config-button"]}>
						<img 
							className={styles["star-button"]}
							src={API_BASE_URL + "/uploads/star.webp"} 
							alt="edit-image" 
						/>
					</div>

					<div className={styles["config-button"]} onClick={() => onClick(movie.id, false)}>
						<img 
							className={styles["close-button"]}
							src={API_BASE_URL + "/uploads/close.png"} 
							alt="edit-image" 
						/>
					</div>
			</div>

			<MovieImage 
				src={movie.poster}
				alt={movie.title + " poster"}
				className={styles["movie-poster"]}
			/>

			<header className={styles["movie-header"]}>
				<h3 className={styles["movie-title"]} data-testid="movie-title">
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
  	movie: PropTypes.object.isRequired,
	setMovies: PropTypes.func.isRequired,
	clickedMovieId: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired
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
      src={API_BASE_URL + "/uploads/flags/" + convertedName + ".png"}
      alt={name + " flag"} 
      onError={() => {setIsMissing(true)}}
      className={styles["flag-icon"]}
	  data-testid={name}
    />
  )
}
Flag.propTypes = {
  name: PropTypes.string.isRequired
}

export const MovieImage = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState(src)

  if (imageSrc === "missing.jpg") {
    return (
        <div 
            className={className}
            style={{background: "#181d28", display: "flex", justifyContent: "center", alignItems: "center"}}
        >
            <img 
                src={POSTERS_BASE_PATH + imageSrc} 
                alt={alt}
                className={styles["missing-image"]}
            />
        </div>
    )
  }

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
  const minsString = (mins - Math.floor(mins / 60)*60).toString() + "m"
  return hoursString + " " + minsString
}
import styles from './Movies.module.css'
import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { POSTERS_BASE_PATH, API_BASE_URL } from '../config'
import MovieForm from './forms/MovieForm'
import Rating from './rating/Rating'
import Modal from './Modal'
import MovieService from '../services/MovieService'
import { UserContext } from '../providers/UserProvider'

export const Movies = ({movies, setMovies}) => {
	const [clickedMovieId, setClickedMovieId] = useState('')

	const onClick = (movieId) => {
		if (clickedMovieId === movieId) setClickedMovieId('')
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
	const [priorityUpdating, setPriorityUpdating] = useState(false)
	const [ratingOpen, setRatingOpen] = useState(false)
	const [onDeleteConfirmation, setOnDeleteConfirmation] = useState(false)
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

	return (
		<div 
			className={styles["movie-card"] + " " + (clicked ? "" : styles["hoverable"])} 
			onClick={() => {
					if (clicked) return
					onClick(movie.id)
					setOnDeleteConfirmation(false)
				}} 
			style={{cursor: "pointer"}}
			data-testid={"card_" + movie.title}
		>
			<div 
				className={styles["movie-config-container"] + " " + (!user ? styles["non-user"] : "")} 
				onClick={(e) => {
					if (e.target === e.currentTarget) {
						onClick(movie.id);
					}
				}} 
				style={clicked ? {visibility: "visible"} : {visibility: "hidden"}}
			>
				<div className={styles["config-button"]} onClick={() => {if (!ratingOpen) setRatingOpen(true)}}>
					<img 
						className={styles["star-button"]}
						src={API_BASE_URL + "/uploads/star.webp"} 
						alt="edit-image" 
						data-testId="rating-button"
					/>
					{ratingOpen &&
					(
						<Modal>
							<Rating
								movie={movie}
								onClose={() => setRatingOpen(false)}
							/>
						</Modal>
					)}
				</div>

				{user && (
					<div 
						className={
							styles["config-button"] + " " +
							(priorityUpdating ? styles["loading"] : "") 
						} 
						onClick={() => {
							if (priorityUpdating) return
							setPriorityUpdating(true)
							MovieService.updatePriority(movie.id, !movie.hasPriority)
								.then(() => {
									setMovies(prev => prev.map(m => m.id === movie.id ? {...movie, hasPriority: !movie.hasPriority} : m))
									setPriorityUpdating(false)
								})
								.catch((error) => {
									console.error("Couldn't change movie priority: " + error)
									setPriorityUpdating(false)
								})
						}}
					>
						<svg 
							x="0px" 
							y="0px" 
							width="35px" 
							height="35px" 
							viewBox="0 0 122.879 122.867" 
							className={
								styles["pin-button"] + " " +
								(movie.hasPriority ? styles["pinned"] : "")
							}
							fill='currentColor'
						>
							<g><path d="M83.88,0.451L122.427,39c0.603,0.601,0.603,1.585,0,2.188l-13.128,13.125 c-0.602,0.604-1.586,0.604-2.187,0l-3.732-3.73l-17.303,17.3c3.882,14.621,0.095,30.857-11.37,42.32 c-0.266,0.268-0.535,0.529-0.808,0.787c-1.004,0.955-0.843,0.949-1.813-0.021L47.597,86.48L0,122.867l36.399-47.584L11.874,50.76 c-0.978-0.98-0.896-0.826,0.066-1.837c0.24-0.251,0.485-0.503,0.734-0.753C24.137,36.707,40.376,32.917,54.996,36.8l17.301-17.3 l-3.733-3.732c-0.601-0.601-0.601-1.585,0-2.188L81.691,0.451C82.295-0.15,83.279-0.15,83.88,0.451L83.88,0.451z"/></g>
						</svg>
					</div>
				)}	

				{user && (
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
									setShowModal={() => setEditOpen(false)}
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
				)}

				{user &&
					<div 
						className={styles["config-button"]} 
						onClick={() => {
							if (!onDeleteConfirmation) {
								setOnDeleteConfirmation(true)
							} else {
								MovieService.remove(movie.id)
									.then(() => {
										onClick(movie.id)
										setOnDeleteConfirmation(false)
										setMovies(prev => prev.filter(m => m.id !== movie.id))
									}
								)
							}
						}}
					>
						{onDeleteConfirmation ? (
							<svg width="36" height="36" viewBox="0 0 36 36" className={styles["confirm-delete-button"]} fill="currentColor" >
								<path d="M34.459 1.375a2.999 2.999 0 0 0-4.149.884L13.5 28.17l-8.198-7.58a2.999 2.999 0 1 0-4.073 4.405l10.764 9.952s.309.266.452.359a2.999 2.999 0 0 0 4.15-.884L35.343 5.524a2.999 2.999 0 0 0-.884-4.149z"/>
							</svg>
						) : (
							<svg className={styles["delete-button"]} fill="currentColor" width="36px" height="36px" viewBox="0 0 41.336 41.336">
								<g>
									<path d="M36.335,5.668h-8.167V1.5c0-0.828-0.672-1.5-1.5-1.5h-12c-0.828,0-1.5,0.672-1.5,1.5v4.168H5.001c-1.104,0-2,0.896-2,2   s0.896,2,2,2h2.001v29.168c0,1.381,1.119,2.5,2.5,2.5h22.332c1.381,0,2.5-1.119,2.5-2.5V9.668h2.001c1.104,0,2-0.896,2-2   S37.438,5.668,36.335,5.668z M14.168,35.67c0,0.828-0.672,1.5-1.5,1.5s-1.5-0.672-1.5-1.5v-21c0-0.828,0.672-1.5,1.5-1.5   s1.5,0.672,1.5,1.5V35.67z M22.168,35.67c0,0.828-0.672,1.5-1.5,1.5s-1.5-0.672-1.5-1.5v-21c0-0.828,0.672-1.5,1.5-1.5   s1.5,0.672,1.5,1.5V35.67z M25.168,5.668h-9V3h9V5.668z M30.168,35.67c0,0.828-0.672,1.5-1.5,1.5s-1.5-0.672-1.5-1.5v-21   c0-0.828,0.672-1.5,1.5-1.5s1.5,0.672,1.5,1.5V35.67z"/>
								</g>
							</svg>
						)}
					</div>
				}
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

  useEffect(() => {
	if (!src) setImageSrc("missing.jpg")
  }, [])

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
      src={imageSrc}
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
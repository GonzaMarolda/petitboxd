import React, { useContext, useEffect, useState } from "react"
import PropTypes from "prop-types";
import styles from "./Rating.module.css"
import AverageRating from "./AverageRating";
import StarsInput from "./StarsInput";
import Review from "./Review";
import RatingService from "../../services/RatingService";
import { UserContext } from "../../providers/UserProvider";

const Rating = ({ movie, onClose }) => {
  const [petitRating, setPetitRating] = useState(0.5)
  const [comment, setComment] = useState('')
  const [movieRating, setMovieRating] = useState({})
  const [average, setAverage] = useState(0)
  const { user } = useContext(UserContext)
  
  useEffect(()=>{
    RatingService.get(movie.id)
      .then(rating => {
        setMovieRating(rating)
        setAverage(calculateAverage(rating.reviews))
        
        if (user && rating.reviews.map(r => r.petit.id).includes(user.id)) {
          const petitReview = rating.reviews.find(r => r.petit.id === user.id)
          setPetitRating(petitReview.rating)
          setComment(petitReview.comment)
        }
      })
  }, [])

  const handleReviewSubmit = (review) => {
    RatingService.update(movie.id, review)
      .then(updatedRating => {
        console.log("Updated rating: " + JSON.stringify(updatedRating))
        setMovieRating(updatedRating)
        setAverage(calculateAverage(updatedRating.reviews))
      })
  }

  const handleReviewDelete = () => {
    RatingService.remove(movie.id)
      .then((updatedRating) => {
        console.log("Review deleted")
        setMovieRating(updatedRating)
        setAverage(calculateAverage(updatedRating.reviews))
      })
  }

  const calculateAverage = (reviews) => {
    if (reviews.length === 0) return 0
    return reviews.map(r => r.rating).reduce((acc, c) => acc + c, 0) / reviews.length;
  }

  return (
    <div className={styles["rating-modal"]}>
      <button className={styles["close-btn"]} onClick={() => onClose()}>×</button>
      
      <div className={styles["rating-header"]}>
        <h2>{movie.title}</h2>
        {average === 0 ? (
          <div className={styles["no-rating"]} data-testId="no-ratings-message">
            No one has rated this movie yet 
          </div>
        ) : (
          <AverageRating
            average={average}
          />
        )}
      </div>

      <div className={styles["rating-content"]}>
        {user && (
          <div className={styles["rating-form"]}>
              <h3>Your rating</h3>
              <StarsInput
                selectedStars={petitRating}
                setSelectedStars={setPetitRating}
              />
              <textarea
              className={styles["comment-input"]}
              placeholder="Add a review (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              data-testId="comment-input"
              />
              {movieRating.reviews?.map(r => r.petit.id).includes(user.id) ? (
                <div className={styles["buttons-container"]}>
                  <button 
                    className={styles["submit-btn"]}
                    onClick={() => {
                      const reviewToSubmit = { 
                        rating: petitRating, 
                        comment,
                        petit: user.id
                      }
                      handleReviewSubmit(reviewToSubmit)
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className={styles["submit-btn"]}
                    style={{background: "#fe4d4d"}}
                    onClick={() => handleReviewDelete()}
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <button 
                  className={styles["submit-btn"]}
                  onClick={() => {
                    const reviewToSubmit = { 
                      rating: petitRating, 
                      comment,
                      petit: user.id
                    }
                    handleReviewSubmit(reviewToSubmit)
                  }}
                >
                  Submit
                </button>
              )}
          </div>
        )}

          <div className={styles["reviews-section"]}>
              <h3 className={styles["reviews-title"]}>
                  Reviews
              </h3>
              {movieRating.reviews && movieRating.reviews.length !== 0 ? (
                movieRating.reviews.map((review, index) => (
                  <Review 
                      key={index} 
                      review={review}
                  />
                ))
              ) : (
                <div className={styles["no-reviews"]} data-testId="no-reviews-message">
                  No reviews to show
                </div>
              )}
          </div>
      </div>
    </div>
  )
}
  
Rating.propTypes = {
    movie: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
}

export default Rating
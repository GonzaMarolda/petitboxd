import React from "react"
import PropTypes from "prop-types"
import styles from "./Review.module.css"

const Review = ({review}) => {
    const getStarWitdthMult = (rating, i) => {
        const remain = Math.max(0, rating - i)
        if (remain === 0) return 0
    
        if (remain >= 0.75) return 1
        
        return remain > 0.25 ? 0.5 : 0
    }

    return (
        <div className={styles["review-card"]}>
            <div className={styles["review-header"]}>
                <span className={styles["user"]}>{review.petit.name}</span>
                <div className={styles["review-stars"]}>
                    {[...Array(5)].map((_, i) => (
                        <span key={i}>
                            <svg width="10" height="10" viewBox="0 0 24 24">
                                <path 
                                    d="M12 0l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 16l-6.18 3.02L7 12.14 2 7.27l6.91-1.01L12 0z"
                                    fill="#ddd"
                                />
    
                                <clipPath id={"review-" + review.user + "-star-" + i.toString()}>
                                    <rect 
                                    x="0" 
                                    y="0" 
                                    width={24 * getStarWitdthMult(review.rating, i)}
                                    height="24"
                                    />
                                </clipPath>
    
                                <path 
                                    d="M12 0l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 16l-6.18 3.02L7 12.14 2 7.27l6.91-1.01L12 0z"
                                    fill="#ffd700"
                                    clipPath={"url(#review-" + review.user + "-star-" +  i.toString() + ")"}
                                />
                            </svg>
                        </span>
                    ))}
                </div>
            </div>
            <p className={styles["review-text"]}>{review.comment}</p>
            <span className={styles["review-date"]}>{review.date}</span>
        </div>
    )
}
Review.propTypes = {
    review: PropTypes.object.isRequired
}

export default Review
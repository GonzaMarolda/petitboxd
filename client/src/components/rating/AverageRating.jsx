import React from "react"
import styles from "./AverageRating.module.css"
import PropTypes from "prop-types"

const AverageRating = ( {average} ) => {
    const getStarWitdthMult = (rating, i) => {
        const remain = Math.max(0, rating - i)
        if (remain === 0) return 0
    
        if (remain >= 0.75) return 1
        
        return remain > 0.25 ? 0.5 : 0
    }

    return (
        <div className={styles["average-rating"]}>
            <div>
                {[...Array(5)].map((_, i) => (
                <span key={i}>
                    <svg width="26" height="26" viewBox="0 0 24 24">
                        <path 
                            d="M12 0l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 16l-6.18 3.02L7 12.14 2 7.27l6.91-1.01L12 0z"
                            fill="#ddd"
                        />

                        <clipPath id={i.toString()}>
                            <rect 
                            x="0" 
                            y="0" 
                            width={24 * getStarWitdthMult(average, i)}
                            height="24"
                            />
                        </clipPath>

                        <path 
                        d="M12 0l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 16l-6.18 3.02L7 12.14 2 7.27l6.91-1.01L12 0z"
                        fill="#ffd700"
                        clipPath={"url(#" + i.toString() + ")"}
                        />
                    </svg>
                </span>
                ))}
            </div>
            <div 
                className={styles["rating-text"]}>{average} / 5
            </div>
        </div>
    )
}
AverageRating.propTypes = {
    average: PropTypes.number.isRequired
}

export default AverageRating
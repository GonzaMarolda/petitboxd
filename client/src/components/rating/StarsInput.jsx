import React, { useState } from "react"
import PropTypes from "prop-types"
import styles from "./StarsInput.module.css"

const StarsInput = ({selectedStars, setSelectedStars}) => {
    const [preSelectedStars, setPreSelectedStars] = useState(null)
    const starSize = 22

    const getStarWidth = (i) => {
        if (preSelectedStars !== null) {
            if (preSelectedStars >= i + 1) return starSize
            else if (preSelectedStars >= i + 0.5) return starSize / 2
            else return 0
        }

        if (selectedStars >= i + 1) return starSize
        else if (selectedStars >= i + 0.5) return starSize / 2
        else return 0
    }

    const calculateStars = (e, i) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const isLeftHalf = clickX < rect.width / 2;
        return isLeftHalf ? i + 0.5 : i + 1
    }

    return (
        <div className={styles["stars-container"]}>
        {[...Array(5)].map((_, i) => (
            <span key={i} className={styles["star-wrapper"]} data-testId={"review-form-star-" + i}>
                <svg 
                    width={starSize} 
                    height={starSize}
                    viewBox="0 0 24 24"
                    onMouseMove={(e) => setPreSelectedStars(calculateStars(e, i))}
                    onMouseLeave={() => setPreSelectedStars(null)}
                    onClick={(e) => {
                        const value = calculateStars(e, i)
                        setSelectedStars(value);
                      }}
                >
                    <path 
                        d="M12 0l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 16l-6.18 3.02L7 12.14 2 7.27l6.91-1.01L12 0z"
                        fill="#ddd"
                    />

                    <clipPath id={"starInput-" + i.toString()}>
                        <rect 
                        x="0" 
                        y="0" 
                        width={getStarWidth(i)}
                        height={starSize}
                        />
                    </clipPath>
                    <path 
                        d="M12 0l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 16l-6.18 3.02L7 12.14 2 7.27l6.91-1.01L12 0z"
                        fill="#ffd700"
                        clipPath={"url(#starInput-" + i.toString() + ")"}
                    />
                </svg>
            </span>   
        ))}     
    </div>
    )
}
StarsInput.propTypes = {
    selectedStars: PropTypes.number.isRequired,
    setSelectedStars: PropTypes.func.isRequired
}

export default StarsInput
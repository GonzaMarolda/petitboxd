import React from "react"
import styles from "./MovieFormDetails.module.css"
import PropTypes from "prop-types"

const MovieFormDetails = ({hours, minutes, director, setFormData}) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let processedValue = correctInputLength(name, value)

        setFormData(prev => ({...prev, [name]: processedValue }));
    }

    const correctInputLength = (name, value) => {
        let processedValue = value

        if (name === "hours") {
            processedValue = processedValue.replace(/[^0-9]/g, '')
            processedValue = processedValue[processedValue.length - 1]
            return processedValue
        } else if (name === "minutes") {
            processedValue = processedValue.replace(/[^0-9]/g, '')
            if (processedValue.length <= 2) return processedValue
            processedValue = processedValue[processedValue.length - 2] + processedValue[processedValue.length - 1]
            return processedValue
        } else return value
    }

    return (
        <div className={styles["movie-details"]}>
            <div className={styles["detail-row"]}>
                <span className={styles["detail-label"]}>Director:</span>
                <span className={styles["detail-value"]}>
                    <input
                        type="text"
                        name="director"
                        data-testid="director"
                        value={director}
                        onChange={handleInputChange}
                        placeholder="Enter a director"
                        className={styles['director-input']}
                        required
                    />
                </span>
            </div>
        
            <div className={styles["detail-row"]}>
                <span className={styles["detail-label"]}>Length:</span>
                <span className={styles["detail-value"]}>
                    {
                        <input
                            type="text"
                            name="hours"
                            data-testid="hours"
                            value={hours}
                            onChange={handleInputChange}
                            className={styles['length-input']}
                            required
                        />
                    }h {" "}
                    {
                        <input
                            type="text"
                            name="minutes"
                            data-testid="minutes"
                            value={minutes}
                            onChange={handleInputChange}
                            className={styles['length-input']}
                            required
                        />
                    }m
                </span>
            </div>
        </div>
    )
}
MovieFormDetails.propTypes = {
    hours: PropTypes.string.isRequired,
    minutes: PropTypes.string.isRequired,
    director: PropTypes.string.isRequired,
    setFormData: PropTypes.func.isRequired
}

export default MovieFormDetails

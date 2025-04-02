import React from "react"
import styles from "./MovieFormHeader.module.css"
import PropTypes from "prop-types"
import CountryDropdown from "./CountryDropdown"

const MovieFormHeader = ({title, year, initialCountry, setFormData}) => {
    const handleCountrySelection = (country) => {
        setFormData(prev => ({...prev, ["country"]: country.id }))
    }

    return (
        <header className={styles["movie-header"]}>
            <h3 className={styles["movie-title"]}>
                {
                    <input
                        type="text"
                        name="title"
                        data-testid="title"
                        value={title}
                        onChange={(e) => setFormData(prev => ({...prev, ["title"]: e.target.value }))}
                        placeholder="Enter a title"
                        className={styles['title-input']}
                        required
                    />
                }
                <span className={styles["movie-year"]}> 
                    ({
                        <input
                            type="number"
                            name="year"
                            data-testid="year"
                            value={year}
                            onChange={(e) => setFormData(prev => ({...prev, ["year"]: e.target.value }))}
                            placeholder="Enter a year"
                            className={styles['year-input']}
                            required
                        />
                    })
                </span>
                <CountryDropdown
                    onSelection={handleCountrySelection}
                    initialCountry={initialCountry}
                />
            </h3>
        </header>
    )
}
MovieFormHeader.propTypes = {
    title: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    initialCountry: PropTypes.string.isRequired,
    setFormData: PropTypes.func.isRequired
}

export default MovieFormHeader
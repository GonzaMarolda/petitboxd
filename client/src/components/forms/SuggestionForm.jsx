import PropTypes from 'prop-types';
import styles from './SuggestionForm.module.css';
import React, { useState } from 'react';

const SuggestionForm = ({ setShow, handleAddSuggestion }) => {
    const [formData, setFormData] = useState({
        title: '',
        comment: '', 
        name: ''
    });

    const validateSubmit = () => {
        const requiredData = ["title", "name", "comment"]
        if (requiredData.some(d => formData[d] === "")) {
            const lackingData = requiredData.filter(d => formData[d] === "").join(", ")
            
            alert("Missing required information: " + lackingData)
            return
        }

        setShow(false)
        handleAddSuggestion(formData)
    }
        
    return (
        <div className={styles["suggestionCard"]}>   
            <h3 className={styles["suggestionTitle"]}>
                <input
                    type="text"
                    name="title"
                    data-testid="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({...prev, ["title"]: e.target.value }))}
                    placeholder="Enter a title"
                    className={styles['title-input']}
                    required
                />
            </h3>
            
            <textarea
                className={styles["comment-input"]}
                placeholder="Tell us something about the movie!"
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({...prev, ["comment"]: e.target.value }))}
                data-testId="comment-input"
                required
            />

            <div className={styles["suggested-by-container"]}>
                <p>Movie suggested by:</p>
                <input
                    type="text"
                    name="name"
                    data-testid="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, ["name"]: e.target.value }))}
                    placeholder="Enter your name"
                    className={styles['name-input']}
                    required
                />
            </div>

            <div className={styles["form-buttons"]}>
                <button 
                    type="cancel" 
                    onClick={() => {
                        setShow(false)
                    }}
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    data-testid="add_movie"
                    onClick={(e) => {
                        e.preventDefault()
                        validateSubmit()
                    }}>
                    Submit
                </button>
            </div>
        </div>
    )
}
SuggestionForm.propTypes = {
    suggestion: PropTypes.object.isRequired,
    setShow: PropTypes.func.isRequired,
    handleAddSuggestion: PropTypes.func.isRequired
}

export default SuggestionForm
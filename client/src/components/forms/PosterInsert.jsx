import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styles from './PosterInsert.module.css'
import { POSTERS_BASE_PATH } from '../../config'

const PosterInsert = ({onUpload, initialPoster}) => {
    const [posterPreview, setPosterPreview] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        if (!file.type.startsWith('image/')) {
          alert('Invalid image file');
          return;
        }
    
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => setPosterPreview(reader.result);

        onUpload(file)
    }

    return (
        <label className={styles["poster-insert-container"]} htmlFor="poster-upload">
            <input 
                type="file" 
                style={{ display: 'none' }}
                onChange={handleImageUpload}
                id="poster-upload"
            />
            {posterPreview ? (
                <img
                    src={posterPreview} 
                    alt="Poster preview" 
                    className={styles["poster-inserted"]}
                />
            ) : initialPoster ? (
                <img
                    src={initialPoster} 
                    alt="Poster preview" 
                    className={styles["poster-inserted"]}
                />
            ) : (
                <>
                <img
                    src={POSTERS_BASE_PATH + "insertImage.jpg"} 
                    alt="Poster preview" 
                    className={styles["poster-insert"]}
                />
                <div className={styles["poster-insert-text"]}>
                    Insert movie poster
                </div>
                </>
            )}
        </label>
    )
}
PosterInsert.propTypes = {
    onUpload: PropTypes.func.isRequired,
    initialPoster: PropTypes.string.isRequired
}

export default PosterInsert
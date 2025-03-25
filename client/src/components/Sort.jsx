import React, { useEffect, useState } from "react"
import styles from './Sort.module.css'
import { API_BASE_URL } from "../config"
import PropTypes from "prop-types"

const Sort = ({selectedSort, setSelectedSort, toggleSort}) => {
    const sortAttributes = ["Year", "Title", "Country"]
    const [selectedSortType, setSelectedSortType] = useState(selectedSort.type)
    const [selectedAttribute, setSelectedAttribute] = useState(selectedSort.name)

    useEffect(() => {
        setSelectedSortType(selectedSort.type)
        setSelectedAttribute(selectedSort.name)
    }, [])

    return (
        <div className={styles["sort-panel"]}>
            <div className={styles["sort-section"]}>
                <button 
                    className={styles["sort-button"] + " " + (selectedSortType === "ASC" ? styles["active"] : "")}
                    onClick={() => setSelectedSortType("ASC")}
                >
                    <div className={styles["sort-icon"]}>
                        <img 
                            src={API_BASE_URL + "/uploads/sort-asc-icon.png"} 
                            alt="sort-asc" 
                            width="11px"
                            height="15px"
                        />
                    </div>
                </button>

                <button 
                    className={styles["sort-button"] + " " + (selectedSortType === "DESC" ? styles["active"] : "")}
                    onClick={() => setSelectedSortType("DESC")}
                >
                    <div className={styles["sort-icon"]}>
                        <img 
                            src={API_BASE_URL + "/uploads/sort-desc-icon.png"} 
                            alt="sort-asc" 
                            width="11px"
                            height="15px"
                        />
                    </div>
                </button>
            </div>
            <div className={styles["sort-section"]}>
                <div 
                    className={styles["arrow-button"]}
                    onClick={() => {
                        const selectedAttributeIndex = sortAttributes.indexOf(selectedAttribute)
                        setSelectedAttribute(
                            selectedAttributeIndex - 1 >= 0 ?
                            sortAttributes[selectedAttributeIndex - 1] :
                            sortAttributes[sortAttributes.length - 1]
                        )
                    }}
                >
                    {"<"}
                </div>
                <h4 className={styles["sort-title"]}>
                    {selectedAttribute}
                </h4>
                <div 
                    className={styles["arrow-button"]}
                    onClick={() => {
                        const selectedAttributeIndex = sortAttributes.indexOf(selectedAttribute)
                        setSelectedAttribute(
                            selectedAttributeIndex + 1 < sortAttributes.length ?
                            sortAttributes[selectedAttributeIndex + 1] :
                            sortAttributes[0]
                        )
                    }}
                >
                    {">"}
                </div>
            </div>
            <div className={styles["sort-section"]}>
                <div className={styles["sort-submit"]}>
                    <button 
                        type="submit"
                        data-testid="submit_sort"
                        onClick={() => {
                            setSelectedSort({type: selectedSortType, name: selectedAttribute})
                            toggleSort()
                        }}
                    >
                        Apply
                    </button>
                </div>  
            </div>
        </div>
    )
}
Sort.propTypes = {
    selectedSort: PropTypes.object.isRequired,
    setSelectedSort: PropTypes.func.isRequired,
    toggleSort: PropTypes.func.isRequired
}

export default Sort
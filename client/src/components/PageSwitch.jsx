import styles from "./PageSwitch.module.css"
import PropTypes from "prop-types"
import React, {useEffect} from "react"

const PageSwitch = ( {page, setPage, totalPages} ) => {
	/*const [formPage, setFormPage] = useState(page + 1)*/
    const canGoBack = page > 0;
    const canGoNext = page < totalPages - 1;  

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth" 
		});
		}, [page]); 

	/*
	const handlePageChange = (e) => {
		e.preventDefault()
		setPage(formPage + 1)
	}
	*/

    return (
        <div className={styles["pagination-container"]}>
          <button 
            className={styles["pagination-button"]}
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={!canGoBack}
            aria-label="Página anterior"
          >
            {"<"}
          </button>
 
		<span className={styles["page-indicator"]}>
			{page + 1} / {totalPages} 
		</span>
          
          <button 
            className={styles["pagination-button"]}
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={!canGoNext}
          >
            {">"}
          </button>
        </div>
    )
}
PageSwitch.propTypes = {
    page: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired,
    totalPages: PropTypes.number.isRequired
}

export default PageSwitch

/*
<form onSubmit={(e) => handlePageChange(e)}>
<span className={styles["page-indicator"]}>
	<input 
		type="text" 
		className={styles["current-page"]}
		placeholder={page + 1}
		value={formPage}
		onChange={(e) => setFormPage(e.target.value)}
	/> / {totalPages} 
</span>
</form> 
*/
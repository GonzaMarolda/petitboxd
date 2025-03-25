export const sortMovies = (movies, selectedSort) => {
    let sortedMovies
    if (selectedSort.name === "Country") {
        sortedMovies = movies
        .sort((a, b) => {
            if (!a[selectedSort.name.toLowerCase()]) return 1
            else if (!b[selectedSort.name.toLowerCase()]) return -1
            return a[selectedSort.name.toLowerCase()].name.localeCompare(b[selectedSort.name.toLowerCase()].name, 'en', { sensitivity: 'base' })
        })
    } else {
        sortedMovies = movies
        .sort((a, b) => {
            console.log(selectedSort.name + " " + a[selectedSort.name.toLowerCase()])
            return a[selectedSort.name.toLowerCase()].localeCompare(b[selectedSort.name.toLowerCase()], 'en', { sensitivity: 'base' })
        })
    }

    if (selectedSort.type === "DESC") sortedMovies = sortedMovies.reverse()
    return sortedMovies
}
/* eslint-disable no-unused-vars */

export const filterMovies = (movies, searchQuery, selectedFilters) => {
  const queryFilteredMovies = filterSearchQuery(movies, searchQuery)
  const filteredMovies = filterSelectedFilters(queryFilteredMovies, selectedFilters)
  return filteredMovies
}

const filterSearchQuery = (movies, searchQuery) => {
    const processedMovies = getProcessedMovies(movies, searchQuery) 
    const filteredMovies = processedMovies.filter(movie => !movie.failedMatch)

    return filteredMovies.sort((a, b) => { // Sorts by match length
      const aScore = getCommonPrefixLength(a.title, searchQuery);
      const bScore = getCommonPrefixLength(b.title, searchQuery);

      if (bScore !== aScore) return bScore - aScore;
      
      return a.title.length - b.title.length;
    })
    .map(movie => {  // Clean properties
      const { wordStartMatch, failedMatch, ...cleanMovie } = movie;
      return cleanMovie;
    });
}

const filterSelectedFilters = (movies, selectedFilters) => {
  return movies.filter(movie => { // Year
    const minYear = selectedFilters.minYear ? selectedFilters.minYear : '0'
    const maxYear = selectedFilters.maxYear ? selectedFilters.maxYear : '3000' 

    return movie.year >= minYear && movie.year <= maxYear
  })
  .filter(movie => { // Country
    if (!selectedFilters.country) return true
    return movie.country.id === selectedFilters.country
  })
  .filter(movie => { // Seen By
    if (selectedFilters.seenBy.includes('any')) return true

    const movieSeenBy = movie.seenBy.map(p => p.id).sort().join(',');
    const filterSeenBy = selectedFilters.seenBy.sort().join(',');

    return movieSeenBy === filterSeenBy
  })
  .filter(movie => { // Genres
    const hasIncluded = selectedFilters.includedGenres.length > 0 ? movie.genres.some(g => selectedFilters.includedGenres.includes(g.id)) : true
    const hasExcluded = selectedFilters.excludedGenres.length > 0 ? movie.genres.some(g => selectedFilters.excludedGenres.includes(g.id)) : false

    return hasIncluded && !hasExcluded
  })
  .sort((a, b) => { // Genres sort
    const countA = a.genres.filter(genre => selectedFilters.includedGenres.includes(genre.id)).length
    const countB = b.genres.filter(genre => selectedFilters.includedGenres.includes(genre.id)).length
    
    return countB - countA
  })
  .sort((a, b) => { // Year default sort
    const yearA = Number(a.year)
    const yearB = Number(b.year)
    
    return yearA - yearB
  })
}

// Matches movies to the quert and returns them with a failedMatch property
const getProcessedMovies = (movies, searchQuery) => {
    return movies.map(movie => {
        if (searchQuery == '') return { ...movie, failedMatch: false }
  
        const titleLower = movie.title.toLowerCase()
        const queryLower = searchQuery.toLowerCase()
  
        let failedMatch = false
        const queryWords = queryLower.split(/[^\w']+/)
        const titleWords = titleLower.split(/[^\w']+/)
  
        // Has the exact words
        const queryWithoutLast = queryWords.slice(0, queryWords.length - 1)
        queryWithoutLast.forEach(queryWord => {
          let hasWord = false
  
          titleWords.forEach(titleWord => {
            if (titleWord === queryWord) hasWord = true
          })
          if (hasWord == false) failedMatch = true
        })
  
        // Has a word that starts like the last query word
        const queryLastWord = queryWords[queryWords.length - 1]
        let hasWord = false
        titleWords.forEach(titleWord => {
          if (titleWord.startsWith(queryLastWord)) hasWord = true
        })
        if (hasWord == false) failedMatch = true
        
        return { ...movie, failedMatch };
      })
}

const getCommonPrefixLength = (a, b) => {
    const lowerA = a.toLowerCase()
    const lowerB = b.toLowerCase()
    const minLength = Math.min(lowerA.length, lowerB.length);
    for (let i = 0; i < minLength; i++) {
      if (lowerA[i] !== lowerB[i]) return i;
    }
    return minLength;
}
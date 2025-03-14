/* eslint-disable no-unused-vars */

export const filterSearchQuery = (movies, searchQuery) => {
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
const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Sorting', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3001/api/testing/reset')
  
      await request.post('http://localhost:3001/api/movies', {data: {
        title: "testTitleA",
        year: "2018",
        length: 120,
        director: "testDirectorA",
        genres: ["67d878f97a13d55bbbf44c5c", "67d878f97a13d55bbbf44c65"], // Documentary, Romance
        seenBy: ["67d878fa7a13d55bbbf44c6f"], // Ariel
        country: "67d878fa7a13d55bbbf44c80" // Australia
      }})

      await request.post('http://localhost:3001/api/movies', {data: {
        title: "testTitleB",
        year: "2000",
        length: 90,
        director: "testDirectorB",
        genres: ["67d878f97a13d55bbbf44c5c", "67d878f97a13d55bbbf44c5f"], // Documentary, Fantasy
        seenBy: ["67d878fa7a13d55bbbf44c6f"], // Ariel
        country: "67d878fa7a13d55bbbf44c74" // USA
      }})

      await request.post('http://localhost:3001/api/movies', {data: {
        title: "testTitleC",
        year: "1950",
        length: 135,
        director: "testDirectorC",
        genres: ["67d878f97a13d55bbbf44c60"], // History
        seenBy: [], 
        country: "67d878fa7a13d55bbbf44c7d" // Brazil
      }})

      await page.goto('http://localhost:5173')
    })
  
    test('Sort button is shown', async ({ page }) => {
      const sortMovieButton = await page.getByTestId('sort-button')
      await expect(sortMovieButton).toBeVisible()
    })

    describe('Sorts correctly with', () => {
      beforeEach(async ({ page, request }) => {
        await page.getByTestId('sort-button').click()  
      })

      test('Year', async ({ page }) => {
        const movieTitles = await page.getByTestId('movie-title')

        await expect(movieTitles.nth(0)).toHaveText('testTitleC (1950)')
        await expect(movieTitles.nth(1)).toHaveText('testTitleB (2000)')
        await expect(movieTitles.nth(2)).toHaveText('testTitleA (2018)')
      })

      test('Length', async ({ page }) => {
        await page.getByTestId('right-button').click() 
        await page.getByRole('button', { name: 'Apply' }).click()  

        const movieTitles = await page.getByTestId('movie-title')

        await expect(movieTitles.nth(0)).toHaveText('testTitleB (2000)')
        await expect(movieTitles.nth(1)).toHaveText('testTitleA (2018)')
        await expect(movieTitles.nth(2)).toHaveText('testTitleC (1950)')
      })

      test('Title', async ({ page }) => {
        await page.getByTestId('right-button').click() 
        await page.getByTestId('right-button').click() 
        await page.getByRole('button', { name: 'Apply' }).click()  

        const movieTitles = await page.getByTestId('movie-title')

        await expect(movieTitles.nth(0)).toHaveText('testTitleA (2018)')
        await expect(movieTitles.nth(1)).toHaveText('testTitleB (2000)')
        await expect(movieTitles.nth(2)).toHaveText('testTitleC (1950)')
      })

      test('Country', async ({ page }) => {
        await page.getByTestId('right-button').click() 
        await page.getByTestId('right-button').click() 
        await page.getByTestId('right-button').click() 
        await page.getByRole('button', { name: 'Apply' }).click()  

        const movieTitles = await page.getByTestId('movie-title')

        await expect(movieTitles.nth(0)).toHaveText('testTitleA (2018)')
        await expect(movieTitles.nth(1)).toHaveText('testTitleC (1950)')
        await expect(movieTitles.nth(2)).toHaveText('testTitleB (2000)')
      })

      test('Descending - Year', async ({ page }) => {
        await page.getByTestId('sort-desc').click()    
        await page.getByRole('button', { name: 'Apply' }).click() 
        
        const movieTitles = await page.getByTestId('movie-title')

        await expect(movieTitles.nth(0)).toHaveText('testTitleA (2018)')
        await expect(movieTitles.nth(1)).toHaveText('testTitleB (2000)')
        await expect(movieTitles.nth(2)).toHaveText('testTitleC (1950)')
      })
    })
})
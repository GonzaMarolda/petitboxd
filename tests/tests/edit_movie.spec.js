const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Movie update', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3001/api/testing/reset')
  
      await request.post('http://localhost:3001/api/movies', {data: {
        title: "testTitle",
        year: "1999",
        length: 120,
        director: "testDirector",
        genres: ["67d878f97a13d55bbbf44c5c", "67d878f97a13d55bbbf44c5f"], // Documentary, Fantasy
        seenBy: ["67d878fa7a13d55bbbf44c6f"], // Ariel
        country: "67d878fa7a13d55bbbf44c74" // USA
      }})

      await page.goto('http://localhost:5173')
    })

    describe('Initial movie is shown', () => {
        test('Title', async ({ page }) => {
            await expect(page.getByText('testTitle')).toBeVisible()
        })
        test('Year', async ({ page }) => {
            await expect(page.getByText('1999')).toBeVisible()
        })
        test('Director', async ({ page }) => {
            await expect(page.getByText('testDirector')).toBeVisible()
        })
        test('Length', async ({ page }) => {
            await expect(page.getByText('2h 0m')).toBeVisible()
        })
        test('Genres', async ({ page }) => {
            await expect(page.getByText('Documentary')).toBeVisible()
            await expect(page.getByText('Fantasy')).toBeVisible()
        })
        test('Seen By', async ({ page }) => {
            await expect(page.getByText('Ariel')).toBeVisible()
        })
        test('Country', async ({ page }) => {
            await expect(page.getByTestId('United States')).toBeVisible()
        })
    })

    describe('Updated movie is shown', () => {
        beforeEach(async ({ page, request }) => {
            await page.getByTestId('card_testTitle').click()
            await page.getByTestId('button_edit').click()
            await page.getByTestId('title').fill('testTitle2')
            await page.getByTestId('year').fill('2000')
            await page.getByTestId('flag_button').click()
            await page.getByText('Argentina').click()
            await page.getByTestId('director').fill('testDirector2')
            await page.getByTestId('hours').fill('1')
            await page.getByTestId('minutes').fill('30')
            await page.getByTestId('genre_input').click()
            await page.getByText('Action').click()
            await page.getByTestId('remove_Documentary').click()
            await page.getByTestId('form_Ariel').click() 
            await page.getByTestId('form_Gonza').click() 
            await page.getByTestId('submit').click()            
          })

        test('Title', async ({ page }) => {
            await expect(page.getByText('testTitle2')).toBeVisible()
        })
        test('Year', async ({ page }) => {
            await expect(page.getByText('200')).toBeVisible()
        })
        test('Director', async ({ page }) => {
            await expect(page.getByText('testDirector2')).toBeVisible()
        })
        test('Length', async ({ page }) => {
            await expect(page.getByText('1h 30m')).toBeVisible()
        })
        test('Genres', async ({ page }) => {
            await expect(page.getByText('Fantasy')).toBeVisible()
            await expect(page.getByText('Action')).toBeVisible()
        })
        test('Seen By', async ({ page }) => {
            await expect(page.getByText('Gonza')).toBeVisible()
        })
        test('Country', async ({ page }) => {
            await expect(page.getByTestId('Argentina')).toBeVisible()
        })
    })
})
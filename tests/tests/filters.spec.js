const { test, expect, describe, beforeEach } = require('@playwright/test')
const { afterEach } = require('node:test')

describe('Filters', () => {
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

    test('Movie is shown with no filters', async ({ page }) => {
        await expect(page.getByText('testTitle')).toBeVisible()
    })

    describe('Movie is shown when filters match', () => {
        beforeEach(async ({ page, request }) => {
            await page.getByTestId('filters-button').click()
        })
        afterEach(async ({ page, request}) => {
            await expect(page.getByText('testTitle')).toBeVisible()
        })
        
        test('Search first 3 characters', async ({ page }) => {
            await page.getByTestId("search-input").fill("tes")
        })

        test('Country', async ({ page }) => {
            await page.getByTestId("country-input").fill("United")
            await page.keyboard.press('Enter');
            await page.getByText("Apply").click()
        })
        
        test('Seen By', async ({ page }) => {
            await page.getByTestId("filter-Ariel").click()
            await page.getByText("Apply").click()
        })
        
        test('Genres', async ({ page }) => {
            const genresInput = await page.getByTestId("genres-input")
            await genresInput.click()
            await genresInput.fill("docum")
            await page.getByTestId("genres-filter-Documentary").click()
            await genresInput.click()
            await genresInput.fill("fanta")
            await page.getByTestId("genres-filter-Fantasy").click()
            await page.getByText("Apply").click()
        })
    })

    describe('Movie is not shown when filters do not match', () => {
        beforeEach(async ({ page, request }) => {
            await page.getByTestId('filters-button').click()
        })
        afterEach(async ({ page, request}) => {
            await expect(page.getByText('testTitle')).not().toBeVisible()
        })
        
        test('Search random characters', async ({ page }) => {
            await page.getByTestId("search-input").fill("sadxz")
        })

        test('Country', async ({ page }) => {
            await page.getByTestId("country-input").fill("Argentina")
            await page.keyboard.press('Enter');
            await page.getByText("Apply").click()
        })
        
        test('Seen By', async ({ page }) => {
            await page.getByTestId("filter-Gonza").click()
            await page.getByText("Apply").click()
        })
        
        test('Genres', async ({ page }) => {
            const genresInput = await page.getByTestId("genres-input")
            await genresInput.click()
            await genresInput.fill("action")
            await page.getByTestId("genres-filter-Action").click()
            await page.getByText("Apply").click()
        })
    })
})
const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Movie addition', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3001/api/testing/reset')
  
      await page.goto('http://localhost:5173')
    })
  
    test('Add movie button is shown', async ({ page }) => {
      const addMovieButton = await page.getByRole('button', { name: 'Add movie' })
      await expect(addMovieButton).toBeVisible()
    })

    test('Add movie form is shown', async ({ page }) => {
        await page.getByRole('button', { name: 'Add movie' }).click()

        await expect(page.getByTestId('add_movie')).toBeVisible()
    })

    test('Form is submitted', async ({ page }) => {
        await page.getByRole('button', { name: 'Add movie' }).click()
        await page.getByTestId('title').fill('testTitle')
        await page.getByTestId('year').fill('2000')
        await page.getByTestId('flag_button').click()
        await page.getByText('Argentina').click()
        await page.getByTestId('director').fill('testDirector')
        await page.getByTestId('hours').fill('1')
        await page.getByTestId('minutes').fill('30')
        await page.getByTestId('genre_input').click()
        await page.getByText('Action').click()
        await page.getByText('Ariel').click() 
        await page.getByTestId('add_movie').click()

        await expect(page.getByText('testTitle')).toBeVisible()
    })
})
const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Ratings', () => {
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

      await page.goto('http://localhost:5173')
      await page.getByTestId('login_input').fill("testPassword")
      await page.keyboard.press('Enter');
    })
  
    test('Rating button is shown', async ({ page }) => {
      await page.getByTestId('card_testTitleA').click()
      const ratingButton = await page.getByTestId('rating-button')
      await expect(ratingButton).toBeVisible()
    })

    describe('Once entered movie ratings', () => {
      beforeEach(async ({ page, request }) => {
        await page.getByTestId('card_testTitleA').click()
        const ratingButton = await page.getByTestId('rating-button')
        await ratingButton.click()
      })

      test('No rating is communicated', async ({ page }) => {
        await expect(page.getByTestId('no-ratings-message')).toBeVisible()
      })

      test('No reviews is communicated', async ({ page }) => {
        await expect(page.getByTestId('no-reviews-message')).toBeVisible()
      })

      test('Can submit a review', async ({ page }) => {
        await page.getByTestId('comment-input').fill("testComment")
        await page.getByTestId('review-form-star-1').click()
        await page.getByRole('button', { name: 'Submit' }).click()
      })

      describe('Once review is submitted', () => {
        beforeEach(async ({ page, request }) => {
          await page.getByTestId('comment-input').fill("testComment")
          await page.getByTestId('review-form-star-1').click()
          await page.getByRole('button', { name: 'Submit' }).click()
        })
  
        test('Displays new rating', async ({ page }) => {
          await expect(page.getByText('2 / 5')).toBeVisible()
        })
  
        test('Displays the review', async ({ page }) => {
          await expect(page.getByTestId('user-testUser')).toBeVisible()
          await expect(page.getByTestId('comment-testComment')).toBeVisible()
        })

        test('Updates on edit', async ({ page }) => {
          await page.getByTestId('comment-input').fill("testComment2")
          await page.getByTestId('review-form-star-2').click()
          await page.getByRole('button', { name: 'Edit' }).click()
          await expect(page.getByTestId('comment-testComment2')).toBeVisible()
          await expect(page.getByText('3 / 5')).toBeVisible()
        })

        test('Gets removed on delete', async ({ page }) => {
          await page.getByRole('button', { name: 'Delete' }).click()
          await expect(page.getByTestId('no-reviews-message')).toBeVisible()
          await expect(page.getByTestId('no-ratings-message')).toBeVisible()
        })
      })
    })
})
export let token = null

export const setToken = newToken => {
  token = `Bearer ${newToken}`
  console.log('Token set to ' + token)
}
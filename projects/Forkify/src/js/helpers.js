// local imports
import { TIMEOUT_SEC } from './config'

/**
 * Creates a promise that rejects after a specified number of seconds
 * Used to implement timeout functionality for fetch requests
 *
 * @param {number} s - The number of seconds before timing out
 * @returns {Promise} A promise that rejects after the specified time
 */
const timeout = s => {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`))
    }, s * 1000)
  })
}

/**
 * Fetches JSON data from the specified URL
 *
 * @async
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<Object>} The parsed JSON response
 * @throws {Error} If the request fails or times out
 */
export const getJSON = async url => _requestJSON(url)

/**
 * Sends JSON data to the specified URL using a POST request
 *
 * @async
 * @param {string} url - The URL to send data to
 * @param {Object} uploadData - The data to be sent as JSON
 * @returns {Promise<Object>} The parsed JSON response from the server
 * @throws {Error} If the request fails or times out
 */
export const sendJSON = async (url, uploadData) =>
  _requestJSON(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(uploadData)
  })

/**
 * Private helper function that handles both GET and POST JSON requests
 * Implements timeout functionality and error handling
 *
 * @async
 * @private
 * @param {string} url - The URL for the request
 * @param {Object} options - Fetch API options
 * @returns {Promise<Object>} The parsed JSON response
 * @throws {Error} If the request fails, returns an error response, or times out
 */
const _requestJSON = async (url, options = {}) => {
  try {
    const res = await Promise.race([fetch(url, options), timeout(TIMEOUT_SEC)])
    const data = await res.json()
    if (!res.ok) throw new Error(`${data.message} (${res.status})`)
    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}

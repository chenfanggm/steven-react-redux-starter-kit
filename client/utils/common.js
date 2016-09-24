/**
 * Request
 */
export const errorFilter = ({ withJsonFilter } = { withJsonFilter: true}) =>
  (response) => {
    if(!response.ok) {
      throw response
    }

    if (withJsonFilter) {
      return response.json()
    }

    return response
  }

export const getQueryString = (queryParams) => {
  const searchString = ''
  Object.keys(queryParams).map((key) => {
    if (searchString) {
      searchString.concat(`&${key}=${queryParams[key]}`)
    } else {
      searchString.concat(`?${key}=${queryParams[key]}`)
    }
  })
  return searchString
}

/**
 * Validation
 */
export const isValidEmail = (email) => {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return regex.test(email)
}


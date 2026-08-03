import axios from 'axios'
 export default async function fetch(url) {
    let response = null
    try {
      response = await axios({
        method: "get",
        url: "https://allorigins.hexlet.app/get",
        params: {
          url: url,
          disableCache: true
        },
        responseType: "json",
      });
    } catch (err) {
      throw new Error(`Network error: ${err.message}`)
    }
    const error = response.data?.status?.error
    if (error) {
      throw new Error(`Network error: ${error.code}`) 
    }
  return response.data?.contents
}

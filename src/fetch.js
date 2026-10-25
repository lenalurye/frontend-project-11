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
  // The proxy response may come without a status (e.g. when it is mocked),
  // so only fail on an explicit non-2xx http code
  const statusCode = response.data?.status?.http_code
  if (statusCode !== undefined && (statusCode < 200 || statusCode >= 300)) {
    throw new Error(`Network error: ${statusCode}`)
  }
  return response.data?.contents
}

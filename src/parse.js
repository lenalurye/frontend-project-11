export default function parseRss(xmlString) {
  let rss = null
  try {
    rss = new DOMParser().parseFromString(xmlString, 'application/xml')
  } catch (err) {
    throw new Error(`Failed to parse XML: ${err.message}`)
  }
  const errorNode = rss.querySelector("parsererror");
  if (errorNode) {
    throw new Error(`Failed to parse XML: ${errorNode.textContent}`)
  }

    // Parse feed header
    const title = rss.querySelector('channel > title')?.textContent
    const description = rss.querySelector('channel > description')?.textContent
    const rssFeed = {
      title,
      description,
      posts: [],
    }

    // Parse posts
    const items = rss.querySelectorAll('item')
    items.forEach((item) => {
      const title = item.querySelector('title')?.textContent
      const link = item.querySelector('link')?.textContent
      rssFeed.posts.push({
        title,
        link,
      })
    })
    return rssFeed
  }
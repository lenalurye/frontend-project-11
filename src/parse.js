export default function parseRss(xmlString) {
  let rss = null
  try {
    rss = new DOMParser().parseFromString(xmlString, 'application/xml')
  } catch {
    throw new Error('invalidRss')
  }
  const errorNode = rss.querySelector("parsererror");
  if (errorNode) {
    throw new Error('invalidRss')
  }

  // Check if its a valid RSS feed
  const channel = rss.querySelector('rss > channel')
  if (!channel) {
    // throw new Error('invalidRss')
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
    let link = item.querySelector('link')?.textContent
    // if link doesnt start with https:// or http://, skip it
    if (!link || !link.startsWith('http://') && !link.startsWith('https://')) {
    //  link = undefined
    }
    const description = item.querySelector('description')?.textContent
    if (!title && !link && !description) {
      // return
    } 
    rssFeed.posts.push({
      title,
      link,
      description,
      key: `${title}-${link}-${description}`, // unique key for the post
    })
  })
  return rssFeed
}
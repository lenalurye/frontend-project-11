import parse from './parse.js'
import fetch from './fetch.js'

export default async function refreshFeed(state, feedId, url) {
  setTimeout(async() => {
    let content = null
    try {
      content = await fetch(url)
    } catch (err) {
      console.error(`Failed to refresh feed ${feedId}: ${err.message}`)
      refreshFeed(state, feedId, url)
      return
    }
    let rssFeed = null
    try {
      rssFeed = parse(content)
    } catch (err) {
      console.error(`Failed to parse feed ${feedId}: ${err.message}`)
      refreshFeed(state, feedId, url)
      return
    }
    const existingPosts = Object.fromEntries(state.posts.filter((post) => post.feedId === feedId).map((post) => [post.link, true]))
    rssFeed.posts.forEach((post) => {
      if(existingPosts[post.link]) {
        return
      }
      const postId = state.next_post_id
      state.next_post_id += 1
      state.posts.unshift({
        id: postId,
        feedId: feedId,
        title: post.title,
        link: post.link,
      })
    })
    refreshFeed(state, feedId, url)
  }, 5000)
}
import i18next from 'i18next';
import { subscribe, snapshot } from 'valtio/vanilla'

export const setupView = (state) => {
  const urlInput = document.getElementById('url-input')
  const success = document.getElementById('success')
  const error = document.getElementById('error')
  const add = document.getElementById('add')
  const urlLabel = document.getElementById('url-label')
  const feeds = document.getElementById('feeds')
  const posts = document.getElementById('posts')

  const render = () => {
    const obj = snapshot(state)
    success.textContent = i18next.t('added')
    urlLabel.textContent = i18next.t('urlLabel')
    add.textContent = i18next.t('addButton')

    urlInput.value = obj.new_url_form.url
    urlInput.disabled = obj.new_url_form.state === 'processing'
    add.disabled = obj.new_url_form.state === 'processing'
    if (obj.new_url_form.state === 'success') {
      success.classList.remove('d-none')
    } else {
      success.classList.add('d-none')
    }
    if (obj.new_url_form.state === 'failed') {
      error.classList.remove('d-none')
      error.textContent = obj.new_url_form.error?.code ?
        (i18next.t(obj.new_url_form.error.code) || obj.new_url_form.error.code) :
        obj.new_url_form.error?.message
      urlInput.classList.add('is-invalid')
    } else {
      error.classList.add('d-none')
      urlInput.classList.remove('is-invalid')
    }

    feeds.textContent = ''
    obj.feeds.forEach((feed) => {
      const feedEl = document.createElement('div')
      feedEl.classList.add('card', 'mb-3')
      const feedBody = document.createElement('div')
      feedBody.classList.add('card-body')
      const feedTitle = document.createElement('h5')
      feedTitle.classList.add('card-title')
      feedTitle.textContent = feed.title
      const feedDescription = document.createElement('p')
      feedDescription.classList.add('card-text')
      feedDescription.textContent = feed.description
      feedBody.appendChild(feedTitle)
      feedBody.appendChild(feedDescription)
      feedEl.appendChild(feedBody)
      feeds.appendChild(feedEl)
    })

    posts.textContent = ''
    obj.posts.forEach((post) => {
      const postEl = document.createElement('div')
      postEl.classList.add('card', 'mb-1')
      const postBody = document.createElement('div')
      postBody.classList.add('card-body')
      const postTitle = document.createElement('h6')
      postTitle.classList.add('card-title')
      const postLink = document.createElement('a')
      postLink.href = post.link
      postLink.textContent = post.title
      postTitle.appendChild(postLink)
      postBody.appendChild(postTitle)
      postEl.appendChild(postBody)
      posts.appendChild(postEl)
    })
  }
  subscribe(state.new_url_form, render)
  render()
};
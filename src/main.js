
import { proxy, snapshot } from 'valtio/vanilla'
import { string, object } from 'yup';
import { setupView } from './view';
import i18next from 'i18next'
import ru from './locales/ru.js'
import axios from 'axios'

await i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
})

const addSchema = object({
  url: string().url('invalidUrl').required('requiredUrl'),
});

const app = () => {
  const state = proxy({
    language: 'ru',
    new_url_form: {
      url: '',
      state: 'filling', // filling, processing, failed, success
      error: null, 
    },
    next_feed_id: 1,
    feeds: [],
    next_post_id: 1,
    posts: [],
  })

  const urlInput = document.getElementById('url-input')
  const add = document.getElementById('add')


  setupView(state)
  
  urlInput.addEventListener('input', (e) => {
    state.new_url_form.url = e.target.value
  })

  add.addEventListener('click', async (e) => {
    e.preventDefault()
    const obj = snapshot(state)
    try {
      console.log(obj.new_url_form)
      await addSchema.validate(obj.new_url_form)
    } catch (err) {
      state.new_url_form.state = 'failed'
      state.new_url_form.error = {code: err.message}
      urlInput.focus()
      return
    }
    state.new_url_form.state = 'processing'
    let response = null
    try {
      response = await axios({
        method: "get",
        url: "https://allorigins.hexlet.app/get",
        params: {
          url: obj.new_url_form.url,
        },
        responseType: "json",
      });
    } catch (err) {
      state.new_url_form.state = 'failed'
      state.new_url_form.error = {message: err.message}
      urlInput.focus()
      return
    }
    const error = response.data?.status?.error
    if (error) {
      state.new_url_form.state = 'failed'
      state.new_url_form.error = {message: error.code}
      urlInput.focus()
      return
    }
    let rss = null
    try {
      rss = new DOMParser().parseFromString(response.data.contents, 'application/xml')
    } catch (err) {
      state.new_url_form.state = 'failed'
      state.new_url_form.error = {message: err.message}
      urlInput.focus()
      return
    }
    const errorNode = rss.querySelector("parsererror");
    if (errorNode) {
      state.new_url_form.state = 'failed'
      state.new_url_form.error = {message: errorNode.textContent}
      urlInput.focus()
      return
    }

    // Parse feed header
    const title = rss.querySelector('channel > title')?.textContent
    const description = rss.querySelector('channel > description')?.textContent
    state.feeds.push({
      id: state.next_feed_id++,
      url: obj.new_url_form.url,
      title,
      description,
    })

    // Parse posts
    const items = rss.querySelectorAll('item')
    items.forEach((item) => {
      const title = item.querySelector('title')?.textContent
      const link = item.querySelector('link')?.textContent
      state.posts.push({
        id: state.next_post_id++,
        feed_id: state.next_feed_id - 1,
        title,
        link,
      })
    })

    state.new_url_form.state = 'success'
    state.new_url_form.url = ''
    urlInput.focus()
  })
}

app()
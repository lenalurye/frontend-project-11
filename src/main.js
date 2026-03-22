
import { proxy, snapshot } from 'valtio/vanilla'
import { string, object } from 'yup';
import { setupView } from './view';
import i18next from 'i18next'
import ru from './locales/ru.js'

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
      state.new_url_form.error = err.message
      urlInput.focus()
      return
    }
    state.new_url_form.state = 'processing'
    setTimeout(() => {
      state.new_url_form.state = 'success'
      state.new_url_form.url = ''
      urlInput.focus()
    }, 1000)
  })
}

app()
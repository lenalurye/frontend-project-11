import i18next from 'i18next';
import { subscribe, snapshot } from 'valtio/vanilla'

export const setupView = (state) => {
  const urlInput = document.getElementById('url-input')
  const success = document.getElementById('success')
  const error = document.getElementById('error')
  const add = document.getElementById('add')
  const urlLabel = document.getElementById('url-label')

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
      error.textContent = i18next.t(obj.new_url_form.error) || obj.new_url_form.error
      urlInput.classList.add('is-invalid')
    } else {
      error.classList.add('d-none')
      urlInput.classList.remove('is-invalid')
    }
  }
  subscribe(state.new_url_form, render)
  render()
};
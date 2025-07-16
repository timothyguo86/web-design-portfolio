// local imports
import View from './View'

export class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload')

  _window = document.querySelector('.add-recipe-window')
  _overlay = document.querySelector('.overlay')
  _btnOpen = document.querySelector('.nav__btn--add-recipe\n')
  _btnClose = document.querySelector('.btn--close-modal')

  constructor() {
    super()
    this._addHandlerShowWindow()
    this._addHandlerCloseWindow()
  }

  addHandlerSubmit(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault()
      const dataArr = [...new FormData(this._parentElement)]
      const data = Object.fromEntries(dataArr)
      handler(data)
    })
  }

  _toggleWindow() {
    this._window.classList.toggle('hidden')
    this._overlay.classList.toggle('hidden')
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this._toggleWindow.bind(this))
  }

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this._toggleWindow.bind(this))
  }
}

export default new AddRecipeView()

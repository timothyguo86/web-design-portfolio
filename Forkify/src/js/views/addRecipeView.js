// local imports
import View from './View'

export class AddRecipeView extends View {
  /** @type {HTMLElement} Parent element where the form will be rendered */
  _parentElement = document.querySelector('.upload')

  /** @type {string} Success message displayed after recipe submission */
  _message = 'Recipe was successfully added!'

  /** @type {HTMLElement} Modal window element for the recipe form */
  _window = document.querySelector('.add-recipe-window')

  /** @type {HTMLElement} Overlay element that darkens the background when modal is open */
  _overlay = document.querySelector('.overlay')

  /** @type {HTMLElement} Button that opens the recipe form modal */
  _btnOpen = document.querySelector('.nav__btn--add-recipe\n')

  /** @type {HTMLElement} Button that closes the recipe form modal */
  _btnClose = document.querySelector('.btn--close-modal')

  constructor() {
    super()
    this._addHandlerShowWindow()
    this._addHandlerCloseWindow()
  }

  /**
   * Attaches a submit event listener to the parent element.
   * When the form is submitted, the method prevents the default action,
   * extracts the form data, and calls the provided handler function with the form data.
   *
   * @param {Function} handler - A callback function to handle the form data. It receives the form data as an object.
   * @return {void}
   */
  addHandlerSubmit(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault()
      const dataArr = [...new FormData(this._parentElement)]
      const data = Object.fromEntries(dataArr)
      handler(data)
    })
  }

  /**
   * Toggles the visibility of the window and overlay elements by adding or
   * removing the 'hidden' class.
   *
   * @return {void} This method does not return a value.
   */
  _toggleWindow() {
    this._window.classList.toggle('hidden')
    this._overlay.classList.toggle('hidden')
  }

  /**
   * Attaches an event listener to the open button to handle window visibility toggling.
   * The method binds the toggle window functionality to the click event of the open button.
   *
   * @return {void} This method does not return any value.
   */
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this._toggleWindow.bind(this))
  }

  /**
   * Adds event listeners to close the window when the close button or overlay is clicked.
   *
   * @return {void} This method does not return a value.
   */
  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this._toggleWindow.bind(this))
    this._overlay.addEventListener('click', this._toggleWindow.bind(this))
  }
}

export default new AddRecipeView()

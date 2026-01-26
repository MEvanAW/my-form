import { watch, onMounted } from 'vue'
import { Modal } from 'bootstrap'

/**
 * Composable for handling Bootstrap modal functionality
 * Provides modal initialization, toggling, and cleanup
 *
 * @param {string} modalId - The ID of the modal element
 * @param {Object} options - Modal configuration options
 * @param {boolean} options.isStatic - Whether the modal should have a static backdrop
 * @param {Function} emit - Optional emit function for custom events
 * @returns {Object} Modal instance and control methods
 */
export function useBootstrapModal(modalId, options = {}, emit) {
  let modal = null

  const dataBsBackdrop = options.isStatic ? 'static' : true

  /**
   * Initialize the Bootstrap modal instance
   */
  function initModal() {
    const modalElement = document.getElementById(modalId)
    if (modalElement) {
      modal = new Modal(modalElement, {
        backdrop: dataBsBackdrop,
      })
    }
  }

  /**
   * Toggle the modal visibility
   */
  function toggleModal() {
    if (modal) {
      modal.toggle()
    }
  }

  /**
   * Show the modal
   */
  function showModal() {
    if (modal) {
      modal.show()
    }
  }

  /**
   * Hide the modal
   */
  function hideModal() {
    if (modal) {
      modal.hide()
    }
  }

  /**
   * Watch for symbol changes to toggle modal
   * @param {Symbol|null} symbol - Symbol to watch for changes
   */
  function watchForToggle(symbol) {
    watch(
      () => symbol,
      // eslint-disable-next-line no-unused-vars
      (_) => {
        toggleModal()
      },
    )
  }

  /**
   * Cleanup modal instance
   */
  function disposeModal() {
    if (modal) {
      modal.dispose()
      modal = null
    }
  }

  // Initialize modal on mount
  onMounted(() => {
    initModal()
  })

  return {
    modal,
    dataBsBackdrop,
    initModal,
    toggleModal,
    showModal,
    hideModal,
    watchForToggle,
    disposeModal,
  }
}

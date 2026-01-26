import { ref, watch } from 'vue'

/**
 * Composable for handling checkbox group functionality
 * Provides state management for multiple checkboxes with select-all capability
 *
 * @param {Array} options - Array of option objects (each should have an 'id' property)
 * @param {Array} selectedIds - Array of currently selected IDs
 * @param {Function} onUpdate - Callback function when selection changes
 * @returns {Object} Checkbox group state and methods
 */
export function useCheckboxGroup(options, selectedIds, onUpdate) {
  const checkedOptions = ref(new Map())
  const selectAll = ref(false)

  /**
   * Initialize checkbox states from selected IDs
   */
  function initializeCheckboxes() {
    checkedOptions.value.clear()
    selectAll.value = false

    if (!options || options.length === 0) {
      return
    }

    const selectedSet = new Set(selectedIds || [])
    let checkedCount = 0

    options.forEach((option) => {
      const isChecked = selectedSet.has(option.id)
      checkedOptions.value.set(option.id, isChecked)
      if (isChecked) {
        checkedCount++
      }
    })

    // Update selectAll state based on whether all are checked
    if (checkedCount > 0 && checkedCount === options.length) {
      selectAll.value = true
    }
  }

  /**
   * Toggle a single checkbox
   * @param {string} id - The ID of the option to toggle
   */
  function toggleOption(id) {
    const currentChecked = checkedOptions.value.get(id)
    const newChecked = !currentChecked
    checkedOptions.value.set(id, newChecked)

    // Update selectAll state
    const allChecked = Array.from(checkedOptions.value.values()).every((val) => val)
    selectAll.value = allChecked

    // Emit update with selected IDs
    emitUpdate()
  }

  /**
   * Toggle all checkboxes
   */
  function toggleAll() {
    selectAll.value = !selectAll.value
    const newChecked = selectAll.value

    checkedOptions.value.forEach((_, id) => {
      checkedOptions.value.set(id, newChecked)
    })

    emitUpdate()
  }

  /**
   * Get serialized value of selected IDs
   * @param {string} separator - Separator for serialization (default: comma)
   * @returns {string} Serialized selected IDs
   */
  function getSerializedValue(separator = ',') {
    const selectedIds = getSelectedIds()
    return selectedIds.join(separator)
  }

  /**
   * Get array of selected IDs
   * @returns {Array} Array of selected IDs
   */
  function getSelectedIds() {
    const selected = []
    checkedOptions.value.forEach((checked, id) => {
      if (checked) {
        selected.push(id)
      }
    })
    return selected
  }

  /**
   * Get count of selected items
   * @returns {number} Number of selected items
   */
  function getSelectedCount() {
    return getSelectedIds().length
  }

  /**
   * Emit update callback with selected IDs
   */
  function emitUpdate() {
    if (onUpdate) {
      onUpdate(getSelectedIds())
    }
  }

  /**
   * Check if a specific option is checked
   * @param {string} id - The ID to check
   * @returns {boolean} Whether the option is checked
   */
  function isChecked(id) {
    return checkedOptions.value.get(id) || false
  }

  /**
   * Reset all checkboxes to unchecked state
   */
  function resetCheckboxes() {
    checkedOptions.value.forEach((_, id) => {
      checkedOptions.value.set(id, false)
    })
    selectAll.value = false
    emitUpdate()
  }

  /**
   * Watch for changes in options and reinitialize
   */
  function watchOptions(optionsRef) {
    watch(optionsRef, () => {
      initializeCheckboxes()
    })
  }

  // Initialize on creation
  initializeCheckboxes()

  return {
    checkedOptions,
    selectAll,
    toggleOption,
    toggleAll,
    getSerializedValue,
    getSelectedIds,
    getSelectedCount,
    isChecked,
    resetCheckboxes,
    watchOptions,
    initializeCheckboxes,
  }
}

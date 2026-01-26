import { computed, ref, unref } from 'vue'

/**
 * Composable for handling table sorting and filtering functionality
 * Provides multi-field sorting, keyword filtering, and paginated display
 *
 * @param {Ref<Array>} items - Array of items to sort and filter
 * @param {Object} config - Configuration object
 * @param {Object} config.sortFields - Object mapping sort keys to field names and compare functions
 * @param {string} config.defaultSortKey - Default sort key to use
 * @param {number} config.initialItemsPerPage - Initial number of items per page
 * @param {number} config.minItemsPerPage - Minimum number of items per page (default: 5)
 * @param {number} config.maxItemsPerPage - Maximum number of items per page (default: 99)
 * @returns {Object} Sorting state, computed properties, and methods
 */
export function useTableSorting(items, config = {}) {
  const sortBy = ref(config.defaultSortKey || '')
  const isAscending = ref(true)
  const searchKeyword = ref('')
  const currentPage = ref(1)
  const itemsPerPage = ref(config.initialItemsPerPage || 10)
  const itemsPerPageMin = ref(config.minItemsPerPage || 5)
  const itemsPerPageMax = ref(config.maxItemsPerPage || 99)

  /**
   * Sort items based on current sort field and direction
   * @param {Array} itemsToSort - Items to sort
   * @returns {Array} Sorted items
   */
  const sortItems = (itemsToSort) => {
    if (!sortBy.value || !config.sortFields || !config.sortFields[sortBy.value]) {
      return itemsToSort
    }

    const sortConfig = config.sortFields[sortBy.value]
    const direction = isAscending.value ? 1 : -1

    const compareFn = sortConfig.compare || defaultCompare

    return [...itemsToSort].sort((a, b) => {
      return direction * compareFn(a, b, sortConfig.field)
    })
  }

  /**
   * Default comparison function
   * @param {Object} a - First item
   * @param {Object} b - Second item
   * @param {string} field - Field to compare
   * @returns {number} Comparison result
   */
  const defaultCompare = (a, b, field) => {
    const valueA = a[field]
    const valueB = b[field]

    if (valueA === valueB) return 0
    if (valueA === undefined || valueA === null) return 1
    if (valueB === undefined || valueB === null) return -1
    if (valueA < valueB) return -1
    return 1
  }

  /**
   * Filter items by search keyword
   * @returns {Array} Filtered items
   */
  const filteredItems = computed(() => {
    if (!searchKeyword.value) {
      return items.value || []
    }

    const keyword = searchKeyword.value.toLowerCase()
    const searchFields = config.searchFields || []

    return (items.value || []).filter((item) => {
      if (searchFields.length === 0) {
        // Search all fields if no specific fields specified
        return Object.values(item).some(
          (value) =>
            value !== null && value !== undefined && String(value).toLowerCase().includes(keyword),
        )
      }

      // Search only specified fields
      return searchFields.some((field) => {
        const value = item[field]
        return (
          value !== null && value !== undefined && String(value).toLowerCase().includes(keyword)
        )
      })
    })
  })

  /**
   * Get items for current page after sorting and filtering
   * @returns {Array} Items for current page
   */
  const displayedItems = computed(() => {
    const sorted = sortItems(filteredItems.value)
    const startIndex = (currentPage.value - 1) * itemsPerPage.value
    const endIndex = startIndex + itemsPerPage.value
    return sorted.slice(startIndex, endIndex)
  })

  /**
   * Calculate total number of pages
   * @returns {number} Total pages
   */
  const pageCount = computed(() => {
    const total = filteredItems.value.length
    return Math.ceil(total / itemsPerPage.value) || 1
  })

  /**
   * Check if sorting is currently ascending
   * @returns {boolean} True if ascending
   */
  const isSortAscending = computed(() => {
    return isAscending.value
  })

  /**
   * Toggle sort direction for a specific field
   * @param {string} sortKey - The sort key to toggle
   */
  function toggleSort(sortKey) {
    if (sortBy.value === sortKey) {
      // Toggle direction if same field
      isAscending.value = !isAscending.value
    } else {
      // New field, start with ascending
      sortBy.value = sortKey
      isAscending.value = true
    }

    // Reset to first page when sorting changes
    currentPage.value = 1
  }

  /**
   * Sort items and navigate to a specific page
   * @param {number} page - Page number to navigate to
   */
  function navigateToPage(page) {
    // Correct itemsPerPage if it's more than available items
    if (itemsPerPage.value > unref(items).length) {
      itemsPerPage.value = unref(items).length
    }
    if (page >= 1 && page <= pageCount.value) {
      currentPage.value = page
    }
  }

  /**
   * Set number of items per page with validation
   * @param {number} count - Number of items per page
   */
  function setItemsPerPage(count) {
    // Clamp the value within min/max bounds
    itemsPerPage.value = Math.max(itemsPerPageMin.value, Math.min(itemsPerPageMax.value, count))
    currentPage.value = 1
  }

  /**
   * Set dynamic bounds for items per page
   * @param {number} min - Minimum number of items per page
   * @param {number} max - Maximum number of items per page
   */
  function setItemsPerPageBounds(min, max) {
    itemsPerPageMin.value = Math.max(1, min) // Ensure at least 1
    itemsPerPageMax.value = Math.max(itemsPerPageMin.value, max) // Ensure max >= min

    // Adjust current itemsPerPage if it's outside new bounds
    if (itemsPerPage.value < itemsPerPageMin.value) {
      itemsPerPage.value = itemsPerPageMin.value
    } else if (itemsPerPage.value > itemsPerPageMax.value) {
      itemsPerPage.value = itemsPerPageMax.value
    }
  }

  /**
   * Calculate dynamic min/max bounds based on filtered items
   * @param {number} minOverride - Optional minimum override
   * @param {number} maxOverride - Optional maximum override
   */
  function calculateItemsPerPageBounds(minOverride = 5, maxOverride = 99) {
    const itemCount = filteredItems.value.length || 1
    const min = Math.min(minOverride, itemCount)
    const max = Math.min(itemCount, maxOverride)
    setItemsPerPageBounds(min, max)
  }

  /**
   * Validate if a proposed items per page value is valid
   * @param {number} count - Number to validate
   * @returns {boolean} True if the value is within valid bounds
   */
  function isValidItemsPerPage(count) {
    return count >= itemsPerPageMin.value && count <= itemsPerPageMax.value
  }

  /**
   * Clear search keyword
   */
  function clearSearch() {
    searchKeyword.value = ''
  }

  /**
   * Reset all filters and sorting to default
   */
  function resetFilters() {
    sortBy.value = config.defaultSortKey || ''
    isAscending.value = true
    searchKeyword.value = ''
    currentPage.value = 1
  }

  /**
   * Get current sort state for UI display
   * @returns {Object} Current sort state
   */
  function getSortState() {
    return {
      sortBy: sortBy.value,
      isAscending: isAscending.value,
    }
  }

  return {
    // State
    sortBy,
    isAscending,
    searchKeyword,
    currentPage,
    itemsPerPage,
    itemsPerPageMin,
    itemsPerPageMax,

    // Computed
    filteredItems,
    displayedItems,
    pageCount,
    isSortAscending,

    // Methods
    toggleSort,
    navigateToPage,
    setItemsPerPage,
    setItemsPerPageBounds,
    calculateItemsPerPageBounds,
    isValidItemsPerPage,
    clearSearch,
    resetFilters,
    sortItems,
    getSortState,
  }
}

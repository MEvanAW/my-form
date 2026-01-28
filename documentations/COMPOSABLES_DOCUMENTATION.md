# Composables Documentation

This document provides comprehensive documentation for all reusable composables in the project. Composables are functions that leverage Vue's Composition API to encapsulate and reuse stateful logic across components.

## Overview

The following composables have been created to improve code reusability and maintainability:

1. **useInputValidation** - Handles form input validation logic
2. **useBootstrapModal** - Manages Bootstrap modal functionality
3. **useTableSorting** - Handles table sorting, filtering, and pagination

---

## useInputValidation

Handles common validation patterns used across form input components.

### Usage

```javascript
import { useInputValidation } from '@/composables/useInputValidation'

const props = defineProps({
  id: String,
  required: Boolean,
  validationToggle: [String, null],
  modelValue: [String, Number, Date],
})

const emit = defineEmits(['invalidate'])

const { isInvalid, inputClass, setInvalidState, validateValue, clearInvalid, emitInvalidate } =
  useInputValidation(props, emit)
```

### Parameters

- `props` (Object): Component props
  - `id` (String): Input element ID
  - `required` (Boolean): Whether the field is required
  - `validationToggle` (String|null): Signal to trigger validation
- `emit` (Function): Emit function for component events

### Returns

| Property/Method            | Type         | Description                                 |
| -------------------------- | ------------ | ------------------------------------------- |
| `isInvalid`                | Ref<boolean> | Whether the input is currently invalid      |
| `inputClass`               | Ref<Object>  | CSS class object with 'is-invalid' property |
| `setInvalidState(invalid)` | Function     | Set the invalid state of the input          |
| `validateValue(value)`     | Function     | Validate the input value, returns boolean   |
| `clearInvalid()`           | Function     | Clear the invalid state                     |
| `emitInvalidate(invalid)`  | Function     | Emit invalidate event                       |

### Features

- Automatic validation toggle watching
- Required field validation
- CSS class management for Bootstrap validation
- Invalid state management

### Benefits

- Reduces code duplication across input components
- Consistent validation behavior
- Easy to extend with custom validation rules

---

## useBootstrapModal

Provides modal initialization, toggling, and cleanup for Bootstrap modals.

### Usage

```javascript
import { useBootstrapModal } from '@/composables/useBootstrapModal'

const emit = defineEmits(['close'])

const {
  modal,
  dataBsBackdrop,
  initModal,
  toggleModal,
  showModal,
  hideModal,
  watchForToggle,
  disposeModal,
} = useBootstrapModal('myModalId', { isStatic: false }, emit)

// Watch for symbol changes to toggle modal
watchForToggle(props.symbol)
```

### Parameters

- `modalId` (String): The ID of the modal element
- `options` (Object): Modal configuration options
  - `isStatic` (Boolean): Whether the modal should have a static backdrop
- `emit` (Function): Optional emit function for custom events

### Returns

| Property/Method          | Type           | Description                              |
| ------------------------ | -------------- | ---------------------------------------- |
| `modal`                  | Object         | Bootstrap Modal instance                 |
| `dataBsBackdrop`         | Boolean/String | Backdrop configuration value             |
| `initModal()`            | Function       | Initialize the Bootstrap modal instance  |
| `toggleModal()`          | Function       | Toggle the modal visibility              |
| `showModal()`            | Function       | Show the modal                           |
| `hideModal()`            | Function       | Hide the modal                           |
| `watchForToggle(symbol)` | Function       | Watch for symbol changes to toggle modal |
| `disposeModal()`         | Function       | Cleanup modal instance                   |

### Features

- Automatic modal initialization on mount
- Support for static and regular backdrops
- Symbol-based toggle watching
- Proper cleanup on component unmount

### Benefits

- Simplifies Bootstrap modal integration
- Reduces boilerplate code
- Provides consistent modal behavior across components

---

## useTableSorting

Handles table sorting, filtering, and pagination functionality.

### Usage

```javascript
import { useTableSorting } from '@/composables/useTableSorting'

const items = ref([
  { id: 1, name: 'John', age: 30, department: 'Engineering' },
  { id: 2, name: 'Jane', age: 25, department: 'Marketing' },
  // ... more items
])

const config = {
  sortFields: {
    name: { field: 'name', compare: null },
    age: { field: 'age', compare: (a, b, field) => a[field] - b[field] },
    department: { field: 'department', compare: null },
  },
  defaultSortKey: 'name',
  initialItemsPerPage: 10,
  minItemsPerPage: 5,
  maxItemsPerPage: 99,
  searchFields: ['name', 'department'], // Optional: specific fields to search
}

const {
  sortBy,
  isAscending,
  searchKeyword,
  currentPage,
  itemsPerPage,
  filteredItems,
  displayedItems,
  pageCount,
  isSortAscending,
  toggleSort,
  navigateToPage,
  setItemsPerPage,
  clearSearch,
  resetFilters,
  sortItems,
  getSortState,
} = useTableSorting(items, config)
```

### Parameters

- `items` (Ref<Array>): Array of items to sort and filter
- `config` (Object): Configuration object
  - `sortFields` (Object): Object mapping sort keys to field names and compare functions
  - `defaultSortKey` (String): Default sort key to use
  - `initialItemsPerPage` (Number): Initial number of items per page
  - `minItemsPerPage` (Number): Minimum number of items per page (default: 5)
  - `maxItemsPerPage` (Number): Maximum number of items per page (default: 99)
  - `searchFields` (Array): Optional array of fields to search (if empty, searches all fields)

### Returns

| Property/Method                   | Type                 | Description                                        |
| --------------------------------- | -------------------- | -------------------------------------------------- |
| `sortBy`                          | Ref<string>          | Current sort key                                   |
| `isAscending`                     | Ref<boolean>         | Whether sorting is ascending                       |
| `searchKeyword`                   | Ref<string>          | Current search keyword                             |
| `currentPage`                     | Ref<number>          | Current page number                                |
| `itemsPerPage`                    | Ref<number>          | Number of items per page                           |
| `itemsPerPageMin`                 | Ref<number>          | Minimum allowed items per page                     |
| `itemsPerPageMax`                 | Ref<number>          | Maximum allowed items per page                     |
| `filteredItems`                   | ComputedRef<Array>   | Items filtered by search keyword                   |
| `displayedItems`                  | ComputedRef<Array>   | Items for current page after sorting and filtering |
| `pageCount`                       | ComputedRef<number>  | Total number of pages                              |
| `isSortAscending`                 | ComputedRef<boolean> | Computed version of isAscending                    |
| `toggleSort(sortKey)`             | Function             | Toggle sort direction for a specific field         |
| `navigateToPage(page)`            | Function             | Navigate to a specific page                        |
| `setItemsPerPage(count)`          | Function             | Set number of items per page (with validation)     |
| `setItemsPerPageBounds(min, max)` | Function             | Set dynamic min/max bounds for items per page      |
| `calculateItemsPerPageBounds()`   | Function             | Calculate bounds based on filtered items           |
| `isValidItemsPerPage(count)`      | Function             | Validate if items per page value is valid          |
| `clearSearch()`                   | Function             | Clear search keyword                               |
| `resetFilters()`                  | Function             | Reset all filters and sorting to default           |
| `sortItems(itemsToSort)`          | Function             | Sort items based on current configuration          |
| `getSortState()`                  | Function             | Get current sort state for UI display              |

### Features

- Multi-field sorting with custom compare functions
- Keyword-based filtering
- Pagination support with configurable bounds
- Ascending/descending toggle
- Configurable search fields
- Automatic page reset on sort/filter changes
- Dynamic items per page validation with min/max bounds
- Support for numeric sorting with custom compare functions
- Auto-clamping of items per page values

### Benefits

- Comprehensive table functionality in a single composable
- Reduces complex table management code
- Flexible sorting with custom comparators
- Built-in search and pagination
- Automatic validation of items per page
- Dynamic bounds calculation based on filtered data
- Easy to integrate with existing table components

---

## Advanced Usage Examples

### Dynamic Items Per Page Bounds

Calculate and set items per page bounds based on filtered data:

```javascript
const {
  itemsPerPage,
  itemsPerPageMin,
  itemsPerPageMax,
  filteredItems,
  setItemsPerPage,
  calculateItemsPerPageBounds,
  isValidItemsPerPage,
} = useTableSorting(items, config)

// Watch for filtered items changes and update bounds
watch(
  filteredItems,
  () => {
    calculateItemsPerPageBounds(5, 99)
  },
  { immediate: true },
)

// Set items per page with automatic validation
const newCount = 15
setItemsPerPage(newCount) // Automatically clamped to min/max bounds

// Validate user input before setting
const userInput = 25
if (isValidItemsPerPage(userInput)) {
  setItemsPerPage(userInput)
}
```

### Numeric Sorting with Custom Compare Function

For numeric fields that need special handling:

```javascript
const config = {
  sortFields: {
    nik: {
      field: 'nik',
      compare: (a, b, field) => {
        // Custom numeric comparison
        const numA = Number(a[field])
        const numB = Number(b[field])
        return numA - numB
      },
    },
    score: {
      field: 'score',
      compare: (a, b, field) => a[field] - b[field],
    },
  },
  defaultSortKey: 'nik',
  initialItemsPerPage: 10,
}
```

### String Sorting with Case-Insensitive Comparison

```javascript
const config = {
  sortFields: {
    name: {
      field: 'name',
      compare: (a, b, field) => {
        const strA = a[field].toLowerCase()
        const strB = b[field].toLowerCase()
        if (strA < strB) return -1
        if (strA > strB) return 1
        return 0
      },
    },
  },
  defaultSortKey: 'name',
}
```

---

## Best Practices

1. **Use Composables for Stateful Logic**: When you find yourself repeating the same reactive logic across multiple components, consider extracting it into a composable. When extracting does make sense (even if currently single-use):
   - Represents a conceptual concern (e.g. pagination, form validation, polling)
   - Is non-trivial (multiple refs, effects, watchers)
   - Might be reused soon or plausibly (not hypothetically)
   - Improves testability or readability by isolating complexity
2. **Keep Composables Focused**: Each composable should have a single, well-defined responsibility.

3. **Document Your Composables**: Always include JSDoc comments explaining parameters, returns, and usage.

4. **Return Refs and Functions**: Expose reactive state as refs and functions that manipulate that state.

5. **Avoid Side Effects**: Composables should be pure functions that can be tested independently.

6. **Use Composables Together**: Multiple composables can be used together in a single component for complex functionality.

7. **Do not extract inherently coupled concerns into composable(s)**: Inherently coupled concerns should be colocated instead. When not to extract into a composable:
   - Is component-specific (e.g. DOM structure assumptions, specific props/emits)
   - Depends heavily on the component’s local state
   - Would need to be parameterized awkwardly just to live outside
   - Is small enough that extraction would hurt readability

---

## Migration Guide

To migrate existing components to use these composables:

1. **Identify Reusable Logic**: Look for repeated patterns in your components (validation, state management, etc.)

2. **Import the Composable**: Add the import statement at the top of your component

3. **Initialize the Composable**: Call the composable function with appropriate parameters

4. **Replace Duplicated Code**: Remove the duplicated logic and use the composable's returned values and methods

5. **Test Thoroughly**: Ensure the component works as expected after migration

### Example: Migrating TextInput Component

**Before:**

```javascript
const isInvalid = ref(false)
const inputClass = ref({ 'is-invalid': false })

watch(
  () => props.validationToggle,
  (_) => {
    if (props.required && !props.modelValue) {
      isInvalid.value = true
      inputClass.value['is-invalid'] = true
    }
  },
)

watch(
  () => props.required,
  (newRequired) => {
    if (!newRequired) {
      isInvalid.value = false
      inputClass.value['is-invalid'] = false
    }
  },
)
```

**After:**

```javascript
import { useInputValidation } from '@/composables/useInputValidation'

const { isInvalid, inputClass } = useInputValidation(props, emit)
```

---

## Future Enhancements

Potential additional composables that could be created:

- `useDebounce` - For debouncing input events
- `useLocalStorage` - For persisting state to localStorage
- `useFetch` - For API calls with loading/error states
- `useForm` - For complex form management
- `useDateRange` - For date range selection
- `usePagination` - Standalone pagination logic (separate from sorting)

---

## Conclusion

These composables provide a solid foundation for reducing code duplication and improving maintainability in Vue.js application. By extracting common patterns into reusable functions, we can:

- Reduce component complexity
- Improve code reusability
- Make testing easier
- Ensure consistent behavior across components
- Simplify maintenance and updates

However, do not extract inherently coupled concerns into composable(s). Inherently coupled concerns should be colocated instead.

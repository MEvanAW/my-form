# Composables Documentation

This document provides comprehensive documentation for all reusable composables in the project. Composables are functions that leverage Vue's Composition API to encapsulate and reuse stateful logic across components.

## Overview

The following composables have been created to improve code reusability and maintainability:

1. **useInputValidation** - Handles form input validation logic
2. **useBootstrapModal** - Manages Bootstrap modal functionality
3. **useCheckboxGroup** - Manages checkbox group state and interactions
4. **useTableSorting** - Handles table sorting, filtering, and pagination
5. **useNumberInput** - Manages number input with validation and range constraints

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

## useCheckboxGroup

Manages state for multiple checkboxes with select-all capability.

### Usage

```javascript
import { useCheckboxGroup } from '@/composables/useCheckboxGroup'

const options = [
  { id: 1, name: 'Option 1' },
  { id: 2, name: 'Option 2' },
  { id: 3, name: 'Option 3' },
]

const {
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
} = useCheckboxGroup(options, selectedIds.value, (selectedIds) => {
  emit('update:modelValue', selectedIds.join(','))
})
```

### Parameters

- `options` (Array): Array of option objects (each should have an 'id' property)
- `selectedIds` (Array): Array of currently selected IDs
- `onUpdate` (Function): Callback function when selection changes

### Returns

| Property/Method                 | Type         | Description                             |
| ------------------------------- | ------------ | --------------------------------------- |
| `checkedOptions`                | Ref<Map>     | Map of checkbox states                  |
| `selectAll`                     | Ref<boolean> | Whether all checkboxes are selected     |
| `toggleOption(id)`              | Function     | Toggle a single checkbox                |
| `toggleAll()`                   | Function     | Toggle all checkboxes                   |
| `getSerializedValue(separator)` | Function     | Get serialized value of selected IDs    |
| `getSelectedIds()`              | Function     | Get array of selected IDs               |
| `getSelectedCount()`            | Function     | Get count of selected items             |
| `isChecked(id)`                 | Function     | Check if a specific option is checked   |
| `resetCheckboxes()`             | Function     | Reset all checkboxes to unchecked state |
| `watchOptions(optionsRef)`      | Function     | Watch for changes in options            |
| `initializeCheckboxes()`        | Function     | Reinitialize checkbox states            |

### Features

- Select-all/deselect-all functionality
- Individual checkbox toggling
- Automatic select-all state management
- Flexible serialization of selected IDs
- Option change watching

### Benefits

- Eliminates complex checkbox state management
- Provides consistent checkbox behavior
- Easy to integrate with form submissions
- Reduces component complexity

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
  - `searchFields` (Array): Optional array of fields to search (if empty, searches all fields)

### Returns

| Property/Method          | Type                 | Description                                        |
| ------------------------ | -------------------- | -------------------------------------------------- |
| `sortBy`                 | Ref<string>          | Current sort key                                   |
| `isAscending`            | Ref<boolean>         | Whether sorting is ascending                       |
| `searchKeyword`          | Ref<string>          | Current search keyword                             |
| `currentPage`            | Ref<number>          | Current page number                                |
| `itemsPerPage`           | Ref<number>          | Number of items per page                           |
| `filteredItems`          | ComputedRef<Array>   | Items filtered by search keyword                   |
| `displayedItems`         | ComputedRef<Array>   | Items for current page after sorting and filtering |
| `pageCount`              | ComputedRef<number>  | Total number of pages                              |
| `isSortAscending`        | ComputedRef<boolean> | Computed version of isAscending                    |
| `toggleSort(sortKey)`    | Function             | Toggle sort direction for a specific field         |
| `navigateToPage(page)`   | Function             | Navigate to a specific page                        |
| `setItemsPerPage(count)` | Function             | Set number of items per page                       |
| `clearSearch()`          | Function             | Clear search keyword                               |
| `resetFilters()`         | Function             | Reset all filters and sorting to default           |
| `sortItems(itemsToSort)` | Function             | Sort items based on current configuration          |
| `getSortState()`         | Function             | Get current sort state for UI display              |

### Features

- Multi-field sorting with custom compare functions
- Keyword-based filtering
- Pagination support
- Ascending/descending toggle
- Configurable search fields
- Automatic page reset on sort/filter changes

### Benefits

- Comprehensive table functionality in a single composable
- Reduces complex table management code
- Flexible sorting with custom comparators
- Built-in search and pagination
- Easy to integrate with existing table components

---

## useNumberInput

Manages number input with validation, range constraints, and increment/decrement functionality.

### Usage

```javascript
import { useNumberInput } from '@/composables/useNumberInput'

const emit = defineEmits(['update:modelValue'])

const {
  value,
  isInvalid,
  min,
  max,
  step,
  isValidRange,
  isBelowMin,
  isAboveMax,
  setValue,
  increment,
  decrement,
  validate,
  clearInvalid,
  clampValue,
  getInputClasses,
  handleInput,
  handleBlur,
  resetToMin,
  resetToMax,
  resetToInitial,
  setMin,
  setMax,
  setStep,
} = useNumberInput(
  {
    min: 0,
    max: 100,
    step: 1,
    initialValue: 50,
  },
  emit,
)
```

### Parameters

- `options` (Object): Configuration options
  - `min` (Number): Minimum allowed value (default: 0)
  - `max` (Number): Maximum allowed value (default: Infinity)
  - `step` (Number): Step size for increment/decrement (default: 1)
  - `initialValue` (Number): Initial value
- `emit` (Function): Optional emit function for custom events

### Returns

| Property/Method      | Type                 | Description                         |
| -------------------- | -------------------- | ----------------------------------- |
| `value`              | Ref<number>          | Current input value                 |
| `isInvalid`          | Ref<boolean>         | Whether the value is invalid        |
| `min`                | Ref<number>          | Minimum allowed value               |
| `max`                | Ref<number>          | Maximum allowed value               |
| `step`               | Ref<number>          | Step size                           |
| `isValidRange`       | ComputedRef<boolean> | Whether value is within valid range |
| `isBelowMin`         | ComputedRef<boolean> | Whether value is below minimum      |
| `isAboveMax`         | ComputedRef<boolean> | Whether value is above maximum      |
| `setValue(val)`      | Function             | Set value and validate it           |
| `increment()`        | Function             | Increment value by step             |
| `decrement()`        | Function             | Decrement value by step             |
| `validate()`         | Function             | Validate current value              |
| `clearInvalid()`     | Function             | Clear invalid state                 |
| `clampValue(val)`    | Function             | Clamp value to valid range          |
| `getInputClasses()`  | Function             | Get CSS classes for validation      |
| `handleInput(event)` | Function             | Handle input event                  |
| `handleBlur(event)`  | Function             | Handle blur event                   |
| `resetToMin()`       | Function             | Reset to minimum value              |
| `resetToMax()`       | Function             | Reset to maximum value              |
| `resetToInitial()`   | Function             | Reset to initial value              |
| `setMin(newMin)`     | Function             | Set minimum value                   |
| `setMax(newMax)`     | Function             | Set maximum value                   |
| `setStep(newStep)`   | Function             | Set step value                      |

### Features

- Range validation (min/max)
- Increment/decrement with step size
- Automatic value clamping
- Invalid state management
- Event handling for input and blur
- Reset functionality
- Dynamic min/max/step updates

### Benefits

- Reduces number input boilerplate code
- Provides robust validation
- Easy to add increment/decrement controls
- Consistent behavior across number inputs
- Handles edge cases (NaN, out of range)

---

## Best Practices

1. **Use Composables for Stateful Logic**: When you find yourself repeating the same reactive logic across multiple components, consider extracting it into a composable.

2. **Keep Composables Focused**: Each composable should have a single, well-defined responsibility.

3. **Document Your Composables**: Always include JSDoc comments explaining parameters, returns, and usage.

4. **Return Refs and Functions**: Expose reactive state as refs and functions that manipulate that state.

5. **Avoid Side Effects**: Composables should be pure functions that can be tested independently.

6. **Use Composables Together**: Multiple composables can be used together in a single component for complex functionality.

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

These composables provide a solid foundation for reducing code duplication and improving maintainability in your Vue.js application. By extracting common patterns into reusable functions, you can:

- Reduce component complexity
- Improve code reusability
- Make testing easier
- Ensure consistent behavior across components
- Simplify maintenance and updates

For questions or suggestions regarding these composables, please refer to the code comments or reach out to the development team.

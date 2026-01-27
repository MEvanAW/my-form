# Validation System Documentation

## Overview

This project implements a comprehensive form validation system for Vue 3 applications using Composition API. The system provides consistent validation behavior across all input components, automatic error tracking, and seamless integration with Bootstrap 5 styling.

### Key Features

- **Automatic Validation**: Inputs validate themselves based on props (required, min/max, patterns)
- **Event-Driven Architecture**: Components emit validation status to parent forms
- **Reactive Error Tracking**: Forms maintain real-time awareness of invalid fields
- **Bootstrap Integration**: Native Bootstrap validation classes and ARIA attributes
- **i18n Support**: Error messages support internationalization
- **Type-Safe**: Built with TypeScript-friendly patterns

### Benefits

1. **Consistent UX**: All form fields behave the same way
2. **Developer-Friendly**: Minimal boilerplate required for validation
3. **Accessibility**: Proper ARIA attributes and error announcements
4. **Maintainable**: Centralized validation logic in composables
5. **Extensible**: Easy to add custom validation rules

## Architecture

### Component Hierarchy

```
Form Component (MyForm.vue)
├── Validation State (invalidInputs ref)
├── Validation Logic (validate function)
└── Input Components
    ├── TextInput
    ├── NumberInput
    ├── DateInput
    ├── SelectInput
    └── TimeInput
        └── Composables
            ├── useInputValidation
            └── useNumberInput
```

### Data Flow

1. **User Interaction** → Input component detects change
2. **Component Validation** → Validates against rules (required, min/max, etc.)
3. **Event Emission** → Emits `invalidate` event with status
4. **Form Tracking** → Updates `invalidInputs` reactive state
5. **Visual Feedback** → Shows/hides error messages and styles

### Validation Lifecycle

```
Initial State
    ↓
User Input
    ↓
Component Validation (watchEffect/watch)
    ↓
Emit invalidate(isValid, inputId)
    ↓
Form updates invalidInputs[inputId]
    ↓
CSS classes and error messages update
    ↓
User sees visual feedback
```

## Core Composables

### `useInputValidation`

Primary composable for text-based input validation.

#### Parameters

```typescript
function useInputValidation(
  props: {
    id: string // Input element ID (required)
    required: boolean // Whether field is required
    validationToggle: any // Signal to trigger validation
  },
  emit: Function, // Component's emit function
)
```

#### Returns

```typescript
{
  isInvalid: Ref<boolean>           // Current validation state
  inputClass: Ref<object>           // CSS classes object
  setInvalidState: (invalid: boolean) => void
  validateValue: (value: any) => boolean
  clearInvalid: () => void
  emitInvalidate: (invalid: boolean) => void
}
```

#### Usage Example

```vue
<script setup>
import { useInputValidation } from '@/composables/useInputValidation'

const props = defineProps({
  id: { type: String, required: true },
  required: Boolean,
  validationToggle: null,
  errorMessage: String,
})

const emit = defineEmits(['change', 'invalidate'])

const { inputClass } = useInputValidation(props, emit)
</script>

<template>
  <input :id="id" :required="required" :class="inputClass" aria-describedby="`${id}Feedback`" />
  <div :id="`${id}Feedback`" class="invalid-feedback">
    {{ errorMessage }}
  </div>
</template>
```

#### Methods

- **`setInvalidState(invalid)`**: Sets validation state and emits event
- **`validateValue(value)`**: Returns true if valid, false otherwise
- **`clearInvalid()`**: Clears invalid state
- **`emitInvalidate(invalid)`**: Emits invalidate event to parent

### `useNumberInput`

Specialized composable for number inputs with range validation.

#### Parameters

```typescript
function useNumberInput(
  options: {
    min?: number // Minimum allowed value (default: 0)
    max?: number // Maximum allowed value (default: Infinity)
    step?: number // Increment/decrement step (default: 1)
    initialValue?: number // Starting value
  },
  emit: Function,
)
```

#### Returns

```typescript
{
  value: Ref<number>               // Current value
  isInvalid: Ref<boolean>          // Validation state
  min: Ref<number>                 // Current minimum
  max: Ref<number>                 // Current maximum
  step: Ref<number>                // Current step
  isValidRange: ComputedRef<boolean>
  isBelowMin: ComputedRef<boolean>
  isAboveMax: ComputedRef<boolean>
  increment: () => void
  decrement: () => void
  validate: () => boolean
  clearInvalid: () => void
  clampValue: (val: number) => number
  setMin: (newMin: number) => void
  setMax: (newMax: number) => void
  setStep: (newStep: number) => void
}
```

#### Usage Example

```vue
<script setup>
import { useNumberInput } from '@/composables/useNumberInput'

const props = defineProps({
  min: { type: Number, default: 1 },
  max: { type: Number, default: 8 },
  errorMessage: String,
})

const emit = defineEmits(['change', 'invalidate'])

const { value, isInvalid, increment, decrement, clearInvalid } = useNumberInput(
  {
    min: props.min,
    max: props.max,
    step: 1,
    initialValue: 1,
  },
  emit,
)
</script>
```

## Input Components

### TextInput

Text input with required field validation.

#### Props

| Prop             | Type     | Required | Default | Description                  |
| ---------------- | -------- | -------- | ------- | ---------------------------- |
| id               | String   | Yes      | -       | Input element ID             |
| required         | Boolean  | No       | false   | Whether field is required    |
| errorMessage     | String   | Yes      | -       | Error message to display     |
| validationToggle | any      | No       | null    | Signal to trigger validation |
| pattern          | String   | No       | -       | Regex pattern for validation |
| validate         | Function | No       | -       | Custom validation function   |

#### Events

| Event      | Payload                        | Description                      |
| ---------- | ------------------------------ | -------------------------------- |
| change     | (value: string, id: string)    | Fired on value change            |
| invalidate | (isValid: boolean, id: string) | Fired on validation state change |

#### Example

```vue
<TextInput
  id="username"
  placeholder="Enter username"
  :required="true"
  :error-message="Username is required"
  v-model="formData.username"
  :validation-toggle="validationTrigger"
  @invalidate="handleInvalidate"
/>
```

### NumberInput

Number input with range validation and increment/decrement controls.

#### Props

| Prop             | Type    | Required | Default | Description                       |
| ---------------- | ------- | -------- | ------- | --------------------------------- |
| id               | String  | Yes      | -       | Input element ID                  |
| min              | Number  | No       | 1       | Minimum value                     |
| max              | Number  | No       | 8       | Maximum value                     |
| errorMessage     | String  | No       | -       | Error message (fallback provided) |
| validationToggle | any     | No       | null    | Signal to trigger validation      |
| disabled         | Boolean | No       | false   | Whether input is disabled         |

#### Events

| Event      | Payload                        | Description                      |
| ---------- | ------------------------------ | -------------------------------- |
| change     | (value: number, id: string)    | Fired on value change            |
| invalidate | (isValid: boolean, id: string) | Fired on validation state change |

#### Example

```vue
<NumberInput
  id="quantity"
  :min="1"
  :max="10"
  error-message="Quantity must be between 1 and 10"
  v-model="formData.quantity"
  @invalidate="handleInvalidate"
/>
```

### DateInput

Date input with required field validation and min/max constraints.

#### Props

| Prop             | Type    | Required | Default | Description                  |
| ---------------- | ------- | -------- | ------- | ---------------------------- |
| id               | String  | Yes      | -       | Input element ID             |
| required         | Boolean | No       | false   | Whether field is required    |
| errorMessage     | String  | No       | -       | Error message to display     |
| validationToggle | any     | No       | null    | Signal to trigger validation |
| min              | String  | No       | -       | Minimum date (ISO format)    |
| max              | String  | No       | -       | Maximum date (ISO format)    |
| disabled         | Boolean | No       | false   | Whether input is disabled    |

#### Events

| Event      | Payload                        | Description                      |
| ---------- | ------------------------------ | -------------------------------- |
| change     | (value: string, id: string)    | Fired on value change            |
| invalidate | (isValid: boolean, id: string) | Fired on validation state change |

#### Example

```vue
<DateInput
  id="startDate"
  :required="true"
  :error-message="Start date is required"
  :min="today"
  :max="nextMonth"
  v-model="formData.startDate"
  @change="handleChange"
  @invalidate="handleInvalidate"
/>
```

### SelectInput

Dropdown select with required field validation.

#### Props

| Prop             | Type    | Required | Default | Description                     |
| ---------------- | ------- | -------- | ------- | ------------------------------- |
| id               | String  | Yes      | -       | Input element ID                |
| options          | Array   | Yes      | -       | Array of {value, label} objects |
| required         | Boolean | No       | false   | Whether field is required       |
| errorMessage     | String  | No       | -       | Error message to display        |
| validationToggle | any     | No       | null    | Signal to trigger validation    |
| placeholder      | String  | No       | -       | Placeholder text                |
| disabled         | Boolean | No       | false   | Whether input is disabled       |

#### Events

| Event      | Payload                                        | Description                      |
| ---------- | ---------------------------------------------- | -------------------------------- |
| change     | (value: any, id: string, additionalData?: any) | Fired on value change            |
| invalidate | (isValid: boolean, id: string)                 | Fired on validation state change |

#### Example

```vue
<SelectInput
  id="department"
  :options="departmentOptions"
  :required="true"
  :error-message="Please select a department"
  placeholder="Select department"
  v-model="formData.department"
  @invalidate="handleInvalidate"
/>
```

### TimeInput

Time input with required field validation and min/max constraints.

#### Props

| Prop             | Type    | Required | Default | Description                  |
| ---------------- | ------- | -------- | ------- | ---------------------------- |
| id               | String  | Yes      | -       | Input element ID             |
| required         | Boolean | No       | false   | Whether field is required    |
| errorMessage     | String  | No       | -       | Error message to display     |
| validationToggle | any     | No       | null    | Signal to trigger validation |
| min              | String  | No       | -       | Minimum time (HH:mm:ss)      |
| max              | String  | No       | -       | Maximum time (HH:mm:ss)      |
| disabled         | Boolean | No       | false   | Whether input is disabled    |

#### Events

| Event      | Payload                        | Description                      |
| ---------- | ------------------------------ | -------------------------------- |
| change     | (value: string, id: string)    | Fired on value change            |
| invalidate | (isValid: boolean, id: string) | Fired on validation state change |

#### Example

```vue
<TimeInput
  id="startTime"
  :required="true"
  :error-message="Start time is required"
  :min="08:00:00"
  :max="17:00:00"
  v-model="formData.startTime"
  @invalidate="handleInvalidate"
/>
```

## Form-Level Validation

### Setting Up Validation in Parent Form

#### 1. Define Validation State

```javascript
const invalidInputs = ref({
  username: false,
  email: false,
  age: false,
  // ... other fields
})
```

#### 2. Create Validation Toggle

```javascript
const validationToggle = ref(false)
```

#### 3. Add Computed Property for Overall Validity

```javascript
const isFormValid = computed(() => {
  return Object.values(invalidInputs.value).every((val) => val === false)
})
```

#### 4. Handle Invalidate Events

```javascript
function handleInvalidate(isValid, inputId) {
  invalidInputs.value[inputId] = !isValid
}
```

#### 5. Implement Validation Function

```javascript
function validate() {
  // Clear previous errors
  errorMessage.value = ''

  // Trigger validation on all inputs
  validationToggle.value = !validationToggle.value

  // Perform additional validations
  if (!isFormValid.value) {
    errorMessage.value = 'Please correct the errors above'
    return false
  }

  // Form is valid
  return true
}
```

#### 6. Bind to Input Components

```vue
<TextInput
  id="username"
  :required="true"
  :validation-toggle="validationToggle"
  @invalidate="handleInvalidate"
/>
```

### Complete Example

```vue
<script setup>
import { ref, computed } from 'vue'
import TextInput from '@/components/inputs/TextInput.vue'
import NumberInput from '@/components/inputs/NumberInput.vue'

const formData = ref({
  username: '',
  age: 0,
})

const invalidInputs = ref({
  username: false,
  age: false,
})

const validationToggle = ref(false)
const errorMessage = ref('')

const isFormValid = computed(() => {
  return Object.values(invalidInputs.value).every((val) => val === false)
})

function handleInvalidate(isValid, inputId) {
  invalidInputs.value[inputId] = !isValid
}

function validate() {
  errorMessage.value = ''
  validationToggle.value = !validationToggle.value

  if (!isFormValid.value) {
    errorMessage.value = 'Please fill in all required fields'
    return
  }

  // Submit form
  console.log('Form is valid!', formData.value)
}
</script>

<template>
  <form @submit.prevent="validate">
    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>

    <TextInput
      id="username"
      placeholder="Username"
      :required="true"
      error-message="Username is required"
      v-model="formData.username"
      :validation-toggle="validationToggle"
      @invalidate="handleInvalidate"
    />

    <NumberInput
      id="age"
      :min="18"
      :max="100"
      error-message="Age must be between 18 and 100"
      v-model="formData.age"
      :validation-toggle="validationToggle"
      @invalidate="handleInvalidate"
    />

    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>
```

## Error Handling

### Error Message Display

All input components use Bootstrap's validation classes for consistent error display:

```vue
<!-- Input with error styling -->
<input :class="{ 'is-invalid': isInvalid }" aria-describedby="`${id}Feedback`" />

<!-- Error message -->
<div :id="`${id}Feedback`" class="invalid-feedback">
  {{ errorMessage }}
</div>
```

### Visual Feedback System

- **Invalid State**: Red border (`is-invalid` class)
- **Error Message**: Displayed below input
- **Form-Level Error**: Alert box at top of form
- **Clearing**: Errors clear when user provides valid input

### i18n Support

Error messages can be internationalized using Vue I18n:

```vue
<TextInput id="email" :error-message="$t('validation.emailRequired')" ... />
```

### Custom Error Messages

Components accept custom error messages via props:

```vue
<NumberInput error-message="Please enter a number between 1 and 10" ... />
```

If not provided, NumberInput uses a fallback:

```
"Nilai harus antara {min} dan {max}"
```

## API Reference

### Validation Props

| Prop             | Type    | Available On | Description                  |
| ---------------- | ------- | ------------ | ---------------------------- |
| id               | String  | All          | Required element ID          |
| required         | Boolean | All          | Whether field is required    |
| errorMessage     | String  | All          | Error message to display     |
| validationToggle | any     | All          | Signal to trigger validation |
| disabled         | Boolean | All          | Whether input is disabled    |

### Specialized Props

| Component   | Prop     | Type     | Description         |
| ----------- | -------- | -------- | ------------------- |
| NumberInput | min      | Number   | Minimum value       |
| NumberInput | max      | Number   | Maximum value       |
| TextInput   | pattern  | String   | Regex pattern       |
| TextInput   | validate | Function | Custom validation   |
| DateInput   | min      | String   | Min date (ISO)      |
| DateInput   | max      | String   | Max date (ISO)      |
| TimeInput   | min      | String   | Min time (HH:mm:ss) |
| TimeInput   | max      | String   | Max time (HH:mm:ss) |
| SelectInput | options  | Array    | {value, label}[]    |

### Events

| Event      | Payload                           | Description                |
| ---------- | --------------------------------- | -------------------------- |
| change     | (value: any, id: string, ...args) | Fired on value change      |
| invalidate | (isValid: boolean, id: string)    | Fired on validation change |

### CSS Classes

| Class              | Purpose               | Usage                                 |
| ------------------ | --------------------- | ------------------------------------- |
| `is-invalid`       | Invalid state styling | Applied to invalid inputs             |
| `invalid-feedback` | Error message display | Error message container               |
| `d-block`          | Force display         | When showing error without validation |

## Usage Examples

### Required Field Validation

```vue
<TextInput
  id="name"
  :required="true"
  error-message="Name is required"
  v-model="formData.name"
  :validation-toggle="validationToggle"
  @invalidate="handleInvalidate"
/>
```

### Range Validation

```vue
<NumberInput
  id="quantity"
  :min="1"
  :max="10"
  error-message="Quantity: 1-10"
  v-model="formData.quantity"
  :validation-toggle="validationToggle"
  @invalidate="handleInvalidate"
/>
```

### Date Range Validation

```vue
<DateInput
  id="startDate"
  :required="true"
  :min="minimumDate"
  :max="maximumDate"
  error-message="Invalid date range"
  v-model="formData.startDate"
  :validation-toggle="validationToggle"
  @invalidate="handleInvalidate"
/>
```

### Conditional Validation

```vue
<TextInput
  id="email"
  :required="requiresEmail"
  error-message="Email is required"
  v-model="formData.email"
  :validation-toggle="validationToggle"
  @invalidate="handleInvalidate"
/>
```

### Custom Validation Function

```vue
<script setup>
const customValidate = (value) => {
  return value && value.length >= 5
}
</script>

<template>
  <TextInput
    id="username"
    :required="true"
    :validate="customValidate"
    error-message="Username must be at least 5 characters"
    v-model="formData.username"
    :validation-toggle="validationToggle"
    @invalidate="handleInvalidate"
  />
</template>
```

## Best Practices

### 1. Always Provide Unique IDs

```vue
<!-- Good -->
<TextInput id="username" ... />
<TextInput id="email" ... />

<!-- Bad -->
<TextInput id="field" ... />
<TextInput id="field" ... />
<!-- Duplicate ID! -->
```

### 2. Use Descriptive Error Messages

```vue
<!-- Good -->
<NumberInput error-message="Age must be between 18 and 100" />

<!-- Bad -->
<NumberInput error-message="Invalid" />
```

### 3. Handle Invalidate Events Consistently

```javascript
// Good pattern
function handleInvalidate(isValid, inputId) {
  invalidInputs.value[inputId] = !isValid
}
```

### 4. Clear Errors on Successful Input

```javascript
// Components automatically clear errors when valid
// No additional code needed
```

### 5. Use Computed for Form Validity

```javascript
// Good - reactive
const isFormValid = computed(() => {
  return Object.values(invalidInputs.value).every((val) => val === false)
})

// Bad - not reactive
const isFormValid = () => {
  return Object.values(invalidInputs.value).every((val) => val === false)
}
```

### 6. Provide ARIA Attributes

```vue
<input :id="id" :aria-describedby="`${id}Feedback`" />
<div :id="`${id}Feedback`" class="invalid-feedback">
  {{ errorMessage }}
</div>
```

### 7. Test Validation Scenarios

- Empty required fields
- Invalid formats (email, phone, etc.)
- Out of range values
- Invalid file types/sizes
- Valid submissions

## Troubleshooting

### Validation Not Triggering

**Problem**: Form submits with invalid data

**Solution**: Ensure you're calling `validate()` and toggling `validationToggle`:

```javascript
function validate() {
  validationToggle.value = !validationToggle.value
  // Check isFormValid
}
```

### Error Messages Not Showing

**Problem**: Invalid fields don't show error messages

**Solution**: Check that:

1. `errorMessage` prop is provided
2. Input has `aria-describedby` attribute
3. Error message div has matching ID

### Invalidate Events Not Firing

**Problem**: Parent form not receiving validation updates

**Solution**: Verify:

1. `@invalidate="handleInvalidate"` is bound to component
2. `handleInvalidate` function updates `invalidInputs` ref
3. Input components have `invalidate` in emit declaration

### NumberInput Shows Wrong Error

**Problem**: Error message doesn't match min/max values

**Solution**: Provide custom `errorMessage` prop:

```vue
<NumberInput :min="5" :max="20" error-message="Value must be between 5 and 20" ... />
```

### Form Always Shows Invalid

**Problem**: `isFormValid` always returns false

**Solution**: Check `invalidInputs` ref initialization:

```javascript
// Correct
const invalidInputs = ref({
  field1: false,
  field2: false,
})

// Incorrect
const invalidInputs = {
  field1: false,
  field2: false,
}
```

### Validation Clearing Too Early

**Problem**: Errors clear before user finishes typing

**Solution**: Consider adding debounce for real-time validation, or use blur events instead of change events.

### Performance Issues

**Problem**: Form validation is slow with many fields

**Solution**:

- Use debounce on validation triggers
- Validate on blur instead of every keystroke
- Minimize computed property dependencies

## Common Issues

### Q: How do I add custom validation rules?

**A**: Pass a custom `validate` function to TextInput:

```javascript
const validateEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

<TextInput
  :validate="validateEmail"
  error-message="Invalid email format"
  ...
/>
```

### Q: Can I validate cross-field dependencies?

**A**: Yes, handle it in the parent form's validate function:

```javascript
function validate() {
  // Trigger individual validations
  validationToggle.value = !validationToggle.value

  // Cross-field validation
  if (formData.startDate > formData.endDate) {
    errorMessage.value = 'Start date must be before end date'
    return
  }

  // Check overall validity
  if (!isFormValid.value) {
    errorMessage.value = 'Please correct the errors'
    return
  }
}
```

### Q: How do I persist validation state across page reloads?

**A**: Store validation state in localStorage or a Pinia store:

```javascript
// On mount
onMounted(() => {
  const savedState = localStorage.getItem('formValidation')
  if (savedState) {
    invalidInputs.value = JSON.parse(savedState)
  }
})

// On change
watch(
  invalidInputs,
  (newState) => {
    localStorage.setItem('formValidation', JSON.stringify(newState))
  },
  { deep: true },
)
```

### Q: Can I use this with TypeScript?

**A**: Yes, the composables and components are TypeScript-friendly. Define interfaces for your form data:

```typescript
interface FormData {
  username: string
  email: string
  age: number
}

const formData = ref<FormData>({
  username: '',
  email: '',
  age: 0,
})
```

### Q: How do I disable validation for certain fields?

**A**: Set `required` to false and don't provide validation props:

```vue
<TextInput id="optionalField" :required="false" v-model="formData.optionalField" />
```

### Q: Can I validate asynchronously?

**A**: Yes, use async validation in your form's validate function:

```javascript
async function validate() {
  validationToggle.value = !validationToggle.value

  // Async validation
  const isUsernameAvailable = await checkUsername(formData.username)
  if (!isUsernameAvailable) {
    errorMessage.value = 'Username already taken'
    return
  }

  if (!isFormValid.value) {
    return
  }

  // Submit form
}
```

## Additional Resources

- [Vue 3 Composition API](https://vuejs.org/guide/introduction.html)
- [Bootstrap 5 Forms](https://getbootstrap.com/docs/5.3/forms/overview/)
- [Vue I18n](https://vue-i18n.intlify.dev/)
- [Project Repository](https://github.com/MEvanAW/my-form)

# CSS/SCSS Organization Documentation

## Overview

This project uses SCSS (Sass) for styling with a modular organization to keep styles maintainable and scalable. All styles are located under `src/assets/scss/` and are structured as follows:

## Directory Structure

```
src/assets/scss/
├── main.scss          # Primary entry point SCSS file
├── _variables.scss    # SCSS variables (colors, spacing, typography, etc.)
├── _utilities.scss    # Utility classes and mixins
├── _components.scss   # Component-level styles (buttons, inputs, modals, etc.)
└── CSS_ORGANIZATION.md # This documentation file
```

## File Responsibilities

### `main.scss`

- **Purpose**: Entry point that imports all other SCSS modules.
- **Content**:
  ```scss
  // main.scss
  @import '@/assets/scss/_variables';
  @import '@/assets/scss/_utilities';
  @import '@/assets/scss/_components';
  ```
- **Role**: Combines all styling into a single CSS file during the build process.

### `_variables.scss`

- **Purpose**: Centralizes design tokens.
- **Includes**:
  - Color palette (primary, secondary, success, danger, etc.)
  - Spacing scale (margins, paddings)
  - Typography (font families, sizes, line heights)
  - Breakpoints for responsive design
- **Usage**: Imported into other SCSS files to maintain consistent theming.

### `_utilities.scss`

- **Purpose**: Defines utility classes and mixins.
- **Examples**:
  - Flexbox and grid utilities
  - Text alignment helpers
  - Margin and padding shortcuts
  - Common mixins (e.g., `button-variant`)
- **Usage**: Applied directly in component templates via class bindings.

### `_components.scss`

- **Purpose**: Styles for Vue components.
- **Structure**:
  - **Buttons**: `InfoButton.vue`, `LoadingIcon.vue`
  - **Inputs**: `NumberInput.vue`, `TextInput.vue`, `DateInput.vue`, `TimeInput.vue`
  - **Modals**: `CariKaryawanModal.vue`, `BerhasilModal.vue`
  - **Form Elements**: `SelectInput.vue`
  - **Pagination**: `MyPagination.vue`
- **Usage**: Each component imports only the SCSS it needs to keep styles scoped.

## Import Strategy

All component files import the unified `main.scss` instead of individual CSS files:

```js
// Example in Component.vue
import '@/assets/scss/main.scss'
```

This ensures:

- Single CSS output bundle
- Consistent styling across components
- Easy theming via variable modifications

## Adding New Styles

1. **Create a new partial** (e.g., `_newFeature.scss`) in `src/assets/scss/`.
2. **Add an import** to `main.scss`:
   ```scss
   @import '@/assets/scss/_newFeature';
   ```
3. **Use the new styles** in Vue components, ensuring they follow the existing naming conventions.

## Responsive Design

- Breakpoints are defined in `_variables.scss`:
  ```scss
  $breakpoint-sm: 576px;
  $breakpoint-md: 768px;
  $breakpoint-lg: 992px;
  $breakpoint-xl: 1200px;
  ```
- Utility classes use these breakpoints for media queries.

## Accessibility

- All interactive components include appropriate ARIA attributes.
- Error states use `.is-invalid` class with high-contrast styling.
- Focus states are maintained for keyboard navigation.

## Build Process

- SCSS files are compiled into a single CSS file via Vue CLI's built-in Sass support.
- The resulting CSS is minified and hashed for cache busting.

## Maintenance Tips

- **Avoid Direct Edits**: Modify variables or utilities only in their respective partial files.
- **Consistent Naming**: Follow BEM-like naming for utility classes (e.g., `text-primary`, `bg-success`).
- **Code Review**: Review new SCSS additions to ensure they align with the project's styling guidelines.

## Example Usage

```scss
/* In a component's style section */
.my-button {
  @extend .btn-primary;
  padding: $spacing-md;
}
```

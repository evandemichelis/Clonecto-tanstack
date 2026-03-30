# CLAUDE.md

## Naming Convention Policy

All identifiers in the codebase must be written in English.

This includes:

- File names
- Folder names
- Function names
- Variable names
- Component names
- Types and interfaces
- Constants
- Hooks
- Redux-related elements (actions, reducers, selectors, slices)

### Exception

Only user-facing content defined inside translation files (i18n) may use other languages.

### Rules

- Use clear, descriptive, and consistent English naming
- Avoid mixing languages in identifiers
- Prefer explicit names over abbreviations unless widely accepted
- Maintain consistency across the entire project

### Examples

**Correct:**

- `InvoiceForm.tsx`
- `useInvoiceStore`
- `calculateTotalAmount`
- `invoiceReducer`

**Incorrect:**

- `FormulaireFacture.tsx`
- `useMagasinFacture`
- `calculerTotal`
- `reducteurFacture`

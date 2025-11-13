# Tailwind Catalyst UI Components Reference

The project has access to **Tailwind Catalyst UI** components from Tailwind Plus subscription. These are production-ready, accessible components that should be used instead of building from scratch.

## Available Catalyst Components

### Forms & Inputs
- **Button** - Multiple variants with proper states
- **Input** - Text fields with validation states
- **Select** - Dropdowns with search
- **Textarea** - Multi-line text input
- **Checkbox** - Single and group checkboxes
- **Radio Group** - Radio button sets
- **Switch** - Toggle switches
- **Fieldset** - Form field grouping
- **Field** - Form field wrapper with label and errors

### Layout & Navigation
- **Sidebar Layout** - Responsive sidebar with navigation
- **Navbar** - Top navigation bar
- **Dropdown** - Menu dropdown component
- **Stack Layout** - Vertical/horizontal stacking

### Data Display
- **Table** - Feature-rich data tables with sorting
- **Avatar** - User/entity avatars with fallbacks
- **Badge** - Status and tag badges
- **Description List** - Key-value pair display
- **Divider** - Section separators

### Feedback
- **Alert** - Notification messages
- **Dialog** - Modal dialogs
- **Heading** - Semantic headings with hierarchy
- **Text** - Typography component
- **Link** - Styled links

## Installation

Catalyst components are typically installed via:
```bash
npm install @tailwindcss/catalyst
```

Or accessed through Catalyst UI website if subscribed.

## Usage Pattern

Catalyst components follow consistent patterns:

```jsx
import { Button } from '@/components/catalyst/button'
import { Input, Field } from '@/components/catalyst/input'
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@/components/catalyst/table'

function MyComponent() {
  return (
    <Field>
      <Label>Email</Label>
      <Input type="email" name="email" />
    </Field>
  )
}
```

## Key Advantages

1. **Accessible by default** - WCAG compliant, keyboard navigation
2. **Professionally designed** - Tailwind team's design standards
3. **Well-tested** - Production-ready components
4. **Consistent API** - Similar props patterns across components
5. **Customizable** - Built with Tailwind, easy to style
6. **TypeScript support** - Full type definitions

## Integration Strategy

### For This Project

1. **Use Catalyst for base components**:
   - All form inputs and controls
   - Buttons and navigation
   - Tables and data display
   - Dialogs and alerts
   - Layout primitives

2. **Build domain-specific components on top**:
   - `ProviderCard` (uses Catalyst Card + Avatar + Badge)
   - `InvoiceTable` (uses Catalyst Table + custom columns)
   - `StatusBadge` (uses Catalyst Badge + custom colors)
   - `ProviderForm` (uses Catalyst Field + Input + Select)

3. **Example composition**:
```jsx
// Custom component using Catalyst primitives
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/catalyst/table'
import { Badge } from '@/components/catalyst/badge'
import { Button } from '@/components/catalyst/button'

function InvoiceTable({ invoices }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Invoice #</TableHeader>
          <TableHeader>Provider</TableHeader>
          <TableHeader>Amount</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.number}</TableCell>
            <TableCell>{invoice.provider}</TableCell>
            <TableCell>${invoice.amount}</TableCell>
            <TableCell>
              <StatusBadge status={invoice.status} />
            </TableCell>
            <TableCell>
              <Button size="sm">View</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## Component Locations

Catalyst components are typically placed in:
```
frontend/src/components/catalyst/
├── button.jsx
├── input.jsx
├── table.jsx
├── dialog.jsx
├── badge.jsx
└── ... (other components)
```

Or can be imported from `@tailwindcss/catalyst` if installed as package.

## Customization

Catalyst components can be customized through:
1. **Tailwind classes** - Pass className prop
2. **Component variants** - Use built-in variant props
3. **Wrapper components** - Create domain-specific wrappers

```jsx
// Wrapping Catalyst for domain needs
function InvoiceStatusBadge({ status }) {
  const colors = {
    draft: 'gray',
    pending: 'yellow',
    approved: 'blue',
    paid: 'green',
    overdue: 'red'
  }

  return <Badge color={colors[status]}>{status}</Badge>
}
```

## Documentation Access

Reference the Catalyst documentation at:
- https://tailwindcss.com/docs/catalyst (if available)
- Or through Tailwind Plus account dashboard

## Best Practices

1. **Don't reinvent**: Always check if Catalyst has the component first
2. **Compose, don't fork**: Build on top of Catalyst rather than modifying
3. **Consistent imports**: Use same import paths across project
4. **Type safety**: Leverage TypeScript types from Catalyst
5. **Accessibility**: Trust Catalyst's a11y implementation
6. **Performance**: Catalyst components are optimized, use as-is

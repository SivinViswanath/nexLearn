# Design Integration Guide

## Overview

This guide will help you integrate your Figma designs into the existing application structure. All pages are already built with a clean, professional design, but you can customize them to match your exact Figma specifications.

## Page Components Ready for Design Integration

### 1. Login Page (`/login`)

**Location**: `src/app/login/page.js`

**Current Structure**:

- Centered card layout
- Email and password inputs
- Submit button
- Error message display
- Gradient background

**Customization Points**:

```javascript
// Background gradient
className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"

// Card styling
<Card className="w-full max-w-md">

// Input fields
<Input label="Email Address" />
<Input label="Password" type="password" />

// Button
<Button variant="primary" size="lg" className="w-full">
```

**To Match Your Design**:

1. Update background colors/gradient
2. Modify card width and padding
3. Adjust input styling in `src/components/ui/Input.js`
4. Change button colors in `src/components/ui/Button.js`
5. Add logo/branding elements

---

### 2. Instructions Page (`/instructions`)

**Location**: `src/app/instructions/page.js`

**Current Structure**:

- Header with test info (duration, questions)
- Numbered instruction list
- Warning box
- Terms checkbox
- Action buttons

**Customization Points**:

```javascript
// Header icons
<svg className="w-5 h-5" fill="none" stroke="currentColor">

// Instruction list
<ul className="space-y-3">
  <li className="flex gap-3">
    <span className="flex-shrink-0 w-6 h-6 bg-blue-100">

// Warning box
<div className="bg-yellow-50 border border-yellow-200">

// Checkbox
<input type="checkbox" className="w-4 h-4 text-blue-600">
```

**To Match Your Design**:

1. Update icon styles and colors
2. Modify list item appearance
3. Customize warning box design
4. Adjust button placement and styling
5. Add any additional sections from Figma

---

### 3. MCQ Test Page (`/mcq`)

**Location**: `src/app/mcq/page.js`

**Current Structure**:

- Header with timer
- Question card (left side)
- Question navigator (right sidebar)
- Option selection buttons
- Navigation buttons

**Customization Points**:

```javascript
// Timer display
<div className="flex items-center gap-2 text-lg font-semibold">
  <span className={timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}>

// Question card
<Card>
  <CardHeader>
    <h2 className="text-lg font-semibold">

// Option buttons
<button className={`w-full text-left p-4 rounded-lg border-2 ${
  answers[currentQuestion.id] === index
    ? 'border-blue-600 bg-blue-50'
    : 'border-gray-200'
}`}>

// Navigator grid
<div className="grid grid-cols-5 gap-2">
  <button className={`aspect-square rounded-lg ${
    index === currentQuestionIndex
      ? 'bg-blue-600 text-white'
      : 'bg-gray-100'
  }`}>
```

**To Match Your Design**:

1. Adjust timer styling and position
2. Modify question card layout
3. Customize option button appearance
4. Update navigator grid styling
5. Change color scheme for answered/unanswered states
6. Adjust responsive breakpoints

---

### 4. Result Page (`/result`)

**Location**: `src/app/result/page.js`

**Current Structure**:

- Success/failure icon
- Circular progress indicator
- Score percentage
- Statistics grid (total, correct, incorrect, unanswered)
- Performance message
- Action buttons

**Customization Points**:

```javascript
// Success icon
<div className="w-20 h-20 bg-green-100 rounded-full">
  <svg className="w-10 h-10 text-green-600">

// Circular progress
<svg className="w-full h-full transform -rotate-90">
  <circle stroke={isPassed ? '#10b981' : '#ef4444'}>

// Statistics cards
<div className="bg-blue-50 rounded-lg p-4 text-center">
  <div className="text-3xl font-bold text-blue-600">

// Performance message
<div className={`rounded-lg p-4 ${
  isPassed ? 'bg-green-50' : 'bg-yellow-50'
}`}>
```

**To Match Your Design**:

1. Update icon styles
2. Modify circular progress colors and size
3. Customize statistics card design
4. Adjust message box styling
5. Change button layout
6. Add additional result metrics

---

## UI Component Customization

### Button Component

**Location**: `src/components/ui/Button.js`

**Variants Available**:

- `primary` - Main actions (blue)
- `secondary` - Secondary actions (gray)
- `outline` - Outlined style
- `ghost` - Minimal style
- `danger` - Destructive actions (red)

**Sizes Available**:

- `sm` - Small
- `md` - Medium (default)
- `lg` - Large

**To Customize**:

```javascript
const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  // Update colors here
};

const sizes = {
  md: 'px-4 py-2 text-base',
  // Update sizes here
};
```

---

### Card Component

**Location**: `src/components/ui/Card.js`

**Parts**:

- `Card` - Container
- `CardHeader` - Top section
- `CardContent` - Main content
- `CardFooter` - Bottom section

**To Customize**:

```javascript
// Update base card styling
className = 'bg-white rounded-lg shadow-md border border-gray-200';

// Update header
className = 'px-6 py-4 border-b border-gray-200';
```

---

### Input Component

**Location**: `src/components/ui/Input.js`

**Features**:

- Label support
- Error message display
- Focus states
- Validation styling

**To Customize**:

```javascript
// Update input styling
className =
  'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500';

// Update error styling
error ? 'border-red-500' : 'border-gray-300';
```

---

## Color Scheme Customization

### Global Colors

**Location**: `src/app/globals.css`

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Blue */
  --secondary: 210 40% 96.1%; /* Gray */
  --destructive: 0 84.2% 60.2%; /* Red */
  /* Update these values to match your brand */
}
```

### Tailwind Colors

Update throughout components:

```javascript
// Current primary color
'bg-blue-600'    → 'bg-[your-color]'
'text-blue-600'  → 'text-[your-color]'
'border-blue-600' → 'border-[your-color]'
```

---

## Typography Customization

### Font Family

**Location**: `src/app/layout.js`

```javascript
import { Inter } from 'next/font/google';
// Change to your preferred font

const inter = Inter({ subsets: ['latin'] });
// Or: const yourFont = YourFont({ subsets: ['latin'] });
```

### Font Sizes

Update in components:

```javascript
'text-sm'; // 14px
'text-base'; // 16px
'text-lg'; // 18px
'text-xl'; // 20px
'text-2xl'; // 24px
'text-3xl'; // 30px
```

---

## Spacing Customization

### Padding/Margin

```javascript
'p-4'; // 1rem (16px)
'p-6'; // 1.5rem (24px)
'p-8'; // 2rem (32px)

'px-4'; // Horizontal padding
'py-4'; // Vertical padding
```

### Gap

```javascript
'gap-2'; // 0.5rem (8px)
'gap-4'; // 1rem (16px)
'gap-6'; // 1.5rem (24px)
```

---

## Responsive Design

### Breakpoints

```javascript
// Mobile first approach
'w-full'; // Mobile
'md:w-1/2'; // Tablet (768px+)
'lg:w-1/3'; // Desktop (1024px+)
'xl:w-1/4'; // Large desktop (1280px+)
```

### Grid Layouts

```javascript
// Mobile: 1 column, Desktop: 2 columns
'grid grid-cols-1 lg:grid-cols-2';

// Mobile: 1 column, Tablet: 2, Desktop: 4
'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
```

---

## Integration Workflow

### Step 1: Export Figma Assets

1. Export icons as SVG
2. Export images (optimized)
3. Note exact colors (hex codes)
4. Note font sizes and weights
5. Note spacing values

### Step 2: Update Colors

1. Update `globals.css` CSS variables
2. Replace Tailwind color classes
3. Update button variants
4. Update card styling

### Step 3: Update Typography

1. Import custom fonts if needed
2. Update font sizes
3. Update font weights
4. Update line heights

### Step 4: Update Layouts

1. Adjust card widths
2. Update spacing (padding/margin)
3. Modify grid layouts
4. Update responsive breakpoints

### Step 5: Add Custom Elements

1. Add logos/branding
2. Add custom icons
3. Add background patterns
4. Add animations if needed

### Step 6: Test Responsiveness

1. Test on mobile (375px, 414px)
2. Test on tablet (768px, 1024px)
3. Test on desktop (1280px, 1920px)
4. Test on different browsers

---

## Quick Customization Examples

### Example 1: Change Primary Color to Purple

```javascript
// In components, replace:
'bg-blue-600'    → 'bg-purple-600'
'text-blue-600'  → 'text-purple-600'
'border-blue-600' → 'border-purple-600'
'hover:bg-blue-700' → 'hover:bg-purple-700'
```

### Example 2: Add Logo to Login Page

```javascript
// In src/app/login/page.js, add before the card:
<div className="mb-8 text-center">
  <img src="/logo.png" alt="Logo" className="h-16 mx-auto" />
</div>
```

### Example 3: Customize Button Radius

```javascript
// In src/components/ui/Button.js:
'rounded-lg' → 'rounded-full' // For pill-shaped buttons
'rounded-lg' → 'rounded-none' // For square buttons
```

### Example 4: Add Background Pattern

```javascript
// In page backgrounds:
className = 'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100';
// Change to:
className = "min-h-screen bg-[url('/pattern.svg')] bg-cover";
```

---

## Design Checklist

Before considering design integration complete:

- [ ] All colors match Figma
- [ ] Typography matches (font, size, weight)
- [ ] Spacing matches (padding, margin, gap)
- [ ] Border radius matches
- [ ] Shadows match
- [ ] Icons match or are replaced
- [ ] Logo/branding added
- [ ] Responsive on all devices
- [ ] Hover states work correctly
- [ ] Focus states are visible
- [ ] Loading states look good
- [ ] Error states are clear
- [ ] Success states are celebratory

---

## Tips for Pixel-Perfect Implementation

1. **Use Browser DevTools**: Inspect Figma designs and match exact values
2. **Use Tailwind Arbitrary Values**: `w-[347px]` for exact widths
3. **Custom CSS When Needed**: Add to `globals.css` for complex styles
4. **Test on Real Devices**: Emulators don't always match real behavior
5. **Use Figma Inspect**: Get exact CSS values from Figma
6. **Maintain Consistency**: Use design tokens/variables

---

## Need Help?

1. Check component files for current implementation
2. Review Tailwind CSS documentation
3. Use browser DevTools to inspect elements
4. Test changes in development mode
5. Refer to Next.js documentation for advanced features

---

**Ready to integrate your designs!** Share your Figma designs and I'll help you implement them pixel-perfectly.

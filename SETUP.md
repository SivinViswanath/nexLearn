# MCQ Assessment Platform - Setup Guide

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=MCQ Assessment Platform
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Dependencies Installed

### Core Dependencies

- `next@16.0.2` - React framework
- `react@19.2.0` - UI library
- `react-dom@19.2.0` - React DOM renderer

### State Management

- `@reduxjs/toolkit@^2.2.7` - Redux state management
- `react-redux@^9.1.2` - React bindings for Redux

### HTTP & Authentication

- `axios@^1.7.7` - HTTP client with interceptors
- `js-cookie@^3.0.5` - Cookie management

### Utilities

- `clsx@^2.1.1` - Conditional className utility

### Dev Dependencies

- `tailwindcss@^4` - CSS framework
- `@tailwindcss/postcss@^4` - PostCSS plugin
- `eslint@^9` - Code linting
- `eslint-config-next@16.0.2` - Next.js ESLint config

## Project Architecture

### State Management (Redux)

**Auth Slice** (`src/store/slices/authSlice.js`)

- Manages user authentication state
- Handles login/logout
- Token storage in cookies
- Token refresh mechanism

**MCQ Slice** (`src/store/slices/mcqSlice.js`)

- Manages test questions
- Tracks user answers
- Timer functionality
- Test submission state

### API Layer

**Axios Instance** (`src/lib/api/axiosInstance.js`)

- Configured base URL
- Request interceptor: Adds JWT token to headers
- Response interceptor: Handles 401 errors and token refresh
- Automatic retry on token refresh

**API Modules**

- `authApi.js` - Authentication endpoints
- `mcqApi.js` - Question and result endpoints

### Component Structure

**UI Components** (`src/components/ui/`)

- `Button.js` - Reusable button with variants
- `Card.js` - Card container components
- `Input.js` - Form input with validation
- `Loading.js` - Loading spinner

**Pages** (`src/app/`)

- `login/` - Authentication page
- `instructions/` - Test instructions
- `mcq/` - Main test interface
- `result/` - Results display

### Routing & Middleware

**Middleware** (`src/middleware.js`)

- Protected route authentication
- Automatic redirects
- Cookie-based auth check

**App Router**

- File-based routing
- Nested layouts
- Metadata for SEO

## Features Implementation

### 1. Authentication Flow

```
Login → Validate → Store JWT → Redirect to Instructions
         ↓
    Token Refresh (on 401)
         ↓
    Auto Logout (on refresh fail)
```

### 2. Test Flow

```
Instructions → Start Test → Answer Questions → Submit → View Results
                  ↓
              Timer Countdown
                  ↓
            Auto Submit (on timeout)
```

### 3. Timer Implementation

- Starts when test begins
- Counts down in real-time
- Visual warning at 5 minutes
- Auto-submits at 0:00
- Persists in Redux state

### 4. Question Navigation

- Grid-based navigator
- Visual indicators (answered/unanswered/current)
- Click to jump to any question
- Previous/Next buttons
- Submit button on last question

## Styling Guide

### Tailwind Configuration

Using Tailwind CSS 4 with custom design tokens:

```css
Primary: Blue (#3B82F6)
Secondary: Gray
Success: Green
Error: Red
Warning: Yellow
```

### Responsive Breakpoints

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Component Patterns

**Card Pattern**

```jsx
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>
```

**Button Variants**

- `primary` - Main actions
- `secondary` - Secondary actions
- `outline` - Outlined style
- `ghost` - Minimal style
- `danger` - Destructive actions

## Performance Optimizations

1. **Code Splitting**: Automatic with Next.js App Router
2. **Image Optimization**: next/image with AVIF/WebP
3. **Font Optimization**: next/font with Inter
4. **Compression**: Enabled in production
5. **Console Removal**: Automatic in production build
6. **Lazy Loading**: Components loaded on demand

## SEO Implementation

1. **Metadata**: Page-specific titles and descriptions
2. **Semantic HTML**: Proper heading hierarchy
3. **Sitemap**: Auto-generated sitemap.xml
4. **Robots.txt**: Crawler instructions
5. **Open Graph**: Social media previews (ready)
6. **Structured Data**: Schema.org markup (ready)

## Accessibility Features

1. **Keyboard Navigation**: Full keyboard support
2. **ARIA Labels**: Proper labeling for screen readers
3. **Focus Management**: Visible focus indicators
4. **Color Contrast**: WCAG AA compliant
5. **Semantic HTML**: Proper element usage
6. **Form Validation**: Clear error messages

## Security Measures

1. **JWT Storage**: HTTP-only cookies (recommended)
2. **XSS Protection**: Security headers
3. **CSRF Protection**: Token-based
4. **Input Validation**: Client and server-side
5. **Secure Headers**: X-Frame-Options, CSP, etc.

## Testing Recommendations

### Unit Tests

```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test
```

### E2E Tests

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npm run test:e2e
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables (Production)

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

## Troubleshooting

### Common Issues

**Issue**: "Module not found" errors
**Solution**: Run `npm install` to ensure all dependencies are installed

**Issue**: API calls failing
**Solution**: Check `.env.local` has correct API URL

**Issue**: Authentication not working
**Solution**: Verify cookies are enabled and API returns correct JWT format

**Issue**: Styles not applying
**Solution**: Restart dev server after Tailwind config changes

## API Contract

### Expected API Responses

**Login**

```json
POST /api/auth/login
{
  "user": { "id": 1, "name": "John", "email": "john@example.com" },
  "token": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

**Questions**

```json
GET /api/questions
{
  "questions": [
    {
      "id": 1,
      "question": "Question text?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": 2
    }
  ]
}
```

**Submit**

```json
POST /api/questions/submit
{
  "id": "result_id",
  "score": 85,
  "correct": 17,
  "incorrect": 2,
  "unanswered": 1
}
```

## Next Steps

1. Connect to your backend API
2. Customize branding and colors
3. Add additional features (e.g., answer review)
4. Implement analytics
5. Add more question types
6. Create admin dashboard

## Support

For issues or questions:

1. Check the documentation
2. Review the code comments
3. Check Next.js documentation
4. Review Redux Toolkit docs

## License

MIT

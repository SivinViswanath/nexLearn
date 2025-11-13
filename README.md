# MCQ Assessment Platform

A modern, production-ready Next.js application for conducting online multiple-choice question assessments with JWT authentication and real-time timer functionality.

## Features

- **JWT Authentication**: Secure token-based authentication with automatic token refresh
- **State Management**: Redux Toolkit for efficient state management
- **Responsive Design**: Fully mobile-responsive using Tailwind CSS
- **Real-time Timer**: Countdown timer with auto-submit functionality
- **Question Navigation**: Easy navigation between questions with visual indicators
- **Result Analytics**: Detailed performance analysis and score visualization
- **SEO Optimized**: Proper metadata and semantic HTML
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Performance**: Optimized for fast loading and smooth user experience

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios with interceptors
- **Authentication**: JWT with cookie storage

## Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── login/             # Login page
│   │   ├── instructions/      # Test instructions page
│   │   ├── mcq/              # MCQ test page
│   │   ├── result/           # Results page
│   │   ├── layout.js         # Root layout
│   │   └── page.js           # Home page (redirects to login)
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── Button.js
│   │   │   ├── Card.js
│   │   │   ├── Input.js
│   │   │   └── Loading.js
│   │   └── Providers.js      # Redux provider wrapper
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js  # Authentication state
│   │   │   └── mcqSlice.js   # MCQ test state
│   │   └── index.js          # Store configuration
│   ├── lib/
│   │   ├── api/
│   │   │   ├── axiosInstance.js  # Axios config with interceptors
│   │   │   ├── authApi.js        # Auth API calls
│   │   │   └── mcqApi.js         # MCQ API calls
│   │   └── utils.js          # Utility functions
│   └── hooks/
│       └── useAuth.js        # Authentication hook
├── public/                    # Static assets
├── .env.local                # Environment variables
└── package.json

```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Pages

### 1. Login (`/login`)

- Email and password authentication
- Form validation
- Error handling
- Redirects to instructions on success

### 2. Instructions (`/instructions`)

- Test rules and guidelines
- Duration and question count display
- Terms acceptance checkbox
- Start test button

### 3. MCQ Test (`/mcq`)

- Question display with multiple choice options
- Real-time countdown timer
- Question navigator panel
- Answer selection and modification
- Auto-submit on timeout
- Progress tracking

### 4. Results (`/result`)

- Score visualization with circular progress
- Detailed statistics (correct, incorrect, unanswered)
- Performance feedback
- Retake test option

## State Management

### Auth Slice

- User authentication state
- Token management
- Login/logout actions

### MCQ Slice

- Questions data
- User answers
- Timer state
- Current question tracking
- Test submission state

## API Integration

### Axios Interceptors

- Automatic token attachment to requests
- Token refresh on 401 errors
- Error handling and retry logic
- Automatic redirect on auth failure

### API Endpoints (Expected)

```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
GET  /api/questions
POST /api/questions/submit
GET  /api/results/:id
GET  /api/instructions
```

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Design System**: Consistent colors, spacing, and typography
- **Responsive Breakpoints**: Mobile-first approach
- **Dark Mode Ready**: CSS variables for easy theming

## Performance Optimizations

- Code splitting with Next.js App Router
- Image optimization
- Font optimization with next/font
- Compression enabled
- Console removal in production
- Efficient re-renders with Redux

## Accessibility Features

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Color contrast compliance

## Security

- JWT token storage in HTTP-only cookies
- XSS protection headers
- CSRF protection
- Secure API communication
- Input validation and sanitization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

1. Follow the existing code structure
2. Use meaningful component and variable names
3. Add comments for complex logic
4. Ensure responsive design
5. Test on multiple devices

## License

MIT

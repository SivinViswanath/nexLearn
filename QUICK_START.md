# Quick Start Guide - MCQ Assessment Platform

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies (Already Done ✅)

```bash
cd client
npm install
```

**Status**: ✅ Complete - 376 packages installed, 0 vulnerabilities

### Step 2: Configure Environment

The `.env.local` file is already created. Update if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Step 3: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser

---

## 📱 Test the Application

### 1. Login Page (/)

- Navigate to http://localhost:3000
- You'll see the login page
- Enter any email/password (demo mode)
- Click "Sign In"

### 2. Instructions Page (/instructions)

- Read the test instructions
- Check the terms checkbox
- Click "Start Assessment"

### 3. MCQ Test Page (/mcq)

- Answer questions by clicking options
- Use Previous/Next buttons
- Watch the timer countdown
- Use the question navigator on the right
- Click "Submit Test" when done

### 4. Result Page (/result)

- View your score and statistics
- See correct/incorrect/unanswered counts
- Click "Retake Test" to start over

---

## 🎨 Integrate Your Figma Design

### Ready to Customize?

1. **Share Your Figma Design**

   - Export design specifications
   - Note colors, fonts, spacing
   - Export any custom icons/images

2. **Update Components**

   - See `DESIGN_INTEGRATION.md` for detailed guide
   - Update colors in component files
   - Modify layouts as needed
   - Add your branding/logo

3. **Test Responsiveness**
   - Test on mobile (375px, 414px)
   - Test on tablet (768px, 1024px)
   - Test on desktop (1280px+)

---

## 🔌 Connect Your Backend API

### Update API Configuration

1. **Set API URL**

   ```env
   # .env.local
   NEXT_PUBLIC_API_URL=https://your-api.com/api
   ```

2. **API Endpoints Expected**

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

3. **Expected Response Formats**

   **Login Response:**

   ```json
   {
     "user": {
       "id": 1,
       "name": "John Doe",
       "email": "john@example.com"
     },
     "token": "jwt_access_token_here",
     "refreshToken": "jwt_refresh_token_here"
   }
   ```

   **Questions Response:**

   ```json
   {
     "questions": [
       {
         "id": 1,
         "question": "What is 2+2?",
         "options": ["2", "3", "4", "5"],
         "correctAnswer": 2
       }
     ]
   }
   ```

   **Submit Response:**

   ```json
   {
     "id": "result_123",
     "score": 85,
     "correct": 17,
     "incorrect": 2,
     "unanswered": 1,
     "total": 20,
     "percentage": "85.00"
   }
   ```

---

## 📦 Project Structure Overview

```
client/
├── src/
│   ├── app/                    # Pages (Next.js App Router)
│   │   ├── login/             # Login page
│   │   ├── instructions/      # Instructions page
│   │   ├── mcq/              # MCQ test page
│   │   └── result/           # Results page
│   │
│   ├── components/
│   │   └── ui/               # Reusable UI components
│   │
│   ├── store/                # Redux state management
│   │   └── slices/           # Auth & MCQ slices
│   │
│   ├── lib/
│   │   └── api/              # API integration
│   │
│   └── hooks/                # Custom React hooks
│
├── public/                   # Static assets
├── .env.local               # Environment variables
└── Documentation files
```

---

## 🛠️ Available Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
```

---

## 🎯 Key Features

### ✅ Authentication

- JWT token-based auth
- Automatic token refresh
- Protected routes
- Secure cookie storage

### ✅ State Management

- Redux Toolkit
- Centralized state
- Persistent data

### ✅ UI Components

- Button (5 variants)
- Card (flexible layout)
- Input (with validation)
- Loading (spinner)

### ✅ Responsive Design

- Mobile-first
- Tablet optimized
- Desktop enhanced

### ✅ Performance

- Code splitting
- Image optimization
- Fast page loads

### ✅ SEO

- Meta tags
- Sitemap
- Semantic HTML

---

## 📝 Customization Quick Tips

### Change Primary Color

Replace `blue-600` with your color throughout components:

```javascript
// Before
className = 'bg-blue-600 text-white';

// After
className = 'bg-purple-600 text-white';
```

### Add Logo

In `src/app/login/page.js`:

```javascript
<div className="mb-6 text-center">
  <img src="/logo.png" alt="Logo" className="h-12 mx-auto" />
</div>
```

### Change Font

In `src/app/layout.js`:

```javascript
import { Roboto } from 'next/font/google';
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'] });
```

### Update Timer Duration

In `src/app/instructions/page.js`:

```javascript
// Change duration (in minutes)
dispatch(startTest(60 * 60)); // 60 minutes
```

---

## 🐛 Troubleshooting

### Issue: Port 3000 already in use

```bash
# Use different port
PORT=3001 npm run dev
```

### Issue: API calls failing

- Check `.env.local` has correct API URL
- Verify API is running
- Check browser console for errors

### Issue: Styles not applying

- Restart dev server
- Clear browser cache
- Check Tailwind classes are correct

### Issue: Build errors

```bash
# Clean and rebuild
rm -rf .next
npm run build
```

---

## 📚 Documentation Files

1. **README.md** - Project overview
2. **SETUP.md** - Detailed setup guide
3. **IMPLEMENTATION_GUIDE.md** - Technical details
4. **DESIGN_INTEGRATION.md** - Figma integration guide
5. **FEATURES_CHECKLIST.md** - Complete features list
6. **PROJECT_SUMMARY.md** - Project summary
7. **QUICK_START.md** - This file

---

## 🎓 Learning Resources

### Next.js

- Docs: https://nextjs.org/docs
- App Router: https://nextjs.org/docs/app

### Redux Toolkit

- Docs: https://redux-toolkit.js.org
- Tutorial: https://redux-toolkit.js.org/tutorials/quick-start

### Tailwind CSS

- Docs: https://tailwindcss.com/docs
- Cheatsheet: https://nerdcave.com/tailwind-cheat-sheet

---

## ✅ Checklist Before Going Live

- [ ] Update `.env.local` with production API URL
- [ ] Test all pages and functionality
- [ ] Verify authentication flow
- [ ] Test on mobile devices
- [ ] Check accessibility
- [ ] Run production build
- [ ] Test production build locally
- [ ] Set up error monitoring
- [ ] Configure analytics (optional)
- [ ] Deploy to hosting platform

---

## 🚀 Deployment Options

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm run build
# Upload .next folder
```

### Docker

```bash
docker build -t mcq-app .
docker run -p 3000:3000 mcq-app
```

---

## 💬 Need Help?

1. Check documentation files
2. Review code comments
3. Check Next.js documentation
4. Review Redux Toolkit docs
5. Check Tailwind CSS docs

---

## 🎉 You're All Set!

Your MCQ Assessment Platform is ready to use. Start the dev server and begin customizing!

```bash
npm run dev
```

**Happy Coding! 🚀**

---

**Status**: ✅ Ready to Use
**Build**: ✅ Successful
**Dependencies**: ✅ Installed
**Documentation**: ✅ Complete

# Your Kigali Bestie - Personal Concierge Platform

A modern, premium React application built with TypeScript and Tailwind CSS for the "Your Kigali Bestie" personal concierge service.

## 🎯 Project Overview

This is a clean, friendly, and professional UI for a personal concierge website that helps people in Kigali with various services like housing search, translation, event planning, and more.

## 🛠 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Navigation
- **Lucide React** - Icon library

## 📁 Project Structure

```
src/
├── pages/
│   ├── Home.tsx              # Landing page with hero, services preview, reviews
│   ├── StarterGuide.tsx      # 24-hour guide with essential Kigali info
│   ├── Services.tsx          # Complete services listing
│   ├── BookHousing.tsx       # Housing booking form
│   └── BookTranslator.tsx    # Translator booking form
├── components/
│   ├── Navbar.tsx            # Navigation bar with mobile menu
│   ├── Footer.tsx            # Footer with contact info
│   ├── ServiceCard.tsx       # Reusable service card component
│   └── ReviewSection.tsx     # Client reviews display
├── data/
│   ├── services.ts           # Mock services data
│   └── reviews.ts            # Mock reviews data
├── utils/
│   └── whatsapp.ts           # WhatsApp integration utility
├── App.tsx                   # Main app with routing
├── main.tsx                  # Entry point
└── index.css                 # Tailwind directives
```

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📱 Pages & Features

### Home Page
- Hero section with call-to-action
- "Why Choose Us" section (3 key benefits)
- Featured services preview
- Client testimonials
- Final CTA section

### Starter Guide
- First 24 Hours section (SIM, mobile money, forex)
- Emergency contacts (hospitals, police, ambulance)
- Must-have apps (food delivery, transportation)
- Internet & WiFi options
- Housing options with booking button

### Services Page
- Grid display of all 6 available services
- Each service has WhatsApp integration
- Additional section for custom requests

### Book Housing
- Form with fields: Type, Location, Rooms, Budget
- Form validation and submission
- Mock data handling with console logging

### Book Translator
- Language selection (English/French/Both)
- Duration options (Hourly/Weekly/Monthly)
- Form submission with mock handling

## 🎨 Design Features

- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Color Scheme**: 
  - Primary: Indigo (Tailwind indigo-600)
  - Neutral backgrounds: Gray-50, gray-900 for footer
- **Typography**: System font stack for fast loading
- **Spacing**: Tailwind spacing utilities for consistent layout
- **Shadows**: Subtle shadows for depth
- **Icons**: Lucide React for clean, modern icons

## 🔌 WhatsApp Integration

The app includes WhatsApp integration for service requests:

```typescript
openWhatsApp("Hello, I need help with Personal Assistance")
```

This opens WhatsApp with a pre-filled message to: **+250 798 891 543**

## 📊 Mock Data

### Services
- Personal Assistance
- Errand Running
- Event Planning
- House Sitting
- Moving Help
- Translator Services

### Reviews
- 4 sample reviews from satisfied clients
- Star ratings and testimonials

## 🎯 Key Components

### Navbar
- Sticky navigation with logo
- Responsive mobile menu
- Links to all major pages

### Footer
- Contact information
- Quick links
- Company tagline
- Copyright notice

### ServiceCard
- Reusable component for displaying services
- "Request via WhatsApp" button
- Consistent styling

### ReviewSection
- Grid layout for testimonials
- Star ratings
- Author information

## 🔧 Configuration

### Tailwind Config
Customized with indigo/blue color scheme for premium feel.

### PostCSS Config
Uses `@tailwindcss/postcss` for modern Tailwind CSS integration.

## 📝 Environment

- Node.js 16+
- npm 7+ or yarn

## 🚦 Development Workflow

1. Edit components in `src/`
2. Changes hot-reload automatically with Vite
3. Run `npm run build` before deployment
4. Test with `npm run preview`

## 💡 Future Enhancements

- [ ] Backend API integration
- [ ] User authentication
- [ ] Payment processing
- [ ] Booking calendar
- [ ] Real WhatsApp messages
- [ ] User dashboard
- [ ] Service tracking
- [ ] Rating system improvements

## 📄 License

All rights reserved - Your Kigali Bestie

## 📞 Contact

- Phone: +250 798 891 543
- Tagline: "Providing services nobody talks about"
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

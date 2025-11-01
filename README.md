# Smart Kitchen IoT App

## Project Overview

This is a native cross-platform mobile app for managing IoT kitchen devices, built with React Native and Expo.

**Platform**: Native iOS & Android app, exportable to web  
**Framework**: Expo Router + React Native

## Features

- **Device Management**: Monitor and control IoT kitchen devices
- **Inventory Tracking**: Keep track of kitchen inventory items
- **Analytics Dashboard**: View usage statistics and trends
- **Real-time Updates**: Live data from connected devices
- **Cross-platform**: Works on iOS, Android, and Web

## How to Run the App

### Prerequisites

- Node.js (v16 or later)
- Bun or npm package manager
- Expo CLI

### Installation Steps

```bash
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd smart-kitchen-app

# Step 3: Install dependencies
bun install
# or
npm install

# Step 4: Start the development server
bun run start
# or
npm run start

# Step 5: Start web preview (optional)
bun run start-web
# or
npm run start-web
```

## Tech Stack

This project uses modern mobile development technologies:

- **React Native** - Cross-platform native mobile development framework
- **Expo** - Platform and tools for React Native development
- **Expo Router** - File-based routing system with support for web and native
- **TypeScript** - Type-safe JavaScript
- **React Query** - Server state management
- **Zustand** - State management
- **Lucide React Native** - Beautiful icons
- **NativeWind** - Utility-first CSS framework

## Testing Your App

### On Your Phone (Recommended)

1. **iOS**: Download [Expo Go](https://apps.apple.com/app/expo-go/id982107779) from the App Store
2. **Android**: Download [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from Google Play
3. Run `bun run start` and scan the QR code with Expo Go

### In Your Browser

Run `bun run start-web` to test in a web browser. Note: Some native features may not be available in the browser.

### Using Simulators

If you have Xcode (iOS) or Android Studio installed:

```bash
# iOS Simulator
bun run start -- --ios

# Android Emulator
bun run start -- --android
```

## Project Structure

```
├── app/                    # App screens (Expo Router)
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── _layout.tsx    # Tab layout configuration
│   │   ├── dashboard.tsx  # Dashboard screen
│   │   ├── inventory.tsx  # Inventory management
│   │   ├── analytics.tsx  # Analytics dashboard
│   │   └── profile.tsx    # User profile
│   ├── device/           # Device detail screens
│   ├── _layout.tsx       # Root layout
│   ├── login.tsx         # Login screen
│   ├── signup.tsx        # Signup screen
│   └── splash.tsx        # Splash screen
├── components/           # Reusable components
├── constants/           # App constants and colors
├── context/            # React contexts
├── utils/              # Utility functions and API
└── assets/             # Static assets
```

## App Features

- **Authentication**: User login and registration
- **Device Dashboard**: View and manage IoT devices
- **Inventory Management**: Track kitchen items and expiration dates
- **Analytics**: Usage statistics and trends
- **Real-time Data**: Live updates from connected devices
- **Cross-platform**: iOS, Android, and Web support

## API Integration

The app connects to a backend API for:
- User authentication
- Device management
- Inventory tracking
- Real-time data updates

Backend endpoint: `https://iot-backend-plhm.onrender.com`

## Development

### Adding New Features

1. Create new screens in the `app/` directory
2. Add reusable components in `components/`
3. Update navigation in layout files
4. Add API endpoints in `utils/api.ts`

### State Management

- **Authentication**: Context API (`context/AuthContext.tsx`)
- **Server State**: React Query for API data
- **Local State**: React hooks and Zustand

## Deployment

### Mobile App Stores

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure builds
eas build:configure

# Build for app stores
eas build --platform ios
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### Web Deployment

```bash
# Build for web
expo export --platform web

# Deploy to hosting service (Vercel, Netlify, etc.)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

# Dice Tracker

A Firebase-powered application for tracking dice rolls with React frontend and Python Cloud Functions.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Firebase Cloud Functions (Python 3.13)
- **Database**: Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting

## Prerequisites

- Node.js (v20 or later)
- Python 3.13
- Firebase CLI (`npm install -g firebase-tools`)
- Make (optional, for using Makefile commands)

## Project Structure

```
dicetracker/
├── frontend/          # React + Vite application
├── functions/         # Python Cloud Functions
├── public/            # Static hosting files
├── firestore.rules    # Firestore security rules
├── firestore.indexes.json
└── firebase.json      # Firebase configuration
```

## Development Setup

### Quick Start

Using Make:
```bash
make install          # Install all dependencies
make dev              # Start emulators and frontend dev server
```

### Manual Setup

1. **Install dependencies:**
   ```bash
   # Frontend dependencies
   cd frontend
   npm install
   cd ..

   # Python dependencies (if any)
   cd functions
   pip install -r requirements.txt
   cd ..
   ```

2. **Start development servers:**

   **Terminal 1 - Firebase Emulators:**
   ```bash
   firebase emulators:start
   ```

   **Terminal 2 - Frontend Dev Server:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173 (Vite dev server with hot reload)
   - Emulator UI: http://localhost:4000
   - Firebase Auth Emulator: http://localhost:9099
   - Cloud Functions Emulator: http://localhost:5001
   - Firestore Emulator: http://localhost:8080

## Available Commands

### Using Make

```bash
make install          # Install all dependencies
make dev              # Start emulators and frontend (parallel)
make emulators        # Start Firebase emulators only
make frontend         # Start frontend dev server only
make build            # Build frontend for production
make deploy           # Deploy to Firebase
make clean            # Clean build artifacts
make lint             # Run linter on frontend
make help             # Show all available commands
```

### Using npm (in frontend/ directory)

```bash
npm run dev           # Start Vite dev server
npm run build         # Build for production
npm run lint          # Run ESLint
npm run preview       # Preview production build
```

### Using Firebase CLI

```bash
firebase emulators:start              # Start all emulators
firebase emulators:start --only firestore,functions  # Start specific emulators
firebase deploy                        # Deploy everything
firebase deploy --only hosting         # Deploy hosting only
firebase deploy --only functions       # Deploy functions only
```

## Development Workflow

1. Make changes to your code
2. The frontend will hot-reload automatically (Vite)
3. For function changes, the emulator will restart automatically
4. Test using the Emulator UI at http://localhost:4000
5. When ready, build and deploy:
   ```bash
   make build
   make deploy
   ```

## Firebase Emulators

The project is configured with the following emulators:

- **Auth**: Port 9099
- **Functions**: Port 5001
- **Firestore**: Port 8080
- **Hosting**: Port 5000
- **UI**: Enabled (Port 4000)

Emulator data is not persisted by default. To persist data between runs, use:
```bash
firebase emulators:start --import=./emulator-data --export-on-exit
```

## Environment Variables

Create a `.env` file in the `frontend/` directory for local development:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
# ... other Firebase config
```

## Deployment

### Prerequisites
- Ensure you're logged in: `firebase login`
- Ensure the project is linked: `firebase use --add`

### Deploy Everything
```bash
make deploy
```

### Deploy Specific Services
```bash
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

## Troubleshooting

### Authentication Issues
If you see 401 errors with Firebase CLI:
```bash
firebase logout
firebase login
```

### Emulator Connection Issues
Make sure your frontend is configured to use emulators in development. Check your Firebase initialization code.

### Port Already in Use
If emulator ports are already in use, you can change them in `firebase.json` or stop conflicting processes.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally with emulators
4. Submit a pull request

## License

Private project
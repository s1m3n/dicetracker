.PHONY: help install dev emulators frontend build deploy clean lint test check-deploy

# Default target
help:
	@echo "Dice Tracker - Available Commands"
	@echo "=================================="
	@echo "make install          - Install all dependencies (frontend + functions)"
	@echo "make dev              - Start emulators and frontend dev server in parallel"
	@echo "make emulators        - Start Firebase emulators only"
	@echo "make frontend         - Start frontend dev server only"
	@echo "make build            - Build frontend for production"
	@echo "make deploy           - Deploy to Firebase (all services)"
	@echo "make deploy-hosting   - Deploy hosting only"
	@echo "make deploy-functions - Deploy functions only"
	@echo "make clean            - Clean build artifacts"
	@echo "make lint             - Run linter on frontend"
	@echo "make test             - Run tests (when implemented)"
	@echo ""

# Install all dependencies
install:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Installing function dependencies..."
	cd functions && pip install -r requirements.txt || echo "No requirements.txt found"
	@echo "✓ All dependencies installed"

# Start both emulators and frontend dev server
dev:
	@echo "Starting development environment..."
	@echo "This will start Firebase emulators and frontend dev server"
	@echo "Press Ctrl+C to stop all services"
	@trap 'kill 0' EXIT; \
	firebase emulators:start & \
	cd frontend && npm run dev

# Start Firebase emulators only
emulators:
	@echo "Starting Firebase emulators..."
	firebase emulators:start

# Start frontend dev server only
frontend:
	@echo "Starting frontend dev server..."
	cd frontend && npm run dev

# Build frontend for production
build:
	@echo "Building frontend for production..."
	cd frontend && npm run build
	@echo "Copying build to public directory..."
	rm -rf public/*
	cp -r frontend/dist/* public/
	@echo "✓ Build complete"

# Check deployment prerequisites
check-deploy:
	@echo "Checking deployment prerequisites..."
	@FIREBASE_PROJECT=$$(firebase use 2>/dev/null | grep -o "thedicetracker" || echo ""); \
	GIT_EMAIL=$$(git config user.email); \
	if [ "$$FIREBASE_PROJECT" != "thedicetracker" ]; then \
		echo "❌ ERROR: Firebase project must be 'thedicetracker'"; \
		echo "   Current project: $$(firebase use 2>/dev/null || echo 'none')"; \
		echo "   Run: firebase use thedicetracker"; \
		exit 1; \
	fi; \
	if [ "$$GIT_EMAIL" != "frosterus@gmail.com" ]; then \
		echo "❌ ERROR: Git user email must be 'frosterus@gmail.com'"; \
		echo "   Current email: $$GIT_EMAIL"; \
		echo "   Run: git config user.email frosterus@gmail.com"; \
		exit 1; \
	fi; \
	echo "✓ Project: thedicetracker"; \
	echo "✓ User: frosterus@gmail.com"

# Deploy to Firebase
deploy: check-deploy build
	@echo "Deploying to Firebase..."
	firebase deploy
	@echo "✓ Deployment complete"

# Deploy hosting only
deploy-hosting: check-deploy build
	@echo "Deploying hosting to Firebase..."
	firebase deploy --only hosting
	@echo "✓ Hosting deployment complete"

# Deploy functions only
deploy-functions: check-deploy
	@echo "Deploying functions to Firebase..."
	firebase deploy --only functions
	@echo "✓ Functions deployment complete"

# Deploy firestore rules only
deploy-firestore: check-deploy
	@echo "Deploying Firestore rules and indexes..."
	firebase deploy --only firestore
	@echo "✓ Firestore deployment complete"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf frontend/dist
	rm -rf frontend/node_modules/.vite
	rm -rf public/*
	@echo "✓ Clean complete"

# Run linter
lint:
	@echo "Running linter on frontend..."
	cd frontend && npm run lint

# Run tests (placeholder for future implementation)
test:
	@echo "Running tests..."
	@echo "No tests configured yet"

# Start emulators with data persistence
emulators-persist:
	@echo "Starting Firebase emulators with data persistence..."
	firebase emulators:start --import=./emulator-data --export-on-exit

# Initialize Firebase (for first-time setup)
init:
	@echo "Initializing Firebase..."
	firebase login
	firebase use --add
	@echo "✓ Firebase initialized"
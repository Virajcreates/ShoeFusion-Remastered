import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Check if we have valid Firebase config
const hasValidConfig =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abc123def456",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Mock user for preview environment
const mockUser = {
  uid: "mock-user-123",
  email: "demo@shoefusion.com",
  displayName: "Demo User",
}

// Mock Firebase services for preview environment
class MockFirebase {
  static auth = {
    currentUser: mockUser,
    onAuthStateChanged: (callback: any) => {
      // Simulate logged in user for preview
      setTimeout(() => callback(mockUser), 500)
      return () => {}
    },
    signInWithEmailAndPassword: async () => ({ user: mockUser }),
    createUserWithEmailAndPassword: async () => ({ user: mockUser }),
    signInWithPopup: async () => ({ user: mockUser }),
    signOut: async () => {},
  }

  static firestore = {
    collection: () => ({
      add: async () => ({ id: `mock-${Date.now()}` }),
      doc: () => ({
        set: async () => {},
        get: async () => ({ exists: () => false, data: () => ({}) }),
      }),
    }),
    doc: () => ({
      set: async () => {},
      get: async () => ({ exists: () => false, data: () => ({}) }),
    }),
  }

  static storage = {
    ref: () => ({
      put: async () => {},
      getDownloadURL: async () => "/placeholder.svg",
    }),
  }
}

// Initialize Firebase or use mock
let app, auth, db, storage

try {
  if (!hasValidConfig) {
    console.warn("Firebase config is missing or invalid. Using mock Firebase services.")
    throw new Error("Invalid Firebase config")
  }

  app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)

  console.log("Firebase initialized successfully")
} catch (error) {
  console.error("Firebase initialization error:", error)
  console.log("Using mock Firebase services instead")

  // Use mock Firebase services
  auth = MockFirebase.auth as any
  db = MockFirebase.firestore as any
  storage = MockFirebase.storage as any
}

export { app, auth, db, storage }

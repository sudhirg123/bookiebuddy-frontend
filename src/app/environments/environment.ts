export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyA_uPtXz3T4KkvJyEAukXupWiOipXDaBgE",
    // Use Firebase hosting domain - it processes redirects and redirects back
    // We'll handle cross-origin auth state sync in the service
    authDomain: "my-bookie-buddy-353fe.firebaseapp.com",
    projectId: "my-bookie-buddy-353fe",
    storageBucket: "my-bookie-buddy-353fe.firebasestorage.app",
    messagingSenderId: "943505933471",
    appId: "1:943505933471:web:4a379a154fb1d905dd8eaa",
    measurementId: "G-JT46Y2M6WQ"
  },
  apiBaseUrl: 'http://localhost:8001/api/v1',
  googleBooksApiUrl: 'https://www.googleapis.com/books/v1/volumes',
  storage: {
    booksKey: 'bookiebuddy_books',
    authTokenKey: 'bookiebuddy_auth_token',
    userKey: 'bookiebuddy_user'
  },
  mockApiDelay: 300
};

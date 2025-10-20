import { initializeApp, refreshToken } from 'firebase-admin/app';

export const app = initializeApp();


const myRefreshToken = '...'; // Get refresh token from OAuth2 flow

initializeApp({
  credential: refreshToken(myRefreshToken),
  databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});
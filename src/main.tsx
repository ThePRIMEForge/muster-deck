import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { PublicProfilePage } from './components/foundation/PublicProfilePage';
import './styles.css';

// Detect ?profile=rsi-handle for public profile deep-links (no auth required).
const profileHandle = new URLSearchParams(window.location.search).get('profile');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {profileHandle ? <PublicProfilePage rsiHandle={profileHandle} /> : <App />}
  </StrictMode>,
);

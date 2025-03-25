import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import '@fontsource/inter/300.css'; // Light
import '@fontsource/inter/400.css'; // Regular
import '@fontsource/inter/500.css'; // Medium
import '@fontsource/inter/600.css'; // Semi-bold
import '@fontsource/inter/700.css'; // Bold

createRoot(document.getElementById('root')).render(
    <App />
)

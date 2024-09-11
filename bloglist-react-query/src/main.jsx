import ReactDOM from 'react-dom/client';
import { NotificationProvider } from './context/NotificationContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationProvider>
    <App />
  </NotificationProvider>,
);

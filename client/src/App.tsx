import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import routes from './routes';
import { Toaster } from './components';

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
      <Toaster position="top-right" />
    </Router>
  );
};

export default App;

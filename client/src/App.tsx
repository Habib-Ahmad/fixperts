import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import routes from './routes';

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;

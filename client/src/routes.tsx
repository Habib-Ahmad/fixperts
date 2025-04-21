import { Layout } from './layouts';
import HomePage from './pages/HomePage';

const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <div>About</div> },
    ],
  },
];

export default routes;

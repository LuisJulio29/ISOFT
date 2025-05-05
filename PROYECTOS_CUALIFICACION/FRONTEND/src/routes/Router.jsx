import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import DefaultLayout from '../layouts/DefaultLayout';
import VerticalLayout from '../layouts/VerticalLayout';
import { defaultLayoutRoutes, verticalLayoutRoutes } from './routes';
const Router = props => {
  return <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {verticalLayoutRoutes.map((route, idx) => <Route key={idx + (route.path ?? '')} path={route.path} {...props} element={<VerticalLayout>{route.element}</VerticalLayout>} />)}
        {defaultLayoutRoutes.map((route, idx) => <Route key={idx + (route.path ?? '')} path={route.path} {...props} element={<DefaultLayout>{route.element}</DefaultLayout>} />)}
      </Routes>
    </BrowserRouter>;
};
export default Router;
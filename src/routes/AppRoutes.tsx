import { AppLayout } from "@/layouts";
import routesConfig from "@/routes/routerConfig.tsx";
import { Route, Routes } from "react-router-dom";

const DefinedRoutes: React.FC = () => {
  return (
    <Routes>
      {routesConfig.map((route, index) => (
        <Route key={index} path={route.path} element={route.element}>
          {route.children?.map((child, idx) => (
            <Route key={idx} path={child.path} element={child.element} />
          ))}
        </Route>
      ))}
    </Routes>
  );
};
const AppRoutes = () => {
  return (
    <AppLayout>
      <DefinedRoutes />
    </AppLayout>
  );
};

export default AppRoutes;

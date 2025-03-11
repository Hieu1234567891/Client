import LoginModal from "@/pages/login/Login.tsx";
import RegisterModal from "@/pages/login/Register.tsx";
import { AppRoutes } from "@/routes";

const App = () => {
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <AppRoutes />
    </>
  );
};

export default App;

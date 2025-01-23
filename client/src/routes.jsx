import { createBrowserRouter } from "react-router-dom"; 
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import Setup2FA from "./pages/Setup2FA";
import Verify2FA from "./pages/Verify2FA";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
        errorElement: <ErrorPage />
    }, 
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <HomePage />,
                errorElement: <ErrorPage />
            },
            {
                path: "/setup-2fa",
                element: <Setup2FA />,
                errorElement: <ErrorPage />
            },
            {
                path: "/verify-2fa",
                element: <Verify2FA />,
                errorElement: <ErrorPage />
            }
        ]
    },
    
]);

export default router;
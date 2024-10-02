import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./app.css";
import TableInventoryDevices from "./pages/Clients/Clients";
import Client from "./pages/Clients/Client";
import { TablePeripherals } from "./pages/Peripherical/TablePeriphericals";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import CompareHardware from "./pages/Performance/CompareHardware";
import Modal from "./components/Modal/ModalComponent";
import AlertTrigger from "./pages/Triggers/Trigger";
import Layout from "./pages/Layout/Layout";
import StockAutomatic from "./pages/Stock/StockTable";
import LoginPage from "./pages/Auth/Login";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";
import { RootThemeProvider } from "./styles/theme";
import UserProfile from "./pages/Profile/Profile";
import NotFound from "./pages/Message/NotFound";
import DevelopmentFeature from "./pages/Message/DevelopmentFeature";
import AddItemPage from "./pages/Custom/Custom";
import DownloadPage from "./pages/Download/Download";
import PaymentSuccessPage from "./pages/Payment/PaymentSuccess";
import PaymentFailurePage from "./pages/Payment/PaymentFailure";
import PaymentPage from "./pages/Payment/PaymentPage";
import Trial from "./pages/Payment/Trial";
import { Toaster } from "./components/ui/toaster";
import { ToastDemo } from "./components/customerComponents/ToastDemo";
import { RemoteCommandPage } from "./pages/Clients/CommandsPage";
import Dashboard from "./pages/Dashboards/Dashboards";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          element: <ProtectedRoute />, // Adicione o ProtectedRoute aqui
          children: [
            {
              path: "/",
              element: <TableInventoryDevices />,
            },
            {
              path: "/devices/inventory/general",
              element: <TableInventoryDevices />,
            },
            {
              path: "/payment",
              element: <PaymentPage />,
            },
            {
              path: "/payment-success",
              element: <PaymentSuccessPage />,
            },
            {
              path: "/trial",
              element: <Trial />,
            },
            {
              path: "/payment-failure",
              element: <PaymentFailurePage />,
            },
            {
              path: "/performance",
              element: <CompareHardware />,
            },
            {
              path: "/stock",
              element: <TablePeripherals />,
            },
            {
              path: "/stock/automatic",
              element: <StockAutomatic />,
            },
            // {
            //   path: "/teste",
            //   element: <SeuComponente />,
            // },
            {
              path: "/profile",
              element: <UserProfile />,
            },
            // {
            //   path: "/charts",
            //   element: <Charts />,
            // },
            {
              path: "/dashboards-general",
              element: <Dashboard />,
            },
            {
              path: "/agent/:id",
              element: <Client />,
            },
            {
              path: "/triggers",
              element: <AlertTrigger />,
            },
            {
              path: "/remote-commands/:clientId",
              element: <RemoteCommandPage />,
            },
            {
              path: "/download",
              element: <DownloadPage />,
            },
            {
              path: "/custom",
              element: <AddItemPage />,
            },
            {
              path: "/development",
              element: <DevelopmentFeature />,
            },
            {
              path: "*",
              element: <NotFound />,
            },
          ],
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/toast",
          element: <ToastDemo />,
        },
      ],
    },
  ]);

  return (
    <RootThemeProvider>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <Modal />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </RootThemeProvider>
  );
}

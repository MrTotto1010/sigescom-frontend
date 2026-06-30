import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'

import Dashboard from '../pages/dashboard/Dashboard'
import Solicitudes from '../pages/solicitudes/Solicitudes'
import Roles from '../pages/roles/Roles'
import NewRequest from '../pages/solicitudes/NewRequest'
import RequestDetails from '../pages/solicitudes/RequestDetails'

import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/solicitudes" element={<Solicitudes />} />
          <Route path="/solicitudes/nueva" element={<NewRequest />} />
          <Route path="/solicitudes/:id/detalle" element={<RequestDetails />} />
          <Route path="/roles" element={<Roles />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
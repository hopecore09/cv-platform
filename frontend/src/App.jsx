import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Home = lazy(() => import('./pages/Home'))
const Positions = lazy(() => import('./pages/Positions'))
const PositionForm = lazy(() => import('./pages/PositionForm'))
const PositionView = lazy(() => import('./pages/PositionView'))
const Profile = lazy(() => import('./pages/Profile'))
const Attributes = lazy(() => import('./pages/Attributes'))
const CVPage = lazy(() => import('./pages/CVPage'))
const AdminUsers = lazy(() => import('./pages/AdminUsers'))

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false } } })

const user = () => {
  try { return JSON.parse(localStorage.getItem('user') || 'null') }
  catch { return null }
}

const Private = ({ children }) => user() ? children : <Navigate to="/login" />
const Recruiter = ({ children }) => ['recruiter', 'admin'].includes(user()?.role) ? children : <Navigate to="/" />
const Admin = ({ children }) => user()?.role === 'admin' ? children : <Navigate to="/" />
const Loader = () => <div className="text-center py-5">Loading...</div>

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Suspense fallback={<Loader />}><Private><Home /></Private></Suspense>} />
            <Route path="login" element={<Suspense fallback={<Loader />}><Login /></Suspense>} />
            <Route path="register" element={<Suspense fallback={<Loader />}><Register /></Suspense>} />
            <Route path="positions" element={<Suspense fallback={<Loader />}><Positions /></Suspense>} />
            <Route path="positions/:id" element={<Suspense fallback={<Loader />}><PositionView /></Suspense>} />
            <Route path="positions/new" element={<Suspense fallback={<Loader />}><Recruiter><PositionForm /></Recruiter></Suspense>} />
            <Route path="positions/:id/edit" element={<Suspense fallback={<Loader />}><Recruiter><PositionForm /></Recruiter></Suspense>} />
            <Route path="profile" element={<Suspense fallback={<Loader />}><Private><Profile /></Private></Suspense>} />
            <Route path="attributes" element={<Suspense fallback={<Loader />}><Recruiter><Attributes /></Recruiter></Suspense>} />
            <Route path="cv/:id" element={<Suspense fallback={<Loader />}><Private><CVPage /></Private></Suspense>} />
            <Route path="admin/users" element={<Suspense fallback={<Loader />}><Admin><AdminUsers /></Admin></Suspense>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
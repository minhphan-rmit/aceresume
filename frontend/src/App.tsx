import { Routes, Route } from 'react-router-dom';

import './styles/globals.css';
import AuthLayout from './_auth/AuthLayout';
import SigninForm from './_root/pages/authentication/SigninForm';
import SignupForm from './_root/pages/authentication/SignupForm';
import { Home } from './_root/pages';
import CVAnalysis from './_root/pages/CVAnalysis/CVAnalysis';
import RootLayout from './_root/RootLayout';
import LandingPage from './_root/pages/landing-page/LandingPage';
import MockInterview from './_root/pages/mock-interview/MockInterview';
import ActivateAccount from './_root/pages/authentication/ActivateAccount';
import AddPassword from './_root/pages/authentication/AddPassword';

import ActivatingAccount from './_root/pages/authentication/ActivatingAccount';
const App = () => {
  return (
    <main>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>


        </Route>

        {/* private routes */}
        <Route path="/auth/add-password" element={<AddPassword />} />
        <Route path="/auth/account-verify" element={<ActivatingAccount />} />
        <Route path="/auth/activation-success" element={<ActivateAccount />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/cv-analysis" element={<CVAnalysis />} />
        <Route path="/sign-in" element={<SigninForm />} />
        <Route path="/sign-up" element={<SignupForm />} />
        <Route element={<RootLayout />}>
          <Route path="/home" element={<Home />} />

        </Route>
      </Routes>
    </main>
  )
}

export default App

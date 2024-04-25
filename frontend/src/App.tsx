import { Routes, Route } from 'react-router-dom';

import './styles/globals.css';
import AuthLayout from './_auth/AuthLayout';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import { Home } from './_root/pages';
import RootLayout from './_root/RootLayout';
import LandingPage from './_root/pages/landing-page/LandingPage';
import MockInterview from './_root/pages/mock-interview/MockInterview';

const App = () => {
  return (
    <main>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* private routes */}
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route element={<RootLayout />}>
          <Route path="/home" element={<Home />} />

        </Route>
      </Routes>
    </main>
  )
}

export default App

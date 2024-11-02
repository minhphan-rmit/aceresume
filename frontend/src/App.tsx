import { Routes, Route } from 'react-router-dom';
import './styles/globals.css';
import AuthLayout from './_auth/AuthLayout';
import SigninForm from './_root/pages/authentication/SigninForm';
import SignupForm from './_root/pages/authentication/SignupForm';
import { Home } from './_root/pages';
import CVAnalysis from './_root/pages/CVAnalysis/CVAnalysis';
import LandingPage from './_root/pages/landing-page/LandingPage';
import MockInterview from './_root/pages/mock-interview/MockInterview';
import ActivateAccount from './_root/pages/authentication/ActivateAccount';
import AddPassword from './_root/pages/authentication/AddPassword';
import MatchingJobs from './_root/pages/matching-jobs/MatchingJobs';
import Roadmap from './_root/pages/roadmap/Roadmap';
import Profile from './_root/pages/profile/Profile';
import ActivatingAccount from './_root/pages/authentication/ActivatingAccount';



const App = () => {
  return (
    <main>
      <Routes>
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
          <Route path="/auth/add-password" element={<AddPassword />} />
          <Route path="/auth/account-verify" element={<ActivatingAccount />} />
          <Route path="/auth/activation-success" element={<ActivateAccount />} />

        {/* Wrap private routes with RequireAuth */}
        {/* <Route element={<AuthLayout />}> */}

          <Route path="/profile" element={
            <AuthLayout>
          <Profile />
          </AuthLayout>
          } />

          <Route path="/matching-jobs" element={
            <AuthLayout>
          <MatchingJobs />
          </AuthLayout>
          } />
          <Route path="/mock-interview" element={
            <AuthLayout>
          <MockInterview />
          </AuthLayout>
          } />
          <Route path="/cv-analysis" element={
            <AuthLayout>
          <CVAnalysis />
          </AuthLayout>} />
          <Route path="/roadmap" element={
          <AuthLayout>
          <Roadmap />
          </AuthLayout>
          } />
          <Route path="/home" element={
            <AuthLayout>
            <Home />
            </AuthLayout>
            } />

        {/* </Route> */}
      </Routes>
    </main>
  )
}

export default App;

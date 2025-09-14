import { Routes, Route } from "react-router-dom";

import LoginPage from "./LoginPage/LoginPage";
import RegisterPage from "./RegisterPage/RegisterPage";
import ForgotPasswordPage from "./ForgotPasswordPage/ForgotPasswordPage";

import PublicRoute from "./PublicRoute/PublicRoute"
import PrivateRoute from "./PrivateRoute/PrivateRoute"
import PrivateComponent from "../shared/components/PrivateComponent/PrivateComponent"

import LearnMorePage from "./LearnMorePage/LearnMorePage";
import TermsPage from "./TermsPage/TermsPage";
import PrivacyPolicyPage from "./PrivacyPolicyPage/PrivacyPolicyPage";
import CookiesPolicyPage from "./CookiesPolicyPage/CookiesPolicyPage";

const Navigations = () => {
  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/api/auth/register" element={<RegisterPage />} />
          <Route
            path="/api/auth/forgot-password"
            element={<ForgotPasswordPage />}
          />

          <Route path="/learn-more" element={<LearnMorePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/cookies-policy" element={<CookiesPolicyPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/*" element={<PrivateComponent />} />

        </Route>
      </Routes>
    </>
  );
};

export default Navigations;
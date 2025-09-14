import { useState, useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

import Content from "../../shared/components/ContentComponent/Content";
import Footer from "../../shared/components/FooterComponent/Footer";
import Error from "../../shared/components/ErrorComponent/Error";
import LoginForm from "./LoginForm/LoginForm";
import ResendForm from "./ResendForm/ResendForm";

import background from "../../assets/icons/background.png";

import { selectAuth } from "../../redux/auth/auth.selectors";
import { login, verify, resendEmail } from "../../redux/auth/auth.thunks";

import styles from "./Login.module.css";

function Login() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVerifySuccess, setIsVerifySuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [showResend, setShowResend] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [isResendSuccess, setIsResendSuccess] = useState(false);
  const [isLoginDisabled, setIsLoginDisabled] = useState(false);

  const { error: authError } = useSelector(selectAuth);
  const appDispatch = useDispatch();

  const verificationCode = searchParams.get("verificationCode");

  useEffect(() => {
    if (verificationCode) {
      const runVerify = async () => {
        const response = await appDispatch(verify({ code: verificationCode })).unwrap();
        setSuccessMsg(response.message);
        setIsVerifySuccess(true);
        setSearchParams(); // очистить query
      };
      runVerify();
    }
  }, [verificationCode, appDispatch, setSearchParams]);

  const handleLogin = async (payload) => {
    try {
      await appDispatch(login(payload)).unwrap();
    } catch (err) {
      if (err === "Email not verified") {
        setShowResend(true);
        setPendingEmail(payload.email);
      }
    }
  };

  const handleResend = async (values) => {
    const response = await appDispatch(resendEmail({ email: values.email })).unwrap();
    setSuccessMsg(response.message, values.email);
    setIsResendSuccess(true);
    setShowResend(false);
    setIsLoginDisabled(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* Левая колонка — алерт + карточка */}
        <div className={styles.leftCol}>
          {isVerifySuccess && (
            <div className={styles.alertBox}>
              <p className={styles.alertText}>{successMsg}</p>
            </div>
          )}
          {isResendSuccess && <div className={styles.alertBox}><p className={styles.alertText}>{successMsg}</p></div>}

          <Content
            showLogo
            linkHref="/api/auth/forgot-password"
            linkLabel="Forgot password?"
            showOrDivider
            {...(showResend && {
              title: "Your email is not verified.",
              description: (
                <>
                  Would you like to resend the confirmation email to{" "}
                  <strong>{pendingEmail}</strong>?
                </>
              ),
            })}
          >
            {showResend ? (
              <ResendForm email={pendingEmail} submitForm={handleResend} />
            ) : (
              <LoginForm submitForm={handleLogin} disabled={isLoginDisabled} />
            )}
          </Content>

          {authError && <Error>{authError}</Error>}
        </div>

        
        <aside className={styles.rightCol}>
          <img className={styles.visualImg} src={background} alt="Background" />
        </aside>
      </div>

      <Footer className={styles.footer} text="Don't have an account?" link="/api/auth/register">
        Sign up
      </Footer>
    </div>
  );
}

export default Login;
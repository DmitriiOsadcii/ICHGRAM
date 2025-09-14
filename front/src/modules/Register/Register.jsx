import { useState, useCallback } from "react";
import { useSelector ,useDispatch} from "react-redux";

import Content from "../../shared/components/ContentComponent/Content";
import Footer from "../../shared/components/FooterComponent/Footer";
import RegisterForm from "./RegisterForm/RegisterForm";
import Error from "../../shared/components/ErrorComponent/Error";

import { selectAuth } from "../../redux/auth/auth.selectors";
import { registration } from "../../redux/auth/auth.thunks";
import styles from "./Register.module.css";


function Register() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [successNode, setSuccessNode] = useState("");
  const [isRegisterDisabled, setIsRegisterDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { error: authError } = useSelector(selectAuth);
  const dispatch = useDispatch();

  const handleRegister = useCallback(
    async (payload) => {
      setErrorMsg("");
      try {
        const response = await dispatch(registration(payload)).unwrap();
        setSuccessNode(response.message, payload.email);
        setIsRegistered(true);
        setIsRegisterDisabled(true);
      } catch (err) {
        if (typeof err === "string") {
          setErrorMsg(err);
        }
      }
    },
    [dispatch]
  );
   
  return (
    <>
      <div className={styles.register}>
        {isRegistered && <div className={styles.successMessage}> <p className={styles.success}>{successNode}</p></div>}

        <Content
          children={
            <RegisterForm
              submitForm={handleRegister}
              disabled={isRegisterDisabled}
              errorMessage={errorMsg}
            />
          }
          showLogo
          description={
            <>
              Sign up to see photos and videos <br />
              from your friends.
            </>
          }
        />

        {authError && <Error>{authError}</Error>}
          <div className="foo">
               <Footer className={styles.footerWrap} text="Have an account? " link="/" >Log in</Footer>
          </div>
       
      </div>
    </>
  );
}

export default Register;
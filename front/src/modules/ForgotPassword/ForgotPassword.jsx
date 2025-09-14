import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth } from "../../redux/auth/auth.selectors"
import { forgotPassword } from "../../redux/auth/auth.thunks"
import AuthContentBox from "../../shared/components/ContentComponent/Content";
import ForgotPasswordForm from "./ForgotPasswordForm/ForgotPasswordForm";
import ForgotIcon from "../../shared/components/IconsComponent/ForgotIcon";
import Error from "../../shared/components/ErrorComponent/Error"
import Footer from "../../shared/components/FooterComponent/Footer"

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const [successSend, setSuccessSend] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [formDisabled, setFormDisabled] = useState(false);
    const { error } = useSelector(selectAuth);

    const submitForm = useCallback(async () => {
        const response = await dispatch(forgotPassword(payload)).unwrap()
        setSuccessMessage(response.message, payload.email)
        setSuccessSend(true)
        setFormDisabled(true)
    }, [dispatch])

    return (
        <>
            <div>
                {successSend && <div><p>{successMessage}</p></div>}


                <AuthContentBox children={<ForgotPasswordForm submitForm={submitForm} disabled={formDisabled} />}
                    headerIcon={<ForgotIcon />}
                    title="Have issues with logging in ?"
                    description='Enter your email and we`ll send you a link to get back into your account'
                    authLinkLabel="Create new account"
                    authLinkHref="/api/auth/register"
                />
                {error && <Error>{error}</Error>}

                <Footer text="Back to login" link="/" />
            </div>
        </>
    )
}
export default ForgotPassword;

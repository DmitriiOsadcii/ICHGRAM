import Form from "../../../shared/components/FormComponent/Form"


const LoginForm = ({ submitForm, disabled }) => {
    const onSubmit = (value) => {
        submitForm(value)
    }

    return (
        <div className="login-form">
            <Form textBtn="Log in" submitForm={onSubmit} fieldsToRender={["email", "password"]} disabled={disabled} />
        </div>
    )
}

export default LoginForm;

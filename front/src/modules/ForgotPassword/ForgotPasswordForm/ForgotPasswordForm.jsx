import Form  from "../../../shared/components/FormComponent/Form"

const ForgotPasswordForm = ({ submitForm, disabled }) => {
    const onSubmit = (el) => {
        submitForm(el)
    }

    return ( 
        <>
            <Form submitForm={onSubmit} fieldsToRender={["email"]} disabled={disabled} textBtn={"Reset password"} />
        </>
    )
}

export default ForgotPasswordForm;
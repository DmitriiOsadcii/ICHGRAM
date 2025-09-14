import Form from "../../../shared/components/FormComponent/Form"


const ResendForm = ({ submitForm, email }) => {
    const onSubmit = (value) => {
        submitForm(value)
    }

    return (
        <>
            <Form textBtn="Resend Email" submitForm={onSubmit} fieldsToRender={["email"]} email={email}/>
        </>
    )
}

export default ResendForm;

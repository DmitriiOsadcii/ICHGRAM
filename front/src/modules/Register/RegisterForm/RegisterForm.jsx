import Form from "../../../shared/components/FormComponent/Form";
import PrivacyComponent from "../../../shared/components/PrivacyComponent/Privacy";

const RegisterForm=({ submitForm, disabled, errorMessage })=> {
  const handleSubmit = (values) => {
    submitForm(values);
  };

  return (
    <Form
      textBtn="Sign up"
      submitForm={handleSubmit}
      fieldsToRender={["email", "fullName", "username", "password"]}
      childrenPolicy={<PrivacyComponent />}
      disabled={disabled}
      errorMessage={errorMessage}
    />
  );
}

export default RegisterForm;

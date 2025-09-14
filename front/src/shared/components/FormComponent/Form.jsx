import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import FIELD_CONFIG from "../../data/fields"; // ⬅️ alias для ясности
import TextField from "../TextFieldComponent/TextField";
import styles from "./Form.module.css";

function AuthForm({
  textBtn,
  submitForm,
  fieldsToRender = Object.keys(FIELD_CONFIG), // ⬅️ дефолт
  childrenPolicy,
  email,
  disabled,
  errorMessage,
}) {
  const [formValues, setFormValues] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: email || "" },
  });

  const onSubmit = async (values) => {
    setFormValues(values);
    await Promise.resolve(submitForm(values)); // ⬅️ передаём данные наружу
    // reset(); // если нужно очищать форму — раскомментируй
  };

  useEffect(() => {
    if (typeof errorMessage === "string" && formValues) {
      const match = errorMessage.match(/The (\w+) '(.+)' is already in use\./);
      if (match) {
        const [, field, value] = match;
        if (Object.prototype.hasOwnProperty.call(formValues, field)) {
          setError(field, {
            type: "manual",
            message: `${field} "${value}" is already in use.`,
          });
        }
      }
    }
  }, [errorMessage, setError, formValues]);

  // ⬅️ защита от мусорных ключей/опечаток
  const safeKeys = (Array.isArray(fieldsToRender) ? fieldsToRender : Object.keys(FIELD_CONFIG))
    .filter((k) => FIELD_CONFIG[k]);

  const elements = safeKeys.map((fieldName) => {
    const cfg = FIELD_CONFIG[fieldName];
    return (
      <TextField
        key={cfg.name}
        {...cfg}
        name={cfg.name}
        register={register}
        rules={cfg.rules}
        error={errors?.[cfg.name]}
        disabled={disabled || isSubmitting}
      />
    );
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.textFieldsBox}>
        {elements.length ? elements : <p className={styles.empty}>No fields to render</p>}
      </div>

      {childrenPolicy}

      <div className={styles.btnBox}>
        <button className="btn" type="submit" disabled={disabled || isSubmitting}>
          {textBtn}
        </button>
      </div>
    </form>
  );
}

export default AuthForm;
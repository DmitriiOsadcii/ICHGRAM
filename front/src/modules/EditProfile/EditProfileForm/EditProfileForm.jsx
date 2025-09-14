import { useEffect } from "react";
import { useForm } from "react-hook-form";

import TextAreaComponent from "../../../shared/components/TextAreaComponent/TextArea";
import ButtonCommponent from "../../../shared/components/ButtonComponent/Button";
import profileData from "../../../shared/data/profileData";

import styles from "./EditProfileForm.module.css";

const EditProfileForm = ({ textButton, submitForm, user, state, error, fields }) => {
  // подстрахуем различия в кейсинге fullName/fullname
  const defaultValues = {
    username: user?.username || "",
    fullName: user?.fullName ?? user?.fullname ?? "",
    website: user?.website || "",
    biography: user?.biography || "",
  };

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const bioValue = watch("biography");

  const onSubmit = (value) => submitForm(value);

  useEffect(() => {
    if (typeof error === "string") {
      // ожидаем сообщение вида: The <field> '<value>' is already in use.
      const match = error.match(/The (\w+) '(.+)' is already in use\./);
      if (match) {
        let [, field, value] = match;

        // нормализуем имя поля под форму
        if (field === "fullname") field = "fullName";

        setError(field, {
          type: "manual",
          message: `${field} "${value}" is already in use`,
        });
      }
    }
  }, [error, setError]);

  const elements = (fields || []).map((field) => {
    const fieldKey = field; // <-- теперь есть в скоупе
    const isBiography = fieldKey === "biography";   // исправил опечатку
    const isWebsite = fieldKey === "website";

    const cfg = profileData[fieldKey];
    if (!cfg) return null; // на случай, если поля нет в profileData

    return (
      <TextAreaComponent
        key={fieldKey}                     // правильный key
        {...cfg}
        name={cfg.name}
        label={cfg.label}
        register={register}
        rules={cfg.rules}
        error={errors[fieldKey]}
        IsTextArea={isBiography}           // оставил как у тебя (если компонент ждёт именно IsTextArea)
        isLink={isWebsite}
        valueLength={isBiography ? bioValue?.length || 0 : undefined}
        maxLength={isBiography ? 100 : undefined}
      />
    );
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.text}>{elements}</div>
      <div className={styles.box}>
        <ButtonCommponent
          children={textButton}
          type="submit"
          state={state}
          width={"100%"}
        />
      </div>
    </form>
  );
};

export default EditProfileForm;
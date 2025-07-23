import styles from "./InputField.module.css";

function InputField({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  required = false,
}) {
  return (
    <label className={styles.label}>
      {label}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.input}
        required={required}
      />
    </label>
  );
}

export default InputField;

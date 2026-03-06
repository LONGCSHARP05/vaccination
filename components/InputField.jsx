function InputField({ label, type, value, onChange, className="", ...rest }) {
  return (
    <div className={`input-field ${className}`}>
        <label>{label}</label>
        <input
        type={type}
        value={value}
        onChange={onChange}
        required
        {...rest}
        />
    </div>
  );
}

export default InputField;

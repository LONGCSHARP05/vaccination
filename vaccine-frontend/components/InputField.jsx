// Đã bỏ div bọc ngoài và label đi để khớp với cách gọi ở Login.jsx / Register.jsx
function InputField({ type, value, onChange, className="", ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={className}
      required
      {...rest}
    />
  );
}

export default InputField;
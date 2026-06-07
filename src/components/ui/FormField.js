import React from "react";

const FormField = ({
  id,
  label,
  type = "text",
  placeholder,
  as = "input",
  rows = 5,
}) => {
  const InputComponent = as;

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <InputComponent
        id={id}
        name={id}
        type={as === "input" ? type : undefined}
        className="contact-input"
        placeholder={placeholder}
        rows={as === "textarea" ? rows : undefined}
      />
    </div>
  );
};

export default FormField;

import React from "react";
import { TextFieldProps, Input, InputLabel } from "@material-ui/core";
import { useField, FieldAttributes } from "formik";

export type Props = FieldAttributes<any> & TextFieldProps;

export const FInputWithLabel: React.FC<Props> = ({
  InputLabelProps,
  InputProps,
  label,
  ...props
}) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and also replace ErrorMessage entirely.
  const [field] = useField(props);

  return (
    <React.Fragment>
      <InputLabel {...InputLabelProps}>{label}</InputLabel>
      <Input {...InputProps} {...field} {...props} />
    </React.Fragment>
  );
};

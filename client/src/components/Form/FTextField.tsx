import React from "react";
import { TextField, TextFieldProps } from "@material-ui/core";
import { useField, FieldAttributes } from "formik";

export const FTextField: React.ComponentType<TextFieldProps> & any = ({
  validate,
  ...props
}: TextFieldProps & FieldAttributes<any>) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and also replace ErrorMessage entirely.
  const [field, meta] = useField({ validate, ...props });

  return (
    <React.Fragment>
      <TextField
        {...field}
        {...props}
        error={Boolean(meta.touched && meta.error)}
        helperText={meta.touched && meta.error ? meta.error : " "}
      />
    </React.Fragment>
  );
};

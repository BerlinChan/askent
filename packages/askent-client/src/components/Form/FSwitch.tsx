import React from "react";
import { Switch, SwitchProps } from "@mui/material";
import { useField, FieldAttributes } from "formik";

export const FSwitch: React.FC<SwitchProps & FieldAttributes<any>> = ({
  validate,
  ...props
}) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and also replace ErrorMessage entirely.
  const [field, meta] = useField({ validate, ...props });

  return (
    <Switch
      {...field}
      {...props}
      checked={field.value}
      onChange={field.onChange}
      error={Boolean(meta.touched && meta.error)}
      // helperText={meta.touched && meta.error ? meta.error : " "} // Optional: add if needed
    />
  );
};

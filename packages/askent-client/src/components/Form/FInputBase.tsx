import React from "react";
import { InputBase, InputBaseProps } from "@mui/material";
import { useField, FieldAttributes } from "formik";

export const FInputBase: React.FC<InputBaseProps & FieldAttributes<any>> = ({
  validate,
  ...props
}) => {
  const [field, meta] = useField({ validate, ...props });

  return (
    <InputBase
      {...field}
      {...props}
      error={Boolean(meta.touched && meta.error)}
    />
  );
};

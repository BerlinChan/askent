import React from "react";
import { useField, FieldAttributes } from "formik";
import { DatePicker, DatePickerProps } from "@material-ui/pickers";

export const FDatePicker: React.FC<DatePickerProps & FieldAttributes<any>> = ({
  validate,
  ...props
}) => {
  const [field, meta, helpers] = useField({ validate, ...props });
  const { setValue } = helpers;

  return (
    <DatePicker
      {...field}
      {...props}
      onChange={setValue}
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error ? meta.error : " "}
    />
  );
};

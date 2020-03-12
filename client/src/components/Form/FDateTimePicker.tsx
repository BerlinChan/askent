import React from "react";
import { useField, FieldAttributes } from "formik";
import { DateTimePicker, DateTimePickerProps } from "@material-ui/pickers";

export const FDateTimePicker: React.FC<DateTimePickerProps &
  FieldAttributes<any>> = ({ validate, ...props }) => {
  const [field, meta, helpers] = useField({ validate, ...props });
  const { setValue } = helpers;

  return (
    <DateTimePicker
      {...field}
      {...props}
      onChange={setValue}
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error ? meta.error : " "}
    />
  );
};

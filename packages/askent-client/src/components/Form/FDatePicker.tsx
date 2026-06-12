import React from "react";
import { useField, FieldAttributes } from "formik";
import { DatePicker, DatePickerProps } from "@mui/lab";

type LegacyDatePickerProps = Omit<
  React.ComponentProps<typeof MuiDatePicker<Date>>,
  "renderInput"
> &
  FieldAttributes<any>;

export const FDatePicker: React.FC<LegacyDatePickerProps> = ({
  validate,
  name,
  ...props
}) => {
  const [field, meta, helpers] = useField({ name, validate, ...props });
  const { setValue } = helpers;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiDatePicker
        {...props}
        value={field.value}
        onChange={setValue}
        componentsProps={{
          ...props.componentsProps,
          textField: {
            ...props.componentsProps?.textField,
            component: TextField,
            name: field.name,
            error: Boolean(meta.touched && meta.error),
            helperText: meta.touched && meta.error ? meta.error : " ",
          },
        }}
      />
    </LocalizationProvider>
  );
};

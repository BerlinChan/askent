import React from "react";
import { useField, FieldAttributes } from "formik";
import { DateTimePicker, DateTimePickerProps } from "@mui/lab";

type LegacyDateTimePickerProps = Omit<
  React.ComponentProps<typeof MuiDateTimePicker<Date>>,
  "renderInput"
> &
  FieldAttributes<any>;

export const FDateTimePicker: React.FC<LegacyDateTimePickerProps> = ({
  validate,
  name,
  ...props
}) => {
  const [field, meta, helpers] = useField({ name, validate, ...props });
  const { setValue } = helpers;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiDateTimePicker
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

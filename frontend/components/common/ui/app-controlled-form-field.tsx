import {
  Controller,
  type ControllerProps,
  type FieldValues,
} from 'react-hook-form';

import { AppFormField, type AppFormFieldProps } from './app-form-field';

// Controller's render callback supplies the child, so callers do not pass children.
export type AppControlledFormFieldProps<TFieldValues extends FieldValues> =
  Omit<AppFormFieldProps, 'children'> & ControllerProps<TFieldValues>;

// Use for AppCombobox and AppMultiSelect; native inputs use register() with AppFormField.
export function AppControlledFormField<TFieldValues extends FieldValues>({
  label,
  htmlFor,
  hint,
  error,
  required,
  render,
  ...controllerProps
}: AppControlledFormFieldProps<TFieldValues>) {
  return (
    <Controller<TFieldValues>
      {...controllerProps}
      render={(controllerState) => (
        <AppFormField
          label={label}
          htmlFor={htmlFor}
          hint={hint}
          error={error ?? controllerState.fieldState.error?.message}
          required={required}
        >
          {render(controllerState)}
        </AppFormField>
      )}
    />
  );
}

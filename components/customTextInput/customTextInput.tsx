import React, { useState } from 'react';
import { TextInput, TextInputProps, CloseButton } from '@mantine/core';
import { ZodSchema, z, ZodError } from 'zod';

export interface CustomInputProps extends TextInputProps {
  type?: 'text' | 'email' | string;
  value?: string;
  /**
   * A change handler that receives the new value as a string.
   * This is separate from the default onChange which receives the event.
   */
  onValueChange?: (value: string) => void;
  /**
   * An optional Zod schema to validate the input.
   * If type is "email" and no schema is provided, a default email schema will be used.
   */
  schema?: ZodSchema;
  /** Optional Tailwind CSS classes to style the input element */
  inputClassName?: string;
  /** Whether to show a clear (X) button when there is text */
  clearable?: boolean;
  /**
   * Optional Tailwind CSS max-width class for the input container,
   * e.g. "max-w-3xl" or "max-w-[300px]". Defaults to no max width.
   */
  maxWidthClass?: string;
}

export function CustomTextInput({
  type = 'text',
  value = '',
  onValueChange,
  schema,
  inputClassName,
  clearable = true,
  maxWidthClass,
  ...rest
}: CustomInputProps) {
  // If no schema is provided and type is "email", use a default email validator.
  const effectiveSchema =
    schema ??
    (type === 'email' ? z.string().email('Invalid email address') : undefined);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    if (effectiveSchema) {
      try {
        // If the field is empty, clear error; otherwise validate.
        if (newValue.trim() === '') {
          setErrorMessage(undefined);
        } else {
          effectiveSchema.parse(newValue);
          setErrorMessage(undefined);
        }
      } catch (error) {
        if (error instanceof ZodError) {
          // Join all error messages if needed.
          setErrorMessage(error.errors.map((err) => err.message).join(', '));
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
        }
      }
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
    if (rest.onChange) {
      rest.onChange(e);
    }
  };

  const handleClear = () => {
    if (onValueChange) {
      onValueChange('');
    }
    setErrorMessage(undefined);
  };

  return (
    <div className={`w-full ${maxWidthClass ? maxWidthClass : ''}`}>
      <TextInput
        type={type}
        value={value}
        onChange={handleChange}
        error={errorMessage || rest.error}
        classNames={{ input: inputClassName }}
        rightSectionPointerEvents='all'
        rightSection={
          clearable ? (
            <CloseButton
              aria-label='Clear input'
              onClick={handleClear}
              style={{ display: value ? undefined : 'none' }}
            />
          ) : null
        }
        {...rest}
      />
    </div>
  );
}

export default CustomTextInput;

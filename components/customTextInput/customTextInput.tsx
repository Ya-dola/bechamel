import React, { useState } from 'react';
import { TextInput, TextInputProps, CloseButton } from '@mantine/core';
import { ZodSchema, z, ZodError } from 'zod';

export interface CustomTextInputProps extends TextInputProps {
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
  /** Whether to show a clear (X) button when there is text */
  clearable?: boolean;
  containerClassName?: string;
  variant?: 'filled' | 'default' | 'unstyled';
  /**
   * An external error message (for example from react-hook-form).
   * This is used when the field is empty.
   */
  externalError?: string;
}

export function CustomTextInput({
  type = 'text',
  value = '',
  onValueChange,
  schema,
  clearable = true,
  containerClassName,
  variant = 'filled',
  externalError,
  ...rest
}: CustomTextInputProps) {
  // Use default Zod email validator if type is "email" and no schema provided.
  const effectiveSchema =
    schema ??
    (type === 'email' ? z.string().email('Invalid email address') : undefined);

  const [internalError, setInternalError] = useState<string | undefined>(
    undefined,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    if (effectiveSchema) {
      try {
        // If the field is empty, clear error; otherwise validate.
        effectiveSchema.parse(newValue);
        setInternalError(undefined);
      } catch (error) {
        if (error instanceof ZodError) {
          // Join all error messages if needed.
          setInternalError(error.errors.map((err) => err.message).join(', '));
        } else if (error instanceof Error) {
          setInternalError(error.message);
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

  // If the field is empty, use the external error (e.g. "Email is required");
  // otherwise, show the inline (internal) error.
  const finalError = value.trim() === '' ? externalError : internalError;

  const handleClear = () => {
    if (onValueChange) {
      onValueChange('');
    }
    setInternalError(undefined);
  };
  return (
    <div className={`${containerClassName}`}>
      <TextInput
        type={type}
        value={value}
        onChange={handleChange}
        error={finalError}
        variant={variant}
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

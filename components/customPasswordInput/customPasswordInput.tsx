import React, { useState } from 'react';
import {
  PasswordInput,
  PasswordInputProps,
  // CloseButton,
  Popover,
  Progress,
  Text,
  Box,
} from '@mantine/core';
import { ZodSchema, ZodError } from 'zod';
import CustomIcon from '@/components/customIcon/customIcon';

export interface CustomPasswordInputProps extends PasswordInputProps {
  /** The current value of the input */
  value?: string;
  /**
   * A change handler that receives the new value as a string.
   * This is separate from the default onChange which receives the event.
   */
  onValueChange?: (value: string) => void;
  /**
   * An optional Zod schema to validate the input.
   * If not provided, no additional schema validation occurs.
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

// Password requirements for showing password strength
const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;
  requirements.forEach((req) => {
    if (!req.re.test(password)) {
      multiplier++;
    }
  });
  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text
      c={meets ? 'teal' : 'red'}
      style={{ display: 'flex', alignItems: 'center' }}
      mt={6}
      size='sm'
    >
      {meets ? (
        <CustomIcon
          iconSize={'20'}
          icon={'line-md:confirm'}
          iconColor={'teal'}
        />
      ) : (
        <CustomIcon
          iconSize={'20'}
          icon={'line-md:close-small'}
          iconColor={'red'}
        />
      )}
      <Box ml={10}>{label}</Box>
    </Text>
  );
}

export function CustomPasswordInput({
  value = '',
  onValueChange,
  schema,
  inputClassName,
  // clearable = true,
  maxWidthClass,
  ...rest
}: CustomPasswordInputProps) {
  // Use the provided schema if any; no default for password is applied here.
  const effectiveSchema = schema;

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [popoverOpened, setPopoverOpened] = useState(false);

  const strength = getStrength(value);
  const progressColor =
    strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    if (effectiveSchema) {
      try {
        if (newValue.trim() === '') {
          setErrorMessage(undefined);
        } else {
          effectiveSchema.parse(newValue);
          setErrorMessage(undefined);
        }
      } catch (error) {
        if (error instanceof ZodError) {
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

  // const handleClear = () => {
  //   if (onValueChange) {
  //     onValueChange('');
  //   }
  //   setErrorMessage(undefined);
  // };

  return (
    <div className={`w-full ${maxWidthClass ? maxWidthClass : ''}`}>
      <Popover
        opened={popoverOpened}
        position='bottom'
        width='target'
        transitionProps={{ transition: 'pop', duration: 200 }}
      >
        <Popover.Target>
          <div
            onFocusCapture={() => setPopoverOpened(true)}
            onBlurCapture={() => setPopoverOpened(false)}
          >
            <PasswordInput
              value={value}
              onChange={handleChange}
              error={errorMessage || rest.error}
              classNames={{ input: inputClassName }}
              // // Use leftSection for the clear button:
              // leftSection={
              //   clearable ? (
              //     <CloseButton
              //       aria-label='Clear password input'
              //       onClick={handleClear}
              //       style={{ display: value ? undefined : 'none' }}
              //     />
              //   ) : null
              // }
              // Do not override rightSection so the default visibility toggle remains.
              {...rest}
            />
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <Progress
            color={progressColor}
            value={strength}
            size={5}
            mb='xs'
          />
          <PasswordRequirement
            label='Includes at least 6 characters'
            meets={value.length > 5}
          />
          {requirements.map((req, index) => (
            <PasswordRequirement
              key={index}
              label={req.label}
              meets={req.re.test(value)}
            />
          ))}
        </Popover.Dropdown>
      </Popover>
    </div>
  );
}

export default CustomPasswordInput;

import { MultiSelect, MultiSelectProps } from '@mantine/core';

interface CustomMultiSelectProps extends MultiSelectProps {
  items: string[];
}

function CustomMultiSelect({ items = [], ...rest }: CustomMultiSelectProps) {
  return (
    <div className='relative'>
      <MultiSelect
        placeholder='Filter Categories'
        data={items}
        clearable
        {...rest}
      />
    </div>
  );
}

export default CustomMultiSelect;

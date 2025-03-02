import React from 'react';
import { MultiSelect } from '@mantine/core';

interface MultiSelectProps {
  items?: string[]; // Define that items is an optional array of strings
}

const CustomMultiSelect: React.FC<MultiSelectProps> = ({ items = [] }) => {
  // Default to an empty array
  return (
    <div className='relative'>
      <MultiSelect
        label='' // You can set a label if needed
        placeholder='Filter Categories'
        data={items} // Pass items directly without wrapping in another array
        clearable
      />
    </div>
  );
};

export default CustomMultiSelect;

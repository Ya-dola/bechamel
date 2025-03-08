import React from 'react';

interface DropdownProps {
  useremail: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  onSelect,
  useremail = '',
}) => {
  if (!isOpen) return null;

  return (
    <div className='absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white z-10'>
      <div
        className='py-1'
        role='menu'
        aria-orientation='vertical'
        aria-labelledby='options-menu'
      >
        <text className='flex justify-center py-2'>{useremail}</text>
        <button
          className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
          onClick={() => {
            onSelect('Settings');
            onClose();
          }}
        >
          Settings
        </button>
        <button
          className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
          onClick={() => {
            onSelect('Sign Out'); // Trigger sign out
            onClose();
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Dropdown;

import React, { useState } from 'react';
import Dropdown from '../dropdownComponent/dropdownComponent'; // Adjust the path if needed
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth_store';

interface ProfileComponentsProps {
  text?: string;
}

function ProfileComponent({ text = '' }: ProfileComponentsProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const { session, signOut } = useAuthStore();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = async (option: string) => {
    if (option === 'Sign Out') {
      try {
        await signOut();
        router.push('/landing_page');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    } else if (option === 'Settings') {
      router.push('/resetPassword');
    }
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className='relative inline-block text-left'>
      <div
        className='flex w-8 h-8 items-center justify-center rounded-full bg-rose-400 mr-2 cursor-pointer text-black'
        onClick={toggleDropdown}
      >
        {session?.user?.email
          ? `${session.user.email.charAt(0).toUpperCase()}${text}`
          : text}
      </div>

      <Dropdown
        useremail={`${session?.user.email}`}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={handleOptionSelect} // Pass the option select handler
      />
    </div>
  );
}

export default ProfileComponent;

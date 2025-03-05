import { ReactNode } from 'react';
import {
  AppShell,
  Flex,
  MantineSpacing,
  rem,
  UnstyledButton,
} from '@mantine/core';
import { useHeadroom } from '@mantine/hooks';
import Link from 'next/link';
import ProfileComponent from '../profileComponent/profileComponent';

import LogoImage from '../logoImage/logoImage';

interface CustomAppShellProps {
  children: ReactNode;
  padding?: MantineSpacing;
  textColor?: string;
  buttonColor?: string;
  buttonHoveredColor?: string;
  buttonBorderColor?: string;
}

function CustomAppShell({
  padding = 'md',
  textColor = 'text-gray-900',
  buttonColor = 'bg-violet-300',
  buttonHoveredColor = 'hover:bg-white',
  buttonBorderColor = 'hover:border-violet-400',
  children,
}: CustomAppShellProps) {
  // Becomes true after moving 30 pixels down the page
  const pinned = useHeadroom({ fixedAt: 30 });

  // Boolean value to determine if the device is mobile
  //const isMobile = useIsMobile();

  return (
    <AppShell
      // Set the header configuration
      header={{
        height: 60,
        // Collapse the header on mobile devices when the user scrolls past 30px
        //collapsed: isMobile ? !pinned : false,
        collapsed: !pinned,
        // Prevent offsetting the main content when the header is collapsed
        offset: false,
      }}
      padding={padding}
    >
      <AppShell.Header>
        <Flex
          direction={'row'}
          justify={'space-between'}
          gap={'md'}
          px={'md'}
          py={'xs'}
          align={'center'}
        >
          <Flex align={'center'}>
            <LogoImage width={36} />

            <UnstyledButton
              component={Link}
              href={'/'}
              mr={'auto'}
            >
              KoiPad
            </UnstyledButton>
          </Flex>
          <Flex
            align={'center'}
            gap={'md'}
          >
            <Link
              href='/home_page'
              className={`rounded-full transition-colors flex items-center justify-center ${textColor} text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 hover:underline`}
            >
              Home
            </Link>
            <Link
              href='/home_page'
              className={`rounded-full transition-colors flex items-center justify-center  ${textColor} text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 hover:underline`}
            >
              Browse Recipes
            </Link>
            <input
              type='text'
              placeholder='Search...'
              className='h-10 sm:h-10 px-4 rounded-full bg-gray-200 text-black placeholder-gray-500'
            />
            <Link
              href='/insert_recipe'
              className={`rounded-full transition-colors flex items-center justify-center ${buttonColor} ${buttonHoveredColor} ${textColor} text-sm sm:text-base h-10 sm:h-10 px-4 sm:px-5 sm:min-w-44 hover:border ${buttonBorderColor}`}
            >
              New Recipe
            </Link>
            <ProfileComponent />
          </Flex>
        </Flex>
      </AppShell.Header>

      <AppShell.Main
        style={{
          // Relative positioning to ensure the
          // z-index for child elements works properly
          position: 'relative',
          // Ensure the main content is displayed above the background image
          zIndex: 1,
        }}
        // Add padding to the top so that content is not covered by the header
        pt={`calc(${rem(60)} )`}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

export default CustomAppShell;

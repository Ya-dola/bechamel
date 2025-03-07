'use client';

import CustomAppShell from '@/components/customAppShell/customAppShell';
import { Icon } from '@iconify/react/dist/iconify.js';
import Link from 'next/link';

function ComingSoonClient() {
  return (
    <CustomAppShell>
      <div className='flex flex-col justify-center gap-2 px-40 py-4 bg-gray-100 w-full'>
        <div className='flex flex-row w-full align-middle justify-center items-center text-9xl font-semibold'>
          Coming Soon
        </div>
        <div className='flex flex-row justify-center py-4 items-center '>
          <Icon icon={'line-md:arrow-left'} />
          <Link
            href='/home_page'
            className={`rounded-full transition-colors flex items-center  text-xl  px-2 sm:min-w-44 hover:underline`}
          >
            Back
          </Link>
        </div>
        ;
      </div>
    </CustomAppShell>
  );
}
export default ComingSoonClient;

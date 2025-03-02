'use client';

import IconCard from '@/components/iconCard/iconCard';
import CustomImage from '@/components/customImage/customImage';

import CustomAppShell from '@/components/customAppShell/customAppShell';

import CustomBadge from '@/components/customBadge/customBadge';
import IngredientCard from '@/components/ingredientCard/ingredientCard';
import DirectionsCards from '@/components/directionsCard/directionsCard';
import NotesCard from '@/components/notesCard/notesCard';

import { Icon } from '@iconify/react/dist/iconify.js';

interface RecipePageClientProps {
  recipeName?: string;
  textColor?: string;
  bgColor?: string;
  buttonColor?: string;
  buttonHoveredColor?: string;
  buttonBorderColor?: string;
}

function RecipePageClient({
  recipeName = 'Recipe Name',
  bgColor = 'bg-gray-100',
}: RecipePageClientProps) {
  return (
    <CustomAppShell padding={0}>
      <div
        className={`flex flex-row p-10 px-40 gap-10 justify-center ${bgColor}`}
      >
        <div className='flex flex-col gap-8 justify-between '>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row justify-between items-center'>
              <h1 className='w-full text-[40px] leading-[44px] tracking[-0.03em] font-semibold text-left'>
                {recipeName}
              </h1>
              <div className='flex items-center justify-center w-8 h-8 border-1 border-black rounded-full'>
                <Icon
                  icon={'line-md:heart'}
                  height={20}
                  width={20}
                />
              </div>
            </div>

            <div className='flex flex-row gap-1'>
              <div className='w-8 h-8 rounded-full bg-gray-400 mr-2' />
              <h2 className='w-full text-left'>username</h2>
            </div>
            <div className='flex flex-row gap-2 w-fit'>
              <CustomBadge text='breakfast' />
              <CustomBadge text='sweets' />
              <CustomBadge text='brunch' />
            </div>
          </div>

          <div className='flex flex-row gap-2'>
            <IconCard
              label={'Prep Time'}
              subText={'5 min'}
              bgColor={'bg-green-200'}
              labelColor={'text-slate-700'}
              subTextColor={'text-slate-900'}
            />
            <IconCard
              label={'Prep Time'}
              subText={'5 min'}
              bgColor={'bg-green-200'}
              labelColor={'text-slate-700'}
              subTextColor={'text-slate-900'}
            />
            <IconCard
              label={'Prep Time'}
              subText={'5 min'}
              bgColor={'bg-green-200'}
              labelColor={'text-slate-700'}
              subTextColor={'text-slate-900'}
            />
            <IconCard
              label={'Prep Time'}
              subText={'5 min'}
              bgColor={'bg-green-200'}
              labelColor={'text-slate-700'}
              subTextColor={'text-slate-900'}
            />
          </div>
        </div>
        <div className='flex items-center'>
          <CustomImage
            width={600}
            radius='md'
            imageSrc='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png'
          />
        </div>
      </div>
      <div className='flex flex-row p-10 px-40 gap-10 justify-center'>
        <div className='flex flex-col gap-8'>
          <IngredientCard />
          <NotesCard />
        </div>
        <div>
          <DirectionsCards />
        </div>
      </div>
    </CustomAppShell>
  );
}

export default RecipePageClient;

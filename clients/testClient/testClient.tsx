'use client';

import DirectionsCards from '@/components/directionsCard/directionsCard';
import CustomBadge from '@/components/customBadge/customBadge';
import IconCard from '@/components/iconCard/iconCard';
import IngredientCard from '@/components/ingredientCard/ingredientCard';
import LineBookCard from '@/components/lineBookCard/lineBookCard';
import CustomImage from '@/components/customImage/customImage';
import CustomAppShell from '@/components/customAppShell/customAppShell';
import RecipeCard from '@/components/recipeCard/recipeCard';
import NotesCard from '@/components/notesCard/notesCard';

function TestClient() {
  return (
    <CustomAppShell padding={0}>
      <div className='flex flex-col p-8 gap-4'>
        <h1 className='w-full text-center'>Test Client</h1>
        <div className='flex flex-row flex-wrap p-8 gap-4'>
          <LineBookCard />
          <IngredientCard />
          <DirectionsCards />
          <NotesCard />
          <IconCard label={'Label'} />
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
            icon={'line-md:speed'}
            bgColor={'bg-orange-200'}
            labelColor={'text-slate-700'}
            subTextColor={'text-slate-900'}
          />
          <IconCard
            label={'Prep Time'}
            subText={'5 min'}
            icon={'line-md:speed'}
            iconSize={'36'}
            iconColor={'text-emerald-400'}
            bgColor={'bg-violet-200'}
            labelColor={'text-slate-700'}
            subTextColor={'text-slate-900'}
          />
          <IconCard
            label={'Prep Time'}
            subText={'5 min'}
            icon={'line-md:speed'}
            iconSize={'48'}
            bgColor={'bg-green-200'}
            labelColor={'text-slate-700'}
            subTextColor={'text-slate-900'}
          />
          <IconCard
            label={'Prep Time'}
            subText={'5 min'}
            icon={'line-md:speed'}
            iconSize={'128'}
            iconColor={'text-rose-400'}
            bgColor={'bg-red-300'}
            labelColor={'text-slate-700'}
            subTextColor={'text-slate-900'}
          />
          <CustomBadge text={'Custom Badge'} />
          <CustomBadge
            text={'With Icon'}
            icon={'line-md:star'}
          />
        </div>
        <CustomImage
          height={200}
          imageSrc='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png'
        />
        <RecipeCard
          heading='Pancake'
          username='Firt name lastname'
          totalTime={60}
          difficulty={'hard'}
          width={300}
          imageSrc='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png'
        />
      </div>
    </CustomAppShell>
  );
}

export default TestClient;

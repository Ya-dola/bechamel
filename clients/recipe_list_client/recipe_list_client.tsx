'use client';

import CustomAppShell from '@/components/customAppShell/customAppShell';
import CustomMultiSelect from '@/components/customMultiSelect/customMultiSelect';

import RecipeCard from '@/components/recipeCard/recipeCard';

function RecipeListClient() {
  const categories = ['Breakfast', 'Soups', 'Lunch', 'Mains', 'Desserts'];

  return (
    <CustomAppShell padding={0}>
      <div className='flex flex-col px-40 justify-center w-full '>
        <div className='flex flex-row justify-between py-16'>
          <h2 className='text-xl text-left font-semibold'>My Recipes</h2>
          <CustomMultiSelect items={categories} />
        </div>
        <div className='flex flex-wrap justify-between gap-8'>
          <RecipeCard
            heading='Pancake'
            username='Firt name lastname'
            totalTime={60}
            difficulty={'hard'}
            width={300}
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
          <RecipeCard
            heading='Pancake'
            username='Firt name lastname'
            totalTime={60}
            difficulty={'hard'}
            width={300}
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
          <RecipeCard
            heading='Pancake'
            username='Firt name lastname'
            totalTime={60}
            difficulty={'hard'}
            width={300}
            imageSrc='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png'
          />
        </div>
      </div>
    </CustomAppShell>
  );
}

export default RecipeListClient;

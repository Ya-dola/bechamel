'use client';

import { useState } from 'react';
import DirectionsCards from '@/components/directionsCard/directionsCard';
import CustomBadge from '@/components/customBadge/customBadge';
import IconCard from '@/components/iconCard/iconCard';
import IngredientCard from '@/components/ingredientCard/ingredientCard';
import LineBookCard from '@/components/lineBookCard/lineBookCard';
import CustomImage from '@/components/customImage/customImage';
import CustomAppShell from '@/components/customAppShell/customAppShell';
import RecipeCard from '@/components/recipeCard/recipeCard';
import NotesCard from '@/components/notesCard/notesCard';
import CustomTextInput from '@/components/customTextInput/customTextInput';
import CustomPasswordInput from '@/components/customPasswordInput/customPasswordInput';
import GradientCard from '@/components/gradientCard/gradientCard';

function TestClient() {
  const [textValue, setTextValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [password, setPassword] = useState('');

  return (
    <CustomAppShell padding={0}>
      <div className='flex flex-col p-8 gap-4 pb-30'>
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
          <RecipeCard
            heading='Pancake'
            username='Firt name lastname'
            totalTime={60}
            difficulty={'hard'}
            width={300}
            imageSrc='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png'
          />
          <GradientCard>
            <p>Gradient Card</p>
          </GradientCard>
          <GradientCard
            gradient={
              'bg-gradient-to-b from-violet-300 from-40% to-emerald-600/50 to-90%'
            }
          >
            <p>Gradient Card</p>
            <p>With Green Color</p>
          </GradientCard>

          <div className='w-fit h-fit'>
            <h2 className='text-xl font-bold mb-2'>Plain Text Input</h2>
            <CustomTextInput
              label='Text Input'
              placeholder='Enter some text'
              value={textValue}
              onValueChange={setTextValue}
              containerClassName={'w-sm'}
              clearable
            />
          </div>
          <div className='w-fit h-fit'>
            <h2 className='text-xl font-bold mb-2'>Email Input</h2>
            <CustomTextInput
              type='email'
              label='Email Input'
              placeholder='Enter your email'
              value={emailValue}
              onValueChange={setEmailValue}
              containerClassName={'w-md'}
              clearable
              withAsterisk
            />
          </div>
          <div className='w-fit h-fit'>
            <h2 className='text-xl font-bold mb-2'>Password Input</h2>
            <CustomPasswordInput
              label={'Password'}
              placeholder={'Enter your password'}
              value={password}
              onValueChange={setPassword}
              containerClassName={'w-lg'}
            />
            <p>Current Password: {password}</p>
          </div>
          <CustomImage
            height={250}
            imageSrc='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png'
          />
        </div>
      </div>
    </CustomAppShell>
  );
}

export default TestClient;

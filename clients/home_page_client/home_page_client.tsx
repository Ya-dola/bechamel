'use client';

import IconCard from '@/components/iconCard/iconCard';
import CustomImage from '@/components/customImage/customImage';
import RecipeCard from '@/components/recipeCard/recipeCard';
import CustomAppShell from '@/components/customAppShell/customAppShell';
import CustomIcon from '@/components/customIcon/customIcon';
import Link from 'next/link';
import AuthenticatedPage from '@/components/authenticated_page/authenticated_page';

interface HomePageClientProps {
  textColor?: string;
  bgColor?: string;
  buttonColor?: string;
  buttonHoveredColor?: string;
  buttonBorderColor?: string;
}

function HomePageClient({ bgColor = 'bg-gray-100' }: HomePageClientProps) {
  return (
    <AuthenticatedPage>
      <CustomAppShell padding={0}>
        <div className='flex flex-col w-full'>
          <div
            className={`flex flex-row p-10 px-40 gap-10 justify-center items-center ${bgColor}`}
          >
            <div className='flex flex-col gap-8'>
              <div className='flex flex-col gap-4'>
                <h1 className='w-full text-[40px] leading-[44px] tracking[-0.03em] font-semibold text-left'>
                  Better than an expensive cookery book
                </h1>
                <h2 className='w-full text-left'>
                  Learn how to make your favourite dishes
                </h2>
              </div>
              <div className='w-fit'>
                <input
                  type='text'
                  placeholder='Search...'
                  className='h-10 sm:h-10 px-4 rounded-full bg-gray-200 text-black placeholder-gray-500'
                />
              </div>
            </div>
            <div className='flex items-center'>
              <CustomImage
                width={800}
                radius='md'
                imageSrc='/images/hp.png'
              />
            </div>
          </div>
          <div className='flex flex-col w-full py-8 px-40  gap-8 '>
            <div className='flex flex-row gap-2 items-center'>
              <h2 className='text-xl font-semibold'>Recipes by Category</h2>
              <CustomIcon
                icon={'line-md:chevron-right'}
                iconSize={'25'}
              />
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
          <div className={`flex flex-col w-full py-8 px-40 gap-8  ${bgColor}`}>
            <Link
              href='/recipe_list'
              className='flex flex-row gap-2 items-center'
            >
              <h2 className='text-xl font-semibold'>My Recipes</h2>
              <CustomIcon
                icon={'line-md:chevron-right'}
                iconSize={'25'}
              />
            </Link>
            <div className='flex flex-row gap-8'>
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
          <div className={`flex flex-col w-full py-8 px-40 gap-8  ${bgColor}`}>
            <div className='flex flex-row gap-2 items-center'>
              <h2 className='text-xl font-semibold'>My Favourites</h2>
              <CustomIcon
                icon={'line-md:chevron-right'}
                iconSize={'25'}
              />
            </div>
            <div className='flex flex-row gap-8'>
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
          <div className='flex flex-row items-center overflow-hidden w-full'>
            <CustomImage
              width={400}
              radius='0'
              imageSrc='/images/1.png'
            />
            <CustomImage
              width={400}
              radius='0'
              imageSrc='/images/lp.png'
            />
            <CustomImage
              width={400}
              radius='0'
              imageSrc='/images/2.png'
            />
            <CustomImage
              width={400}
              radius='0'
              imageSrc='/images/1.png'
            />
            <CustomImage
              width={400}
              radius='0'
              imageSrc='/images/3.png'
            />
          </div>
          <div
            className={`flex flex-col w-full py-8 gap-8 justify-center items-center text-center ${bgColor}`}
          >
            <div className='gap-2'>
              <h2 className='text-xl font-semibold'>Most Popular Recipes</h2>
              <p className='max-w-xl text-gray-700 leading-1.4'>
                Discover the crowd favorites that have delighted taste buds!
                Explore the recipes loved by our community and get inspired for
                your next meal.
              </p>
            </div>
            <div className='flex flex-row justify-center gap-8'>
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
        </div>
      </CustomAppShell>
    </AuthenticatedPage>
  );
}

export default HomePageClient;

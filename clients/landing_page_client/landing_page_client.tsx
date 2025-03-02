'use client';

import IconCard from '@/components/iconCard/iconCard';
import CustomImage from '@/components/customImage/customImage';
import RecipeCard from '@/components/recipeCard/recipeCard';
import Link from 'next/link';
import CustomIcon from '@/components/customIcon/customIcon';

interface LandingPageProps {
  textColor?: string;
  bgColor?: string;
  buttonColor?: string;
  buttonHoveredColor?: string;
  buttonBorderColor?: string;
}

function LandingPageClient({
  textColor = 'text-gray-900',
  bgColor = 'bg-gray-100',
  buttonColor = 'bg-violet-300',
  buttonHoveredColor = 'hover:bg-transparent',
  buttonBorderColor = 'hover:border-violet-400',
}: LandingPageProps) {
  return (
    <div className='flex flex-col justify-center w-full'>
      <div
        className={`flex flex-row p-10 px-40 gap-10 justify-center ${bgColor}`}
      >
        <div className='flex flex-col gap-16'>
          <div className='w-8 h-8 rounded-full bg-gray-400 mr-2' />
          <div className='flex flex-col gap-4'>
            <h1 className='w-full text-[40px] leading-[44px] tracking[-0.03em] font-semibold text-left'>
              Welcome to KoiPad, Your Culinary Treasure Trove
            </h1>
            <h2 className='w-full text-left'>
              Cook, Share, and Celebrate the Flavors of Life!
            </h2>
          </div>
          <div className='w-fit'>
            <Link
              href='/signIn'
              className={`rounded-full transition-colors flex items-center justify-center ${buttonColor} ${buttonHoveredColor} ${textColor} text-sm sm:text-base px-8 py-2 hover:border ${buttonBorderColor}`}
            >
              Get Started
              <CustomIcon
                iconSize={'25'}
                icon={'line-md:arrow-small-right'}
                iconSpacing={'ml-2'}
              />
            </Link>
          </div>
        </div>
        <div className='flex items-center'>
          <CustomImage
            width={800}
            radius='md'
            imageSrc='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png'
          />
        </div>
      </div>
      <div className='flex justify-center py-16'>
        <h2 className='max-w-2xl text-center text-lg text-gray-700 leading-1.3'>
          Curate your own digital cookbook! Save your favorite recipes in one
          easy-to-access location, complete with notes and tips, so you can
          recreate your best dishes time and time again.
        </h2>
      </div>

      <div
        className={`flex flex-col w-full py-8 gap-8 justify-center items-center text-center ${bgColor}`}
      >
        <div className='gap-2'>
          <h2 className='text-xl font-semibold'>Most Popular Recipes</h2>
          <p className='max-w-xl text-gray-700 leading-1.4'>
            Discover the crowd favorites that have delighted taste buds! Explore
            the recipes loved by our community and get inspired for your next
            meal.
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
      <div className='flex flex-col w-full py-8  gap-8 justify-center items-center text-center'>
        <div className='gap-2'>
          <h2 className='text-xl font-semibold'>Filter by Category</h2>
          <p className='max-w-xl text-gray-700 leading-1.3'>
            Easily find the perfect recipes for any occasion by exploring our
            curated categories—from appetizers and mains to desserts and dietary
            needs!
          </p>
        </div>
        <div className='flex flex-row justify-center gap-2'>
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
      <div
        className={`flex flex-row w-full gap-2 py-8 justify-center items-center ${bgColor}`}
      >
        <div className='flex flex-col gap-2 justify-center w-1/4'>
          <h2 className='text-xl font-semibold'>Quick Reference</h2>
          <p className='max-w-xl text-gray-700 leading-1.3'>
            Easily check prep and cook times, serving sizes, and difficulty
            ratings to streamline your cooking process!
          </p>
        </div>

        <CustomImage
          width={400}
          imageSrc='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png'
        />
      </div>
      <div className='flex flex-row w-full gap-2 py-8 justify-center items-center'>
        <div className='flex flex-col gap-2 justify-center w-1/4'>
          <h2 className='text-xl font-semibold'>Extra Notes</h2>
          <p className='max-w-xl text-gray-700 leading-1.3'>
            Add your personal touches, tips, and modifications to customize each
            recipe to your liking!
          </p>
        </div>
        <CustomImage
          width={400}
          imageSrc='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png'
        />
      </div>
      <div
        className={`flex flex-row w-full gap-2 py-8 justify-center items-center ${bgColor}`}
      >
        <div className='flex flex-col gap-2 justify-center w-1/4'>
          <h2 className='text-xl font-semibold'>Add Ingredients</h2>
          <p className='max-w-xl text-gray-700 leading-1.3'>
            Quickly compile and modify your ingredient list to make meal prep a
            breeze!
          </p>
        </div>
        <CustomImage
          width={400}
          imageSrc='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png'
        />
      </div>
    </div>
  );
}

export default LandingPageClient;

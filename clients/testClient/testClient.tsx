'use client';

import IconCard from '@/components/iconCard/iconCard';

function TestClient() {
  return (
    <div className='flex flex-row flex-wrap p-8 gap-4'>
      <h1>Test Client</h1>
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
    </div>
  );
}

export default TestClient;

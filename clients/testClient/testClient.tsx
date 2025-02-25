'use client';

import IconCard from '@/components/iconCard/iconCard';

function TestClient() {
  return (
    <div className='flex flex-col p-8 gap-4'>
      <h1>Test Client</h1>
      <IconCard label={'Label'} />
      <IconCard
        label={'Prep Time'}
        subText={'5 min'}
        bgColor={'bg-green-200'}
        labelColor={'text-slate-700'}
        subTextColor={'text-slate-900'}
      />
    </div>
  );
}

export default TestClient;

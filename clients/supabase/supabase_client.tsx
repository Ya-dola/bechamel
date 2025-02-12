'use client';

import { useFetchAll } from '@/hooks/useFetchAll';
import { useState, useEffect } from 'react';
import { Button, Switch, SegmentedControl } from '@mantine/core';
import { Tables } from '@/models/database.types';
import Link from 'next/link';

const TABLE_OPTIONS = [
  { label: 'Recipes', value: 'recipes' },
  { label: 'Categories', value: 'categories' },
] as const;

function SupabaseClient() {
  const [page, setPage] = useState(1);
  const [usePagination, setUsePagination] = useState(true);
  const [selectedTable, setSelectedTable] = useState<'recipes' | 'categories'>(
    'recipes',
  );
  const pageSize = 5;

  // Fetch data dynamically based on selected table
  const { data, isLoading, error, refetch, isFetching } = useFetchAll({
    table: selectedTable,
    page,
    pageSize,
    usePagination,
  });

  // Ensure count is a safe number
  const count = data?.count ?? 0;
  const items = data?.data ?? [];

  // Refetch data when the selected table changes
  useEffect(() => {
    refetch();
  }, [selectedTable, refetch]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-12 space-y-6 bg-black text-white'>
      {/* Title */}
      <h1 className='text-3xl font-bold'>Supabase Data Fetcher</h1>

      {/* Go Home Button */}
      <Button
        component={Link}
        href='/'
        variant='filled'
        color='blue'
        className='mb-4'
      >
        Home
      </Button>

      {/* Top Controls: Table Selection + Refresh Button + Pagination Toggle */}
      <div className='flex w-full max-w-lg items-center justify-between gap-4'>
        {/* Table Selection */}
        <SegmentedControl
          value={selectedTable}
          onChange={(value) =>
            setSelectedTable(value as 'recipes' | 'categories')
          }
          data={[...TABLE_OPTIONS]}
          fullWidth
          color='blue'
          classNames={{
            root: 'bg-black border border-white rounded-lg', // ✅ Black background with white border
            indicator: 'bg-blue-500', // ✅ Blue indicator for selected option
            control: 'text-white hover:bg-gray-800', // ✅ White text, dark hover
          }}
        />

        {/* Refresh Data Button */}
        <Button
          variant='outline'
          color='blue'
          onClick={() => refetch()}
          loading={isFetching}
        >
          {isFetching ? 'Refreshing...' : 'Refetch Data'}
        </Button>

        {/* Pagination Toggle */}
        <Switch
          checked={usePagination}
          onChange={() => setUsePagination(!usePagination)}
          label='Paginate'
          color='blue'
        />
      </div>

      {/* Loading & Error Messages */}
      {isLoading && <p className='text-gray-400'>Loading...</p>}
      {error && <p className='text-red-500'>{error.message}</p>}

      {/* Display Data or No Data Card */}
      <ul className='w-full max-w-lg space-y-3'>
        {items.length > 0 ? (
          items.map(
            (item: Tables<'recipes'> | Tables<'categories'>, index: number) => (
              <li
                key={'id' in item ? item.id : index}
                className='p-4 bg-black border border-white rounded-lg shadow-md'
              >
                <p className='text-sm text-gray-400'>ID: {item.id}</p>
                <strong className='text-lg text-white'>
                  {'name' in item ? item.name : `Row ${index + 1}`}
                </strong>
              </li>
            ),
          )
        ) : (
          <li className='p-4 bg-black border border-white rounded-lg shadow-md flex items-center justify-center'>
            <strong className='text-lg text-white'>No Data Available</strong>
          </li>
        )}
      </ul>

      {/* Pagination Controls */}
      {usePagination && count > 0 && (
        <div className='flex items-center gap-4 mt-6'>
          <Button
            variant='outline'
            color='blue'
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <Button
            variant='outline'
            color='blue'
            disabled={page * pageSize >= count}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default SupabaseClient;

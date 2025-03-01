import LineBookCard from '@/components/lineBookCard/lineBookCard';

function NotesCard() {
  return (
    <LineBookCard
      title={'Notes'}
      items={['note 1', 'note 2']}
      displayMode={'none'}
    />
  );
}

export default NotesCard;

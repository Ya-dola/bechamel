import LineBookCard from '@/components/lineBookCard/lineBookCard';

function DirectionsCards() {
  return (
    <LineBookCard
      title={'Directions'}
      items={['directions 1', 'directions 2']}
      displayMode={'steps'}
    />
  );
}
export default DirectionsCards;

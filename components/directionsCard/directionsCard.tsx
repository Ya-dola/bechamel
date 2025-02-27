import LineBookCard from '../lineBookCard/lineBookCard';

function DirectionsCards() {
  return (
    <LineBookCard
      title={'Directions'}
      items={['directions 1', 'directions 2']}
      showSteps={true}
    />
  );
}
export default DirectionsCards;

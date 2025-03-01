import LineBookCard from '@/components/lineBookCard/lineBookCard';

function DirectionsCards() {
  return (
    <LineBookCard
      title={'Directions'}
      items={[
        'm No. 11 of the Fatui Harbingers, codename Childe, but I also go by Tartaglia. And you... Hmm, you too like to cause quite the stir, dont you? Something tells me were going to get along splendidly.',
        'directions 2',
      ]}
      displayMode={'steps'}
    />
  );
}
export default DirectionsCards;

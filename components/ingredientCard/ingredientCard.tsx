import LineBookCard from '@/components/lineBookCard/lineBookCard';

function IngredientCard() {
  return (
    <LineBookCard
      title={'Ingredients'}
      items={['item 1', 'item 2']}
      displayMode={'checkboxes'}
    />
  );
}

export default IngredientCard;

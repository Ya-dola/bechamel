import LineBookCard from '@/components/lineBookCard/lineBookCard';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface IngredientCardProps {
  items?: Ingredient[];
}

function IngredientCard({ items = [] }: IngredientCardProps) {
  const formattedItems = items.map(
    (ing) => `${ing.name} - ${ing.amount} ${ing.unit}`,
  );
  return (
    <LineBookCard
      title='Ingredients'
      items={formattedItems}
      displayMode='checkboxes'
    />
  );
}

export default IngredientCard;

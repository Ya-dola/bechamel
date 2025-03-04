import LineBookCard from '@/components/lineBookCard/lineBookCard';

interface Direction {
  instruction: string;
}

interface DirectionsCardProps {
  items?: Direction[];
}

function DirectionsCard({ items = [] }: DirectionsCardProps) {
  const formattedItems = items.map((dir) => dir.instruction);
  return (
    <LineBookCard
      title='Directions'
      items={formattedItems}
      displayMode='steps'
    />
  );
}

export default DirectionsCard;

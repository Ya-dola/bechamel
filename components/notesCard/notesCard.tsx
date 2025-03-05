import LineBookCard from '@/components/lineBookCard/lineBookCard';

interface Note {
  note: string;
}
interface NotesCardProps {
  items?: Note[];
}

function NotesCard({ items = [] }: NotesCardProps) {
  const formattedItems = items.map((item) => item.note);
  return (
    <LineBookCard
      title={'Notes'}
      items={formattedItems}
      displayMode={'none'}
    />
  );
}

export default NotesCard;

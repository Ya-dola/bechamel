import { Checkbox } from '@mantine/core';

interface LineBookCardProps {
  title?: string;
  bgColor?: string;
  textColor?: string;
  lineColor?: string;
  displayMode?: 'steps' | 'checkboxes' | 'none'; // New displayMode prop
  items?: string[];
}

const LineBookCard: React.FC<LineBookCardProps> = ({
  title = 'Title',
  bgColor = 'bg-white',
  textColor = 'text-black',
  lineColor = 'border-gray-400',
  displayMode = 'checkboxes', // Default to checkboxes
  items = [],
}) => {
  return (
    <div
      className={`flex flex-col items-start p-4 ${bgColor} w-xl rounded-lg shadow-md`}
    >
      <h2
        className={`text-2xl font-semibold ${textColor} border-b ${lineColor} border-opacity-20 py-2 mb-4 w-full`}
      >
        {title}
      </h2>

      <ul className={`text-left ${textColor} w-full`}>
        {items.map((item, index) => (
          <li
            key={index}
            className={`flex  py-4 text-base ${
              index < items.length - 1
                ? `border-b ${lineColor} border-opacity-10`
                : ''
            }`}
          >
            {displayMode === 'steps' && (
              <span className={`font-semibold mr-2 w-16`}>
                Step {index + 1}:
              </span>
            )}
            {displayMode === 'checkboxes' && (
              <Checkbox
                color='indigo'
                size='md'
                className='mr-2'
              />
            )}
            <span className='ml-2 w-fit text-left'>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LineBookCard;

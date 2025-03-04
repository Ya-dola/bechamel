import { Image, Card } from '@mantine/core';
import Link from 'next/link';
import React from 'react';
import CustomBadge from '../customBadge/customBadge';
//import { useIsMobile } from '@/utils/breakpoint_utils';

interface RecipeCardProps {
  heading: string;
  username?: string;
  href?: string;
  imageSrc?: string;
  height?: number | string;
  width?: number;
  radius?: string;
  bgColor?: string;
  textColor?: string;
  headingColor?: string;
  headingSize?: string;
  headingWeight?: string;
  textSize?: string;
  buttonColor?: string;
  totalTime?: number;
  difficulty?: string;
}

function RecipeCard({
  heading,
  username = '',
  href = '',
  imageSrc = '',
  height,
  width,
  radius = 'md',
  bgColor = 'white',
  headingColor = 'text-black-500',
  headingSize = 'text-xl',
  headingWeight = 'font-medium',
  textColor = 'text-gray-700',
  textSize = 'sm',
  totalTime = 25,
  difficulty = '',
}: RecipeCardProps) {
  //const isMobile = useIsMobile();

  // Set the card height, falling back to 400 if not provided
  const cardHeight = height ?? 320;

  // State to track whether the card is hovered
  //const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      h={cardHeight}
      w={width}
      bg={bgColor}
      padding={'md'}
      component={Link}
      href={href}
      radius={radius}
      withBorder
    >
      <Card.Section>
        {imageSrc ? (
          <div className='relative h-[170px] overflow-hidden rounded-md'>
            <Image
              src={imageSrc}
              width={width}
              alt={heading} // Make the alt attribute descriptive
              style={{
                objectFit: 'cover', // Ensure the image covers its container
              }}
            />
          </div>
        ) : null}
      </Card.Section>

      <p
        className={`px-md mt-4 ${headingColor} ${headingWeight} ${headingSize}`}
      >
        {heading}
      </p>
      <p className={`mt-1 px-md ${textColor} ${textSize}`}>{username}</p>
      <div className='flex flex-row gap-4 mt-4'>
        <CustomBadge
          text={`Total time ${totalTime} mins`}
          icon={'line-md:circle'}
        />
        {difficulty && <CustomBadge text={`${difficulty}`} />}
      </div>
    </Card>
  );
}

export default RecipeCard;

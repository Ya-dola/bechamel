import { Image } from '@mantine/core';

interface LogoImageProps {
  width?: number;
  height?: number;
  radius?: string;
  altName?: string;
}

function LogoImage({
  width = 36,
  radius = 'md',
  altName = 'Logo',
}: LogoImageProps) {
  return (
    <Image
      alt={altName}
      radius={radius}
      h={'auto'}
      w={width}
      fit='contain'
      src={'/images/logo.png'}
    />
  );
}

export default LogoImage;

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Modal, Slider } from '@mantine/core';
import { Area } from 'react-easy-crop';
import { getCroppedImg } from '@/utils/imageUtils';

interface ImageCropperProps {
  imageFile: File;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
  maxFileSize?: number;
  quality?: number;
  format?: string;
  originalFileName?: string;
}

function ImageCropper({
  imageFile,
  onCropComplete,
  onCancel,
  maxFileSize = MAXIMAGESIZEMB,
  quality = 0.8,
  format = 'webp',
  originalFileName,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [estimatedSize, setEstimatedSize] = useState<number | null>(null);

  // Convert file to data URL for the Cropper.
  useEffect(() => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.onerror = () => {
      console.log('Error reading file');
    };
  }, [imageFile]);

  // When crop area or image changes, recalc the estimated file size.
  useEffect(() => {
    if (imageSrc && croppedAreaPixels) {
      getCroppedImg(imageSrc, croppedAreaPixels, quality, originalFileName)
        .then((file) => {
          setEstimatedSize(file.size);
        })
        .catch((error) => {
          console.log('Error estimating cropped file size:', error);
          setEstimatedSize(null);
        });
    }
  }, [imageSrc, croppedAreaPixels, quality, format, originalFileName]);

  const onCropCompleteCallback = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        quality,
        originalFileName,
      );
      // If, by chance, the file is too large, do not proceed.
      if (croppedFile.size > maxFileSize) {
        alert(
          `Cropped file is too large (${(
            croppedFile.size /
            (1024 * 1024)
          ).toFixed(2)} MB). Please adjust your crop.`,
        );
        return;
      }
      onCropComplete(croppedFile);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      opened
      onClose={onCancel}
      title='Crop your image'
      size='xl'
    >
      {/* Top row: display max file size */}
      <div className='mb-2 text-sm text-gray-700'>
        Max file size: {(maxFileSize / (1024 * 1024)).toFixed(2)} MB
      </div>
      <div className='relative w-full h-[400px] bg-[#333]'>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={16 / 9}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropCompleteCallback}
        />
      </div>
      <div className='mt-4 flex items-center gap-2'>
        <span className='text-md text-black'>Zoom</span>
        <Slider
          value={zoom}
          onChange={setZoom}
          min={1}
          max={3}
          step={0.1}
          label={(value) => `${value}`}
          className='w-full'
          color='#ddd6fe'
          styles={{
            thumb: { backgroundColor: '#a78bfa', borderColor: '#c4b5fd' },
          }}
        />
      </div>
      {/* Bottom row: display estimated file size */}
      <div className='mt-2 text-sm text-gray-700'>
        Estimated file size:{' '}
        {estimatedSize !== null
          ? `${(estimatedSize / (1024 * 1024)).toFixed(2)} MB`
          : 'Calculating...'}
      </div>
      <div className='flex justify-end mt-4 gap-2'>
        <button
          type='button'
          onClick={onCancel}
          className='rounded-xl transition-colors flex items-center justify-center text-sm h-10 px-4 bg-white border border-violet-300 text-black hover:bg-violet-100 hover:text-black'
        >
          Cancel
        </button>
        <button
          type='button'
          onClick={handleDone}
          disabled={estimatedSize !== null && estimatedSize > maxFileSize}
          className={`rounded-xl transition-colors flex items-center justify-center text-sm h-10 px-4 bg-violet-300 text-black ${
            estimatedSize !== null && estimatedSize > maxFileSize
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-violet-200 hover:border hover:border-violet-400'
          }`}
        >
          Done
        </button>
      </div>
    </Modal>
  );
}

export default ImageCropper;

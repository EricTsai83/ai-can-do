'use client';

import Image from 'next/image';
import { WritableDraft } from 'immer/dist/internal';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, Dispatch, DragEvent, SetStateAction } from 'react';
import { useImmer } from 'use-immer';
import LoadingButton from '@/components/LoadingButton';
import {
  FlipToastContainer,
  apiNotify,
  imgSizeNotify,
} from '@/components/ReactToast';
import TooltipContainer from '@/components/TooltipContainer';
import convertImageToBase64 from '@/utils/convert-image-to-base64';
import { SelectOption } from '../../../../../components/Select';
import { SearchParams } from '../../types';
import sampleImg1 from '../img/sample-img-1.jpg';
import sampleImg2 from '../img/sample-img-2.jpeg';
import type { FaceDetail } from '../types';

interface Props {
  faceDetails: FaceDetail[] | null;
  setFaceDetails: Dispatch<SetStateAction<FaceDetail[] | null>>;
  imageSrc: string | null;
  setImageSrc: Dispatch<SetStateAction<string | null>>;
  selectOption: SelectOption[];
  searchParams: SearchParams;
  canvasUrls: string | null;
  setCanvasUrls: Dispatch<SetStateAction<string | null>>;
}

interface ImageBase64String {
  [key: string]: string;
}

function Dropzone({
  setFaceDetails,
  imageSrc,
  setImageSrc,
  searchParams,
  canvasUrls,
  setCanvasUrls,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageBase64String, setImageBase64String] = useImmer<
    WritableDraft<ImageBase64String>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const imageFile = event.dataTransfer.files[0]!;
    const maxSize = 1.5 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      imgSizeNotify();
      return;
    }

    const imageUrl = URL.createObjectURL(imageFile);
    const base64String = (await convertImageToBase64(imageFile)) as string;
    setImageBase64String((draft) => {
      draft[imageUrl] = base64String;
    });
    setFaceDetails(null);
    setCanvasUrls(null);
    setImageSrc(imageUrl);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0]!;
    const maxSize = 1.5 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      imgSizeNotify();
      return;
    }

    const imageUrl = URL.createObjectURL(imageFile);
    const base64String = (await convertImageToBase64(imageFile)) as string;
    setImageBase64String((draft) => {
      draft[imageUrl] = base64String;
    });
    setImageSrc(imageUrl);
    event.target.value = '';
  };

  async function getFacialRecognition() {
    if (imageSrc) {
      try {
        setIsLoading(true);
        const res = await fetch('/api/aws', {
          method: 'POST',
          body: JSON.stringify({ image_base64: imageBase64String[imageSrc] }),
        });
        const facialRecoRes = await res.json();
        console.log(facialRecoRes);
        setFaceDetails(facialRecoRes.Tags.FaceDetails);
      } catch (e) {
        apiNotify();
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleSampleImgCallback = useCallback(
    async (blob: Blob) => {
      const imageUrl = URL.createObjectURL(blob);
      setImageSrc(imageUrl);
      const base64String = await convertImageToBase64(blob);
      setImageBase64String((draft) => {
        draft[imageUrl] = base64String as string;
      });
      setImageSrc(imageUrl);
    },
    [setImageSrc, convertImageToBase64, setImageBase64String, setImageSrc],
  );

  useEffect(() => {
    if (searchParams.img === 'sample-img-1') {
      fetch(sampleImg1.src)
        .then((response) => response.blob())
        .then((blob) => {
          handleSampleImgCallback(blob);
        })
        .catch((error) => {
          console.error('Failed to fetch image:', error);
        });
    } else if (searchParams.img === 'sample-img-2') {
      fetch(sampleImg2.src)
        .then((response) => response.blob())
        .then((blob) => {
          handleSampleImgCallback(blob);
        })
        .catch((error) => {
          console.error('Failed to fetch image:', error);
        });
    } else {
      // pass
    }
  }, [searchParams.img, handleSampleImgCallback]);

  return (
    <div className="w-full">
      <div
        className="
          relative mb-6 flex h-[360px] w-full 
          min-w-[360px] items-center 
          justify-center border-2 border-dashed
          border-black object-contain"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleBoxClick}>
        {imageSrc && (
          <Image
            className="absolute max-h-[360px] w-auto"
            src={canvasUrls ? canvasUrls : imageSrc}
            alt="Image"
            width={0}
            height={0}
          />
        )}
        {!imageSrc && (
          <p className="text-gray-500">點我或托照片到此區域來上傳圖片</p>
        )}

        <input
          type="file"
          accept="image/jpeg, image/png"
          ref={fileInputRef}
          onChange={handleUpload}
          className="absolute -left-full"
        />
      </div>
      <div className="flex justify-center">
        <TooltipContainer
          tooltips="
            在一段時間後，首次做模型推論，
            模型得先進行加載，若推論失敗，請等待幾秒鐘後，再次點擊按鈕。">
          <LoadingButton
            isLoading={isLoading}
            executeFunction={getFacialRecognition}
            text="模型推論"
          />
        </TooltipContainer>
      </div>

      <FlipToastContainer />
    </div>
  );
}

export default Dropzone;
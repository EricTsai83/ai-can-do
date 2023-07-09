'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { FaceDetail } from '../types';
import FacialRecognition from './FacialRecognition';
import MoodPieChart from './MoodPieChart';

interface Props {
  faceDetails: FaceDetail[] | null;
  faceUrls: string[];
}

function ImageMask({ faceDetails, faceUrls }: Props) {
  const [faceAnalysis, setFaceAnalysis] = useState<FaceDetail | null>(null);

  async function showFaceAnalysisResult(idx: number) {
    console.log(idx);
    faceDetails && setFaceAnalysis(faceDetails[idx]);
  }

  return (
    <div className="flex">
      <div className="flex w-full flex-col">
        <div className="flex gap-2">
          {faceUrls &&
            faceUrls.map((faceUrl, idx) => {
              return (
                <Image
                  className="cursor-pointer"
                  onClick={() => showFaceAnalysisResult(idx)}
                  key={idx}
                  src={faceUrl}
                  alt=""
                  width={100}
                  height={100}
                />
              );
            })}
        </div>
        {faceAnalysis && <FacialRecognition faceAnalysis={faceAnalysis} />}
      </div>
      <div className="flex grow items-center justify-center">
        <MoodPieChart faceAnalysis={faceAnalysis} />
      </div>
    </div>
  );
}

export default ImageMask;

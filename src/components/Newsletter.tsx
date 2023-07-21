'use client';
import { GiRobotGolem } from 'react-icons/gi';
import { GiArtificialHive } from 'react-icons/gi';
import { useRef, useState, useEffect } from 'react';
import {
  newsletterSubscribeSuccess,
  newsletterSubscribeFailure,
  StyledToastContainer,
  BounceToastContainer,
} from './ReactToast';
import smallRobot from '@/components/small-robot.png';
import Image from 'next/image';

function Newsletter() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [emailStatus, setEmailStatus] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');

  function validateEmail(email: string) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  useEffect(() => {
    const currRef = inputRef.current!;
    if (currRef.value) {
      if (emailStatus) {
        newsletterSubscribeSuccess();
        currRef.value = '';
      } else {
        newsletterSubscribeFailure();
      }
    }
  }, [email, emailStatus]);

  return (
    <div className="mt-32 flex w-full">
      <section className="relative w-full pb-10 pt-20 md:pb-20">
        <GiArtificialHive className="absolute left-5 top-5 z-10 text-6xl text-teal-700" />
        <div className="relative z-10 mt-5 items-center justify-between gap-12 px-4 md:flex md:px-8">
          <h3 className="max-w-[60%] font-bold md:max-w-[80%]">
            <div className="text-xl text-gray-700 md:text-2xl">
              現在訂閱電子報，獲取最新 AI 智能應用的第一手資訊吧。
            </div>
            <div className="mt-7 text-2xl text-gray-700 md:text-3xl">
              一起讓 AI 成為你人生的助力吧！
            </div>
          </h3>

          <div className="mt-6 md:mt-0">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-x-3 md:justify-end">
              <div className="relative">
                <svg // 信箱 icon
                  className="absolute inset-y-0 left-3 my-auto h-6 w-6 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <input
                  ref={inputRef}
                  placeholder="輸入信箱"
                  className="
                    w-full rounded-lg border bg-white py-2 pl-12 pr-3 
                  text-gray-500 shadow-sm outline-none focus:border-indigo-600"
                />
              </div>
              <button
                onClick={() => {
                  const currRef = inputRef.current as HTMLInputElement;
                  const isValid = validateEmail(currRef.value);
                  setEmailStatus(isValid);
                  setEmail(currRef.value);
                }}
                className="
                  block min-w-[64px] rounded-lg bg-indigo-600 px-4 py-3
                  text-center text-sm font-medium text-white shadow
                hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none">
                訂閱
              </button>
            </form>
          </div>
        </div>
        <div
          className="absolute inset-0 h-full w-full rounded-3xl"
          style={{
            background:
              'linear-gradient(to left, rgb(153, 246, 228), rgb(217, 249, 157))',
          }}>
          <div className="mb-3 hidden text-lg text-gray-500 md:absolute md:bottom-0 md:right-8 md:flex">
            <GiRobotGolem className="text-6xl text-indigo-700" />
            <div className="ml-5 flex items-end">
              Know what AI can do, and make AI do things for you.
            </div>
          </div>
        </div>

        <Image
          className="absolute bottom-3 right-10 md:bottom-16"
          src={smallRobot}
          width={200}
          height={200}
          alt=""
        />
      </section>
      {emailStatus ? <StyledToastContainer /> : <BounceToastContainer />}
    </div>
  );
}

export default Newsletter;

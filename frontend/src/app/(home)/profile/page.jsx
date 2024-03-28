"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {Card , CardContent} from "../../../components/ui/card"

const Page = () => {
  const storedUserId = localStorage.getItem('userId');
  const router = useRouter();

  useEffect(() => {
    if (!storedUserId) {
      router.push('/login');
    }
  }, [storedUserId]);

  return (
    <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-sm">
      <CardContent className="flex flex-col items-center">
        <img
          className="rounded-full"
          height="32"
          src="/pfp.jpg"
          style={{
            aspectRatio: "32/32",
            objectFit: "scale-down",
          }}
          width="96"
        />
        <div className="text-3xl font-medium leading-none mt-3"></div>
        {storedUserId && (
       
     <div className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">{storedUserId}</div>

      )}
   
        <div className="grid grid-cols-2 items-center gap-1.5 mt-4">
          <div className="flex flex-col items-center">
            <div className="text-xl font-semibold">235</div>
            <div className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">Matches</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl font-semibold">128</div>
            <div className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">Wins</div>
          </div>
        </div>
      </CardContent>
    </Card>

    </div>
  );
};

export default Page;

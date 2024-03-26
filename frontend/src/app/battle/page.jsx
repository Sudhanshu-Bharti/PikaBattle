import React from 'react';
import { Button } from '../../components/ui/button';
import Image from "next/image"
const Page = () => {
  return (
    <div className="grid items-center justify-center w-full gap-1" id='battle'>
        <div className="relative w-lvw h-96" style={{ backgroundImage: "url('/battleBackground2.png')", backgroundSize: "cover", backgroundPosition: "center" , objectFit:"fill" }}>
        <div className="flex justify-around items-center ">
        <div className="grid items-center justify-center w-full gap-4 right-full ">
          <div className="grid items-center justify-center gap-2 pr-80 pt-64">
            <div className="flex items-center gap-2">
              <img
                alt="Venusaur"
                height="96"
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/9.gif"
                style={{
                  aspectRatio: "120/120",
                  objectFit: "cover",
                }}
                width="96"
              />
              <div className="grid items-center gap-1">
                <h3 className="text-lg font-bold">Venusaur</h3>
                <div className="flex rounded-full border border-gray-200 w-full h-2">
                  <div className="rounded-full bg-green-500 w-1/2 h-2" />
                </div>
                <p className="text-sm font-medium">HP: 50/100</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid items-center justify-center w-full gap-4">
            
          <div className="grid items-center justify-center gap-2 pl-80 pb-56">
            <div className="flex items-center gap-2">
              <img
                alt="Charizard"
                height="96"
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/6.gif"
                style={{
                  aspectRatio: "96/96",
                  objectFit: "cover",
                }}
                width="96"
              />

              <div className="grid items-center gap-1  ">
                <h3 className="text-lg font-bold">Charizard</h3>
                <div className="flex rounded-full border border-gray-200 w-full h-2">
                  <div className="rounded-full bg-green-500 w-1/2 h-2" />
                </div>
                <p className="text-sm font-medium">HP: 50/100</p>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
       
        {/* <Image className='relative' src="/battleBackground.png" width="870" height="790" style={{}} /> */}
      

      <div className='flex flex-row-2'>
        <div className="flex flex-col gap-1 w-auto border-2 rounded-md m-2 p-2 border-orange-100">
          <h1 className='font-semibold text-xl'>Attacks</h1>
          <div className='grid grid-cols-4 gap-2'>
            <Button size="lg" variant="outline">
              Tackle
            </Button>
            <Button size="lg" variant="outline">
              Growl
            </Button>
            <Button size="lg" variant="outline">
              Razor Leaf
            </Button>
            <Button size="lg" variant="outline">
              Vine Whip
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-auto border-2 rounded-md m-2 p-2 border-orange-100">
          <h1 className='font-semibold text-xl'>Bag Items</h1>
          <div className='grid grid-cols-4 gap-2'>
            <Button size="sm" variant="outline">
              Revive
            </Button>
            <Button size="sm" variant="outline">
              Potion
            </Button>
            <Button size="sm" variant="outline">
              Super Potion
            </Button>
            <Button size="sm" variant="outline">
              Max potion
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 w-auto border-2 rounded-md m-2 p-2 border-orange-100">
        <h1 className='font-semibold text-xl'>Battle Log</h1>
        <p className="text-sm">Charizard dealt 50 damage</p>
        <p className="text-sm">Blastoise attacked 50 damage</p>
      </div>
    </div>
  );
};

export default Page;

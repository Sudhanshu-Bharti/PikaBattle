import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image"
const Navbar = async () => {


  return (
    <header className="w-full top-0">
      <div className=" p-4 flex items-center justify-between bg-orange-300">
        <Link href="/" className="flex items-center gap-2">
        <Image className="top-1 right-1  relative" src="/charizard-mega-x.png" width="50" height="50"/>
          <h2 className="mt-0.5 font-bold  text-3xl text-white">PikaBattle</h2>
        </Link>

        <div className="flex items-center gap-3">
          <div className="gap-2 justify-between flex ">
            <Button size="lg" variant="icon"><Link href='/pokemons'><Image className="top-6 right-6 relative" src="/poke.png" width="30" height="30"/> <p className="mb-6 ml-3 text-white">Pokemons</p></Link></Button>
            <Button size="lg" variant="icon"><Link href='/battle'><Image className="top-6 right-6 relative" src="/galar.png" width="30" height="30"/> <p className="mb-6 ml-3 text-white">Battle</p></Link></Button>
            <Button size="lg" variant="icon"><Link href='/explore'><Image className="top-6 right-6 relative" src="/lets-go.png" width="30" height="30"/> <p className="mb-6 ml-3 text-white">Explore</p></Link></Button>           
            <Button size="lg" variant="icon"><Link href='/profile'><Image className="top-6 right-6 relative" src="/game-boy.png" width="30" height="30"/> <p className="mb-6 ml-3 text-white">Profile</p></Link></Button>           

          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;

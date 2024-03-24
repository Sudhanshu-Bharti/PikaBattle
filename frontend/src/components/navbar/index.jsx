import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const Navbar = async () => {


  return (
    <header className="w-full">
      <div className=" p-4 flex items-center justify-between bg-orange-300">
        <Link href="/" className="flex items-center gap-2">
          <h5 className="mt-0.5">PikaBattle</h5>
        </Link>

        <div className="flex items-center gap-3">
          <div>
          <Button size="lg" variant="outline">
                   <Link href='/login'>Login</Link>
          </Button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;

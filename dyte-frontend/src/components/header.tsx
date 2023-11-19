import Image from 'next/image';
import React from 'react';

const Header = () => {
  return (
    <div className="w-full bg-white p-4 flex justify-between border-b-[1px] border-dashed border-primary_black">
      <div className="w-fit flex items-center">
        <Image src={'/dyte-logo.png'} alt="" width={1000} height={1000} className="w-32 h-fit" />
        <div className="font-primary font-thin text-4xl pb-1">logs</div>
      </div>
    </div>
  );
};

export default Header;

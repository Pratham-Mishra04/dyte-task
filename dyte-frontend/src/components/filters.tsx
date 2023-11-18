import { X } from '@phosphor-icons/react';
import React, { useEffect } from 'react';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filters = ({ setShow }: Props) => {
  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const levels = ['Level'];
  const resourceIds = ['Resource ID'];
  const traceIds = ['Trace ID'];
  const spanIds = ['Span ID'];
  const parentResourceIds = ['Parent Resource ID'];
  const commits = ['Commit'];

  return (
    <>
      <div className="fixed top-48 max-md:top-20 w-2/5 max-lg:w-5/6 h-1/3 max-lg:h-5/6 backdrop-blur-2xl bg-white flex flex-col gap-2 max-lg:gap-0 rounded-lg p-8 font-primary overflow-y-auto border-[1px] border-primary_black right-1/2 shadow-lg translate-x-1/2 animate-fade_third z-50 max-lg:z-[60]">
        <div className="w-full flex justify-between">
          <div className="font-semibold text-6xl text-gray-800">Filters</div>

          <X className="cursor-pointer" onClick={() => setShow(false)} size={32} />
        </div>

        <div>
          <div className="grid grid-cols-2 gap-4">
            <select className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
              <option value="">All Type</option>
              <option value="for-rent">For Rent</option>
              <option value="for-sale">For Sale</option>
            </select>

            <select className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
              <option value="">Furnish Type</option>
              <option value="fully-furnished">Fully Furnished</option>
              <option value="partially-furnished">Partially Furnished</option>
              <option value="not-furnished">Not Furnished</option>
            </select>

            <select className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
              <option value="">Any Price</option>
              <option value="1000">RM 1000</option>
              <option value="2000">RM 2000</option>
              <option value="3000">RM 3000</option>
              <option value="4000">RM 4000</option>
            </select>

            <select className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
              <option value="">Floor Area</option>
              <option value="200">200 sq.ft</option>
              <option value="400">400 sq.ft</option>
              <option value="600">600 sq.ft</option>
              <option value="800 sq.ft">800</option>
              <option value="1000 sq.ft">1000</option>
              <option value="1200 sq.ft">1200</option>
            </select>

            <select className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
              <option value="">Bedrooms</option>
              <option value="1">1 bedroom</option>
              <option value="2">2 bedrooms</option>
              <option value="3">3 bedrooms</option>
              <option value="4">4 bedrooms</option>
              <option value="5">5 bedrooms</option>
            </select>

            <select className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
              <option value="">Bathrooms</option>
              <option value="1">1 bathroom</option>
              <option value="2">2 bathrooms</option>
              <option value="3">3 bathrooms</option>
              <option value="4">4 bathrooms</option>
              <option value="5">5 bathrooms</option>
            </select>

            <select className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm">
              <option value="">Bathrooms</option>
              <option value="1">1 space</option>
              <option value="2">2 space</option>
              <option value="3">3 space</option>
            </select>
          </div>
        </div>

        <div className="w-full flex flex-col justify-between"></div>
      </div>
      <div
        onClick={() => setShow(false)}
        className="bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third z-30 max-lg:z-[51]"
      ></div>
    </>
  );
};

export default Filters;

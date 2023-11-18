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

  const handleSubmit = () => {};
  return (
    <>
      <div className="fixed top-48 max-md:top-20 w-1/3 max-lg:w-5/6 h-1/3 max-lg:h-fit backdrop-blur-2xl bg-white flex flex-col gap-2 max-lg:gap-0 rounded-lg p-8 font-primary overflow-y-auto border-[1px] border-primary_black right-1/2 shadow-lg translate-x-1/2 animate-fade_third z-50 max-lg:z-[60]">
        <div className="w-full flex justify-end">
          <X className="cursor-pointer" onClick={() => setShow(false)} size={32} />
        </div>
        <div className="w-full max-lg:h-56 lg:flex-1 flex flex-col justify-between">
          <div className="w-full flex flex-col gap-2">
            <div className="font-semibold text-4xl text-gray-800">Filters</div>
            <div className="font-medium text-sm">Cannot revert this action.</div>
          </div>

          <div
            onClick={handleSubmit}
            className="w-1/3 max-lg:w-1/2 mx-auto text-center bg-primary_comp border-2 border-primary_black hover:text-white py-2 rounded-xl text-xl hover:bg-gray-200 cursor-pointer transition-ease-200"
          >
            Save
          </div>
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className="bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third z-30 max-lg:z-[51]"
      ></div>
    </>
  );
};

export default Filters;

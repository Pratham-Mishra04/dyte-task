import { Log } from '@/types';
import React from 'react';
import moment from 'moment';

interface Props {
  log: Log;
}

const LogCard = ({ log }: Props) => {
  const getLogColor = () => {
    switch (log.level) {
      case 'info':
        return '#DCF9FD';
      case 'error':
        return '#FFBABA';
      case 'debug':
        return '#DAE0FF';
      case 'warn':
      case 'warning':
        return '#FEFFDB';
      case 'success':
        return '#DBFFDD';
      default:
        return '#fff';
    }
  };
  return (
    // <div className="w-3/5 bg-gray-50 flex flex-col gap-1 font-primary border-[1px] border-primary_black text-primary_black p-2 rounded-xl transition-ease-300">
    //   <div className="w-full font-medium text-xl">{log.message}</div>
    //   <div className="w-full flex justify-between">
    //     <div>Level: {log.level}</div>
    //     <div className="text-gray-600 text-xs">{moment(log.timestamp).format('HH:MM:SS DD-MM-YY')}</div>
    //   </div>
    //   <div>resourceId:{log.resourceId}</div>
    //   <div>traceId:{log.traceId}</div>
    //   <div>spanId:{log.spanId}</div>
    //   <div>parentResourceId:{log.parentResourceId}</div>
    //   <div>commit:{log.commit}</div>
    // </div>

    <div className="w-[95%] h-16 mx-auto border-b-[1px] border-gray-200 flex text-base text-gray-600">
      <div className="w-1/12 flex-center">{moment(log.timestamp).format('HH:MM:SS')}</div>
      <div className="w-1/12 flex-center">{moment(log.timestamp).format('DD MMM YY')}</div>
      <div className="w-4/12 flex-center">{log.message}</div>
      <div className="w-1/12 flex-center">
        <div style={{ backgroundColor: getLogColor() }} className="w-20 rounded-lg p-1 flex-center text-sm font-medium">
          {log.level}
        </div>
      </div>
      <div className="w-1/12 flex-center">{log.resourceId}</div>
      <div className="w-1/12 flex-center">{log.traceId}</div>
      <div className="w-1/12 flex-center">{log.spanId}</div>
      <div className="w-1/12 flex-center">{log.commit}</div>
      <div className="w-1/12 flex-center">{log.parentResourceId}</div>
    </div>
  );
};

export default LogCard;

import { Log } from '@/types';
import React from 'react';
import moment from 'moment';

interface Props {
  log: Log;
}

const LogCard = ({ log }: Props) => {
  return (
    <div className="w-3/5 bg-gray-50 flex flex-col gap-1 font-primary border-[1px] border-primary_black text-primary_black p-2 rounded-xl transition-ease-300">
      <div className="w-full font-medium text-xl">{log.message}</div>
      <div className="w-full flex justify-between">
        <div>Level: {log.level}</div>
        <div className="text-gray-600 text-xs">{moment(log.timestamp).format('HH:MM:SS DD-MM-YY')}</div>
      </div>
      <div>resourceId:{log.resourceId}</div>
      <div>traceId:{log.traceId}</div>
      <div>spanId:{log.spanId}</div>
      <div>parentResourceId:{log.parentResourceId}</div>
      <div>commit:{log.commit}</div>
    </div>
  );
};

export default LogCard;

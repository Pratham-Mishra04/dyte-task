import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import { Backspace, X } from '@phosphor-icons/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filters = ({ setShow }: Props) => {
  const [levels, setLevels] = useState(['Level']);
  const [resourceIds, setResourceIds] = useState(['Resource ID']);
  const [traceIds, setTraceIds] = useState(['Trace ID']);
  const [spanIds, setSpanIds] = useState(['Span ID']);
  const [parentResourceIds, setParentResourceIds] = useState(['Parent Resource ID']);
  const [commits, setCommits] = useState(['Commit']);

  const router = useRouter();

  const [level, setLevel] = useState(router.query.level || '');
  const [resourceId, setResourceId] = useState(router.query.resource_id || '');
  const [traceId, setTraceId] = useState(router.query.trace_id || '');
  const [spanId, setSpanId] = useState(router.query.span_id || '');
  const [parentResourceId, setParentResourceId] = useState(router.query.parent_resource_id || '');
  const [commit, setCommit] = useState(router.query.commit || '');
  const [start, setStart] = useState(router.query.start || '');
  const [end, setEnd] = useState(router.query.end || '');

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const fetchFilterData = async () => {
    const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/filter_data`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      const filterData = res.data.filterData;
      setLevels(['Level', ...(filterData.levels || [])]);
      setResourceIds(['Resource ID', ...(filterData.resourceIds || [])]);
      setTraceIds(['Trace ID', ...(filterData.traceIds || [])]);
      setSpanIds(['Span ID', ...(filterData.spanIds || [])]);
      setParentResourceIds(['Parent Resource ID', ...(filterData.parentResourceIds || [])]);
      setCommits(['Commit', ...(filterData.commits || [])]);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error('Internal Server Error', 'error_toaster');
    }
  };

  useEffect(() => {
    fetchFilterData();
  }, []);

  useEffect(() => {
    if (level == 'Level') {
      router.query.level = '';
    } else {
      router.query.level = level;
    }
    router.push(router);
  }, [level]);

  useEffect(() => {
    if (resourceId == 'Resource ID') {
      router.query.resource_id = '';
    } else {
      router.query.resource_id = resourceId;
    }
    router.push(router);
  }, [resourceId]);

  useEffect(() => {
    if (traceId == 'Trace ID') {
      router.query.trace_id = '';
    } else {
      router.query.trace_id = traceId;
    }
    router.push(router);
  }, [traceId]);

  useEffect(() => {
    if (spanId == 'Span ID') {
      router.query.span_id = '';
    } else {
      router.query.span_id = spanId;
    }
    router.push(router);
  }, [spanId]);

  useEffect(() => {
    if (parentResourceId == 'Parent Resource ID') {
      router.query.parent_resource_id = '';
    } else {
      router.query.parent_resource_id = parentResourceId;
    }
    router.push(router);
  }, [parentResourceId]);

  useEffect(() => {
    if (commit == 'Commit') {
      router.query.commit = '';
    } else {
      router.query.commit = commit;
    }
    router.push(router);
  }, [commit]);

  useEffect(() => {
    router.query.start = start;
    router.push(router);
  }, [start]);

  useEffect(() => {
    router.query.end = end;
    router.push(router);
  }, [end]);

  const renderSelectOptions = (options: string[]) => {
    return options.map((option, index) => (
      <option key={index} value={option}>
        {option}
      </option>
    ));
  };

  return (
    <>
      <div className="fixed top-48 max-md:top-20 w-2/5 max-lg:w-5/6 h-fit backdrop-blur-2xl bg-white flex flex-col gap-4 max-lg:gap-2 rounded-lg p-8 font-primary overflow-y-auto border-[1px] border-primary_black right-1/2 shadow-lg translate-x-1/2 animate-fade_third z-50 max-lg:z-[60]">
        <div className="w-full flex justify-between">
          <div className="font-semibold text-6xl text-gray-800">Filters</div>
          <div className="w-fit flex gap-2">
            <Backspace
              className="cursor-pointer"
              onClick={() => {
                router.push('/');
                setShow(false);
              }}
              size={32}
            />
            <X className="cursor-pointer" onClick={() => setShow(false)} size={32} />
          </div>
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <select
              onChange={el => setLevel(el.target.value)}
              value={level}
              className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
            >
              {renderSelectOptions(levels)}
            </select>

            <select
              onChange={el => setResourceId(el.target.value)}
              value={resourceId}
              className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
            >
              {renderSelectOptions(resourceIds)}
            </select>

            <select
              onChange={el => setTraceId(el.target.value)}
              value={traceId}
              className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
            >
              {renderSelectOptions(traceIds)}
            </select>

            <select
              onChange={el => setSpanId(el.target.value)}
              value={spanId}
              className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
            >
              {renderSelectOptions(spanIds)}
            </select>

            <select
              onChange={el => setParentResourceId(el.target.value)}
              value={parentResourceId}
              className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
            >
              {renderSelectOptions(parentResourceIds)}
            </select>

            <select
              onChange={el => setCommit(el.target.value)}
              value={commit}
              className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
            >
              {renderSelectOptions(commits)}
            </select>
          </div>
          <div className="w-full flex gap-2">
            <div> Start Time:</div>
            <input type="datetime-local" value={start} onChange={el => setStart(el.target.value)} />
          </div>
          <div className="w-full flex gap-2">
            <div>End Time:</div>
            <input type="datetime-local" value={end} onChange={el => setEnd(el.target.value)} />
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

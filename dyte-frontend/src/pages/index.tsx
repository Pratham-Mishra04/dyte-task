import Head from 'next/head';
import Header from '@/components/header';
import Loader from '@/components/loader';
import SearchBar from '@/components/searchbar';
import LogCard from '@/components/log_card';
import getHandler from '@/handlers/get_handler';
import { Log } from '@/types';
import Toaster from '@/utils/toaster';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SlidersHorizontal } from '@phosphor-icons/react';
import Filters from '@/components/filters';
import { useRouter } from 'next/router';
import moment from 'moment';
import Protect from '@/utils/protect';

const buildURL = (baseUrl: string, params: object) => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== '')
    .map(([key, value]) => {
      if (key == 'start' || key == 'end') {
        const formattedTime = moment(value).format('YYYY-MM-DDTHH:mm:ss[Z]');
        return `${key}=${formattedTime}`;
      }
      return `${key}=${value}`;
    })
    .join('&');

  return queryString ? `${baseUrl}&${queryString}` : baseUrl;
};

const Home = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [clickedOnFilters, setClickedOnFilters] = useState(false);

  const router = useRouter();

  const [search, setSearch] = useState('');

  const fetchLogs = async (pageIndex: number) => {
    const URL = buildURL(`${process.env.NEXT_PUBLIC_BACKEND_URL}?page=${pageIndex}&limit=${10}`, router.query);
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      if (pageIndex == 1) {
        const logsData: Log[] = res.data.logs || [];
        setLogs(logsData);
        if (logsData.length == 0) setHasMore(false);
        setPage(2);
      } else {
        const addedLogs = [...logs, ...(res.data.logs || [])];
        if (addedLogs.length === logs.length) setHasMore(false);
        setLogs(addedLogs);
        setPage(prev => prev + 1);
      }
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error('Internal Server Error', 'error_toaster');
    }
  };

  useEffect(() => {
    const { message } = router.query;
    if (message) setSearch(message as string);

    setHasMore(true);
    fetchLogs(1);
  }, [router.query]);

  return (
    <>
      {clickedOnFilters ? <Filters setShow={setClickedOnFilters} /> : <></>}
      <Head>
        <title>Logs | Dyte</title>
      </Head>
      <Header />
      <div className="w-full flex justify-center items-center gap-6 py-4">
        <SearchBar search={search} setSearch={setSearch} />
        <SlidersHorizontal
          onClick={() => setClickedOnFilters(true)}
          className="cursor-pointer hover:bg-gray-100 rounded-full p-2 flex-center transition-ease-300"
          size={42}
          weight="duotone"
        />
      </div>
      <div className="w-[95%] h-16 mx-auto border-b-[1px] border-gray-400 flex text-base font-semibold text-gray-500">
        <div className="w-1/12 flex-center">Time</div>
        <div className="w-1/12 flex-center">Date</div>
        <div className="w-4/12 flex-center">Message</div>
        <div className="w-1/12 flex-center">Level</div>
        <div className="w-1/12 flex-center">Resource ID</div>
        <div className="w-1/12 flex-center">Trace ID</div>
        <div className="w-1/12 flex-center">Span ID</div>
        <div className="w-1/12 flex-center">Commit</div>
        <div className="w-1/12 flex-center">Parent Res. ID</div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <InfiniteScroll
          className="w-full max-md:w-full max-md:px-4 mx-auto flex flex-col items-center gap-2"
          dataLength={logs.length}
          next={() => fetchLogs(page)}
          hasMore={hasMore}
          loader={<Loader />}
        >
          {logs.map(log => {
            return <LogCard key={log.id} log={log} />;
          })}
        </InfiniteScroll>
      )}
    </>
  );
};

export default Protect(Home);

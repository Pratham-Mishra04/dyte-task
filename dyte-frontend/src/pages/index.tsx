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

const buildURL = (baseUrl: string, params: object) => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== '')
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return queryString ? `${baseUrl}&${queryString}` : baseUrl;
};

export default function Home() {
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
        setLogs(res.data.logs || []);
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
          className="cursor-pointer"
          size={32}
          weight="duotone"
        />
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
}

import Head from 'next/head';
import Header from '@/components/header';
import Loader from '@/components/loader';
import SearchBar from '@/components/searchbar';
import TaskCard from '@/components/task_card';
import getHandler from '@/handlers/get_handler';
import { Task } from '@/types';
import Toaster from '@/utils/toaster';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SlidersHorizontal } from '@phosphor-icons/react';
import Filters from '@/components/filters';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [clickedOnFilters, setClickedOnFilters] = useState(false);

  const fetchTasks = async () => {
    const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}?page=${page}&limit=${10}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      const addedTasks = [...tasks, ...(res.data.tasks || [])];
      if (addedTasks.length === tasks.length) setHasMore(false);
      setTasks(addedTasks);
      setPage(prev => prev + 1);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error('Internal Server Error', 'error_toaster');
    }
  };
  return (
    <>
      {clickedOnFilters ? <Filters setShow={setClickedOnFilters} /> : <></>}
      <Head>
        <title>Logs | Dyte</title>
      </Head>
      <Header />
      <div className="w-full flex justify-center items-center gap-6 py-4">
        <SearchBar />
        <SlidersHorizontal
          onClick={() => setClickedOnFilters(true)}
          className="cursor-pointer"
          size={32}
          weight="duotone"
        />
      </div>
      {loading ? (
        <></>
      ) : (
        <InfiniteScroll
          className="w-full max-md:w-full max-md:px-4 mx-auto flex flex-col items-center gap-2"
          dataLength={tasks.length}
          next={fetchTasks}
          hasMore={hasMore}
          loader={<Loader />}
        >
          {tasks.map(task => {
            return <TaskCard key={task.id} task={task} />;
          })}
        </InfiniteScroll>
      )}
    </>
  );
}

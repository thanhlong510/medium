import Head from "next/head";
import { api } from "~/utils/api";
import React, { useEffect, useRef } from "react";
import PostCard from "./components/PostCard";
import Link from "next/link";
import { error } from "console";
import { useSession } from "next-auth/react";
const interestsOptions = [
  "Programming",
  "Technology",
  "Writing",
  "Relationships",
  "Productivity",
  "Politics",
  "Sports",
];
export default function Home() {
  const { data, refetch } = api.post.getPosts.useQuery();
  const { data: session } = useSession();
  const b = api.profile.initialCreateBio.useMutation();
  const isFirstRun = useRef(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error when refetching data:", error);
      }
    };

    fetchData().catch((error) => {
      console.error("Error when refetching data:", error);
    });
  }, [data]);

  useEffect(() => {
    if (isFirstRun.current) {
      // Thực hiện lệnh chỉ một lần khi component được mount
      if (session?.user.id) {
        b.mutate({
          bio: "This is a new welcomer",
          userId: session.user.id,
        });
      }

      // Đánh dấu là đã chạy một lần
      isFirstRun.current = false;
    }
  });
  if (!data) return;
  return (
    <>
      <div className="mx-auto w-screen ">
        <Head>
          <title>Create T3 App</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <>
          <div className="w-full bg-yellow-400 py-9 font-sans">
            <div className="m-auto  max-w-7xl">
              <div className="flex  items-center lg:py-0">
                <div className="mx-4 space-y-5 py-10">
                  <h1 className="max-w-xl font-serif text-6xl">
                    <span className="underline  decoration-black decoration-4">
                      Medium
                    </span>{" "}
                    is a place to write, read and connect
                  </h1>
                  <h2>
                    Its easy and free to post your thinking on any topic and
                    connect with millions of readers.
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto  grid max-w-6xl  pt-10 sm:grid-cols-1 md:grid-cols-1  lg:grid-cols-11">
            <div className="mx-auto sm:col-span-1 md:col-span-1   lg:col-span-7  ">
              <div className="flex flex-col gap-3 p-2 ">
                <div className="max-w-[40rem]">
                  <PostCard post={data} />
                </div>
              </div>
            </div>
            <div className="mt-3 hidden lg:col-span-4  lg:col-start-8 lg:block">
              <p className="mb-5 font-serif text-base font-semibold text-[#242424]">
                Discover more of what matters to you
              </p>

              <div className="flex flex-wrap gap-2">
                {interestsOptions.map((a) => {
                  return (
                    <Link
                      key={Math.random().toString(36).substring(7)}
                      href={`/discovery/${a.toLowerCase()}`}
                    >
                      <button className="flex items-center rounded-3xl border  border-solid bg-[#F2F2F2] p-[10px] text-sm font-normal ">
                        {a}
                      </button>
                    </Link>
                  );
                })}
              </div>
              <p className="mt-4 cursor-pointer text-xl text-[#1A8917] hover:text-lime-500">
                See more topics
              </p>
            </div>
          </div>
        </>
      </div>
    </>
  );
}

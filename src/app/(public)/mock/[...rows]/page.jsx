"use client";

import { useEffect, useState } from "react";
import Spacing from "@/app/ui/Spacing";
import { toast } from "react-toastify";
import WebcamVideo from "@/app/ui/WebcamVideo";
import MockHeading from "@/app/ui/WebcamVideo/MockHeading";
import useSupabase from "@/hooks/SupabaseContext";
import Question from "@/app/ui/Question";
import { useAtom } from "jotai";
import { mockquestionnum, mockquestions } from "@/store";
import Loading from "@/app/ui/loading";
import SupabaseRepo from "@/app/_services/supabase-repo";
import { useRouter } from "next/navigation";

export default function Page({ params: { rows } }) {
  const supabase = useSupabase();
  const supabaseapi = SupabaseRepo();
  const [start, setStart] = useState(false);
  const [, setQuestions] = useAtom(mockquestions);
  const [, setQuestionnum] = useAtom(mockquestionnum);

  const [isCamera, setIsCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const onStart = () => {
    if (!isCamera)
      return toast.warning("No find device !", {
        theme: "dark",
      });

    setStart(true);
    setQuestionnum(0);
  };

  const getQuestionData = async () => {
    if (!supabase) return;
    const getallowjob = await supabaseapi.getuserallowjob();
    if (getallowjob < 2 && rows[1] > 1) {
      router.push("/#price");
      return;
    }
    const { data, error } = await supabase
      .from("questiontable")
      .select(`id,question,questionnum`)
      .eq("jobId", rows[0])
      .order("questionnum", { ascending: true });

    if (error) {
      console.log(error.message);
      return;
    }
    setQuestions(data.slice((rows[1] - 1) * 5, rows[1] * 5));
  };

  useEffect(() => {
    getQuestionData();
  }, [supabase]);
  return (
    <div>
      {isLoading && <Loading />}
      <Spacing lg="145" md="80" />
      <section>
        <div className="container">
          <div className="row align-items-center ">
            {start ? <Question /> : <MockHeading btnClick={onStart} />}
            <WebcamVideo
              setLoading={setIsLoading}
              setCamera={setIsCamera}
              start={start}
              jobId={rows[0]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

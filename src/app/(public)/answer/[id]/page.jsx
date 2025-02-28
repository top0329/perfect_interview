"use client";

import Div from "@/app/ui/Div";
import Spacing from "@/app/ui/Spacing";
import Link from "next/link";
import useSupabase from "@/hooks/SupabaseContext";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Markdown from "react-markdown";
import { toast } from "react-toastify";
import Loading from "@/app/ui/loading";
import { createThread, sendMessage } from "@/app/_services/openai-repo";

export default function Answer({ params: { id } }) {
  const [jobId, setJobId] = useState("");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [weakness, setWeakness] = useState("");
  const [strength, setStrength] = useState("");
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = useSupabase();
  const { userId } = useAuth();

  const [threadId, setThreadId] = useState("No thread");
  const getAnswer = async (index) => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("questiontable")
      .select(`question,jobId,answertable(id,answer,weakness,strength,score)`)
      .eq("id", id)
      .order("created_at", {
        referencedTable: "answertable",
        ascending: false,
      });

    if (error) {
      console.log(error.message);
      return;
    }
    setQuestion(data[0].question);
    setAnswers(data[0].answertable);
    setAnswer(data[0].answertable[index]?.answer);
    setWeakness(data[0].answertable[index]?.weakness);
    setStrength(data[0].answertable[index]?.strength);
    setScore(data[0].answertable[index]?.score);
  };

  useEffect(() => {
    getAnswer(0);
  }, [supabase]);

  useEffect(() => {
    async function fetchThread() {
      const data = await createThread();
      if (data.threadId) {
        setThreadId(data.threadId);
      }
    }
    fetchThread();
  }, []);

  const onSave = async (isNext) => {
    if (!answer || !weakness || !strength)
      return toast.warning("The value to be saved is incorrect.", {
        theme: "dark",
      });
    setIsLoading(true);
    const ischeck = await isExist();

    if (!ischeck) {
      setIsLoading(false);
      return toast.warning("The value to be saved already exists.", {
        theme: "dark",
      });
    }
    const { data, error } = await supabase
      .from("answertable")
      .upsert({
        answer: answer,
        weakness: weakness,
        strength: strength,
        score: score,
        questionid: id,
        clerk_user_id: userId,
      })
      .select(`id,answer,weakness,strength,score`);
    if (error) {
      setIsLoading(false);
      console.log(error.message);
      return;
    }
    isne;
    setIsLoading(false);
    toast.success("Saved successfully!", {
      className: "black-background",
      bodyClassName: "grow-font-size",
      progressClassName: "fancy-progress-bar",
    });
  };
  const isExist = async () => {
    if (!supabase) return false;
    const { data, error } = await supabase
      .from("answertable")
      .select()
      .eq("answer", answer)
      .eq("questionid", id);

    if (error) {
      console.log(error.message);
      return false;
    }
    if (data.length) {
      console.log("Answer exist already.");
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (!input.trim()) {
      return toast.warning("Answer is required.", {
        theme: "dark",
      });
    }
    setIsLoading(true);
    const text = `I would like to rate my answer to the question. Answer format:
Weaknesses: [Your weaknesses here, less than 10 sentences.]
Strengths: [Your strengths here, less than 10 sentences.]
Score: [Your score here, as a number from 0 to 10.]
My question and answer are as follows:
Question: ${question}
Answer: ${input.trim()}
Do not write any explanations or other words, just reply with the answer format.`;
    console.log("text:", text);
    let data = await sendMessage(text, threadId);
    setIsLoading(false);
    if (data.error) {
      toast.error(data.error, {
        theme: "dark",
      });
      return;
    }
    console.log("data:", data);
    const weaknessesMatch = data.msg.match(/Weaknesses: (.*?)(?=\n)/);
    const strengthsMatch = data.msg.match(/Strengths: (.*?)(?=\n)/);
    const scoreMatch = data.msg.match(/Score: (\d+)/);

    setAnswer(input.trim());
    setStrength(strengthsMatch ? strengthsMatch[1].trim() : "");
    setWeakness(weaknessesMatch ? weaknessesMatch[1].trim() : "");
    setScore(scoreMatch ? parseInt(scoreMatch[1]) : null);
    setInput("");
  };
  return (
    <>
      {(isLoading || !question) && <Loading />}
      <Spacing lg="145" md="80" />
      <Div className="container">
        <Spacing lg="50" md="35" />
        <Link href={`/question/${jobId}`} className="cs-text_btn">
          <span className="cs-font_38">Question</span>
        </Link>
        <Spacing lg="20" md="10" />
        <div className="cs-m0">{question}</div>
        <br />
        <hr />
        <br />
        {answers?.map((item, index) => (
          <div key={index}>
            <div className="cs-m0 line-clamp" onClick={() => getAnswer(index)}>
              {item.answer}
            </div>
            <hr />
          </div>
        ))}

        <Div className="col-sm-12">
          <label className="cs-primary_color">Answer</label>
          <textarea
            cols="30"
            rows="7"
            className="cs-form_field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Spacing lg="25" md="25" />
        </Div>

        <Div className="d-flex justify-content-end">
          <button className="cs-btn cs-style1" onClick={onSubmit}>
            <span>Submit</span>
          </button>
        </Div>

        <Spacing lg="25" md="25" />
        <Div className="row">
          <Div className="col-sm-12">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="cs-font_30 ">Interview</h2>

              <Div className="cs-rating">
                <Div
                  className="cs-rating_bg"
                  style={{ backgroundImage: "url(/images/rating.svg)" }}
                />
                <Div
                  className="cs-rating_percentage"
                  style={{
                    backgroundImage: "url(/images/rating.svg)",
                    width: `${score * 10}%`,
                  }}
                />
              </Div>
            </div>
            <div className="cs-m0" style={{ whiteSpace: "pre-wrap" }}>
              {answer}
            </div>
          </Div>
          <Spacing lg="25" md="25" />
          <Div className="col-sm-6">
            <h2 className="cs-font_30 ">Strength</h2>
            <div className="cs-m0">
              <Markdown>{strength}</Markdown>
            </div>

            <Spacing lg="25" md="25" />
          </Div>
          <Div className="col-sm-6">
            <h2 className="cs-font_30 ">Weakness</h2>
            <div className="cs-m0">
              <Markdown>{weakness}</Markdown>
            </div>
            <Spacing lg="25" md="25" />
          </Div>

          <Div className="d-flex justify-content-between">
            <button className="cs-btn cs-style1 cs-type1" onClick={onSave}>
              <span>Prev</span>
            </button>
            <button className="cs-btn cs-style1 cs-type1" onClick={onSave}>
              <span>Next</span>
            </button>
          </Div>
        </Div>
        <Spacing lg="125" md="55" />
      </Div>
    </>
  );
}

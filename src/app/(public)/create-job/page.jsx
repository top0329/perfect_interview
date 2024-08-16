"use client";

import ProgressBar from "@/app/ui/ProgressBar";
import Spacing from "@/app/ui/Spacing";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/api";
import { toast } from "react-toastify";
import Loading from "@/app/ui/loading";

const report = [
  {
    title: "Tell us about the job you're interviewing for",
    subtitle:
      "We use this information to generate custom practice interview questions for the job that you are applying to.",
  },
  {
    title: "Tell us about the company you're interviewing with",
    subtitle:
      "Extra details about the company can help us to generate more relevant questions. Not requied, but certainly helpful. question",
  },
  {
    title: "Upload your CV/Resume.",
    subtitle:
      "These documents can help us generate more relevant questions for your interview and we can also provide help you craft interview question answers based off of your work experience. The more information you upload, the better our tool works! Acceptable file formats are CV and pdf.",
  },
  {
    title: "Summary",
    subtitle: "",
  },
];
export default function CreateJob() {
  const api = useApi();
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState("No file chosen");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [threadId, setThreadId] = useState("");

  const router = useRouter();
  const onBack = () => {
    step ? setStep(step - 1) : router.push("/job");
  };
  const onNext = () => {
    if (!step && !jobTitle.trim())
      return toast.warning("Title is required.", {
        className: "black-background",
        bodyClassName: "grow-font-size",
        progressClassName: "fancy-progress-bar",
      });
    if (!step && !jobDescription.trim())
      return toast.warning("Description is required.", {
        className: "black-background",
        bodyClassName: "grow-font-size",
        progressClassName: "fancy-progress-bar",
      });
    if (step < 2) setStep(step + 1);
    else {
      if (fileName == "No file chosen")
        return toast.warning("Upload file is required.", {
          className: "black-background",
          bodyClassName: "grow-font-size",
          progressClassName: "fancy-progress-bar",
        });
      sendMessage(`I want 20 questions for ${jobTitle} job interview.
Answer format:
Number. Sentence.
Do not write any explanations or other words, just reply with the answer format.
`);
    }
  };

  useEffect(() => {
    const createThread = async () => {
      const res = await fetch(`/api/assistants/threads`, {
        method: "POST",
      });
      const data = await res.json();
      setThreadId(data.threadId);
    };
    createThread();
  }, []);

  const sendMessage = async (text) => {
    setIsLoading(true);
    let data = await fetch(`/api/assistants/threads/${threadId}/messages`, {
      method: "POST",
      body: JSON.stringify({
        content: text,
      }),
    });
    let data1 = await data.json();
    data = data1.msg.split("\n");
    console.log("response:", data1.msg);
    await api.test({
      title: jobTitle,
      description: jobDescription,
      company: companyName,
      companyDescription: companyDescription,
      fileName: fileName,
      question: data,
    });

    setIsLoading(false);
    toast.success("Created job successfully!", {
      className: "black-background",
      bodyClassName: "grow-font-size",
      progressClassName: "fancy-progress-bar",
    });
  };

  const handleFileUpload = async (event) => {
    const data = new FormData();
    console.log("Init data:", data);
    if (event.target.files.length < 0) return;
    data.append("file", event.target.files[0]);
    console.log("Append data:", data);
    setFileName(event.target?.files[0].name);
    await fetch("/api/assistants/files", {
      method: "POST",
      body: data,
    });
  };
  return (
    <>
      {isLoading && <Loading />}
      <Spacing lg="145" md="80" />
      <div className="container">
        <div className="row">
          <ProgressBar step={step} />
          <Spacing lg="50" md="35" />
          <div>
            <h2 className="cs-font_30">{report[step].title}</h2>
            <p>{report[step].subtitle}</p>
          </div>
          {step == 0 && (
            <section>
              <div className="col-sm-12">
                <label className="cs-primary_color">Title</label>
                <input
                  type="text"
                  className="cs-form_field"
                  defaultValue={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
                <Spacing lg="20" md="20" />
              </div>
              <div className="col-sm-12">
                <label className="cs-primary_color">Description</label>
                <textarea
                  cols="30"
                  rows="7"
                  className="cs-form_field"
                  defaultValue={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
                <Spacing lg="25" md="25" />
              </div>
            </section>
          )}
          {step == 1 && (
            <section>
              <div className="col-sm-12">
                <label className="cs-primary_color">
                  Company name (Optional)
                </label>
                <input
                  type="text"
                  className="cs-form_field"
                  defaultValue={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <Spacing lg="20" md="20" />
              </div>
              <div className="col-sm-12">
                <label className="cs-primary_color">
                  Company Description (Optional)
                </label>
                <textarea
                  cols="30"
                  rows="7"
                  className="cs-form_field"
                  defaultValue={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                ></textarea>
                <Spacing lg="25" md="25" />
              </div>
            </section>
          )}
          {step == 2 && (
            <section>
              <div className="col-sm-12">
                <label className="cs-btn cs-style1" htmlFor="choose">
                  Upload File
                </label>
                <input
                  type="file"
                  hidden
                  id="choose"
                  accept=".pdf, .doc, .docx, .md, .txt"
                  onChange={handleFileUpload}
                />
                <div style={{ textIndent: "12px" }}>{fileName}</div>
                <Spacing lg="25" md="25" />
              </div>
            </section>
          )}
          <div className="d-flex justify-content-between cs-font_22">
            <div className="cs-btn cs-style1" onClick={onBack}>
              Back
            </div>
            <div className="cs-btn cs-style1" onClick={onNext}>
              Next
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

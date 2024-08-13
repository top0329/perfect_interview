import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";


export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(request, { params: { threadId } }) {
  const { content } = await request.json();
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });


  let run = await openai.beta.threads.runs.createAndPoll(
    threadId,
    {
      assistant_id: assistantId,
      instructions: "Please address the user as Jane Doe. The user has a premium account."
    }
  );
  if (run.status === 'completed') {
    const messages = await openai.beta.threads.messages.list(
      run.thread_id
    );
    let data = messages.data[0].content[0].text.value;
    console.log(data);
    const data_array = data.split("\n");
    console.log(data_array);
   

    return Response.json({ msg: data_array});
  } else {
    console.log(run.status);
    return Response.json({ msg: "fail" });
  }


}
import { Markdown } from "../Markdown";
import { Frame } from "./Callout";
import { ThinkCommit } from "../Confidence";
import { QuestionFlag, useQuestionGuide } from "../LessonGuide";

export function Think({ body }: { body: string }) {
  const [question, ...rest] = body.split(/^\s*---\s*$/m);
  const answer = rest.join("\n");
  const fit = useQuestionGuide(body);
  const off = !!fit && fit.fit !== "taught";
  return (
    <Frame kind="think" label="עצרו וחשבו" icon="think">
      {off && <QuestionFlag q={fit!} />}
      <Markdown text={question.trim()} />
      {answer.trim() && <ThinkCommit question={question.trim()} answer={answer.trim()} off={off} />}
    </Frame>
  );
}

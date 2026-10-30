import { Markdown } from "../Markdown";
import { Frame } from "./Callout";
import { ThinkCommit } from "../Confidence";

export function Think({ body }: { body: string }) {
  const [question, ...rest] = body.split(/^\s*---\s*$/m);
  const answer = rest.join("\n");
  return (
    <Frame kind="think" label="עצרו וחשבו" icon="think">
      <Markdown text={question.trim()} />
      {answer.trim() && <ThinkCommit question={question.trim()} answer={answer.trim()} />}
    </Frame>
  );
}

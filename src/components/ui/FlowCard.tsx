import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flow } from "../../types";
import { Trash2 } from "lucide-react";
interface FlowCardProps {
  flow: Flow;
  onRunFlow: (flowId: string) => void;
  onDeleteFlow: (flowId: string) => void;
}

export const FlowCard: React.FC<FlowCardProps> = ({
  flow,
  onRunFlow,
  onDeleteFlow,
}) => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-2">{flow.flow_name}</h3>
            <p className="text-sm text-gray-500 mb-2">
              Created: {new Date(flow.created_at).toLocaleDateString()}
            </p>
            <div className="text-sm">
              <p className="truncate">
                Video Sheet URL:{" "}
                <a
                  className="font-light"
                  target="_blank"
                  href={flow.video_sheet_url}
                >
                  {flow.video_sheet_url.slice(0, 20)}...{" "}
                </a>
              </p>
              <p className="truncate">
                Questions Doc URL:{" "}
                <a className="font-light" href={flow.question_doc_url}>
                  {flow.question_doc_url.slice(0, 20)}...{" "}
                </a>
              </p>
              <p className="truncate">
                Output Doc URL:{" "}
                <a className="font-light" href={flow.output_doc_url}>
                  {flow.output_doc_url.slice(0, 20)}...{" "}
                </a>
              </p>
              <p className="overflow-hidden">LLM Prompt: {flow.llm_prompt}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteFlow(flow.flow_id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onRunFlow(flow.flow_id)} className="w-full">
          Run Flow
        </Button>
      </CardFooter>
    </Card>
  );
};

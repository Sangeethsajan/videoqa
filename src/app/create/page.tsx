// app/create/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputBox } from "@/components/ui/InputBox";
import { Loader2 } from "lucide-react";

import { useUserId } from "@/hooks/useUserId";
import makeAPIRequest from "@/services/apiservices";
interface FlowInputs {
  name: string;
  videoSheetUrl: string;
  questionDocUrl: string;
  llmPrompt: string;
  outputDocUrl: string;
}

export default function CreateFlow() {
  const router = useRouter();
  const userId = useUserId();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState<FlowInputs>({
    name: "",
    videoSheetUrl: "",
    questionDocUrl: "",
    llmPrompt: "",
    outputDocUrl: "",
  });

  const handleCreate = async () => {
    if (!inputs.name.trim()) {
      // Add your preferred error handling here
      alert("Please enter a flow name");
      return;
    }
    if (!userId) {
      alert("User ID not available");
      return;
    }
    const fromData = new FormData();
    fromData.append("flow_name", inputs.name);
    fromData.append("video_sheet_url", inputs.videoSheetUrl);
    fromData.append("question_doc_url", inputs.questionDocUrl);
    fromData.append("llm_prompt", inputs.llmPrompt);
    fromData.append("output_doc_url", inputs.outputDocUrl);
    fromData.append("user_id", userId);

    setIsLoading(true);

    try {
      const response = await makeAPIRequest(
        "videoqa/create-flow/",
        "POST",
        fromData
      );
      if (response.status === "success") {
        router.push("/");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Error creating flow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="mb-6"
          >
            ← Go Back
          </Button>
          <h1 className="text-3xl font-bold">Create New Flow</h1>
        </div>

        <div className="space-y-6">
          {/* Flow Name Card */}
          <Card>
            <CardContent className="p-6">
              <InputBox
                label="Flow Name"
                value={inputs.name}
                onChange={(value) => setInputs({ ...inputs, name: value })}
                placeholder="Enter a name for your flow"
              />
            </CardContent>
          </Card>

          {/* Video and Questions Links Card */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <InputBox
                  label="Video Sheet Link"
                  value={inputs.videoSheetUrl}
                  onChange={(value) =>
                    setInputs({ ...inputs, videoSheetUrl: value })
                  }
                  placeholder="Enter Google Sheet URL with video links"
                />
                <InputBox
                  label="Questions Document Link"
                  value={inputs.questionDocUrl}
                  onChange={(value) =>
                    setInputs({ ...inputs, questionDocUrl: value })
                  }
                  placeholder="Enter Google Doc URL with questions"
                />
              </div>
            </CardContent>
          </Card>

          {/* LLM Prompt Card */}
          <Card>
            <CardContent className="p-6">
              <InputBox
                label="LLM Guidance (Optional)"
                value={inputs.llmPrompt}
                onChange={(value) => setInputs({ ...inputs, llmPrompt: value })}
                placeholder="Enter any specific instructions for the AI"
              />
            </CardContent>
          </Card>

          {/* Output Document Card */}
          <Card>
            <CardContent className="p-6">
              <InputBox
                label="Output Document Link"
                value={inputs.outputDocUrl}
                onChange={(value) =>
                  setInputs({ ...inputs, outputDocUrl: value })
                }
                placeholder="Enter destination Google Doc URL"
              />
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={handleCreate}
              disabled={isLoading}
              className="w-48"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating
                </>
              ) : (
                "Create Flow"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

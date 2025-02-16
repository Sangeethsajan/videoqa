"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Jumbotron } from "@/components/ui/Jumbotron";
import { FlowCard } from "@/components/ui/FlowCard";
import { Flow } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import makeAPIRequest from "@/services/apiservices";

export default function Home() {
  const router = useRouter();
  const [flows, setFlows] = useState<Flow[]>([]);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Fetch flows from backend
    fetchFlows();
  }, []);

  const fetchFlows = async () => {
    try {
      const userId = localStorage.getItem("video_userId");
      if (!userId) return;
      const formData = new FormData();
      formData.append("user_id", userId);
      /*
      const response = await fetch("http://localhost:8000/videoqa/get-flows/", {
        body: formData,
        method: "POST",
      });
      */
      const data = await makeAPIRequest("videoqa/get-flows/", "POST", formData);
      setFlows(data);
    } catch (error) {
      console.error("Error fetching flows:", error);
    }
  };

  const handleRunFlow = (flowId: string) => {
    setSelectedFlowId(flowId);
    setShowConfirmDialog(true);
  };
  const handleDelete = (flowId: string) => {
    setShowDeleteDialog(true);
    setSelectedFlowId(flowId);
  };

  const handleConfirmDelete = async () => {
    if (!selectedFlowId) return;

    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("flow_id", selectedFlowId);
      await makeAPIRequest("videoqa/delete-flow/", "POST", formData);
      // Handle success
      setFlows((prevFlows) =>
        prevFlows.filter((flow) => flow.flow_id !== selectedFlowId)
      );
    } catch (error) {
      console.error("Error deleting flow:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleConfirmRun = async () => {
    if (!selectedFlowId) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("flow_id", selectedFlowId);
      setTimeout(() => {
        toast.success("Flow Started", {
          description:
            "We initiated the flow for you. We will let you know when the flow is completed.",
        });
      }, 0);
      await makeAPIRequest("videoqa/run-flow/", "POST", formData);

      // First close the dialog and reset loading
      setIsLoading(false);
      setShowConfirmDialog(false);

      // Then show the toast
      setTimeout(() => {
        toast.success("Flow Completed", {
          description:
            "You can check the results in the output document provided.",
        });
      }, 0);
    } catch (error) {
      console.error("Error running flow:", error);
      setIsLoading(false);
      setShowConfirmDialog(false);

      setTimeout(() => {
        toast.error("Error", {
          description: "Failed to start the flow. Please try again.",
        });
      }, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Jumbotron />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium">Your Flows</h2>
          <Button onClick={() => router.push("/create")}>
            Create New Flow
          </Button>
        </div>

        {flows.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">
              No flows found. Create your first flow to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flows.map((flow) => (
              <FlowCard
                key={flow.flow_id}
                flow={flow}
                onRunFlow={handleRunFlow}
                onDeleteFlow={handleDelete}
              />
            ))}
            <Toaster richColors />
          </div>
        )}
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Run this flow?</AlertDialogTitle>
            <AlertDialogDescription>
              This will process the videos and generate answers based on your
              configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRun} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the flow. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

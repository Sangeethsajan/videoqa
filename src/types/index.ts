export interface Flow {
    flow_id: string;
    flow_name: string;
    video_sheet_url: string;
    question_doc_url: string;
    llm_prompt?: string;
    output_doc_url: string;
    created_at: string;
  }
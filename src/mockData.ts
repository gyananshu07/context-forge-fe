import type { DocumentItem } from "./components/DocumentSidebar";
import type { Message, Citation } from "./components/ChatArea";

export const INITIAL_DOCS: DocumentItem[] = [
  {
    id: "doc-1",
    name: "Attention_Is_All_You_Need.pdf",
    size: 2.1 * 1024 * 1024,
    status: "ready",
  },
  {
    id: "doc-2",
    name: "GPT-4_Technical_Report.pdf",
    size: 4.5 * 1024 * 1024,
    status: "ready",
  },
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  "doc-1": [
    {
      id: "m1",
      role: "assistant",
      content:
        'Hello! I have analyzed "Attention Is All You Need". Ask me any questions about the Transformer architecture, multi-head attention, or self-attention mechanisms.',
    },
  ],
  "doc-2": [
    {
      id: "m2",
      role: "assistant",
      content:
        "Hello! I have parsed the GPT-4 Technical Report. Feel free to ask about performance metrics, capabilities, training methodology, or limitations.",
    },
  ],
};

export const MOCK_CITATIONS: Record<string, Citation[]> = {
  Transformer: [
    {
      id: "1",
      source: "Attention_Is_All_You_Need.pdf",
      page: 3,
      text: "The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for as little as twelve hours on eight GPUs.",
    },
  ],
  Performance: [
    {
      id: "1",
      source: "GPT-4_Technical_Report.pdf",
      page: 1,
      text: "GPT-4 is a large multimodal model capable of processing image and text inputs and emitting text outputs. It exhibits human-level performance on various professional and academic benchmarks.",
    },
  ],
};

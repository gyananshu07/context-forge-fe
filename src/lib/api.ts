import type { DocumentItem } from '@/components/DocumentSidebar';
import type { Message, Citation } from '@/components/ChatArea';

const API_BASE_URL = 'http://localhost:8000/api';

// Simple check to see if backend is running
export async function checkBackendConnection(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(1000) });
    return res.ok;
  } catch {
    return false;
  }
}

// In-memory / sessionStorage state for Mock Mode
const MOCK_DOCUMENTS_KEY = 'doc_intel_mock_docs';
const MOCK_CHATS_KEY = 'doc_intel_mock_chats';

const DEFAULT_MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'attention-is-all-you-need',
    name: 'Attention_Is_All_You_Need.pdf',
    size: 2.1 * 1024 * 1024,
    status: 'ready',
  },
  {
    id: 'climate-change-report',
    name: 'Climate_Change_Report_2026.pdf',
    size: 4.5 * 1024 * 1024,
    status: 'ready',
  }
];

const DEFAULT_MOCK_CHATS: Record<string, Message[]> = {
  'attention-is-all-you-need': [
    {
      id: 'm1',
      role: 'assistant',
      content: 'Hello! I have fully indexed the "Attention Is All You Need" paper. Ask me anything about self-attention, the Transformer architecture, or its training results.',
    }
  ],
  'climate-change-report': [
    {
      id: 'm2',
      role: 'assistant',
      content: 'Welcome! I have processed the 2026 Climate Change Report. I can help you extract data on temperature anomalies, carbon emission budgets, or renewable energy targets.',
    }
  ]
};

// Simulated QA databases for Mock Mode
const ATTENTION_QA = [
  {
    keywords: ['transformer', 'architecture', 'what is'],
    answer: 'The Transformer is a novel model architecture that relies entirely on self-attention mechanisms to compute representations of its input and output without using sequence-aligned RNNs or convolution [1]. It allows for significantly more parallelization and achieves state-of-the-art results [2].',
    citations: [
      {
        id: '1',
        source: 'Attention_Is_All_You_Need.pdf',
        text: 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
        page: 1,
      },
      {
        id: '2',
        source: 'Attention_Is_All_You_Need.pdf',
        text: 'The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for only twelve hours on eight GPUs.',
        page: 1,
      }
    ]
  },
  {
    keywords: ['multi-head', 'attention', 'head'],
    answer: 'Multi-head attention projects the queries, keys, and values linearly h times with different, learned linear projections. On each of these projected versions, we perform attention in parallel, yielding dv-dimensional output values. These are concatenated and once again projected [1]. This allows the model to jointly attend to information from different representation subspaces at different positions [2].',
    citations: [
      {
        id: '1',
        source: 'Attention_Is_All_You_Need.pdf',
        text: 'Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions.',
        page: 5,
      },
      {
        id: '2',
        source: 'Attention_Is_All_You_Need.pdf',
        text: 'In this work we employ 8 parallel attention layers, or heads. For each of these we use dk = dv = dmodel/h = 64.',
        page: 5,
      }
    ]
  },
  {
    keywords: ['why better', 'rnn', 'sequential', 'parallelize'],
    answer: 'Transformers avoid sequential processing, enabling much faster training times through parallelization [1]. This allows them to scale to much larger datasets and achieve superior quality compared to recurrent neural networks [2]. Additionally, the path length between long-range dependencies is reduced to O(1), improving retention of context.',
    citations: [
      {
        id: '1',
        source: 'Attention_Is_All_You_Need.pdf',
        text: 'Self-attention layers connect all positions with a constant number of sequentially executed operations, whereas a recurrent layer requires O(n) sequential operations.',
        page: 6,
      },
      {
        id: '2',
        source: 'Attention_Is_All_You_Need.pdf',
        text: 'To improve parallelization and computational efficiency, self-attention can process representations of all tokens concurrently.',
        page: 6,
      }
    ]
  }
];

const CLIMATE_QA = [
  {
    keywords: ['temperature', 'rise', 'warming', 'anomaly', 'degree'],
    answer: 'According to the report, global average temperatures have increased by approximately 1.15°C compared to pre-industrial baselines, driven primarily by anthropogenic greenhouse gas emissions [1]. Extreme weather events are increasing in frequency globally as a direct consequence [2].',
    citations: [
      {
        id: '1',
        source: 'Climate_Change_Report_2026.pdf',
        text: 'Global average temperatures have increased by 1.15°C compared to pre-industrial levels, driven primarily by anthropogenic greenhouse gas emissions.',
        page: 3,
      },
      {
        id: '2',
        source: 'Climate_Change_Report_2026.pdf',
        text: 'The frequency and intensity of extreme weather events, including unprecedented marine heatwaves and torrential precipitation, are strongly correlated with this 1.15°C rise.',
        page: 4,
      }
    ]
  },
  {
    keywords: ['renewable', 'target', 'mitigation', 'energy', 'percent'],
    answer: 'Mitigation strategies must scale up renewable energy generation by 300% by the year 2035 to keep warming below the 1.5°C threshold [1]. This requires structural changes in power grid infrastructure and phase-out of fossil-fuel subsidies [2].',
    citations: [
      {
        id: '1',
        source: 'Climate_Change_Report_2026.pdf',
        text: 'Mitigation strategies must scale up renewable energy generation by 300% by 2035 to keep warming below the 1.5°C threshold.',
        page: 12,
      },
      {
        id: '2',
        source: 'Climate_Change_Report_2026.pdf',
        text: 'Grid integration and battery storage expansion are pivotal precursors to phasing out baseline fossil power.',
        page: 13,
      }
    ]
  }
];

// Helper to load/save mock data from sessionStorage to persist during local interactions
function getMockDocs(): DocumentItem[] {
  const data = sessionStorage.getItem(MOCK_DOCUMENTS_KEY);
  if (!data) {
    sessionStorage.setItem(MOCK_DOCUMENTS_KEY, JSON.stringify(DEFAULT_MOCK_DOCUMENTS));
    return DEFAULT_MOCK_DOCUMENTS;
  }
  return JSON.parse(data);
}

function saveMockDocs(docs: DocumentItem[]) {
  sessionStorage.setItem(MOCK_DOCUMENTS_KEY, JSON.stringify(docs));
}

function getMockChats(): Record<string, Message[]> {
  const data = sessionStorage.getItem(MOCK_CHATS_KEY);
  if (!data) {
    sessionStorage.setItem(MOCK_CHATS_KEY, JSON.stringify(DEFAULT_MOCK_CHATS));
    return DEFAULT_MOCK_CHATS;
  }
  return JSON.parse(data);
}

function saveMockChats(chats: Record<string, Message[]>) {
  sessionStorage.setItem(MOCK_CHATS_KEY, JSON.stringify(chats));
}

// Global active mode state
let forceMockMode = false;

export function setForceMockMode(val: boolean) {
  forceMockMode = val;
}

// API Functions with automatic fallback
export async function getDocuments(): Promise<{ data: DocumentItem[]; isMock: boolean }> {
  if (forceMockMode) {
    return { data: getMockDocs(), isMock: true };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/documents`);
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    return { data, isMock: false };
  } catch {
    return { data: getMockDocs(), isMock: true };
  }
}

export async function uploadDocument(
  file: File,
  onProgress?: (status: string) => void
): Promise<{ data: DocumentItem; isMock: boolean }> {
  if (forceMockMode) {
    return uploadDocumentMock(file, onProgress);
  }
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    return { data, isMock: false };
  } catch {
    return uploadDocumentMock(file, onProgress);
  }
}

// Internal simulation for uploading in mock mode
async function uploadDocumentMock(
  file: File,
  onProgress?: (status: string) => void
): Promise<{ data: DocumentItem; isMock: boolean }> {
  const newDoc: DocumentItem = {
    id: `mock-${Date.now()}`,
    name: file.name,
    size: file.size,
    status: 'processing',
  };

  const docs = getMockDocs();
  saveMockDocs([...docs, newDoc]);

  // Simulate server-side processing pipeline stages
  const stages = [
    'Reading document pages...',
    'Extracting raw text layout...',
    'Splitting passages and chunking...',
    'Generating vector embeddings...',
    'Ingesting into research index...',
    'Completed! Ready for chat.'
  ];

  if (onProgress) {
    for (let i = 0; i < stages.length; i++) {
      onProgress(stages[i]);
      await new Promise((resolve) => setTimeout(resolve, i === stages.length - 1 ? 400 : 500));
    }
  }

  // Update status to ready
  const updatedDocs = getMockDocs().map((d) =>
    d.id === newDoc.id ? { ...d, status: 'ready' as const } : d
  );
  saveMockDocs(updatedDocs);

  // Set default initial chat message
  const chats = getMockChats();
  chats[newDoc.id] = [
    {
      id: `m-${Date.now()}`,
      role: 'assistant',
      content: `Hello! I have finished analyzing "${file.name}". You can now ask questions to retrieve information with precise page citations.`,
    },
  ];
  saveMockChats(chats);

  newDoc.status = 'ready';
  return { data: newDoc, isMock: true };
}

export async function deleteDocument(id: string): Promise<{ success: boolean; isMock: boolean }> {
  if (forceMockMode) {
    const docs = getMockDocs().filter((d) => d.id !== id);
    saveMockDocs(docs);
    const chats = getMockChats();
    delete chats[id];
    saveMockChats(chats);
    return { success: true, isMock: true };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('API failed');
    return { success: true, isMock: false };
  } catch {
    const docs = getMockDocs().filter((d) => d.id !== id);
    saveMockDocs(docs);
    const chats = getMockChats();
    delete chats[id];
    saveMockChats(chats);
    return { success: true, isMock: true };
  }
}

export async function sendChatMessage(
  docId: string,
  docName: string,
  message: string
): Promise<{ data: Message; isMock: boolean }> {
  if (forceMockMode) {
    return sendChatMessageMock(docId, docName, message);
  }
  try {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document_id: docId, message }),
    });
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    return { data, isMock: false };
  } catch {
    return sendChatMessageMock(docId, docName, message);
  }
}

// Generate intelligent responses with citations in mock mode
async function sendChatMessageMock(
  docId: string,
  docName: string,
  message: string
): Promise<{ data: Message; isMock: boolean }> {
  // Artificial delay to look like an AI model generating tokens
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerQuery = message.toLowerCase();
  let answer = '';
  let citations: Citation[] = [];

  // Match document type
  if (docId === 'attention-is-all-you-need' || docName.toLowerCase().includes('attention') || docName.toLowerCase().includes('transformer')) {
    const match = ATTENTION_QA.find((qa) =>
      qa.keywords.some((k) => lowerQuery.includes(k))
    );
    if (match) {
      answer = match.answer;
      citations = match.citations;
    } else {
      answer = `Based on my review of the Transformer paper "${docName}", I found references related to your query. The authors emphasize self-attention mechanisms [1] and optimizing training efficiency [2] to achieve state-of-the-art accuracy.`;
      citations = [
        {
          id: '1',
          source: docName,
          text: 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms.',
          page: 1,
        },
        {
          id: '2',
          source: docName,
          text: 'On the English-to-German translation task, the Transformer outperforms the best previously reported systems.',
          page: 7,
        }
      ];
    }
  } else if (docId === 'climate-change-report' || docName.toLowerCase().includes('climate') || docName.toLowerCase().includes('environment') || docName.toLowerCase().includes('report')) {
    const match = CLIMATE_QA.find((qa) =>
      qa.keywords.some((k) => lowerQuery.includes(k))
    );
    if (match) {
      answer = match.answer;
      citations = match.citations;
    } else {
      answer = `The 2026 Climate Change Report highlights policies to reduce carbon emissions. Key recommendations include scaling up alternative resources [1] and revising ecological risk models [2].`;
      citations = [
        {
          id: '1',
          source: docName,
          text: 'Transitioning key industrial sectors to electric and hydrogen power holds the highest potential for reduction.',
          page: 15,
        },
        {
          id: '2',
          source: docName,
          text: 'Revised modeling suggests that risk multipliers for climate-induced migration have been underestimated in coastal regions.',
          page: 22,
        }
      ];
    }
  } else {
    // Generic fallback for any newly uploaded mock PDF
    answer = `I have analyzed the document "${docName}" regarding "${message}". Section indexes indicate that standard frameworks [1] and processing parameters [2] are relevant to this query.`;
    citations = [
      {
        id: '1',
        source: docName,
        text: `The implementation of ${message} is documented under technical operations as standard procedure.`,
        page: 2,
      },
      {
        id: '2',
        source: docName,
        text: `Results show significant efficiency gains when using the configured parameters.`,
        page: 4,
      }
    ];
  }

  const responseMsg: Message = {
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    content: answer,
    citations,
  };

  // Save to sessionStorage
  const chats = getMockChats();
  if (!chats[docId]) chats[docId] = [];
  chats[docId].push(responseMsg);
  saveMockChats(chats);

  return { data: responseMsg, isMock: true };
}

export function getMockChatHistory(docId: string): Message[] {
  const chats = getMockChats();
  return chats[docId] || [];
}

export function saveMockChatMessage(docId: string, msg: Message) {
  const chats = getMockChats();
  if (!chats[docId]) chats[docId] = [];
  chats[docId].push(msg);
  saveMockChats(chats);
}

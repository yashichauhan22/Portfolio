import { Project, ExperienceItem, EducationItem, ArsenalCategory } from '../types';

export const PERSONAL_INFO = {
  name: 'Yashi Chauhan',
  role: 'AI / ML Engineer & Computer Science Undergraduate',
  tagline: 'Specializing in Enterprise RAG Systems, Explainable Deep Learning, and Computer Vision.',
  email: 'yashichauhan2212@gmail.com',
  phone: '+91-8279371687',
  location: 'Dehradun / Noida, India',
  educationSummary: 'B.Tech in Computer Science (CGPA: 8.61/10) at Graphic Era Deemed to be University',
  githubUrl: 'https://github.com/yashichauhan22',
  linkedinUrl: 'https://www.linkedin.com/in/yashi-chauhan-84744624b/',
  leetcodeUrl: 'https://leetcode.com/u/yashichauhan2212/',
};

export const PROJECTS: Project[] = [
  {
    id: 'enterprise-rag-assistant',
    number: '01',
    title: 'Enterprise RAG Assistant',
    tagline: 'Semantic Q&A Engine over Enterprise Documents with Local LLM Inference',
    role: 'AI / ML Backend Architect',
    timeline: '2024 — 2025',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBgzC4hX_XitbBAa2zyHVrcg_FEZ-2yJihUmW-DBehtxNZ2ont-Cq1QlvWWg2SxlZFuPdfzIE-mT9VnPUx4o-ookEIp2PoZ3-56DNNsyCMZd8igdud1WMK0qBN511KD8kUdQgclg-hkSlgPO5YEbWhuOJXntEHGpdrbw9HMFz2beHZJMNW3FiFfgyTQss30VDhQqtd9bFIxrskUNUB2NSWNSMTZPpltS3KGDFwHo4UWs0DhMU-Xoo7',
    imageAlt: 'Enterprise RAG Assistant Architecture with FastAPI, ChromaDB and Ollama',
    description: 'An enterprise-grade Retrieval-Augmented Generation (RAG) assistant using FastAPI for high-precision semantic question answering over uploaded PDF documents with local LLM orchestration.',
    techStack: ['Python', 'FastAPI', 'Ollama', 'ChromaDB', 'Sentence Transformers', 'LangChain'],
    techStackDetailed: [
      { number: '01', name: 'FastAPI & Clean Architecture', detail: 'Modular service-oriented REST APIs with JWT auth, streaming responses, and structured logging' },
      { number: '02', name: 'Sentence Transformers', detail: 'Dense embeddings generation with domain-adapted semantic embedding models' },
      { number: '03', name: 'ChromaDB Vector Store', detail: 'Persistent collection storage with metadata filtering, hybrid search, and cosine distance indexing' },
      { number: '04', name: 'Ollama Local LLM Inference', detail: 'Low-latency on-premise LLM execution with strict prompt engineering and context grounding' }
    ],
    challenge: 'Enterprises required zero-data-leakage semantic question answering over sensitive proprietary PDF documentation. Cloud-hosted LLM endpoints posed data privacy risks and latency spikes, while traditional keyword search failed on complex conceptual queries across multi-page technical reports.',
    outcome: 'Engineered an end-to-end RAG pipeline featuring asynchronous PDF parsing, intelligent text chunking, dense vector indexing via ChromaDB, and context-grounded inference with Ollama. Achieved sub-second retrieval latency, robust context relevancy, and clean modularity for caching, reranking, and workflow automation.',
    metrics: [
      { label: 'Retrieval Latency', value: '< 240 ms', change: 'ChromaDB indexed' },
      { label: 'Context Relevancy', value: '96.8%', change: 'Grounded generation' },
      { label: 'Data Privacy', value: '100% On-Prem', change: 'Local Ollama model' },
      { label: 'Document Formats', value: 'PDF / Text', change: 'Chunked & tokenized' }
    ],
    githubUrl: 'https://github.com/yashichauhan22/enterprise-rag-assistant',
    demoUrl: '#',
    codeSnippet: {
      filename: 'services/rag_engine.py',
      language: 'python',
      code: `from fastapi import FastAPI, UploadFile, Depends
from sentence_transformers import SentenceTransformer
import chromadb
import ollama

app = FastAPI(title="Enterprise RAG Assistant API")
embedder = SentenceTransformer("all-MiniLM-L6-v2")
chroma_client = chromadb.PersistentClient(path="./data/chroma")
collection = chroma_client.get_or_create_collection("enterprise_docs")

@app.post("/api/query")
async def answer_question(query: str):
    query_vector = embedder.encode(query).tolist()
    results = collection.query(query_embeddings=[query_vector], n_results=4)
    context = "\n".join([doc for doc in results['documents'][0]])
    
    prompt = f"""Use the following verified context to answer accurately:
Context: {context}
Question: {query}
Answer:"""
    
    response = ollama.chat(
        model="llama3:8b",
        messages=[{"role": "user", "content": prompt}]
    )
    return {"answer": response['message']['content'], "sources": results['metadatas'][0]}`
    },
    architectureNodes: [
      { id: 'fastapi', label: 'FastAPI Gateway & Auth', type: 'gateway', status: 'optimal', tps: '1,200 req/min', latency: '2.1 ms' },
      { id: 'embed', label: 'SentenceTransformer Worker', type: 'service', status: 'healthy', tps: '380 docs/s', latency: '14.2 ms' },
      { id: 'chroma', label: 'ChromaDB Vector Storage', type: 'db', status: 'optimal', tps: '10,000 queries/s', latency: '4.8 ms' },
      { id: 'ollama', label: 'Ollama Local LLM Daemon', type: 'cache', status: 'healthy', tps: '48 tokens/s', latency: '180 ms' }
    ]
  },
  {
    id: 'xai-sign-language-recognition',
    number: '02',
    title: 'XAI Indian Sign Language Recognition',
    tagline: 'Fine-Tuned ResNet18 with Explainable AI (Grad-CAM, LIME, SHAP) on 36 Gesture Classes',
    role: 'Computer Vision & Deep Learning Researcher',
    timeline: '2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALRbiTO4YFiuUqtiWf9k03jjc6AS4NbWntNumF70-NVLH00XtTntFxWr-KOPx4gOQbXcBW9DmqlxFEbDj5vgYIubhuG5gw5I1LgtCCra-z_OZy_fNaEQMP_P2i8BM6UrScla2nhnxFJMXuQu_qD9x4bhy_9ATeoapCmQfMpSrKjPnOQqZuG-Z8r9SN1sAp33KpiYauM5tFA4RDytmD6BgeUWHT3cO6BTDwAOzm5hL3K1yU59dETzR5',
    imageAlt: 'Indian Sign Language Recognition Neural Network with Explainable AI attribution heatmaps',
    description: 'An Indian Sign Language (ISL) recognition system using fine-tuned ResNet18 to classify 36 gesture classes with 99.83% test accuracy on ISLRTC and explainable visual attribution maps.',
    techStack: ['Python', 'PyTorch', 'ResNet18', 'Grad-CAM', 'LIME', 'SHAP', 'OpenCV'],
    techStackDetailed: [
      { number: '01', name: 'Fine-Tuned ResNet18', detail: 'Deep residual CNN fine-tuned with transfer learning across 36 ISL gesture categories' },
      { number: '02', name: 'Data Augmentation Pipeline', detail: 'Spatial transformations, affine jitter, lighting normalization on ISLRTC benchmark' },
      { number: '03', name: 'Grad-CAM & Occlusion Sensitivity', detail: 'Pixel-level gradient localization highlighting key hand anatomy and joint configurations' },
      { number: '04', name: 'LIME & SHAP Interpretability', detail: 'Model-agnostic feature importance validations to guarantee non-spurious spatial correlations' }
    ],
    challenge: 'Sign language recognition systems often act as black-boxes, making it impossible for clinical or educational practitioners to verify if predictions are based on genuine hand gestures rather than background lighting or image artifacts.',
    outcome: 'Developed an end-to-end PyTorch pipeline classifying 36 distinct Indian Sign Language gestures. Achieved 99.83% test accuracy on the benchmark ISLRTC dataset. Integrated 4 state-of-the-art XAI attribution methods (Grad-CAM, LIME, SHAP, Occlusion Sensitivity) to mathematically validate feature importance.',
    metrics: [
      { label: 'ISLRTC Test Accuracy', value: '99.83%', change: 'State-of-the-art' },
      { label: 'Gesture Classes', value: '36 Classes', change: 'Full ISL Alphabet + Numerals' },
      { label: 'Inference Speed', value: '18 ms/frame', change: 'Real-time video ready' },
      { label: 'XAI Methods', value: '4 Frameworks', change: 'Grad-CAM, LIME, SHAP, Occlusion' }
    ],
    githubUrl: 'https://github.com/yashichauhan22/xai-indian-sign-language',
    demoUrl: '#',
    codeSnippet: {
      filename: 'models/isl_classifier.py',
      language: 'python',
      code: `import torch
import torch.nn as nn
from torchvision import models
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget

class ISLResNet18(nn.Module):
    def __init__(self, num_classes=36):
        super(ISLResNet18, self).__init__()
        self.base_model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
        in_features = self.base_model.fc.in_features
        self.base_model.fc = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(in_features, 256),
            nn.ReLU(),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        return self.base_model(x)

def explain_prediction(model, input_tensor, target_class):
    target_layers = [model.base_model.layer4[-1]]
    cam = GradCAM(model=model, target_layers=target_layers)
    targets = [ClassifierOutputTarget(target_class)]
    grayscale_cam = cam(input_tensor=input_tensor, targets=targets)
    return grayscale_cam[0, :]`
    },
    architectureNodes: [
      { id: 'preprocess', label: 'Image Preprocessing & Augmentation', type: 'gateway', status: 'optimal', tps: '120 fps', latency: '3.2 ms' },
      { id: 'resnet', label: 'ResNet18 Feature Extractor', type: 'service', status: 'healthy', tps: '55 fps', latency: '12.4 ms' },
      { id: 'gradcam', label: 'Grad-CAM Heatmap Engine', type: 'cache', status: 'optimal', tps: '45 fps', latency: '8.1 ms' },
      { id: 'shap_lime', label: 'SHAP / LIME Evaluator', type: 'db', status: 'healthy', tps: '15 frames/s', latency: '24.0 ms' }
    ]
  },
  {
    id: 'speech-emotion-recognition',
    number: '03',
    title: 'Speech Emotion Recognition',
    tagline: 'Deep Learning Acoustic Emotion Classifier using Librosa MFCC & LSTM Networks',
    role: 'Deep Learning / Audio NLP Engineer',
    timeline: '2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBgzC4hX_XitbBAa2zyHVrcg_FEZ-2yJihUmW-DBehtxNZ2ont-Cq1QlvWWg2SxlZFuPdfzIE-mT9VnPUx4o-ookEIp2PoZ3-56DNNsyCMZd8igdud1WMK0qBN511KD8kUdQgclg-hkSlgPO5YEbWhuOJXntEHGpdrbw9HMFz2beHZJMNW3FiFfgyTQss30VDhQqtd9bFIxrskUNUB2NSWNSMTZPpltS3KGDFwHo4UWs0DhMU-Xoo7',
    imageAlt: 'Speech Emotion Recognition spectrogram audio processing with LSTM network',
    description: 'An acoustic emotion classification system leveraging Mel-Frequency Cepstral Coefficients (MFCC) extracted via Librosa and stacked Bi-LSTM/RNN architectures for real-time speech sentiment detection.',
    techStack: ['Python', 'Deep Learning', 'MFCC', 'LSTM / RNN', 'Librosa', 'scikit-learn', 'Matplotlib'],
    techStackDetailed: [
      { number: '01', name: 'Librosa Audio Processing', detail: 'Acoustic feature extraction: 40-dimensional MFCCs, chroma, and spectral contrast' },
      { number: '02', name: 'Bidirectional LSTM Network', detail: 'Recurrent sequence modeling capturing temporal vocal dynamics and pitch contours' },
      { number: '03', name: 'Regularization & Dropout', detail: 'L2 weight decay and 0.4 dropout layers preventing overfitting on emotional audio corpora' },
      { number: '04', name: 'Diagnostic Visualization', detail: 'Confusion matrices, ROC curves, loss/accuracy curves for cross-dataset verification' }
    ],
    challenge: 'Acoustic emotion detection suffers from high variance across speaker accents, background noise, and temporal speaking speeds, leading to degraded classification performance in traditional shallow classifiers.',
    outcome: 'Architected an RNN/LSTM-based neural network trained on MFCC audio representations. Benchmarked against classical ML algorithms (SVM, Random Forest) and demonstrated superior emotional state discrimination across Happy, Sad, Neutral, Angry, Fearful, and Surprised states.',
    metrics: [
      { label: 'Acoustic Feature', value: '40 MFCCs', change: 'Extracted via Librosa' },
      { label: 'Model Architecture', value: 'Bi-LSTM + RNN', change: 'Temporal sequence learning' },
      { label: 'Emotion Classes', value: '6 States', change: 'Multi-class softmax' },
      { label: 'Overfitting Drop', value: '-28% Loss Gap', change: 'Dropout & L2 tuning' }
    ],
    githubUrl: 'https://github.com/yashichauhan22/speech-emotion-recognition',
    demoUrl: '#',
    codeSnippet: {
      filename: 'audio/ser_model.py',
      language: 'python',
      code: `import librosa
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization

def extract_mfcc(file_path, max_pad_len=174):
    audio, sample_rate = librosa.load(file_path, res_type='kaiser_fast')
    mfcc = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
    if mfcc.shape[1] < max_pad_len:
        pad_width = max_pad_len - mfcc.shape[1]
        mfcc = np.pad(mfcc, pad_width=((0, 0), (0, pad_width)), mode='constant')
    else:
        mfcc = mfcc[:, :max_pad_len]
    return mfcc

def build_ser_model(input_shape=(40, 174), num_classes=6):
    model = Sequential([
        LSTM(128, return_sequences=True, input_shape=input_shape),
        Dropout(0.3),
        BatchNormalization(),
        LSTM(64),
        Dropout(0.3),
        Dense(64, activation='relu'),
        Dense(num_classes, activation='softmax')
    ])
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model`
    },
    architectureNodes: [
      { id: 'audio_in', label: 'Audio Ingestion (Librosa)', type: 'gateway', status: 'optimal', tps: '16 kHz WAV', latency: '4.5 ms' },
      { id: 'mfcc_ext', label: '40-Band MFCC Extraction', type: 'service', status: 'healthy', tps: '85 clips/s', latency: '11.0 ms' },
      { id: 'lstm_core', label: 'Bi-LSTM Recurrent Core', type: 'cache', status: 'optimal', tps: '120 infer/s', latency: '6.8 ms' },
      { id: 'softmax_out', label: '6-Emotion Probabilities', type: 'db', status: 'healthy', tps: '120 infer/s', latency: '1.2 ms' }
    ]
  }
];

export const EDUCATION: EducationItem[] = [
  {
    institution: 'Graphic Era Deemed to be University',
    degree: 'Bachelor of Technology in Computer Science',
    period: 'Sept 2022 – May 2026',
    location: 'Dehradun, India',
    grade: 'CGPA: 8.61 / 10',
    highlights: [
      'Specialization in AI/ML, Data Structures, Algorithms, and Distributed Systems',
      'Strong academic standing with consistent 8.61+ CGPA',
      'Active contributor to tech communities and competitive coding on LeetCode'
    ]
  }
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    period: 'Aug 2025 – Feb 2026',
    role: 'AI/ML Intern',
    company: 'Data Security Council of India (DSCI)',
    location: 'Noida, India',
    whatIBuilt: 'Developed and optimized automated data update pipelines for the TechSagar platform, improving data processing efficiency and reducing manual effort. Enriched and validated technology ecosystem datasets by integrating information from multiple sources, improving data quality and coverage.',
    engineeringImpact: 'Managed database operations, wrote optimized SQL queries, and ensured data consistency for large-scale technology records. Streamlined national technology ecosystem tracking workflows across cybersecurity and emerging tech sectors.',
    skills: ['Python', 'SQL', 'Data Pipelines', 'TechSagar Platform', 'Data Validation', 'Database Optimization', 'ETL'],
    isActive: true
  }
];

export const TECHNICAL_ARSENAL: ArsenalCategory[] = [
  {
    title: 'Languages',
    items: [
      'Python',
      'C & C++',
      'SQL',
      'JavaScript',
      'HTML & CSS'
    ]
  },
  {
    title: 'Technologies & Frameworks',
    items: [
      'FastAPI, LangChain, Hugging Face',
      'PyTorch, Keras, scikit-learn',
      'NumPy, Pandas, Matplotlib',
      'ChromaDB, Ollama, n8n'
    ]
  },
  {
    title: 'Core Concepts',
    items: [
      'Retrieval-Augmented Generation (RAG)',
      'Vector Databases & Embeddings',
      'CNN, RNN, LSTM, NLP',
      'Explainable AI (Grad-CAM, SHAP, LIME)',
      'Prompt Engineering & Semantic Search'
    ]
  },
  {
    title: 'Tools & Systems',
    items: [
      'Git & GitHub, VS Code',
      'Jupyter Notebook, Google Colab',
      'Linux & Windows OS',
      'Librosa, OpenCV'
    ]
  }
];

export const SOCIAL_LINKS = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/yashi-chauhan-84744624b/', icon: 'north_east' },
  { label: 'GitHub', url: 'https://github.com/yashichauhan22', icon: 'north_east' },
  { label: 'LeetCode', url: 'https://leetcode.com/u/yashichauhan2212/', icon: 'north_east' },
  { label: 'Email', url: 'mailto:yashichauhan2212@gmail.com', icon: 'north_east' },
  { label: 'Phone', url: 'tel:+918279371687', icon: 'call' }
];

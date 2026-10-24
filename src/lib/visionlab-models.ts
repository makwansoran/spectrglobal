export type VisionlabProviderId =
  | "ultralytics"
  | "meta"
  | "idea"
  | "google"
  | "microsoft"
  | "openai"
  | "intel"
  | "bytedance"
  | "jaided"
  | "baidu"
  | "pytorch"
  | "opencv"
  | "llava"
  | "moondream"
  | "alibaba"
  | "opengvlab";

export const visionlabProviders: {
  id: VisionlabProviderId;
  name: string;
  logo: string;
}[] = [
  { id: "ultralytics", name: "Ultralytics", logo: "/images/model-providers/ultralytics.png" },
  { id: "meta", name: "Meta", logo: "/images/model-providers/meta.svg" },
  { id: "idea", name: "IDEA", logo: "/images/model-providers/idea.png" },
  { id: "google", name: "Google", logo: "/images/model-providers/google.svg" },
  { id: "microsoft", name: "Microsoft", logo: "/images/model-providers/microsoft.svg" },
  { id: "openai", name: "OpenAI", logo: "/images/model-providers/openai.svg" },
  { id: "intel", name: "Intel", logo: "/images/model-providers/intel.svg" },
  { id: "bytedance", name: "ByteDance", logo: "/images/model-providers/bytedance.svg" },
  { id: "jaided", name: "Jaided AI", logo: "/images/model-providers/jaided.png" },
  { id: "baidu", name: "Baidu", logo: "/images/model-providers/baidu.svg" },
  { id: "pytorch", name: "PyTorch", logo: "/images/model-providers/pytorch.svg" },
  { id: "opencv", name: "OpenCV", logo: "/images/model-providers/opencv.svg" },
  { id: "llava", name: "LLaVA", logo: "/images/model-providers/llava.png" },
  { id: "moondream", name: "Moondream", logo: "/images/model-providers/moondream.png" },
  { id: "alibaba", name: "Alibaba", logo: "/images/model-providers/alibaba.svg" },
  { id: "opengvlab", name: "OpenGVLab", logo: "/images/model-providers/opengvlab.png" },
];

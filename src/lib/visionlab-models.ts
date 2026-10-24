export type VisionlabModelTask =
  | "detect"
  | "segment"
  | "pose"
  | "classify"
  | "obb"
  | "multimodal"
  | "embed"
  | "depth"
  | "ocr"
  | "anomaly"
  | "face"
  | "track";

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

export type VisionlabModel = {
  providerId: VisionlabProviderId;
  provider: string;
  name: string;
  task: VisionlabModelTask;
  size: string;
};

export const visionlabProviders: Record<
  VisionlabProviderId,
  { name: string; logo: string }
> = {
  ultralytics: { name: "Ultralytics", logo: "/images/model-providers/ultralytics.svg" },
  meta: { name: "Meta", logo: "/images/model-providers/meta.svg" },
  idea: { name: "IDEA", logo: "/images/model-providers/idea.svg" },
  google: { name: "Google", logo: "/images/model-providers/google.svg" },
  microsoft: { name: "Microsoft", logo: "/images/model-providers/microsoft.svg" },
  openai: { name: "OpenAI", logo: "/images/model-providers/openai.svg" },
  intel: { name: "Intel", logo: "/images/model-providers/intel.svg" },
  bytedance: { name: "ByteDance", logo: "/images/model-providers/bytedance.svg" },
  jaided: { name: "Jaided AI", logo: "/images/model-providers/jaided.svg" },
  baidu: { name: "Baidu", logo: "/images/model-providers/baidu.svg" },
  pytorch: { name: "PyTorch", logo: "/images/model-providers/pytorch.svg" },
  opencv: { name: "OpenCV", logo: "/images/model-providers/opencv.svg" },
  llava: { name: "LLaVA", logo: "/images/model-providers/llava.svg" },
  moondream: { name: "Moondream", logo: "/images/model-providers/moondream.svg" },
  alibaba: { name: "Alibaba", logo: "/images/model-providers/alibaba.svg" },
  opengvlab: { name: "OpenGVLab", logo: "/images/model-providers/opengvlab.svg" },
};

export const visionlabModels: VisionlabModel[] = [
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLOv8n", task: "detect", size: "6 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLOv8s", task: "detect", size: "22 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLOv8m", task: "detect", size: "52 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLOv8l", task: "detect", size: "87 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLOv8x", task: "detect", size: "136 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLO11n", task: "detect", size: "5 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLO11s", task: "detect", size: "19 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLO11m", task: "detect", size: "40 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLO11l", task: "detect", size: "51 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLO11x", task: "detect", size: "114 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLOv5nu", task: "detect", size: "4 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLOv9t", task: "detect", size: "4 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLOv9s", task: "detect", size: "15 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLOv10n", task: "detect", size: "6 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLOv10s", task: "detect", size: "16 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLOv8n-seg", task: "segment", size: "7 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLOv8s-seg", task: "segment", size: "24 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLO11n-seg", task: "segment", size: "6 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLOv8n-pose", task: "pose", size: "7 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLO11n-pose", task: "pose", size: "6 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLOv8n-cls", task: "classify", size: "5 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLO11n-cls", task: "classify", size: "6 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLOv8n-obb", task: "obb", size: "7 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "RT-DETR-L", task: "detect", size: "66 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "RT-DETR-X", task: "detect", size: "130 MB" },
  { providerId: "meta", provider: "Meta", name: "DETR ResNet-50", task: "detect", size: "160 MB" },
  { providerId: "meta", provider: "Meta", name: "Deformable DETR", task: "detect", size: "160 MB" },
  { providerId: "meta", provider: "Meta", name: "DINO (DETR)", task: "detect", size: "220 MB" },
  { providerId: "idea", provider: "IDEA", name: "Grounding DINO Tiny", task: "detect", size: "600 MB" },
  { providerId: "google", provider: "Google", name: "OWLv2 Base", task: "detect", size: "580 MB" },
  { providerId: "microsoft", provider: "Microsoft", name: "Florence-2 Base", task: "multimodal", size: "460 MB" },
  { providerId: "meta", provider: "Meta", name: "SAM ViT-B", task: "segment", size: "375 MB" },
  { providerId: "meta", provider: "Meta", name: "SAM ViT-L", task: "segment", size: "1.3 GB" },
  { providerId: "meta", provider: "Meta", name: "SAM ViT-H", task: "segment", size: "2.6 GB" },
  { providerId: "meta", provider: "Meta", name: "SAM 2 Tiny", task: "segment", size: "150 MB" },
  { providerId: "meta", provider: "Meta", name: "SAM 2 Small", task: "segment", size: "180 MB" },
  { providerId: "meta", provider: "Meta", name: "MobileSAM", task: "segment", size: "40 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "FastSAM-s", task: "segment", size: "23 MB" },
  { providerId: "meta", provider: "Meta", name: "HQ-SAM", task: "segment", size: "400 MB" },
  { providerId: "meta", provider: "Meta", name: "DINOv2 Small", task: "embed", size: "90 MB" },
  { providerId: "meta", provider: "Meta", name: "DINOv2 Base", task: "embed", size: "330 MB" },
  { providerId: "meta", provider: "Meta", name: "DINOv2 Large", task: "embed", size: "1.1 GB" },
  { providerId: "openai", provider: "OpenAI", name: "CLIP ViT-B/32", task: "embed", size: "340 MB" },
  { providerId: "openai", provider: "OpenAI", name: "CLIP ViT-L/14", task: "embed", size: "890 MB" },
  { providerId: "google", provider: "Google", name: "SigLIP Base", task: "embed", size: "800 MB" },
  { providerId: "meta", provider: "Meta", name: "MAE ViT-B", task: "embed", size: "340 MB" },
  { providerId: "meta", provider: "Meta", name: "ResNet-50", task: "classify", size: "98 MB" },
  { providerId: "google", provider: "Google", name: "EfficientNet-B0", task: "classify", size: "20 MB" },
  { providerId: "meta", provider: "Meta", name: "ConvNeXt Tiny", task: "classify", size: "110 MB" },
  { providerId: "google", provider: "Google", name: "ViT-B/16", task: "classify", size: "330 MB" },
  { providerId: "microsoft", provider: "Microsoft", name: "Swin Tiny", task: "classify", size: "110 MB" },
  { providerId: "intel", provider: "Intel", name: "MiDaS Small", task: "depth", size: "50 MB" },
  { providerId: "bytedance", provider: "ByteDance", name: "Depth Anything V2 Small", task: "depth", size: "100 MB" },
  { providerId: "bytedance", provider: "ByteDance", name: "Depth Anything V2 Base", task: "depth", size: "370 MB" },
  { providerId: "intel", provider: "Intel", name: "ZoeDepth", task: "depth", size: "1.4 GB" },
  { providerId: "jaided", provider: "Jaided AI", name: "EasyOCR (EN)", task: "ocr", size: "100 MB" },
  { providerId: "baidu", provider: "Baidu", name: "PaddleOCR v4", task: "ocr", size: "80 MB" },
  { providerId: "microsoft", provider: "Microsoft", name: "TrOCR Base", task: "ocr", size: "500 MB" },
  { providerId: "intel", provider: "Intel", name: "PatchCore", task: "anomaly", size: "200 MB" },
  { providerId: "intel", provider: "Intel", name: "EfficientAD", task: "anomaly", size: "150 MB" },
  { providerId: "intel", provider: "Intel", name: "PaDiM", task: "anomaly", size: "120 MB" },
  { providerId: "intel", provider: "Intel", name: "STFPM", task: "anomaly", size: "90 MB" },
  { providerId: "intel", provider: "Intel", name: "GANomaly", task: "anomaly", size: "80 MB" },
  { providerId: "pytorch", provider: "PyTorch", name: "InsightFace Buffalo_L", task: "face", size: "320 MB" },
  { providerId: "pytorch", provider: "PyTorch", name: "RetinaFace", task: "face", size: "110 MB" },
  { providerId: "ultralytics", provider: "Ultralytics", name: "YOLOv8n-face", task: "face", size: "6 MB" },
  { providerId: "pytorch", provider: "PyTorch", name: "ByteTrack", task: "track", size: "1 MB" },
  { providerId: "pytorch", provider: "PyTorch", name: "BoT-SORT", task: "track", size: "1 MB" },
  { providerId: "opencv", provider: "OpenCV", name: "OpenCV SSD MobileNet", task: "detect", size: "25 MB" },
  { providerId: "opencv", provider: "OpenCV", name: "OpenCV YOLO COCO", task: "detect", size: "240 MB" },
  { providerId: "opencv", provider: "OpenCV", name: "OpenCV EAST text", task: "ocr", size: "90 MB" },
  { providerId: "llava", provider: "LLaVA", name: "LLaVA 1.5 7B", task: "multimodal", size: "14 GB" },
  { providerId: "moondream", provider: "Moondream", name: "Moondream2", task: "multimodal", size: "1.8 GB" },
  { providerId: "alibaba", provider: "Alibaba", name: "Qwen2-VL 2B", task: "multimodal", size: "4.5 GB" },
  { providerId: "opengvlab", provider: "OpenGVLab", name: "InternVL2 2B", task: "multimodal", size: "4.5 GB" },
];

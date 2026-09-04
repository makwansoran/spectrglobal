export type EdgeModel = {
  id: string;
  name: string;
  logo: string;
};

export const edgeModelsSection = {
  title: "Models",
  body: "YOLO, YOLOX, SAM, CLIP, and PaddleOCR — compiled for the Hailo chip. Detection, segmentation, language, and OCR on site.",
};

export const edgeModels: EdgeModel[] = [
  { id: "yolo", name: "YOLO", logo: "/images/models/yolo.png" },
  { id: "yolox", name: "YOLOX", logo: "/images/models/yolox.png" },
  { id: "sam", name: "SAM", logo: "/images/models/sam.svg" },
  { id: "clip", name: "CLIP", logo: "/images/models/clip.svg" },
  { id: "paddleocr", name: "PaddleOCR", logo: "/images/models/paddleocr.png" },
];

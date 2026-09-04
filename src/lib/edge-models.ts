export type EdgeModel = {
  id: string;
  name: string;
  logo: string;
};

export const edgeModelsSection = {
  title: "Models",
  body: "Ultralytics and NVIDIA — the models Spectr Edge offers.",
};

export const edgeModels: EdgeModel[] = [
  { id: "ultralytics", name: "Ultralytics", logo: "/images/models/ultralytics.png" },
  { id: "nvidia", name: "NVIDIA", logo: "/images/models/nvidia.png" },
];

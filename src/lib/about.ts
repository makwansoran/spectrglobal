export const aboutPage = {
  title: "Why We're Here",
  belief: "Machines should see the world clearly enough to act, and people should be able to check the call.",
  heroImage: "/spectr-detection.png",
  heroImageAlt: "Aerial site with vehicles outlined by Spectr detection",
  statement:
    "Spectr builds open computer vision, AI vision, and vision-language-action models for work that happens in the physical world.",
  founding: [
    "Most vision stacks stop at a box on a frame. The sites we care about need the next step: what the camera saw, what it means, and what should happen next.",
    "Closed models make that hard to inspect, hard to fine-tune, and hard to run next to the camera. We started Spectr so the weights, the tasks, and the path to action stay open.",
    "Spectr is a computer vision company in Norway. The product is a family of open models — detection, segmentation, pose, classification, depth, and vision-language-action.",
  ],
  whatWeDoTitle: "What we do",
  whatWeDo: [
    {
      title: "We publish open vision models",
      paragraphs: [
        "Spectr Detect, Segment, Pose, Classify, Depth, and VLA cover the tasks teams ship: boxes, masks, keypoints, labels, distance, and action.",
        "The models are open source. You can read them, fine-tune them on your own scenes, and run them on hardware you control.",
      ],
    },
    {
      title: "We help teams put vision to work",
      paragraphs: [
        "A public checkpoint is the start. Factories, yards, robots, and clinics need a model that knows their parts, their light, and their limits.",
        "We work with teams that want a fine-tune, an edge deployment, or a support agreement around the same open models.",
      ],
    },
  ],
  expertiseTitle: "Our expertise",
  expertise: [
    {
      title: "Computer vision",
      body: "Detection, segmentation, pose, classification, and depth on images and video, trained to survive real sites.",
    },
    {
      title: "AI vision",
      body: "Models that do more than draw a box. They describe the scene so a person can confirm what the system claims to see.",
    },
    {
      title: "Vision-language-action",
      body: "A camera, an instruction, and a next action. Spectr VLA is how seeing becomes a bounded move for a person or a robot.",
    },
    {
      title: "Open release",
      body: "Weights and a small Python API. Export to the runtimes you already deploy, from a workstation to the edge.",
    },
  ],
  startedTitle: "How we started",
  started: [
    "Spectr began in Norway around a simple gap: industrial software could store a decision, but it could not see the floor it was deciding about.",
    "We built vision models first — open, task-specific, and meant to run where the camera is. Spectr VLA is the step that connects what the model sees to what should happen next.",
    "We stay small on purpose. Close to the scenes the models have to survive.",
  ],
  futureTitle: "Where we're going",
  futureLead: "More open models, and a shorter path from a frame to an action.",
  future: [
    "The next models stay in the open: better detection in hard light, tighter masks, and VLA policies that can be inspected before they move anything.",
    "We want a developer to go from pip install to a useful prediction on their own footage in an afternoon, and a site to fine-tune that model without sending the video away.",
    "That is the company: computer vision, AI vision, and vision-language-action, published so other people can build on it.",
  ],
} as const;

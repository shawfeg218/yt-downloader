import { DownloadParams } from "@/types";
type Type = DownloadParams["type"];

export const getArgs = (type: Type, container: string, outputExtension: string): string[] => {
  // if type is video and container is not mp4
  if (type === "video" && container !== "mp4") {
    return [
      "-i",
      `input.${container}`,
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-c:a",
      "aac",
      `output.${outputExtension}`,
    ];
  }

  // if type is video and container is mp4
  if (type === "video" && container === "mp4") {
    return ["-i", `input.${container}`, "-c", "copy", `output.${outputExtension}`];
  }

  return ["-i", `input.${container}`, "-c:a", "libmp3lame", `output.${outputExtension}`];
};

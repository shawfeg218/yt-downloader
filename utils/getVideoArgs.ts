export const getVideoArgs = (
  VideoContainer: string,
  AudioContainer: string,
  outputExtension: string
): string[] => {
  if (VideoContainer == "mp4") {
    return [
      "-i",
      `inputVideo.${VideoContainer}`,
      "-i",
      `inputAudio.${AudioContainer}`,
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      `output.${outputExtension}`,
    ];
  }
  return [
    "-i",
    `inputVideo.${VideoContainer}`,
    "-i",
    `inputAudio.${AudioContainer}`,
    "-c:v",
    "libx264",
    "-c:a",
    "aac",
    `output.${outputExtension}`,
  ];
};

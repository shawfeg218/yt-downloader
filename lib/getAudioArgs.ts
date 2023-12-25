export default function getAudioArgs(container: string, outputExtension: string): string[] {
  if (container === "mp3") {
    return ["-i", "input.mp3", "-c:a", "copy", `output.${outputExtension}`];
  }
  return ["-i", `input.${container}`, "-c:a", "libmp3lame", `output.${outputExtension}`];
}

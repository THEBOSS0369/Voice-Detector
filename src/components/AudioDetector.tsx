"use client";
import { useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AudioDetector = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    isAI: boolean;
    confidence: number;
    message: string;
  } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("audio/")) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio", file);
      const response = await fetch("/api/detect-audio", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Detection failed");
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        isAI: false,
        confidence: 0,
        message: "Error processing audio. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-neutral-950 min-h-screen">
      <div className="relative h-20 ">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
      </div>

      <div className="mt-20">
        <h1 className="text-6xl text-white font-bold text-center p-2 tracking-tight">
          Audio Detective:
        </h1>
        <h1 className="text-6xl text-white font-bold text-center p-3 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            AI Audio Analysis
          </span>
          Hub.
        </h1>

        <div className="flex text-white items-center justify-center">
          <p className="p-10 text-center text-lg">
            Upload your audio file and instantly detect if it's AI-generated,
            <br />
            from{" "}
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
              voice recordings to synthetic speech.
            </span>
            <br />
            Your audio, our analysis!
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 ">
        <div className="bg-neutral-800 rounded-lg p-8 w-full max-w-2xl">
          <div className="border-2 border-dashed border-neutral-600 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
              id="audio-input"
            />
            <label
              htmlFor="audio-input"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <span className="text-gray-400">
                {file ? file.name : "Click to upload audio file"}
              </span>
            </label>
          </div>

          {file && (
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-2 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
            >
              {isLoading ? "Analyzing..." : "Analyze Audio"}
            </button>
          )}

          {result && (
            <div className="mt-6">
              <Alert
                variant={result.isAI ? "destructive" : "default"}
                className="bg-neutral-700 border-neutral-600"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-white">
                  {result.isAI
                    ? "AI Generated Audio Detected"
                    : "Natural Audio Detected"}
                </AlertTitle>
                <AlertDescription className="text-gray-300">
                  Confidence: {result.confidence}%
                  <br />
                  {result.message}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioDetector;

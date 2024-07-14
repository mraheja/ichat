import { useState, useRef, useCallback } from "react";


export const useInteractive = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<string>('');
  const currentRequestRef = useRef<number>(0);

  const streamSuggestion = useCallback(
    async (instruction: string) => {
      const requestId = ++currentRequestRef.current;

      setIsLoading(true);
      const res = await fetch('/api/interactive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instruction,
        }),
      });

      // The response body is a ReadableStream.
      // You can use it to read the incoming data chunk by chunk.
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      let suggestion = '';

      // Read the stream
      while (true) {
        if (!reader) break;

        const { done, value } = await reader.read();
        if (done) break; // The stream has been fully read

        // Decode and process the chunk
        const chunk = decoder.decode(value, { stream: true });
        suggestion += chunk;

        // Extract the suggestion text between the first pair of triple backticks
        const trimmedSuggestion = suggestion
          .substring(
            suggestion.indexOf('```'),
            suggestion.includes('```', suggestion.indexOf('```') + 3)
              ? suggestion.indexOf('```', suggestion.indexOf('```') + 3) + 3
              : suggestion.length
          )
          .trim()
          .split('\n')
          .slice(1, -1) // Remove the first and last line to remove the backticks
          .join('\n');

        if (requestId === currentRequestRef.current) {
          // You can update the state here to render the streamed data
          setCurrentSuggestion(trimmedSuggestion);
        } else {
          break;
        }
      }

      setIsLoading(false);
    },
    []
  );

  return { isLoading, streamSuggestion, currentSuggestion };
};
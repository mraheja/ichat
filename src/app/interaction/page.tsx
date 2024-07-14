'use client';

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";
import { useInteractive } from "../hooks/useInteractive";
import debounce from 'lodash/debounce';

export default function Home() {

  const { isLoading, streamSuggestion, currentSuggestion} = useInteractive();

  const [code, setCode] = useState('welcome');
  const [history, setHistory] = useState<string[]>([]);

  const updateSuggestion = async (instruction: string) => {
    await streamSuggestion(instruction);
    setHistory((history) => [instruction, ...history]);
  };

  const debouncedUpdateSuggestion = useCallback(
    debounce(updateSuggestion, 1000, { leading: true, trailing: true }),
    []
  );

  return (
    <div className="flex justify-center items-center h-screen w-full flex-col gap-y-4">
      <Card className={`p-2 w-[800px] ${isLoading ? 'border-2 border-green-500' : ''}`}>
         <pre>
          {currentSuggestion}
        </pre>
      </Card>
      <Input className="w-[800px]" type="text" placeholder="Enter instruction" onChange={(e) => debouncedUpdateSuggestion(e.target.value)} />
      <div className="w-[800px]">
        {history.map((oldInstruction, index) => (
          <p className="text-gray-300" key={oldInstruction + index}>{oldInstruction}</p>  
      ))}
      </div>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen w-full flex-col gap-y-4">
      <h1 className="text-2xl">Interactive Code Edit</h1>
      <Input className="w-[900px] h-[200px]" type="text" placeholder="Enter code you'd like to edit" />
    </div>
  );
}

import { Metadata } from "next";
import Image from "next/image";
import HomePageButtons from "@/components/layout/home/HomePageButtons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StackIcon from "tech-stack-icons";
import { Code, GitBranch, ListCheck, Plug, TrainTrack } from "lucide-react";

export const metadata: Metadata = {
  title: "Home",
};

const page = () => {
  return (
    <div>
      <div className="grid gap-4 justify-center">
        <Image
          src="/logo-text.png"
          alt="logo"
          className="w-64 md:w-96 mx-auto lg:mt-24 mix-blend-difference"
          width={500}
          height={500}
          loading="eager"
        />

        <div className="font-mono">
          Manage your portfolio&apos;s content so you don&apos;t have to :&gt;
        </div>

        <HomePageButtons />
      </div>

      <div className="flex mt-24 items-center justify-center font-mono">
        Made with 💗 by
        <Button variant="link" className="font-bold" asChild>
          <Link href="https://github.com/Michael-Gatmaitan">
            <StackIcon name="github" variant="grayscale" className="w-4 h-4" />
            Michael Gatmaitan
          </Link>
        </Button>
      </div>

      <div className="space-y-2 mt-12">
        <div className="font-bold text-2xl text-center">Made for freshers</div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="border p-2 flex rounded-sm gap-2 items-center">
            <div className="w-[40px] h-[40px] flex items-center justify-center">
              <Code />
            </div>
            <div className="text-xl font-bold">Seamless integration</div>
          </div>

          <div className="border p-2 flex rounded-sm gap-2 items-center">
            <div className="w-[40px] h-[40px] flex items-center justify-center">
              <ListCheck />
            </div>
            <div className="text-xl font-bold">Built-in Job Tracker</div>
          </div>

          <div className="border p-2 flex rounded-sm gap-2 items-center">
            <div className="w-[40px] h-[40px] flex items-center justify-center">
              <Plug />
            </div>
            <div className="text-xl font-bold">Plug and play</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

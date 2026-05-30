import { Metadata } from "next";
import Image from "next/image";
import HomePageButtons from "@/components/layout/home/HomePageButtons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StackIcon from "tech-stack-icons";

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
          className="w-64 md:w-96 mx-auto lg:mt-24"
          width={500}
          height={500}
        />

        <div className="font-mono">
          Manage your portfolio's content so you don't have to :&gt;
        </div>

        <HomePageButtons />
      </div>

      <div className="flex mt-24 items-center justify-center font-mono">
        Made with 💗 by
        <Button variant="link" className="font-bold" asChild>
          <Link href="https://github.com/Michael-Gatmaitan">
            <StackIcon name="github" variant="dark" className="w-4 h-4" />
            Michael Gatmaitan
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default page;

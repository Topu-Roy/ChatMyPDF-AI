import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col justify-center items-center text-center">
        <div className="mx-auto mb-4 flex justify-center items-center space-x-2 overflow-hidden max-w-fit rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all duration-200 hover:border-gray-300 hover:bg-white/50">
          <p className="text-sm font-semibold text-gray-700">
            ChatMyPDF is now public!
          </p>
        </div>

        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Chat with your <span className="text-blue-600">PDF Docs</span> with
          AI.
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
          ChatMyPDF is a AI powered virtual assistant that allows you to have
          conversations with your PDF documents. Simply upload your PDF and
          start asking and get answers based on the PDF uploaded.
        </p>

        <Link
          href={"/dashboard"}
          target="_blank"
          className={buttonVariants({
            size: "lg",
            className: "mt-5 h-14",
          })}
        >
          Get started for free
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </MaxWidthWrapper>

      {/* Decoration */}
      <div area-hidden="true">
        <div className="relative isolate">
          <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 overflow-hidden transform-gpu blur-3xl sm:-top-80">
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>

          <div>
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <Image
                    src={"/dashboard-preview.jpg"}
                    height={866}
                    width={1364}
                    quality={100}
                    alt="Product Preview"
                    className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

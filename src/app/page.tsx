import Image from "next/image";
import Link from "next/link";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import {
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-28 flex flex-col items-center justify-center text-center sm:mt-40">
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all duration-200 hover:border-gray-300 hover:bg-white/50">
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

        {user ? (
          <Link
            href={"/dashboard"}
            className={buttonVariants({
              size: "lg",
              className: "mt-5 h-14",
            })}
          >
            <span>Dashboard</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        ) : (
          <RegisterLink
            className={buttonVariants({
              size: "lg",
              className: "mt-5 h-14",
            })}
          >
            <span>Try It For Free</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </RegisterLink>
        )}
      </MaxWidthWrapper>

      {/* Product Image */}
      <div>
        <div className="relative isolate">
          {/* Background Gradient */}
          <div
            area-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
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
                    className="rounded-lg bg-white p-2 shadow-2xl ring-1 ring-gray-900/10 sm:p-8 md:p-20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Background Gradient */}
          <div
            area-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(95%-1rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-90 bg-gradient-to-tr from-[#80ffc2] to-[#81e673] opacity-30 sm:left-[calc(95%-5rem)] sm:w-[72.1875rem] sm:rotate-[0deg]"
            />
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="mx-auto mb-32 mt-36 max-w-5xl sm:mt-36">
        <div className="mb-8 px-6 sm:mb-12 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">
              Start chatting in minutes.
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Chatting based on your PDF are never been more easily with
              ChatMyPDF.
            </p>
          </div>
        </div>

        {/* Steps */}
        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 1</span>
              <span className="text-xl font-semibold">
                Sign up for an account
              </span>
              <span className="mt-2 text-zinc-700">
                Start for free or{" "}
                <Link
                  href={"/pricing"}
                  className="text-blue-700 underline underline-offset-2"
                >
                  upgrade to pro
                </Link>{" "}
                for premium treatment.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 2</span>
              <span className="text-xl font-semibold">
                Upload your PDF file
              </span>
              <span className="mt-2 text-zinc-700">
                we&apos;ll process your PDF file and make it ready to chat.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 3</span>
              <span className="text-xl font-semibold">
                Start asking questions
              </span>
              <span className="mt-2 text-zinc-700">
                It&apos;s that simple, Try out ChatMyPDF now. Just few clicks
                and you are all set.
              </span>
            </div>
          </li>
        </ol>

        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src={"/file-upload-preview.jpg"}
                width={1400}
                height={720}
                quality={100}
                alt="Product Preview"
                className="rounded-lg bg-white p-2 shadow-2xl ring-1 ring-gray-900/10 sm:p-8 md:p-20"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

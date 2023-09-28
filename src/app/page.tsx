import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function Home() {
  return (
    <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col justify-center items-center text-center">
      <div
        className="mx-auto mb-4 flex justify-center items-center space-x-2 overflow-hidden max-w-fit rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all duration-200 hover:border-gray-300 hover:bg-white/50"
      >
        <p className="text-sm font-semibold text-gray-700">ChatMyPDF is now public!</p>
      </div>
    </MaxWidthWrapper>
  );
}

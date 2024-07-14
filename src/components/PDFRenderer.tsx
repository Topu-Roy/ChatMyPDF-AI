"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "react-pdf/dist/Page/TextLayer.css";
import PDFFullScreen from "./PDFFullScreen";

import { useState } from "react";
import SimpleBar from "simplebar-react";
import { useForm } from "react-hook-form";
import { useResizeDetector } from "react-resize-detector";

import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCcw,
  RotateCw,
  Search,
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

//* PDF worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.min.mjs`;
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function PDFRenderer({ url }: { url: string }) {
  //* States for PDF Controls and navigation
  const [numberOfPagesInPDF, setNumberOfPagesInPDF] = useState<number>();
  const [currentPageOfPDF, setCurrentPageOfPDF] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedZoom, setRenderedZoom] = useState<number | null>(null);

  const isLoading = renderedZoom !== zoom;

  //* Utilities for better experience
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  //* React Hook Forms for PDF pages Input field
  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numberOfPagesInPDF!),
  });

  type CustomPageValidationType = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CustomPageValidationType>({
    defaultValues: {
      page: currentPageOfPDF.toString(),
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const handlePageSubmit = ({ page }: CustomPageValidationType) => {
    setCurrentPageOfPDF(Number(page));
    setValue("page", String(page));
  };

  return (
    <div className="flex w-full flex-col items-center rounded-md bg-white shadow">
      <div className="flex h-14 w-full items-center justify-between border-b border-zinc-200 px-2">
        <div className="flex w-full items-center justify-between gap-1.5">
          <div className="flex items-center justify-center">
            <Button
              disabled={
                numberOfPagesInPDF === undefined || currentPageOfPDF === 1
              }
              onClick={() => {
                setCurrentPageOfPDF((prev) => (prev === 1 ? 1 : prev - 1));
                setValue(
                  "page",
                  String(currentPageOfPDF === 1 ? 1 : currentPageOfPDF - 1),
                );
              }}
              variant={"ghost"}
              aria-label="Previous page"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1.5">
              <Input
                {...register("page")}
                className={cn(
                  "h-8 w-12",
                  errors.page && "focus-visible:ring-red-500",
                )}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    void handleSubmit(handlePageSubmit)();
                  }
                }}
              />
              <p className="space-x-1 text-sm text-zinc-700">
                <span>/</span>
                <span>{numberOfPagesInPDF ?? "x"}</span>
              </p>
            </div>

            <Button
              disabled={
                numberOfPagesInPDF === undefined ||
                currentPageOfPDF === numberOfPagesInPDF
              }
              onClick={() => {
                setCurrentPageOfPDF((prev) =>
                  prev === numberOfPagesInPDF ? numberOfPagesInPDF : prev + 1,
                );
                setValue(
                  "page",
                  String(
                    currentPageOfPDF === numberOfPagesInPDF
                      ? numberOfPagesInPDF
                      : currentPageOfPDF + 1,
                  ),
                );
              }}
              variant={"ghost"}
              aria-label="Previous page"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-1.5" aria-label="zoom" variant={"ghost"}>
                  <Search className="h-4 w-4" />
                  {zoom * 100}%
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setZoom(1)}>
                  100%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setZoom(1.5)}>
                  150%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setZoom(2)}>
                  200%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setZoom(2.5)}>
                  250%
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant={"ghost"}
              aria-label="Rotate Right"
              onClick={() => setRotation((prev) => prev + 90)}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant={"ghost"}
              aria-label="Rotate Left"
              onClick={() => setRotation((prev) => prev - 90)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <PDFFullScreen url={url} />
          </div>
        </div>
      </div>

      <div className="flex max-h-screen w-full">
        <SimpleBar
          autoHide={false}
          className="max-h-[calc(100vh-10rem)] w-full"
        >
          <div ref={ref} className="h-full w-full">
            <Document
              file={url}
              className="max-h-full"
              loading={
                <div className="flex h-full w-full items-center justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin text-zinc-800" />
                </div>
              }
              onLoadSuccess={({ numPages }) => setNumberOfPagesInPDF(numPages)}
              onError={() =>
                toast({
                  title: "Couldn't get the file",
                  description: "Something went wrong, please try again",
                })
              }
            >
              {isLoading && renderedZoom ? (
                <Page
                  width={width ? width : 1}
                  pageNumber={currentPageOfPDF}
                  scale={zoom}
                  rotate={rotation}
                  key={"@" + zoom}
                />
              ) : null}
              <Page
                className={cn("h-full w-full", isLoading ? "hidden" : "")}
                width={width ? width : 1}
                pageNumber={currentPageOfPDF}
                key={"@" + renderedZoom}
                scale={zoom}
                rotate={rotation}
                loading={
                  <div className="flex h-full w-full items-center justify-center">
                    <Loader2 className="my-24 h-6 w-6 animate-spin text-zinc-800" />
                  </div>
                }
                onRenderSuccess={() => setRenderedZoom(zoom)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}

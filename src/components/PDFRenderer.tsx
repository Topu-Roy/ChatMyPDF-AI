'use client'

//* React PDF
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useState } from 'react';
import { useForm } from 'react-hook-form'

import { useResizeDetector } from 'react-resize-detector';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { z } from 'zod';

//* PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

type PDFRendererProps = {
    url: string
}

export default function PDFRenderer({ url }: PDFRendererProps) {
    //* States for PDF pages and navigation among them
    const [numberOfPagesInPDF, setNumberOfPagesInPDF] = useState<number>()
    const [currentPageOfPDF, setCurrentPageOfPDF] = useState<number>(1)

    //* Utilities for better experience
    const { toast } = useToast()
    const { width, ref } = useResizeDetector()

    //* React Hook Forms for PDF pages Input field
    const { } = useForm<CustomPageValidatorType>({
        defaultValues: {
            page: currentPageOfPDF.toString()
        }
    })

    const CustomPageValidator = z.object({
        page: z.string().refine((num) => Number(num) > 0 && Number(num) < numberOfPagesInPDF!)
    })

    type CustomPageValidatorType = z.infer<typeof CustomPageValidator>

    return (
        <div className='w-full bg-white rounded-md shadow flex items-center flex-col'>
            <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
                <div className="flex items-center gap-1.5">
                    <Button
                        disabled={numberOfPagesInPDF === undefined || currentPageOfPDF === 1}
                        onClick={() => (
                            setCurrentPageOfPDF(prev => (
                                prev === 1 ? 1 : prev - 1
                            ))
                        )}
                        variant={'ghost'}
                        aria-label='Previous page'
                    >
                        <ChevronDown className='h-4 w-4' />
                    </Button>

                    <div className="flex items-center gap-1.5">
                        <Input className='w-12 h-8' />
                        <p className='text-zinc-700 text-sm space-x-1'>
                            <span>/</span>
                            <span>{numberOfPagesInPDF ?? 'x'}</span>
                        </p>
                    </div>

                    <Button
                        disabled={numberOfPagesInPDF === undefined || currentPageOfPDF === numberOfPagesInPDF}
                        onClick={() => (
                            setCurrentPageOfPDF(prev => (
                                prev === numberOfPagesInPDF ? numberOfPagesInPDF : prev + 1
                            ))
                        )}
                        variant={'ghost'}
                        aria-label='Previous page'
                    >
                        <ChevronUp className='h-4 w-4' />
                    </Button>
                </div>
            </div>

            <div className="flex w-full max-h-screen">
                <div ref={ref} className='h-full w-full'>
                    <Document
                        file={url}
                        className='max-h-full'
                        loading={
                            <div className='h-full w-full flex justify-center items-center'>
                                <Loader2 className='h-6 w-6 my-24 animate-spin text-zinc-800' />
                            </div>
                        }
                        onLoadSuccess={({ numPages }) => setNumberOfPagesInPDF(numPages)}
                        onError={() => (
                            toast({
                                title: "Couldn't get the file",
                                description: "Something went wrong, please try again"
                            }))
                        }
                    >
                        <Page width={width ? width : 1} pageNumber={currentPageOfPDF} />
                    </Document>
                </div>
            </div>
        </div>
    )
}

'use client'

//* React PDF
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useResizeDetector } from 'react-resize-detector';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';

//* PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

type PDFRendererProps = {
    url: string
}

export default function PDFRenderer({ url }: PDFRendererProps) {
    const [numberOfPagesInPDF, setNumberOfPagesInPDF] = useState<number>()
    const [currentPageOfPDF, setCurrentPageOfPDF] = useState<number>(1)

    const { toast } = useToast()
    const { width, ref } = useResizeDetector()

    return (
        <div className='w-full bg-white rounded-md shadow flex items-center flex-col'>
            <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
                <div className="flex items-center gap-1.5">
                    <Button
                        disabled={currentPageOfPDF <= 0}
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

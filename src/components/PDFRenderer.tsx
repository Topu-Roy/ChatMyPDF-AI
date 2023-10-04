'use client'

import { Loader2 } from 'lucide-react';
import { useToast } from './ui/use-toast';

//* React PDF
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

//* PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

type PDFRendererProps = {
    url: string
}

export default function PDFRenderer({ url }: PDFRendererProps) {

    const { toast } = useToast()

    return (
        <div className='w-full bg-white rounded-md shadow flex items-center flex-col'>
            <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
                <div className="flex items-center gap-1.5">
                    Top Bar
                </div>
            </div>

            <div className="flex w-full max-h-screen">
                <div className='h-full w-full'>
                    <Document
                        file={url}
                        className='max-h-full'
                        loading={
                            <div className='h-full w-full flex justify-center items-center'>
                                <Loader2 className='h-6 w-6 my-24 animate-spin text-zinc-800' />
                            </div>
                        }
                        onError={() => (
                            toast({
                                title: "Couldn't get the file",
                                description: "Something went wrong, please try again"
                            }))

                        }
                    >
                        <Page pageNumber={1} />
                    </Document>
                </div>
            </div>
        </div>
    )
}

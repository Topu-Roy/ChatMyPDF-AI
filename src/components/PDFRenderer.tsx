'use client'

// React PDF
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

type PDFRendererProps = {
    url: string
}

export default function PDFRenderer({ url }: PDFRendererProps) {
    return (
        <div className='w-full bg-white rounded-md shadow flex items-center flex-col'>
            <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
                <div className="flex items-center gap-1.5">
                    Top Bar
                </div>
            </div>

            <div className="flex w-full max-h-screen">
                <div>
                    <Document file={url}>

                    </Document>
                </div>
            </div>
        </div>
    )
}

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { ExpandIcon, Loader2 } from 'lucide-react'
import SimpleBar from 'simplebar-react'
import { Document, Page } from 'react-pdf'
import { useResizeDetector } from 'react-resize-detector'
import { useToast } from './ui/use-toast'

type Props = {
    url: string
}

export default function PDFFullScreen({ url }: Props) {
    //* States for PDF Controls and navigation
    const [numberOfPagesInPDF, setNumberOfPagesInPDF] = useState<number>()
    const [currentPageOfPDF, setCurrentPageOfPDF] = useState<number>(1)
    const [zoom, setZoom] = useState<number>(1)
    const [rotation, setRotation] = useState<number>(0)

    //* Utilities for better experience
    const { toast } = useToast()
    const { width, ref } = useResizeDetector()


    const [isOpen, setIsOpen] = useState(false)


    return (
        <Dialog
            open={isOpen}
            onOpenChange={(v) => !v && setIsOpen(v)}
        >
            <DialogTrigger asChild>
                <Button variant={'ghost'} aria-label='Fullscreen PDF' className='gap-1.5'>
                    <ExpandIcon className='h-4 w-4' />
                </Button>
            </DialogTrigger>

            <DialogContent className='max-w-7xl w-full'>
                <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)]'>
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
                            {new Array(numberOfPagesInPDF).fill(0).map((_, i) => (
                                <Page
                                    key={i}
                                    width={width ? width : 1}
                                    pageNumber={i + 1}
                                />
                            ))}
                        </Document>
                    </div>
                </SimpleBar>
            </DialogContent>
        </Dialog>
    )
}
'use client'

//* React PDF
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useState } from 'react';
import { useForm } from 'react-hook-form'

import { useResizeDetector } from 'react-resize-detector';
import { ChevronDown, ChevronUp, Loader2, RotateCcw, RotateCw, Search } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import SimpleBar from 'simplebar-react'
//* PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

type PDFRendererProps = {
    url: string
}

export default function PDFRenderer({ url }: PDFRendererProps) {
    //* States for PDF Controls and navigation
    const [numberOfPagesInPDF, setNumberOfPagesInPDF] = useState<number>()
    const [currentPageOfPDF, setCurrentPageOfPDF] = useState<number>(1)
    const [zoom, setZoom] = useState<number>(1)
    const [rotation, setRotation] = useState<number>(0)

    //* Utilities for better experience
    const { toast } = useToast()
    const { width, ref } = useResizeDetector()

    //* React Hook Forms for PDF pages Input field
    const CustomPageValidator = z.object({
        page: z.string().refine((num) => Number(num) > 0 && Number(num) < numberOfPagesInPDF!)
    })

    type CustomPageValidationType = z.infer<typeof CustomPageValidator>

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<CustomPageValidationType>({
        defaultValues: {
            page: currentPageOfPDF.toString()
        },
        resolver: zodResolver(CustomPageValidator)
    })

    const handlePageSubmit = ({ page }: CustomPageValidationType) => {
        setCurrentPageOfPDF(Number(page))
        setValue("page", String(page))
    }

    return (
        <div className='w-full bg-white rounded-md shadow flex items-center flex-col'>
            <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
                <div className="flex w-full justify-between items-center gap-1.5">
                    <div className="flex justify-center items-center">
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
                            <Input
                                {...register('page')}
                                className={cn('w-12 h-8', errors.page && 'focus-visible:ring-red-500')}
                                onKeyDown={(e) => {
                                    if (e.code === "Enter") {
                                        handleSubmit(handlePageSubmit)()
                                    }
                                }}
                            />
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

                    <div className="flex justify-center items-center gap-1.5">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className='gap-1.5'
                                    aria-label='zoom'
                                    variant={'ghost'}
                                >
                                    <Search className='h-4 w-4' />
                                    {zoom * 100}%
                                    <ChevronDown className='h-3 w-3 opacity-70' />
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
                            variant={'ghost'}
                            aria-label='Rotate Right'
                            onClick={() => setRotation(prev => prev + 90)}
                        >
                            <RotateCw className='h-4 w-4' />
                        </Button>
                        <Button
                            variant={'ghost'}
                            aria-label='Rotate Left'
                            onClick={() => setRotation(prev => prev - 90)}
                        >
                            <RotateCcw className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex w-full max-h-screen">
                <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)] w-full'>
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
                            <Page
                                width={width ? width : 1}
                                pageNumber={currentPageOfPDF}
                                scale={zoom}
                                rotate={rotation}
                            />
                        </Document>
                    </div>
                </SimpleBar>
            </div>
        </div>
    )
}

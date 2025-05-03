'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Download, FileText, Maximize, Minimize } from 'lucide-react'
// Removed Header and Footer imports as they are handled by layout.tsx

// Define slide file names directly for now
const slideFiles = [
  'Slide_1.html', 'Slide_2.html', 'Slide_3.html', 'Slide_4.html', 'Slide_5.html',
  'Slide_6.html', 'Slide_7.html', 'Slide_8.html', 'Slide_9.html', 'Slide_10.html',
  'Slide_11.html', 'Slide_12.html', 'Slide_13.html', 'Slide_14.html', 'Slide_15.html', 'Slide_16.html'
]

export default function PresentationPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const totalSlides = slideFiles.length

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlideIndex(index)
    }
  }

  const goToPrevSlide = () => {
    goToSlide(currentSlideIndex - 1)
  }

  const goToNextSlide = () => {
    goToSlide(currentSlideIndex + 1)
  }

  const handleSelectChange = (value: string) => {
    goToSlide(parseInt(value, 10))
  }

  const toggleFullscreen = () => {
    const iframe = iframeRef.current
    if (!iframe) return

    if (!isFullscreen) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen()
      } else if ((iframe as any).webkitRequestFullscreen) {
        (iframe as any).webkitRequestFullscreen()
      } else if ((iframe as any).msRequestFullscreen) {
        (iframe as any).msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen()
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen()
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreen) {
        if (event.key === 'ArrowLeft') {
          goToPrevSlide()
        } else if (event.key === 'ArrowRight') {
          goToNextSlide()
        }
      } else {
        if (event.key === 'ArrowLeft') {
          goToPrevSlide()
        } else if (event.key === 'ArrowRight') {
          goToNextSlide()
        }
      }
      if (event.key === 'Escape' && isFullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen()
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement ||
                                (document as any).webkitFullscreenElement ||
                                (document as any).msFullscreenElement;
      setIsFullscreen(fullscreenElement === iframeRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
    }
  }, [currentSlideIndex, isFullscreen, goToPrevSlide, goToNextSlide])

  const currentSlideSrc = `/ppt_go/${slideFiles[currentSlideIndex]}`

  return (
    <div className="flex flex-col min-h-screen">
      <main className={`flex-grow px-4 py-8 flex flex-col items-center`}>
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">최종 발표 초안</h1>
        <div className={`w-full bg-white p-4 rounded-lg shadow-md`}>
          <div className={`relative aspect-video`}>
            <iframe
              ref={iframeRef}
              src={currentSlideSrc}
              title={`Slide ${currentSlideIndex + 1}`}
              className={`${isFullscreen
                ? 'fixed inset-0 w-screen h-screen z-[9999] bg-white'
                : 'absolute top-0 left-0 w-full h-full border-0 rounded'
              }`}
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={goToPrevSlide}
            disabled={currentSlideIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> 이전
          </Button>
          <div className="flex items-center space-x-2">
            <Select
              value={currentSlideIndex.toString()}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className="w-[80px] h-9">
                <SelectValue placeholder="페이지" />
              </SelectTrigger>
              <SelectContent>
                {slideFiles.map((_, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {index + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            onClick={goToNextSlide}
            disabled={currentSlideIndex === totalSlides - 1}
          >
            다음 <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </main>

      <button
        onClick={toggleFullscreen}
        className="fixed bottom-40 right-8 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50 flex items-center justify-center"
        aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
      </button>

      <a
        href=""
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-8 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50 flex items-center justify-center"
        aria-label="View Document"
      >
        <FileText className="h-6 w-6" />
      </a>
      <a
        href=""
        download="PPT_Mid3.pdf"
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 flex items-center justify-center"
        aria-label="Download Presentation PDF"
      >
        <Download className="h-6 w-6" />
      </a>
    </div>
  )
} 
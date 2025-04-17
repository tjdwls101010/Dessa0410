'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react'
// Removed Header and Footer imports as they are handled by layout.tsx

// Define slide file names directly for now
const slideFiles = [
  'Slide_1.html', 'Slide_2.html', 'Slide_3.html', 'Slide_4.html', 'Slide_5.html',
  'Slide_6.html', 'Slide_7.html', 'Slide_8.html', 'Slide_9.html', 'Slide_10.html',
  'Slide_11.html'
]

export default function PresentationPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
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

  // Add keyboard navigation effect
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevSlide()
      } else if (event.key === 'ArrowRight') {
        goToNextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [goToPrevSlide, goToNextSlide]) // Add dependencies

  const currentSlideSrc = `/ppt_mid/${slideFiles[currentSlideIndex]}` // Updated path

  return (
    // Removed bg-gray-100 from the outer div
    <div className="flex flex-col min-h-screen">
      {/* Removed Header component */}
      {/* Removed container mx-auto to allow full width, kept py-8 */}
      <main className="flex-grow px-4 py-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">중간 발표 자료</h1>
        {/* Kept w-full, removed max-width */}
        <div className="w-full bg-white p-4 rounded-lg shadow-md">
          {/* Applying aspect-video for 16:9 ratio */}
          <div className="relative aspect-video"> {/* Removed inline style, added aspect-video */}
            <iframe
              src={currentSlideSrc}
              title={`Slide ${currentSlideIndex + 1}`}
              className="absolute top-0 left-0 w-full h-full border-0 rounded" // Keep absolute positioning
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
            />
            {/* Navigation Arrows removed */}
          </div>
        </div>

        {/* Slide Navigation Controls */}
        <div className="mt-6 flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={goToPrevSlide}
            disabled={currentSlideIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> 이전
          </Button>
          <div className="flex items-center space-x-2">
            {/* Page indicator removed */}
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
      {/* New Document Link Button */}
      <a
        href="https://docs.google.com/document/d/1WIauCjRwEHpLeGNAPeuftQDwKext_E-2B3TWtG9vqOk/edit?tab=t.0#heading=h.y8ngtyfkpp0h"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-8 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50 flex items-center justify-center"
        aria-label="View Document"
      >
        <FileText className="h-6 w-6" />
      </a>
      {/* Floating Download Button */}
      <a
        href="/ppt_mid/PPT_Mid.pdf"
        download="PPT_Mid.pdf"
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 flex items-center justify-center"
        aria-label="Download Presentation PDF"
      >
        <Download className="h-6 w-6" />
      </a>
      {/* Removed Footer component */}
    </div>
  )
}

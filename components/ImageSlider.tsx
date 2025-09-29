import React, { useState } from 'react';

interface ImageSliderProps {
  beforeSrc: string;
  afterSrc: string;
}

const SliderIcon: React.FC = () => (
    <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
    </svg>
);


export const ImageSlider: React.FC<ImageSliderProps> = ({ beforeSrc, afterSrc }) => {
    const [sliderPosition, setSliderPosition] = useState(50);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSliderPosition(Number(e.target.value));
    };

    return (
        <div 
            className="relative w-full max-w-full max-h-[70vh] aspect-[4/3] select-none overflow-hidden rounded-lg group"
        >
            {/* After Image */}
            <img 
                src={afterSrc} 
                alt="Upscaled" 
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                draggable={false}
            />
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded z-10">AFTER</div>

            {/* Before Image (clipped) */}
            <div 
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`}}
            >
                <img 
                    src={beforeSrc} 
                    alt="Original" 
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    draggable={false}
                />
                 <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded z-10">BEFORE</div>
            </div>

            {/* Slider Handle Visual */}
            <div 
                className="absolute top-0 bottom-0 w-1 bg-white/75 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
            >
                <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                    <SliderIcon />
                </div>
            </div>

            {/* Input Slider Control */}
            <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={handleSliderChange}
                aria-label="Image comparison slider"
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />
        </div>
    );
};
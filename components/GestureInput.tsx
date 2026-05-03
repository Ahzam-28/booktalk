'use client';

import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, GestureRecognizer, GestureRecognizerResult } from '@mediapipe/tasks-vision';
import Webcam from 'react-webcam';
import { Camera, CameraOff, Hand, Loader2 } from 'lucide-react';

interface GestureInputProps {
    onSendMessage: (message: string) => void;
    isDisabled?: boolean;
}

export default function GestureInput({ onSendMessage, isDisabled = false }: GestureInputProps) {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [recognizer, setRecognizer] = useState<GestureRecognizer | null>(null);
    const [isWebcamActive, setIsWebcamActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lastGesture, setLastGesture] = useState<string>('');
    const [lastSendTime, setLastSendTime] = useState<number>(0);
    const requestRef = useRef<number>();

    // Mapping recognized MediaPipe gestures to text commands
    const gestureMap: Record<string, string> = {
        'Thumb_Up': 'Yes / I agree',
        'Thumb_Down': 'No / I disagree',
        'Open_Palm': 'Stop / Wait',
        'Closed_Fist': 'Ready / Next',
        'Victory': 'Peace / Hello',
        'Pointing_Up': 'Look at this / Select',
        'ILoveYou': 'I love this'
    };

    useEffect(() => {
        async function loadGestureRecognizer() {
            // Temporarily suppress annoying Mediapipe XNNPACK initialization console errors
            const originalConsoleError = console.error;
            console.error = (...args: any[]) => {
                if (typeof args[0] === 'string' && args[0].includes('TensorFlow Lite XNNPACK delegate')) return;
                originalConsoleError(...args);
            };

            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.x/wasm"
                );
                const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 1
                });
                setRecognizer(gestureRecognizer);
            } catch (error) {
                originalConsoleError("Error loading gesture recognizer:", error);
            } finally {
                // Restore original console.error once initialization is done
                console.error = originalConsoleError;
            }
        }
        loadGestureRecognizer();

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            recognizer?.close();
        };
    }, []);

    const toggleWebcam = () => {
        if (!isWebcamActive) {
            setIsLoading(true);
            setIsWebcamActive(true);
        } else {
            setIsWebcamActive(false);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            setLastGesture('');
        }
    };

    const predictWebcam = () => {
        if (!recognizer || !webcamRef.current || !webcamRef.current.video || !canvasRef.current) return;
        
        const video = webcamRef.current.video;
        if (video.readyState !== 4) {
            requestRef.current = requestAnimationFrame(predictWebcam);
            return;
        }
        
        setIsLoading(false);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        let results: GestureRecognizerResult | null = null;
        let startTimeMs = performance.now();
        
        // Suppress MediaPipe's internal console.error for XNNPACK
        const originalConsoleError = console.error;
        console.error = (...args: any[]) => {
            if (typeof args[0] === 'string' && args[0].includes('TensorFlow Lite XNNPACK delegate')) return;
             // MediaPipe can sometimes throw other irrelevant internal WebGL errors too, but we mainly want to catch XNNPACK
            originalConsoleError.apply(console, args);
        };
        
        try {
            // Send to MediaPipe
            results = recognizer.recognizeForVideo(video, startTimeMs);
        } finally {
            console.error = originalConsoleError;
        }

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (results.gestures.length > 0) {
            const categoryName = results.gestures[0][0].categoryName;
            const categoryScore = results.gestures[0][0].score;
            
            // Draw Hand landmarks
            if (results.landmarks) {
                for (const landmarks of results.landmarks) {
                    // Just draw tiny dots for landmarks to show tracking is working
                    ctx.fillStyle = '#22c55e'; // green-500
                    for (const landmark of landmarks) {
                        ctx.beginPath();
                        ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 4, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                }
            }

            // Only trigger if confidence is high and we haven't sent the same gesture recently
            if (categoryName !== 'None' && categoryScore > 0.70) {
                const command = gestureMap[categoryName] || categoryName;
                setLastGesture(command);

                const now = Date.now();
                // Debounce sending to Vapi (e.g., 3 seconds between actions)
                if (now - lastSendTime > 3000) {
                    // console.log("Sending gesture command:", command);
                    onSendMessage(`[Gesture Recognized]: ${command}`);
                    setLastSendTime(now);
                }
            }
        } else {
             setLastGesture('');
        }
        
        ctx.restore();
        
        if (isWebcamActive) {
            requestRef.current = requestAnimationFrame(predictWebcam);
        }
    };

    return (
        <div className="w-full flex flex-col gap-4 p-4 rounded-xl border border-[#e8ecf4] bg-white/50 backdrop-blur-sm">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-[#212a3b] flex items-center gap-2">
                        <Hand className="w-5 h-5" /> Sign Language / Gesture Mode
                    </h3>
                    <p className="text-sm text-[#3d485e]">Perform hand gestures in front of your camera to communicate.</p>
                </div>
                
                <button
                    onClick={toggleWebcam}
                    disabled={isDisabled || !recognizer}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isWebcamActive 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                            : 'bg-primary text-white hover:bg-primary/90'
                    } disabled:opacity-50`}
                >
                    {!recognizer && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isWebcamActive ? (
                        <><CameraOff className="w-4 h-4" /> Stop Camera</>
                    ) : (
                        <><Camera className="w-4 h-4" /> Start Camera</>
                    )}
                </button>
            </div>

            {isWebcamActive && (
                <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 text-white flex-col gap-2">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <p>Starting Camera...</p>
                        </div>
                    )}
                    
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "user" }}
                        className="absolute w-full h-full object-cover transform -scale-x-100"
                        onUserMedia={predictWebcam}
                    />
                    
                    {/* Canvas for rendering hand landmarks correctly over the mirrored video */}
                    <canvas
                        ref={canvasRef}
                        className="absolute w-full h-full object-cover transform -scale-x-100 z-10 pointer-events-none"
                    />

                    {lastGesture && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                            <div className="bg-black/70 backdrop-blur-sm text-white px-6 py-3 rounded-full text-lg font-medium tracking-wide animate-in fade-in slide-in-from-bottom-4">
                                {lastGesture}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
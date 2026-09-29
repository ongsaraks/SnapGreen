import React, { useState, useRef, useEffect } from 'react';
import { Power, Camera, Upload, AlertCircle, Loader2 } from 'lucide-react';
import BoundingBoxOverlay from './BoundingBoxOverlay';
import ClaimPointsCard from './ClaimPointsCard';
import { detectTrash, claimPoints } from '../services/api';

export default function ScanView({
  studentId,
  onLogout,
  onPointsClaimed,
}) {
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');
  const [scanError, setScanError] = useState('');

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize camera stream
  useEffect(() => {
    let currentStream = null;

    async function startCamera() {
      try {
        const constraints = {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setCameraActive(true);
        setCameraError('');
      } catch (err) {
        console.warn('Camera access error:', err);
        setCameraActive(false);
        setCameraError('ไม่สามารถเปิดกล้องได้ (สามารถเลือกรูปจากเครื่องได้)');
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Update video element when stream is ready
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, capturedImage]);

  // Capture photo from video stream
  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        setCapturedBlob(blob);
        analyzeImage(blob);
      },
      'image/jpeg',
      0.85
    );
  };

  // Handle local image file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setCapturedImage(imageUrl);
    setCapturedBlob(file);
    analyzeImage(file);
  };

  // Send image to Roboflow detection API
  const analyzeImage = async (imageBlob) => {
    setIsAnalyzing(true);
    setDetectionResult(null);
    setClaimSuccessMsg('');
    setScanError('');
    try {
      const data = await detectTrash(imageBlob, studentId);
      setDetectionResult(data);
    } catch (err) {
      console.error('Scan error:', err);
      setScanError(err.message || 'เกิดข้อผิดพลาดในการตรวจสอบภาพ');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Confirm and claim points ("รับแต้ม")
  const handleClaim = async () => {
    if (!detectionResult) return;
    setIsClaiming(true);
    try {
      const res = await claimPoints({
        studentId: studentId,
        imageHash: detectionResult.image_hash,
        items: detectionResult.predictions,
        totalCredits: detectionResult.total_credits,
        location: 'อาคาร ICT ชั้น 1',
      });

      setClaimSuccessMsg(`รับสำเร็จ +${detectionResult.total_credits} Credits!`);
      if (onPointsClaimed) {
        onPointsClaimed(res);
      }

      // Reset after 1.5 seconds
      setTimeout(() => {
        handleRetake();
      }, 1500);
    } catch (err) {
      alert(err.message || 'เกิดข้อผิดพลาดในการรับแต้ม');
    } finally {
      setIsClaiming(false);
    }
  };

  // Reset to live camera
  const handleRetake = () => {
    setCapturedImage(null);
    setCapturedBlob(null);
    setDetectionResult(null);
    setClaimSuccessMsg('');
    setScanError('');
  };

  return (
    <div className="flex-1 flex flex-col pb-20 tab-content-enter overflow-y-auto no-scrollbar relative bg-[#F4F5EE]">
      {/* Top Brown Header with Student ID */}
      <div className="bg-[#5C4B3C] text-white pt-10 pb-5 px-5 rounded-b-3xl shadow-md z-30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold tracking-wide text-[#E2DACF]">
            {studentId || '67XXXXX'}
          </span>
          <button
            onClick={onLogout}
            title="ออกจากระบบ"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all"
          >
            <Power size={15} className="text-[#E2DACF]" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Camera size={18} className="text-[#B8E348]" />
          <h2 className="text-base font-bold text-white tracking-wide">
            AI Smart Scanner
          </h2>
        </div>
      </div>

      {/* Camera Instructions Hint */}
      <div className="px-6 py-3 text-center">
        <p className="text-xs text-[#7A6B5D] leading-relaxed">
          จ่อกล้องให้เห็นขยะทุกชิ้น แล้วแตะปุ่มถ่าย<br />
          ระบบตรวจได้หลายชิ้นในภาพเดียว
        </p>
      </div>

      {/* Main Viewfinder Box */}
      <div className="px-5 flex-1 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-[340px] aspect-square rounded-3xl bg-[#1C1F26] overflow-hidden shadow-xl border-2 border-[#383028] flex items-center justify-center">
          {/* Live Camera Stream or Captured Photo */}
          {!capturedImage ? (
            cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="p-6 text-center text-[#9E9082]">
                <Camera size={44} className="mx-auto mb-3 opacity-40" />
                <p className="text-xs">{cameraError || 'กำลังเริ่มการทำงานของกล้อง...'}</p>
              </div>
            )
          ) : (
            <img
              src={capturedImage}
              alt="Captured trash"
              className="w-full h-full object-cover"
            />
          )}

          {/* Target Viewfinder Corner Brackets (Figma style) */}
          <div className="absolute inset-4 pointer-events-none z-10">
            {/* Top-Left */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/80 rounded-tl-xl" />
            {/* Top-Right */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/80 rounded-tr-xl" />
            {/* Bottom-Left */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/80 rounded-bl-xl" />
            {/* Bottom-Right */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/80 rounded-br-xl" />
          </div>

          {/* Dynamic Bounding Box Overlay */}
          {detectionResult?.predictions && (
            <BoundingBoxOverlay predictions={detectionResult.predictions} />
          )}

          {/* Analyzing Spinner Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white z-30">
              <Loader2 className="animate-spin text-[#B8E348] mb-2" size={36} />
              <span className="text-xs font-semibold tracking-wide">
                กำลังวิเคราะห์ประเภทขยะด้วย AI...
              </span>
            </div>
          )}

          {/* Success toast inside viewfinder */}
          {claimSuccessMsg && (
            <div className="absolute inset-0 bg-[#3B4515]/90 flex flex-col items-center justify-center text-white z-40 animate-in fade-in">
              <span className="text-2xl mb-1">🎉</span>
              <span className="text-sm font-bold">{claimSuccessMsg}</span>
            </div>
          )}

          {/* Error toast inside viewfinder */}
          {scanError && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-40 p-4 text-center animate-in fade-in">
              <AlertCircle className="text-red-400 mb-2" size={32} />
              <span className="text-xs font-semibold text-red-200 mb-4 px-2 leading-relaxed">
                {scanError}
              </span>
              <button
                onClick={handleRetake}
                className="px-4 py-2 bg-[#B8E348] text-[#2F3C0D] hover:bg-[#A8D338] rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md"
              >
                ถ่ายใหม่ / ลองอีกครั้ง
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Area: Shutter Button or ClaimPoints Bottom Sheet */}
      <div className="mt-4">
        {!detectionResult ? (
          <div className="pb-8 pt-2 flex items-center justify-center space-x-6">
            {/* Upload File Fallback Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              title="เลือกรูปจากเครื่อง"
              className="w-12 h-12 rounded-full bg-white text-[#5C4B3C] shadow-md flex items-center justify-center hover:bg-[#F0F0E8] active:scale-95 transition-all"
            >
              <Upload size={18} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Figma Shutter Button: White Circle with Thick Lime Border */}
            <button
              onClick={handleCapture}
              disabled={isAnalyzing}
              className="w-20 h-20 rounded-full bg-white border-[6px] border-[#B8E348] shadow-lg active:scale-90 hover:brightness-105 transition-all flex items-center justify-center"
            >
              <div className="w-13 h-13 rounded-full bg-[#B8E348]/20" />
            </button>

            {/* Spacer for symmetry */}
            <div className="w-12" />
          </div>
        ) : (
          <ClaimPointsCard
            predictions={detectionResult.predictions}
            totalCredits={detectionResult.total_credits}
            onClaim={handleClaim}
            onRetake={handleRetake}
            isClaiming={isClaiming}
          />
        )}
      </div>
    </div>
  );
}

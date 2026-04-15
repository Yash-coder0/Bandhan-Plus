import { useState, useRef, useEffect } from 'react';
import { Video, Square, Upload, RefreshCw, CheckCircle, Trash2 } from 'lucide-react';
import API from '../api/axios';

const VideoRecorder = ({ existingVideo, onUploadSuccess, onDelete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [videoBlob, setVideoBlob] = useState(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(existingVideo ? 'success' : 'idle'); 
  
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const liveVideoRef = useRef(null);
  const chunksRef = useRef([]);

  // API Base resolution
  const apiBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

  useEffect(() => {
    // Reset or update external prop changes
    if (existingVideo && !videoBlob) {
      setUploadStatus('success');
    } else if (!existingVideo && !videoBlob && uploadStatus === 'success') {
      setUploadStatus('idle');
    }
  }, [existingVideo, videoBlob]);

  useEffect(() => {
    if (isRecording) {
      if (timeLeft > 0) {
        timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      } else {
        stopRecording();
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [isRecording, timeLeft]);

  const startRecording = async () => {
    try {
      setVideoBlob(null);
      setRecordedVideoUrl(null);
      setUploadStatus('idle');
      setTimeLeft(30);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        setRecordedVideoUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing media devices.", err);
      alert("Microphone or camera access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearTimeout(timerRef.current);
  };

  const handleUpload = async () => {
    if (!videoBlob) return;
    setUploadStatus('uploading');
    
    const formData = new FormData();
    formData.append('video', videoBlob, 'intro.webm');

    try {
      const { data } = await API.post('/profile/upload-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus('success');
      if (onUploadSuccess) onUploadSuccess(data.videoIntro);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus('idle');
      alert("Upload failed. Try again.");
    }
  };

  // Determine video source
  let videoSrc = null;
  if (videoBlob && recordedVideoUrl) {
    videoSrc = recordedVideoUrl;
  } else if (existingVideo) {
    videoSrc = `${apiBase}/uploads/${existingVideo}`;
  }

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 30) * circumference;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-rose-100 p-2 rounded-xl text-rose-600">
            <Video size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">30-Second Video Introduction</h2>
        </div>
        {!isRecording && existingVideo && uploadStatus === 'success' && (
           <button 
             onClick={onDelete} 
             className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-xl transition-colors hover:bg-red-100 flex items-center gap-1 font-semibold text-sm"
             title="Delete Intro"
           >
             <Trash2 size={16} /> Delete
           </button>
        )}
      </div>
      
      <p className="text-gray-500 italic text-sm mb-5 text-left ml-2 md:ml-12">
        Stand out from the crowd — let your personality shine in 30 seconds!
      </p>

      {/* Video Preview Box (16:9) */}
      <div className="relative w-full md:w-3/4 mx-auto aspect-video bg-gray-900 rounded-xl overflow-hidden mb-5 flex items-center justify-center shadow-inner">
        
        {isRecording ? (
          <>
            <video 
              ref={liveVideoRef}
              autoPlay 
              muted 
              playsInline 
              className="w-full h-full object-cover"
            />
            
            <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-lg z-10">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              REC {timeLeft}s
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="relative flex items-center justify-center">
                <svg className="transform -rotate-90 w-24 h-24 drop-shadow-md">
                  <circle cx="48" cy="48" r="30" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-900/50" />
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="30" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    fill="transparent" 
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="text-rose-600 transition-all duration-1000 ease-linear shadow-lg" 
                  />
                </svg>
                <span className="absolute text-3xl font-bold text-white drop-shadow-md">{timeLeft}</span>
              </div>
            </div>
          </>
        ) : videoSrc ? (
          <video 
            src={videoSrc}
            controls 
            className="w-full h-full object-cover rounded-xl"
            preload="metadata"
          />
        ) : (
          <div className="text-center text-gray-500 absolute inset-0 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl m-1">
            <Video size={36} className="text-gray-400 mb-3" />
            <h3 className="font-bold text-gray-700 mb-1">No video recorded yet</h3>
            <p className="text-sm px-6">Record a 30-sec intro to get 20% more responses</p>
          </div>
        )}
      </div>

      {/* Buttons Section */}
      <div className="flex justify-center gap-3 mt-4 w-full md:w-3/4 mx-auto">
        
        {!isRecording && !videoSrc && (
          <button 
            onClick={startRecording}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 rounded-xl font-bold hover:from-rose-600 hover:to-rose-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-rose-200"
          >
            ▶ Start Recording
          </button>
        )}

        {isRecording && (
          <button 
            onClick={stopRecording}
            className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Square size={16} fill="white" /> Stop Recording <span className="text-gray-400 text-sm font-normal ml-1">({timeLeft}s left)</span>
          </button>
        )}

        {!isRecording && videoSrc && uploadStatus !== 'success' && uploadStatus !== 'uploading' && (
          <>
            <button 
              onClick={startRecording}
              className="flex-1 border-2 border-rose-100 text-rose-600 py-3 rounded-xl font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Re-record
            </button>
            <button 
              onClick={handleUpload}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-green-200"
            >
              <Upload size={18} /> Upload Video
            </button>
          </>
        )}
        
        {!isRecording && videoSrc && uploadStatus === 'success' && (
          <button 
            onClick={startRecording}
            className="w-full border-2 border-rose-100 text-rose-600 py-3 rounded-xl font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> Record New Intro
          </button>
        )}
      </div>

      {uploadStatus === 'uploading' && (
        <div className="mt-4 w-full md:w-3/4 mx-auto bg-blue-50 border border-blue-200 text-blue-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-blue-700 rounded-full animate-spin"></div>
          Uploading to server...
        </div>
      )}

      {uploadStatus === 'success' && videoBlob && (
        <div className="mt-4 w-full md:w-3/4 mx-auto bg-green-50 border border-green-200 text-green-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
          <CheckCircle size={20} className="text-green-600 bg-white rounded-full bg-opacity-50" /> ✅ Video uploaded!
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;

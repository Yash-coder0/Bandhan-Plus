// 30-second video recorder component
import { useState, useRef, useEffect } from 'react';
import { Video, Square, Upload, Play } from 'lucide-react';
import API from '../api/axios';

const VideoIntro = ({ existingVideo }) => {
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30); // 30 second limit
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const videoRef = useRef(null);          // Preview video element
  const mediaRecorderRef = useRef(null);  // MediaRecorder instance
  const streamRef = useRef(null);         // Camera stream
  const timerRef = useRef(null);          // Countdown timer
  const chunksRef = useRef([]);           // Recorded data chunks

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;

      // Show live preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        // Combine chunks into a single Blob
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);

        // Show recorded video preview
        const url = URL.createObjectURL(blob);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
        }
      };

      mediaRecorder.start();
      setRecording(true);
      setTimeLeft(30);

      // Auto-stop after 30 seconds
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      alert('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(t => t.stop());
      clearInterval(timerRef.current);
      setRecording(false);
    }
  };

  const uploadVideo = async () => {
    if (!videoBlob) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('video', videoBlob, 'intro.webm');

    try {
      await API.post('/profile/upload-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploaded(true);
    } catch (err) {
      alert('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
        <Video className="text-rose-600" size={22} />
        30-Second Video Introduction
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        A short video helps matches connect with the real you. Introduce yourself, your interests, and what you're looking for!
      </p>

      {/* Video preview box */}
      <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
        <video ref={videoRef} className="w-full h-full object-cover" controls={!recording} muted={recording} />

        {/* Recording timer */}
        {recording && (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 animate-pulse">
            ● REC {timeLeft}s
          </div>
        )}

        {/* Existing video indicator */}
        {!videoBlob && !recording && existingVideo && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
            Video uploaded ✓
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!recording ? (
          <button onClick={startRecording}
            className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-rose-700">
            <Video size={18} /> Start Recording
          </button>
        ) : (
          <button onClick={stopRecording}
            className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-900">
            <Square size={18} /> Stop ({timeLeft}s left)
          </button>
        )}

        {videoBlob && !uploaded && (
          <button onClick={uploadVideo} disabled={uploading}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700">
            <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        )}
      </div>

      {uploaded && (
        <p className="text-green-600 font-semibold text-center mt-3">✅ Video uploaded successfully!</p>
      )}
    </div>
  );
};

export default VideoIntro;
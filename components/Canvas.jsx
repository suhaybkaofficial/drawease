"use client"
import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload, Minus, Plus, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDrawings } from '@/contexts/DrawingsContext';
import { authStore, create } from '@/lib/pocketbase';

export default function Canvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [title, setTitle] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
  }, [color, strokeWidth]);

  const checkCanvasEmpty = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    setIsCanvasEmpty(!imageData.some(channel => channel !== 0));
  }, []);

  const startDrawing = useCallback((e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  }, []);

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setIsCanvasEmpty(false);
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      checkCanvasEmpty();
    }
  }, [isDrawing, checkCanvasEmpty]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };
  }, [startDrawing, draw, stopDrawing]);

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleStrokeWidthChange = (newWidth) => {
    setStrokeWidth(Math.max(1, Math.min(newWidth, 10)));
  };

  const handleDownload = (format) => {
    const canvas = canvasRef.current;
    let downloadUrl;
    let filename;

    if (format === 'png') {
      downloadUrl = canvas.toDataURL('image/png');
      filename = 'drawing.png';
    } else if (format === 'svg') {
      const svgString = `
        <svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">
          <image href="${canvas.toDataURL('image/png')}" width="${canvas.width}" height="${canvas.height}"/>
        </svg>
      `;
      downloadUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
      filename = 'drawing.svg';
    }

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.click();

    toast.success(`Downloaded as ${format.toUpperCase()}`);
  };

  const handleUpload = async () => {
    if (!title) {
      toast.error('Please enter a title for your drawing');
      return;
    }

    if (!authStore.isValid) {
      toast.error('You must be logged in to upload a drawing');
      return;
    }

    const canvas = canvasRef.current;
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], 'drawing.png', { type: 'image/png' });

    const uploadPromise = new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('drawing_file', file);
        formData.append('user_id', authStore.model.id);

        const record = await create('drawings', formData);
        addDrawing(record);
        resolve('Drawing uploaded successfully!');
      } catch (error) {
        console.error('Error uploading drawing:', error);
        reject('Failed to upload drawing. Please try again.');
      }
    });

    toast.promise(
      uploadPromise,
      {
        loading: 'Uploading drawing...',
        success: (message) => message,
        error: (message) => message,
      }
    );
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsCanvasEmpty(true);
    toast.success('Canvas cleared');
  };

  const { addDrawing } = useDrawings();

  return (
    <div className="flex flex-col items-center w-full h-full" ref={containerRef}>
      <Toaster position="top-right" />
      <div className="mb-4 flex items-center gap-4 flex-wrap justify-center">
        <Input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="w-10 h-10 p-1 border rounded"
        />
        <Button
          onClick={() => handleStrokeWidthChange(strokeWidth - 1)}
          disabled={strokeWidth <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span>{strokeWidth}px</span>
        <Button
          onClick={() => handleStrokeWidthChange(strokeWidth + 1)}
          disabled={strokeWidth >= 10}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button onClick={handleClearCanvas} variant="outline">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Canvas
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-[calc(100vh-16rem)] border rounded-lg"
      />
      <div className="mt-4 flex items-center gap-4 flex-wrap justify-between  w-full">
        <div className="flex items-center gap-4 justify-between w-full md:w-auto">
          <Input
            type="text"
            placeholder="Drawing Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-48 flex-1 md:flex-none"
          />
          <Button onClick={handleUpload} >
            <Upload className="mr-2 h-4 w-4" />
            Save <span className="hidden md:inline ml-1"> Drawing</span>
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isCanvasEmpty} className="w-full md:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleDownload('png')}>
              PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('svg')}>
              SVG
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
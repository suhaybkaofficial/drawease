import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, FolderOpen, Trash2, Maximize2, X } from 'lucide-react';
import { useDrawings } from '@/contexts/DrawingsContext'; // We'll create this context
import toast, { Toaster } from 'react-hot-toast';
import { deleteRecord, getFileUrl } from '@/lib/pocketbase';
import Image from 'next/image';

export default function MyDrawings({ setActivePage }) {
  const { drawings, fetchDrawings } = useDrawings();
  const [isLoading, setIsLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    async function loadDrawings() {
      setIsLoading(true);
      await fetchDrawings();
      setIsLoading(false);
    }

    loadDrawings();
  }, [fetchDrawings]);

  const handleDelete = async (drawingId) => {
    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        await deleteRecord('drawings', drawingId);
        await fetchDrawings(); // Refresh the drawings list
        resolve('Drawing deleted successfully');
      } catch (error) {
        console.error('Error deleting drawing:', error);
        reject('Failed to delete drawing');
      }
    });

    toast.promise(
      deletePromise,
      {
        loading: 'Deleting drawing...',
        success: (message) => message,
        error: (message) => message,
      }
    );
  };

  const toggleFullscreen = (drawing) => {
    setFullscreenImage(fullscreenImage ? null : drawing);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold mb-8 text-[#265AFF]">My Drawings</h2>
      {drawings?.length === 0 ? (
        <div className="flex flex-col items-center">
          <FolderOpen className="w-24 h-24 text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 mb-4">No drawings found</p>
          <Button 
            onClick={() => setActivePage('canvas')} 
            className="bg-[#265AFF] hover:bg-[#1e4cd1] text-white"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Create New Drawing
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
          {drawings?.map((drawing) => (
            <div key={drawing.id} className="border rounded-lg p-4 shadow-md relative">
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFullscreen(drawing)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(drawing.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div className="relative w-full h-40 mb-2">
                <Image 
                  src={getFileUrl(drawing, drawing.drawing_file)} 
                  alt={drawing.title} 
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
              <h3 className="font-semibold text-lg">{drawing.title}</h3>
              <p className="text-sm text-gray-500">{new Date(drawing.created).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full bg-white p-4 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setFullscreenImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="relative w-full h-[80vh]">
              <Image 
                src={getFileUrl(fullscreenImage, fullscreenImage.drawing_file)} 
                alt={fullscreenImage.title}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <h3 className="mt-2 text-xl font-semibold text-center">{fullscreenImage.title}</h3>
          </div>
        </div>
      )}
    </div>
  );
}
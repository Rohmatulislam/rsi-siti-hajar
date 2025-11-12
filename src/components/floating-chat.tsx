'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Chat from '@/components/chat';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-emerald-600 text-white">
              <div className="flex items-center">
                <div className="bg-white/20 p-1 rounded-full mr-2">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <h3 className="font-semibold">Asisten Kesehatan AI</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <Chat />
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full p-4 shadow-lg bg-emerald-600 hover:bg-emerald-700 z-50"
          aria-label="Buka chat asisten kesehatan"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </>
  );
}
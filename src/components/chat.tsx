"use client";

import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, User, HeartPulse } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function Chat() {
  const { user } = useUser();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error,
    isLoading: chatLoading,
  } = useChat({
    body: {
      system: `Anda adalah asisten AI untuk RSI Siti Hajar Mataram. Tugas Anda adalah membantu pengguna menemukan dokter sesuai keluhan, membantu proses booking janji temu, menjawab pertanyaan umum tentang layanan rumah sakit, dan memberikan informasi kesehatan dasar. Gunakan informasi yang tersedia tentang RSI Siti Hajar Mataram untuk membantu pengguna. Jika pengguna ingin membuat janji, arahkan mereka ke halaman booking janji. Jika mereka mencari dokter, tanyakan tentang keluhan atau spesialisasi yang dicari. Berikan jawaban yang akurat, informatif, dan ramah sesuai dengan budaya Indonesia.`
    },
    api: '/api/chat',
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  if (!user) {
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <HeartPulse className="w-6 h-6 text-emerald-600 mr-2" />
            <h2 className="text-2xl font-bold">Asisten Kesehatan AI</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Disediakan oleh RSI Siti Hajar Mataram • Diberdayakan oleh OpenAI GPT-4o
          </p>
        </div>
        <Card className="p-6 text-center">
          <p className="text-gray-600 mb-4">
            Silakan masuk terlebih dahulu untuk menggunakan layanan asisten kesehatan AI.
          </p>
          <Button asChild>
            <a href="/sign-in">Masuk ke Akun</a>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <HeartPulse className="w-6 h-6 text-emerald-600 mr-2" />
          <h2 className="text-2xl font-bold">Asisten Kesehatan AI</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Disediakan oleh RSI Siti Hajar Mataram • Diberdayakan oleh OpenAI GPT-4o
        </p>
      </div>

      {error && (
        <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-900/20 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-700 dark:text-red-300 text-sm">
              {error.message ||
                "Terjadi kesalahan saat memproses permintaan Anda."}
            </span>
          </div>
        </Card>
      )}

      <div className="space-y-4 mb-4 min-h-[400px] max-h-[600px] overflow-y-auto">
        {messages.length === 0 ? (
          <Card className="p-6 text-center border-dashed">
            <div className="flex items-center justify-center mb-4">
              <HeartPulse className="w-12 h-12 text-emerald-400" />
            </div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Asisten Kesehatan AI RSI Siti Hajar
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Saya siap membantu Anda mencari dokter, membuat janji, atau menjawab pertanyaan kesehatan.
            </p>
            <div className="text-left text-sm">
              <p className="font-medium mb-1">Contoh pertanyaan:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>"Dokter spesialis jantung mana yang tersedia besok?"</li>
                <li>"Bagaimana cara booking janji dengan dokter anak?"</li>
                <li>"Apa saja layanan rawat inap yang tersedia?"</li>
                <li>"Gejala batuk dan pilek, dokter mana yang harus saya temui?"</li>
              </ul>
            </div>
          </Card>
        ) : (
          messages.map((m) => (
            <Card key={m.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {m.role === "user" ? (
                  <User className="w-4 h-4 text-blue-600" />
                ) : (
                  <div className="bg-emerald-100 p-1 rounded-full">
                    <HeartPulse className="w-3 h-3 text-emerald-600" />
                  </div>
                )}
                <span className="font-semibold text-sm">
                  {m.role === "user" ? "Anda" : "Asisten Kesehatan"}
                </span>
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed pl-6">
                {m.content}
              </div>
            </Card>
          ))
        )}

        {chatLoading && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-emerald-100 p-1 rounded-full">
                <HeartPulse className="w-3 h-3 text-emerald-600" />
              </div>
              <span className="font-semibold text-sm">Asisten Kesehatan</span>
            </div>
            <div className="pl-6">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={input}
          placeholder="Tanyakan tentang dokter, layanan, atau kesehatan..."
          onChange={handleInputChange}
          className="flex-1"
          disabled={chatLoading}
        />
        <Button type="submit" disabled={chatLoading || !input.trim()}>
          {chatLoading ? "Mengirim..." : "Kirim"}
        </Button>
      </form>
    </div>
  );
}

import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getAllDoctors } from "@/lib/doctor-service";
import { getAllServices } from "@/lib/service-service";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const { messages, system } = await req.json();

    // Fetch real-time data to include in the AI context
    const [doctors, services] = await Promise.all([
      getAllDoctors(),
      getAllServices()
    ]);

    // Create a context with real hospital data
    const hospitalContext = `
      DATA RUMAH SAKIT (diperbarui saat permintaan dibuat):
      - Daftar Dokter: ${doctors.map(d => `${d.name} (${d.specialty})`).join(', ')}
      - Layanan Tersedia: ${services.map(s => `${s.title} (${s.category || 'Umum'})`).join(', ')}
      
      Petunjuk tambahan untuk AI:
      - Jika pengguna menanyakan dokter spesifik, cek apakah dokter tersebut ada dalam daftar di atas
      - Jika pengguna menanyakan layanan spesifik, cek apakah layanan tersebut ada dalam daftar di atas
      - Selalu arahkan pengguna ke halaman yang sesuai di aplikasi untuk booking atau informasi lebih lanjut
      - Jika dokter atau layanan yang ditanyakan tidak ada dalam daftar, beri tahu bahwa mungkin informasi tersebut tidak terbaru dan arahkan ke halaman terkait untuk verifikasi
    `;

    const fullSystemMessage = system || `Anda adalah asisten AI untuk RSI Siti Hajar Mataram. Tugas Anda adalah membantu pengguna menemukan dokter sesuai keluhan, membantu proses booking janji temu, menjawab pertanyaan umum tentang layanan rumah sakit, dan memberikan informasi kesehatan dasar. ${hospitalContext} Gunakan informasi yang tersedia tentang RSI Siti Hajar Mataram untuk membantu pengguna. Jika pengguna ingin membuat janji, arahkan mereka ke halaman booking janji. Jika mereka mencari dokter, tanyakan tentang keluhan atau spesialisasi yang dicari. Berikan jawaban yang akurat, informatif, dan ramah sesuai dengan budaya Indonesia.`;

    const result = streamText({
      model: openai("gpt-4o"),
      messages,
      system: fullSystemMessage,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error:
          "Failed to process chat request. Please check your API configuration.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import RegistrationConfirmationClient from './registration-confirmation-client';

interface PageProps {
  searchParams: {
    data?: string;
  };
}

export default async function RegistrationConfirmationPage({ searchParams }: { searchParams: Promise<{ data?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const rawData = resolvedSearchParams.data;

  if (!rawData) {
    notFound(); // Menampilkan halaman 404 jika tidak ada data
  }

  let parsedData;
  try {
    // Decode dan parse data
    parsedData = JSON.parse(decodeURIComponent(rawData));
  } catch (error) {
    console.error('Error parsing registration data:', error);
    notFound(); // Menampilkan halaman 404 jika data tidak valid
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700">Memuat data...</h2>
        </div>
      </div>
    }>
      <RegistrationConfirmationClient initialData={parsedData} />
    </Suspense>
  );
}
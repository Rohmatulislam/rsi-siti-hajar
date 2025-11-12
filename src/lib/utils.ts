import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Scissors, Syringe, HeartPulse, Building } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fungsi untuk mendapatkan ikon berdasarkan nama layanan
export function getIconForService(serviceName: string) {
  const lowerCaseName = serviceName.toLowerCase();
  
  if (lowerCaseName.includes('bedah') || lowerCaseName.includes('minimal invasif') || lowerCaseName.includes('invasif')) {
    return Scissors;
  } else if (lowerCaseName.includes('eswl') || lowerCaseName.includes('lithotripsy')) {
    return Syringe;
  } else if (lowerCaseName.includes('persalinan') || lowerCaseName.includes('syari')) {
    return HeartPulse;
  } else if (lowerCaseName.includes('eksekutif') || lowerCaseName.includes('executive')) {
    return Building;
  }
  
  // Default icon
  return HeartPulse;
}

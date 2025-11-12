'use client';

import { MotionSection, MotionDiv } from "@/components/motion-wrapper";
import ImageWithFallback from "@/components/image-with-fallback";

// Mock data for affiliations with actual logo URLs
const affiliations = [
  { id: 1, name: "Kementerian Kesehatan RI", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Logo_Kementerian_Kesehatan_Republik_Indonesia.svg/1200px-Logo_Kementerian_Kesehatan_Republik_Indonesia.svg.png" },
  { id: 2, name: "Dinas Kesehatan NTB", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Logo_Kementerian_Kesehatan_Republik_Indonesia.svg/1200px-Logo_Kementerian_Kesehatan_Republik_Indonesia.svg.png" },
  { id: 3, name: "Ikatan Dokter Indonesia", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Logo_IDI.png/800px-Logo_IDI.png" },
  { id: 4, name: "BPJS Kesehatan", logo: "https://upload.wikimedia.org/wikipedia/id/thumb/0/0a/BPJS_Kesehatan_Indonesia_logo.svg/1200px-BPJS_Kesehatan_Indonesia_logo.svg.png" },
  { id: 5, name: "V-Claim BPJS", logo: "https://upload.wikimedia.org/wikipedia/id/thumb/0/0a/BPJS_Kesehatan_Indonesia_logo.svg/1200px-BPJS_Kesehatan_Indonesia_logo.svg.png" },
  { id: 6, name: "Kementerian Agama RI", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Logo_Kementerian_Agama_Republik_Indonesia.svg/1200px-Logo_Kementerian_Agama_Republik_Indonesia.svg.png" },
  { id: 7, name: "Rumah Sakit Sehati", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Hospital_icon.svg/1024px-Hospital_icon.svg.png" },
  { id: 8, name: "WHO", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/WHO_logo.svg/1200px-WHO_logo.svg.png" },
  { id: 9, name: "IDAI", logo: "https://upload.wikimedia.org/wikipedia/id/thumb/7/74/Logo_IDAI.svg/1200px-Logo_IDAI.svg.png" },
  { id: 10, name: "IDI", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Logo_IDI.png/800px-Logo_IDI.png" },
  { id: 11, name: "Kemenkes RI", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Logo_Kementerian_Kesehatan_Republik_Indonesia.svg/1200px-Logo_Kementerian_Kesehatan_Republik_Indonesia.svg.png" },
  { id: 12, name: "Rumah Sakit Umum Daerah", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Hospital_icon.svg/1024px-Hospital_icon.svg.png" }
];

export function Affiliations() {
  return (
    <MotionSection 
      className="py-12 bg-white dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container px-4 md:px-6">
        <MotionDiv
          className="text-center mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Kemitraan Kami</h2>
        </MotionDiv>
        
        {/* Single Row Affiliations */}
        <div className="relative overflow-hidden py-4">
          <div className="flex animate-scroll whitespace-nowrap">
            {[...affiliations, ...affiliations].map((affiliation, index) => (
              <MotionDiv 
                key={`${affiliation.id}-${index}`} 
                className={`mx-6 flex flex-col items-center justify-center shrink-0 ${index % 4 === 0 ? 'scale-90 hover:scale-105' : index % 4 === 1 ? 'scale-95 hover:scale-105' : index % 4 === 2 ? 'scale-100 hover:scale-110' : 'scale-95 hover:scale-105'}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: (index % affiliations.length) * 0.1 }}
              >
                <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl w-32 h-20 flex items-center justify-center p-2 transition-transform duration-300 hover:scale-105">
                  <ImageWithFallback 
                    src={affiliation.logo} 
                    alt={affiliation.name} 
                    width={100} 
                    height={40} 
                    className="object-contain max-h-full max-w-full"
                  />
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
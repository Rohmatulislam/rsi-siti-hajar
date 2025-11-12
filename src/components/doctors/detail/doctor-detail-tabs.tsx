'use client';

import { useState } from 'react';

interface DoctorDetailTabsProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function DoctorDetailTabs({ activeSection, setActiveSection }: DoctorDetailTabsProps) {
  const tabs = [
    { id: "about", label: "Tentang Dokter" },
    { id: "treatment", label: "Layanan Unggulan" },
    { id: "education", label: "Pendidikan" },
    { id: "schedule", label: "Jadwal" }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-none transform-none scale-100 cursor-pointer ${
              activeSection === tab.id
                ? "bg-emerald-500 text-white shadow-md"
                : "text-slate-600 dark:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
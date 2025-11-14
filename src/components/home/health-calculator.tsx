'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Heart, User, Activity, Scale, Ruler, HeartPulse, HeartHandshake, Cigarette, Wind } from "lucide-react";

// BMICalculator Component
const BMICalculator = ({ onBack }: { onBack: () => void }) => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // Convert cm to meter

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setBmi(null);
      setCategory("");
      return;
    }

    const calculatedBmi = w / (h * h);
    setBmi(parseFloat(calculatedBmi.toFixed(1)));
    
    if (calculatedBmi < 18.5) {
      setCategory("Kurus (Kekurangan Berat Badan)");
    } else if (calculatedBmi < 25) {
      setCategory("Normal (Sehat)");
    } else if (calculatedBmi < 30) {
      setCategory("Gemuk (Kelebihan Berat Badan)");
    } else {
      setCategory("Obesitas");
    }
  };

  const resetBMI = () => {
    setWeight("");
    setHeight("");
    setBmi(null);
    setCategory("");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <button
          onClick={onBack}
          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 text-sm font-medium flex items-center gap-1"
        >
          ← Kembali
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">Kalkulator BMI</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="bmi-weight" className="text-xs mb-1 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
              <Scale className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              Berat Badan (kg)
            </label>
            <div className="relative">
              <Input
                id="bmi-weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                onFocus={() => setActiveInput("bmi-weight")}
                onBlur={() => setActiveInput(null)}
                placeholder="Contoh: 60"
                className={cn(
                  "bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 py-3 transition-all duration-200 border-2 text-sm pr-10",
                  activeInput === "bmi-weight"
                    ? "border-emerald-500 shadow-none transform translate-x-[2px] translate-y-[2px]"
                    : "border-gray-300 dark:border-gray-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]"
                )}
              />
            </div>
          </div>

          <div>
            <label htmlFor="bmi-height" className="text-xs mb-1 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
              <Ruler className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              Tinggi Badan (cm)
            </label>
            <div className="relative">
              <Input
                id="bmi-height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                onFocus={() => setActiveInput("bmi-height")}
                onBlur={() => setActiveInput(null)}
                placeholder="Contoh: 165"
                className={cn(
                  "bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 py-3 transition-all duration-200 border-2 text-sm pr-10",
                  activeInput === "bmi-height"
                    ? "border-emerald-500 shadow-none transform translate-x-[2px] translate-y-[2px]"
                    : "border-gray-300 dark:border-gray-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]"
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={calculateBMI}
              onMouseDown={() => setActiveButton("bmi-calculate")}
              onMouseUp={() => setActiveButton(null)}
              onMouseLeave={() => setActiveButton(null)}
              className={cn(
                "w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2 rounded-lg transition-all duration-200 border-2 border-emerald-700 font-medium",
                activeButton === "bmi-calculate"
                  ? "shadow-none transform translate-x-[2px] translate-y-[2px]"
                  : "shadow-[3px_3px_0px_0px_rgba(5,150,105,0.8)] hover:shadow-[4px_4px_0px_0px rgba(5,150,105,0.8)]"
              )}
            >
              Hitung BMI
            </button>

            <button
              onClick={resetBMI}
              onMouseDown={() => setActiveButton("bmi-reset")}
              onMouseUp={() => setActiveButton(null)}
              onMouseLeave={() => setActiveButton(null)}
              className={cn(
                "w-full text-emerald-600 dark:text-emerald-400 border-2 border-emerald-600 dark:border-emerald-400 text-sm py-2 rounded-lg transition-all duration-200 font-medium bg-white dark:bg-gray-800",
                activeButton === "bmi-reset"
                  ? "shadow-none transform translate-x-[2px] translate-y-[2px]"
                  : "shadow-[3px_3px_0px_0px_rgba(16,185,129,0.3)] hover:shadow-[4px_4px_0px_0px rgba(16,185,129,0.3)]"
              )}
            >
              Reset
            </button>
          </div>

          {bmi !== null && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-gray-200 dark:border-gray-600 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] text-center">
              <p className="text-sm font-medium text-gray-800 dark:text-white">BMI Anda: <span className="font-bold">{bmi}</span></p>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Kategori: <span className="font-medium">{category}</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function HealthCalculator() {
  const [gender, setGender] = useState("");
  const [smoke, setSmoke] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [risk, setRisk] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [error, setError] = useState("");

  // State untuk efek klik
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError("");

    if (!weight || !height || !age || !bloodPressure) {
      setError("Semua field wajib diisi.");
      setRisk(null);
      return;
    }

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    const bp = parseInt(bloodPressure);

    if (isNaN(w) || isNaN(h) || isNaN(a) || isNaN(bp)) {
      setError("Pastikan semua nilai numerik valid.");
      setRisk(null);
      return;
    }

    if (w <= 0 || w > 300) {
      setError("Berat badan harus antara 1-300 kg.");
      setRisk(null);
      return;
    }

    if (h <= 0 || h > 300) {
      setError("Tinggi badan harus antara 1-300 cm.");
      setRisk(null);
      return;
    }

    if (a <= 0 || a > 150) {
      setError("Umur harus antara 1-150 tahun.");
      setRisk(null);
      return;
    }

    if (bp <= 50 || bp > 300) {
      setError("Tekanan darah harus antara 50-300 mmHg.");
      setRisk(null);
      return;
    }

    setIsLoading(true);

    // Simulasi perhitungan risiko jantung berdasarkan data
    // Ini adalah simulasi sederhana, bukan perhitungan medis sebenarnya
    setTimeout(() => {
      let riskScore = 0;

      // Faktor berdasarkan umur
      if (a > 50) riskScore += 30;
      else if (a > 40) riskScore += 20;
      else if (a > 30) riskScore += 10;

      // Faktor berdasarkan jenis kelamin
      if (gender === "Laki-laki") riskScore += 10;

      // Faktor berdasarkan tekanan darah
      if (bp > 180) riskScore += 30;
      else if (bp > 160) riskScore += 20;
      else if (bp > 140) riskScore += 10;

      // Faktor berdasarkan rokok
      if (smoke === "yes") riskScore += 20;

      // Faktor berdasarkan BMI
      const bmi = w / ((h / 100) * (h / 100));
      if (bmi > 30) riskScore += 20;
      else if (bmi > 25) riskScore += 10;

      let riskCategory = "";
      if (riskScore >= 50) riskCategory = "Tinggi";
      else if (riskScore >= 25) riskCategory = "Sedang";
      else riskCategory = "Rendah";

      setRisk(riskCategory);
      setIsLoading(false);
    }, 1500);
  };

  const resetForm = () => {
    setGender("");
    setSmoke("");
    setWeight("");
    setHeight("");
    setAge("");
    setBloodPressure("");
    setRisk(null);
    setError("");
  };

  const handleBack = () => {
    setActiveCard(null);
  };

  return (
    <section className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-gray-950 transition-colors">
      <div className="flex-1 flex flex-col justify-center px-0 py-0 lg:px-0 lg:py-0">
        <div className="max-w-4xl mx-auto w-full px-4 lg:px-8 py-8 lg:py-12">
          {activeCard ? (
            <div className="flex justify-center">
              <BMICalculator onBack={handleBack} />
            </div>
          ) : (
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-3 mx-auto">
                <Heart className="text-emerald-600 dark:text-emerald-400 h-5 w-5" />
                <h4 className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                  Kalkulator Kesehatan
                </h4>
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                Hitung Risiko Jantung Anda
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-6 max-w-2xl mx-auto">
                Cek risiko jantung Anda dengan mengisi formulir di bawah untuk mengetahui nilai risiko jantung berdasarkan data kesehatan Anda.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 max-w-lg mx-auto">
                <div
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:transform hover:translate-x-[-2px] hover:translate-y-[-2px)]"
                  onClick={() => setActiveCard("bmi")}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-lg">
                      <HeartPulse className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">BMI</p>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">Kalkulasi</p>
                    </div>
                  </div>
                  <p className="mt-1 text-[0.6rem] text-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Indeks Massa Tubuh
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Section - Centered */}
      <div className="bg-white dark:bg-gray-900 py-0 px-0 lg:py-0 lg:px-0">
        <div className="max-w-md mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Kalkulator Kesehatan</h2>
            <button
              onClick={resetForm}
              onMouseDown={() => setActiveButton("reset")}
              onMouseUp={() => setActiveButton(null)}
              onMouseLeave={() => setActiveButton(null)}
              className={cn(
                "text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-2.5 py-1 rounded-lg transition-all duration-200 border-2 border-gray-300 dark:border-gray-600 font-medium",
                activeButton === "reset"
                  ? "shadow-none transform translate-x-[2px] translate-y-[2px]"
                  : "shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px rgba(255,255,255,0.1)]"
              )}
            >
              Reset
            </button>
          </div>

          {/* Jenis Kelamin */}
          <div className="mb-5">
            <p className="font-medium mb-2 flex items-center gap-2 text-gray-800 dark:text-white text-sm">
              <User className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Jenis Kelamin
            </p>
            <div role="radiogroup" aria-label="Jenis Kelamin" className="grid grid-cols-2 gap-2">
              {["Laki-laki", "Perempuan"].map((item) => (
                <button
                  key={item}
                  role="radio"
                  aria-checked={gender === item}
                  onClick={() => setGender(item)}
                  onMouseDown={() => setActiveButton(`gender-${item}`)}
                  onMouseUp={() => setActiveButton(null)}
                  onMouseLeave={() => setActiveButton(null)}
                  className={cn(
                    "py-2.5 border-2 rounded-lg text-center font-medium transition-all duration-200 text-sm",
                    gender === item
                      ? cn(
                          "bg-emerald-600 text-white border-emerald-600 font-bold",
                          activeButton === `gender-${item}`
                            ? "shadow-none transform translate-x-[2px] translate-y-[2px]"
                            : "shadow-[3px_3px_0px_0px_rgba(5,150,105,0.8)]"
                        )
                      : cn(
                          "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700",
                          activeButton === `gender-${item}`
                            ? "shadow-none transform translate-x-[2px] translate-y-[2px] border-emerald-300"
                            : "shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px rgba(255,255,255,0.1)]"
                        )
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Merokok */}
          <div className="mb-5">
            <p className="font-medium mb-2 flex items-center gap-2 text-gray-800 dark:text-white text-sm">
              {smoke === "yes" ? <Cigarette className="h-3.5 w-3.5 text-red-500" /> : <Wind className="h-3.5 w-3.5 text-emerald-500" />}
              Apakah Anda merokok?
            </p>
            <div role="radiogroup" aria-label="Status Merokok" className="grid grid-cols-2 gap-2">
              {[
                { label: "Ya", value: "yes" },
                { label: "Tidak", value: "no" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  role="radio"
                  aria-checked={smoke === opt.value}
                  onClick={() => setSmoke(opt.value)}
                  onMouseDown={() => setActiveButton(`smoke-${opt.value}`)}
                  onMouseUp={() => setActiveButton(null)}
                  onMouseLeave={() => setActiveButton(null)}
                  className={cn(
                    "py-2.5 border-2 rounded-lg text-center font-medium transition-all duration-200 text-sm",
                    smoke === opt.value
                      ? cn(
                          "bg-emerald-600 text-white border-emerald-600 font-bold",
                          activeButton === `smoke-${opt.value}`
                            ? "shadow-none transform translate-x-[2px] translate-y-[2px]"
                            : "shadow-[3px_3px_0px_0px_rgba(5,150,105,0.8)]"
                        )
                      : cn(
                          "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700",
                          activeButton === `smoke-${opt.value}`
                            ? "shadow-none transform translate-x-[2px] translate-y-[2px] border-emerald-300"
                            : "shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px rgba(255,255,255,0.1)]"
                        )
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Berat & Tinggi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            <div>
              <label htmlFor="weight" className="text-xs mb-1 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                <Scale className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                Berat Badan
              </label>
              <div className="relative">
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  onFocus={() => setActiveInput("weight")}
                  onBlur={() => setActiveInput(null)}
                  placeholder="0"
                  aria-label="Berat Badan dalam kg"
                  className={cn(
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 py-3 transition-all duration-200 border-2 text-sm pr-10",
                    activeInput === "weight"
                      ? "border-emerald-500 shadow-none transform translate-x-[2px] translate-y-[2px]"
                      : "border-gray-300 dark:border-gray-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]"
                  )}
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xs">
                  kg
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="height" className="text-xs mb-1 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                <Ruler className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                Tinggi Badan
              </label>
              <div className="relative">
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  onFocus={() => setActiveInput("height")}
                  onBlur={() => setActiveInput(null)}
                  placeholder="0"
                  aria-label="Tinggi Badan dalam cm"
                  className={cn(
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 py-3 transition-all duration-200 border-2 text-sm pr-10",
                    activeInput === "height"
                      ? "border-emerald-500 shadow-none transform translate-x-[2px] translate-y-[2px]"
                      : "border-gray-300 dark:border-gray-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px rgba(255,255,255,0.1)]"
                  )}
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xs">
                  cm
                </span>
              </div>
            </div>
          </div>

          {/* Umur & Tekanan Darah */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <div>
              <label htmlFor="age" className="text-xs mb-1 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                <User className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                Umur
              </label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onFocus={() => setActiveInput("age")}
                onBlur={() => setActiveInput(null)}
                placeholder="0"
                aria-label="Umur dalam tahun"
                className={cn(
                  "bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 py-3 transition-all duration-200 border-2 text-sm",
                  activeInput === "age"
                    ? "border-emerald-500 shadow-none transform translate-x-[2px] translate-y-[2px]"
                    : "border-gray-300 dark:border-gray-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px rgba(255,255,255,0.1)]"
                )}
              />
            </div>

            <div>
              <label htmlFor="bloodPressure" className="text-xs mb-1 font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                <HeartPulse className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                Tekanan Darah
              </label>
              <Input
                id="bloodPressure"
                type="number"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                onFocus={() => setActiveInput("bloodPressure")}
                onBlur={() => setActiveInput(null)}
                placeholder="0"
                aria-label="Tekanan Darah dalam mmHg"
                className={cn(
                  "bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 py-3 transition-all duration-200 border-2 text-sm",
                  activeInput === "bloodPressure"
                    ? "border-emerald-500 shadow-none transform translate-x-[2px] translate-y-[2px]"
                    : "border-gray-300 dark:border-gray-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px rgba(255,255,255,0.1)]"
                )}
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-all duration-200 font-medium shadow-[3px_3px_0px_0px_rgba(5,150,105,0.8)] hover:shadow-[4px_4px_0px_0px_rgba(5,150,105,0.8)] disabled:opacity-70"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menghitung...
              </div>
            ) : (
              "Hitung Risiko"
            )}
          </Button>

          {error && (
            <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-xs shadow-[3px_3px_0px_0px_rgba(239,68,68,0.3)]">
              {error}
            </div>
          )}

          {risk && (
            <div className="mt-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <HeartHandshake className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Hasil Perhitungan</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Risiko jantung Anda: <span className="font-bold capitalize">"{risk}"</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                {risk === 'Rendah'
                  ? 'Kondisi jantung Anda dalam kategori aman. Teruskan pola hidup sehat Anda!'
                  : risk === 'Sedang'
                  ? 'Anda memiliki risiko sedang terhadap penyakit jantung. Perhatikan pola hidup dan tekanan darah Anda.'
                  : 'Anda memiliki risiko tinggi terhadap penyakit jantung. Disarankan untuk berkonsultasi dengan dokter ahli.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Heart, User, Activity, Scale, Ruler, HeartPulse, HeartHandshake, Cigarette, Wind } from "lucide-react";

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
      setError("Usia harus antara 1-150 tahun.");
      setRisk(null);
      return;
    }
    
    if (bp <= 0 || bp > 300) {
      setError("Tekanan darah harus antara 1-300 mmHg.");
      setRisk(null);
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const heightInMeters = h / 100;
    const bmi = w / (heightInMeters * heightInMeters);
    
    let bmiRisk = 0;
    if (bmi < 18.5) bmiRisk = 0.5;
    else if (bmi >= 18.5 && bmi < 25) bmiRisk = 0;
    else if (bmi >= 25 && bmi < 30) bmiRisk = 1;
    else bmiRisk = 2;
    
    let ageRisk = 0;
    if (a >= 20 && a < 40) ageRisk = 0;
    else if (a >= 40 && a < 55) ageRisk = 1;
    else if (a >= 55 && a < 65) ageRisk = 2;
    else if (a >= 65) ageRisk = 3;
    
    let bpRisk = 0;
    if (bp < 90) bpRisk = 0.5;
    else if (bp >= 90 && bp < 120) bpRisk = 0;
    else if (bp >= 120 && bp < 130) bpRisk = 0.5;
    else if (bp >= 130 && bp < 140) bpRisk = 1;
    else if (bp >= 140 && bp < 180) bpRisk = 2;
    else bpRisk = 3;
    
    const smokeRisk = smoke === "yes" ? 2 : 0;
    const baseScore = bmiRisk + ageRisk + bpRisk + smokeRisk;
    const score = baseScore * 10;
    
    let result = "Rendah";
    if (score >= 20 && score < 40) result = "Sedang";
    else if (score >= 40) result = "Tinggi";

    setRisk(result);
    setIsLoading(false);
  };

  const resetForm = () => {
    setGender("");
    setSmoke("");
    setWeight("");
    setHeight("");
    setAge("");
    setBloodPressure("");
    setRisk(null);
    setActiveInput(null);
    setActiveButton(null);
  };

  // Komponen Kalkulator BMI
  const BMICalculator = () => {
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [bmi, setBmi] = useState<number | null>(null);
    const [category, setCategory] = useState("");
    const [bmiActiveInput, setBmiActiveInput] = useState<string | null>(null);

    const calculateBMI = () => {
      if (weight && height) {
        const w = parseFloat(weight);
        const h = parseFloat(height) / 100;
        if (w > 0 && h > 0) {
          const bmiValue = w / (h * h);
          setBmi(parseFloat(bmiValue.toFixed(1)));
          
          if (bmiValue < 18.5) {
            setCategory("Kurus");
          } else if (bmiValue >= 18.5 && bmiValue < 25) {
            setCategory("Normal");
          } else if (bmiValue >= 25 && bmiValue < 30) {
            setCategory("Kelebihan Berat Badan");
          } else {
            setCategory("Obesitas");
          }
        }
      }
    };

    const resetBMI = () => {
      setWeight("");
      setHeight("");
      setBmi(null);
      setCategory("");
      setBmiActiveInput(null);
    };

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Kalkulator BMI</h3>
          <button 
            onClick={() => setActiveCard(null)}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            Tutup
          </button>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">Berat (kg)</label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onFocus={() => setBmiActiveInput("weight")}
              onBlur={() => setBmiActiveInput(null)}
              placeholder="Contoh: 70"
              className={cn(
                "text-sm py-2 transition-all duration-200 border-2 bg-white dark:bg-gray-800",
                bmiActiveInput === "weight" 
                  ? "border-emerald-500 shadow-none transform translate-x-[2px] translate-y-[2px]"
                  : "border-gray-300 dark:border-gray-600 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]"
              )}
            />
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">Tinggi (cm)</label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              onFocus={() => setBmiActiveInput("height")}
              onBlur={() => setBmiActiveInput(null)}
              placeholder="Contoh: 170"
              className={cn(
                "text-sm py-2 transition-all duration-200 border-2 bg-white dark:bg-gray-800",
                bmiActiveInput === "height" 
                  ? "border-emerald-500 shadow-none transform translate-x-[2px] translate-y-[2px]"
                  : "border-gray-300 dark:border-gray-600 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]"
              )}
            />
          </div>
          
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
          
          {bmi !== null && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-gray-200 dark:border-gray-600 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px rgba(255,255,255,0.1)]">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-800 dark:text-white">BMI Anda: <span className="font-bold">{bmi}</span></p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Kategori: <span className="font-medium">{category}</span></p>
              </div>
            </div>
          )}
          
          <button
            onClick={resetBMI}
            onMouseDown={() => setActiveButton("bmi-reset")}
            onMouseUp={() => setActiveButton(null)}
            onMouseLeave={() => setActiveButton(null)}
            className={cn(
              "w-full text-emerald-600 dark:text-emerald-400 border-2 border-emerald-600 dark:border-emerald-400 text-sm py-2 rounded-lg transition-all duration-200 font-medium bg-white dark:bg-gray-800",
              activeButton === "bmi-reset"
                ? "shadow-none transform translate-x-[2px] translate-y-[2px]"
                : "shadow-[3px_3px_0px_0px rgba(16,185,129,0.3)] hover:shadow-[4px_4px_0px_0px rgba(16,185,129,0.3)]"
            )}
          >
            Reset
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-gray-950 transition-colors animate-in fade-in duration-500">
      {/* ==== Kiri: Informasi ==== */}
      <div className="lg:flex-1 flex flex-col justify-center px-4 py-8 lg:px-10 lg:py-10 bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-md mx-auto lg:mx-0 animate-in slide-in-from-left duration-700">
          {activeCard ? (
            <div>
              {activeCard === "bmi" && <BMICalculator />}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart className="text-emerald-600 dark:text-emerald-400 h-5 w-5" />
                <h4 className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                  Kalkulator Kesehatan
                </h4>
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight animate-in slide-in-from-left duration-700 delay-100">
                Hitung Risiko Jantung Anda
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-6 animate-in slide-in-from-left duration-700 delay-200">
                Cek risiko jantung Anda dengan mengisi formulir di samping untuk mengetahui nilai risiko jantung berdasarkan data kesehatan Anda.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 animate-in slide-in-from-left duration-700 delay-300">
                <div 
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 cursor-pointer shadow-[4px_4px_0px_0px rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0px_0px rgba(0,0,0,0.1)] dark:hover:shadow-[6px_6px_0px_0px rgba(255,255,255,0.1)] hover:transform hover:translate-x-[-2px] hover:translate-y-[-2px)]"
                  onClick={() => setActiveCard("bmi")}
                >
                  <div className="flex items-center gap-2">
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

      {/* ==== Kanan: Form ==== */}
      <div className="lg:flex-1 bg-white dark:bg-gray-900 py-8 px-4 lg:py-10 lg:px-10 border-l border-gray-200 dark:border-gray-800">
        <div className="max-w-md mx-auto animate-in slide-in-from-right duration-700">
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
                  : "shadow-[3px_3px_0px_0px rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px rgba(255,255,255,0.1)]"
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
                            : "shadow-[3px_3px_0px_0px rgba(5,150,105,0.8)]"
                        )
                      : cn(
                          "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700",
                          activeButton === `gender-${item}`
                            ? "shadow-none transform translate-x-[2px] translate-y-[2px] border-emerald-300"
                            : "shadow-[3px_3px_0px_0px rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px rgba(255,255,255,0.1)]"
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
                            : "shadow-[3px_3px_0px_0px rgba(5,150,105,0.8)]"
                        )
                      : cn(
                          "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700",
                          activeButton === `smoke-${opt.value}`
                            ? "shadow-none transform translate-x-[2px] translate-y-[2px] border-emerald-300"
                            : "shadow-[3px_3px_0px_0px rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px rgba(255,255,255,0.1)]"
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
                      : "border-gray-300 dark:border-gray-700 shadow-[3px_3px_0px_0px rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px rgba(255,255,255,0.1)]"
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
                      : "border-gray-300 dark:border-gray-700 shadow-[3px_3px_0px_0px rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px rgba(255,255,255,0.1)]"
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
                    : "border-gray-300 dark:border-gray-700 shadow-[3px_3px_0px_0px rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px rgba(255,255,255,0.1)]"
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
                    : "border-gray-300 dark:border-gray-700 shadow-[3px_3px_0px_0px rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px rgba(255,255,255,0.1)]"
                )}
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            onMouseDown={() => !isLoading && setActiveButton("submit")}
            onMouseUp={() => setActiveButton(null)}
            onMouseLeave={() => setActiveButton(null)}
            className={cn(
              "w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 text-base transition-all duration-200 border-2 border-emerald-700",
              activeButton === "submit" && !isLoading
                ? "shadow-none transform translate-x-[2px] translate-y-[2px]"
                : "shadow-[3px_3px_0px_0px rgba(5,150,105,0.8)] hover:shadow-[4px_4px_0px_0px rgba(5,150,105,0.8)]",
              isLoading && "opacity-70 cursor-not-allowed"
            )}
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
            <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-xs shadow-[3px_3px_0px_0px rgba(239,68,68,0.3)]">
              {error}
            </div>
          )}

          {/* Hasil */}
          {risk && (
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-center transition-all animate-in fade-in zoom-in-95 duration-500 shadow-[3px_3px_0px_0px rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px rgba(255,255,255,0.1)]">
              <div className="flex justify-center mb-4">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  risk === "Rendah" && "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
                  risk === "Sedang" && "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
                  risk === "Tinggi" && "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800"
                )}>
                  <Heart className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">
                Risiko Jantung Anda
              </h3>
              <p
                className={cn(
                  "text-xl font-bold mb-2 transition-all duration-500",
                  risk === "Rendah" && "text-emerald-600 dark:text-emerald-400",
                  risk === "Sedang" && "text-yellow-600 dark:text-yellow-400",
                  risk === "Tinggi" && "text-red-600 dark:text-red-400"
                )}
              >
                {risk}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 transition-all duration-500">
                {risk === "Rendah" &&
                  "Risiko jantung Anda rendah. Pertahankan pola hidup sehat dengan olahraga teratur dan pola makan seimbang."}
                {risk === "Sedang" &&
                  "Risiko jantung Anda sedang. Perhatikan pola makan dan tingkatkan aktivitas fisik untuk mengurangi risiko."}
                {risk === "Tinggi" &&
                  "Risiko jantung Anda tinggi. Segera konsultasikan dengan dokter untuk pemeriksaan lebih lanjut dan rencana pengobatan."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
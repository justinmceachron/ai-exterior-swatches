"use client";

import { useState, useRef } from "react";
import Image from "next/image";

// --- THE SWATCH DATABASE ---
const MATERIALS: Record<string, { id: string; name: string; description: string; src: string }[]> = {
  Roofing: [
    { 
      id: "roof-1", 
      name: "Brownwood", 
      src: "/swatches/roofing-style-1.jpg",
      description: "Owens Corning Duration Designer Asphalt Shingles in Brownwood color: Dark warm brown shingles with prominent black, brown and orange granules." 
    },
    { 
      id: "roof-2", 
      name: "Chateau Green", 
      src: "/swatches/roofing-style-2.jpg",
      description: "Owens Corning Duration Designer Asphalt Shingles in Chateau Green: Dark green shingles achieved by a mix of intense green, dark grey and black granules." 
    },
    { 
      id: "roof-3", 
      name: "Colonial Slate", 
      src: "/swatches/roofing-style-3.jpg",
      description: "Owens Corning Duration Designer Asphalt Shingles in Colonial Slate: Medium warm gray shingle with prominent green-gray, black and red granules." 
    },
    { 
      id: "roof-4", 
      name: "Desert Rose", 
      src: "/swatches/roofing-style-4.jpg",
      description: "Owens Corning Duration Designer Asphalt Shingles in Desert Rose: Dark warm brown shingles with prominent golden buff, red-brown, and gray granules." 
    },
    { 
      id: "roof-5", 
      name: "Estate Gray", 
      src: "/swatches/roofing-style-5.jpg",
      description: "Owens Corning Duration Designer Asphalt Shingles in Estate Gray: Medium warm gray shingles with a green undertone achieved by mixing prominent black, and dark, medium and greenish gray granules." 
    },
  ],
  Siding: [
    { 
      id: "siding-1", 
      name: "Weathered Cliffs", 
      src: "/swatches/siding-style-1.jpg",
      description: "James Hardie horizontal lap siding in 'Weathered Cliffs'. A soft, nuanced off-white with subtle grey undertones. It lacks the starkness of a true Arctic white, opting instead for the tonal depth of sun-bleached limestone or bone." 
    },
    { 
      id: "siding-2", 
      name: "Warm Clay", 
      src: "/swatches/siding-style-2.jpg",
      description: "James Hardie horizontal lap siding in 'Warm Clay'. A rich, mid-tone taupe that sits at the intersection of sandy beige and soft khaki. It has a distinct weight to it, leaning into the warmth of natural earth and fired pottery." 
    },
    { 
      id: "siding-3", 
      name: "Chiseled Green", 
      src: "/swatches/siding-style-3.jpg",
      description: "James Hardie horizontal lap siding in 'Chiseled Green'. A muted, desaturated sage with a smoky, blue-grey base. It captures the specific silver-green hue found in eucalyptus leaves or weathered lichen." 
    },
    { 
      id: "siding-4", 
      name: "Mudflats", 
      src: "/swatches/siding-style-4.jpg",
      description: "James Hardie horizontal lap siding in 'Mudflats'. A deep, olive-toned bronze. It is a heavy, saturated earth tone that appears as a dark forest green in soft light and a warm, muddy brown in direct sun." 
    },
    { 
      id: "siding-5", 
      name: "Last Embers", 
      src: "/swatches/siding-style-5.jpg",
      description: "James Hardie horizontal lap siding in 'Last Embers'. A profound, near-black charcoal with a cool, midnight-blue undertone. It captures the texture of cooled volcanic rock or the shadows of a dying fire." 
    },
  ],
};

export default function Home() {
  const [selectedService, setSelectedService] = useState<string>("Roofing");
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null); 
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateDesign = async (file: File, service: string, materialPrompt: string) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("service", service);
    formData.append("material", materialPrompt); 

    try {
      const response = await fetch("/api/design-exterior", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to generate design");
      if (data.success && data.url) setGeneratedImage(data.url);
      else throw new Error("No image returned");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    setSelectedMaterial(null); 
    setGeneratedImage(null);
    setError(null);
    setCurrentFile(null); 
  };

  const handleMaterialSelect = (material: any) => {
    setSelectedMaterial(material);
    setError(null); 
    if (currentFile) {
      generateDesign(currentFile, selectedService, material.description);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileInputRef.current) fileInputRef.current.value = "";

    if (MATERIALS[selectedService]?.length > 0 && !selectedMaterial) {
      setError(`Please tap a ${selectedService} style above first!`);
      return;
    }

    setCurrentFile(file);
    const prompt = selectedMaterial ? selectedMaterial.description : `modern ${selectedService}`;
    generateDesign(file, selectedService, prompt);
  };

  // UPDATED: Removed unused services
  const services = [
    { id: "Roofing", icon: "🏠" },
    { id: "Siding", icon: "🧱" },
  ];

  const currentMaterials = MATERIALS[selectedService] || [];

  return (
    <div className="min-h-screen bg-[#f97316] flex items-center justify-center p-6 font-sans">
      {/* Reverted to standard max-w-3xl */}
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Controls */}
        <div className="w-full p-8 md:p-10 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-gray-900 text-white px-2 py-1 rounded-md text-xs font-bold uppercase">Pro</span>
            <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Visual Configurator</span>
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Build your dream exterior.
          </h1>
          <p className="text-gray-500 mb-8 text-lg">
            Select a service, tap a swatch, and visualize.
          </p>
          
          {/* Service Tabs - Just two big buttons now */}
          <div className="flex gap-3 mb-8">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 transition-all ${
                  selectedService === service.id
                    ? "border-[#f97316] bg-orange-50 text-[#f97316] font-bold shadow-sm"
                    : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                }`}
              >
                <span className="text-2xl">{service.icon}</span>
                <span className="text-lg">{service.id}</span>
              </button>
            ))}
          </div>

          {/* VISUAL SWATCH SELECTOR */}
          {currentMaterials.length > 0 ? (
            <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide border-b pb-2">
                Select {selectedService} Style
              </h3>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {currentMaterials.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => handleMaterialSelect(mat)}
                    disabled={isLoading}
                    className={`group relative flex flex-col items-center gap-2 transition-all ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 transition-all shadow-sm ${
                      selectedMaterial?.id === mat.id 
                        ? "border-[#f97316] scale-110 shadow-xl ring-4 ring-orange-100" 
                        : "border-gray-100 group-hover:border-gray-300"
                    }`}>
                      <Image 
                        src={mat.src} 
                        alt={mat.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <span className={`text-xs text-center px-1 ${
                      selectedMaterial?.id === mat.id ? "font-bold text-[#f97316]" : "text-gray-500"
                    }`}>
                      {mat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
             <div className="mb-8 p-4 bg-gray-50 rounded-xl text-sm text-gray-500 font-medium text-center border border-dashed border-gray-200">
              Upload photo below to begin.
            </div>
          )}

          {/* Upload Area */}
          <div 
            onClick={() => !isLoading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all group min-h-[180px] ${
              error ? "border-red-300 bg-red-50" : "border-gray-300 hover:bg-orange-50 hover:border-[#f97316]"
            } ${isLoading ? "cursor-default" : "cursor-pointer"}`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*"
            />
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-800 font-bold text-lg">Designing...</p>
                <p className="text-gray-500 text-sm">Applying {selectedMaterial ? selectedMaterial.name : "style"}</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-white border border-gray-200 text-[#f97316] shadow-md rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                {error ? (
                   <p className="text-red-600 font-bold text-lg">{error}</p>
                ) : (
                   <div>
                     <p className="text-gray-900 font-extrabold text-xl">
                       {currentFile ? "Change Photo" : "Upload Home Photo"}
                     </p>
                     {selectedMaterial && <p className="text-sm text-[#f97316] font-bold mt-2">Selected: {selectedMaterial.name}</p>}
                   </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bottom Section: Preview */}
        {generatedImage && (
          <div className="w-full bg-orange-50 p-6 border-t-2 border-[#f97316]/20 animate-in slide-in-from-bottom-10 duration-700 flex flex-col items-center">
            <div className="relative w-full min-h-[400px] md:min-h-[500px] rounded-2xl overflow-hidden shadow-lg border-4 border-white">
               <Image src={generatedImage} alt="Renovated Exterior" fill className="object-cover" />
            </div>
            <div className="flex justify-center mt-6 mb-2">
              <a 
                href={generatedImage} 
                download="renovation-design.png"
                className="px-8 py-3 bg-[#f97316] text-white font-bold rounded-full hover:bg-orange-700 hover:shadow-xl transition-all shadow-md flex items-center gap-2 transform hover:-translate-y-1"
              >
                <span>Download Design</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
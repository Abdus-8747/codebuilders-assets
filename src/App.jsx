import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Download, Code, Terminal, Cpu, Link as LinkIcon, Home, ExternalLink, QrCode, History } from 'lucide-react';
import html2canvas from 'html2canvas';

// --- UTILITY: ID GENERATOR ---
const generateUniqueId = () => {
  const datePart = Date.now().toString(36).slice(-4).toUpperCase();
  const randomPart = Math.random().toString(36).slice(-4).toUpperCase();
  return `CB-${datePart}-${randomPart}`;
};

// --- COMPONENT: HOME PAGE ---
const HomePage = () => (
  <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
    {/* Background Grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
    
    <div className="z-10 text-center max-w-2xl w-full">
      <div className="mb-8 flex justify-center">
        <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          <Terminal className="w-12 h-12 text-cyan-400" />
        </div>
      </div>
      
      <h1 className="text-5xl font-bold font-mono mb-4 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
        {'<Builders Assets />'}
      </h1>
      <p className="text-slate-400 mb-12 text-lg font-mono">Select a destination to continue</p>

      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/links" className="group relative p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-cyan-500/50 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col items-center gap-4">
          <LinkIcon className="w-10 h-10 text-blue-500 group-hover:text-cyan-400 transition-colors" />
          <h2 className="text-xl font-bold font-mono">Event Links</h2>
          <p className="text-sm text-slate-500">Access resources, slides, and code repositories.</p>
        </Link>

        <Link to="/certificate" className="group relative p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-purple-500/50 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col items-center gap-4">
          <Code className="w-10 h-10 text-purple-500 group-hover:text-purple-400 transition-colors" />
          <h2 className="text-xl font-bold font-mono">Get Certificate</h2>
          <p className="text-sm text-slate-500">Generate and download your participation proof.</p>
        </Link>
      </div>
    </div>
  </div>
);

// --- COMPONENT: LINKS PAGE ---
const LinksPage = () => {
  const links = [
    { title: "GitHub Repository", url: "https://github.com", icon: <Code className="w-5 h-5" />, desc: "Source code for today's event" },
    { title: "Slide Deck", url: "https://google.com", icon: <ExternalLink className="w-5 h-5" />, desc: "Presentation slides and notes" },
    { title: "Live Demo", url: "https://vercel.com", icon: <Terminal className="w-5 h-5" />, desc: "The live application deployment" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6 font-mono relative">
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute h-full w-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-400 mb-8 transition-colors">
          <Home className="w-4 h-4" /> Back Home
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">
          <span className="text-cyan-500">./</span>Resources
        </h1>

        <div className="grid gap-4">
          {links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" 
               className="flex items-center justify-between p-6 bg-slate-900/80 border border-slate-800 rounded-xl hover:border-cyan-500/30 hover:bg-slate-900 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-950 rounded-lg text-cyan-500 group-hover:text-cyan-400 group-hover:scale-110 transition-transform">
                  {link.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{link.title}</h3>
                  <p className="text-slate-400 text-sm">{link.desc}</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-cyan-500 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: CERTIFICATE MAKER (Upgraded) ---
const CertificateMaker = () => {
  const [name, setName] = useState('');
  const [fontSize, setFontSize] = useState(48);
  const [certId, setCertId] = useState('');
  const [generatedHistory, setGeneratedHistory] = useState([]);
  const certificateRef = useRef(null);

  // Helper for ID generation
  const generateUniqueId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

  useEffect(() => {
    const saved = localStorage.getItem('cert_history');
    if (saved) setGeneratedHistory(JSON.parse(saved));
    setCertId(generateUniqueId());
  }, []);

  const generateNewId = () => {
    setCertId(generateUniqueId());
  };

  const saveToHistory = () => {
    if (!name) return;
    const newEntry = { name, id: certId, date: new Date().toISOString() };
    const updated = [newEntry, ...generatedHistory].slice(0, 5); 
    setGeneratedHistory(updated);
    localStorage.setItem('cert_history', JSON.stringify(updated));
  };

  const downloadCertificate = async () => {
    if (!name) {
      alert("Please enter a name first");
      return;
    }

    saveToHistory();

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const scale = 3; // High resolution
      const width = 1200;
      const height = 848;
      
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);

      // --- DRAWING LOGIC RESTORED ---
      
      // 1. Background
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, '#020617'); 
      bgGradient.addColorStop(0.5, '#0f172a');
      bgGradient.addColorStop(1, '#020617');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Grid Pattern
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // 3. Border
      const borderGradient = ctx.createLinearGradient(0, 0, width, height);
      borderGradient.addColorStop(0, '#06b6d4');
      borderGradient.addColorStop(1, '#8b5cf6');
      ctx.strokeStyle = borderGradient;
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // 4. Header Text
      ctx.font = 'bold 60px "Courier New", monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText('<CERTIFICATE />', width / 2, 140);
      
      ctx.font = '24px "Courier New", monospace';
      ctx.fillStyle = '#06b6d4';
      ctx.fillText('Code Builders Certification', width / 2, 180);

      // 5. ID Badge (Top Right)
      ctx.font = '16px "Courier New", monospace';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'right';
      ctx.fillText(`ID: ${certId}`, width - 50, 60);

      // 6. Main Content
      ctx.font = 'italic 24px serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText('This strictly certifies that', width / 2, 300);

      // 7. Name
      ctx.font = `bold ${fontSize}px "Courier New", monospace`;
      ctx.shadowColor = "rgba(6, 182, 212, 0.5)";
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(name, width / 2, 380);
      ctx.shadowBlur = 0;

      // 8. Underline
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      const nameW = ctx.measureText(name).width;
      ctx.beginPath();
      ctx.moveTo(width / 2 - nameW / 2 - 20, 400);
      ctx.lineTo(width / 2 + nameW / 2 + 20, 400);
      ctx.stroke();

      // 9. Description
      ctx.font = '20px "Courier New", monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('has successfully compiled the requirements for the event', width / 2, 460);
      
      // 10. Footer Box
      const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });
      
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(100, 600, width - 200, 150);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(100, 600, width - 200, 150);

      // Date Text
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748b';
      ctx.font = '16px "Courier New", monospace';
      ctx.fillText('DATE ISSUED:', 140, 650);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 20px "Courier New", monospace';
      ctx.fillText(today, 140, 680);

      // Verification Text
      ctx.textAlign = 'right';
      ctx.fillStyle = '#64748b';
      ctx.font = '16px "Courier New", monospace';
      ctx.fillText('VERIFICATION CODE:', width - 140, 650);
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 24px "Courier New", monospace';
      ctx.fillText(certId, width - 140, 680);

      // --- DOWNLOAD TRIGGER ---
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${certId}-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 font-mono">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-400 mb-6 text-sm md:text-base">
          <Home className="w-4 h-4" /> Back Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Section */}
          <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-500" />
                Input Data
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-2">DEVELOPER NAME</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors"
                    placeholder="e.g. Sarah Connor"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-2">UNIQUE ID (AUTO)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={certId}
                      className="w-full bg-slate-950/50 border border-slate-800 text-slate-500 rounded-lg px-4 py-3 cursor-not-allowed text-sm"
                    />
                    <button onClick={generateNewId} className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 text-cyan-500 flex-shrink-0">
                      <Cpu className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                   <label className="text-xs text-slate-400 block mb-2">FONT SIZE ADJUST</label>
                   <input 
                      type="range" 
                      min="20" 
                      max="60" 
                      value={fontSize} 
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                   />
                </div>

                <div className="pt-4">
                  <button
                    onClick={downloadCertificate}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 md:py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-900/20 active:scale-95"
                  >
                    <Download className="w-5 h-5" />
                    <span className="text-sm md:text-base">Generate & Download</span>
                  </button>
                </div>
              </div>
            </div>

            {generatedHistory.length > 0 && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 md:p-6">
                 <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
                   <History className="w-4 h-4" /> Recent
                 </h3>
                 <div className="space-y-3">
                   {generatedHistory.map((h, i) => (
                     <div key={i} className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                       <span className="text-white truncate max-w-[150px]">{h.name}</span>
                       <span className="text-cyan-500 font-mono">{h.id}</span>
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 shadow-2xl">
              <div 
                ref={certificateRef}
                className="relative aspect-[1.414/1] bg-[#020617] rounded-lg overflow-hidden flex flex-col select-none"
              >
                {/* Visual Border */}
                <div className="absolute inset-0 border-[4px] md:border-[6px] border-cyan-500/20 m-2 md:m-4 rounded-sm pointer-events-none"></div>
                
                {/* Top ID */}
                <div className="absolute top-2 right-4 md:top-8 md:right-8 text-slate-600 text-[10px] md:text-xs font-mono">
                  ID: {certId}
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 md:p-12 z-10">
                  <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-slate-100 font-mono mb-1 md:mb-2">
                    {'<CERTIFICATE />'}
                  </h1>
                  
                  <p className="text-cyan-500 tracking-widest text-[8px] sm:text-xs md:text-sm font-mono mb-4 md:mb-12">
                    BUILDERS ASSETS PROOF OF WORK
                  </p>
                  
                  <p className="text-slate-400 italic serif text-sm md:text-lg mb-4 md:mb-8">
                    This strictly certifies that
                  </p>
                  
                  <h2 
                    className="text-white font-bold font-mono mb-2 transition-all duration-300 break-words max-w-full px-4" 
                    style={{ 
                      fontSize: `clamp(${fontSize * 0.4}px, ${fontSize * 0.6}px, ${fontSize}px)`,
                      lineHeight: '1.2'
                    }}
                  >
                    {name || 'YOUR NAME'}
                  </h2>
                  
                  <div className="h-0.5 w-1/2 bg-cyan-500 mx-auto mb-4 md:mb-8"></div>
                  
                  <p className="text-slate-300 font-mono text-[10px] sm:text-xs md:text-sm max-w-[80%] md:max-w-md mx-auto leading-relaxed">
                    has successfully compiled the requirements for the event and demonstrated proficiency.
                  </p>
                </div>

                {/* Footer */}
                <div className="h-auto py-3 md:py-0 md:h-24 bg-slate-900 mx-2 md:mx-12 mb-4 md:mb-12 border border-slate-800 flex justify-between items-center px-4 md:px-8">
                   <div className="text-left">
                     <p className="text-[8px] md:text-[10px] text-slate-500 uppercase tracking-wider">Date Issued</p>
                     <p className="text-slate-200 font-mono text-[10px] md:text-sm whitespace-nowrap">
                       {new Date().toLocaleDateString()}
                     </p>
                   </div>
                   <div className="text-right">
                     <p className="text-[8px] md:text-[10px] text-slate-500 uppercase tracking-wider">Verification Code</p>
                     <p className="text-cyan-400 font-bold font-mono text-xs md:text-lg">
                       {certId}
                     </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP ROOT ---
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/links" element={<LinksPage />} />
        <Route path="/certificate" element={<CertificateMaker />} />
      </Routes>
    </Router>
  );
}
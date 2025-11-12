import Link from "next/link";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Star,
  Stethoscope
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Beranda", href: "/" },
    { name: "Dokter", href: "/doctors" },
    { name: "Buat Janji", href: "/appointment" },
    { name: "Artikel", href: "/articles" },
    { name: "Tentang Kami", href: "/information" },
    { name: "FAQ", href: "/faq" },
  ];

  const serviceLinks = [
    { name: "IGD 24 Jam", href: "#" },
    { name: "Medical Check Up", href: "#" },
    { name: "Laboratorium", href: "#" },
    { name: "Radiologi", href: "#" },
    { name: "Farmasi", href: "#" },
    { name: "Fisioterapi", href: "#" },
  ];

  const contactInfo = [
    { 
      icon: <MapPin className="h-5 w-5" />, 
      text: "Jl. Pejanggik No. 116, Mataram, NTB 83116" 
    },
    { 
      icon: <Phone className="h-5 w-5" />, 
      text: "(0370) 123456" 
    },
    { 
      icon: <Mail className="h-5 w-5" />, 
      text: "info@rsisitihajar.co.id" 
    },
    { 
      icon: <Clock className="h-5 w-5" />, 
      text: "Buka 24 Jam" 
    },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">RSI Siti Hajar</span>
            </div>
            <p className="text-slate-400 mb-4">
              Rumah Sakit Islam terpercaya di Nusa Tenggara Barat, 
              menyediakan layanan kesehatan terbaik dengan teknologi modern 
              dan tenaga medis profesional.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2">
              {serviceLinks.map((service, index) => (
                <li key={index}>
                  <Link 
                    href={service.href} 
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak Kami</h3>
            <div className="space-y-3">
              {contactInfo.map((contact, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="text-emerald-400 mt-0.5">
                    {contact.icon}
                  </div>
                  <span className="text-slate-400">{contact.text}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center mb-2">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              </div>
              <p className="text-sm text-slate-300">
                "Layanan terbaik dengan tingkat kepuasan pasien 98%"
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © {currentYear} RSI Siti Hajar Mataram. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
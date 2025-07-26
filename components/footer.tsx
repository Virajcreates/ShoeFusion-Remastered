import Link from "next/link"
import { Logo } from "./logo"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo variant="white" />
            <p className="text-gray-400 mt-4">
              Redefining custom footwear with innovative 3D design technology and premium craftsmanship.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "/home" },
                { name: "Explore", href: "/explore" },
                { name: "Customize", href: "/customize" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "FAQ", href: "/faq" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {[
                { name: "Shipping Policy", href: "/shipping" },
                { name: "Return Policy", href: "/returns" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Size Guide", href: "/size-guide" },
                { name: "Track Order", href: "/track-order" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="text-primary mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400">JACK CITY</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-primary flex-shrink-0" size={18} />
                <span className="text-gray-400">+91 8431489796</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-primary flex-shrink-0" size={18} />
                <span className="text-gray-400">support@shoefusion.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {[
                { icon: <CreditCard size={20} />, text: "Secure Payment" },
                { icon: <ShieldCheck size={20} />, text: "Privacy Protected" },
                { icon: <Truck size={20} />, text: "Free Shipping" },
                { icon: <RotateCcw size={20} />, text: "Easy Returns" },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-400">
                  {item.icon}
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="text-gray-500 text-sm text-center md:text-right">
              © {new Date().getFullYear()} ShoeFusion. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

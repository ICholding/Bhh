import { useState } from 'react'
import bhhLogo from '/BHHLogo.svg'

function App() {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-bhh-bg to-slate-200 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/60 px-8 py-4 flex justify-between items-center shadow-lg">
        <img src={bhhLogo} alt="BHH Logo" className="h-14 w-auto" />
        <nav className="hidden lg:flex space-x-8">
          <a href="#hero" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">Home</a>
          <a href="#services" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">Services</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">Contact</a>
        </nav>
        <button className="lg:hidden">Menu</button>
      </header>

      {/* Hero */}
      <section id="hero" className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center min-h-[70vh]">
        <div className="bg-white/30 backdrop-blur-2xl border border-white/40 rounded-3xl p-12 md:p-20 max-w-5xl mx-auto shadow-2xl hover:shadow-3xl transition-all duration-500">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent mb-8 drop-shadow-lg">
            Blessed Hope
            <br />
            <span className="text-6xl md:text-7xl lg:text-8xl">Healthcare</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-800 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Premium healthcare services with compassion and excellence. Your journey to wellness starts here.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 md:px-20 py-6 md:py-8 rounded-3xl text-xl md:text-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300">
            Book Appointment
          </button>
        </div>
      </section>

      {/* Partners */}
      <section className="px-8 py-24 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-gray-800 drop-shadow-md">
            Trusted By Leading Brands
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 lg:gap-20 justify-items-center">
            {['PayPal', 'Walmart', 'Lenovo', 'Lowes', 'Marshalls'].map((partner, index) => (
              <div 
                key={partner} 
                className="group bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-500 border border-white/50 w-32 md:w-40 h-32 md:h-40 flex items-center justify-center cursor-pointer"
                style={{animationDelay: `${index * 200}ms`}}
              >
                <span className="text-3xl md:text-4xl font-black text-gray-800 group-hover:text-blue-600 transition-colors">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-xl border-t-4 border-blue-100/50 px-8 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="col-span-1 lg:col-span-2">
            <img src={bhhLogo} alt="BHH" className="h-12 w-auto mb-6" />
            <p className="text-lg text-gray-700 mb-8 max-w-md leading-relaxed">Blessed Hope Healthcare – Committed to your health and well-being.</p>
            <div className="flex items-center space-x-1 mb-4">
              {[1,2,3,4].map((_) => (
                <svg key={_} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24 .588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
              <svg className="w-6 h-6 text-yellow-300" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24 .588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span className="ml-3 text-xl font-bold text-gray-800">4.5</span>
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-gray-800 mb-8">Newsletter</h4>
            <p className="text-gray-700 mb-6">Stay updated with health tips and news.</p>
            <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
              <input 
                type="email" 
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 text-lg border-0 focus:outline-none focus:ring-2 ring-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-bold transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-gray-800 mb-8">Contact Us</h4>
            <p className="text-gray-700 mb-4">123 Wellness Ave<br />Hope City, HC 90210</p>
            <p className="text-gray-700 mb-4">(555) 987-6543</p>
            <p className="text-blue-600 font-semibold hover:underline">hello@bhhcare.com</p>
          </div>
        </div>
        <div className="mt-16 pt-12 border-t-2 border-gray-200 text-center text-gray-600 text-lg">
          &copy; 2026 Blessed Hope Healthcare. All rights reserved. | Built with Vite + React + Tailwind
        </div>
      </footer>
    </div>
  )
}

export default App

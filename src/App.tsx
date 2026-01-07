import { useState } from 'react'
import bhhLogo from '/BHHLogo.svg'

function App() {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-bhh-bg to-slate-200 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/60 px-4 md:px-8 py-4 flex justify-between items-center shadow-lg">
        <img src={bhhLogo} alt="BHH Logo" className="h-12 md:h-14 w-auto" />
        <nav className="hidden md:flex lg:flex space-x-6 md:space-x-8">
          <a href="#hero" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors text-sm md:text-base">Home</a>
          <a href="#services" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors text-sm md:text-base">Services</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors text-sm md:text-base">Contact</a>
        </nav>
        <button className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">Menu</button>
      </header>

      {/* Hero */}
      <section id="hero" className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24 text-center min-h-[60vh] md:min-h-[70vh]">
        <div className="bg-white/30 backdrop-blur-2xl border border-white/40 rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-20 max-w-4xl md:max-w-5xl mx-auto shadow-2xl hover:shadow-3xl transition-all duration-500">
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent mb-6 md:mb-8 drop-shadow-lg leading-tight">
            Blessed Hope
            <br className="hidden md:block" />
            <span className="text-5xl md:text-7xl lg:text-8xl">Healthcare</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-800 mb-8 md:mb-12 max-w-2xl md:max-w-3xl mx-auto leading-relaxed font-light">
            Premium healthcare services with compassion and excellence. Your journey to wellness starts here.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 md:px-12 lg:px-20 py-4 md:py-6 rounded-2xl md:rounded-3xl text-lg md:text-xl lg:text-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 whitespace-nowrap">
            Book Appointment
          </button>
        </div>
      </section>

      {/* Partners */}
      <section className="px-4 md:px-8 py-16 md:py-24 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl md:max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-20 text-gray-800 drop-shadow-md">
            Trusted By Leading Brands
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-12 lg:gap-20 justify-items-center">
            {['PayPal', 'Walmart', 'Lenovo', 'Lowes', 'Marshalls'].map((partner, index) => (
              <div 
                key={partner} 
                className="group bg-white/90 backdrop-blur-md p-6 md:p-8 lg:p-12 rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 md:hover:scale-110 transition-all duration-500 border border-white/50 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 flex items-center justify-center cursor-pointer"
                style={{animationDelay: `${index * 150}ms`}}
              >
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-800 group-hover:text-blue-600 transition-colors tracking-wide">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Perfect PNG Match */}
      <footer className="bg-gradient-to-r from-blue-400/80 via-blue-500/70 to-blue-600/80 backdrop-blur-xl border-t-4 border-blue-200/50 px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-6xl md:max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
          {/* Logo & Reviews */}
          <div className="col-span-1 lg:col-span-2 flex flex-col items-center md:items-start md:flex-row md:justify-between md:gap-8">
            <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
              <img src={bhhLogo} alt="Blessed Hope Healthcare" className="h-16 md:h-20 w-auto mb-4" />
              <p className="text-center md:text-left text-sm md:text-base text-white/90 font-medium max-w-md leading-relaxed">
                Headquarters: 2810 N Church Street PMB 258182<br />
                Wilmington, DE 19802-4447
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <div className="flex items-center space-x-1 mb-2">
                {[1,2,3,4].map((_) => (
                  <svg key={_} className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24 .588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
                <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24 .588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <span className="text-xl md:text-2xl font-bold text-white">4.5</span>
            </div>
          </div>

          {/* Stay Connected */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center md:text-left">Stay Connected</h4>
            <div className="flex flex-col items-center md:items-start space-y-3 text-white/90 text-sm md:text-base">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                <span>support@bhhcare.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                <span>+1 (855) 464-6872</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col items-center lg:items-end">
            <h4 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center lg:text-right">Newsletter</h4>
            <div className="w-full max-w-md bg-white/20 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/30 shadow-xl">
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Enter Your Email for Updates"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/40 bg-white/50 backdrop-blur-sm focus:border-blue-200 focus:outline-none text-sm md:text-base text-gray-900 placeholder-gray-500"
                />
                <button className="bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 px-6 py-3 rounded-xl font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-1 mt-4 pt-4 border-t border-white/30">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-white text-xs md:text-sm font-medium">Read Our Reviews!</span>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t-2 border-white/30 text-center text-white/80 text-xs md:text-sm">
          © 2026 Blessed Hope Healthcare. All rights reserved. | Built with Vite + React + Tailwind
        </div>
      </footer>
    </div>
  )
}

export default App
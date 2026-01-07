import { useState } from 'react'
import bhhLogo from '/BHHLogo.svg'
import reactLogo from './assets/react.svg'

function App() {
  const [email, setEmail] = useState('')

  return (
    &lt;div className=&quot;min-h-screen bg-gradient-to-br from-slate-100 via-bhh-bg to-slate-200 flex flex-col font-sans&quot;&gt;
      {/* Header */}
      &lt;header className=&quot;sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/60 px-8 py-4 flex justify-between items-center shadow-lg&quot;&gt;
        &lt;img src={bhhLogo} alt=&quot;BHH Logo&quot; className=&quot;h-14 w-auto&quot; /&gt;
        &lt;nav className=&quot;hidden lg:flex space-x-8&quot;&gt;
          &lt;a href=&quot;#hero&quot; className=&quot;text-gray-700 hover:text-blue-600 font-semibold transition-colors&quot;&gt;Home&lt;/a&gt;
          &lt;a href=&quot;#services&quot; className=&quot;text-gray-700 hover:text-blue-600 font-semibold transition-colors&quot;&gt;Services&lt;/a&gt;
          &lt;a href=&quot;#contact&quot; className=&quot;text-gray-700 hover:text-blue-600 font-semibold transition-colors&quot;&gt;Contact&lt;/a&gt;
        &lt;/nav&gt;
        &lt;button className=&quot;lg:hidden&quot;&gt;Menu&lt;/button&gt;
      &lt;/header&gt;

      {/* Hero */}
      &lt;section id=&quot;hero&quot; className=&quot;flex-1 flex flex-col items-center justify-center px-4 py-24 text-center min-h-[70vh]&quot;&gt;
        &lt;div className=&quot;bg-white/30 backdrop-blur-2xl border border-white/40 rounded-3xl p-12 md:p-20 max-w-5xl mx-auto shadow-2xl hover:shadow-3xl transition-all duration-500&quot;&gt;
          &lt;h1 className=&quot;text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent mb-8 drop-shadow-lg&quot;&gt;
            Blessed Hope
            &lt;br /&gt;
            &lt;span className=&quot;text-6xl md:text-7xl lg:text-8xl&quot;&gt;Healthcare&lt;/span&gt;
          &lt;/h1&gt;
          &lt;p className=&quot;text-xl md:text-2xl lg:text-3xl text-gray-800 mb-12 max-w-3xl mx-auto leading-relaxed font-light&quot;&gt;
            Premium healthcare services with compassion and excellence. Your journey to wellness starts here.
          &lt;/p&gt;
          &lt;button className=&quot;bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 md:px-20 py-6 md:py-8 rounded-3xl text-xl md:text-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300&quot;&gt;
            Book Appointment
          &lt;/button&gt;
        &lt;/div&gt;
      &lt;/section&gt;

      {/* Partners */}
      &lt;section className=&quot;px-8 py-24 bg-white/60 backdrop-blur-sm&quot;&gt;
        &lt;div className=&quot;max-w-7xl mx-auto&quot;&gt;
          &lt;h2 className=&quot;text-4xl md:text-5xl font-bold text-center mb-20 text-gray-800 drop-shadow-md&quot;&gt;
            Trusted By Leading Brands
          &lt;/h2&gt;
          &lt;div className=&quot;grid grid-cols-2 md:grid-cols-5 gap-12 lg:gap-20 justify-items-center&quot;&gt;
            {['PayPal', 'Walmart', 'Lenovo', 'Lowes', 'Marshalls'].map((partner, index) =&gt; (
              &lt;div 
                key={partner} 
                className=&quot;group bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-500 border border-white/50 w-32 md:w-40 h-32 md:h-40 flex items-center justify-center cursor-pointer&quot;
                style={{animationDelay: `${index * 200}ms`}}
              &gt;
                &lt;span className=&quot;text-3xl md:text-4xl font-black text-gray-800 group-hover:text-blue-600 transition-colors&quot;&gt;{partner}&lt;/span&gt;
              &lt;/div&gt;
            ))}
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/section&gt;

      {/* Footer */}
      &lt;footer className=&quot;bg-white/70 backdrop-blur-xl border-t-4 border-blue-100/50 px-8 py-16&quot;&gt;
        &lt;div className=&quot;max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12&quot;&gt;
          &lt;div className=&quot;col-span-1 lg:col-span-2&quot;&gt;
            &lt;img src={bhhLogo} alt=&quot;BHH&quot; className=&quot;h-12 w-auto mb-6&quot; /&gt;
            &lt;p className=&quot;text-lg text-gray-700 mb-8 max-w-md leading-relaxed&quot;&gt;Blessed Hope Healthcare – Committed to your health and well-being.&lt;/p&gt;
            &lt;div className=&quot;flex items-center space-x-1 mb-4&quot;&gt;
              {[1,2,3,4].map((_) =&gt; (
                &lt;svg key={_} className=&quot;w-6 h-6 text-yellow-400 fill-current&quot; viewBox=&quot;0 0 20 20&quot;&gt;
                  &lt;path d=&quot;M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24 .588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z&quot;/&gt;
                &lt;/svg&gt;
              ))}
              &lt;svg className=&quot;w-6 h-6 text-yellow-300&quot; viewBox=&quot;0 0 20 20&quot;&gt;
                &lt;path d=&quot;M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24 .588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z&quot;/&gt;
              &lt;/svg&gt;
              &lt;span className=&quot;ml-3 text-xl font-bold text-gray-800&quot;&gt;4.5&lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;
          &lt;div&gt;
            &lt;h4 className=&quot;text-2xl font-bold text-gray-800 mb-8&quot;&gt;Newsletter&lt;/h4&gt;
            &lt;p className=&quot;text-gray-700 mb-6&quot;&gt;Stay updated with health tips and news.&lt;/p&gt;
            &lt;div className=&quot;flex bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md&quot;&gt;
              &lt;input 
                type=&quot;email&quot; 
                placeholder=&quot;your@email.com&quot;
                value={email}
                onChange={(e) =&gt; setEmail(e.target.value)}
                className=&quot;flex-1 px-6 py-4 text-lg border-0 focus:outline-none focus:ring-2 ring-blue-500&quot;
              /&gt;
              &lt;button className=&quot;bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-bold transition-colors whitespace-nowrap&quot;&gt;
                Subscribe
              &lt;/button&gt;
            &lt;/div&gt;
          &lt;/div&gt;
          &lt;div&gt;
            &lt;h4 className=&quot;text-2xl font-bold text-gray-800 mb-8&quot;&gt;Contact Us&lt;/h4&gt;
            &lt;p className=&quot;text-gray-700 mb-4&quot;&gt;123 Wellness Ave&lt;br /&gt;Hope City, HC 90210&lt;/p&gt;
            &lt;p className=&quot;text-gray-700 mb-4&quot;&gt;(555) 987-6543&lt;/p&gt;
            &lt;p className=&quot;text-blue-600 font-semibold hover:underline&quot;&gt;hello@bhhcare.com&lt;/p&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        &lt;div className=&quot;mt-16 pt-12 border-t-2 border-gray-200 text-center text-gray-600 text-lg&quot;&gt;
          &amp;copy; 2026 Blessed Hope Healthcare. All rights reserved. | Built with Vite + React + Tailwind
        &lt;/div&gt;
      &lt;/footer&gt;
    &lt;/div&gt;
  )
}

export default App
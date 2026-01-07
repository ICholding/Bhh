import { useState } from 'react'

function App() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) =&gt; {
    e.preventDefault()
    alert(`Subscribed! Thank you, ${email}`)
    setEmail('')
  }

  const partners = ['PayPal', 'Walmart', 'Lenovo', 'Lowes', 'Marshalls']

  return (
    &lt;div className=&quot;min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white overflow-x-hidden&quot;&gt;
      {/* Hero */}
      &lt;section className=&quot;min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center gap-8&quot;&gt;
        &lt;img src=&quot;/BHHLogo.svg&quot; alt=&quot;Blessed Hope Healthcare&quot; className=&quot;w-40 sm:w-48 md:w-64 h-auto drop-shadow-2xl animate-float&quot; /&gt;
        &lt;div&gt;
          &lt;h1 className=&quot;text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight mb-4 drop-shadow-2xl&quot;&gt;
            Blessed Hope&lt;br className=&quot;sm:hidden&quot; /&gt;
            &lt;span className=&quot;text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl block&quot;&gt;Healthcare&lt;/span&gt;
          &lt;/h1&gt;
          &lt;p className=&quot;text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto opacity-90 leading-relaxed&quot;&gt;
            Compassionate care. Innovative solutions. Your health, our mission.
          &lt;/p&gt;
        &lt;/div&gt;
        &lt;button className=&quot;px-12 sm:px-16 py-6 sm:py-8 bg-white/20 hover:bg-white/30 backdrop-blur-xl border-2 border-white/30 rounded-3xl text-xl sm:text-2xl font-bold shadow-2xl hover:scale-105 hover:shadow-3xl hover:border-white/50 transition-all duration-500&quot;&gt;
          Get Care Now
        &lt;/button&gt;
      &lt;/section&gt;

      {/* Partners */}
      &lt;section className=&quot;py-24 px-6 max-w-7xl mx-auto&quot;&gt;
        &lt;h2 className=&quot;text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-lg&quot;&gt;
          Trusted Partners
        &lt;/h2&gt;
        &lt;div className=&quot;grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8&quot;&gt;
          {partners.map((partner, index) =&gt; (
            &lt;div
              key={partner}
              className=&quot;group relative bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/40 rounded-3xl p-8 sm:p-10 cursor-pointer hover:scale-[1.05] transition-all duration-500 shadow-xl hover:shadow-2xl hover:-rotate-1&quot;
            &gt;
              &lt;div className=&quot;w-20 h-20 sm:w-24 sm:h-24 bg-white/30 group-hover:bg-white/50 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500&quot;&gt;
                &lt;span className=&quot;text-2xl sm:text-3xl font-black text-gray-800 drop-shadow-lg&quot;&gt;{partner.slice(0,2)}&lt;/span&gt;
              &lt;/div&gt;
              &lt;h3 className=&quot;text-lg sm:text-xl md:text-2xl font-bold text-center mb-2 group-hover:text-white transition-colors&quot;&gt;{partner}&lt;/h3&gt;
              &lt;p className=&quot;text-sm opacity-75 text-center&quot;&gt;Strategic Partner&lt;/p&gt;
            &lt;/div&gt;
          ))}
        &lt;/div&gt;
      &lt;/section&gt;

      {/* Footer */}
      &lt;footer className=&quot;bg-black/60 backdrop-blur-2xl border-t border-white/20 py-16 px-6&quot;&gt;
        &lt;div className=&quot;max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start&quot;&gt;
          &lt;div className=&quot;space-y-4&quot;&gt;
            &lt;img src=&quot;/BHHLogo.svg&quot; alt=&quot;BHH&quot; className=&quot;w-44 h-auto&quot; /&gt;
            &lt;div className=&quot;text-sm space-y-1 opacity-80&quot;&gt;
              &lt;p&gt;123 Hope Street&lt;br /&gt;Wilmington, DE 19801&lt;/p&gt;
              &lt;p&gt;+1-855-464-6872&lt;/p&gt;
              &lt;p&gt;support@blessedhopehealthcare.com&lt;/p&gt;
            &lt;/div&gt;
          &lt;/div&gt;

          &lt;div className=&quot;md:col-span-2 lg:col-span-1&quot;&gt;
            &lt;h3 className=&quot;text-2xl font-bold mb-6&quot;&gt;Stay Connected&lt;/h3&gt;
            &lt;form onSubmit={handleSubscribe} className=&quot;flex flex-col sm:flex-row gap-3&quot;&gt;
              &lt;input
                type=&quot;email&quot;
                required
                placeholder=&quot;Enter your email address&quot;
                value={email}
                onChange={(e) =&gt; setEmail(e.target.value)}
                className=&quot;flex-1 px-6 py-4 bg-white/20 border border-white/30 rounded-2xl placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/30 backdrop-blur-xl transition-all&quot;
              /&gt;
              &lt;button
                type=&quot;submit&quot;
                className=&quot;px-10 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-500 hover:to-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap&quot;
              &gt;
                Subscribe
              &lt;/button&gt;
            &lt;/form&gt;
          &lt;/div&gt;

          &lt;div className=&quot;flex flex-col items-end lg:items-start space-y-6 pt-4 md:pt-0&quot;&gt;
            &lt;div className=&quot;flex items-center space-x-2&quot;&gt;
              &lt;div className=&quot;text-2xl&quot;&gt;⭐⭐⭐⭐☆&lt;/div&gt;
              &lt;span className=&quot;text-xl font-bold&quot;&gt;4.5&lt;/span&gt;
              &lt;span className=&quot;text-sm opacity-75&quot;&gt;(1,247 reviews)&lt;/span&gt;
            &lt;/div&gt;
            &lt;div className=&quot;flex space-x-4&quot;&gt;
              &lt;a href=&quot;#&quot; className=&quot;w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300&quot;&gt;
                f
              &lt;/a&gt;
              &lt;a href=&quot;#&quot; className=&quot;w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300&quot;&gt;
                i
              &lt;/a&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        &lt;div className=&quot;mt-12 pt-8 border-t border-white/10 text-center text-sm opacity-60&quot;&gt;
          © 2026 Blessed Hope Healthcare. All rights reserved. | Privacy Policy | Terms of Service
        &lt;/div&gt;
      &lt;/footer&gt;
    &lt;/div&gt;
  )
}

export default App

import React from 'react';

const Footer: React.FC = () =&gt; (
  &lt;footer className=\"bg-bhh-dark text-white py-12 px-8 text-center md:text-left\">&lt;/footer&gt;
    &lt;div className=\"max-w-6xl mx-auto space-y-6\">&lt;/div&gt;
      &lt;h3 className=\"text-3xl font-bold text-bhh-blue mb-4 uppercase tracking-wide\">&lt;/h3&gt;Stay Connected&lt;/h3&gt;
      &lt;p className=\"text-lg font-medium\">support@example.com&lt;/p&gt;
      &lt;p className=\"text-lg font-medium\">&lt;/p&gt;+1 (855) 464-6872&lt;/p&gt;
      &lt;p className=\"text-sm opacity-90\">&lt;/p&gt;© Headquarters: 2810 N Church Street PMB 258182, Wilmington, DE 19802-4447&lt;/p&gt;
      &lt;div className=\"bg-white/10 p-6 rounded-xl max-w-md mx-auto md:mx-0\">&lt;/div&gt;
        &lt;div className=\"flex flex-col sm:flex-row gap-4 items-center justify-center\">&lt;/div&gt;
          &lt;input 
            type=\"email\" 
            placeholder=\"Enter Your Email for Updates\" 
            className=\"flex-1 p-3 rounded-lg border-2 border-bhh-blue-light bg-white/80 focus:border-bhh-blue focus:outline-none text-bhh-dark\"
          /&gt;
          &lt;button className=\"px-6 py-3 bg-bhh-blue text-white font-bold rounded-lg shadow-lg hover:bg-bhh-blue-light transition-all duration-200 whitespace-nowrap\">&lt;/button&gt;Subscribe&lt;/button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      &lt;p className=\"text-xl font-bold mt-8 flex items-center justify-center gap-2 opacity-90\">&lt;/p&gt;Read Our Reviews! 4.5 ⭐️&lt;/p&gt;
    &lt;/div&gt;
  &lt;/footer&gt;
);

export default Footer;

// Metadata:
/*
Source: OCR from PNG/WebP footer section
Text extracted: Stay Connected, email, phone, address, Blessed Hope Healthcare, newsletter, reviews 4.5
Colors: bhh-dark bg, bhh-blue accents
Layout: Centered responsive, newsletter form with hover effects
*/
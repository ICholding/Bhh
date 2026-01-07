import React from 'react';

const partners = ['PayPal', 'Lenovo', 'Walmart', 'Lowes', 'Marshalls'];

const Partners: React.FC = () =&gt; (
  &lt;div className=\"flex flex-wrap gap-4 justify-center lg:justify-end items-center flex-1 max-w-2xl\">&lt;/div&gt;
    {partners.map((name) =&gt; (
      &lt;div 
        key={name} 
        className=\"w-28 h-14 bg-gradient-to-br from-bhh-blue via-bhh-blue-light to-bhh-blue2 shadow-2xl hover:shadow-bhh-blue/50 hover:scale-[1.05] transition-all duration-300 rounded-2xl border border-white/30 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-sm uppercase tracking-wide cursor-pointer\"
      &gt;
        {name}
      &lt;/div&gt;
    ))}
  &lt;/div&gt;
);

export default Partners;

// Metadata:
/*
Source: OCR from main PNG header - partner logos (PayPal, Lenovo, Walmart, Lowes, Marshalls)
Description: Horizontal scrollable/responsive partner badges with gradient, shadow, hover effects
Colors: bhh-blue gradient, white text
Layout: Flex wrap, w-28 h-14 rounded 2xl, hover scale 1.05
*/
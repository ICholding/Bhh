import React from 'react';

interface BHHLogoProps {
  size?: number;
  className?: string;
}

const BHHLogo: React.FC&lt;BHHLogoProps&gt; = ({ size = 200, className = '' }) =&gt; (
  &lt;svg 
    width={size} 
    height={size} 
    viewBox=\"0 0 200 200\" 
    className={className}
    xmlns=\"http://www.w3.org/2000/svg\"
  &gt;
    &lt;defs&gt;
      &lt;radialGradient id=\"bhh-grad\" cx=\"50%\" cy=\"50%\"&gt;
        &lt;stop offset=\"0%\" stopColor=\"#60A5FA\"/&gt;
        &lt;stop offset=\"70%\" stopColor=\"#3B82F6\"/&gt;
        &lt;stop offset=\"100%\" stopColor=\"#1D4ED8\"/&gt;
      &lt;/radialGradient&gt;
    &lt;/defs&gt;
    &lt;circle cx=\"100\" cy=\"100\" r=\"95\" fill=\"url(#bhh-grad)\" stroke=\"#1E3A8A\" strokeWidth=\"3\" strokeLinecap=\"round\"/&gt;
    &lt;text 
      x=\"100\" 
      y=\"105\" 
      textAnchor=\"middle\" 
      fontFamily=\"-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif\" 
      fontSize=\"52\" 
      fontWeight=\"800\" 
      fill=\"#FFFFFF\" 
      letterSpacing=\"0.05em\" 
      stroke=\"#F8FAFC\" 
      strokeWidth=\"0.5\" 
      paintOrder=\"stroke stroke\"
    &gt;
      BHH
    &lt;/text&gt;
  &lt;/svg&gt;
);

export default BHHLogo;

// Metadata:
/*
Source: Extracted from 1536x1024 PNG and 900x596 WebP
Description: Round circular BHH logo for Blessed Hope Healthcare
Dimensions: Scalable SVG, recommended 200x200px
Colors: Radial gradient #60A5FA -&gt; #3B82F6 -&gt; #1D4ED8, stroke #1E3A8A, text white w/ stroke
Font: System sans-serif bold 52pt
Curves: Circle r=95 stroke=3
Text positioning: Centered x=100 y=105, letter-spacing 0.05em
*/
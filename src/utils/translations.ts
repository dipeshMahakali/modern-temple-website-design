/**
 * Comprehensive Translations Dictionary
 * Supports English (EN), Hindi (HI), and Chhattisgarhi (CG)
 */

export type Language = 'EN' | 'HI' | 'CG';

export const dictionary: Record<string, Record<Language, string>> = {
  // Navigation Slugs (Compact & Sleek)
  'home': {
    EN: 'Home',
    HI: 'मुख्य',
    CG: 'पहली',
  },
  'about': {
    EN: 'About',
    HI: 'परिचय',
    CG: 'जानकारी',
  },
  'history': {
    EN: 'History',
    HI: 'इतिहास',
    CG: 'इतिहास',
  },
  'darshan': {
    EN: 'Darshan',
    HI: 'दर्शन',
    CG: 'दर्शन',
  },
  'events': {
    EN: 'Events',
    HI: 'उत्सव',
    CG: 'तिहार',
  },
  'gallery': {
    EN: 'Gallery',
    HI: 'वीथिका',
    CG: 'फोटो',
  },
  'trust': {
    EN: 'Trust',
    HI: 'ट्रस्ट',
    CG: 'ट्रस्ट',
  },
  'donate': {
    EN: 'Donate',
    HI: 'दान',
    CG: 'दान',
  },
  'contact': {
    EN: 'Contact',
    HI: 'संपर्क',
    CG: 'संपर्क',
  },
  'instructions': {
    EN: 'Guidelines',
    HI: 'निर्देश',
    CG: 'नियम',
  },

  // Buttons & CTAs
  'watch_live': {
    EN: 'Watch Live Darshan',
    HI: 'लाइव दर्शन देखें',
    CG: 'लाइव दर्शन देखव',
  },
  'search_placeholder': {
    EN: 'Search...',
    HI: 'खोजें...',
    CG: 'खोजव...',
  },
  'temple_title': {
    EN: 'Jay Maa Bamleshwari',
    HI: 'जय माँ बम्लेश्वरी',
    CG: 'जय माँ बम्लेश्वरी',
  },
  'temple_subtitle': {
    EN: 'Dongargarh Temple',
    HI: 'डोंगरगढ़ मंदिर',
    CG: 'डोंगरगढ़ मंदिर',
  },
  'timings_title': {
    EN: 'Darshan & Aarti Timings',
    HI: 'दर्शन एवं आरती समय',
    CG: 'दर्शन अउ आरती के बेरा',
  },
  'morning_aarti': {
    EN: 'Morning Aarti',
    HI: 'प्रातः आरती',
    CG: 'बिहनिया आरती',
  },
  'evening_aarti': {
    EN: 'Evening Aarti',
    HI: 'संध्या आरती',
    CG: 'संझा आरती',
  },
  'trustees_title': {
    EN: 'Temple Board of Trustees',
    HI: 'मंदिर ट्रस्टी बोर्ड',
    CG: 'मंदिर ट्रस्टी बोर्ड',
  },
  'quick_links': {
    EN: 'Quick Links',
    HI: 'त्वरित संपर्क',
    CG: 'झटपट लिंक',
  },
  'footer_rights': {
    EN: 'All Rights Reserved. Dongargarh Maa Bamleshwari Temple Trust.',
    HI: 'सर्वाधिकार सुरक्षित। डोंगरगढ़ माँ बम्लेश्वरी मंदिर ट्रस्ट।',
    CG: 'सबो अधिकार सुरक्षित। डोंगरगढ़ माँ बम्लेश्वरी मंदिर ट्रस्ट।',
  },
};

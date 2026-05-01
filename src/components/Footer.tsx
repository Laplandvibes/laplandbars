import { Link } from 'react-router-dom';
import Logo from './Logo';

const ecosystemLinks = [
  {
    category: 'STAY',
    links: [
      { label: 'LaplandStays.com', href: 'https://laplandstays.com' },
      { label: 'LaplandHotelDeals.com', href: 'https://laplandhoteldeals.com' },
      { label: 'LaplandKids.com', href: 'https://laplandkids.com' },
    ],
  },
  {
    category: 'EAT & DRINK',
    links: [
      { label: 'LaplandDining.com', href: 'https://laplanddining.com' },
      { label: 'LaplandFood.com', href: 'https://laplandfood.com' },
      { label: 'LaplandBars.com', href: 'https://laplandbars.com' },
    ],
  },
  {
    category: 'DO',
    links: [
      { label: 'LaplandActivities.online', href: 'https://laplandactivities.online' },
      { label: 'LaplandHuskySafaris.com', href: 'https://laplandhuskysafaris.com' },
      { label: 'LaplandSkiResorts.com', href: 'https://laplandskiresorts.com' },
      { label: 'LaplandSnowmobile.com', href: 'https://laplandsnowmobile.com' },
      { label: 'LaplandNightlife.com', href: 'https://laplandnightlife.com' },
    ],
  },
  {
    category: 'EXPLORE',
    links: [
      { label: 'LaplandNature.com', href: 'https://laplandnature.com' },
      { label: 'LaplandVisit.com', href: 'https://laplandvisit.com' },
      { label: 'LaplandGifts.com', href: 'https://laplandgifts.com' },
    ],
  },
  {
    category: 'DEALS',
    links: [
      { label: 'LaplandDeals.com', href: 'https://laplanddeals.com' },
      { label: 'LaplandTransport.com', href: 'https://laplandtransport.com' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-night border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 pb-12 border-b border-white/10">
          <div>
            <Logo className="mb-3" light />
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              The definitive guide to bars, pubs, ice bars and nightlife in Finnish Lapland.
            </p>
          </div>
          <a
            href="https://laplandvibes.com"
            className="flex items-center gap-2 px-4 py-2 border border-amber/30 rounded-full text-amber text-sm hover:bg-amber/10 transition-colors no-underline"
          >
            LaplandVibes Hub
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {ecosystemLinks.map((section) => (
            <div key={section.category}>
              <h4 className="font-heading text-amber tracking-widest text-sm mb-4 [text-shadow:0_0_20px_rgba(245,158,11,0.4)]">
                {section.category}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/40 hover:text-white/80 text-sm transition-colors no-underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 text-white/30 text-sm">
          <p>© {new Date().getFullYear()} LaplandBars — Part of the LaplandVibes ecosystem</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white/60 transition-colors no-underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white/60 transition-colors no-underline">Terms of Service</Link>
            <Link to="/about" className="hover:text-white/60 transition-colors no-underline">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

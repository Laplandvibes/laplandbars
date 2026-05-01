import { Link } from 'react-router-dom';
import PageSeo from '../components/PageSeo';

export default function About() {
  return (
    <div className="min-h-screen bg-night pt-24 pb-20">
      <PageSeo
        title="About LaplandBars"
        description="Who runs LaplandBars, why we exist, and how we verify what we publish. Operated by Lapeso Oy."
        path="/about"
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-5xl text-white tracking-wide mb-8">About LaplandBars</h1>
        <div className="space-y-5 text-white/60 leading-relaxed">
          <p>
            LaplandBars is a guide to bars, pubs, ice bars and nightlife venues across Finnish Lapland —
            built by people who have actually been there, not generated from databases.
          </p>
          <p>
            Every venue listed on this site has been verified as real, open, and worth your time.
            We cover Rovaniemi, Levi, Ylläs and Saariselkä — the four main destinations in Finnish Lapland —
            and we update the listings as venues open, close and change.
          </p>
          <p>
            LaplandBars is part of the <a href="https://laplandvibes.com" className="text-amber hover:text-amber/80">LaplandVibes</a> ecosystem —
            a network of niche travel sites covering every aspect of Finnish Lapland.
          </p>
          <p>
            The site is operated by Lapeso Oy (Finland). Questions or corrections:{' '}
            <a href="mailto:info@laplandvibes.com" className="text-amber hover:text-amber/80">info@laplandvibes.com</a>
          </p>
        </div>
        <div className="mt-10">
          <Link to="/" className="text-amber hover:text-amber/80 no-underline font-medium">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}

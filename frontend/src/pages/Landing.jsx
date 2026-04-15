// Homepage — hero, features, stats, success stories preview
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Zap, Gift, Heart, CheckCircle } from 'lucide-react';

// Dummy success stories (hardcoded for demo)
const stories = [
  { names: 'Priya & Rahul', location: 'Pune', story: 'Found each other in 2 weeks. Married in 6 months!', img: 'https://ui-avatars.com/api/?name=PR&background=C0392B&color=fff' },
  { names: 'Sneha & Arjun', location: 'Mumbai', story: 'Values compatibility score was 94%. Perfect match!', img: 'https://ui-avatars.com/api/?name=SA&background=E67E22&color=fff' },
  { names: 'Kavya & Dev', location: 'Nagpur', story: 'Both loved Marathi culture. BandhanPlus connected us.', img: 'https://ui-avatars.com/api/?name=KD&background=27AE60&color=fff' },
];

const features = [
  { icon: Shield, title: '100% Verified Profiles', desc: 'Every profile manually verified. Govt ID required. No fakes, guaranteed.', color: 'text-green-600 bg-green-50' },
  { icon: Lock, title: 'Privacy First', desc: 'Photos stay blurred until both sides show interest. Your privacy is sacred.', color: 'text-blue-600 bg-blue-50' },
  { icon: Zap, title: 'Smart Compatibility', desc: 'Our algorithm matches on values, lifestyle, family culture — not just age.', color: 'text-amber-600 bg-amber-50' },
  { icon: Gift, title: 'Free to Connect', desc: 'No paywalls. No pushy calls. Send interest and chat for free.', color: 'text-rose-600 bg-rose-50' },
];

const Landing = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">

      {/* ── HERO SECTION ─────────────────────────────────────── */}
      <section className="relative bg-[url('/hero-bg.png')] bg-cover bg-center bg-no-repeat min-h-[650px] flex items-center py-20 px-4">
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center gap-8 w-full px-4">
          
          <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-200 px-5 py-2.5 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-rose-400/30">
            <Heart size={16} className="fill-rose-500" /> India's Most Trusted Marriage Bureau
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
            {t('hero.title')}
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-200 mb-10 leading-relaxed max-w-3xl drop-shadow-md">
            {t('hero.subtitle')}
          </p>

          {/* Stats row */}
          <div className="flex gap-8 justify-center mb-10">
            {[['500+', 'Verified Profiles'], ['200+', 'Matches Made'], ['98%', 'Trust Score']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-rose-400">{num}</div>
                <div className="text-xs lg:text-sm text-gray-300 font-medium tracking-wide uppercase mt-2">{label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register"
              className="bg-rose-600 text-white px-8 py-4 rounded-2xl text-xl font-bold hover:bg-rose-700 shadow-xl shadow-rose-600/30 transition-all flex items-center gap-2">
              {t('hero.cta')} <span className="text-xl">→</span>
            </Link>
            <Link to="/login"
              className="border-2 border-white/40 text-white px-8 py-4 rounded-2xl text-xl font-medium hover:bg-white/10 backdrop-blur-md transition-all">
              {t('hero.login')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY US SECTION ───────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Why BandhanPlus is Different</h2>
          <p className="text-center text-gray-500 mb-12">We fixed everything that's broken about matrimony sites</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUCCESS STORIES ──────────────────────────────────── */}
      <section className="py-16 px-4 bg-rose-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">💑 Happy Couples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map((s) => (
              <div key={s.names} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <img src={s.img} alt={s.names} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="font-bold text-gray-800">{s.names}</div>
                    <div className="text-gray-500 text-sm">{s.location}</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic">"{s.story}"</p>
                <div className="flex mt-3">{'⭐'.repeat(5)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Heart className="text-rose-400 fill-rose-400" size={20} />
          <span className="text-xl font-bold">BandhanPlus</span>
        </div>
        <p className="text-gray-400 text-sm">Verified Matches. Real Connections. © 2026 BandhanPlus</p>
        <p className="text-gray-600 text-xs mt-2">This website is strictly for matrimonial purposes only.</p>
      </footer>
    </div>
  );
};

export default Landing;
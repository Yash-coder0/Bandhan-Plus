// Public success stories page
import { Heart } from 'lucide-react';

const stories = [
  { names: 'Priya & Rahul', location: 'Pune, Maharashtra', duration: 'Met on BandhanPlus, Married in 6 months', story: 'We were both skeptical of matrimony sites. But BandhanPlus was different — no spam calls, no fake profiles. The compatibility score showed 91% and it was absolutely right!', img: 'https://ui-avatars.com/api/?name=PR&background=C0392B&color=fff&size=150' },
  { names: 'Sneha & Arjun', location: 'Mumbai, Maharashtra', duration: 'Married after 4 months', story: 'The video introduction feature was what made me interested in Arjun. I could see his genuine personality before we even spoke. BandhanPlus gave us privacy and trust.', img: 'https://ui-avatars.com/api/?name=SA&background=E67E22&color=fff&size=150' },
  { names: 'Kavya & Dev', location: 'Nagpur, Maharashtra', duration: 'Happily married for 1 year', story: 'As a Marathi family, we loved the regional language support. We could browse and communicate in Marathi which felt like home.', img: 'https://ui-avatars.com/api/?name=KD&background=27AE60&color=fff&size=150' },
  { names: 'Meera & Vikram', location: 'Nashik, Maharashtra', duration: 'Met and married within 8 months', story: 'What I loved most was the blurred photo privacy feature. I felt safe. Only genuine people reach out because they respect the system.', img: 'https://ui-avatars.com/api/?name=MV&background=8E44AD&color=fff&size=150' },
];

const SuccessStories = () => (
  <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 py-12 px-4">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <Heart className="text-rose-600 fill-rose-600 mx-auto mb-3" size={40} />
        <h1 className="text-4xl font-bold text-gray-900 mb-3">💑 Happy Couples</h1>
        <p className="text-gray-600 text-lg">Real stories from real people who found their match on BandhanPlus</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map(s => (
          <div key={s.names} className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <img src={s.img} alt={s.names} className="w-16 h-16 rounded-full border-4 border-rose-100" />
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{s.names}</h3>
                <p className="text-gray-500 text-sm">{s.location}</p>
                <p className="text-rose-600 text-xs font-medium">{s.duration}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed italic">"{s.story}"</p>
            <div className="flex mt-4">{'⭐'.repeat(5)}</div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">Ready to write your own success story?</p>
        <a href="/register" className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-rose-700 inline-block">
          Register Free Today 💍
        </a>
      </div>
    </div>
  </div>
);

export default SuccessStories;
import Link from "next/link";
import { Droplets } from "lucide-react";
import { SOCIAL_LINKS } from "../constance/data/costance";


const footerLinks = {
  Navigation: ["Home", "Features", "Community", "Monitoring"],
  Company: ["About Us", "Contact", "Blog", "Careers"],
  Support: ["Help Center", "Privacy Policy", "Terms of Use", "FAQ"],

};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-6">

        {/* Top grid */}
       <div className="grid grid-cols-2 gap-10 mb-12">  {/* 2 col: left brand, right links */}

  {/* LEFT — Brand */}
  <div>
    <Link href="/" className="flex items-center gap-2 mb-3">
      <div className="w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center">
        <Droplets className="w-5 h-5 text-white" />
      </div>
      <span className="text-lg font-bold text-blue-400">
        Clean<span className="text-blue-300">Hand</span>
      </span>
    </Link>
    <p className="text-sm text-slate-500 leading-relaxed max-w-[260px]">
      Building healthier handwash habits for everyone — one rinse at a time.
    </p>
    <div className="flex gap-2 mt-5">
      {SOCIAL_LINKS.map((s) => (
        <a
          key={s.alt}
          href={s.href}
        target="_blank"
            rel="noopener noreferrer"
            
            className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-700 flex items-center justify-center transition-colors"
          >
            <img src={s.src} alt={s.alt} className="w-4 h-4" />
          </a>
      ))}
    </div>
  </div>

  {/* RIGHT — Link columns */}
  <div className="grid grid-cols-3 gap-8">
    {Object.entries(footerLinks).map(([title, items]) => (
      <div key={title}>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
          {title}
        </h4>
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li key={item}>
              <Link
                href={`/${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm text-slate-500 hover:text-blue-400 transition-colors"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>

</div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CleanHand. All rights reserved.
          </p>
          <span className="flex items-center gap-2 text-xs text-blue-400 bg-slate-800 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

const navItems = [
  { title: "Feedbacks", url: "/feedbacks", emoji: "💬" },
  { title: "Comemorações", url: "/comemoracoes", emoji: "🎉" },
  { title: "Gratidão", url: "/gratidao", emoji: "🙏" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="md:hidden">
      <header className="flex items-center justify-between px-4 py-3 gradient-brand">
        <h1 className="text-xl font-extrabold text-white">Elogie+</h1>
        <button onClick={() => setOpen(!open)} className="text-white p-1">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>
      {open && (
        <nav className="gradient-brand-vertical px-4 py-2 space-y-1 animate-fade-in">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                end
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 font-medium transition-all ${
                  isActive ? "bg-white/20 text-white" : ""
                }`}
                activeClassName="bg-white/20 text-white"
                onClick={() => setOpen(false)}
              >
                <span className="text-lg">{item.emoji}</span>
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      )}
    </div>
  );
}

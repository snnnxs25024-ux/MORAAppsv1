
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Box, 
  LayoutDashboard, 
  Fingerprint, 
  UserCircle2 
} from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const logoUrl = "https://i.imgur.com/TbEb7Hr.png";

  const navItems = [
    { 
      icon: <Box />, 
      label: 'Tugas', 
      path: '/deliveries'
    },
    { 
      icon: <LayoutDashboard />, 
      label: 'Statistik', 
      path: '/performance'
    },
    { 
      label: 'Beranda', 
      path: '/', 
      isLogo: true 
    },
    { 
      icon: <Fingerprint />, 
      label: 'Absensi', 
      path: '/attendance'
    },
    { 
      icon: <UserCircle2 />, 
      label: 'Profil', 
      path: '/profile'
    },
  ];

  const containerFillColor = "#0022FF"; 

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pointer-events-none">
      <div className="relative max-w-md mx-auto pointer-events-auto h-[60px]">
        
        {/* BINGKAI NOTCHED - SLEEK & MODERN */}
        <div className="absolute inset-0 drop-shadow-[0_-10px_25px_rgba(0,34,255,0.2)]">
          <svg 
            viewBox="0 0 375 60" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path 
              d="M0 20 
                 C0 8.9543 8.9543 0 20 0 
                 H120 
                 C135 0 145 2 155 15 
                 C165 30 175 42 187.5 42 
                 C200 42 210 30 220 15 
                 C230 2 240 0 255 0 
                 H355 
                 C366.046 0 375 8.9543 375 20 
                 V60 
                 H0 
                 V20Z" 
              fill={containerFillColor}
            />
          </svg>
        </div>

        {/* KONTEN MENU NAVIGATION */}
        <div className="relative z-10 flex items-center justify-between h-full px-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={index}
                to={item.path}
                aria-label={item.label}
                className={`
                  relative flex flex-col items-center justify-center transition-all duration-300 flex-1 h-full
                  ${item.isLogo ? 'z-20 -mt-8' : ''}
                `}
              >
                {item.isLogo ? (
                  /* LOGO MORA - TRANSPARAN TANPA BACKGROUND */
                  <div className={`
                    w-16 h-16 flex items-center justify-center transition-all duration-500
                    ${isActive ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'opacity-100'}
                  `}>
                    <img 
                      src={logoUrl} 
                      alt="Mora Logo" 
                      className="w-14 h-14 object-contain" 
                    />
                  </div>
                ) : (
                  /* IKON MENU - WARNA KONTRAS & POSISI TENGAH */
                  <div className="flex flex-col items-center justify-center w-full">
                    <div className={`
                      transition-all duration-300 transform flex flex-col items-center
                      ${isActive 
                        ? 'text-white scale-110' 
                        : 'text-white hover:text-white/70'}
                    `}>
                      {item.icon && React.cloneElement(item.icon as React.ReactElement<any>, {
                        size: 22, 
                        strokeWidth: isActive ? 2.5 : 2,
                        color: 'currentColor'
                      })}

                      {/* Indikator Aktif Minimalis */}
                      <div className={`
                        w-1 h-1 rounded-full bg-white mt-1.5 transition-all duration-500 shadow-[0_0_8px_white]
                        ${isActive ? 'opacity-100' : 'opacity-0'}
                      `} />
                    </div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;

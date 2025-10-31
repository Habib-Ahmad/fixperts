import twitter from '@/assets/twitter.svg';
import instagram from '@/assets/instagram.svg';
import discord from '@/assets/discord.svg';
import { Link } from 'react-router-dom';

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

const footerSections: Record<string, FooterLink[]> = {
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Careers', href: '/careers' },
  ],
  Support: [
    { label: 'Contact', href: '/contact' },
    { label: 'Help Center', href: '/help' },
    { label: 'FAQ', href: '/faq' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
  ],
  'Follow Us': [
    { label: 'Twitter', href: 'https://twitter.com/fixperts', external: true },
    { label: 'Instagram', href: 'https://instagram.com/fixperts', external: true },
    { label: 'Discord', href: 'https://discord.gg/fixperts', external: true },
  ],
};

const socialIcons: Record<string, React.ReactNode> = {
  Twitter: <img src={twitter} alt="Twitter" className="w-4 h-4" />,
  Instagram: <img src={instagram} alt="Instagram" className="w-4 h-4" />,
  Discord: <img src={discord} alt="Discord" className="w-4 h-4" />,
};

const Footer = () => {
  return (
    <footer className="px-[5vw] sm:px-[10vw] pt-12 pb-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {Object.entries(footerSections).map(([section, links]) => (
          <div key={section}>
            <h3 className="font-semibold mb-4">{section}</h3>
            <ul className="space-y-2">
              {links.map(({ label, href, external }) => (
                <Link
                  key={label}
                  to={href}
                  target={external ? '_blank' : '_self'}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="hover:text-primary flex items-center gap-2"
                >
                  {socialIcons[label] && <span>{socialIcons[label]}</span>}
                  {label}
                </Link>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 mt-10 pt-4 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} Fixperts. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

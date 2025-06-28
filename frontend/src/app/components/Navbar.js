'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Quiz Generator', href: '/' },
    { name: 'AI Tutor', href: '/tutor' },
    user && { name: 'History', href: '/history' },
  ].filter(Boolean);

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.activeLink : ''}`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.authControls}>
        {user ? (
          <>
            <span className={styles.welcome}>Welcome, {user.username}!</span>
            <button onClick={logout} className={styles.logoutButton}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.loginLink}>Login</Link>
            <Link href="/register" className={styles.registerButton}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

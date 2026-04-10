import React from 'react';
import { Mail, Phone, Github, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, var(--bg-deep) 0%, #060e1a 100%)',
      borderTop: '1px solid rgba(0, 212, 255, 0.06)',
      marginTop: '40px',
    }}>
      {/* Main Content */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '60px 24px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '48px',
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 212, 255, 0.2)',
            }}>
              <img src="/Tem.png" alt="TEM" style={{ width: '22px', height: '22px', borderRadius: '4px' }} />
            </div>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>TEM</span>
          </div>
          <p style={{
            fontSize: '0.85rem',
            color: '#64748b',
            lineHeight: 1.7,
            maxWidth: '320px',
          }}>
            Track Every Moment — your personal productivity companion for managing tasks,
            tracking time, and analyzing performance to build better habits.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>Get in Touch</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <a href="mailto:agraharirishabh40204@gmail.com" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#94a3b8',
              fontSize: '0.85rem',
              textDecoration: 'none',
              transition: 'color 250ms ease',
            }}
            onMouseEnter={e => e.target.style.color = '#00d4ff'}
            onMouseLeave={e => e.target.style.color = '#94a3b8'}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(0, 212, 255, 0.06)',
                border: '1px solid rgba(0, 212, 255, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Mail size={14} color="#00d4ff" />
              </div>
              agraharirishabh40204@gmail.com
            </a>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#94a3b8',
              fontSize: '0.85rem',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(124, 58, 237, 0.06)',
                border: '1px solid rgba(124, 58, 237, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Phone size={14} color="#7c3aed" />
              </div>
              +91 6389841527
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>Features</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Task Management', 'Time Tracking', 'Performance Analytics', 'Daily Reports'].map(item => (
              <span key={item} style={{
                color: '#64748b',
                fontSize: '0.85rem',
                cursor: 'default',
                transition: 'color 250ms ease',
              }}
              onMouseEnter={e => e.target.style.color = '#94a3b8'}
              onMouseLeave={e => e.target.style.color = '#64748b'}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid rgba(148, 163, 184, 0.06)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
      }}>
        <p style={{
          fontSize: '0.8rem',
          color: '#475569',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          © {new Date().getFullYear()} TEM — Track Every Moment. Made with
          <Heart size={12} style={{ color: '#ef4444', fill: '#ef4444' }} />
          All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

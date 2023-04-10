import React from 'react';
import './HomePage.scss';
import { Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import LoginButton from '../components/LoginButton'

const HomePage = () => {
  // Animación del botón de llamado a la acción
  const [ctaSpring, setCTASpring] = useSpring(() => ({
    transform: 'scale(1)',
    from: { opacity: 0 },
    to: { opacity: 1 },
    from: { y: 1000 },
    to: { y: 0 },
  }));

  return (
    <div className="homepage">
      <header className="header">
        <nav className="header__nav">
          <Link to="/" className="header__logo">TICKETAPP</Link>
          <LoginButton/>
        </nav>
      </header>

      <section className="hero-section">
        <animated.div style={ctaSpring}>
        <div className="hero-section__content">
          <h1 className="hero-section__title">¡Organizá los mejores eventos de tu ciudad, de la manera más fácil posible!</h1>
          <p className="hero-section__subtitle">Accedé a todo lo que tenemos para ofrecerte.</p>
        </div>
        </animated.div>
      </section>

    
      <footer className="footer">
        <ul className="footer__menu">
          <li><Link to="/about">Acerca de nosotros</Link></li>
          <li><Link to="/terms">Términos y condiciones</Link></li>
          <li><Link to="/privacy">Política de privacidad</Link></li>
        </ul>
      
      </footer>
    </div>
  );
};

export default HomePage;
import Nav from './Nav';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Nav />
      <main id="main-content" className="main-content" role="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

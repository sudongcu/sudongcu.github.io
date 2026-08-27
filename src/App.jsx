import { Navbar, Hero, About, Experience, TechStack, Contact } from './components';
import Blog from './components/sections/Blog';
import CursorSnow from './components/ui/ice/CursorSnow';
import './App.css';

function App() {
  return (
    <div className="relative min-h-screen bg-abyss text-ice-100">
      <div className="noise" aria-hidden />
      <CursorSnow />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <TechStack />
        <Blog />
        <Contact />
      </main>
    </div>
  );
}

export default App;

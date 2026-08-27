import { Navbar, Hero, About, Experience, TechStack, Contact } from './components';
import Blog from './components/sections/Blog';
import CursorSnow from './components/ui/ice/CursorSnow';
import SeasonProvider from './theme/SeasonProvider';
import SeasonTransition from './components/ui/SeasonTransition';
import './App.css';

function App() {
  return (
    <SeasonProvider>
      <div className="relative min-h-screen bg-abyss text-ice-100">
        <div className="noise" aria-hidden />
        <CursorSnow />
        <SeasonTransition />
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
    </SeasonProvider>
  );
}

export default App;

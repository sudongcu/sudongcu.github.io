import { Navbar, Hero, About, Experience, TechStack, Contact } from './components';
import Blog from './components/sections/Blog';
import './App.css';

function App() {
  return (
    <div className="relative min-h-screen bg-dark-900">
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


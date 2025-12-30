import { Navbar, Hero, About, Experience, TechStack, ProjectList, Contact } from './components';
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
        <ProjectList />
        <Contact />
      </main>
    </div>
  );
}

export default App;


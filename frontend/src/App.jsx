import ParticleBackground from './components/common/ParticleBackground';
import Router from './routes';

export default function App() {
  return (
    <div className="select-none">
      <ParticleBackground />
      <div className="relative z-10 h-screen text-white">
        <Router />
      </div>
    </div>
  );
}

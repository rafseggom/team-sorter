import { useState } from 'react';
import InitialConfig from './components/InitialConfig';
import RatingConfig from './components/RatingConfig';
import TeamDisplay from './components/TeamDisplay';
import { distributeTeamsRandom, distributeTeamsBalanced } from './utils/teamDistribution';
import './App.css';

function App() {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState(null);
  const [ratingConfig, setRatingConfig] = useState(null);
  const [teams, setTeams] = useState(null);

  const handleInitialConfig = (configData) => {
    setConfig(configData);
    setStep(2);
  };

  const handleRatingConfig = (ratingData) => {
    setRatingConfig(ratingData);
    
    let generatedTeams;
    if (ratingData.useRating) {
      generatedTeams = distributeTeamsBalanced(
        config.players,
        config.numTeams,
        ratingData.ratings
      );
    } else {
      generatedTeams = distributeTeamsRandom(
        config.players,
        config.numTeams
      );
    }
    
    setTeams(generatedTeams);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setConfig(null);
    setRatingConfig(null);
    setTeams(null);
  };

  return (
    <div className="app">
      <div className="content-wrap">
        {step === 1 && <InitialConfig onNext={handleInitialConfig} />}
        {step === 2 && <RatingConfig config={config} onNext={handleRatingConfig} />}
        {step === 3 && (
          <TeamDisplay 
            teams={teams} 
            config={{ ...config, ...ratingConfig }} 
            onReset={handleReset} 
          />
        )}
      </div>

      <footer className="footer">
        <p>
          Desarrollado por{' '}
          <a 
            href="https://github.com/rafseggom" 
            target="_blank" 
            rel="noopener noreferrer"
            className="author-link"
          >
            rafseggom
          </a>
        </p>
        <a 
          href="https://github.com/rafseggom/team-sorter" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="github-icon"
          aria-label="Ver código en GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
      </footer>
    </div>
  );
}

export default App;
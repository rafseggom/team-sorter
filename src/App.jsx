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
  );
}

export default App;

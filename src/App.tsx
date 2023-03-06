import './App.css';
import * as iform from './InputForm';
import * as rdisplay from './RadarDisplay';

function App() {

  return (
    <div className="App">
      <header className="App-header">
       {iform.UserInput()}
       {rdisplay.ImageDisplay()}
      </header>
    </div>
  );
}

export default App;

import './App.css';
import * as iform from './InputForm';
import * as rdisplay from './radarDisplay';

function App() {
  // useState (formInput), then send setFormInput to UserInput and send formInput to ImageDisplay
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

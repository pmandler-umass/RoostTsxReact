import "./App.css";
import * as iform from "./InputForm";
import * as rdisplay from "./radarDisplay";

function App() {
  const track_data = rdisplay.loadTracks();
  
  // useState (formInput), then send setFormInput to UserInput and send formInput to ImageDisplay
  return (
    <div className="App">
      <header className="App-header">
        {iform.UserInput()}
        {rdisplay.ImageDisplay(track_data)}
      </header>
    </div>
  );
}

export default App;

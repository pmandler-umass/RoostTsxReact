import "./App.css";
import { useEffect, useState } from "react";
import { UserInput, defaultInput } from "./InputForm";
import * as roostData from "./radarDisplay";
import { ImageTrackViewer, ImageTrackProps } from "./imageTrackViewer";
import { Size } from "./utils";

// Top level - connects user input (UserInput) to display (ImageTrackViewer) and track edits to output
const viewer_size: Size = { width: 400, height: 400 };

function App() {
  const [userInputs, setUserInputs] = useState(defaultInput);
  const [trackViewProps, setTrackViewProps] = useState<ImageTrackProps>({
    elementSize: viewer_size,
    basepath: "",
    imageSeries: [],
    all_tracks: [],
  });
  const [comments, setComments] = useState("");

  useEffect(() => {
    // User changed input info - if it is complete, pick radar image and load appropriate tracks
    if (userInputs.dataset !== "") {
      var base_path = roostData.getImagePath(userInputs);
      var image_names = roostData.loadImages(base_path);
      var tracks = roostData.loadTracks(userInputs, image_names);
      var viewer_info: ImageTrackProps = {
        elementSize: viewer_size,
        basepath: base_path,
        imageSeries: image_names,
        all_tracks: tracks,
      };
      setTrackViewProps(viewer_info);
    }
    // eslint-disable-next-line
  }, [userInputs]);

  useEffect(() => {
    // TODO remove when comments used in saving
    if (comments !== "") {
      // Maybe show as part of save procedure?
      // Or will there be loading of csv's that would show comments?
      console.log("Comments: " + comments);
    }
    // eslint-disable-next-line
  }, [comments]);

  // Note: className are used by the App.css file for default styling
  return (
    <div className="App">
      <header className="App-header">
        {UserInput(setUserInputs, setComments)}
      </header>
      <div className="App-body">{ImageTrackViewer(trackViewProps)}</div>
    </div>
  );
}

export default App;

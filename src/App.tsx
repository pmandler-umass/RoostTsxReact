import "./App.css";
import { useEffect, useState } from "react";
import { UserInput, defaultInput } from "./InputForm";
import * as roostData from "./radarDisplay";
import { TrackInfo } from "./tracks";
import { ImageTrackViewer } from "./imageTrackViewer";
import { Size } from "./utils";

// Top level - connects user input to display and track edits to output

function App() {
  const [inputs, setInputs] = useState(defaultInput);
  const [trackData, setTrackData] = useState<TrackInfo[][]>([]);
  const [imagePath, setImagePath] = useState("");
  const [imageList, setImageList] = useState<string[]>([]);
  const [comments, setComments] = useState("");
  const viewer_size: Size = { width: 400, height: 400 };

  useEffect(() => {
    // User changed input info - if it is complete, pick radar image and load appropriate tracks
    if (inputs.dataset !== "") {
      var base_path = roostData.getImagePath(inputs);
      setImagePath(base_path);
      var image_names = roostData.loadImages(base_path);
      setImageList(image_names);
      setTrackData(roostData.loadTracks(inputs, image_names));
    }
    if (comments !== "") {
      // TODO remove when comments in use
      console.log("Comments: " + comments);
    }
    // eslint-disable-next-line
  }, [inputs]);

  return (
    <div className="App">
      <header className="App-header">
        {UserInput(setInputs, setComments)}
        {ImageTrackViewer(viewer_size, imagePath, imageList, trackData)}
      </header>
    </div>
  );
}

export default App;

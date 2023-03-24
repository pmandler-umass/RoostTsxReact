import './App.css';
import { useEffect, useState } from 'react';
import { UserInput, defaultInput } from './input-form';
import * as roostData from './roost-data';
import { ImageTrackViewer, ImageTrackProps } from './image-track-viewer';
import { Size } from './utils';
import * as trackCanvas from './track-canvas';

// Connects user input (UserInput) to display (ImageTrackViewer) and track edits to output
const viewer_size: Size = { width: 500, height: 500 };

function App() {
  const [userInputs, setUserInputs] = useState(defaultInput);
  const [trackViewProps, setTrackViewProps] = useState<ImageTrackProps>({
    elementSize: viewer_size,
    basepath: '',
    imageSeries: [],
    imageLength: 1,
    allTracks: [],
  });
  const [comments, setComments] = useState('');

  useEffect(() => {
    // User changed input info - if it is complete, pick radar image and load appropriate tracks
    if (userInputs.dataset !== '') {
      var base_path = roostData.getImagePath(userInputs);
      var image_names = roostData.loadImageFilenames(base_path);
      var tracks = roostData.loadTracks(userInputs, image_names);
      var viewer_info: ImageTrackProps = {
        elementSize: viewer_size,
        basepath: base_path,
        imageSeries: image_names,
        imageLength: roostData.RADAR_PNG_LENGTH,
        allTracks: tracks,
      };
      setTrackViewProps(viewer_info);
    }
    // eslint-disable-next-line
  }, [userInputs]);

  useEffect(() => {
    // TODO remove when comments used in saving
    if (comments !== '') {
      // Maybe show as part of save procedure?
      // Or will there be loading of csv's that would show comments?
      console.log('Comments: ' + comments);
    }
    // eslint-disable-next-line
  }, [comments]);

  // Note: className are used by the App.css file for default styling
  return (
    <div className='App'>
      <header className='App-header'>
        {UserInput(setUserInputs, setComments)}
      </header>
      <div className='App-body'>
        {ImageTrackViewer(trackViewProps)}
      </div>
      <svg style={{ width: trackCanvas.CANVAS_WIDTH + 'px', height: trackCanvas.CANVAS_HEIGHT + 'px', color: 'orange', border: '1px solid silver' }}>
        <trackCanvas.DraggableCircle initX={viewer_size.width * .75} initY={viewer_size.width/2} color='green' />
      </svg>
    </div>
  );
}

export default App;

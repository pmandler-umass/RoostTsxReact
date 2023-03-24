// handles a set(usually a timeseries) of images with overlayed tracks
// at any one time a single image is shown with associated tracks
import { useEffect, useState } from 'react';
import { BackgroundImage, Text } from '@mantine/core';
import TracksCanvas, { TracksCanvasProps } from './canvas';
import { TrackInfo } from './tracks';
import { Size } from './utils';

// Properties for displaying a time series of images with tracks
export interface ImageTrackProps {
  elementSize: Size;        // size of displayed image
  basepath: string;         // parent directory for all images in this series 
  imageSeries: string[];    // filenames of all images
  imageLength: number;      // number of pixels in source image
  allTracks: TrackInfo[][]; // information for each track
}

export const ImageTrackViewer = (props: ImageTrackProps) => {
  // The default imagePath doesn't actually locate the png, 
  // but with it defined the BackgroundImage can create the proper sized element.
  const [imagePath, setImagePath] = useState('/.placeholder.png');
  const [imageSize, setImageSize] = useState<Size>(props.elementSize);
  const [labelText, setLabelText] = useState('');
  const [imageTracks, setImageTracks] = useState<TrackInfo[][]>([[]]);
  const [imageIndex, setImageIndex] = useState(-1);
  const [numImages, setNumImages] = useState(0);
  const [keyDown, setKeyDown] = useState('');
  const [trackCanvasProps, setTrackCanvasProps] = useState<TracksCanvasProps>({
    canvasSize: props.elementSize,
    trackBoxes: [],
    scale: 1,
  });

  useEffect(() => {
    // listen for keyboard events
    window.addEventListener('keydown',  (e) => {
      setKeyDown(e.key);
    }); 
     window.addEventListener('keyup', (e) => {
      setKeyDown("");
    }); 
    // eslint-disable-next-line
  }, []); 


  // called when any key is pressed.
  // If it is an left or right arrow, move forward or back in the series of images
  useEffect(() => {
    if (keyDown === 'ArrowRight') {
      if (imageIndex < (numImages - 1)) {
        setImageIndex(imageIndex+1);
      }
    }
    else if (keyDown === 'ArrowLeft') {
      if (imageIndex > 0) {
        setImageIndex(imageIndex-1);
      }
    }  
    else if (keyDown !== 'pink') {
      // clear key down so it can get the next event
      setKeyDown('pink');
    }
    // eslint-disable-next-line
  }, [keyDown, setKeyDown]);

  useEffect(() => {
    // update the viewer for new image/track - new series or changed frame
    if (imageIndex >= 0) {    // PAM will this get called if props change, but still on same index?
      setImagePath(props.basepath + props.imageSeries[imageIndex]);
      setLabelText(props.imageSeries[imageIndex]);
      if (props.allTracks.length > 0) {
        // update just the tracks
        var temp = trackCanvasProps;
        temp.trackBoxes = imageTracks[imageIndex];
        setTrackCanvasProps(temp);
      }
    }
    // eslint-disable-next-line
  }, [imageIndex, imagePath]);

  useEffect(() => {
    // New day/series of images.
    setImageSize(props.elementSize);
    setImageIndex(0); 


    // load in tracks / image
    var track_data: TrackInfo[][] = [];
    // create an empty set of tracks for each image
    for (var i = 0; i <= props.imageSeries.length; i++) {
      var image_tracks: TrackInfo[] = [];
      track_data.push(image_tracks);
    }
    for (var track of props.allTracks) {
      for (var track_box of track) {
        // find index of image
        let fileindex = props.imageSeries.indexOf(track_box.imageName);
        if (fileindex < 0) {
          console.log('ERROR file not found: ' + track_box.imageName);
          continue;
        }
        track_data[fileindex].push(track_box);
      }
    }
    setImageTracks(track_data);
    // initialize with no tracks
    setTrackCanvasProps({ canvasSize: props.elementSize, trackBoxes: [], scale: 1 });
    setNumImages(props.imageSeries.length);
    setImagePath('');
    // eslint-disable-next-line
  }, [props]);

  // TODO when return to 2 radars, may want to use <SimpleGrid cols={2}> from Mantine
  // BackgroundImage is the radar image.
  // TracksCanvas is overlayed to show the bounding boxes of the tracks.
  return (
    <div>
      <div>
        <Text size='sm'> {labelText} </Text>
        <BackgroundImage
          src={imagePath}
          radius='xs'
          miw={imageSize.width}
          mih={imageSize.height}
        >
          {TracksCanvas(trackCanvasProps)}
        </BackgroundImage>
      </div>
      <Text> Radar </Text>
    </div>
  );
}

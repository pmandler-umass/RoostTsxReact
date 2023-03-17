// handles a set(usually a timeseries) of images with overlayed tracks
// at any one time a single image is shown with associated tracks
import { useEffect, useState } from "react";
import { BackgroundImage, Text } from "@mantine/core";
import TracksCanvas, { TracksCanvasProps } from "./canvas";
import { TrackInfo } from "./tracks";
import { Size } from "./utils";

export interface ImageTrackProps {
  elementSize: Size;
  basepath: string;
  imageSeries: string[];
  all_tracks: TrackInfo[][];
}

export function ImageTrackViewer(props: ImageTrackProps) {
  // The default imagePath doesn't actually locate the png, but with it defined the BackgroundImage can create the proper sized element.
  const [imagePath, setImagePath] = useState("/.placeholder.png");
  const [trackCanvasProps, setTrackCanvasProps] = useState<TracksCanvasProps>({
    canvasSize: props.elementSize,
    trackBoxes: [],
  });
  const [imageSize, setImageSize] = useState<Size>(props.elementSize);
  const [labelText, setLabelText] = useState("");

  // TODO handle moving forward and back through images (change index)
  useEffect(() => {
    // This gets called when the user changes the InputForm selections.
    setImageSize(props.elementSize);
    if (props.imageSeries.length > 0) {
      var index = 0;
      setImagePath(props.basepath + props.imageSeries[index]);
      setLabelText(props.imageSeries[index]);
      if (props.all_tracks.length > 0) {
        setTrackCanvasProps({
          canvasSize: props.elementSize,
          trackBoxes: props.all_tracks[index],
        });
        console.log("imageTrackView has tracks");
      }
    } else {
      // before the data is selected, this initializes the canvas element to the correct size.
      setTrackCanvasProps({ canvasSize: props.elementSize, trackBoxes: [] });
    }
    // eslint-disable-next-line
  }, [props]);

  // TODO when return to 2 radars, may want to use <SimpleGrid cols={2}> from Mantine
  // BackgroundImage is the radar image.
  // TracksCanvas is overlayed to show the bounding boxes of the tracks.
  return (
    <div>
      <div>
        <Text> {labelText} </Text>
        <BackgroundImage
          src={imagePath}
          radius="xs"
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

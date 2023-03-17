// display image and track
import { useEffect, useState } from "react";
import { BackgroundImage, Text } from "@mantine/core";
import TracksCanvas, { TracksCanvasProps} from "./canvas";
import { TrackInfo } from "./tracks";
import { Size } from "./utils";

export interface ImageTrackProps {
  elementSize: Size,
  basepath: string,
  imageSeries: string[],
  all_tracks: TrackInfo[][]
}

export function ImageTrackViewer(props: ImageTrackProps) {
  // TODO doesn't actually locate the png, but does the job of holding the space
  const [image_path, setImagePath] = useState("/.placeholder.png");
  const [trackCanvasProps, setTrackCanvasProps] = useState<TracksCanvasProps>({canvasSize: props.elementSize, trackBoxes: []});
  const [imageSize, setImageSize] = useState<Size>(props.elementSize);
  const [labelText, setLabelText] = useState("");

  // TODO handle moving forward and back through images (change index)
  useEffect(() => {
    setImageSize(props.elementSize);
    if (props.imageSeries.length > 0) {
      var index = 0;
      setImagePath(props.basepath + props.imageSeries[index]);
      setLabelText(props.imageSeries[index]);
      if (props.all_tracks.length > 0) {
        setTrackCanvasProps({canvasSize: props.elementSize, trackBoxes: props.all_tracks[index]});
        console.log("imageTrackView has tracks");
      }
    } else {
      setTrackCanvasProps({canvasSize: props.elementSize, trackBoxes: []});
    }
    // eslint-disable-next-line
  }, [props]);

  // PAM when return to 2 radars, may want to use <SimpleGrid cols={2}> from Mantine
  return (
    <div>
      <div>
        <Text> {labelText} </Text>
        <BackgroundImage
          src={image_path}
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

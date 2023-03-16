// display image and track
import { BackgroundImage, Text } from "@mantine/core";
import TracksCanvas from "./canvas";
import { TrackInfo } from "./tracks";
import { Size } from "./utils";

// updateTrackInfo: (arg: string) => void
export function ImageTrackViewer(
  elementSize: Size,
  basepath: string,
  imageSeries: string[],
  all_tracks: TrackInfo[][]
) {
  var image_path = __dirname + "/placeholder.png";
  var tracks: TrackInfo[] = [];
  // TODO handle moving forward and back through images
  if (imageSeries.length > 0) {
    var index = 0;
    image_path = basepath + imageSeries[index];
    if (all_tracks.length > 0) {
      tracks = all_tracks[index];
    }
  }

  // PAM when return to 2 radars, may want to use <SimpleGrid cols={2}> from Mantine
  return (
    <div>
      <div>
        <BackgroundImage
          src={image_path}
          radius="xs"
          miw={elementSize.width}
          mih={elementSize.height}
        >
          <div>{TracksCanvas(elementSize, tracks)}</div>
        </BackgroundImage>
      </div>
      <Text> Radar </Text>
    </div>
  );
}

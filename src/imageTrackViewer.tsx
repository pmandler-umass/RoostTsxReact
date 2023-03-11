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
  var index = 0;
  var imagePath = basepath + imageSeries[index];
  var tracks = all_tracks[index];

  // PAM when return to 2 radars, may want to use <SimpleGrid cols={2}> from Mantine
  return (
    <div>
      <div>
        <BackgroundImage
          src={imagePath}
          radius="xs"
          miw={elementSize.width}
          mih={elementSize.height}
        >
          {TracksCanvas(elementSize, tracks)}
        </BackgroundImage>
      </div>
      <Text> Radar </Text>
    </div>
  );
}

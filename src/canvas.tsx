import { useCallback, useEffect, useRef, useState } from 'react';
import { Text } from '@mantine/core';
import { Coordinate, Size } from './utils';
import { TrackInfo } from './tracks';

// TracksCanvas is a mostly blank with a bounding box for each track.
// TODO: handle mouse movements to edit the bounding boxes.
export interface TracksCanvasProps {
  canvasSize: Size;
  trackBoxes: TrackInfo[];
  scale: number;      // multiplier for where track is relative to image
  // TODO going to need a trackSetter as well
}

const TracksCanvas = (props: TracksCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosX, setMousePosX] = useState(0);
  const [mousePosY, setMousePosY] = useState(0);
  const lineWidth = 3;
  const trackColor = 'red';

  const handleMouseMove = (event: MouseEvent) => {
    // TODO the event.target doesn't seem to have the appropriate offset info
    setMousePosX(event.clientX - 0); //event.target.offsetLeft;);
    setMousePosY(event.clientY - 0); //event.target.offsetTop);
  };

  useEffect(() => {
    // initialize the canvas to the correct size
    // add a listener for mouse movements
    if (!canvasRef.current) {
      return;
    }
    // set size of canvas that tracks can be drawn on
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.height = props.canvasSize.height;
    canvas.width = props.canvasSize.width;

    canvas.addEventListener('mousemove', handleMouseMove);
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // draw bounding boxes for current tracks
    if (props.trackBoxes.length >= 0 && canvasRef.current) {
      let canvas: HTMLCanvasElement = canvasRef.current;
      let context = canvas.getContext('2d');
      if (context) {
        context.strokeStyle = trackColor;
        context.lineWidth = lineWidth;
        for (var this_track of props.trackBoxes) {
          var box_info = this_track.boundary;
          context.strokeRect(
            box_info.x*props.scale,
            box_info.y*props.scale,
            box_info.width*props.scale,
            box_info.height*props.scale
          );
          // TODO add tool time with this_track.id and .type
        }
      }
    }
    // eslint-disable-next-line
  }, [props]);

  return (
    <div onMouseMove={() => handleMouseMove}>
      <canvas ref={canvasRef} />
      <Text c='white' size='sm'>
        {'Mouse: ' + String(mousePosX) + ' , ' + String(mousePosY)}
      </Text>
    </div>
  );
};

// Canvas as whole was grabbed off the web. It demos being able to draw on a canvas with a mouse.
// It can go away, but for now it still may be useful as reference.
const Canvas = ({ width, height }: Size) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(
    undefined
  );

  const startPaint = useCallback((event: MouseEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setMousePosition(coordinates);
      setIsPainting(true);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mousedown', startPaint);
    return () => {
      canvas.removeEventListener('mousedown', startPaint);
    };
  }, [startPaint]);

  const paint = useCallback(
    (event: MouseEvent) => {
      if (isPainting) {
        const newMousePosition = getCoordinates(event);
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition);
          setMousePosition(newMousePosition);
        }
      }
    },
    [isPainting, mousePosition]
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    //canvas.color = red
    canvas.addEventListener('mousemove', paint);
    return () => {
      canvas.removeEventListener('mousemove', paint);
    };
  }, [paint]);

  const exitPaint = useCallback(() => {
    setIsPainting(false);
    setMousePosition(undefined);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mouseup', exitPaint);
    canvas.addEventListener('mouseleave', exitPaint);
    return () => {
      canvas.removeEventListener('mouseup', exitPaint);
      canvas.removeEventListener('mouseleave', exitPaint);
    };
  }, [exitPaint]);

  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop,
    };
  };

  const drawLine = (
    originalMousePosition: Coordinate,
    newMousePosition: Coordinate
  ) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      context.strokeStyle = 'red';
      context.lineJoin = 'round';
      context.lineWidth = 5;

      context.beginPath();
      context.moveTo(originalMousePosition.x, originalMousePosition.y);
      context.lineTo(newMousePosition.x, newMousePosition.y);
      context.closePath();
      context.stroke();
    }
  };

  return <canvas ref={canvasRef} height={height} width={width} />;
};

Canvas.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export default TracksCanvas;

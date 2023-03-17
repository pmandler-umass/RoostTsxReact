import { useCallback, useEffect, useRef, useState } from "react";
import { Text } from "@mantine/core";
import { Coordinate, Size } from "./utils";
import { TrackInfo } from "./tracks";

export interface TracksCanvasProps {
  canvasSize: Size,
  trackBoxes: TrackInfo[]
  // TODO going to need a trackSetter as well
}

// This adds a canvas to draw the tracks for the current time step
const TracksCanvas = (props: TracksCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosX, setMousePosX] = useState(0);
  const [mousePosY, setMousePosY] = useState(0);
  const lineWidth = 8;
  const trackColor = 'red';

  const handleMouseMove = (event: MouseEvent) => {
    setMousePosX(event.clientX - 0); //event.target.offsetLeft;);
    setMousePosY(event.clientY - 0); //event.target.offsetTop);
  };

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    // set size of canvas that tracks can be drawn on
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.height = props.canvasSize.height;
    canvas.width = props.canvasSize.width;

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log(props);
    if (props.trackBoxes.length >= 0 && canvasRef.current) {
      console.log("P adding %d tracks", props.trackBoxes.length);
      // code for tracks
      let canvas: HTMLCanvasElement = canvasRef.current;
      let context = canvas.getContext("2d");
      if (context) {
        context.strokeStyle = trackColor;
        context.lineWidth = lineWidth;
        for (var this_track of props.trackBoxes) {
          var box_info = this_track.boundary;
          console.log(box_info)
          context.strokeRect(
            box_info.x,
            box_info.y,
            box_info.width,
            box_info.height
          );
          // add tool time with this_track.id and .type
        }
      }
    }
    // eslint-disable-next-line
  }, [props]);

  return (
    <div onMouseMove={() => handleMouseMove}>
      <canvas ref={canvasRef} />
      <Text c='white'>{"Mouse: " + String(mousePosX) + " , " + String(mousePosY)}</Text>
    </div>
  );
};

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
    canvas.addEventListener("mousedown", startPaint);
    return () => {
      canvas.removeEventListener("mousedown", startPaint);
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
    canvas.addEventListener("mousemove", paint);
    return () => {
      canvas.removeEventListener("mousemove", paint);
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
    canvas.addEventListener("mouseup", exitPaint);
    canvas.addEventListener("mouseleave", exitPaint);
    return () => {
      canvas.removeEventListener("mouseup", exitPaint);
      canvas.removeEventListener("mouseleave", exitPaint);
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
    const context = canvas.getContext("2d");
    if (context) {
      context.strokeStyle = "red";
      context.lineJoin = "round";
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

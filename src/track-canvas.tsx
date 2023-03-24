import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Coordinate } from './utils';
export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 480;
export const CIRCLE_RADIUS = 48;

// Drag Snap
interface DraggableState {
  isDown: boolean;
  posX: number;
  posY: number;
  screenX: number;
  screenY: number;
}

export interface DraggableProps {
    initX: number;
    initY: number;
    color: string;
}

export const DraggableCircle: FunctionComponent<DraggableProps> = (props:DraggableProps) => {
  const trackRef = useRef<SVGCircleElement>(null);
  const [dragState, setDragState] = useState<DraggableState>({
        isDown: false,
        posX: props.initX,
        posY: props.initY,
        screenX: 0,
        screenY: 0,
  });
  const [mousePosition, setMousePosition] = useState<Coordinate>({x: 0, y:0});

  const onMouseDown = (e: MouseEvent) => {
    setDragState({
        ...dragState,
        isDown: true,
        screenX: e.screenX,
        screenY: e.screenY
    });
  };

  const onMouseMove = (e: MouseEvent) => {
    setMousePosition({x: e.screenX, y:e.screenY});
  };

  const onMouseUp = (e: MouseEvent) => {
    setDragState({ ...dragState, isDown: false, screenX: 0, screenY: 0 });
  };

  useEffect(() => {
    if (dragState.isDown) {
      const shiftX = mousePosition.x - dragState.screenX;
      const shiftY = mousePosition.y - dragState.screenY;
      setDragState({
        ...dragState,
        posX: dragState.posX + shiftX,
        posY: dragState.posY + shiftY,
        screenX: mousePosition.x,
        screenY: mousePosition.y,
      });
    }
    // eslint-disable-next-line
  }, [mousePosition]);

  useEffect(() => {
    // initialize the canvas to the correct size
    // add a listener for mouse movements
    if (!trackRef.current) {
      return;
    }
    const track_obj: SVGCircleElement = trackRef.current;
    track_obj.addEventListener('mousemove', onMouseMove);
    track_obj.addEventListener('mousedown', onMouseDown);
    track_obj.addEventListener('mouseup', onMouseUp);
    return () => {
      track_obj.removeEventListener('mousemove', onMouseMove);
      track_obj.removeEventListener('mousedown', onMouseDown);
      track_obj.removeEventListener('mouseup', onMouseUp);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <circle
      ref={trackRef}
      cx={dragState.posX}
      cy={dragState.posY}
      r={CIRCLE_RADIUS}
      stroke={props.color}
      fill={'light' + props.color}
      strokeWidth='3'
      onMouseMove={() => onMouseMove}
      onMouseDown={() => onMouseDown}
      onMouseUp={() => onMouseUp}
    />
  );
}

/*
const SVGDrag: React.StatelessComponent<React.Props<{}>> = () => (
  <div>
    <div>
      <svg style={{ width: CANVAS_WIDTH + 'px', height: CANVAS_HEIGHT + 'px', border: '1px solid silver' }}>
        <DraggableCircle({initX:{CANVAS_WIDTH * .25}, initY:{CANVAS_HEIGHT / 2}, color:'blue'}) />
        <DraggableCircle(initX={CANVAS_WIDTH * .5}, initY={CANVAS_HEIGHT / 2}, color='pink') />
        <DraggableCircle(initX={CANVAS_WIDTH * .75}, initY={CANVAS_HEIGHT / 2}, color='green') />
      </svg>
    </div>
  </div>
);

// render both components

ReactDOM.render(
  (<div>
    <h2>React SVG drag example</h2>
    <SVGDrag />
  </div>),
  document.querySelector('#root'));
  */

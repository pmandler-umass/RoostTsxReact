import { useEffect, useRef, useState } from 'react';
import { BoundingBox, Size } from './utils'; //Coordinate,
import { TrackInfo } from './tracks';
import { Text } from '@mantine/core';

// TracksCanvas is a mostly blank with a bounding box for each track.
// TODO: handle mouse movements to edit the bounding boxes.
export interface TracksCanvasProps2 {
  canvasSize: Size;
  trackBoxes: TrackInfo[];
  scale: number;      // multiplier for where track is relative to image
  // TODO going to need a trackSetter as well
}
/*
// Per track info
interface DraggableState {
  isDown: boolean;
  posX: number;
  posY: number;
  clickX: number;
  clickY: number;
}
*/
interface DraggableProps {
    box: BoundingBox;  // initial coordinates within canvas
    color: string;
    // 👇️ turn off type checking
    setActive: (params: any) => any;
    //parent: HTMLElement;
}
// Makes an element in an SVG document draggable.
// Fires custom `dragstart`, `drag`, and `dragend` events on the
// element with the `detail` property of the event carrying XY
// coordinates for the location of the element.
function makeDraggable(svgElement:SVGSVGElement, root:SVGSVGElement){
  var pt=root.createSVGPoint();
  var xlate, txStartX, txStartY, mouseStart;
  var xforms = svgElement.transform.baseVal;

  svgElement.addEventListener('mousedown',startMove,false);

  function startMove(evt: MouseEvent){
    // We listen for mousemove/up on the root-most
    // element in case the mouse is not over svgElement.
    root.addEventListener('mousemove',handleMove,false);
    root.addEventListener('mouseup',  finishMove,false);

    // Ensure that the first transform is a translate()
    xlate = xforms.numberOfItems>0 && xforms.getItem(0);
    if (!xlate || xlate.type != SVGTransform.SVG_TRANSFORM_TRANSLATE){
      xlate = xforms.createSVGTransformFromMatrix( root.createSVGMatrix() );
      xforms.insertItemBefore( xlate, 0 );
    }
    txStartX=xlate.matrix.e;
    txStartY=xlate.matrix.f;
    mouseStart = inElementSpace(evt);
    fireEvent('dragstart');
  }

  function handleMove(evt: MouseEvent){
    var point = inElementSpace(evt);
    xlate.setTranslate(
      txStartX + point.x - mouseStart.x,
      txStartY + point.y - mouseStart.y
    );
    fireEvent('drag');
  }

  function finishMove(evt){
    root.removeEventListener('mousemove',handleMove,false);
    root.removeEventListener('mouseup',  finishMove,false);
    fireEvent('dragend');
  }

  function fireEvent(eventName){
    var event = new Event(eventName);
    event.detail = { x:xlate.matrix.e, y:xlate.matrix.f };
    return svgElement.dispatchEvent(event);
  }

  // Convert mouse position from screen space to coordinates of el
  function inElementSpace(evt){
    pt.x=evt.clientX; pt.y=evt.clientY;
    return pt.matrixTransform(svgElement.parentNode.getScreenCTM().inverse());
  }
}

const DraggableRect = (props: DraggableProps) => {
  //const trackRef = useRef<SVGRectElement>(null);

  const onMouseDown = (evt: MouseEvent) => {
    console.log('Down %d, %d', evt.clientX, evt.clientY);
    evt.preventDefault(); // Needed for Firefox to allow dragging correctly
    props.setActive(trackRef);
    //setColor('green');
    // register move events on outermost SVG Element
    //props.parent.addEventListener("mousemove", onMouseMove);
    //props.parent.addEventListener("mouseup", onMouseUp);
    
    //setPointerEvents("none")  ;
  };

  useEffect(() => {
    // add a listener for mouse down - this object selected
    if (!trackRef.current) {
      return;
    }
    console.log("PAM Init - draggable");
    const track_obj: SVGRectElement = trackRef.current;
    track_obj.addEventListener('mousedown', onMouseDown);
    // PAM temp
    //track_obj.addEventListener('mousemove', onMouseMove);
    //track_obj.addEventListener('mouseup', onMouseUp);
    console.log("PAM draggable listeners added");
    return () => {
      track_obj.removeEventListener('mousedown', onMouseDown);
      // PAM temp
      //track_obj.removeEventListener('mousemove', onMouseMove);
      //track_obj.removeEventListener('mouseup', onMouseUp);
    };
    // eslint-disable-next-line
  }, []);
  /*
  const [color, setColor] = useState<string>(props.color);
  const [pointerEvents, setPointerEvents] = useState<string>("all");
  const [dragState, setDragState] = useState<DraggableState>({
        isDown: false,
        posX: props.box.x,
        posY: props.box.y,
        clickX: 0,
        clickY: 0,
  });
  const [mousePosition, setMousePosition] = useState<Coordinate>({x: 0, y:0});
  console.log("PAM draggable");
  const onMouseDown = (evt: MouseEvent) => {
    console.log('Down %d, %d', evt.clientX, evt.clientY);
    evt.preventDefault(); // Needed for Firefox to allow dragging correctly
    setDragState({
        ...dragState,
        isDown: true,
        clickX: evt.clientX,
        clickY: evt.clientY
    });
    setColor('green');
    // register move events on outermost SVG Element
    //props.parent.addEventListener("mousemove", onMouseMove);
    //props.parent.addEventListener("mouseup", onMouseUp);
    
    setPointerEvents("none")  ;
  };

  const onMouseMove = (evt: MouseEvent) => {
    console.log("onMouseMove")
    evt.preventDefault(); // Needed for Firefox to allow dragging correctly
    setMousePosition({x:evt.clientX, y:evt.clientY});
  };

  const onMouseUp = (evt: MouseEvent) => {
    evt.preventDefault(); // Needed for Firefox to allow dragging correctly
    console.log('Up %d, %d', evt.clientX, evt.clientY);
    setColor(props.color);
    setDragState({ ...dragState, isDown: false });
    //props.parent.removeEventListener("mousemove", onMouseMove);
    //props.parent.removeEventListener("mouseup", onMouseUp);
    setPointerEvents("all");
  };
  
  useEffect(() => {
    if (dragState.isDown) {
      const shiftX = mousePosition.x - dragState.clickX;
      const shiftY = mousePosition.y - dragState.clickY;
      setDragState({
        ...dragState,
        posX: dragState.posX + shiftX,
        posY: dragState.posY + shiftY,
        clickX: mousePosition.x,
        clickY: mousePosition.y,
      });
    }
    // eslint-disable-next-line
  }, [mousePosition]);

  useEffect(() => { // debugging drag
    if (dragState.isDown) {
      console.log('move %d, %d', dragState.posX, dragState.posY);
    } else {
      console.log('done %d, %d', dragState.posX, dragState.posY);
    }
    // eslint-disable-next-line
  }, [dragState]);

  useEffect(() => {
    // add a listener for mouse down - this object selected
    if (!trackRef.current) {
      return;
    }
    console.log("PAM Init - draggable");
    const track_obj: SVGRectElement = trackRef.current;
    track_obj.addEventListener('mousedown', onMouseDown);
    // PAM temp
    track_obj.addEventListener('mousemove', onMouseMove);
    track_obj.addEventListener('mouseup', onMouseUp);
    console.log("PAM draggable listeners added");
    return () => {
      track_obj.removeEventListener('mousedown', onMouseDown);
      // PAM temp
      track_obj.removeEventListener('mousemove', onMouseMove);
      track_obj.removeEventListener('mouseup', onMouseUp);
    };
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    // PAM TEMP
    setColor(props.color);
    setPointerEvents("all");
    setDragState({
        isDown: false,
        posX: props.box.x,
        posY: props.box.y,
        clickX: 0,
        clickY: 0,
    });
    setMousePosition({x: 0, y:0});
    console.log(mousePosition);
    // eslint-disable-next-line
  }, []);
  
  return (
    <rect
      ref={trackRef}
      x={dragState.posX}
      y={dragState.posY}
      width={props.box.width}
      height={props.box.height}
      stroke={color}
      fill={'light' + color}
      strokeWidth='3'
      pointer-events={pointerEvents}
    />
  );   //         onMouseDown={() => onMouseDown}     */
  return (
    <rect
      x={props.box.x}
      y={props.box.y}
      width={props.box.width}
      height={props.box.height}
      stroke={props.color}
      fill={'light' + props.color}
      strokeWidth='3'
    />
  );  
}


export const TracksCanvas2 = (props: TracksCanvasProps2) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tracks, setTracks] = useState<JSX.Element[]>([]);
  const [currentTrack, setCurrentTrack] = useState<JSX.Element|null>(null);

  useEffect(() => {
    // initialize the canvas to the correct size
    // add a listener for mouse movements
    if (!canvasRef.current) {
      return;
    }
    // set size of canvas that tracks can be drawn on
    let canvas: HTMLCanvasElement = canvasRef.current;
    canvas.height = props.canvasSize.height;
    canvas.width = props.canvasSize.width;
    // eslint-disable-next-line
  }, []);

  const onMouseUp = (evt: MouseEvent) => {
    evt.preventDefault(); // Needed for Firefox to allow dragging correctly
    console.log('Up %d, %d', evt.clientX, evt.clientY);
    // update props just for this track
    /* setColor(props.color);
    setDragState({ ...dragState, isDown: false });
    setPointerEvents("all"); */
    if (currentTrack !== null) {  // PAM this is just for compiler
      setCurrentTrack(null);
    }
    if (canvasRef.current) {
      canvasRef.current.removeEventListener("mouseup", onMouseUp);
    }
  };
  
  function activateTrack(track_box:JSX.Element) {
    console.log("activateTrack");
    setCurrentTrack(track_box);
    if (canvasRef.current) {
      canvasRef.current.addEventListener("mouseup", onMouseUp);
    }
  }

  useEffect(() => {
    // draw bounding boxes for current tracks
    if (props.trackBoxes.length > 0 && canvasRef.current) {
      console.log("update props TracksCanvas2 %d", props.trackBoxes.length);
      // let canvas: HTMLCanvasElement = canvasRef.current;
      let new_tracks: JSX.Element[] = []
      for (var this_track of props.trackBoxes) {
        var box_info = this_track.boundary;
        console.log("update props id:%s", this_track.id);
        var track_props =  {
          box: { x:box_info.x*props.scale,
                y: box_info.y*props.scale, 
                width: box_info.width*props.scale, 
                height: box_info.height*props.scale},
          color: "gray",
          setActive: activateTrack,
          // parent: canvas,
        }
        console.log("update props created props");
        new_tracks.push(DraggableRect(track_props));
        console.log("called Draggable");
      }
      setTracks(new_tracks);
    }
    // eslint-disable-next-line
  }, [props]);

  function addTracks() {
    return (
      <div>
        <Text>Add Tracks: {tracks.length}</Text>
      </div>
    )
    // doesn't work for (let i = 0; i < tracks.length; i++) { 
  }

  

  return (
    <div>
      <canvas ref={canvasRef} />
      <div>
        {addTracks()}
      </div>
    </div>
  );
};

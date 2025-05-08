import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Stage, Layer, Rect, Line, Circle, Text } from 'react-konva'; 
import Toolbar from './Toolbar';
import './Whiteboard.css';

const THROTTLE_INTERVAL = 16; 

function Whiteboard() {
    const [lines, setLines] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [localPoints, setLocalPoints] = useState([]);
    const [selectedColor, setSelectedColor] = useState('#00000');
    const [selectWidth, setSelectWidth] = useState(3);
    const [remoteDrawing, setRemoteDrawing] = useState({});
    const [remoteCursors, setRemoteCursors] = useState({}); 
    const [remoteStyles, setRemoteStyles] = useState({});
    const [isWsConnected, setIsWsConnected] = useState(false); 
    
    const handleColor = (color) => {
        console.log(`Selected color: ${selectedColor}`);
        setSelectedColor(color);
    }
    
    const stageWidth = 1920; 
    const stageHeight = 1080; 

    const ws = useRef(null);
    const userIdRef = useRef(`user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
    const lastMoveTimeRef = useRef(0); 
    
    const sendWebSocketMessage = useCallback((message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                ...message, userId : userIdRef.current,
            }));
        }
        else {
            console.error('WebSocket is not open. Cannot send data.');
        }
    }, []); 


    useEffect(() => {
       const djangoHost = window.location.hostname; 
       const websocketUrl = `ws://${djangoHost}:8000/ws/whiteboard/`; 
        ws.current = new WebSocket(websocketUrl);
        ws.current.onopen = () => {
            console.log('WebSocket connected');
            setIsWsConnected(true); 
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
            setIsWsConnected(false); 
            ws.current = null;
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsWsConnected(false); 
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Message from server:', data);
            switch (data.type) {
               case 'draw_start':
                    console.log(`Another user started drawing (points) : `, data.points);
                    setRemoteDrawing(prev => ({
                        ...prev,
                        [data.userId] : data.points
                    }));
                    setRemoteCursors(prev => ({
                        ...prev,
                        [data.userId]: { x: data.points[0], y: data.points[1] }
                    }));
                    setRemoteStyles(prev => ({
                        ...prev,
                        [data.userId]: { 
                            color: data.color || '#000000', 
                            width: data.width || 3 
                        }
                    }));
                    break;
                case 'draw_move':
                    console.log('Another user continued drawing (point) : ', data.points);
                    setRemoteDrawing(prev => ({
                        ...prev,
                        [data.userId] : [
                            ...(prev[data.userId] || []),
                            ...data.points
                        ]
                    }));
                    setRemoteCursors(prev => ({
                        ...prev,
                        [data.userId]: { x: data.points[data.points.length - 2], y: data.points[data.points.length - 1] }
                    }));
                    break;
                case 'draw_end':
                    if (data.lineData && data.lineData.points && data.lineData.points.length > 0) {
                        console.log(`${data.userId} ended drawing`);
                        setLines((prevLines) => [...prevLines, data.lineData]);
                    }
                    setRemoteDrawing(prev => {
                        const newState = { ...prev };
                        delete newState[data.userId]; 
                        return newState;
                    });
                    setRemoteCursors(prev => {
                        const newState = { ...prev };
                        delete newState[data.userId];
                        return newState;
                    });
                    setRemoteStyles(prev => {
                        const newState = { ...prev };
                        delete newState[data.userId];
                        return newState;
                    });
                    break;
                default:
                    console.log('Unknown message type:', data.type);
            }
        };

        return () => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.close();
            }
        }

    }, []);



    const handleMouseDown = (e) => {
        if (!isWsConnected) return; 
        setIsDrawing(true)
        const pos = e.target.getStage().getPointerPosition();
        const startPoint = [pos.x, pos.y];
        setLocalPoints(startPoint);

        sendWebSocketMessage({
            type: 'draw_start',
            points : startPoint,
            color: selectedColor,
            width: selectWidth,
        });
    };

    const handleMouseMove = (e) => {
        if (!isDrawing || !isWsConnected) return; 

        const now = Date.now();
        if (now - lastMoveTimeRef.current < THROTTLE_INTERVAL) {
            return; 
        }
        lastMoveTimeRef.current = now;

        const pos = e.target.getStage().getPointerPosition();
        const newPoints = [pos.x, pos.y];

        setLocalPoints((prevPoints) => [...prevPoints, ...newPoints]);

        sendWebSocketMessage({
            type: 'draw_move',
            points: newPoints, 
        });
    };

    const handleMouseUp = (e) => {
        if (!isDrawing) { 
            setIsDrawing(false);
            setLocalPoints([]);
            return;
        }

        const completedLine = [...localPoints];
        const newLine = {points : completedLine, color : selectedColor, width : selectWidth};
        setIsDrawing(false);

        setLines((prevLines) => [...prevLines, newLine]); 
        setLocalPoints([]);

        if (isWsConnected && completedLine.length > 0) { 
            sendWebSocketMessage({
                type: 'draw_end',
                lineData: newLine
            });
        }
    }


    return (
        <div className='whiteboard-container'>
        <Toolbar
            handleColor={handleColor}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            setStrokeWidth={setSelectWidth}
            strokeWidth={selectWidth}
        />

        <Stage 
        width={stageWidth} 
        height={stageHeight} 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        >
            <Layer>
                {lines.map((linePoints, idx) => (
                    <Line
                        key={idx}
                        points={linePoints.points}
                        stroke={linePoints.color}
                        strokeWidth={linePoints.width}
                        lineCap="round"
                        lineJoin="round"
                        tension={0.5}
                        bezier={true}
                    />
                ))}
                {isDrawing && localPoints.length > 0 && (
                    <Line
                        points={localPoints}
                        stroke={selectedColor}
                        strokeWidth={selectWidth}
                        lineCap="round"
                        lineJoin="round"
                        tension={0.5}
                        bezier={true}
                    />
                )}
                {Object.entries(remoteDrawing).map(([userId, points]) => (
                    points && points.length > 1 && (
                        <Line
                            key={`remote-line-${userId}`}
                            points={points}
                            stroke={remoteStyles[userId]?.color || '#000000'} 
                            strokeWidth={remoteStyles[userId]?.width || 3}
                            lineCap="round"
                            lineJoin="round"
                            tension={0.5}
                            bezier={true}
                        />
                    )
                ))}
                {Object.entries(remoteCursors).map(([userId, pos]) => (
                    <React.Fragment key={`remote-cursor-${userId}`}>
                        <Circle 
                            x={pos.x}
                            y={pos.y}
                            radius={5}
                            fill={remoteStyles[userId]?.color || '#000000'}
                        />
                        <Text
                            x={pos.x + 10} 
                            y={pos.y + 10}
                            text={userId} 
                            fontSize={12}
                            fill={remoteStyles[userId]?.color || '#000000'}
                        />
                    </React.Fragment>
                ))}
            </Layer>
        </Stage>
        </div>
    );
}

export default Whiteboard;
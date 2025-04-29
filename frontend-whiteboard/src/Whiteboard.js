import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import Toolbar from './Toolbar';
import './Whiteboard.css';

const THROTTLE_INTERVAL = 16; 

function Whiteboard() {
    const [lines, setLines] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [localPoints, setLocalPoints] = useState([]);
    const [currentTool, setCurrentTool] = useState('pen');
    const [color, setColor] = useState('black');
    const [remoteDrawing, setRemoteDrawing] = useState({});
    const [lineWidth, setLineWidth] = useState(3);
    const [isWsConnected, setIsWsConnected] = useState(false); 
    
    const stageWidth = 1920; 
    const stageHeight = 1080; 

    const ws = useRef(null);
    const userIdRef = useRef(`user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
    const lastMoveTimeRef = useRef(0); 

    const handleToolSelect = (tool) => {
        console.log(`Selected tool: ${tool}`);
        setCurrentTool(tool);
    };

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
                    break;
                case 'draw_end':
                    if (data.lineData && data.lineData.length > 0) {
                        console.log(`{userIdRef.current} ended drawing`);
                        setLines((prevLines) => [...prevLines, data.lineData]);
                    }
                    setRemoteDrawing(prev => {
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
        setIsDrawing(false);

        setLines((prevLines) => [...prevLines, completedLine]); 
        setLocalPoints([]);

        if (isWsConnected && completedLine.length > 0) { 
            sendWebSocketMessage({
                type: 'draw_end',
                lineData: completedLine,
            });
        }
    }


    return (
        <div className='whiteboard-container'>
        <Toolbar/>

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
                        points={linePoints}
                        stroke="black"
                        strokeWidth={3}
                        lineCap="round"
                        lineJoin="round"
                    />
                ))}
                {isDrawing && localPoints.length > 0 && (
                    <Line
                        points={localPoints}
                        stroke="black"
                        strokeWidth={3}
                        lineCap="round"
                        lineJoin="round"
                    />
                )}
                {Object.entries(remoteDrawing).map(([userId, points]) => (
                    points && points.length > 1 && (
                        <Line
                            key={`remote-${userId}`}
                            points={points}
                            stroke="#df4b26" 
                            strokeWidth={3}
                            lineCap="round"
                            lineJoin="round"
                        />
                    )
                ))}
            </Layer>
        </Stage>
        </div>
    );
}

export default Whiteboard;
import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import Toolbar from './Toolbar';
import './Whiteboard.css';


function Whiteboard() {
    const [lines, setLines] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState([]);
    const [currentTool, setCurrentTool] = useState('pen');
    
    const stageWidth = 1920; 
    const stageHeight = 1080; 

    const ws = useRef(null);

    const handleToolSelect = (tool) => {
        console.log(`Selected tool: ${tool}`);
        setCurrentTool(tool);
    };

    useEffect(() => {
       const djangoHost = window.location.hostname; 
       const websocketUrl = `ws://${djangoHost}:8000/ws/whiteboard/`; 
        ws.current = new WebSocket(websocketUrl);
        ws.current.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
            ws.current = null;
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Message from server:', data);
            switch (data.type) {
               case 'update_lines':
                    setLines(data.lines);
                    break; 
                case 'draw_end':
                    setLines((prevLines) => [...prevLines, data.lineData]);
                    break;
                case 'draw_start':
                    console.log(`Another user started drawing (points) : `, data.points);
                    break;
                case 'draw_move':
                    console.log('Another user continued drawing (point) : ', data.points);
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

    const sendWebSocketMessage = (message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open');
        }
    };



    const handleMouseDown = (e) => {
        setIsDrawing(true)
        const pos = e.target.getStage().getPointerPosition();
        const startPoint = [pos.x, pos.y];
        setPoints(startPoint);

        sendWebSocketMessage({
            type: 'draw_start',
            points : startPoint,
        });
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return; 
        const pos = e.target.getStage().getPointerPosition();
        setPoints((prevPoints) => [...prevPoints, pos.x, pos.y]);


        sendWebSocketMessage({
            type: 'draw_move',
            points: [pos.x, pos.y],
        });
    };

    const handleMouseUp = (e) => {
        if (!isDrawing || points.length === 0) { 
            setIsDrawing(false);
            return ;
        }
        
        const completedLine = [...points];
        setIsDrawing(false);

        setLines((prevLines) => [...prevLines, completedLine]); 
        setPoints([]);

        sendWebSocketMessage({
            type: 'draw_end',
            lineData: completedLine,
        });
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
                {isDrawing && points.length > 0 && (
                    <Line
                        points={points}
                        stroke="black"
                        strokeWidth={3}
                        lineCap="round"
                        lineJoin="round"
                    />
                )}
            </Layer>
        </Stage>
        </div>
    );
}

export default Whiteboard;
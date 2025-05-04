import React, { useState, useEffect } from 'react';

function Toolbar({ onColorChange, onStrokeWidthChange }) {
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [strokeWidth, setStrokeWidth] = useState(5); 
    
    useEffect(() => {
        if (onColorChange) {
            onColorChange(selectedColor);
        }
        if (onStrokeWidthChange) {
            onStrokeWidthChange(strokeWidth);
        }
    }, [selectedColor, onColorChange, strokeWidth, onStrokeWidthChange]);
    return (
        <div className="toolbar">
            <div className="tool-section">
                <div className="tool-dropdown">
                    <button className="tool active has-submenu" id="pen">
                        <i className="fas fa-pen"></i>
                        <i className="fas fa-caret-down submenu-icon"></i>
                    </button>
                    <div className="submenu pen-submenu">
                        <button className="subtool active" data-tool="pen" data-subtype="normal">
                            <i className="fas fa-pen"></i> Normal
                        </button>
                        <button className="subtool" data-tool="pen" data-subtype="brush">
                            <i className="fas fa-paint-brush"></i> Brush
                        </button>
                        <button className="subtool" data-tool="pen" data-subtype="marker">
                            <i className="fas fa-marker"></i> Marker
                        </button>
                    </div>
                </div>
                <button className="tool" id="highlighter">
                    <i className="fas fa-highlighter"></i>
                </button>
                <button className="tool" id="eraser">
                    <i className="fas fa-eraser"></i>
                </button>
            </div>

            <div className="tool-section">
                    <button className="tool" id="text">
                        <i className="fas fa-font"></i>
                    </button>
                    <div className="tool-dropdown">
                        <button className="tool has-submenu" id="shapes">
                            <i className="fas fa-shapes"></i>
                            <i className="fas fa-caret-down submenu-icon"></i>
                        </button>
                        <div className="submenu shapes-submenu">
                            <button className="subtool" data-tool="shape" data-shape="rectangle">
                                <i className="far fa-square"></i> Rectangle
                            </button>
                            <button className="subtool" data-tool="shape" data-shape="circle">
                                <i className="far fa-circle"></i> Circle
                            </button>
                            <button className="subtool" data-tool="shape" data-shape="triangle">
                                <i className="fas fa-play"></i> Triangle
                            </button>
                            <button className="subtool" data-tool="shape" data-shape="line">
                                <i className="fas fa-slash"></i> Line
                            </button>
                            <button className="subtool" data-tool="shape" data-shape="arrow">
                                <i className="fas fa-long-arrow-alt-right"></i> Arrow
                            </button>
                        </div>
                    </div>
                    <div className="color-picker">
                        <input 
                            type="color" 
                            id="colorPicker" 
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                        />
                        <span className="color-preview" style={{ backgroundColor: selectedColor }}></span>
                    </div>
                </div>

                <div className="tool-section">
                    <button className="tool" id="undo" title="Undo">
                        <i className="fas fa-undo"></i>
                    </button>
                    <button className="tool" id="redo" title="Redo">
                        <i className="fas fa-redo"></i>
                    </button>
                    <button className="tool" id="clear" title="Clear All">
                        <i className="fas fa-trash-alt"></i>
                    </button>
                </div>

                <div className="tool-section stroke-width-section">
                    <label htmlFor="stroke-width" className="stroke-width-label">Width</label>
                    <input 
                        type="range" 
                        id="stroke-width" 
                        className="stroke-width-slider" 
                        min="1" 
                        max="50" 
                        value={strokeWidth} 
                        title="Stroke Width"
                        onChange={(e) => setStrokeWidth(parseInt(e.target.value, 10))}
                    />
                    <span id="stroke-width-value" className="stroke-width-value">{strokeWidth}</span>
                    <button className="tool" id="save" title="Save">
                        <i className="fas fa-save"></i>
                    </button>
                    <button className="tool" id="fullscreen" title="Fullscreen">
                        <i className="fas fa-expand"></i>
                    </button>
                </div>
            </div>
    );
}

export default Toolbar;
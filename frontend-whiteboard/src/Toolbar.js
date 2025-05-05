import React from 'react';

function Toolbar({ selectedColor, setSelectedColor, setStrokeWidth, strokeWidth, handleToolSelect  }) {
    return (
        <div className="toolbar">
            <div className="tool-section">
                <button onClick={() => handleToolSelect("pen")} className="tool active" id="pen">
                    <i className="fas fa-pen"></i>
                </button>
                <button onClick={() => handleToolSelect("highlighter")} className="tool" id="highlighter">
                    <i className="fas fa-highlighter"></i>
                </button>
                <button onClick={() => handleToolSelect("eraser")} className="tool" id="eraser">
                    <i className="fas fa-eraser"></i>
                </button>
            </div>

            <div className="tool-section">
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


                <div className="tool-section stroke-width-section">
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

                </div>
            </div>
    );
}

export default Toolbar;
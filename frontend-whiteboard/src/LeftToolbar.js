import React from 'react';

function LeftToolbar({onToolSelect, currentTool}) {
    return (
        <div className='tollbar left-toolbar'>
            <button
                className={currentTool === 'select' ? 'active' : ''}
                onClick={() => onToolSelect('select')}
            >
                Select
            </button>
            <button 
                className={currentTool === 'pen' ? 'active' : ''}
                onClick={() => onToolSelect('pen')}
            >
                Pen
            </button>
            <button
                className={currentTool === 'eraser' ? 'active' : ''}
                onClick={() => onToolSelect('eraser')}
            >
                Eraser
            </button>
            <button
                className={currentTool === 'shape' ? 'active' : ''}
                onClick={() => onToolSelect('shape')}
            >
                Shape
            </button>
        </div>
    )
}

export default LeftToolbar;
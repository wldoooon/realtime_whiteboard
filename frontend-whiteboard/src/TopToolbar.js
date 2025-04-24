import React from 'react';

function TopToolbar({ onToolSelect }) {
    return (
        <div className='toolbar top-toolbar'>
            <span>Board Name</span>
            <button onClick={() => onToolSelect('undo')}>Undo</button>
            <button onClick={() => onToolSelect('redo')}>Redo</button>
        </div>
    )
}

export default TopToolbar;
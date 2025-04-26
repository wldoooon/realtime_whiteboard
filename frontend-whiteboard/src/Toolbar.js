import React from 'react';

function Toolbar() {
    return (
        <div className="toolbar">
            <div className="tool-section">
                <div className="tool-dropdown">
                    <button className="tool active has-submenu" id="pen" title="Pen">
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
                <button className="tool" id="highlighter" title="Highlighter">
                    <i className="fas fa-highlighter"></i>
                </button>
                <button className="tool" id="eraser" title="Eraser">
                    <i className="fas fa-eraser"></i>
                </button>
            </div>

            <div className="tool-section">
                    <button className="tool" id="text" title="Text">
                        <i className="fas fa-font"></i>
                    </button>
                    <div className="tool-dropdown">
                        <button className="tool has-submenu" id="shapes" title="Shapes">
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
                        <input type="color" id="colorPicker" defaultValue="#000000"/>
                        <span className="color-preview"></span>
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

                <div className="tool-section">
                    <select id="stroke-width" className="stroke-width-selector" title="Stroke Width" defaultValue="5">
                        <option value="2">Thin</option>
                        <option value="5">Medium</option>
                        <option value="10">Thick</option>
                        <option value="20">Extra Thick</option>
                    </select>
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
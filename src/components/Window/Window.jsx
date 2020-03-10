import React, { useEffect } from 'react';
import Draggable from 'react-draggable';
import { connect } from 'react-redux';
import { ResizableBox } from 'react-resizable';
import { TimelineLite, TweenLite } from 'gsap';

import WindowButtons from '../WindowButtons/WindowButtons';

import { 
    closeWindow,
    toggleWindowMinimized,
    toggleWindowZoom, 
    setWindowFocused, 
    updateWindowDimensions
} from '../../redux/windows/windows.actions';

import { C, getRandomInt } from '../../util';

import cls from './Window.module.scss';

const Window = ({ 
    id, 
    title,
    type, 
    width,
    height,
    children,
    isMinimized,
    isZoomed, 
    isFocused,
    //METHODS
    closeWindow,
    minimizeWindow,
    toggleWindowZoom, 
    setWindowFocused,
    updateWindowDimensions,
}) => {
    const windowId = `window_${id}`;
    const dragHandleId = `${windowId}--dragHandle`;
    const resizeHandleId = `${windowId}--resizeHandle`;
    const widthNum = calculateDimension(width, window.innerWidth);
    const heightNum = calculateDimension(height, window.innerHeight);
    const centerX  = (window.innerWidth / 2 - widthNum / 2) + getRandomInt(-50, 150);
    const centerY = getRandomInt(0, 150);

    /**
     * Converts dimension values like '50%' or '50vh' to actual pixel value
     * based on a parent dimension
     * @param {string} dimension 
     * @param {number} parentDimension 
     */
    function calculateDimension(dimension, parentDimension) {
        if (typeof dimension === 'number') {
            return dimension;
        }

        if (dimension.indexOf('px') !== -1) {
            return parseInt(dimension.replace('px', ''));
        }

        dimension = parseInt(dimension.replace('vw', '').replace('vh', ''));

        return (dimension / 100) * parentDimension;
    }
    
    function setFocused() {
        if (!isFocused) {
            setWindowFocused(id);
        }
    }

    function onResize(_, { size }) {
        updateWindowDimensions(id, size.width, size.height);
    };

    function onClose(id) {
        animateWindowClosing().then(() => {
            closeWindow(id);
        });
    }

    function animateWindowOpening() {
        const windowElement = document.getElementById(windowId);
        const timeline = new TimelineLite();

        timeline.set(windowElement, {opacity: 1});
        timeline.from(windowElement, 1, {y: '-100%', ease: "elastic.out(1.5, 1.5)"});
    }

    function animateWindowClosing() {
        return new Promise(resolve => {
            TweenLite.to(document.getElementById(windowId), .2, {y: -heightNum * 1.5}).eventCallback('onComplete', resolve);
        });
    }

    useEffect(animateWindowOpening, []);
    
    return <Draggable handle={`#${dragHandleId}`} defaultPosition={{x: centerX, y: centerY}} onStart={setFocused}>
        <ResizableBox
            id={windowId}
            className={C(
                cls.window,
                isMinimized && cls.minimized,
                isZoomed && cls.zoomed, 
                isFocused && cls.focused,
                type === 'app' && cls.app,
            )}
            style={{width, height}}
            handle={<div id={resizeHandleId} className={cls.resizeHandle}></div>}
            width={widthNum}
            height={heightNum}
            minConstraints={[450, 300]}
            onClick={setFocused}
            onResize={onResize}
        >
            <div id={dragHandleId} className={cls.dragHandle}>
                {!isZoomed && <p className={cls.title}>{title}</p>}
            </div>
            {!isZoomed && (
                <div className={cls.buttons}>
                    <WindowButtons 
                        onClose={onClose.bind(null, id)}
                        onMinimize={minimizeWindow.bind(null, id)}
                        onToggleZoom={toggleWindowZoom.bind(null, id)}
                    />
                </div>
            )}
            <div className={cls.content}>
                {children}
            </div>
        </ResizableBox>
    </Draggable>;
};

const mapDispatchToProps = dispatch => ({
    closeWindow: id => dispatch(closeWindow(id)),
    minimizeWindow: id => dispatch(toggleWindowMinimized(id)),
    toggleWindowZoom: id => dispatch(toggleWindowZoom(id)),
    setWindowFocused: id => dispatch(setWindowFocused(id)),
    updateWindowDimensions: (id, width, height) => dispatch(updateWindowDimensions(id, width, height)),
});

export default connect(null, mapDispatchToProps)(Window);
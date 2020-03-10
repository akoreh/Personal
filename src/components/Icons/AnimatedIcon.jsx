import React, { useRef, useEffect, useState } from 'react';
import lottie from 'lottie-web';

const AnimatedIcon = ({
    key,
    autoplay, 
    playOnHover,
    speed = 1, 
    startDelay = 0,
    className,
    style,
    ...props 
}) => {
    const base = useRef();
    const [animation, setAnimation] = useState();

    function loadAnimation() {
        setAnimation(lottie.loadAnimation({
            container: base.current,
            ...props,
            autoplay: false,
        }));
    }

    function initAnimation () {
        if (!animation) {
            return;
        }

        animation.setSpeed(speed);

        if (autoplay) {
            setTimeout(playAnimation, startDelay * 1000);
        }
    }

    function playAnimation(direction = 1) {
        animation.setDirection(direction);
        animation.play();
    }

    useEffect(loadAnimation, []);
    useEffect(initAnimation, [animation]);

    return <div 
        id={`lottie_${key}`} 
        className={className} 
        style={style} 
        ref={base}
        onMouseEnter={() => playOnHover && playAnimation()}
        onMouseLeave={() => playOnHover && playAnimation(-1)}
    />;
};

export default AnimatedIcon;

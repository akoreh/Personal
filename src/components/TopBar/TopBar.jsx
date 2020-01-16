import React, { useContext, useEffect, createRef } from 'react';
import moment from 'moment';
import { TweenMax, Expo } from 'gsap';

import SocialIcon from '../SocialIcon/SocialIcon';
import AnimatedIcon from '../AnimatedIcon/AnimatedIcon';

import { systemTimeContext } from '../../store/SystemTimeProvider';
import { IS_DEV, LOADING_SCREEN_TIME, SCROLL_TO_TOP_DURATION } from '../../constants';
import socialIcons from './socialIcons';
import animatedIcons from './animatedIcons';

import { C } from '../../util';

import cls from './TopBar.module.scss';

const TopBar = () => {
    const systemTime = useContext(systemTimeContext);
    const topBarRef = createRef();

    const animateTopBar = () => {
        const delay = LOADING_SCREEN_TIME + SCROLL_TO_TOP_DURATION;
        const target = topBarRef.current;
        
        if (IS_DEV) {
            TweenMax.set(target, {y: 0});
        } else {
            TweenMax.to(target, 1, {y: 0, ease: Expo.easeOut, delay});
        }
    };

    useEffect(() => animateTopBar(), []);

    return <nav className={cls.topBar} ref={topBarRef}>
        <div className={cls.left}>
            <h1 className={C(cls.brand, 'no-select')}>K</h1>
        </div>
        <div className={cls.center}>
        </div>
        <div className={cls.right}>
            <div className={cls.icons}>
                {socialIcons.map(icon => <SocialIcon key={icon.alt} {...icon} />)}
                {animatedIcons.map(icon => <AnimatedIcon key={icon.name} {...icon} />)}
            </div>
            <span className={C(cls.time, 'no-select')}>{moment(systemTime).format('ddd Do MMM HH:mm')}</span>
        </div>
    </nav>;
}

export default TopBar;

import React from 'react';

import { C } from '../../util';

import cls from './WindowButtons.module.scss';

const WindowButtons = ({onClose, onMaximize}) => (
    <div className={cls.windowButtons}>
        <div className={C(cls.button, cls.close)} onClick={onClose}/>
        <div className={C(cls.button, cls.minimize)} />
        <div className={C(cls.button, cls.maximize)} onClick={onMaximize}/>
    </div>
);

export default WindowButtons;
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { find, get } from 'lodash';

import Icon from '../Icons/Icon';

import BrowserIcon from '../../assets/img/icons/browser.svg';
import CalculatorIcon from '../../assets/img/icons/calculator.svg';
import EmailIcon from '../../assets/img/icons/email.svg';
import GitHubIcon from '../../assets/img/icons/github.svg';
import LinkedInIcon from '../../assets/img/icons/linkedin.svg';
import settingsAnimationData from '../../assets/anim/settings.json';

import { appOpts as calculatorAppOpts} from '../../apps/Calculator/Calculator';
import { appOpts as browserAppOpts } from '../../apps/Browser/Browser';
import { appOpts as settingsAppOpts } from '../../apps/Settings/Settings';
import { folderIcon } from '../../apps/Folder/Folder';

import { openWindowAndSetFocused, toggleWindowMinimized } from '../../redux/windows/windows.actions';
import { selectOpenApps, selectOpenFolders } from '../../redux/windows/windows.selectors';

import { EMAIL, LINKED_IN, GIT_HUB } from '../../constants';

import { C } from '../../util';

import cls from './DockIcons.module.scss';

const DockIcons = ({ openApps, openFolders, openWindowAndSetFocused, maximizeWindow }) => {
    const icons = [
        {
            key: 'dockInternet',
            className: C(cls.icon, cls.browserIcon),
            src: BrowserIcon,
            appOpts: browserAppOpts,
            onClick: onAppIconClick,
        },
        {
            key: 'dockCalculator',
            className: C(cls.icon, cls.calculatorIcon),
            src: CalculatorIcon,
            appOpts: calculatorAppOpts,
            onClick: onAppIconClick,
        },
        {
            key: 'dockEmail',
            title: 'Email',
            className: cls.icon,
            src: EmailIcon,
            href: `mailto:${EMAIL}`,
            target: '_self',
            onClick: onLinkClick,
        },
        {
            key: 'dockGitHub',
            title: 'GitHub',
            className: cls.icon,
            src: GitHubIcon,
            href: GIT_HUB,
            onClick: onLinkClick,
        },
        {
            key: 'dockLinkedIn',
            title: 'LinkedIn',
            className: cls.icon,
            src: LinkedInIcon,
            href: LINKED_IN,
            onClick: onLinkClick,
        },
        {
            key: 'dockSettings',
            className: C(cls.icon, cls.settingsIcon),
            animationData: settingsAnimationData,
            loop: false,
            autoplay: false,
            speed: 1,
            playOnHover: true,
            appOpts: settingsAppOpts,
            onClick: onAppIconClick,
        },
    ];

    function onLinkClick() {
        window.open(this.href, this.target)
    }

    function onAppIconClick() {
        const { id } = this.appOpts;
        const isRunning = iconAppIsRunning(id);

        if (!isRunning) {
            openWindowAndSetFocused(this.appOpts);
        } else {
            maximizeWindow(id);
        }
    }

    function iconAppIsRunning(appId) {
        if(!appId) {
            return false;
        }

        return find(openApps, {id: appId});
    }

    return <Fragment>
        {
            icons.map(icon => {
                const isRunning =  iconAppIsRunning(get(icon, ['appOpts', 'id'])) 
                return <div key={icon.key} className={C(cls.dockIcon, isRunning && cls.appRunning)}>
                    <div className={cls.title}>{get(icon, ['appOpts', 'title'], icon.title)}</div>
                    <Icon {...icon} />
                </div>
            })
        }
        {
            openFolders.length > 0 && <div className={cls.foldersSeparator}/>
        }
        {
            openFolders.map((folder) => <div key={folder.id} className={cls.dockIcon}>
                <div className={cls.title}>{folder.title}</div>
                <Icon 
                    className={C(cls.icon, cls.folderIcon)} 
                    onClick={maximizeWindow.bind(null, folder.id)}
                    {...{...folderIcon, autoplay: true, loop: false, playOnHover: false}}
                />
            </div>)
        }
    </Fragment>
};

const mapStateToProps = createStructuredSelector({
    openApps: selectOpenApps,
    openFolders: selectOpenFolders,
});

const mapDispatchToProps = dispatch => ({
    openWindowAndSetFocused: windowOpts => dispatch(openWindowAndSetFocused(windowOpts)),
    maximizeWindow: id => dispatch(toggleWindowMinimized(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DockIcons);
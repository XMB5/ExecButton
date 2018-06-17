/*
 * Copyright 2018 Sam Foxman
 *
 * This file is part of ExecButton.
 *
 * ExecButton is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ExecButton is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

if (process.argv.length !== 3) {
    console.log('usage: execbutton <command>');
    process.exit(1);
}

let command = process.argv[2];

const blessed = require('blessed');

const screen = blessed.screen({
    smartCSR: true,
    fullUnicode: true,
    dockBorders: true,
    ignoreDockContrast: true
});

//add the EXECBUTTON=1 environment variable
process.env.EXECBUTTON = 1;

//create the terminal
let left = blessed.terminal({
    parent: screen,
    env: process.env,
    left: 0,
    top: 0,
    width: '50%',
    height: '100%',
    style: {
        border: {
            fg: 'green'
        }
    }
});

//create the box that starts the command
let topright = blessed.box({
    parent: screen,
    left: '50%',
    top: 0,
    width: '50%',
    height: '50%',
    style: {
        bg: 'green',
        border: {
            fg: 'white'
        }
    }
});

//add text to the command box
blessed.text({
    parent: topright,
    content: command,
    left: 'center',
    top: 'center',
    style: {
        fg: 'white',
        bg: 'blue'
    }
});

let bottomright = blessed.box({
    parent: screen,
    top: '50%',
    left: '50%',
    width: '50%',
    height: '50%',
    style: {
        bg: 'red',
        border: {
            fg: 'white'
        }
    }
});

//add text to the cancel box
blessed.text({
    parent: bottomright,
    content: 'SIGINT',
    left: 'center',
    top: 'center',
    style: {
        fg: 'white',
        bg: 'blue'
    }
});

//add action to the command box
topright.on('click', () => {
    //type the command
    left.pty.write(command + '\n');
});

//add action to the cancel box
bottomright.on('click', () => {
    //send end of text, same as ctrl-c
    left.pty.write('\x03');
});

//ensure the terminal stays in focus
topright.on('focus', () => left.focus());
bottomright.on('focus', () => left.focus());
left.focus();

screen.key('C-q', function() {
    left.kill();
    return screen.destroy();
});

screen.render();
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

const blessed = require('blessed');
const childProcess = require('child_process');

if (process.argv.length !== 3) {
    console.log('usage: execbutton <command>');
    process.exit(1);
}

let command = process.argv[2];

function showScreen () {

    // Create a screen object.
    let screen = blessed.screen({
        smartCSR: true
    });

    screen.title = command;

    // Create a box perfectly centered horizontally and vertically.
    let box = blessed.box({
        top: 'center',
        left: 'center',
        width: '100%',
        height: '100%',
        tags: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            bg: 'green',
            border: {
                fg: 'white'
            }
        }
    });

    //add text to the box
    let label = blessed.text({
        content: command,
        left: 'center',
        top: 'center',
        style: {
            fg: 'white',
            bg: 'red'
        }
    });
    box.append(label);


    // Append our box to the screen.
    screen.append(box);

    // If our box is clicked, change the content.
    box.on('click', function() {
        runCommand();
        screen.destroy();
    });

    // Quit on Escape, q, or Control-C.
    screen.key(['escape', 'q', 'C-c'], function() {
        return process.exit(0);
    });

    // Focus our element.
    box.focus();

    // Render the screen.
    screen.render();

}

function runCommand () {
    let child = childProcess.spawn('bash', ['-c', command]);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('exit', () => {
        showScreen();
    });
}

showScreen();
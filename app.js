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
#!/usr/bin/env node

let actions = require('./actions');

parse(process.argv.slice(2));

function parse(args) {
    let list;

    // If the first argument is not an option, then it is the list to operate on.
    if (!isOpt(args[0])) {
        list = args.shift();
    }

    let action = getAction(args[0]);

    // Removes the option argument (e.g. -a)
    args.shift();

    action(list, args);
}

function isOpt(arg) {
    return arg && arg[0] === '-';
}

function getAction(option) {
    if (!option) {
        return actions.list;
    }

    switch (option) {
        case '-a':
        case '--add':
            return actions.add;
        case '-d':
        case '--delete':
            return actions.delete;
        case '-e':
        case '--edit':
            return null;
    }
}

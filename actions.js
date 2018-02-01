let fs = require('fs');

const lstDir = `${process.env.HOME}/.lst`;

function list(list, args) {
    if (list) {
        getList(list)
            .then((list) => {
                list.forEach((item, idx) => {
                    if (item) {
                        console.log(`${idx}. ${item}`);
                    }
                });
            });
    } else {
        getLists(lstDir)
            .then((lists) => {
                lists.forEach((list, idx) => {
                    console.log(`${list}`);
                });
            });
    }
}

function add(list, args) {
    if (list) {
        addItem(list, args);
    } else {
        createList(args[0]);
    }
}

function del(list, args) {
    if (list) {
        deleteItem(list, parseInt(args));
    } else {
        deleteList(list);
    }
}

function getLists(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

function getList(list) {
    return new Promise((resolve, reject) => {
        fs.readFile(`${lstDir}/${list}`, 'utf8', (err, file) => {
            if (err) {
                reject(err);
            } else {
                resolve(file.split('\n').filter((item) => {
                    return !!item;
                }));
            }
        });
    });
}

function createList(list, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${lstDir}/${list}`, data || '', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function deleteList(list) {
    return new Promise((resolve, reject) => {
        fs.unlink(`${lstDir}/${list}`, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function addItem(list, args) {
    return new Promise((resolve, reject) => {
        fs.appendFile(`${lstDir}/${list}`, '\n' + args.join(' '), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function deleteItem(listName, itemIdx) {
    return new Promise((resolve, reject) => {
        getList(listName)
            .then((list) => {
                let newList = list.split('\n')
                newList.splice(itemIdx, 1);
                newList = newList.join('\n');
                createList(listName, newList)
                    .then(resolve)
                    .catch(reject);
            });
    });
}

module.exports = {
    list: list,
    add: add,
    delete: del
};

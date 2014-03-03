/**
 * @description My site's build sysmte
 * @author sunnylost
 * @version 0.0.1
 */

var fat = module.exports = {};
var command = require('commander');

command
    .version('0.0.1')
    .option('-p, --pepper', 'add pepper');

command
    .command('test')
    .description('I just want a test.')
    .action(function(args) {
        console.log(command.pepper);
    });

fat.cli = {
    run: function(args) {
        command.parse(args);
    }
};
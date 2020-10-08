const {
  Command,
  flags
} = require('@oclif/command')
const compiler = require('vue-template-compiler');
const glob = require("glob");
const path = require('path')
const fs = require('fs');
const {
  exec
} = require("child_process"); // options is optional


class FunlogCommand extends Command {
  async run() {
    const {
      flags
    } = this.parse(FunlogCommand)
    const absolute_file_path = path.resolve(flags.path || '')
    const onlyHandleCss = flags.css
    const root = this.config.root;
    console.log(absolute_file_path);

    if (onlyHandleCss) {
      glob('**/*.{css,less,sass,scss,vue}', {
        cwd: `${absolute_file_path}`
      }, function (er, files) {
        // files is an array of filenames.
        // If the `nonull` option is set, and nothing
        // was found, then files is ["**/*.js"]
        // er is an error object or null.
        console.log(files);
        files.forEach(function (file, i) {
          file = absolute_file_path + '/' + file;
          console.log(file);
          const ext = path.extname(file);
          if (ext == '.css' ||
            ext == '.less' ||
            ext == '.sass' ||
            ext == '.scss'
          ) {
            fs.readFile(file, function (err, data) {
              if (err) throw err;
              const read_file_line_array = data.toString().split("\n");
              for (i in read_file_line_array) {
                const line = read_file_line_array[i];
                const line_number = parseInt(i) + 1;
                if (/ *\}$/.test(line)) {
                  const space = ' ';
                  console.log(line.length);
                  read_file_line_array[i] = `${space.repeat((line.length-1)*4 + 4)}content:'file: ${file}, line: ${line_number}';\n${line}`
                  // console.log(read_file_line_array[i]);
                }
              }
              const write_data = read_file_line_array.join("\n");
              fs.writeFile(file, write_data, {
                flag: 'r+'
              }, (err) => {
                if (err) {
                  throw err;
                }
              });
            });
          } else if (ext == '.vue') {
            fs.readFile(file, function (err, data) {
              if (err) throw err;
              const read_file_line_array = data.toString().split("\n");
              let enterStyleArea = false;
              for (i in read_file_line_array) {
                const line = read_file_line_array[i];
                if (/^ *< *style\b/.test(line)) {
                  enterStyleArea = true;
                  // console.log('enterStyleArea = true');
                  continue;
                }else if (/^ *<\/ *style\b/.test(line)) {
                  enterStyleArea = false;
                  // console.log('enterStyleArea = false');
                  continue;
                }
                if (!enterStyleArea) {
                  continue;
                }
                const line_number = parseInt(i) + 1;
                if (/ *\}$/.test(line)) {
                  const space = ' ';
                  console.log(line.length);
                  read_file_line_array[i] = `${space.repeat((line.length-1)*4 + 4)}content:'file: ${file}, line: ${line_number}';\n${line}`
                  // console.log(read_file_line_array[i]);
                }
              }
              const write_data = read_file_line_array.join("\n");
              fs.writeFile(file, write_data, {
                flag: 'r+'
              }, (err) => {
                if (err) {
                  throw err;
                }
              });
            });
          }
        });
      });
    } else {
      glob('**/*.{ts,vue,js}', {
        cwd: `${absolute_file_path}`
      }, function (er, files) {
        // files is an array of filenames.
        // If the `nonull` option is set, and nothing
        // was found, then files is ["**/*.js"]
        // er is an error object or null.

        console.log(files);
        files.forEach(function (file, i) {
          file = absolute_file_path + '/' + file;
          console.log(file);
          const ext = path.extname(file);
          let parser_type = 'flow';
          if (ext == '.js') {
            parser_type = 'babel'
          } else if (ext == '.ts') {
            parser_type = 'ts'
          }

          exec(`jscodeshift -t ${root}/src/t.js --parser=${parser_type} ${file}`, (error, stdout, stderr) => {
            if (error) {
              console.log(`error: ${error.message}`);
              return;
            }

            if (stderr) {
              console.log(`stderr: ${stderr}`);
              return;
            }

            console.log(`stdout: ${stdout}`);

          });
        });
      });
    }
  }
}

FunlogCommand.description = `
funlog -p /home/fanrong/funlog/test           only add log to function

funlog -c -p /home/fanrong/funlog/test        only add log to css
`

FunlogCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({
    char: 'v'
  }),
  // add --help flag to show CLI version
  help: flags.help({
    char: 'h'
  }),
  path: flags.string({
    char: 'p',
    description: 'path of dir or file'
  }),
  css: flags.boolean({
    char: 'c',
    description: 'for only handle css, default is only hanlde js'
  }),
}

module.exports = FunlogCommand

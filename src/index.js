const {
  Command,
  flags
} = require('@oclif/command')
const {
  color
} = require('@oclif/color')
// const compiler = require('vue-template-compiler');
const glob = require("glob");
const path = require('path')
const fs = require('fs');
const {
  exec
} = require("child_process"); // options is optional


class FunlogCommand extends Command {

  handleCSSForFile(file) {
    const ext = path.extname(file).toLowerCase();
    console.log(file);
    let space_alignment_count = 4;
    if (ext == '.css' ||
      ext == '.less' ||
      ext == '.sass' ||
      ext == '.scss'
    ) {
      fs.readFile(file, (err, data) => {
        if (err) {
          console.log(color.red(`css-fail: ${file}`));
          throw err;
        }
        const read_file_line_array = data.toString().split("\n");
        for (const i in read_file_line_array) {
          const line = read_file_line_array[i];
          const line_number = parseInt(i) + 1;
          if (/ *\} */.test(line)) {
            const space = ' ';
            // console.log(line.length);
            if (ext != '.css') {
              space_alignment_count = 1;
            }
            read_file_line_array[i] = `${space.repeat(line.length-1 + space_alignment_count)}content:'file: ${file}, line: ${line_number}';\n${line}`
            // console.log(read_file_line_array[i]);
          }
        }
        const write_data = read_file_line_array.join("\n");
        fs.writeFile(file, write_data, {
          flag: 'r+'
        }, (err) => {
          if (err) {
            console.log(color.red(`css-fail: ${file}`));
            throw err;
          }
        });
      });
    } else if (ext == '.vue') {
      fs.readFile(file, (err, data) => {
        if (err) {
          console.log(color.red(`css-fail: ${file}`));
          throw err;
        }
        const read_file_line_array = data.toString().split("\n");
        // console.log(read_file_line_array);
        let enterStyleArea = false;
        for (const i in read_file_line_array) {
          const line = read_file_line_array[i];
          if (/^ *< *style\b/.test(line)) {
            enterStyleArea = true;
            // console.log('enterStyleArea = true');
            continue;
          } else if (/^ *<\/ *style\b/.test(line)) {
            enterStyleArea = false;
            // console.log('enterStyleArea = false');
            continue;
          }
          if (!enterStyleArea) {
            continue;
          }
          const line_number = parseInt(i) + 1;
          if (/ *\} */.test(line)) {
            const space = ' ';
            read_file_line_array[i] = `${space.repeat(line.length-2 + space_alignment_count)}content:'file: ${file}, line: ${line_number}';\n${line}`
            // console.log(read_file_line_array[i]);
          }
        }
        const write_data = read_file_line_array.join("\n");
        fs.writeFile(file, write_data, {
          flag: 'r+'
        }, (err) => {
          if (err) {
            console.log(color.red(`css-fail: ${file}`));
            throw err;
          }
        });
      });
    } else {
      console.log(color.red(`css-fail:\ncan not find the path:\n${file}`));
    }
  }

  handleFunctionForFile(file) {
    // console.log(file);
    const ext = path.extname(file).toLowerCase();
    let parser_type = 'flow';
    if (ext == '.js') {
      parser_type = 'babel'
    } else if (ext == '.ts') {
      parser_type = 'ts'
    }
    const root_path = this.config.root;
    exec(`jscodeshift -t ${root_path}/src/t.js --parser=${parser_type} ${file}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        console.log(color.red(`function-fail: ${file}`));
        return;
      }

      if (stderr) {
        console.log(`stderr: ${stderr}`);
        console.log(color.red(`function-fail: ${file}`));
        return;
      }

      if (/1 *ok/.test(stdout)) {} else {
        console.log(color.red(`function-fail: ${file}`));
      }
    });
  }

  async run() {
    const {
      flags
    } = this.parse(FunlogCommand)
    const absolute_file_path = path.resolve(flags.path || '')
    const onlyHandleCss = flags.css
    // console.log(absolute_file_path);

    const incomePathExt = path.extname(absolute_file_path);

    if (onlyHandleCss) {
      if (incomePathExt.length == 0) {
        glob('**/*.{css,less,sass,scss,vue}', {
          cwd: `${absolute_file_path}`
        }, (er, files) => {
          // files is an array of filenames.
          // If the `nonull` option is set, and nothing
          // was found, then files is ["**/*.js"]
          // er is an error object or null.
          // console.log(files);
          files.forEach((file, i) => {
            file = absolute_file_path + '/' + file;
            // console.log(file);
            this.handleCSSForFile(file);
          });
        });
      } else {
        this.handleCSSForFile(absolute_file_path)
      }
    } else {
      if (incomePathExt.length == 0) {
        glob('**/*.{ts,vue,js}', {
          cwd: `${absolute_file_path}`
        }, (er, files) => {
          // files is an array of filenames.
          // If the `nonull` option is set, and nothing
          // was found, then files is ["**/*.js"]
          // er is an error object or null.

          // console.log(files);
          files.forEach((file, i) => {
            file = absolute_file_path + '/' + file;
            console.log(file);
            this.handleFunctionForFile(file)
          });
        });
      } else {
        this.handleFunctionForFile(absolute_file_path)
      }
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

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
    let space_alignment_count = 1;
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

          if (/^\s*\}\s*$/.test(line)) {
            const space = '\t';
            // console.log(line.length);
            const next_line_space = line.replace('}', '');
            read_file_line_array[i] = `${next_line_space}${space.repeat(space_alignment_count)};--locate:'file: ${file}, line: ${line_number}';\n${line}`
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
        let currentInStyleArea = false;
        for (const i in read_file_line_array) {
          const line = read_file_line_array[i];
          if (/^ *< *style\b/.test(line)) {
            currentInStyleArea = true;
            // console.log('enterStyleArea = true');
            continue;
          } else if (/^ *<\/ *style\b/.test(line)) {
            currentInStyleArea = false;
            // console.log('enterStyleArea = false');
            continue;
          }
          if (!currentInStyleArea) {
            continue;
          }
          const line_number = parseInt(i) + 1;
          if (/^\s*\}\s*$/.test(line)) {
            const space = '\t';
            const next_line_space = line.replace('}', '');
            read_file_line_array[i] = `${next_line_space}${space.repeat(space_alignment_count)};--locate:'file: ${file}, line: ${line_number}';\n${line}`
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
    let parser_type = 'babel';

    if (ext == '.vue') {
      fs.readFile(file, (err, data) => {
        if (err) {
          console.log(color.red(`js-fail: ${file}`));
          throw err;
        }
        const read_file_line_array = data.toString().split("\n");
        const collection_javascript_code_array = []
        const above_javascript_code_array = []
        const below_javascript_code_array = []

        // TODO: optimization for get above_javascript_code_array and below_javascript_code_array by index

        // console.log(read_file_line_array);
        let currentInJavascriptArea = false;
        let didEnterJavascriptArea = false;
        for (const i in read_file_line_array) {
          const line = read_file_line_array[i];
          if (/^ *< *script/.test(line)) {
            currentInJavascriptArea = true;
            above_javascript_code_array.push(line);
            if (/ts/.test(line)) {
              parser_type = 'ts'
            }
            // console.log('enterJavascriptArea = true');
            continue;
          } else if (/^ *<\/ *script/.test(line)) {
            currentInJavascriptArea = false;
            didEnterJavascriptArea = true;
            below_javascript_code_array.push(line);
            parser_type = 'babel';
            // console.log('enterJavascriptArea = false');
            continue;
          }
          if (!currentInJavascriptArea) {
            // collection above_javascript_code_array or below_javascript_code_array
            if (didEnterJavascriptArea) {
              below_javascript_code_array.push(line);
            } else {
              above_javascript_code_array.push(line);
            }

            continue;
          }
          // console.log(line);
          // collect code of js
          collection_javascript_code_array.push(line);
        }
        const write_data = collection_javascript_code_array.join("\n");
        // console.log(write_data);
        fs.writeFile(`${file}.tmp`, write_data, {
          flag: 'w+'
        }, (err) => {
          if (err) {
            console.log(color.red(`js-fail: ${file}`));
            throw err;
          }

          // handle the code of js
          this.codeshiftForJS(parser_type, `${file}.tmp`, (succeed) => {
            if (!succeed) {
              return;
            }
            // read the transformed code
            fs.readFile(`${file}.tmp`, (err, data) => {
              if (err) {
                console.log(color.red(`js-fail: ${file}`));
                throw err;
              }
              const transformedJSCode_array = data.toString().split("\n");

              // concat source
              const transformedAllCode_array = [...above_javascript_code_array, ...transformedJSCode_array, ...below_javascript_code_array];

              // write to origin file
              const write_data = transformedAllCode_array.join("\n");
              // console.log(transformedJSCode_array);
              fs.writeFile(file, write_data, {
                flag: 'w+'
              }, (err) => {
                if (err) {
                  console.log(color.red(`js-fail: ${file}`));
                  throw err;
                }
              });
            })
          });
        });
      });
      return;
    }

    if (ext == '.js') {
      parser_type = 'babel'
    } else if (ext == '.ts') {
      parser_type = 'ts'
    }
    this.codeshiftForJS(parser_type, file);
  }

  codeshiftForJS(parser_type, file, callback) {
    const root_path = this.config.root;
    exec(`${root_path}/node_modules/.bin/jscodeshift -t ${root_path}/src/t.js --parser=${parser_type} ${file}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        console.log(color.red(`function-fail: ${file}`));
        if (callback) {
          callback(false);
        }
        return;
      }

      if (stderr) {
        console.log(`stderr: ${stderr}`);
        console.log(color.red(`function-fail: ${file}`));
        if (callback) {
          callback(false);
        }
        return;
      }

      if (/1 *ok/.test(stdout)) {
        if (callback) {
          callback(true);
        }
      } else {
        console.log(color.red(`function-fail: ${file}`));
        if (callback) {
          callback(false);
        }
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

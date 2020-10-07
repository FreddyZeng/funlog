const {
  Command,
  flags
} = require('@oclif/command')
const compiler = require('vue-template-compiler');
var glob = require("glob");
var path = require('path')

const {
  exec
} = require("child_process"); // options is optional


class FunlogCommand extends Command {
  async run() {
    const {
      flags
    } = this.parse(FunlogCommand)
    const file_path = path.resolve(flags.path || '')
    const handleCss = flags.css
    const root = this.config.root;
    console.log(file_path);
    glob('**/*.{ts,vue,js}', {
      cwd: `${file_path}`
    }, function (er, files) {
      // files is an array of filenames.
      // If the `nonull` option is set, and nothing
      // was found, then files is ["**/*.js"]
      // er is an error object or null.
    
      console.log(files);
      files.forEach(function (file, i) {
        file = file_path + '/' + file;
        console.log(file);
        const ext = path.extname(file);
        let parser_type = 'flow';
        if (ext == '.js') {
          parser_type = 'babel'
        }else if (ext == '.ts') {
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

    if (handleCss) {
      
    }
  }
}

FunlogCommand.description = `Describe the command here
...
Extra documentation goes here
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
  css: flags.option({
    description: 'for handle css'
  }),
}

module.exports = FunlogCommand

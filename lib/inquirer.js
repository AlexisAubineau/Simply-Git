const inquirer   = require('inquirer');
const files      = require('./files');

module.exports = {

  askGithubCredentials: () => {
    const questions = [
      {
        name: 'username',
        type: 'input',
        message: 'Entrez vôtre username ou vôtre adresse GitHub:',
        validate: function( value ) {
            if (value.length) {
            return true;
          } else {
            return 'Entrez vôtre username ou vôtre adresse GitHub.';
          }
        }
      },
      {
        name: 'password',
        type: 'password',
        message: 'Entrez vôtre mot de passe:',
        validate: function(value) {
          if (value.length) {
            return true;
          }
          else {
            return 'Entrez vôtre mot de passe.';
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  },
  askRepoDetails: () => {
    const argv = require('minimist')(process.argv.slice(2));

    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Entrez le nom de votre répertoire:',
        default: argv._[0] || files.getCurrentDirectoryBase(),
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Veuillez entrer le nom de votre répertoire.';
          }
        }
      },
      {
        type: 'input',
        name: 'description',
        default: argv._[1] || null,
        message: '(Optionel) Entrez une description pour votre répertoire:'
      },
      {
        type: 'list',
        name: 'visibility',
        message: 'Public ou Privé:',
        choices: [ 'public', 'private' ],
        default: 'public'
      }
    ];
    return inquirer.prompt(questions);
  },
  askIgnoreFiles: (filelist) => {
    const questions = [
      {
        type: 'checkbox',
        name: 'ignore',
        message: 'Selectionnez les fichiers et/ou dossiers que vous voulez ignoner:',
        choices: filelist,
        default: ['node_modules', 'bower_components', 'simply-git.js', 'lib', 'package.json', 'package-lock.json']
      }
    ];
    return inquirer.prompt(questions);
  },
}
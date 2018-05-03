#!/usr/bin/env node

const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');
const files       = require('./lib/files');
const inquirer    = require('./lib/inquirer');
const repo        = require('./lib/repo');
const github      = require('./lib/github');
const program     = require('commander');
const fs          = require('fs');
const gutil       = require('gulp-util');
const { exec }    = require('child_process');
const readline    = require('readline');

program
  .version('0.0.3', '-v, --version')
  .option('-c, --create', 'Création du dépot et premier push')
  .option('-s, --ssh', 'Tuto pour attribuer sa clée public ssh à github')
  .option('-r, --remove', 'Supprimer dossier .git et .gitignore')
  .parse(process.argv);

if (program.create){
  clear();
  console.log(
    chalk.green(
      figlet.textSync('Simply - Git', { horizontalLayout: 'full' })
    )
  );
  
  if (files.directoryExists('.git')) {
      console.log(chalk.red('Il y a déjà un répertoire GitHub!'));
      process.exit();
  }
  const getGithubToken = async () => {
    let token = github.getStoredGithubToken();
    if(token) {
      return token;
    }
    await github.setGithubCredentials();
    token = await github.registerNewToken();
    return token;
  }
  const run = async () => {
    try {
      const token = await getGithubToken();
      github.githubAuth(token);
      const url = await repo.createRemoteRepo();
      await repo.createGitignore();
      const done = await repo.setupRepo(url);
      if(done) {
        console.log(chalk.green('Tout est fait!'));
      }
    } catch(err) {
        if (err) {
          switch (err.code) {
            case 401:
              console.log(chalk.red('Impossible de vous connecter. Verifiez vos identifiants.'));
              break;
            case 422:
              console.log(chalk.red('Un dépot existe déja avec ce nom'));
              break;
            default:
              console.log(err);
          }
        }
    }
  }
  run();
}

else if(program.ssh){
  clear();
  console.log(
    chalk.green(
      figlet.textSync('Simply - Git', { horizontalLayout: 'full' })
    ),
    '\n En assumant que vous êtes connecté à Github par SSH ,vous pouvez lancer la commande ci-dessous pour le confirmer.\n',
    '\n $ git config --get remote.origin.url\n',
    '\n Si vous avez comme réponse ce résultat : git@github.com:xxx/xxx.github.com.git, il vous reste plus qu\'a suivre les étapes suivantes.\n',
    '\n Etape 1: Générer la paire de clée public/privée\n',
    '\n $ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"',
    '\n Il vous demandera de confirmer l\'emplacement où sauvegarder la clée et quelle passphrase voulez vous utiliser.\n',
    '\n Etape 2: Ajouter votre clée à l\'agent SSH\n',
    '\n Assurer vous que que l\'agent ssh soit actif.',
    '\n $ eval "$(ssh-agent -s)"',
    '\n Ajouter votre clée ssh dans l\'agent ssh',
    '\n $ ssh-add ~/.ssh/id_rsa \n',
    '\n Etape 3: Ajouter votre clée ssh à votre compte\n',
    '\n $ cat ~/ssh/id_rsa.pub',
    '\n Il reste plus qu\'a copié le résultat et l\'enregistrer sur votre compte Github',
    '\n Allez dans Settings->SSH keys(personal settings)->Ajouter la clée SSH->Completer le formulaire->Ajouter la clée'
  );
}

else if(program.remove){
  clear();
  console.log(
    chalk.green(
      figlet.textSync('Simply - Git', { horizontalLayout: 'full' })
    )
  );
  exec("rm -rf ./.git", function(err, stdout, stderr){
    if(err){
      return console.error('ERR>', err)
    }
  })
  exec("rm -rf ./.gitignore", function(err, stdout, stderr){
    if(err){
      return console.error('ERR>', err)
    }
  })
  console.log('Suppression effectué avec succès')
}

else{
  clear();
  console.log(
    chalk.green(
      figlet.textSync('Simply - Git', { horizontalLayout: 'full' })
    )
  );
  program.help()
}
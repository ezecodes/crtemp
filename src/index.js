import arg from 'arg';
import inquirer from 'inquirer';
import {makeTemplates, initGit, installDependencies} from './main.js';
import { templateNames, configFileName} from './utils/constants.js';
import chalk from 'chalk';
import config from './configs/templateConfig.js';
import {constants, access, mkdir, appendFile, readFile} from 'fs/promises';
import Listr from 'listr';
import path from 'path';

function parseArgs(passedArgs) {
	let args

	return new Promise((resolve, reject) => {
		try {
			args = arg({
				'--git': Boolean,
				'--yes': Boolean,
				'--dep': Boolean,
				'-d': '--dep',
				'-y': '--yes',
				'-g': '--git'
			}, {
				argv: passedArgs.slice(2)
			})

			resolve({
				git: args['--git'] ?? false,
				skipProtocols: args['--yes'] ?? false,
				installDependency: args['--dep'] ?? false,
				template: args._[0]
			});
		} catch (err) {
			reject(err)
		}
	})

}

async function promptForMissingOptions(options) {
	const {git, skipProtocols, template, installDependency} = options;
	const defaultTemplate = templateNames.EXPRESS;
	let questions = [], answers;

	if (skipProtocols) {
		return {...options, template: options.template ?? defaultTemplate}
	}

	if (!git) {
		questions.push({
			type: 'confirm',
			name: 'git',
			message: 'Do you want to initialize a git repo?',
			default: false
		})
	};
	if (!installDependency) {
		questions.push({
			type: 'confirm',
			name: 'installDependency',
			message: 'Do you want to want to install packages?',
			default: false
		})
	};
	if (!template) {
		questions.push({
			type: 'list',
			name: 'template',
			message: 'Please select a template.',
			choices: [templateNames.EXPRESS, templateNames.REACT],
			default: defaultTemplate
		})
	};

	answers = await inquirer.prompt(questions)
	return {
		...options,
		...answers
	}
}

function isTemplateSupported(template) {
	const templateNamesArray = Object.values(templateNames);
	const findIndex = templateNamesArray.findIndex(constant => constant === template)
	if (findIndex === -1) {
		return false
	} 
	return true
}

export default async function index(rawArgs) {
	let cwdPath = path.normalize(process.cwd());
	let workingTemplate
	const rootDirName = 'make-template';

	parseArgs(rawArgs)
	.then(async options => {

		if (options.template !== undefined && !isTemplateSupported(options.template)) {
			console.log(`The template passed "${options.template}" is not supported. \nTry adding it at https://github.com/jahdevelops/app-generator`)
			process.exit(1)
		}

		options = await promptForMissingOptions(options);
		cwdPath = path.join(cwdPath);

		try {
			let workingTemplates = await readFile(path.join(cwdPath, configFileName), {encoding: 'utf8'})
			workingTemplates = JSON.parse(workingTemplates)
		// console.log(workingTemplates)
			workingTemplate = workingTemplates.find(i => i.name === options.template);
		} catch (err) {
			workingTemplate = config.templates.find(i => i.name === options.template);
		}


		try {
			await access(cwdPath, constants.W_OK | constants.R_OK)

			try {
				options = {...options, cwdPath, workingTemplate}

				const tasks = new Listr([
					{	
						title: 'Create Project directories and files',
						task: () => makeTemplates(options)
					}, 
					{
						title: 'Initialize Git',
						task: () => initGit({cwdPath}),
						enabled: () => options.git
					},
					{
						title: 'Installing dependencies',
						task: () => installDependencies({cwdPath, template: options.template}),
						enabled: () => options.installDependency
					}
				])
				await tasks.run()

			} catch (err) {
				console.error(err)
			}
			
		} catch (err) {
			console.log(chalk.red('Can\'t access this directory as it is neither readable nor writable.'))
			console.error(err)
		}
	})
	.catch(err => {
		if (err?.code === 'ARG_UNKNOWN_OPTION') {
			console.log(chalk.red('Something went wrong! \nYou passed in an unkown option.'))
		} else {
			console.error(err)
		}
	})
}
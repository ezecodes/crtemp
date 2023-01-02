import arg from 'arg';
import inquirer from 'inquirer';
import {makeTemplates, initGit, installDependencies} from './main.js';
import configConstants from './utils/constants.js';
import chalk from 'chalk';
import config from './configs/templateConfig.js';
import {constants, access, mkdir, appendFile} from 'fs/promises';
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
	const defaultTemplate = configConstants.EXPRESS;
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
			choices: [configConstants.EXPRESS, configConstants.REACT],
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
	const constantsArray = Object.values(configConstants);
	const findIndex = constantsArray.findIndex(constant => constant === template)
	if (findIndex === -1) {
		return false
	} 
	return true
}

export default async function index(rawArgs) {
	const cwdPath = path.normalize(process.cwd());
	const rootDirName = 'make-template';

	parseArgs(rawArgs)
	.then(async options => {

		if (!isTemplateSupported(options.template)) {
			throw new Error(`The template passed "${options.template}" is not supported. Try adding it https://github.com/jahdevelops/app-generator`)
		}

		options = await promptForMissingOptions(options);
		const workingTemplate = config.templates.find(i => i.name === options.template);
		const rootDirPath = path.join(cwdPath, rootDirName, workingTemplate.name);

		try {
			await access(cwdPath, constants.W_OK | constants.R_OK)

			try {
				await mkdir(rootDirPath, {recursive: true});
				options = {...options, rootDirPath, workingTemplate}

				const tasks = new Listr([
					{	
						title: 'Create Project directories and files',
						task: () => makeTemplates(options)
					}, 
					{
						title: 'Initialize Git',
						task: () => initGit({cwdPath: rootDirPath}),
						enabled: () => options.git
					},
					{
						title: 'Installing dependencies',
						task: () => installDependencies({cwdPath: rootDirPath, template: options.template}),
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
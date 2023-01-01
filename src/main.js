import chalk from 'chalk';
import path from 'path';
import { mkdir, appendFile, copyFile} from 'fs/promises';
import {execa} from 'execa';
import { projectInstall } from 'pkg-install';

/**
	@param {String} rootPath
	@param {Array} rootTemplateDirs
*/
async function mkdirRecursively(rootPath, rootTemplateDirs) {
	return new Promise((resolve, reject) => {
		if (rootTemplateDirs && rootTemplateDirs.length === 0) {
			resolve()
		}

		rootTemplateDirs.forEach(async dir => {
			const {name, dirs, files} = dir
			const newDirPath = path.join(rootPath, name);
			try {
				await mkdir(newDirPath, {recursive: true});

				if (dirs && dirs.length > 0) {
					mkdirRecursively(newDirPath, dirs)
				}

				if (files && files.length > 0) {
					createRootFiles(newDirPath, files)
				}
			} catch (err) {
				console.error(chalk.red("Could not create dir"), err);
			}
		})
	})
}

export async function initGit({cwdPath}) {
	const gitignorePath = path.join(cwdPath, '.gitignore');
	const readmeFile = path.join(cwdPath, 'readme.md');
	const result = await execa('git', ['init'], {
		cwd: cwdPath
	})

	try {
		await appendFile(gitignorePath, '');
	} catch (err) {
		console.error(err)
	}

	if (result.failed) {
		return Promise.reject(new Error("Failed to init git"));
	}
}

export async function installDependencies({cwdPath, template}) {

	const absSrcUrl = new URL(import.meta.url).pathname;
	let srcPackageFile = path.resolve(absSrcUrl, path.normalize(`../templateFiles/${template}/package.json`));
	srcPackageFile = srcPackageFile.slice(3, srcPackageFile.length);
	const destPackageFile = path.join(cwdPath, 'package.json')
	try {
		await copyFile(srcPackageFile, destPackageFile)
		projectInstall({cwd: cwdPath})
	} catch (err) {
		console.error(err)
	}
}


// @param {String} rootFilesPath
// @param {Array} files
async function createRootFiles(rootFilesPath, files) {
	if (files?.length === 0) return
	files.forEach(async fileName => {
		const fileNamePath = path.join(rootFilesPath, fileName)
		const fileData = ''
		try {
			await appendFile(fileNamePath, fileData);
		} catch (err) {
			console.error(chalk.red('Could not create file'), err)
		}
	})
}

/**
	@param {Object} options
	@param {Boolean} options.git
	@param {Boolean} options.skipProtocols
	@param {Boolean} options.installDependency
	@param {String} options.template
*/
export async function makeTemplates(options) {
	const { rootDirPath, workingTemplate} = options;
	try {
		mkdirRecursively(rootDirPath, workingTemplate.dirs)
		createRootFiles(rootDirPath, workingTemplate.files)
	} catch (err) {
		console.error(err)
	}
}

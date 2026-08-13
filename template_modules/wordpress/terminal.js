import { exec } from "child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import { dirname } from "path"

import logger from '../logger.js'

const args = process.argv.slice(2)

const isMacOS = process.platform === "darwin"
const isLinux = process.platform === "linux"

const isSudo = isMacOS || isLinux ? "sudo " : ""

const startScriptString = `${isSudo}docker compose up -d`
const stopScriptString = `${isSudo}docker compose down --volumes`
const phpUploadsConfigPath = "backend/php/uploads.ini"
const phpUploadsConfig = `upload_max_filesize = 5G
post_max_size = 5G
memory_limit = 5G
max_execution_time = 1200
max_input_time = 1200
`
const themeStylePath = "src/components/wordpress/fls-theme/style.css"
const themeAuthor = "kotlancer"
const themeAuthorUri = "https://t.me/kotlancer"

if (args.includes("up")) {
	dockerStart()
} else if (args.includes("down")) {
	dockerStop()
}
function dockerStart() {
	ensurePhpUploadsConfig()
	ensureThemeMeta()
	logger("(!)Запуск Docker...")
	exec(startScriptString, (error, stdout, stderr) => {
		if (error) {
			logger(`(!!)Ошибка: ${error.message}`)
			return
		}
		//if (stderr) {
		//	logger(`Предупреждение: ${stderr}`)
		//}
		logger(`Docker запущен`) //:\n${stdout}
	})
}
function ensurePhpUploadsConfig() {
	if (existsSync(phpUploadsConfigPath)) return

	mkdirSync(dirname(phpUploadsConfigPath), { recursive: true })
	writeFileSync(phpUploadsConfigPath, phpUploadsConfig)
}
function ensureThemeMeta() {
	if (!existsSync(themeStylePath)) return

	const content = readFileSync(themeStylePath, "utf8")
	const updatedContent = content
		.replace(/^Author:\s?.*$/m, `Author: ${themeAuthor}`)
		.replace(/^Author URI:\s?.*$/m, `Author URI: ${themeAuthorUri}`)

	if (updatedContent === content) return

	writeFileSync(themeStylePath, updatedContent)
}
function dockerStop() {
	logger("(!)Остановка Docker...")
	exec(stopScriptString, (error, stdout, stderr) => {
		if (error) {
			logger(`(!!)Ошибка: ${error.message}`)
			return
		}
		//if (stderr) {
		//logger(`(!!)Предупреждение: ${stderr}`)
		//}
		logger(`Docker остановился`) //:\n${stdout}
	})
}

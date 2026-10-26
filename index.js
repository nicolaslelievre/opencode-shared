import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.dirname(fileURLToPath(import.meta.url))
const assets = path.join(root, "assets")

function parse(file) {
  const raw = fs.readFileSync(file, "utf8")
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const meta = {}
  if (!m) return { meta, body: raw.trim() }
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":")
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { meta, body: m[2].trim() }
}

function mdFiles(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"))
}

export const SharedPlugin = async () => ({
  config: async (config) => {
    const skillsDir = path.join(assets, "skills")
    if (fs.existsSync(skillsDir)) {
      if (Array.isArray(config.skills)) config.skills.push(skillsDir)
      else {
        config.skills ??= {}
        config.skills.paths ??= []
        config.skills.paths.push(skillsDir)
      }
    }
    config.command ??= {}
    for (const f of mdFiles(path.join(assets, "commands"))) {
      const name = f.slice(0, -3)
      if (config.command[name]) continue
      const { meta, body } = parse(path.join(assets, "commands", f))
      config.command[name] = { ...meta, template: body }
    }
    config.agent ??= {}
    for (const f of mdFiles(path.join(assets, "agents"))) {
      const name = f.slice(0, -3)
      if (config.agent[name]) continue
      const { meta, body } = parse(path.join(assets, "agents", f))
      config.agent[name] = { ...meta, prompt: body }
    }
  },
})

export default { id: "opencode-shared", server: SharedPlugin }

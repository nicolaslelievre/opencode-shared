# opencode-shared

Shared OpenCode skills, agents and commands, injected in memory via the plugin `config` hook.

Enable in a repo's `opencode.json`:

```json
{ "plugin": ["github:nicolaslelievre/opencode-shared#v0.1.0"] }
```

Opt out of a skill: `"permission": { "skill": { "hello-skill": "deny" } }`.
Repo-defined commands/agents with the same name override the shared ones.

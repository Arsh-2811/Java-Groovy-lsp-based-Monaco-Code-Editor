# Monaco Language Client (Slimmed Java + Groovy Edition)

This repository is a minimal and production-ready setup of [monaco-languageclient](https://github.com/TypeFox/monaco-languageclient), tailored specifically to support **Java** and **Groovy** via the Language Server Protocol (LSP). It includes:

- 🎨 Monaco Editor (via wrapper and wrapper-react)
- 🧠 Monaco Language Client (LSP bridge)
- 🛠️ Java LSP: `eclipse.jdt.ls`
- 🎵 Groovy LSP: `groovy-language-server`
- ⚡ Vite-based dev server to preview and test

## 🐳 Language Server Setup (Docker)

The Java and Groovy LSPs are run using Docker Compose:

* **Java (eclipse.jdt.ls)**: Starts `eclipse.jdt.ls` server
* **Groovy**: Starts the `groovy-language-server` from ArtOfCode

No local JDKs or language servers are required on the host.

---

## 🛠️ Custom Cleanup

If you’re starting from the original `monaco-languageclient` repo, you can run:

```bash
./cleanup.sh
```

It will:

* Remove all languages except Java and Groovy
* Strip tests and tsconfig.test.json
* Patch broken scripts
* Clean unused examples

## 🙌 Credits

Modified and slimmed by [Arsh Sharan](mailto:arsh.sharan2811@gmail.com)
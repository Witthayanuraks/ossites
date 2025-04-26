class DebugConsoleInfo {
  constructor({ level = 0, name }) {
    // Level 0 = "all", 1 = "error", 2 = "warn", 3 = "debug/info"
    this.level = level
    this.adding = []
    if(name) {
      this.adding.push(`[${name}]`)
    }
  }
  log(...message) {
    if(this.level == 0 || this.level == 3) {
      console.log(...this.adding,"[\x1b[90mLog\x1b[0m]:",...message)
    }
  }
  info(...message) {
    if(this.level == 0 || this.level == 3) {
      console.log(...this.adding,"[\x1b[34mInfo\x1b[0m]:",...message)
    }
  }
  success(...message) {
    if(this.level == 0 || this.level == 3) {
      console.log(...this.adding,"[\x1b[32mSuccess\x1b[0m]:",...message)
    }
  }
  warn(...message) {
    if(this.level == 0 || this.level == 3) {
      console.warn(...this.adding,"[\x1b[33mWarning\x1b[0m]:",...message)
    }
  }
  error(...message) {
    if(this.level == 0 || this.level == 1) {
      console.error(...this.adding,"[\x1b[31mError\x1b[0m]:",...message)
    }
  }
}

module.exports = DebugConsoleInfo
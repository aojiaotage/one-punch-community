class BaseHTTPError extends Error {
  constructor (msg, OPCode, httpCode, httpMsg) {
    super(msg)
    this.OPCode = OPCode
    this.httpCode = httpCode
    this.httpMsg = httpMsg
    this.name = 'BaseHTTPError'
  }

  static get['DEFAULT_OPCODE'] () {
    return 1000000
  }
}

class InternalError extends BaseHTTPError {
  constructor (msg) {
    const OPCode = 1000001
    const httpMsg = '服务器好像开小差了，一会儿再试试？'
    super(msg, OPCode, 500, httpMsg)
  }
}

class ValidationError extends BaseHTTPError {
  constructor (path, reason) {
    const OPCode = 2000000
    const httpCode = 400
    super(`error validating param, path: ${path}, reason: ${reason}`, OPCode,
      httpCode, '参数错误，请检查后再重试~')
    this.name = 'ValidationError'
  }
}

class DuplicatedUserNameError extends ValidationError {
  constructor (username) {
    super('username', `duplicate user name: ${username}`)
    this.httpMsg = '这个昵称已经被使用啦，不如换一个吧~'
    this.OPCode = 2000001
  }
}

module.exports = {
  BaseHTTPError,
  ValidationError,
  DuplicatedUserNameError,
  InternalError,
}

import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token, {
    expires: 10
  })
}

export function removeToken () {
  return Cookies.remove('token')
}

export function setNurseUnit (value) {
  return Cookies.set('NurseUnit', value)
}
export function getNurseUnit () {
  return Cookies.get('NurseUnit')
}

import Avatar from '../../assets/img/avatar4.png'

export function imgError(target) {
  console.log('onerror', target.onerror)
  if (target.onerror === null) {
    target.src = Avatar
  }
}

/**
 * @author: chenwenliang
 * @description:
 * @Date: 2019/5/13 14:11
 */

export default function getStorageUser (str) {
  return JSON.parse(localStorage.getItem(`${str}`))
}

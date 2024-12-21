/*
 * @Author: 范博
 * @Owner: 
 * @Date: 2021-12-24 14:39:14
 * @LastEditTime: 2022-06-27 09:08:35
 * @LastEditors: 范博
 * @Description: 
 * @FilePath: \yarward-wnms-frontEnd\src\assets\wnms\utils\storageUser.js
 */
/**
 * @author: chenwenliang
 * @description:
 * @Date: 2019/5/13 14:11
 */

export default function getStorageUser (str) {
  return JSON.parse(localStorage.getItem(`${str}`));
}

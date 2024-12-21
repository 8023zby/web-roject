/*
 * @Author: 王纪祥
 * @Owner: 王纪祥
 * @Date: 2021-11-26 09:26:45
 * @LastEditTime: 2021-11-26 11:56:46
 * @LastEditors: 王纪祥
 * @Description: enums
 * @FilePath: \yarward-wnms-frontEnd\src\assets\wnms\utils\enums.js
 */
// 发送消息类型（文字、音频、视频、图片）
export const EMessageViewType = Object.freeze({
	'text': 0,
	'image': 1,
	'audio': 2,
	'video': 3
})
export const EMessageViewTypeText = Object.freeze({
	[EMessageViewType.text]: '文字',
	[EMessageViewType.image]: '图片',
	[EMessageViewType.audio]: '音频',
	[EMessageViewType.video]: '视频'
})

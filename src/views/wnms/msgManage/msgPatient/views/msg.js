class msg {
	constructor(app) {
		this.app = app
	}
	DeviceData() {
	return	new Map([
			['bedHeadDevices', (T, T1) => {
		return	this.testAlert()
			}],
			['bedSideDevices', (T, T1, T2) => {
				console.log(T, T1, T2)
			}],
			['corridorDevices', (T) => {	}],
			['pdaUsers', (T) => {	}],
			['roomGateDevices', (T) => {	}],
			['touchScreenDevices', (T) => {	}],
			['voices', (T) => {	}],
			['webs', (T) => {	}]
		])
	}
	testAlert(T) {
		 return "我是测试啊啊"
	}
}

export default msg

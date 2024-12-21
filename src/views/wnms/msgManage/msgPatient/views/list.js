
import Msg from './msg'
export default {
	data() {
		return {

		}
	},
	mounted() {
		this.init()
	},
	methods: {
			init() {
				let msg = new Msg(this);
	 			let d = 	msg.DeviceData()
			}
	}
}

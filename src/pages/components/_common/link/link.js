/**
 * for dxb decorate
 */

import { Xls } from '@xls/public';

let XlsInstance = Xls.instance;
export default {
	name: 'xls-link',
	inheritAttrs: false,
	props: {
		to: {
			type: String,
			default: ''
		},
		enhancer: {
			type: [Function, Boolean],
			default: false
		}
	},
	data() {
		return {
			regex: new RegExp(`^(http|https)`)
		};
	},
	computed: {
		isCross() {
			return this.regex.test(this.to);
		}
	},
	beforeCreate() {
		this.regex = new RegExp(`^${this.$router.options.base}`);
	},
	methods: {
		handleClick(e) {
			const { $listeners: { click } } = this;

			// 增强
			if (this.enhancer === true || this.enhancer === 'function') {
				let { enhancer } = XlsInstance.config.Link || {};

				enhancer = typeof this.enhancer === 'function'
					? this.enhancer
					: enhancer;

				if (enhancer) {
					enhancer(e, this);
					return;
				}
			}

			let callback = () => {
				// 额外处理
				if (this.isCross && this.to) {
					window.location.href = this.to;
				} else {
					this.$router.push(this.to);
				}
			};

			let fn = click && click(e, callback);

			if (fn && fn.then) {
				return fn.then((res) => {
					callback();
					return res;
				}).catch((res) => {
					return Promise.reject(res);
				});
			} else if (!fn) {
				callback();
			}
		}
	},
	render(h) {
		let tag = 'a';

		let params = {
			attrs: this.$attrs,
			props: {
				to: this.to,
				...this.$attrs
			},
			on: {
				...this.$listeners,
				click: this.handleClick
			}
		};
		return h(tag, params, this.$slots.default);
	}
};

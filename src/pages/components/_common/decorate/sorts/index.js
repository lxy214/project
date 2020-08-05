import { pick } from 'lodash';
import CutOff from './cut-off.vue';
import Nav from './nav.vue';
import Page from './page.vue';
import Rtf from './rtf.vue';
import Notice from './notice.vue';
import Slide from './slide.vue';
import Space from './space.vue';
import Title from './title.vue';
import Video from './video.vue';
import Area from './area.vue';

const Decorate = {
	'xls-cutoff': CutOff,
	'xls-nav': Nav,
	'xls-notice': Notice,
	'xls-page': Page,
	'xls-rtf': Rtf,
	'xls-slide': Slide,
	'xls-space': Space,
	'xls-title': Title,
	'xls-video': Video,
	'xls-area': Area
};

export default {
	getComponents: (list) => {
		return pick(Decorate, list || Object.keys(Decorate));
	}
};

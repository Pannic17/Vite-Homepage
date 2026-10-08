import en from './en.js';
import cn from './cn.js';
import es from './es.js';
import {en as kaiwuEn, cn as kaiwuCn} from '../features/kaiwu/messages.js';
import {es as kaiwuEs} from '../features/kaiwu/messages-es.js';
import {en as uiEn, cn as uiCn, es as uiEs} from './interface.js';

export const messages = {
  'en-US': {...en, kaiwuViewer: kaiwuEn, ui: uiEn},
  'zh-CN': {...cn, kaiwuViewer: kaiwuCn, ui: uiCn},
  'es-ES': {...es, kaiwuViewer: kaiwuEs, ui: uiEs},
};

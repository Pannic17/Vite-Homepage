import {watch} from 'vue';
import i18n from '../i18n.js';
import {controlKey} from '../lang/interface.js';

// Relabel an existing panel without recreating its scene or changing control values.
// Unlisted labels (axes, algorithm names and asset names) remain technical names.
export function localizeGui(gui) {
  const folders = [gui, ...gui.foldersRecursive()].map(folder => [folder, folder.$title.textContent]);
  const controllers = gui.controllersRecursive().map(controller => [controller, controller.$name.textContent]);
  const options = [...gui.domElement.querySelectorAll('select option')].map(option => [option, option.textContent]);
  const translate = label => {
    const key = 'ui.controls.' + controlKey(label);
    return i18n.global.te(key) ? i18n.global.t(key) : label;
  };
  // lil-gui draws the selected option in a separate display element.
  const selects = controllers.map(([controller]) => controller).filter(controller => controller.$select);
  for (const controller of selects) {
    const updateDisplay = controller.updateDisplay.bind(controller);
    controller.updateDisplay = () => {
      updateDisplay();
      const option = controller.$select.selectedOptions[0];
      if (option) controller.$display.textContent = option.textContent;
      return controller;
    };
  }
  const stop = watch(i18n.global.locale, () => {
    for (const [folder, label] of folders) folder.title(translate(label));
    for (const [controller, label] of controllers) controller.name(translate(label));
    for (const [option, label] of options) option.textContent = translate(label);
    for (const controller of selects) controller.updateDisplay();
  }, {immediate: true});
  const destroy = gui.destroy.bind(gui);
  gui.destroy = () => { stop(); destroy(); };
}

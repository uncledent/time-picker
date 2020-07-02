/* eslint-disable no-console */

export function clickInput(picker) {
  picker.find('.rc-time-picker-input').simulate('focus');
}

export function blurInput(picker) {
  picker.find('.rc-time-picker-input').simulate('blur');
}

export function escapeSelected(picker) {
  picker
    .find('.rc-time-picker-panel-select-option-selected')
    .first()
    .simulate('keydown', { keyCode: 27 });
}

export function clickSelectItem(picker, select, index) {
  const selector = picker.find('.rc-time-picker-panel-select').at(select);
  selector
    .find('li')
    .at(index)
    .simulate('click');
}

export function matchValue(picker, str) {
  // Input
  expect(picker.find('.rc-time-picker-input').instance().value).toBe(str);
}

export function matchAll(picker, str, str2) {
  if (typeof picker !== 'object') {
    console.log('`picker` of `matchAll` is not an object!');
    expect(true).toBe(false);
    return;
  }

  matchValue(picker, str2 || str);
}

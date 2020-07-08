/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import Trigger from 'rc-trigger';
import moment from 'moment';
import classNames from 'classnames';
import Panel from './Panel';
import placements from './placements';

function noop() {}

function generateOptions(
  length,
  disabledOptions,
  hideDisabledOptions,
  step = 1,
) {
  const arr = [];
  for (let value = 0; value < length; value += step) {
    if (
      !disabledOptions ||
      disabledOptions.indexOf(value) < 0 ||
      !hideDisabledOptions
    ) {
      arr.push(value);
    }
  }
  return arr;
}

function refFn(field, component) {
  this[field] = component;
}

function getFormat(props) {
  const { format, showHour, showMinute, showSecond, use12Hours } = props;
  if (format) {
    return format;
  }

  if (use12Hours) {
    const fmtString = [
      showHour ? 'h' : '',
      showMinute ? 'mm' : '',
      showSecond ? 'ss' : '',
    ]
      .filter(item => !!item)
      .join(':');

    return fmtString.concat(' a');
  }

  return [showHour ? 'HH' : '', showMinute ? 'mm' : '', showSecond ? 'ss' : '']
    .filter(item => !!item)
    .join(':');
}

class Picker extends Component {
  static defaultProps = {
    clearText: 'clear',
    prefixCls: 'rc-time-picker',
    defaultOpen: false,
    inputReadOnly: false,
    style: {},
    className: '',
    inputClassName: '',
    popupClassName: '',
    popupStyle: {},
    align: {},
    defaultOpenValue: moment(),
    allowEmpty: true,
    showHour: true,
    showMinute: true,
    showSecond: true,
    disabledHours: noop,
    disabledMinutes: noop,
    disabledSeconds: noop,
    hideDisabledOptions: false,
    placement: 'bottomLeft',
    onChange: noop,
    onAmPmChange: noop,
    onOpen: noop,
    onClose: noop,
    onFocus: noop,
    onBlur: noop,
    addon: noop,
    use12Hours: false,
    focusOnOpen: true,
    onKeyDown: noop,
    autoComplete: 'off',
  };

  constructor(props) {
    super(props);
    this.saveInputRef = refFn.bind(this, 'picker');
    this.savePanelRef = refFn.bind(this, 'panelInstance');
    const {
      defaultOpen,
      defaultValue,
      open = defaultOpen,
      value = defaultValue,
      disabledMinutes,
      disabledSeconds,
      hideDisabledOptions,
      hourStep,
      minuteStep,
      secondStep,
    } = props;

    const disabledHourOptions = this.disabledHours();
    const disabledMinuteOptions = disabledMinutes(value ? value.hour() : null);
    const disabledSecondOptions = disabledSeconds(
      value ? value.hour() : null,
      value ? value.minute() : null,
    );
    const hourOptions = generateOptions(
      24,
      disabledHourOptions,
      hideDisabledOptions,
      hourStep,
    );
    const minuteOptions = generateOptions(
      60,
      disabledMinuteOptions,
      hideDisabledOptions,
      minuteStep,
    );
    const secondOptions = generateOptions(
      60,
      disabledSecondOptions,
      hideDisabledOptions,
      secondStep,
    );

    const str = (value && value.format(getFormat(props))) || '';

    this.state = {
      open,
      value,
      str,
      lastValidStr: str,
      hourOptions,
      minuteOptions,
      secondOptions,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    if ('value' in props) {
      const { value } = props;
      const { value: oldVal } = state;
      if (value !== oldVal) {
        newState.value = value;
        newState.str = (value && value.format(getFormat(props))) || '';
      }
    }
    if (props.open !== undefined) {
      newState.open = props.open;
    }
    return Object.keys(newState).length > 0
      ? {
          ...state,
          ...newState,
        }
      : null;
  }

  onPanelChange = value => {
    const str = (value && value.format(getFormat(this.props))) || '';
    this.setValue(value);
    this.setState({ str, lastValidStr: str });
  };

  onAmPmChange = ampm => {
    const { onAmPmChange } = this.props;
    onAmPmChange(ampm);
  };

  onClear = event => {
    event.stopPropagation();
    this.setValue(null);
    this.setState({
      open: false,
      str: '',
      lastValidStr: '',
      value: null,
    });
  };

  onVisibleChange = open => {
    this.setOpen(open);
  };

  onEsc = () => {
    this.setOpen(false);
    this.focus();
  };

  onKeyDown = e => {
    if (e.keyCode === 40) {
      this.setOpen(true);
    }
    if (e.keyCode === 27) {
      this.onEsc();
    }
    // on tab
    if (e.keyCode === 9) {
      this.setOpen(false);
    }
    // on enter
    if (e.keyCode === 13) {
      e.preventDefault();
      this.setOpen(!this.state.open);
    }
  };

  setValue(value) {
    const { onChange } = this.props;

    this.setState({
      value,
    });

    onChange(value);
  }

  getPanelElement() {
    const {
      prefixCls,
      placeholder,
      disabledMinutes,
      disabledSeconds,
      hideDisabledOptions,
      inputReadOnly,
      showHour,
      showMinute,
      showSecond,
      defaultOpenValue,
      clearText,
      addon,
      use12Hours,
      focusOnOpen,
      onKeyDown,
      hourStep,
      minuteStep,
      secondStep,
      clearIcon,
    } = this.props;
    const { value, hourOptions, minuteOptions, secondOptions } = this.state;

    return (
      <Panel
        clearText={clearText}
        prefixCls={`${prefixCls}-panel`}
        ref={this.savePanelRef}
        value={value}
        inputReadOnly={inputReadOnly}
        onChange={this.onPanelChange}
        onAmPmChange={this.onAmPmChange}
        defaultOpenValue={defaultOpenValue}
        showHour={showHour}
        showMinute={showMinute}
        showSecond={showSecond}
        onEsc={this.onEsc}
        format={getFormat(this.props)}
        placeholder={placeholder}
        disabledMinutes={disabledMinutes}
        disabledSeconds={disabledSeconds}
        hideDisabledOptions={hideDisabledOptions}
        use12Hours={use12Hours}
        hourStep={hourStep}
        minuteStep={minuteStep}
        secondStep={secondStep}
        addon={addon}
        focusOnOpen={focusOnOpen}
        onKeyDown={onKeyDown}
        clearIcon={clearIcon}
        disabledHours={this.disabledHours}
        hourOptions={hourOptions}
        minuteOptions={minuteOptions}
        secondOptions={secondOptions}
        onSelection={this.onSelection}
      />
    );
  }

  getPopupClassName() {
    const {
      showHour,
      showMinute,
      showSecond,
      use12Hours,
      prefixCls,
      popupClassName,
    } = this.props;
    let selectColumnCount = 0;
    if (showHour) {
      selectColumnCount += 1;
    }
    if (showMinute) {
      selectColumnCount += 1;
    }
    if (showSecond) {
      selectColumnCount += 1;
    }
    if (use12Hours) {
      selectColumnCount += 1;
    }
    // Keep it for old compatibility
    return classNames(
      popupClassName,
      {
        [`${prefixCls}-panel-narrow`]:
          (!showHour || !showMinute || !showSecond) && !use12Hours,
      },
      `${prefixCls}-panel-column-${selectColumnCount}`,
    );
  }

  setOpen(open) {
    const { onOpen, onClose } = this.props;
    const { open: currentOpen } = this.state;
    if (currentOpen !== open) {
      if (!('open' in this.props)) {
        this.setState({ open });
      }
      if (open) {
        onOpen({ open });
      } else {
        onClose({ open });
      }
    }
  }

  isAM = () => {
    const { defaultOpenValue } = this.props;
    const { value } = this.state || {};
    const realValue = value || defaultOpenValue;
    return realValue.hour() >= 0 && realValue.hour() < 12;
  };

  disabledHours = () => {
    const { use12Hours, disabledHours } = this.props;
    let disabledOptions = disabledHours();
    if (use12Hours && Array.isArray(disabledOptions)) {
      if (this.isAM()) {
        disabledOptions = disabledOptions
          .filter(h => h < 12)
          .map(h => (h === 0 ? 12 : h));
      } else {
        disabledOptions = disabledOptions.map(h => (h === 12 ? 12 : h - 12));
      }
    }
    return disabledOptions;
  };

  focus = () => {
    this.picker.focus();
  };

  getProtoValue() {
    const { value, defaultOpenValue } = this.props;
    return value || defaultOpenValue;
  }

  onInputChange = event => {
    const str = event.target.value;
    this.setState({
      str,
    });
    const { disabledMinutes, disabledSeconds, onChange } = this.props;

    const { hourOptions, minuteOptions, secondOptions } = this.state;

    if (str) {
      const format = getFormat(this.props);

      const { value: originalValue } = this.state;
      const value = this.getProtoValue().clone();

      const parsed = moment(str, format, true);

      if (!parsed.isValid()) {
        this.setState({
          invalid: true,
        });
        return;
      }
      value
        .hour(parsed.hour())
        .minute(parsed.minute())
        .second(parsed.second());

      // if time value not allowed, response warning.
      if (
        hourOptions.indexOf(value.hour()) < 0 ||
        minuteOptions.indexOf(value.minute()) < 0 ||
        secondOptions.indexOf(value.second()) < 0
      ) {
        this.setState({
          invalid: true,
        });
        return;
      }

      // if time value is disabled, response warning.
      const disabledHourOptions = this.disabledHours();
      const disabledMinuteOptions = disabledMinutes(value.hour());
      const disabledSecondOptions = disabledSeconds(
        value.hour(),
        value.minute(),
      );
      if (
        (disabledHourOptions &&
          disabledHourOptions.indexOf(value.hour()) >= 0) ||
        (disabledMinuteOptions &&
          disabledMinuteOptions.indexOf(value.minute()) >= 0) ||
        (disabledSecondOptions &&
          disabledSecondOptions.indexOf(value.second()) >= 0)
      ) {
        this.setState({
          invalid: true,
        });
        return;
      }

      if (originalValue) {
        if (
          originalValue.hour() !== value.hour() ||
          originalValue.minute() !== value.minute() ||
          originalValue.second() !== value.second()
        ) {
          // keep other fields for rc-calendar
          const changedValue = originalValue.clone() || moment();
          changedValue.hour(value.hour());
          changedValue.minute(value.minute());
          changedValue.second(value.second());
          this.setValue(changedValue);
          this.setState({ lastValidStr: str });
          onChange(changedValue);
        }
      } else if (originalValue !== value) {
        this.setValue(value);
        this.setState({ lastValidStr: str });
        onChange(value);
      }
    } else {
      this.setState({ lastValidStr: str });
      this.setValue(null);
      onChange(null);
    }

    this.setState({
      invalid: false,
    });
  };

  blur() {
    this.picker.blur();
  }

  click() {
    this.picker.click();
  }

  renderClearButton() {
    const {
      prefixCls,
      allowEmpty,
      clearIcon,
      clearText,
      disabled,
    } = this.props;
    if (!allowEmpty || !this.state.str || disabled) {
      return null;
    }

    if (React.isValidElement(clearIcon)) {
      const { onClick } = clearIcon.props || {};
      return React.cloneElement(clearIcon, {
        tabIndex: -1,
        onClick: (...args) => {
          if (onClick) onClick(...args);
          this.onClear(...args);
        },
      });
    }

    return (
      <a
        role="button"
        className={`${prefixCls}-clear`}
        title={clearText}
        onClick={this.onClear}
        tabIndex={-1}
      >
        {clearIcon || <i className={`${prefixCls}-clear-icon`} />}
      </a>
    );
  }

  renderInputButton = () => {
    const { prefixCls, inputIcon, disabled } = this.props;
    if (!!this.state.str || disabled) {
      return null;
    }

    if (React.isValidElement(inputIcon)) {
      const { onClick } = inputIcon.props || {};
      return React.cloneElement(inputIcon, {
        tabIndex: -1,
        onClick: (...args) => {
          if (onClick) onClick(...args);
          this.onClear(...args);
        },
      });
    }

    return (
      <a
        role="button"
        className={`${prefixCls}-input-button`}
        onClick={this.focus}
        tabIndex={-1}
      >
        {inputIcon || <i className={`${prefixCls}-input-icon`} />}
      </a>
    );
  };

  onFocus = () => {
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus();
    }
  };

  onBlur = () => {
    const { onBlur } = this.props;
    const { invalid, lastValidStr } = this.state;
    // reset value if invalid
    if (invalid) {
      this.setState({ str: lastValidStr, invalid: false });
    }
    if (onBlur) {
      onBlur();
    }
  };

  onSelection = () => {
    // console.log('onSelection');
    this.focus();
  };

  render() {
    const {
      prefixCls,
      placeholder,
      placement,
      align,
      id,
      disabled,
      transitionName,
      style,
      className,
      inputClassName,
      getPopupContainer,
      name,
      autoComplete,
      autoFocus,
      inputReadOnly,
      popupStyle,
    } = this.props;
    const { open, str } = this.state;
    const popupClassName = this.getPopupClassName();
    const { invalid } = this.state;
    const invalidClass = invalid ? `${prefixCls}-input-invalid` : '';
    return (
      <Trigger
        prefixCls={`${prefixCls}-panel`}
        popupClassName={popupClassName}
        popupStyle={popupStyle}
        popup={this.getPanelElement()}
        popupAlign={align}
        builtinPlacements={placements}
        popupPlacement={placement}
        action={disabled ? [] : ['focus']}
        destroyPopupOnHide
        getPopupContainer={getPopupContainer}
        popupTransitionName={transitionName}
        popupVisible={open}
        onPopupVisibleChange={this.onVisibleChange}
      >
        <span className={classNames(prefixCls, className)} style={style}>
          <input
            className={classNames(
              `${prefixCls}-input`,
              invalidClass,
              inputClassName,
            )}
            ref={this.saveInputRef}
            placeholder={placeholder}
            onChange={this.onInputChange}
            readOnly={!!inputReadOnly}
            type="text"
            name={name}
            onKeyDown={this.onKeyDown}
            disabled={disabled}
            value={str}
            autoComplete={autoComplete}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            autoFocus={autoFocus} // eslint-disable-line jsx-a11y/no-autofocus
            id={id}
          />
          {this.renderInputButton()}
          {this.renderClearButton()}
        </span>
      </Trigger>
    );
  }
}

export default Picker;

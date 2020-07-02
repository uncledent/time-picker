import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import Combobox from './Combobox';

function noop() {}

function toNearestValidTime(time, hourOptions, minuteOptions, secondOptions) {
  const hour = hourOptions
    .slice()
    .sort((a, b) => Math.abs(time.hour() - a) - Math.abs(time.hour() - b))[0];
  const minute = minuteOptions
    .slice()
    .sort(
      (a, b) => Math.abs(time.minute() - a) - Math.abs(time.minute() - b),
    )[0];
  const second = secondOptions
    .slice()
    .sort(
      (a, b) => Math.abs(time.second() - a) - Math.abs(time.second() - b),
    )[0];
  return moment(`${hour}:${minute}:${second}`, 'HH:mm:ss');
}

class Panel extends Component {
  static defaultProps = {
    prefixCls: 'rc-time-picker-panel',
    onChange: noop,
    disabledHours: noop,
    disabledMinutes: noop,
    disabledSeconds: noop,
    defaultOpenValue: moment(),
    use12Hours: false,
    addon: noop,
    onKeyDown: noop,
    onAmPmChange: noop,
    inputReadOnly: false,
  };

  state = {};

  static getDerivedStateFromProps(props, state) {
    if ('value' in props) {
      return {
        ...state,
        value: props.value,
      };
    }
    return null;
  }

  onChange = newValue => {
    const { onChange } = this.props;
    this.setState({ value: newValue });
    onChange(newValue);
  };

  onAmPmChange = ampm => {
    const { onAmPmChange } = this.props;
    onAmPmChange(ampm);
  };

  onCurrentSelectPanelChange = currentSelectPanel => {
    this.setState({ currentSelectPanel });
  };

  // https://github.com/ant-design/ant-design/issues/5829
  close() {
    const { onEsc } = this.props;
    onEsc();
  }

  isAM() {
    const { defaultOpenValue } = this.props;
    const { value } = this.state;
    const realValue = value || defaultOpenValue;
    return realValue.hour() >= 0 && realValue.hour() < 12;
  }

  render() {
    const {
      prefixCls,
      className,
      disabledMinutes,
      disabledSeconds,
      showHour,
      showMinute,
      showSecond,
      format,
      defaultOpenValue,
      onEsc,
      addon,
      use12Hours,
      disabledHours,
      hourOptions,
      minuteOptions,
      secondOptions,
      onSelection,
    } = this.props;
    const { value } = this.state;

    const validDefaultOpenValue = toNearestValidTime(
      defaultOpenValue,
      hourOptions,
      minuteOptions,
      secondOptions,
    );

    return (
      <div className={classNames(className, `${prefixCls}-inner`)}>
        <Combobox
          prefixCls={prefixCls}
          value={value}
          defaultOpenValue={validDefaultOpenValue}
          format={format}
          onChange={this.onChange}
          onAmPmChange={this.onAmPmChange}
          showHour={showHour}
          showMinute={showMinute}
          showSecond={showSecond}
          hourOptions={hourOptions}
          minuteOptions={minuteOptions}
          secondOptions={secondOptions}
          disabledHours={disabledHours}
          disabledMinutes={disabledMinutes}
          disabledSeconds={disabledSeconds}
          onCurrentSelectPanelChange={this.onCurrentSelectPanelChange}
          use12Hours={use12Hours}
          onEsc={onEsc}
          isAM={this.isAM()}
          onSelection={onSelection}
        />
        {addon(this)}
      </div>
    );
  }
}

export default Panel;

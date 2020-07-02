import '../assets/index.less';
import React, { useState } from 'react';
import moment from 'moment';
import TimePicker from '..';

const App = () => {
  const [val, setVal] = useState(moment());
  return (
    <>
      <TimePicker showSecond value={val} onChange={setVal} />

      {!!val && val.format('HH:mm:ss')}

      <br />

      <TimePicker defaultValue={moment()} showHour={false} />
      <TimePicker defaultValue={moment()} showMinute={false} />
      <TimePicker defaultValue={moment()} showSecond={false} />

      <TimePicker
        defaultValue={moment()}
        showMinute={false}
        showSecond={false}
      />
      <TimePicker defaultValue={moment()} showHour={false} showSecond={false} />
      <TimePicker defaultValue={moment()} showHour={false} showMinute={false} />
    </>
  );
};

export default App;

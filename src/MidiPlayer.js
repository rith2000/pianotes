import React from 'react';
import { Midi } from 'react-abc';

import notation from './notation';

export default () => (
  <div>
    <Midi notation={notation} />
  </div>
);
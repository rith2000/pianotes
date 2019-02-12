import React from 'react';
import { Notation } from 'react-abc';

//const notation = 'd3 _B =B_A =A2 _A2 _B=B G2 c ';
import notation from './notation';
export default () => (
  <div>
    <Notation notation={notation} />
  </div>
);
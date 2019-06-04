global.startFlag = true;
global.startRest = false;
global.composer = `C: 
`;
global.measure = `M: 4/4
`;
global.measureUpdated = `M: 4/4
`;
global.length = `L: 1/16
`;
global.metronome = `Q:1/4=100
`;
global.clef = `V: V1 clef=treble
`;

global.beat_count = 0;


global.noteStart = "%%staves {(V1 V2 V3 V4 V5)}\nV: V1 clef=treble\nV: V2 clef=treble\nV: V3 clef=treble\nV: V4 clef=treble\nV: V5 clef=treble\n";
global.notes = ``;
global.noteEnd = ` |]
`;

global.measure_num = 0;


global.notation = 
	global.composer +
	global.measure +
	global.length +
	global.metronome +
	global.clef +
	global.noteStart +
	global.notes +
	global.noteEnd;






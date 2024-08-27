export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Time = IDL.Int;
  return IDL.Service({
    'convertTextToSpeech' : IDL.Func([IDL.Text], [Result], []),
    'getEventLog' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(Time, IDL.Text))],
        ['query'],
      ),
    'getPlaybackStatus' : IDL.Func([], [IDL.Text], ['query']),
    'handleEvent' : IDL.Func([IDL.Text], [Result], []),
    'playAudio' : IDL.Func([], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };

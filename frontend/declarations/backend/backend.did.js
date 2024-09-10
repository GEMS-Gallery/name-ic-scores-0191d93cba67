export const idlFactory = ({ IDL }) => {
  const Sport = IDL.Text;
  const GameScore = IDL.Record({
    'homeTeam' : IDL.Text,
    'homeScore' : IDL.Nat,
    'awayTeam' : IDL.Text,
    'awayScore' : IDL.Nat,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Vec(GameScore), 'err' : IDL.Text });
  return IDL.Service({
    'getLastUpdateTime' : IDL.Func([], [IDL.Int], ['query']),
    'getScores' : IDL.Func([Sport], [Result], ['query']),
    'refreshScores' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };

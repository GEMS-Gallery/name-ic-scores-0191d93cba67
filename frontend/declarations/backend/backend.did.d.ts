import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface GameScore {
  'homeTeam' : string,
  'homeScore' : bigint,
  'awayTeam' : string,
  'awayScore' : bigint,
}
export type Result = { 'ok' : Array<GameScore> } |
  { 'err' : string };
export type Sport = string;
export interface _SERVICE {
  'getLastUpdateTime' : ActorMethod<[], bigint>,
  'getScores' : ActorMethod<[Sport], Result>,
  'refreshScores' : ActorMethod<[], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : null } |
  { 'err' : string };
export type Time = bigint;
export interface _SERVICE {
  'convertTextToSpeech' : ActorMethod<[string], Result>,
  'getEventLog' : ActorMethod<[], Array<[Time, string]>>,
  'getPlaybackStatus' : ActorMethod<[], string>,
  'handleEvent' : ActorMethod<[string], Result>,
  'playAudio' : ActorMethod<[], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

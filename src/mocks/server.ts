import { setupServer } from "msw/node";
import { gatheringHandlers } from './handlers/popularGatherings';

export const server = setupServer(...gatheringHandlers)

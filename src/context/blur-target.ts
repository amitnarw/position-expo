import { createContext, type RefObject } from 'react';

export const BlurTargetContext = createContext<RefObject<any> | null>(null);

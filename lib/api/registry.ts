import { z } from 'zod';
import * as schemas from './schemas';

export interface ApiRoute {
  path: string;
  methods: string[];
  inputSchema?: z.ZodType<any>;
  outputSchema?: z.ZodType<any>;
}

// Aristotle API routes registry
export const API_ROUTES: ApiRoute[] = [
  {
    path: '/api/coach',
    methods: ['POST'],
    inputSchema: schemas.In_Coach_POST,
    outputSchema: schemas.Out_Coach_POST
  },
  {
    path: '/api/tts',
    methods: ['POST'],
    inputSchema: schemas.In_TTS_POST,
    outputSchema: schemas.Out_TTS_POST
  },
  {
    path: '/api/transcribe',
    methods: ['POST'],
    inputSchema: schemas.In_Transcribe_POST,
    outputSchema: schemas.Out_Transcribe_POST
  },
  {
    path: '/api/skills/invoke',
    methods: ['POST'],
    inputSchema: schemas.In_Skills_Invoke_POST,
    outputSchema: schemas.Out_Skills_Invoke_POST
  },
  {
    path: '/api/__health',
    methods: ['GET'],
    outputSchema: schemas.Out_Health_GET
  },
  {
    path: '/api/fasting',
    methods: ['GET', 'POST'],
    inputSchema: schemas.In_Fasting_POST,
    outputSchema: schemas.Out_Fasting_GET
  },
  {
    path: '/api/habits',
    methods: ['GET', 'POST'],
    inputSchema: schemas.In_Habits_POST,
    outputSchema: schemas.Out_Habits_GET
  },
  {
    path: '/api/tasks',
    methods: ['GET', 'POST'],
    inputSchema: schemas.In_Tasks_POST,
    outputSchema: schemas.Out_Tasks_GET
  },
  {
    path: '/api/goals',
    methods: ['GET', 'POST'],
    inputSchema: schemas.In_Goals_POST,
    outputSchema: schemas.Out_Goals_GET
  },
  {
    path: '/api/user-facts',
    methods: ['POST'],
    inputSchema: schemas.In_UserFacts_POST,
    outputSchema: schemas.Out_UserFacts_POST
  }
];

export function getRoute(path: string, method: string): ApiRoute | undefined {
  return API_ROUTES.find(route => 
    route.path === path && route.methods.includes(method)
  );
}

export function getAllRoutes(): ApiRoute[] {
  return API_ROUTES;
}

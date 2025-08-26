import { breathworkStartSkill } from './breathwork.start';
import { taskCreateSkill } from './task.create';
import { habitCheckinSkill } from './habit.checkin';
import { goalUpdateSkill } from './goal.update';
import { journalAppendSkill } from './journal.append';
import { calendarSyncStubSkill } from './sync.calendar.stub';
import type { SkillDefinition } from '../lib/types';

// Registry of all available skills
export const skillsRegistry: Record<string, SkillDefinition> = {
  [breathworkStartSkill.key]: breathworkStartSkill,
  [taskCreateSkill.key]: taskCreateSkill,
  [habitCheckinSkill.key]: habitCheckinSkill,
  [goalUpdateSkill.key]: goalUpdateSkill,
  [journalAppendSkill.key]: journalAppendSkill,
  [calendarSyncStubSkill.key]: calendarSyncStubSkill,
};

/**
 * Get a skill by key
 */
export function getSkill(key: string): SkillDefinition | undefined {
  return skillsRegistry[key];
}

/**
 * Get all available skill keys
 */
export function getAvailableSkillKeys(): string[] {
  return Object.keys(skillsRegistry);
}

/**
 * Get skill descriptions for the LLM
 */
export function getSkillDescriptions(): string {
  return Object.values(skillsRegistry)
    .map(skill => `${skill.key}: ${skill.description}`)
    .join('\n');
} 
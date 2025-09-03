export type VirtueXP = Partial<{ wisdom: number; justice: number; courage: number; temperance: number }>;

export type FrameworkConfig = {
  slug: string;
  name: string;
  tone: string;
  virtuePrimary: 'WISDOM' | 'JUSTICE' | 'COURAGE' | 'TEMPERANCE';
  virtueSecondary?: 'WISDOM' | 'JUSTICE' | 'COURAGE' | 'TEMPERANCE';
  teachingChip: string;
  widgets: Array<{
    id: string;
    kind: 'TIMER' | 'COUNTER' | 'DRAG_BOARD' | 'CHECKLIST' | 'JOURNAL' | 'AUDIO_NOTE' | 'PHOTO' | 'BREATH' | 'BALANCE_GYRO' | 'WHEEL' | 'SLIDERS';
    title: string;
    config: Record<string, any>;
    virtueGrantPerCompletion: VirtueXP;
  }>;
  quests: Array<{
    id: string;
    title: string;
    description: string;
    widgetIds: string[];
    minutes: number;
    virtueGrants: VirtueXP;
  }>;
  capstone: { title: string; requirements: string[] };
};

export const FRAMEWORKS: FrameworkConfig[] = [
  {
    slug: 'spartan',
    name: 'Spartan Agōgē',
    tone: 'gritty',
    virtuePrimary: 'COURAGE',
    virtueSecondary: 'TEMPERANCE',
    teachingChip: 'Strength is forged through chosen hardship.',
    widgets: [
      {
        id: 'cold_heat_timer',
        kind: 'TIMER',
        title: 'Cold/Heat Timer',
        config: {
          targetSec: 300, // 5 minutes
          allowRPE: true,
          teaching: 'Embrace discomfort to build mental fortitude'
        },
        virtueGrantPerCompletion: { courage: 2, temperance: 1 }
      },
      {
        id: 'trial_counter',
        kind: 'COUNTER',
        title: 'Trial Counter',
        config: {
          targetReps: 50,
          step: 1,
          exercises: ['squats', 'pushups', 'carries'],
          teaching: 'Physical strength builds mental resilience'
        },
        virtueGrantPerCompletion: { courage: 2 }
      },
      {
        id: 'boundary_setter',
        kind: 'CHECKLIST',
        title: 'Boundary Setter',
        config: {
          items: [
            { id: 'no_today', label: 'One "no" I will say today', required: true },
            { id: 'boundary_note', label: 'Write down your boundary', required: true }
          ],
          teaching: 'Discipline is the foundation of freedom'
        },
        virtueGrantPerCompletion: { temperance: 1 }
      },
      {
        id: 'adversity_log',
        kind: 'JOURNAL',
        title: 'Adversity Log',
        config: {
          prompt: 'What was hardest today and how did you respond?',
          minWords: 50,
          aiCoaching: true,
          teaching: 'Reflect on challenges to grow stronger'
        },
        virtueGrantPerCompletion: { courage: 1, wisdom: 1 }
      },
      {
        id: 'spartan_breath',
        kind: 'BREATH',
        title: 'Spartan Breath',
        config: {
          pattern: 'wim_hof',
          params: { rounds: 3, fastIn: 30, retention: true },
          teaching: 'Master your breath to master your mind'
        },
        virtueGrantPerCompletion: { courage: 1, temperance: 1 }
      },
      {
        id: 'spartan_balance',
        kind: 'BALANCE_GYRO',
        title: 'Spartan Balance',
        config: {
          targetSec: 90,
          sensitivity: 'medium',
          teaching: 'Hold steady like a Spartan warrior'
        },
        virtueGrantPerCompletion: { temperance: 2, courage: 1 }
      }
    ],
    quests: [
      {
        id: 'spartan_trial_1',
        title: '60s cold, 45 squats ladder, boundary note',
        description: 'Complete cold exposure, strength training, and boundary setting',
        widgetIds: ['cold_heat_timer', 'trial_counter', 'boundary_setter'],
        minutes: 12,
        virtueGrants: { courage: 4, temperance: 2 }
      },
      {
        id: 'spartan_trial_2',
        title: '2 rounds Wim Hof + adversity log 80+ words',
        description: 'Complete breathing practice and adversity reflection',
        widgetIds: ['spartan_breath', 'adversity_log'],
        minutes: 8,
        virtueGrants: { courage: 2, wisdom: 1, temperance: 1 }
      },
      {
        id: 'spartan_trial_3',
        title: 'Carry something heavy 5 min, log RPE',
        description: 'Complete strength training with RPE tracking',
        widgetIds: ['trial_counter', 'cold_heat_timer'],
        minutes: 6,
        virtueGrants: { courage: 3, temperance: 1 }
      },
      {
        id: 'spartan_trial_4',
        title: '90s balance challenge + reflection',
        description: 'Hold steady balance and reflect on discipline',
        widgetIds: ['spartan_balance', 'adversity_log'],
        minutes: 5,
        virtueGrants: { temperance: 2, courage: 1, wisdom: 1 }
      }
    ],
    capstone: {
      title: 'Ruck 5K',
      requirements: [
        'Complete 5K ruck march with weighted pack',
        'Take photo proof of completion',
        'Write 150-word reflection on the experience',
        'Submit capstone evidence'
      ]
    }
  },
  {
    slug: 'bushido',
    name: 'Samurai Bushidō',
    tone: 'honor',
    virtuePrimary: 'JUSTICE',
    virtueSecondary: 'COURAGE',
    teachingChip: 'Honor is clarity in action.',
    widgets: [
      {
        id: 'virtue_wheel',
        kind: 'WHEEL',
        title: 'Virtue Wheel',
        config: {
          options: ['Rectitude', 'Courage', 'Benevolence', 'Respect', 'Honesty', 'Honor', 'Loyalty'],
          teaching: 'Choose your guiding virtue for today'
        },
        virtueGrantPerCompletion: { justice: 1 }
      },
      {
        id: 'oath_journal',
        kind: 'JOURNAL',
        title: 'Oath Journal',
        config: {
          prompt: 'Declare your duty of the day',
          minWords: 50,
          aiCoaching: true,
          teaching: 'Honor is the samurai\'s highest virtue'
        },
        virtueGrantPerCompletion: { justice: 2 }
      },
      {
        id: 'etiquette_drill',
        kind: 'AUDIO_NOTE',
        title: 'Etiquette Drill',
        config: {
          maxSec: 30,
          transcribe: false,
          instruction: 'Record name stated with calm breath',
          teaching: 'Control your breath to control your power'
        },
        virtueGrantPerCompletion: { justice: 1, temperance: 1 }
      },
      {
        id: 'conflict_simulator',
        kind: 'JOURNAL',
        title: 'Conflict Simulator',
        config: {
          prompt: 'Input a dilemma; AI will produce just response outline',
          minWords: 60,
          aiCoaching: true,
          teaching: 'Seek understanding before being understood'
        },
        virtueGrantPerCompletion: { justice: 2, wisdom: 1 }
      },
      {
        id: 'samurai_breath',
        kind: 'BREATH',
        title: 'Samurai Breath',
        config: {
          pattern: 'box',
          params: { in: 4, hold: 4, out: 4, hold2: 4, cycles: 12 },
          teaching: 'Control your breath to control your mind'
        },
        virtueGrantPerCompletion: { temperance: 1, courage: 1 }
      }
    ],
    quests: [
      {
        id: 'bushido_quest_1',
        title: 'Spin virtue, write oath, box breath 6 min',
        description: 'Choose virtue, declare oath, practice breathing',
        widgetIds: ['virtue_wheel', 'oath_journal', 'samurai_breath'],
        minutes: 10,
        virtueGrants: { justice: 3, temperance: 1, courage: 1 }
      },
      {
        id: 'bushido_quest_2',
        title: 'Etiquette recording + conflict plan',
        description: 'Practice etiquette and plan conflict resolution',
        widgetIds: ['etiquette_drill', 'conflict_simulator'],
        minutes: 8,
        virtueGrants: { justice: 3, wisdom: 1, temperance: 1 }
      },
      {
        id: 'bushido_quest_3',
        title: 'Rectitude day: oath + reflection 120+ words',
        description: 'Focus on rectitude with oath and deep reflection',
        widgetIds: ['oath_journal', 'conflict_simulator'],
        minutes: 12,
        virtueGrants: { justice: 4, wisdom: 1 }
      }
    ],
    capstone: {
      title: 'Code of Honor',
      requirements: [
        'Write 300 words or record 2-min audio on your code of honor',
        'Reference all 7 virtues in your code',
        'Submit written or audio evidence',
        'Complete capstone checklist'
      ]
    }
  },
  {
    slug: 'stoic',
    name: 'Stoicism',
    tone: 'calm',
    virtuePrimary: 'WISDOM',
    virtueSecondary: 'TEMPERANCE',
    teachingChip: 'Control what you can; accept the rest.',
    widgets: [
      {
        id: 'control_board',
        kind: 'DRAG_BOARD',
        title: 'Control Board',
        config: {
          columns: [
            { key: 'control', label: 'Control' },
            { key: 'influence', label: 'Influence' },
            { key: 'accept', label: 'Accept' }
          ],
          items: [
            { id: 'work_deadline', label: 'Work deadline' },
            { id: 'weather', label: 'Weather' },
            { id: 'traffic', label: 'Traffic' },
            { id: 'health', label: 'Health choices' },
            { id: 'others_opinions', label: 'Others\' opinions' },
            { id: 'past_events', label: 'Past events' }
          ],
          teaching: 'Focus on what you can control'
        },
        virtueGrantPerCompletion: { wisdom: 2 }
      },
      {
        id: 'memento_mori',
        kind: 'JOURNAL',
        title: 'Memento Mori',
        config: {
          prompt: 'Reflect on impermanence and how it clarifies your priorities',
          minWords: 60,
          aiCoaching: true,
          teaching: 'Remember you will die to live fully'
        },
        virtueGrantPerCompletion: { wisdom: 1, temperance: 1 }
      },
      {
        id: 'evening_examen',
        kind: 'JOURNAL',
        title: 'Evening Examen',
        config: {
          prompt: 'What went well? What could you improve? What did you learn?',
          minWords: 60,
          aiCoaching: false,
          teaching: 'Reflection is the path to wisdom'
        },
        virtueGrantPerCompletion: { wisdom: 1 }
      },
      {
        id: 'virtue_sliders',
        kind: 'SLIDERS',
        title: 'Virtue Sliders',
        config: {
          virtues: true,
          teaching: 'Assess your virtues daily'
        },
        virtueGrantPerCompletion: { wisdom: 1 }
      },
      {
        id: 'stoic_breath',
        kind: 'BREATH',
        title: 'Stoic Breath',
        config: {
          pattern: 'coherent',
          params: { in: 5.5, out: 5.5, minutes: 5 },
          teaching: 'Find your natural rhythm'
        },
        virtueGrantPerCompletion: { temperance: 1 }
      }
    ],
    quests: [
      {
        id: 'stoic_quest_1',
        title: 'Drag board + coherent breath + examen',
        description: 'Organize control, practice breathing, reflect on day',
        widgetIds: ['control_board', 'stoic_breath', 'evening_examen'],
        minutes: 10,
        virtueGrants: { wisdom: 3, temperance: 1 }
      },
      {
        id: 'stoic_quest_2',
        title: 'Negative visualization + sliders',
        description: 'Practice negative visualization and virtue assessment',
        widgetIds: ['memento_mori', 'virtue_sliders'],
        minutes: 8,
        virtueGrants: { wisdom: 2, temperance: 1 }
      },
      {
        id: 'stoic_quest_3',
        title: 'Accept vs Control review + 80-word reflection',
        description: 'Review control board and reflect on acceptance',
        widgetIds: ['control_board', 'evening_examen'],
        minutes: 12,
        virtueGrants: { wisdom: 3 }
      }
    ],
    capstone: {
      title: 'Voluntary Discomfort Day',
      requirements: [
        'Plan a day of voluntary discomfort',
        'Execute the discomfort plan',
        'Write 200-word analysis of the experience',
        'Submit capstone evidence'
      ]
    }
  },
  {
    slug: 'monastic',
    name: 'Monastic Rule',
    tone: 'order',
    virtuePrimary: 'TEMPERANCE',
    virtueSecondary: 'WISDOM',
    teachingChip: 'Rhythm roots the soul.',
    widgets: [
      {
        id: 'bell_schedule',
        kind: 'CHECKLIST',
        title: 'Bell Schedule',
        config: {
          items: [
            { id: 'matins', label: 'Matins (Dawn Prayer)', required: true },
            { id: 'prime', label: 'Prime (Morning Work)', required: true },
            { id: 'terce', label: 'Terce (Mid-Morning)', required: true },
            { id: 'sext', label: 'Sext (Noon Prayer)', required: true },
            { id: 'none', label: 'None (Afternoon)', required: true },
            { id: 'vespers', label: 'Vespers (Evening)', required: true },
            { id: 'compline', label: 'Compline (Night)', required: true }
          ],
          teaching: 'Keep the rhythm of prayer and work'
        },
        virtueGrantPerCompletion: { temperance: 2 }
      },
      {
        id: 'silence_timer',
        kind: 'TIMER',
        title: 'Silence Timer',
        config: {
          targetSec: 600, // 10 minutes
          allowRPE: false,
          teaching: 'Silence reveals the voice within'
        },
        virtueGrantPerCompletion: { wisdom: 1, temperance: 1 }
      },
      {
        id: 'rule_of_life',
        kind: 'CHECKLIST',
        title: 'Rule of Life',
        config: {
          items: [
            { id: 'humility_act', label: 'Perform one act of humility', required: true },
            { id: 'small_chore', label: 'Complete a small chore for others', required: true },
            { id: 'gratitude', label: 'Express gratitude to someone', required: true }
          ],
          teaching: 'Live by simple, consistent rules'
        },
        virtueGrantPerCompletion: { temperance: 1, justice: 1 }
      },
      {
        id: 'community_chore_log',
        kind: 'JOURNAL',
        title: 'Community Chore Log',
        config: {
          prompt: 'What did you do for others today?',
          minWords: 40,
          aiCoaching: true,
          teaching: 'Service is the highest calling'
        },
        virtueGrantPerCompletion: { justice: 1, wisdom: 1 }
      },
      {
        id: 'monastic_breath',
        kind: 'BREATH',
        title: 'Monastic Breath',
        config: {
          pattern: 'ocean',
          params: { minutes: 5, slow: true },
          teaching: 'Find peace in the rhythm of breath'
        },
        virtueGrantPerCompletion: { temperance: 1 }
      }
    ],
    quests: [
      {
        id: 'monastic_quest_1',
        title: 'Keep 3 bells + silence 10m + gratitude',
        description: 'Maintain prayer schedule, practice silence, express gratitude',
        widgetIds: ['bell_schedule', 'silence_timer', 'rule_of_life'],
        minutes: 15,
        virtueGrants: { temperance: 3, wisdom: 1, justice: 1 }
      },
      {
        id: 'monastic_quest_2',
        title: 'Chore log + ocean breath',
        description: 'Log community service and practice breathing',
        widgetIds: ['community_chore_log', 'monastic_breath'],
        minutes: 8,
        virtueGrants: { justice: 1, wisdom: 1, temperance: 1 }
      },
      {
        id: 'monastic_quest_3',
        title: 'Rule day mini: 2 bells + humility note',
        description: 'Keep partial schedule and practice humility',
        widgetIds: ['bell_schedule', 'rule_of_life'],
        minutes: 6,
        virtueGrants: { temperance: 2, justice: 1 }
      }
    ],
    capstone: {
      title: '24-Hour Rule Day',
      requirements: [
        'Keep all 7 bells for 24 hours',
        'Maintain 80% adherence to schedule',
        'Document each bell completion',
        'Submit adherence log'
      ]
    }
  },
  {
    slug: 'yogic',
    name: 'Yogic Path',
    tone: 'embodied',
    virtuePrimary: 'WISDOM',
    virtueSecondary: 'TEMPERANCE',
    teachingChip: 'Align body, breath, and mind.',
    widgets: [
      {
        id: 'asana_tracker',
        kind: 'COUNTER',
        title: 'Asana Tracker',
        config: {
          targetReps: 20,
          step: 1,
          poses: ['sun salutation', 'warrior', 'tree', 'cobra', 'child'],
          teaching: 'Find balance in body and mind'
        },
        virtueGrantPerCompletion: { temperance: 1 }
      },
      {
        id: 'meditation_timer',
        kind: 'TIMER',
        title: 'Meditation Timer',
        config: {
          targetSec: 600, // 10 minutes
          allowRPE: false,
          mantra: true,
          teaching: 'Stillness reveals the warrior within'
        },
        virtueGrantPerCompletion: { wisdom: 1, temperance: 1 }
      },
      {
        id: 'chakra_wheel',
        kind: 'WHEEL',
        title: 'Chakra Wheel',
        config: {
          options: ['Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'],
          teaching: 'Choose your chakra focus for today'
        },
        virtueGrantPerCompletion: { wisdom: 1 }
      },
      {
        id: 'mindful_movement_log',
        kind: 'PHOTO',
        title: 'Mindful Movement Log',
        config: {
          tags: ['pose', 'walk', 'nature', 'flow'],
          teaching: 'Move with awareness and grace'
        },
        virtueGrantPerCompletion: { temperance: 1 }
      },
      {
        id: 'yogic_breath',
        kind: 'BREATH',
        title: 'Yogic Breath',
        config: {
          pattern: 'alt_nostril',
          params: { cycles: 12 },
          teaching: 'Balance the left and right energies'
        },
        virtueGrantPerCompletion: { wisdom: 1, temperance: 1 }
      }
    ],
    quests: [
      {
        id: 'yogic_quest_1',
        title: 'Alt-nostril 12 cycles + 10m sit + 10 poses',
        description: 'Practice breathing, meditation, and asanas',
        widgetIds: ['yogic_breath', 'meditation_timer', 'asana_tracker'],
        minutes: 15,
        virtueGrants: { wisdom: 2, temperance: 2 }
      },
      {
        id: 'yogic_quest_2',
        title: 'Chakra pick + 60-word journal + photo proof',
        description: 'Choose chakra focus and document practice',
        widgetIds: ['chakra_wheel', 'mindful_movement_log'],
        minutes: 8,
        virtueGrants: { wisdom: 2, temperance: 1 }
      },
      {
        id: 'yogic_quest_3',
        title: 'Asana + breath mini + mantra',
        description: 'Quick asana practice with breathing and mantra',
        widgetIds: ['asana_tracker', 'yogic_breath'],
        minutes: 6,
        virtueGrants: { temperance: 2 }
      }
    ],
    capstone: {
      title: '15-min Personal Sequence',
      requirements: [
        'Create a 15-minute personal yoga sequence',
        'Record video or take photos of sequence',
        'Write reflection on sequence creation',
        'Submit sequence documentation'
      ]
    }
  },
  {
    slug: 'indigenous',
    name: 'Indigenous Wisdom',
    tone: 'stewardship',
    virtuePrimary: 'JUSTICE',
    virtueSecondary: 'WISDOM',
    teachingChip: 'Take only what you need; return what you can.',
    widgets: [
      {
        id: 'nature_photo_log',
        kind: 'PHOTO',
        title: 'Nature Photo Log',
        config: {
          tags: ['dawn', 'dusk', 'tree', 'water', 'earth', 'sky'],
          teaching: 'Connect with the natural world'
        },
        virtueGrantPerCompletion: { wisdom: 1 }
      },
      {
        id: 'seasonal_moon_wheel',
        kind: 'WHEEL',
        title: 'Seasonal/Moon Wheel',
        config: {
          options: ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'],
          teaching: 'Live in harmony with natural cycles'
        },
        virtueGrantPerCompletion: { wisdom: 1 }
      },
      {
        id: 'reciprocity_ledger',
        kind: 'SLIDERS',
        title: 'Reciprocity Ledger',
        config: {
          sliders: [
            { id: 'took', label: 'What I took (0-10)', max: 10 },
            { id: 'gave', label: 'What I gave (0-10)', max: 10 }
          ],
          teaching: 'Balance taking and giving'
        },
        virtueGrantPerCompletion: { justice: 2 } // +2 if gave >= took, else +1
      },
      {
        id: 'story_circle',
        kind: 'AUDIO_NOTE',
        title: 'Story Circle',
        config: {
          maxSec: 60,
          transcribe: true,
          instruction: 'Share a story from your day or tradition',
          teaching: 'Stories carry wisdom across generations'
        },
        virtueGrantPerCompletion: { wisdom: 1, justice: 1 }
      },
      {
        id: 'cycle_breath',
        kind: 'BREATH',
        title: 'Cycle Breath',
        config: {
          pattern: '4-7-8',
          params: { cycles: 8 },
          teaching: 'Breathe like the earth breathes'
        },
        virtueGrantPerCompletion: { temperance: 1 }
      }
    ],
    quests: [
      {
        id: 'indigenous_quest_1',
        title: 'Photo nature + intention + 4-7-8',
        description: 'Capture nature, set intention, practice breathing',
        widgetIds: ['nature_photo_log', 'seasonal_moon_wheel', 'cycle_breath'],
        minutes: 8,
        virtueGrants: { wisdom: 2, temperance: 1 }
      },
      {
        id: 'indigenous_quest_2',
        title: 'Story circle 60s + reciprocity sliders',
        description: 'Share story and assess reciprocity balance',
        widgetIds: ['story_circle', 'reciprocity_ledger'],
        minutes: 10,
        virtueGrants: { wisdom: 1, justice: 2 }
      },
      {
        id: 'indigenous_quest_3',
        title: 'Moon phase journal 60+ words',
        description: 'Reflect on moon phase and seasonal wisdom',
        widgetIds: ['seasonal_moon_wheel'],
        minutes: 6,
        virtueGrants: { wisdom: 1 }
      }
    ],
    capstone: {
      title: 'Give-Back Mini-Project',
      requirements: [
        'Complete a small give-back project',
        'Take 3 photos documenting the project',
        'Write 150-word summary of the experience',
        'Submit project documentation'
      ]
    }
  },
  {
    slug: 'martial',
    name: 'Martial Arts Code',
    tone: 'disciplined',
    virtuePrimary: 'COURAGE',
    virtueSecondary: 'JUSTICE',
    teachingChip: 'Power restrained by respect.',
    widgets: [
      {
        id: 'etiquette_drill',
        kind: 'AUDIO_NOTE',
        title: 'Etiquette Drill',
        config: {
          maxSec: 15,
          transcribe: false,
          instruction: 'Bow → breathe → announce name with respect',
          teaching: 'Respect is the foundation of power'
        },
        virtueGrantPerCompletion: { justice: 1, temperance: 1 }
      },
      {
        id: 'kata_counter',
        kind: 'COUNTER',
        title: 'Kata Counter',
        config: {
          targetReps: 50,
          step: 1,
          katas: ['basic stance', 'punch sequence', 'block sequence', 'kick sequence'],
          teaching: 'Perfect practice makes perfect'
        },
        virtueGrantPerCompletion: { courage: 2 }
      },
      {
        id: 'balance_meter',
        kind: 'BALANCE_GYRO',
        title: 'Balance Meter',
        config: {
          targetSec: 30,
          teaching: 'Balance is the foundation of movement'
        },
        virtueGrantPerCompletion: { courage: 1 }
      },
      {
        id: 'sparring_lesson_log',
        kind: 'JOURNAL',
        title: 'Sparring Lesson Log',
        config: {
          prompt: 'What did you learn from your partner/opponent today?',
          minWords: 50,
          aiCoaching: true,
          teaching: 'Every opponent is a teacher'
        },
        virtueGrantPerCompletion: { wisdom: 1, justice: 1 }
      },
      {
        id: 'triangle_breath',
        kind: 'BREATH',
        title: 'Triangle Breath',
        config: {
          pattern: 'triangle',
          params: { in: 3, hold: 3, out: 3, cycles: 15 },
          teaching: 'Control your breath to control your power'
        },
        virtueGrantPerCompletion: { temperance: 1 }
      }
    ],
    quests: [
      {
        id: 'martial_quest_1',
        title: 'Etiquette + kata 50 reps + triangle breath',
        description: 'Practice etiquette, complete kata, practice breathing',
        widgetIds: ['etiquette_drill', 'kata_counter', 'triangle_breath'],
        minutes: 12,
        virtueGrants: { courage: 3, justice: 1, temperance: 1 }
      },
      {
        id: 'martial_quest_2',
        title: 'Balance test best of 3 + lesson log',
        description: 'Test balance and log sparring lessons',
        widgetIds: ['balance_meter', 'sparring_lesson_log'],
        minutes: 8,
        virtueGrants: { courage: 2, wisdom: 1, justice: 1 }
      },
      {
        id: 'martial_quest_3',
        title: 'Dojo mini-session (10 min total)',
        description: 'Complete a mini training session',
        widgetIds: ['kata_counter', 'balance_meter'],
        minutes: 10,
        virtueGrants: { courage: 3 }
      }
    ],
    capstone: {
      title: 'Full Kata Recording',
      requirements: [
        'Record a complete kata performance',
        'Submit video link or file',
        'Complete self-critique checklist',
        'Submit capstone evidence'
      ]
    }
  },
  {
    slug: 'sufi',
    name: 'Sufi Practice',
    tone: 'devotional',
    virtuePrimary: 'WISDOM',
    virtueSecondary: 'TEMPERANCE',
    teachingChip: 'Polish the heart through remembrance.',
    widgets: [
      {
        id: 'dhikr_beads',
        kind: 'COUNTER',
        title: 'Dhikr Beads',
        config: {
          targetReps: 108,
          step: 1,
          mantras: ['Allah', 'Hu', 'Ya Rahman', 'Ya Rahim'],
          teaching: 'Remember the divine in all things'
        },
        virtueGrantPerCompletion: { temperance: 1 }
      },
      {
        id: 'poetry_wheel',
        kind: 'WHEEL',
        title: 'Poetry Wheel',
        config: {
          options: ['Rumi', 'Hafiz', 'Ibn Arabi', 'Rabia', 'Attar', 'Sana\'i'],
          teaching: 'Poetry opens the heart'
        },
        virtueGrantPerCompletion: { wisdom: 1 }
      },
      {
        id: 'whirling_tracker',
        kind: 'TIMER',
        title: 'Whirling Tracker',
        config: {
          targetSec: 180, // 3 minutes
          allowRPE: false,
          dizziness: true,
          teaching: 'Whirling is a form of prayer'
        },
        virtueGrantPerCompletion: { temperance: 1 }
      },
      {
        id: 'service_pledge',
        kind: 'CHECKLIST',
        title: 'Service Pledge',
        config: {
          items: [
            { id: 'compassionate_act', label: 'Choose one compassionate act', required: true },
            { id: 'confirm_done', label: 'Confirm the act is completed', required: true },
            { id: 'service_note', label: 'Write 40+ word note about the act', required: true }
          ],
          teaching: 'Service is the path to enlightenment'
        },
        virtueGrantPerCompletion: { justice: 1, wisdom: 1 }
      },
      {
        id: 'sufi_breath',
        kind: 'BREATH',
        title: 'Sufi Breath',
        config: {
          pattern: 'mantra',
          params: { mantra: 'Hu', minutes: 5 },
          teaching: 'Breathe the name of the divine'
        },
        virtueGrantPerCompletion: { temperance: 1 }
      }
    ],
    quests: [
      {
        id: 'sufi_quest_1',
        title: 'Dhikr 108 + poetry reflection + mantra breath',
        description: 'Complete dhikr, reflect on poetry, practice breathing',
        widgetIds: ['dhikr_beads', 'poetry_wheel', 'sufi_breath'],
        minutes: 10,
        virtueGrants: { temperance: 2, wisdom: 1 }
      },
      {
        id: 'sufi_quest_2',
        title: 'Whirl 3–5 min + service pledge',
        description: 'Practice whirling and make service pledge',
        widgetIds: ['whirling_tracker', 'service_pledge'],
        minutes: 8,
        virtueGrants: { temperance: 1, justice: 1, wisdom: 1 }
      },
      {
        id: 'sufi_quest_3',
        title: 'Sufi trio: breath + dhikr + journal',
        description: 'Practice breathing, dhikr, and journaling',
        widgetIds: ['sufi_breath', 'dhikr_beads'],
        minutes: 6,
        virtueGrants: { temperance: 2 }
      }
    ],
    capstone: {
      title: 'Service Circle',
      requirements: [
        'Host or participate in a service circle',
        'Record audio recap of the experience',
        'Submit audio evidence',
        'Complete capstone checklist'
      ]
    }
  },
  {
    slug: 'ubuntu',
    name: 'Ubuntu',
    tone: 'communal',
    virtuePrimary: 'JUSTICE',
    virtueSecondary: 'WISDOM',
    teachingChip: 'I am because we are.',
    widgets: [
      {
        id: 'gratitude_sender',
        kind: 'JOURNAL',
        title: 'Gratitude Sender',
        config: {
          prompt: 'Write a gratitude message to someone',
          minWords: 30,
          aiCoaching: true,
          smsFriendly: true,
          teaching: 'Gratitude opens the heart'
        },
        virtueGrantPerCompletion: { justice: 2 }
      },
      {
        id: 'consensus_poll',
        kind: 'CHECKLIST',
        title: 'Consensus Poll',
        config: {
          items: [
            { id: 'create_poll', label: 'Create a 1-question poll', required: true },
            { id: 'answer_poll', label: 'Answer someone else\'s poll', required: true }
          ],
          teaching: 'Seek consensus through participation'
        },
        virtueGrantPerCompletion: { justice: 1 }
      },
      {
        id: 'reconciliation_log',
        kind: 'JOURNAL',
        title: 'Reconciliation Log',
        config: {
          prompt: 'Name a rift in your life and plan the first step toward reconciliation',
          minWords: 60,
          aiCoaching: true,
          teaching: 'Reconciliation heals the community'
        },
        virtueGrantPerCompletion: { justice: 2, wisdom: 1 }
      },
      {
        id: 'story_share_board',
        kind: 'AUDIO_NOTE',
        title: 'Story Share Board',
        config: {
          maxSec: 60,
          transcribe: true,
          instruction: 'Share a story that connects you to others',
          teaching: 'Stories build community'
        },
        virtueGrantPerCompletion: { wisdom: 1, justice: 1 }
      },
      {
        id: 'heart_breath',
        kind: 'BREATH',
        title: 'Heart Breath',
        config: {
          pattern: 'heart',
          params: { in: 5, out: 5, minutes: 5 },
          teaching: 'Breathe from the heart'
        },
        virtueGrantPerCompletion: { temperance: 1 }
      }
    ],
    quests: [
      {
        id: 'ubuntu_quest_1',
        title: 'Send gratitude + heart breath + poll',
        description: 'Send gratitude, practice breathing, participate in poll',
        widgetIds: ['gratitude_sender', 'heart_breath', 'consensus_poll'],
        minutes: 8,
        virtueGrants: { justice: 3, temperance: 1 }
      },
      {
        id: 'ubuntu_quest_2',
        title: 'Reconciliation first step + 60s story',
        description: 'Plan reconciliation and share story',
        widgetIds: ['reconciliation_log', 'story_share_board'],
        minutes: 10,
        virtueGrants: { justice: 2, wisdom: 1 }
      },
      {
        id: 'ubuntu_quest_3',
        title: 'Community micro-day: 2 actions',
        description: 'Complete two community-focused actions',
        widgetIds: ['consensus_poll', 'gratitude_sender'],
        minutes: 6,
        virtueGrants: { justice: 3 }
      }
    ],
    capstone: {
      title: 'Facilitate a Decision',
      requirements: [
        'Facilitate a group decision-making process',
        'Document the process and outcome',
        'Submit facilitation documentation',
        'Complete capstone checklist'
      ]
    }
  },
  {
    slug: 'highperf',
    name: 'Modern High-Performance',
    tone: 'crisp',
    virtuePrimary: 'WISDOM',
    virtueSecondary: 'COURAGE',
    teachingChip: 'Small systems, big outcomes.',
    widgets: [
      {
        id: 'flow_timer',
        kind: 'TIMER',
        title: 'Flow Timer',
        config: {
          targetSec: 3000, // 50 minutes
          allowRPE: false,
          distractionLog: true,
          teaching: 'Focus is the new superpower'
        },
        virtueGrantPerCompletion: { wisdom: 2 }
      },
      {
        id: 'habit_stack_builder',
        kind: 'JOURNAL',
        title: 'Habit Stack Builder',
        config: {
          prompt: 'Create a habit stack: "If [cue], then [action]"',
          minWords: 40,
          aiCoaching: true,
          teaching: 'Compound your knowledge daily'
        },
        virtueGrantPerCompletion: { wisdom: 1, temperance: 1 }
      },
      {
        id: 'biofeedback_tiles',
        kind: 'PHOTO',
        title: 'Biofeedback Tiles',
        config: {
          tags: ['sleep_score', 'hrv', 'rhr', 'metrics'],
          teaching: 'Track your biological data'
        },
        virtueGrantPerCompletion: { wisdom: 1 }
      },
      {
        id: 'kaizen_log',
        kind: 'JOURNAL',
        title: 'Kaizen Log',
        config: {
          prompt: 'Identify one 1% improvement you can make today',
          minWords: 40,
          aiCoaching: true,
          teaching: 'Continuous improvement through small changes'
        },
        virtueGrantPerCompletion: { wisdom: 1, courage: 1 }
      },
      {
        id: 'flow_breath',
        kind: 'BREATH',
        title: 'Flow Breath',
        config: {
          pattern: '6-2',
          params: { in: 6, out: 2, minutes: 3 },
          teaching: 'Optimize your breathing for performance'
        },
        virtueGrantPerCompletion: { courage: 1, temperance: 1 }
      }
    ],
    quests: [
      {
        id: 'highperf_quest_1',
        title: 'One flow block + kaizen note',
        description: 'Complete flow session and identify improvement',
        widgetIds: ['flow_timer', 'kaizen_log'],
        minutes: 12,
        virtueGrants: { wisdom: 3, courage: 1 }
      },
      {
        id: 'highperf_quest_2',
        title: 'Habit stack + 6-2 energizer',
        description: 'Build habit stack and practice energizing breath',
        widgetIds: ['habit_stack_builder', 'flow_breath'],
        minutes: 8,
        virtueGrants: { wisdom: 1, temperance: 1, courage: 1 }
      },
      {
        id: 'highperf_quest_3',
        title: 'Metrics check + reflection',
        description: 'Check biofeedback metrics and reflect',
        widgetIds: ['biofeedback_tiles', 'kaizen_log'],
        minutes: 6,
        virtueGrants: { wisdom: 2, courage: 1 }
      }
    ],
    capstone: {
      title: 'Ship in 7 Days',
      requirements: [
        'Complete 7 days of daily logs',
        'Create burndown summary',
        'Submit 7-day log documentation',
        'Complete capstone checklist'
      ]
    }
  },
  {
    slug: 'celtic_druid',
    name: 'Celtic Druid',
    tone: 'natural',
    virtuePrimary: 'WISDOM',
    virtueSecondary: 'TEMPERANCE',
    teachingChip: 'Wisdom flows from the natural world.',
    widgets: [
      {
        id: 'nature_observation',
        kind: 'JOURNAL',
        title: 'Nature Observation',
        config: {
          prompt: 'Observe and record what you see in nature today',
          minWords: 60,
          aiCoaching: true,
          teaching: 'Nature is the greatest teacher'
        },
        virtueGrantPerCompletion: { wisdom: 2, temperance: 1 }
      },
      {
        id: 'seasonal_cycle_tracker',
        kind: 'CHECKLIST',
        title: 'Seasonal Cycle Tracker',
        config: {
          items: [
            { id: 'season_awareness', label: 'What season are we in?', required: true },
            { id: 'cycle_observation', label: 'What cycles do you observe?', required: true },
            { id: 'seasonal_action', label: 'What action does this season call for?', required: true }
          ],
          teaching: 'Live in harmony with natural cycles'
        },
        virtueGrantPerCompletion: { temperance: 2, wisdom: 1 }
      },
      {
        id: 'herbal_wisdom_journal',
        kind: 'JOURNAL',
        title: 'Herbal Wisdom Journal',
        config: {
          prompt: 'Research and record the properties of one herb or plant',
          minWords: 80,
          aiCoaching: true,
          teaching: 'Plants hold ancient wisdom'
        },
        virtueGrantPerCompletion: { wisdom: 2 }
      },
      {
        id: 'oral_tradition_practice',
        kind: 'AUDIO_NOTE',
        title: 'Oral Tradition Practice',
        config: {
          maxSec: 120,
          transcribe: true,
          instruction: 'Tell a story or share wisdom from memory',
          teaching: 'Oral tradition preserves wisdom across generations'
        },
        virtueGrantPerCompletion: { wisdom: 2, temperance: 1 }
      },
      {
        id: 'druid_breath',
        kind: 'BREATH',
        title: 'Druid Breath',
        config: {
          pattern: 'natural',
          params: { in: 4, out: 6, minutes: 10 },
          teaching: 'Breathe with the rhythm of nature'
        },
        virtueGrantPerCompletion: { temperance: 2, wisdom: 1 }
      }
    ],
    quests: [
      {
        id: 'druid_quest_1',
        title: 'Nature walk + observation journal',
        description: 'Take a nature walk and record your observations',
        widgetIds: ['nature_observation', 'druid_breath'],
        minutes: 20,
        virtueGrants: { wisdom: 3, temperance: 2 }
      },
      {
        id: 'druid_quest_2',
        title: 'Seasonal awareness + herbal research',
        description: 'Track seasonal cycles and research one herb',
        widgetIds: ['seasonal_cycle_tracker', 'herbal_wisdom_journal'],
        minutes: 15,
        virtueGrants: { wisdom: 3, temperance: 1 }
      },
      {
        id: 'druid_quest_3',
        title: 'Oral tradition + reflection',
        description: 'Practice oral storytelling and reflect on wisdom',
        widgetIds: ['oral_tradition_practice', 'nature_observation'],
        minutes: 18,
        virtueGrants: { wisdom: 4, temperance: 1 }
      }
    ],
    capstone: {
      title: 'Druid Initiation',
      requirements: [
        'Complete 7 days of nature observation',
        'Research and document 5 herbs or plants',
        'Create a seasonal living plan',
        'Share wisdom through oral tradition',
        'Complete capstone checklist'
      ]
    }
  },
  {
    slug: 'tibetan_monk',
    name: 'Tibetan Buddhist Monk',
    tone: 'contemplative',
    virtuePrimary: 'WISDOM',
    virtueSecondary: 'TEMPERANCE',
    teachingChip: 'Inner peace reveals ultimate wisdom.',
    widgets: [
      {
        id: 'tummo_meditation',
        kind: 'TIMER',
        title: 'Tummo Meditation',
        config: {
          targetSec: 900, // 15 minutes
          allowRPE: false,
          teaching: 'Generate inner heat through meditation'
        },
        virtueGrantPerCompletion: { wisdom: 2, temperance: 2 }
      },
      {
        id: 'philosophical_debate',
        kind: 'JOURNAL',
        title: 'Philosophical Debate',
        config: {
          prompt: 'Engage in a philosophical debate with yourself on a profound question',
          minWords: 100,
          aiCoaching: true,
          teaching: 'Debate sharpens the mind and reveals truth'
        },
        virtueGrantPerCompletion: { wisdom: 3 }
      },
      {
        id: 'mandala_creation',
        kind: 'PHOTO',
        title: 'Mandala Creation',
        config: {
          tags: ['mandala', 'meditation', 'art', 'wisdom'],
          teaching: 'Create beauty as a form of meditation'
        },
        virtueGrantPerCompletion: { wisdom: 2, temperance: 1 }
      },
      {
        id: 'compassion_meditation',
        kind: 'TIMER',
        title: 'Compassion Meditation',
        config: {
          targetSec: 600, // 10 minutes
          allowRPE: false,
          teaching: 'Develop boundless compassion for all beings'
        },
        virtueGrantPerCompletion: { wisdom: 1, temperance: 1 }
      },
      {
        id: 'tibetan_breath',
        kind: 'BREATH',
        title: 'Tibetan Breath',
        config: {
          pattern: 'alternate_nostril',
          params: { in: 4, hold: 8, out: 8, cycles: 12 },
          teaching: 'Balance the mind through breath control'
        },
        virtueGrantPerCompletion: { temperance: 2, wisdom: 1 }
      }
    ],
    quests: [
      {
        id: 'tibetan_quest_1',
        title: 'Tummo + compassion meditation',
        description: 'Practice inner fire and compassion meditation',
        widgetIds: ['tummo_meditation', 'compassion_meditation'],
        minutes: 25,
        virtueGrants: { wisdom: 3, temperance: 3 }
      },
      {
        id: 'tibetan_quest_2',
        title: 'Philosophical debate + mandala',
        description: 'Engage in debate and create mandala art',
        widgetIds: ['philosophical_debate', 'mandala_creation'],
        minutes: 30,
        virtueGrants: { wisdom: 4, temperance: 1 }
      },
      {
        id: 'tibetan_quest_3',
        title: 'Breath mastery + deep reflection',
        description: 'Master Tibetan breathing and reflect deeply',
        widgetIds: ['tibetan_breath', 'philosophical_debate'],
        minutes: 20,
        virtueGrants: { wisdom: 2, temperance: 3 }
      }
    ],
    capstone: {
      title: 'Monastic Wisdom',
      requirements: [
        'Complete 21 days of daily meditation',
        'Write a philosophical treatise (500+ words)',
        'Create a personal mandala',
        'Master Tibetan breathing techniques',
        'Complete capstone checklist'
      ]
    }
  },
  {
    slug: 'viking_berserker',
    name: 'Viking Berserker',
    tone: 'fierce',
    virtuePrimary: 'COURAGE',
    virtueSecondary: 'TEMPERANCE',
    teachingChip: 'Master your rage, master your fate.',
    widgets: [
      {
        id: 'cold_endurance_timer',
        kind: 'TIMER',
        title: 'Cold Endurance Timer',
        config: {
          targetSec: 300, // 5 minutes
          allowRPE: true,
          teaching: 'Build resilience through cold exposure'
        },
        virtueGrantPerCompletion: { courage: 2, temperance: 1 }
      },
      {
        id: 'berserker_rage_control',
        kind: 'JOURNAL',
        title: 'Berserker Rage Control',
        config: {
          prompt: 'Describe a situation that triggered anger and how you controlled it',
          minWords: 80,
          aiCoaching: true,
          teaching: 'True strength is controlling your rage'
        },
        virtueGrantPerCompletion: { courage: 2, temperance: 2 }
      },
      {
        id: 'shield_wall_training',
        kind: 'COUNTER',
        title: 'Shield Wall Training',
        config: {
          targetReps: 30,
          step: 1,
          exercises: ['shield_raises', 'wall_pushes', 'formation_holds'],
          teaching: 'Unity and discipline in the shield wall'
        },
        virtueGrantPerCompletion: { courage: 2, temperance: 1 }
      },
      {
        id: 'battle_preparation',
        kind: 'CHECKLIST',
        title: 'Battle Preparation',
        config: {
          items: [
            { id: 'mental_prep', label: 'Mental preparation complete', required: true },
            { id: 'physical_prep', label: 'Physical readiness confirmed', required: true },
            { id: 'strategy_plan', label: 'Strategy planned and reviewed', required: true }
          ],
          teaching: 'Preparation is the key to victory'
        },
        virtueGrantPerCompletion: { courage: 1, wisdom: 1 }
      },
      {
        id: 'viking_breath',
        kind: 'BREATH',
        title: 'Viking Breath',
        config: {
          pattern: 'power',
          params: { in: 3, hold: 2, out: 6, cycles: 10 },
          teaching: 'Powerful breathing for battle readiness'
        },
        virtueGrantPerCompletion: { courage: 2, temperance: 1 }
      }
    ],
    quests: [
      {
        id: 'viking_quest_1',
        title: 'Cold endurance + rage control',
        description: 'Build cold tolerance and practice rage control',
        widgetIds: ['cold_endurance_timer', 'berserker_rage_control'],
        minutes: 15,
        virtueGrants: { courage: 4, temperance: 3 }
      },
      {
        id: 'viking_quest_2',
        title: 'Shield wall + battle prep',
        description: 'Train shield wall techniques and prepare for challenges',
        widgetIds: ['shield_wall_training', 'battle_preparation'],
        minutes: 20,
        virtueGrants: { courage: 3, wisdom: 1, temperance: 1 }
      },
      {
        id: 'viking_quest_3',
        title: 'Breath mastery + deep reflection',
        description: 'Master Viking breathing and reflect on courage',
        widgetIds: ['viking_breath', 'berserker_rage_control'],
        minutes: 18,
        virtueGrants: { courage: 3, temperance: 2 }
      }
    ],
    capstone: {
      title: 'Berserker Mastery',
      requirements: [
        'Complete 14 days of cold endurance training',
        'Master rage control in 5 challenging situations',
        'Achieve shield wall proficiency',
        'Create a personal battle strategy',
        'Complete capstone checklist'
      ]
    }
  }
];

export const getFrameworkBySlug = (slug: string): FrameworkConfig | undefined => {
  return FRAMEWORKS.find(f => f.slug === slug);
};

export const getAllFrameworks = (): FrameworkConfig[] => {
  return FRAMEWORKS;
}; 
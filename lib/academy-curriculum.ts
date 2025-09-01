import { Brain, Shield, Scale, Leaf, BookOpen, Target, Heart, Zap, Star, Clock, Lightbulb, MessageCircle, GraduationCap, Users, Eye, Compass, ArrowRight, CheckCircle, Circle } from 'lucide-react';

export interface AcademyLesson {
  id: string;
  title: string;
  subtitle: string;
  teaching: string;
  question: string;
  practice: string;
  reading: string;
  quote: string;
  author: string;
  completed: boolean;
  response?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  prerequisites: string[];
  virtueGrants: {
    wisdom?: number;
    justice?: number;
    courage?: number;
    temperance?: number;
  };
}

export interface VirtueModule {
  id: string;
  name: string;
  greekName: string;
  description: string;
  longDescription: string;
  icon: any;
  color: string;
  gradient: string;
  lessons: AcademyLesson[];
  completed: boolean;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  estimatedTotalTime: number;
  prerequisites: string[];
  capstoneProject: {
    title: string;
    description: string;
    requirements: string[];
    estimatedTime: number;
  };
}

export const ACADEMY_CURRICULUM: VirtueModule[] = [
  {
    id: 'wisdom',
    name: 'Wisdom',
    greekName: 'Σοφία (Sophia)',
    description: 'The virtue of knowledge, understanding, and sound judgment',
    longDescription: 'Wisdom is the highest intellectual virtue, combining theoretical knowledge with practical understanding. It involves the ability to see the truth, make sound judgments, and guide others toward the good. Aristotle distinguished between theoretical wisdom (sophia) and practical wisdom (phronesis), both essential for human flourishing.',
    icon: Brain,
    color: 'bg-primary/20 text-primary border-primary/30',
    gradient: 'from-primary/20 to-primary/5',
    progress: 0,
    completed: false,
    totalLessons: 12,
    completedLessons: 0,
    estimatedTotalTime: 180,
    prerequisites: [],
    lessons: [
      {
        id: 'wisdom-1',
        title: 'The Socratic Method',
        subtitle: 'Wisdom begins with recognizing what we do not know',
        teaching: 'Socrates taught that true wisdom begins with intellectual humility—recognizing the limits of our knowledge. The Socratic method involves asking probing questions to examine our beliefs and assumptions, leading to deeper understanding and self-awareness.',
        question: 'What is one belief or assumption you hold that you could examine more deeply through questioning?',
        practice: 'Spend 10 minutes writing down 5 beliefs you hold strongly, then question each one with "Why do I believe this?" and "What evidence supports this belief?"',
        reading: 'Plato\'s "Apology" - Socrates\' defense of the examined life',
        quote: 'The unexamined life is not worth living.',
        author: 'Socrates',
        completed: false,
        difficulty: 'beginner',
        estimatedTime: 15,
        prerequisites: [],
        virtueGrants: { wisdom: 2 }
      },
      {
        id: 'wisdom-2',
        title: 'The Golden Mean',
        subtitle: 'Virtue lies between excess and deficiency',
        teaching: 'Aristotle\'s concept of the Golden Mean teaches that virtue lies between excess and deficiency. For example, courage is the mean between cowardice (deficiency) and recklessness (excess). This principle helps us find balance in all aspects of life.',
        question: 'In what area of your life could you apply the Golden Mean to find better balance?',
        practice: 'Identify 3 areas where you tend toward extremes. For each, define the virtuous mean and create a specific plan to move toward it.',
        reading: 'Aristotle\'s "Nicomachean Ethics" Book II - On Virtue',
        quote: 'Virtue is a mean between two vices, one of excess and one of deficiency.',
        author: 'Aristotle',
        completed: false,
        difficulty: 'beginner',
        estimatedTime: 20,
        prerequisites: ['wisdom-1'],
        virtueGrants: { wisdom: 2, temperance: 1 }
      },
      {
        id: 'wisdom-3',
        title: 'Practical Wisdom (Phronesis)',
        subtitle: 'The ability to make good judgments in particular situations',
        teaching: 'Practical wisdom (phronesis) is the ability to discern what is good and make sound judgments in specific situations. Unlike theoretical knowledge, it requires experience, reflection, and the ability to apply general principles to particular circumstances.',
        question: 'What is a recent decision you made that required practical wisdom? How did you apply general principles to that specific situation?',
        practice: 'Reflect on 3 recent decisions. For each, identify the general principles involved and how you applied them to the specific context.',
        reading: 'Aristotle\'s "Nicomachean Ethics" Book VI - On Intellectual Virtues',
        quote: 'Practical wisdom is concerned with human things and with those about which it is possible to deliberate.',
        author: 'Aristotle',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 25,
        prerequisites: ['wisdom-1', 'wisdom-2'],
        virtueGrants: { wisdom: 3 }
      },
      {
        id: 'wisdom-4',
        title: 'Contemplative Practice',
        subtitle: 'The importance of reflection and self-examination',
        teaching: 'Ancient philosophers emphasized the importance of regular contemplation and reflection. This practice allows us to examine our experiences, learn from them, and develop deeper understanding of ourselves and the world.',
        question: 'How could you incorporate more contemplative time into your daily routine?',
        practice: 'Set aside 15 minutes daily for contemplation. Use this time to reflect on your experiences, examine your thoughts, and consider how you can live more virtuously.',
        reading: 'Marcus Aurelius\' "Meditations" - Daily reflections',
        quote: 'The soul becomes dyed with the color of its thoughts.',
        author: 'Marcus Aurelius',
        completed: false,
        difficulty: 'beginner',
        estimatedTime: 15,
        prerequisites: ['wisdom-1'],
        virtueGrants: { wisdom: 1, temperance: 1 }
      },
      {
        id: 'wisdom-5',
        title: 'The Four Causes',
        subtitle: 'Understanding the deeper reasons behind things',
        teaching: 'Aristotle\'s theory of the four causes helps us understand the deeper reasons behind things: material cause (what it\'s made of), formal cause (its form or pattern), efficient cause (what brought it about), and final cause (its purpose or end).',
        question: 'Choose an object or situation and analyze it using the four causes. What insights does this reveal?',
        practice: 'Apply the four causes to analyze a personal goal or project. How does understanding its purpose (final cause) change your approach?',
        reading: 'Aristotle\'s "Physics" Book II - On the Four Causes',
        quote: 'We think we have knowledge of a thing only when we have grasped its why, that is to say, its cause.',
        author: 'Aristotle',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['wisdom-2', 'wisdom-3'],
        virtueGrants: { wisdom: 2 }
      },
      {
        id: 'wisdom-6',
        title: 'Intellectual Virtues',
        subtitle: 'Developing the habits of excellent thinking',
        teaching: 'Intellectual virtues are habits of excellent thinking that we develop through practice. They include understanding, science, wisdom, art, and practical wisdom. These virtues enable us to think clearly, reason well, and make sound judgments.',
        question: 'Which intellectual virtue do you most need to develop? How can you practice it daily?',
        practice: 'Choose one intellectual virtue to focus on for a week. Create specific practices to develop it and reflect on your progress.',
        reading: 'Aristotle\'s "Nicomachean Ethics" Book VI - Intellectual Virtues',
        quote: 'Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution.',
        author: 'Aristotle',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 25,
        prerequisites: ['wisdom-3', 'wisdom-4'],
        virtueGrants: { wisdom: 3 }
      },
      {
        id: 'wisdom-7',
        title: 'The Examined Life',
        subtitle: 'Continuous self-reflection and growth',
        teaching: 'The examined life involves continuous self-reflection, questioning our assumptions, and seeking to understand ourselves and the world more deeply. It requires intellectual humility, curiosity, and a commitment to truth.',
        question: 'What aspects of your life would benefit from deeper examination?',
        practice: 'Create a weekly examination practice. Reflect on your thoughts, actions, and character development. Ask yourself: What did I learn? How did I grow? What could I improve?',
        reading: 'Plato\'s "Republic" - The Allegory of the Cave',
        quote: 'The unexamined life is not worth living for a human being.',
        author: 'Socrates',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['wisdom-4', 'wisdom-5'],
        virtueGrants: { wisdom: 2, temperance: 1 }
      },
      {
        id: 'wisdom-8',
        title: 'Dialectical Reasoning',
        subtitle: 'The art of philosophical dialogue',
        teaching: 'Dialectical reasoning involves engaging in philosophical dialogue to discover truth through questioning and discussion. It requires listening carefully, asking good questions, and being open to having our views challenged and refined.',
        question: 'How can you engage in more dialectical reasoning in your conversations with others?',
        practice: 'Have a philosophical conversation with someone. Focus on asking questions that help both of you think more deeply about a topic.',
        reading: 'Plato\'s "Meno" - Socratic dialogue on virtue',
        quote: 'Wonder is the beginning of philosophy.',
        author: 'Socrates',
        completed: false,
        difficulty: 'advanced',
        estimatedTime: 30,
        prerequisites: ['wisdom-6', 'wisdom-7'],
        virtueGrants: { wisdom: 3, justice: 1 }
      },
      {
        id: 'wisdom-9',
        title: 'Theoretical Wisdom',
        subtitle: 'Understanding the highest principles',
        teaching: 'Theoretical wisdom (sophia) involves understanding the highest principles and causes of things. It combines scientific knowledge with intuitive understanding of the most fundamental truths about reality.',
        question: 'What are the most fundamental principles that guide your understanding of the world?',
        practice: 'Reflect on the most important questions: What is the nature of reality? What is the good life? What is the purpose of human existence? Write your current thoughts and how they might evolve.',
        reading: 'Aristotle\'s "Metaphysics" - On First Philosophy',
        quote: 'All men by nature desire to know.',
        author: 'Aristotle',
        completed: false,
        difficulty: 'advanced',
        estimatedTime: 25,
        prerequisites: ['wisdom-5', 'wisdom-8'],
        virtueGrants: { wisdom: 3 }
      },
      {
        id: 'wisdom-10',
        title: 'Intellectual Humility',
        subtitle: 'Recognizing the limits of our knowledge',
        teaching: 'Intellectual humility involves recognizing the limits of our knowledge and being open to learning from others. It requires acknowledging our ignorance, being willing to change our views, and valuing truth over being right.',
        question: 'When was the last time you changed your mind about something important? What led to that change?',
        practice: 'Identify a belief you hold strongly. Actively seek out evidence and arguments that might challenge it. Be willing to revise your view if the evidence warrants it.',
        reading: 'Socrates\' defense in Plato\'s "Apology"',
        quote: 'I know that I know nothing.',
        author: 'Socrates',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['wisdom-7', 'wisdom-8'],
        virtueGrants: { wisdom: 2, temperance: 1 }
      },
      {
        id: 'wisdom-11',
        title: 'The Unity of Knowledge',
        subtitle: 'Connecting different areas of understanding',
        teaching: 'True wisdom involves seeing the connections between different areas of knowledge and understanding how they relate to the whole. It requires integrating theoretical and practical knowledge, and seeing how everything fits together.',
        question: 'How do your different areas of knowledge and experience connect to form a unified understanding?',
        practice: 'Create a mind map showing how your different areas of knowledge, experience, and values connect. Look for patterns and relationships.',
        reading: 'Aristotle\'s "Posterior Analytics" - On Scientific Knowledge',
        quote: 'The whole is greater than the sum of its parts.',
        author: 'Aristotle',
        completed: false,
        difficulty: 'advanced',
        estimatedTime: 30,
        prerequisites: ['wisdom-9', 'wisdom-10'],
        virtueGrants: { wisdom: 3 }
      },
      {
        id: 'wisdom-12',
        title: 'Wisdom in Action',
        subtitle: 'Applying wisdom to daily life',
        teaching: 'The ultimate test of wisdom is how we live our lives. True wisdom manifests in our actions, decisions, and character. It involves consistently choosing what is good and acting in accordance with our understanding.',
        question: 'How does your wisdom manifest in your daily actions and decisions?',
        practice: 'For one week, consciously apply your wisdom to every significant decision. Reflect on how this changes your choices and their outcomes.',
        reading: 'Aristotle\'s "Nicomachean Ethics" Book X - The Contemplative Life',
        quote: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
        author: 'Aristotle',
        completed: false,
        difficulty: 'advanced',
        estimatedTime: 25,
        prerequisites: ['wisdom-11'],
        virtueGrants: { wisdom: 3, temperance: 1 }
      }
    ],
    capstoneProject: {
      title: 'The Wise Life Project',
      description: 'Create a comprehensive plan for living a wise life, integrating all the lessons learned in this module.',
      requirements: [
        'Write a 1000-word essay on your philosophy of wisdom',
        'Create a daily practice plan incorporating wisdom principles',
        'Design a curriculum for teaching wisdom to others',
        'Reflect on how wisdom has transformed your life'
      ],
      estimatedTime: 120
    }
  },
  {
    id: 'justice',
    name: 'Justice',
    greekName: 'Δικαιοσύνη (Dikaiosyne)',
    description: 'The virtue of fairness, right relationships, and social harmony',
    longDescription: 'Justice is the virtue that governs our relationships with others and our role in society. It involves treating others fairly, contributing to the common good, and maintaining right relationships. Aristotle distinguished between distributive justice (fair distribution of goods) and corrective justice (righting wrongs).',
    icon: Scale,
    color: 'bg-justice/20 text-justice border-justice/30',
    gradient: 'from-justice/20 to-justice/5',
    progress: 0,
    completed: false,
    totalLessons: 12,
    completedLessons: 0,
    estimatedTotalTime: 180,
    prerequisites: [],
    lessons: [
      {
        id: 'justice-1',
        title: 'Fairness in Relationships',
        subtitle: 'Treating others with dignity and respect',
        teaching: 'Justice in relationships means treating others with fairness, respect, and dignity. It involves listening to different perspectives, considering others\' needs, and acting with integrity in our interactions.',
        question: 'How can you practice greater fairness in your relationships with others?',
        practice: 'Identify 3 relationships where you could be more just. For each, write down one specific action you can take to treat the other person more fairly.',
        reading: 'Aristotle\'s "Nicomachean Ethics" Book V - On Justice',
        quote: 'Justice is giving each person what they deserve.',
        author: 'Aristotle',
        completed: false,
        difficulty: 'beginner',
        estimatedTime: 15,
        prerequisites: [],
        virtueGrants: { justice: 2 }
      },
      {
        id: 'justice-2',
        title: 'Distributive Justice',
        subtitle: 'Fair distribution of goods and opportunities',
        teaching: 'Distributive justice concerns the fair distribution of goods, opportunities, and resources in society. It requires considering what people deserve based on their contributions, needs, and circumstances.',
        question: 'What principles should guide the fair distribution of resources in your community?',
        practice: 'Analyze a current social issue using principles of distributive justice. Consider different perspectives on what would be fair.',
        reading: 'Aristotle\'s "Politics" - On Justice and the State',
        quote: 'Justice is the bond of men in states.',
        author: 'Aristotle',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['justice-1'],
        virtueGrants: { justice: 2, wisdom: 1 }
      },
      {
        id: 'justice-3',
        title: 'Corrective Justice',
        subtitle: 'Righting wrongs and restoring balance',
        teaching: 'Corrective justice involves righting wrongs and restoring balance when harm has been done. It requires fair punishment, restitution, and reconciliation to restore justice.',
        question: 'When you have wronged someone, how do you work to restore justice and repair the relationship?',
        practice: 'Reflect on a time when you wronged someone. What would true corrective justice require? Write a plan for making amends.',
        reading: 'Plato\'s "Republic" - On Justice and the Soul',
        quote: 'Justice is the constant and perpetual will to allot to every man his due.',
        author: 'Justinian',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['justice-1', 'justice-2'],
        virtueGrants: { justice: 2, courage: 1 }
      },
      {
        id: 'justice-4',
        title: 'Social Responsibility',
        subtitle: 'Contributing to the common good',
        teaching: 'Justice extends beyond individual relationships to our role in society. It calls us to contribute to the common good, stand up for what is right, and work toward a more just and harmonious community.',
        question: 'What is one way you could contribute to creating more justice in your community?',
        practice: 'Identify a social issue you care about. Research it and find one concrete way you can contribute to addressing it.',
        reading: 'Aristotle\'s "Politics" - On Citizenship and the Common Good',
        quote: 'Man is by nature a political animal.',
        author: 'Aristotle',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 25,
        prerequisites: ['justice-2', 'justice-3'],
        virtueGrants: { justice: 2, courage: 1 }
      },
      {
        id: 'justice-5',
        title: 'Balanced Judgment',
        subtitle: 'Considering multiple perspectives fairly',
        teaching: 'Just judgment requires us to consider multiple perspectives, examine evidence carefully, and make decisions based on principles rather than personal bias. This practice helps us act with wisdom and fairness.',
        question: 'When making decisions, how could you better consider multiple perspectives?',
        practice: 'Before making an important decision, write down the perspectives of all stakeholders involved. How does this change your understanding?',
        reading: 'Aristotle\'s "Rhetoric" - On Persuasion and Judgment',
        quote: 'It is the mark of an educated mind to be able to entertain a thought without accepting it.',
        author: 'Aristotle',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['justice-3', 'justice-4'],
        virtueGrants: { justice: 2, wisdom: 1 }
      },
      {
        id: 'justice-6',
        title: 'Friendship and Justice',
        subtitle: 'The role of friendship in a just society',
        teaching: 'Aristotle considered friendship essential to justice and human flourishing. True friendship involves mutual care, shared values, and working together for the good. It provides the foundation for just relationships and communities.',
        question: 'How do your friendships contribute to justice and the common good?',
        practice: 'Reflect on your closest friendships. How do they embody principles of justice? How could they be more just?',
        reading: 'Aristotle\'s "Nicomachean Ethics" Books VIII-IX - On Friendship',
        quote: 'Friendship is a single soul dwelling in two bodies.',
        author: 'Aristotle',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['justice-4', 'justice-5'],
        virtueGrants: { justice: 2, temperance: 1 }
      },
      {
        id: 'justice-7',
        title: 'Political Justice',
        subtitle: 'Justice in the political community',
        teaching: 'Political justice concerns the fair governance of communities and the distribution of political power. It requires institutions that promote the common good and protect the rights of all citizens.',
        question: 'What would a just political system look like? What principles should guide it?',
        practice: 'Research a current political issue. Analyze it from the perspective of justice. What would be the most just resolution?',
        reading: 'Aristotle\'s "Politics" - On Constitutional Government',
        quote: 'The best political community is formed by citizens of the middle class.',
        author: 'Aristotle',
        completed: false,
        difficulty: 'advanced',
        estimatedTime: 25,
        prerequisites: ['justice-5', 'justice-6'],
        virtueGrants: { justice: 2, wisdom: 1 }
      },
      {
        id: 'justice-8',
        title: 'Economic Justice',
        subtitle: 'Fair economic relationships and exchanges',
        teaching: 'Economic justice involves fair economic relationships, just wages, and equitable distribution of economic resources. It requires considering the needs of all participants in economic exchanges.',
        question: 'How can you practice economic justice in your work, spending, and economic relationships?',
        practice: 'Audit your economic practices. Are your work relationships, spending habits, and economic choices just? Identify areas for improvement.',
        reading: 'Aristotle\'s "Politics" - On Economics and Justice',
        quote: 'Wealth is evidently not the good we are seeking; for it is merely useful and for the sake of something else.',
        author: 'Aristotle',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['justice-6', 'justice-7'],
        virtueGrants: { justice: 2, temperance: 1 }
      },
      {
        id: 'justice-9',
        title: 'Restorative Justice',
        subtitle: 'Healing and reconciliation',
        teaching: 'Restorative justice focuses on healing harm and restoring relationships rather than just punishing wrongdoers. It involves bringing together victims, offenders, and community members to address harm and find solutions.',
        question: 'How can restorative justice principles be applied in your personal relationships and community?',
        practice: 'Learn about restorative justice practices. Consider how they could be applied to conflicts in your life.',
        reading: 'Contemporary works on restorative justice',
        quote: 'Justice without mercy is cold and calculating.',
        author: 'Traditional',
        completed: false,
        difficulty: 'advanced',
        estimatedTime: 25,
        prerequisites: ['justice-7', 'justice-8'],
        virtueGrants: { justice: 2, temperance: 1 }
      },
      {
        id: 'justice-10',
        title: 'Global Justice',
        subtitle: 'Justice beyond borders',
        teaching: 'Global justice concerns our obligations to people beyond our immediate community and nation. It requires considering how our actions affect people worldwide and working for justice on a global scale.',
        question: 'What are your obligations to people in other parts of the world? How can you contribute to global justice?',
        practice: 'Research a global justice issue. Find one concrete way you can contribute to addressing it, even in a small way.',
        reading: 'Contemporary works on global justice and human rights',
        quote: 'Injustice anywhere is a threat to justice everywhere.',
        author: 'Martin Luther King Jr.',
        completed: false,
        difficulty: 'advanced',
        estimatedTime: 25,
        prerequisites: ['justice-8', 'justice-9'],
        virtueGrants: { justice: 2, courage: 1 }
      },
      {
        id: 'justice-11',
        title: 'Environmental Justice',
        subtitle: 'Justice for future generations and the natural world',
        teaching: 'Environmental justice involves considering the rights of future generations and the natural world. It requires sustainable practices that ensure justice for all living beings and future humans.',
        question: 'How can you practice environmental justice in your daily life?',
        practice: 'Audit your environmental impact. Identify one area where you can make changes to promote environmental justice.',
        reading: 'Contemporary works on environmental ethics and justice',
        quote: 'The earth is what we all have in common.',
        author: 'Wendell Berry',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['justice-9', 'justice-10'],
        virtueGrants: { justice: 2, temperance: 1 }
      },
      {
        id: 'justice-12',
        title: 'Justice in Action',
        subtitle: 'Living justly in daily life',
        teaching: 'The ultimate test of justice is how we live our daily lives. True justice manifests in our actions, relationships, and contributions to society. It requires consistent commitment to fairness and the common good.',
        question: 'How does your commitment to justice manifest in your daily actions and decisions?',
        practice: 'For one week, consciously practice justice in every interaction. Reflect on how this changes your relationships and sense of purpose.',
        reading: 'Aristotle\'s "Nicomachean Ethics" - On the Just Life',
        quote: 'Justice is truth in action.',
        author: 'Benjamin Disraeli',
        completed: false,
        difficulty: 'advanced',
        estimatedTime: 25,
        prerequisites: ['justice-11'],
        virtueGrants: { justice: 3, wisdom: 1 }
      }
    ],
    capstoneProject: {
      title: 'Justice in Practice Project',
      description: 'Design and implement a project that promotes justice in your community or addresses a specific injustice.',
      requirements: [
        'Identify a specific injustice to address',
        'Research the issue and develop a plan',
        'Implement your project over 2-4 weeks',
        'Document the process and outcomes',
        'Reflect on lessons learned and next steps'
      ],
      estimatedTime: 240
    }
  },
  {
    id: 'courage',
    name: 'Courage',
    greekName: 'Ανδρεία (Andreia)',
    description: 'The virtue of facing challenges with strength and determination',
    longDescription: 'Courage is the virtue that enables us to face fear, danger, and difficulty with strength and determination. It involves not the absence of fear, but the ability to act rightly despite fear. Aristotle distinguished between physical courage and moral courage, both essential for human flourishing.',
    icon: Shield,
    color: 'bg-courage/20 text-courage border-courage/30',
    gradient: 'from-courage/20 to-courage/5',
    progress: 0,
    completed: false,
    totalLessons: 12,
    completedLessons: 0,
    estimatedTotalTime: 180,
    prerequisites: [],
    lessons: [
      {
        id: 'courage-1',
        title: 'Facing Fear',
        subtitle: 'Courage is not the absence of fear',
        teaching: 'Courage is not the absence of fear, but the ability to act despite it. Ancient philosophers taught that true courage involves facing our fears with wisdom and determination, rather than avoiding difficult situations.',
        question: 'What fear are you currently facing that requires courage to overcome?',
        practice: 'Identify a fear that holds you back. Create a plan to face it gradually, starting with small steps and building up to bigger challenges.',
        reading: 'Aristotle\'s "Nicomachean Ethics" Book III - On Courage',
        quote: 'Courage is not the absence of fear, but the triumph over it.',
        author: 'Nelson Mandela',
        completed: false,
        difficulty: 'beginner',
        estimatedTime: 15,
        prerequisites: [],
        virtueGrants: { courage: 2 }
      },
      {
        id: 'courage-2',
        title: 'Moral Courage',
        subtitle: 'Standing up for what is right',
        teaching: 'Moral courage is the strength to stand up for what is right, even when it is difficult or unpopular. This includes speaking truth to power, defending others, and maintaining our integrity in challenging circumstances.',
        question: 'When have you needed moral courage to stand up for what you believe is right?',
        practice: 'Identify a situation where you need moral courage. Write down what you believe is right and create a plan to act on it.',
        reading: 'Plato\'s "Apology" - Socrates\' moral courage',
        quote: 'The only thing necessary for the triumph of evil is for good men to do nothing.',
        author: 'Edmund Burke',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['courage-1'],
        virtueGrants: { courage: 2, justice: 1 }
      },
      {
        id: 'courage-3',
        title: 'Perseverance',
        subtitle: 'The ability to persist through difficulties',
        teaching: 'Courage also involves perseverance—the ability to persist through difficulties and setbacks. This virtue helps us maintain our commitment to our goals and values even when progress is slow or obstacles arise.',
        question: 'What goal or value are you committed to that requires perseverance?',
        practice: 'Choose a challenging goal. Break it into smaller steps and commit to working on it daily, even when progress is slow.',
        reading: 'Epictetus\' "Enchiridion" - On Perseverance',
        quote: 'The gem cannot be polished without friction, nor man perfected without trials.',
        author: 'Chinese Proverb',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['courage-1', 'courage-2'],
        virtueGrants: { courage: 2, temperance: 1 }
      },
      {
        id: 'courage-4',
        title: 'Physical Courage',
        subtitle: 'Facing physical challenges and dangers',
        teaching: 'Physical courage involves facing physical challenges, dangers, and discomfort with strength and determination. It includes the courage to endure hardship, face physical threats, and push beyond our comfort zones.',
        question: 'What physical challenges could you face to develop your courage?',
        practice: 'Choose a physical challenge that pushes your comfort zone. Start small and gradually increase the difficulty.',
        reading: 'Xenophon\'s "Anabasis" - Physical courage in adversity',
        quote: 'Courage is resistance to fear, mastery of fear—not absence of fear.',
        author: 'Mark Twain',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 25,
        prerequisites: ['courage-2', 'courage-3'],
        virtueGrants: { courage: 2 }
      },
      {
        id: 'courage-5',
        title: 'Intellectual Courage',
        subtitle: 'Challenging assumptions and seeking truth',
        teaching: 'Intellectual courage involves challenging our own assumptions, questioning established beliefs, and seeking truth even when it is uncomfortable or unpopular. It requires openness to new ideas and willingness to change our views.',
        question: 'What belief or assumption do you hold that you could examine more courageously?',
        practice: 'Identify a belief you hold strongly. Actively seek out evidence and arguments that challenge it. Be willing to revise your view.',
        reading: 'Socrates\' intellectual courage in Plato\'s dialogues',
        quote: 'Doubt is not a pleasant condition, but certainty is absurd.',
        author: 'Voltaire',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['courage-3', 'courage-4'],
        virtueGrants: { courage: 2, wisdom: 1 }
      },
      {
        id: 'courage-6',
        title: 'Emotional Courage',
        subtitle: 'Facing difficult emotions with strength',
        teaching: 'Emotional courage involves facing difficult emotions—fear, sadness, anger, vulnerability—with strength and honesty. It means being willing to feel deeply and work through emotional challenges rather than avoiding them.',
        question: 'What difficult emotion do you tend to avoid? How could you face it with more courage?',
        practice: 'When you feel a difficult emotion, instead of avoiding it, sit with it for a few minutes. Observe it without judgment and see what you can learn.',
        reading: 'Stoic writings on emotional mastery',
        quote: 'Vulnerability is not winning or losing; it\'s having the courage to show up when you can\'t control the outcome.',
        author: 'Brené Brown',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['courage-4', 'courage-5'],
        virtueGrants: { courage: 2, temperance: 1 }
      },
      {
        id: 'courage-7',
        title: 'Social Courage',
        subtitle: 'Courage in relationships and social situations',
        teaching: 'Social courage involves being authentic in relationships, speaking up when needed, and being willing to be vulnerable with others. It includes the courage to be different, to disagree, and to be seen for who we truly are.',
        question: 'In what social situations do you need more courage to be authentic?',
        practice: 'Choose one relationship where you can be more authentic. Practice speaking your truth with kindness and courage.',
        reading: 'Aristotle\'s "Nicomachean Ethics" - On Friendship and Courage',
        quote: 'To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.',
        author: 'Ralph Waldo Emerson',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['courage-5', 'courage-6'],
        virtueGrants: { courage: 2, justice: 1 }
      },
      {
        id: 'courage-8',
        title: 'Creative Courage',
        subtitle: 'The courage to create and innovate',
        teaching: 'Creative courage involves taking risks in our creative work, being willing to fail, and putting our ideas and creations out into the world. It requires vulnerability and the willingness to be judged.',
        question: 'What creative project have you been avoiding due to fear?',
        practice: 'Start a creative project you\'ve been putting off. Focus on the process rather than the outcome, and be willing to make mistakes.',
        reading: 'Ancient Greek writings on creativity and innovation',
        quote: 'Creativity takes courage.',
        author: 'Henri Matisse',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 25,
        prerequisites: ['courage-6', 'courage-7'],
        virtueGrants: { courage: 2, wisdom: 1 }
      },
      {
        id: 'courage-9',
        title: 'Spiritual Courage',
        subtitle: 'Courage in the face of life\'s big questions',
        teaching: 'Spiritual courage involves facing life\'s big questions—meaning, purpose, mortality, the divine—with honesty and openness. It requires the courage to explore the unknown and live with uncertainty.',
        question: 'What spiritual or existential question do you need courage to face?',
        practice: 'Spend time contemplating a big life question. Be willing to live with uncertainty and continue seeking understanding.',
        reading: 'Philosophical writings on meaning and purpose',
        quote: 'The unexamined life is not worth living.',
        author: 'Socrates',
        completed: false,
        difficulty: 'advanced',
        estimatedTime: 25,
        prerequisites: ['courage-7', 'courage-8'],
        virtueGrants: { courage: 2, wisdom: 1 }
      },
      {
        id: 'courage-10',
        title: 'Leadership Courage',
        subtitle: 'The courage to lead and inspire others',
        teaching: 'Leadership courage involves taking responsibility, making difficult decisions, and inspiring others to act. It requires the courage to be accountable, to admit mistakes, and to put the needs of others before our own.',
        question: 'In what area of your life could you show more leadership courage?',
        practice: 'Take on a leadership role in a project or group. Practice making decisions and taking responsibility for outcomes.',
        reading: 'Ancient writings on leadership and courage',
        quote: 'The supreme quality for leadership is unquestionably integrity.',
        author: 'Dwight D. Eisenhower',
        completed: false,
        difficulty: 'advanced',
        estimatedTime: 25,
        prerequisites: ['courage-8', 'courage-9'],
        virtueGrants: { courage: 2, justice: 1 }
      },
      {
        id: 'courage-11',
        title: 'The Courage to Change',
        subtitle: 'Embracing transformation and growth',
        teaching: 'The courage to change involves being willing to transform ourselves, to let go of old patterns, and to embrace new ways of being. It requires the courage to be uncomfortable during the process of growth.',
        question: 'What change do you need courage to make in your life?',
        practice: 'Identify one area where you want to change. Create a plan and take the first step, even if it\'s uncomfortable.',
        reading: 'Philosophical writings on transformation and growth',
        quote: 'Be the change you wish to see in the world.',
        author: 'Mahatma Gandhi',
        completed: false,
        difficulty: 'advanced',
        estimatedTime: 25,
        prerequisites: ['courage-9', 'courage-10'],
        virtueGrants: { courage: 2, temperance: 1 }
      },
      {
        id: 'courage-12',
        title: 'Courage in Daily Life',
        subtitle: 'Living courageously every day',
        teaching: 'True courage manifests in our daily choices and actions. It involves consistently choosing what is right and good, even when it is difficult or uncomfortable. Courage becomes a way of life.',
        question: 'How can you live more courageously in your daily life?',
        practice: 'For one week, consciously practice courage in every significant decision. Choose what is right over what is easy.',
        reading: 'Aristotle\'s "Nicomachean Ethics" - On the Courageous Life',
        quote: 'Courage is the first of human qualities because it is the quality which guarantees the others.',
        author: 'Aristotle',
        completed: false,
        difficulty: 'advanced',
        estimatedTime: 25,
        prerequisites: ['courage-11'],
        virtueGrants: { courage: 3, wisdom: 1 }
      }
    ],
    capstoneProject: {
      title: 'Courage Challenge Project',
      description: 'Design and complete a significant challenge that requires all forms of courage you\'ve learned.',
      requirements: [
        'Design a challenge that tests your courage',
        'Plan how to approach it safely and wisely',
        'Execute the challenge over 2-4 weeks',
        'Document your experience and growth',
        'Reflect on how courage has transformed you'
      ],
      estimatedTime: 240
    }
  },
  {
    id: 'temperance',
    name: 'Temperance',
    greekName: 'Σωφροσύνη (Sophrosyne)',
    description: 'The virtue of self-control, moderation, and inner harmony',
    longDescription: 'Temperance is the virtue of self-control, moderation, and inner harmony. It involves mastering our desires and impulses, finding balance in all things, and living in harmony with our true nature. Aristotle considered it essential for human flourishing and the foundation of other virtues.',
    icon: Leaf,
    color: 'bg-temperance/20 text-temperance border-temperance/30',
    gradient: 'from-temperance/20 to-temperance/5',
    progress: 0,
    completed: false,
    totalLessons: 12,
    completedLessons: 0,
    estimatedTotalTime: 180,
    prerequisites: [],
    lessons: [
      {
        id: 'temperance-1',
        title: 'Self-Control',
        subtitle: 'Mastering our desires and impulses',
        teaching: 'Temperance involves mastering our desires and impulses through self-discipline. This virtue helps us make choices that align with our long-term well-being rather than giving in to immediate gratification.',
        question: 'What area of your life could benefit from greater self-control?',
        practice: 'Choose one area where you struggle with self-control. Create a plan to practice restraint and build self-discipline gradually.',
        reading: 'Aristotle\'s "Nicomachean Ethics" Book III - On Temperance',
        quote: 'Self-control is the chief element in self-respect, and self-respect is the chief element in courage.',
        author: 'Thucydides',
        completed: false,
        difficulty: 'beginner',
        estimatedTime: 15,
        prerequisites: [],
        virtueGrants: { temperance: 2 }
      },
      {
        id: 'temperance-2',
        title: 'Moderation',
        subtitle: 'Finding balance in all things',
        teaching: 'The principle of moderation teaches us to find balance in all things—work and rest, activity and reflection, giving and receiving. This balance helps us maintain harmony in our lives and relationships.',
        question: 'Where in your life could you practice greater moderation?',
        practice: 'Identify 3 areas where you tend toward extremes. For each, define what moderation would look like and create a plan to move toward it.',
        reading: 'Aristotle\'s "Nicomachean Ethics" - On the Golden Mean',
        quote: 'Moderation in all things.',
        author: 'Terence',
        completed: false,
        difficulty: 'beginner',
        estimatedTime: 20,
        prerequisites: ['temperance-1'],
        virtueGrants: { temperance: 2, wisdom: 1 }
      },
      {
        id: 'temperance-3',
        title: 'Inner Harmony',
        subtitle: 'Peace and balance within ourselves',
        teaching: 'Temperance leads to inner harmony—a state of peace and balance within ourselves. This involves managing our emotions, thoughts, and actions in ways that promote our well-being and the well-being of others.',
        question: 'What practices help you maintain inner harmony and peace?',
        practice: 'Develop a daily practice that promotes inner harmony—meditation, reflection, or mindful activity. Commit to it for at least 10 minutes daily.',
        reading: 'Stoic writings on inner peace and harmony',
        quote: 'Peace comes from within. Do not seek it without.',
        author: 'Buddha',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['temperance-1', 'temperance-2'],
        virtueGrants: { temperance: 2, wisdom: 1 }
      },
      {
        id: 'temperance-4',
        title: 'Desire Management',
        subtitle: 'Understanding and directing our desires',
        teaching: 'Temperance involves understanding our desires and learning to direct them toward what is truly good. It requires distinguishing between natural desires that promote flourishing and excessive desires that lead to harm.',
        question: 'What desires do you need to better understand and manage?',
        practice: 'Reflect on your desires. Which ones promote your flourishing? Which ones might be excessive or harmful? Create a plan to manage them wisely.',
        reading: 'Epicurus on desire and pleasure',
        quote: 'The greatest wealth is to live content with little.',
        author: 'Plato',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['temperance-2', 'temperance-3'],
        virtueGrants: { temperance: 2 }
      },
      {
        id: 'temperance-5',
        title: 'Emotional Balance',
        subtitle: 'Managing emotions with wisdom',
        teaching: 'Emotional balance involves experiencing emotions fully while maintaining control over our responses. It means neither suppressing emotions nor being overwhelmed by them, but finding the middle way.',
        question: 'How do you currently manage your emotions? How could you achieve better balance?',
        practice: 'Practice emotional awareness. When you feel a strong emotion, pause to observe it without immediately acting on it. Choose your response wisely.',
        reading: 'Stoic writings on emotional mastery',
        quote: 'The mind is everything. What you think you become.',
        author: 'Buddha',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['temperance-3', 'temperance-4'],
        virtueGrants: { temperance: 2, wisdom: 1 }
      },
      {
        id: 'temperance-6',
        title: 'Physical Temperance',
        subtitle: 'Balance in physical habits and health',
        teaching: 'Physical temperance involves finding balance in eating, drinking, exercise, rest, and other physical habits. It means treating our bodies with respect and care, neither indulging nor depriving ourselves.',
        question: 'How balanced are your physical habits? What could you improve?',
        practice: 'Audit your physical habits. Identify areas where you could be more temperate and create a plan for improvement.',
        reading: 'Ancient Greek writings on physical health and balance',
        quote: 'A sound mind in a sound body.',
        author: 'Juvenal',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['temperance-4', 'temperance-5'],
        virtueGrants: { temperance: 2 }
      },
      {
        id: 'temperance-7',
        title: 'Mental Discipline',
        subtitle: 'Training the mind for clarity and focus',
        teaching: 'Mental discipline involves training our minds to focus, think clearly, and resist distractions. It requires practice in concentration, mindfulness, and cognitive control.',
        question: 'How disciplined is your mind? What mental habits could you improve?',
        practice: 'Develop a mental discipline practice—meditation, focused reading, or concentration exercises. Start with 10 minutes daily.',
        reading: 'Buddhist and Stoic writings on mental discipline',
        quote: 'The mind is like water. When it\'s turbulent, it\'s difficult to see. When it\'s calm, everything becomes clear.',
        author: 'Traditional',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['temperance-5', 'temperance-6'],
        virtueGrants: { temperance: 2, wisdom: 1 }
      },
      {
        id: 'temperance-8',
        title: 'Social Temperance',
        subtitle: 'Balance in relationships and social life',
        teaching: 'Social temperance involves finding balance in our relationships and social interactions. It means being neither too withdrawn nor too dependent on others, maintaining healthy boundaries and connections.',
        question: 'How balanced are your social relationships? What could you improve?',
        practice: 'Reflect on your social relationships. Are they balanced and healthy? Identify areas for improvement and take action.',
        reading: 'Aristotle\'s "Nicomachean Ethics" - On Friendship and Social Life',
        quote: 'Friendship is a single soul dwelling in two bodies.',
        author: 'Aristotle',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['temperance-6', 'temperance-7'],
        virtueGrants: { temperance: 2, justice: 1 }
      },
      {
        id: 'temperance-9',
        title: 'Work-Life Balance',
        subtitle: 'Harmony between work and other aspects of life',
        teaching: 'Work-life balance involves finding harmony between our work and other important aspects of life—family, health, leisure, personal growth. It requires setting boundaries and prioritizing what truly matters.',
        question: 'How balanced is your work-life integration? What could you improve?',
        practice: 'Audit your time allocation. Are you giving appropriate attention to all important areas of your life? Create a plan for better balance.',
        reading: 'Ancient wisdom on work, leisure, and the good life',
        quote: 'Work is not man\'s punishment. It is his reward and his strength and his pleasure.',
        author: 'George Sand',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['temperance-7', 'temperance-8'],
        virtueGrants: { temperance: 2, wisdom: 1 }
      },
      {
        id: 'temperance-10',
        title: 'Spiritual Temperance',
        subtitle: 'Balance in spiritual and religious practices',
        teaching: 'Spiritual temperance involves finding balance in our spiritual and religious practices. It means avoiding both spiritual excess and spiritual neglect, maintaining a healthy relationship with the transcendent.',
        question: 'How balanced are your spiritual practices? What could you improve?',
        practice: 'Reflect on your spiritual life. Are your practices balanced and healthy? Identify areas for improvement.',
        reading: 'Ancient writings on spiritual balance and moderation',
        quote: 'Religion is not a department of life; it is life itself.',
        author: 'Traditional',
        completed: false,
        difficulty: 'advanced',
        estimatedTime: 20,
        prerequisites: ['temperance-8', 'temperance-9'],
        virtueGrants: { temperance: 2, wisdom: 1 }
      },
      {
        id: 'temperance-11',
        title: 'Material Temperance',
        subtitle: 'Balance in material possessions and consumption',
        teaching: 'Material temperance involves finding balance in our relationship with material possessions and consumption. It means neither being attached to possessions nor neglecting our material needs, using resources wisely.',
        question: 'How balanced is your relationship with material possessions? What could you improve?',
        practice: 'Audit your material possessions and consumption habits. Identify areas where you could be more temperate and create a plan for improvement.',
        reading: 'Ancient writings on wealth, poverty, and material balance',
        quote: 'Wealth consists not in having great possessions, but in having few wants.',
        author: 'Epictetus',
        completed: false,
        difficulty: 'intermediate',
        estimatedTime: 20,
        prerequisites: ['temperance-9', 'temperance-10'],
        virtueGrants: { temperance: 2, wisdom: 1 }
      },
      {
        id: 'temperance-12',
        title: 'The Temperate Life',
        subtitle: 'Living with balance and harmony',
        teaching: 'The temperate life involves consistently choosing balance and harmony in all aspects of life. It becomes a way of being—a commitment to moderation, self-control, and inner peace in everything we do.',
        question: 'How can you live more temperately in your daily life?',
        practice: 'For one week, consciously practice temperance in every significant choice. Choose balance over extremes.',
        reading: 'Aristotle\'s "Nicomachean Ethics" - On the Temperate Life',
        quote: 'Temperance is the noblest gift of the gods.',
        author: 'Euripides',
        completed: false,
        difficulty: 'advanced',
        estimatedTime: 25,
        prerequisites: ['temperance-11'],
        virtueGrants: { temperance: 3, wisdom: 1 }
      }
    ],
    capstoneProject: {
      title: 'Temperate Life Design Project',
      description: 'Design and implement a comprehensive plan for living a temperate life, integrating all aspects of balance and moderation.',
      requirements: [
        'Create a comprehensive life balance plan',
        'Implement the plan over 4-6 weeks',
        'Track your progress and adjustments',
        'Document the impact on your well-being',
        'Reflect on lessons learned and ongoing practices'
      ],
      estimatedTime: 300
    }
  }
];

export const getVirtueModule = (id: string): VirtueModule | undefined => {
  return ACADEMY_CURRICULUM.find(module => module.id === id);
};

export const getAllVirtueModules = (): VirtueModule[] => {
  return ACADEMY_CURRICULUM;
};

export const getLessonById = (moduleId: string, lessonId: string): AcademyLesson | undefined => {
  const module = getVirtueModule(moduleId);
  return module?.lessons.find(lesson => lesson.id === lessonId);
}; 
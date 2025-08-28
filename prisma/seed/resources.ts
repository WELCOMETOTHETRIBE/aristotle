// prisma/seed/resources.ts
export const RESOURCES = [
  { id:"meditations_capsule_intro", title:"Meditations — What is in my control?",
    thinker:"Marcus Aurelius", era:"Classical", type:"capsule", estMinutes:3, level:"Beginner",
    keyIdeas:["Control vs not control","Inner citadel","Present duty"],
    microPractices:["List 3 controllables today","Release 1 uncontrollable"], 
    reflections:["What duty lies nearest?"], audioUrl:null },
  { id:"nicomachean_ethics_capsule_mean", title:"Nicomachean Ethics — Virtue as the Mean",
    thinker:"Aristotle", era:"Classical", type:"capsule", estMinutes:3, level:"Beginner",
    keyIdeas:["Habit builds character","Mean between extremes"],
    microPractices:["Choose one temperance act today"], 
    reflections:["Where did I choose the mean today?"], audioUrl:null },
  { id:"tao_soft_power", title:"Tao Te Ching — Soft Power",
    thinker:"Laozi", era:"Classical", type:"capsule", estMinutes:3, level:"Beginner",
    keyIdeas:["Non-forcing","Water's way"], 
    microPractices:["Soften one effort today"], 
    reflections:["Where can I do less but better?"], audioUrl:null },
]; 
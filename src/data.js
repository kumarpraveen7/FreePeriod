// All demo content lives here. Edit this file to change the story you tell on stage.

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const HOURS = [9, 10, 11, 12, 13, 14, 15, 16];

// 0 = Monday. Fixed to Tuesday for the demo.
export const TODAY = 1;

// Your real Autumn timetable (s/e = start/end hour, mins = actual contact minutes)
export const CLASSES = [
  { d: 1, s: 10, e: 11, mins: 50, short: 'Data Storytelling' },
  { d: 1, s: 14, e: 16, mins: 110, short: 'Language Models' },
  { d: 3, s: 9, e: 11, mins: 110, short: 'Data Wrangling' },
  { d: 4, s: 10, e: 12, mins: 110, short: 'Data & Society' },
  { d: 4, s: 12, e: 14, mins: 110, short: 'Data Storytelling' },
];

export const TYPES = {
  learn: { label: 'Learn', join: 'Join session', post: 'Learn a skill', credit: 'Costs 1 credit', blurb: 'Book 20 minutes with a student who knows what you need.', example: '20 minutes on pandas groupby' },
  teach: { label: 'Teach', join: 'Offer to help', post: 'Offer help', credit: 'Earns 1 credit', blurb: 'Help someone stuck on something you know, and earn a credit.', example: 'Stuck on SQL joins for a group project' },
  swap: { label: 'Swap', join: 'Accept swap', post: 'Swap skills', credit: 'No credits', blurb: 'Trade skills straight across with someone from another course.', example: 'Figma prototyping for SQL basics' },
  team: { label: 'Team', join: 'Ask to join the team', post: 'Find a team', credit: 'No credits', blurb: 'Find the missing skill for a project, startup or hackathon team.', example: 'Two engineers need a business analyst' },
  event: { label: 'Group plan', join: 'Join the group', post: 'Plan an outing', credit: 'No credits', blurb: 'Go to meetups and talks together, so networking is less daunting.', example: 'Tech meetup in the city, Thursday evening' },
};

// learn = you learn (costs 1 credit), teach = you help (earns 1 credit)
// rating/reviews = the helper's average from past learners. stars = the rating the learner gives you after a teach session.
export const REQUESTS = [
  { id: 'r1', type: 'learn', who: 'Aoife', course: 'MSc Computer Science', title: '20 minutes on pandas groupby and merges', day: 1, start: 11, end: 12, place: 'James Joyce Library, ground floor', tags: ['Python', 'pandas'], why: 'You want to learn Python, and you’re both free 11:00 to 12:00.', out: 'Python (pandas)', rating: 4.9, reviews: 14 },
  { id: 'r4', type: 'swap', who: 'Liam', course: 'BA English', title: 'CV and cover letter feedback in exchange for Excel help', day: 1, start: 11, end: 12, place: 'Newman Building café', tags: ['CV writing', 'Excel'], why: 'You know Excel, and his CV feedback helps your job search.', out: 'CV writing', rating: 4.6, reviews: 8 },
  { id: 'r2', type: 'swap', who: 'Mei', course: 'BSc Product Design', title: 'I’ll teach Figma prototyping if you help me with SQL', day: 1, start: 12, end: 13, place: 'Newman Building café', tags: ['UX design', 'SQL'], why: 'She wants SQL, which you offer, and teaches UX design, which you want.', out: 'UX design (Figma)', rating: 4.8, reviews: 11 },
  { id: 'r3', type: 'teach', who: 'Cian', course: 'BComm, 2nd year', title: 'Stuck on SQL joins for a group project', day: 1, start: 13, end: 14, place: 'Quinn School atrium', tags: ['SQL'], why: 'You listed SQL as a skill, and your gap runs until 14:00.', out: 'SQL joins', note: '“Finally understand LEFT JOIN. Thank you!”', stars: 5 },
  { id: 'r11', type: 'swap', who: 'Ella', course: 'BSc Economics', title: 'My Tableau dashboards for your Excel modelling tips', day: 1, start: 13, end: 14, place: 'James Joyce Library, group room', tags: ['Data visualisation', 'Excel'], why: 'You know Excel, and data visualisation is a fast-growing skill.', out: 'Data visualisation (Tableau)', rating: 4.7, reviews: 6 },
  { id: 'r5', type: 'team', who: 'Sarah', course: 'BE Engineering', title: 'Two engineers with a climate-tech idea need a business analyst', day: 3, start: 11, end: 12, place: 'O’Brien Centre for Science', tags: ['Business analysis'], spots: '1 of 3 spots left', why: 'They need business analysis, one of your skills. Three disciplines, one team.', out: 'Climate-tech venture team' },
  { id: 'r10', type: 'learn', who: 'Kofi', course: 'MSc Cybersecurity', title: 'Cybersecurity basics in 20 minutes: from passwords to phishing', day: 3, start: 12, end: 13, place: 'O’Brien Centre for Science', tags: ['Cybersecurity'], why: 'Cybersecurity is one of the fastest-growing skills, and you’re both free at 12:00.', out: 'Cybersecurity basics', rating: 4.5, reviews: 9 },
  { id: 'r6', type: 'teach', who: 'Yusuf', course: 'MSc Finance', title: 'Practise a 5-minute pitch with me before an interview', day: 3, start: 12, end: 13, place: 'Student Centre', tags: ['Presenting'], why: 'You listed presenting, and you’re both free Thursday at 12:00.', out: 'Interview pitch coaching', note: '“Much calmer going into my interview now.”', stars: 4 },
  { id: 'r9', type: 'event', who: 'Rohan', course: 'MSc Data Analytics', title: 'Heading to a tech meetup in the city Thursday evening. Come with us?', day: 3, start: 18, end: 20, place: 'Meet at the UCD bus stop, 17:30', tags: ['Networking'], spots: '2 of 5 spots left', why: 'Networking is easier when you walk in with people you know.', out: 'Dublin tech meetup' },
  { id: 'r12', type: 'event', who: 'Grace', course: 'MSc Marketing', title: 'Mock interview circle: four of us take turns asking real interview questions', day: 2, start: 17, end: 18, place: 'Student Centre, meeting room 2', tags: ['Interviewing', 'Presenting'], spots: '1 of 4 spots left', why: 'Practising interviews with peers from other fields is low-pressure and fast.', out: 'Mock interview practice' },
  { id: 'r7', type: 'learn', who: 'Priya', course: 'PhD Statistics', title: 'Intro to machine learning with scikit-learn', day: 4, start: 14, end: 15, place: 'Science Centre East', tags: ['Machine learning', 'Python'], why: 'You want to learn machine learning, and she’s free Friday afternoon.', out: 'Machine learning basics', rating: 4.9, reviews: 21 },
  { id: 'r13', type: 'team', who: 'Tom', course: 'BSc Computer Science', title: 'Building an AI study planner for the next hackathon. Need a designer and a business person', day: 4, start: 15, end: 16, place: 'James Joyce Library', tags: ['UX design', 'Business analysis'], spots: '2 of 4 spots left', why: 'You bring business analysis and want to learn UX design.', out: 'AI study planner team' },
  { id: 'r8', type: 'learn', who: 'Niamh', course: 'MSc Digital Marketing', title: 'How I use AI tools to research and write faster', day: 0, start: 11, end: 12, place: 'James Joyce Library', tags: ['AI tools'], why: 'AI tools are on your wish list, and she’s free Monday at 11:00.', out: 'AI tools for research', rating: 4.7, reviews: 12 },
];

export const PLACES = ['James Joyce Library', 'Newman Building', 'Quinn School', 'O’Brien Centre for Science', 'Student Centre', 'Online call'];

// Illustrative data for the UCD Careers view (a 1,000-student pilot). Replace with real numbers if you collect any.
export const INSIGHTS = [
  { skill: 'AI tools', want: 340, offer: 80 },
  { skill: 'Python', want: 290, offer: 150 },
  { skill: 'Data visualisation', want: 220, offer: 110 },
  { skill: 'Public speaking', want: 190, offer: 60 },
  { skill: 'UX design', want: 140, offer: 50 },
  { skill: 'Cybersecurity', want: 120, offer: 30 },
  { skill: 'SQL', want: 120, offer: 140 },
];

// Students free on campus per day and hour (illustrative). Rows = Mon..Fri, columns = 9:00..16:00
export const HEAT = [
  [120, 180, 260, 300, 280, 220, 160, 110],
  [150, 240, 380, 420, 390, 300, 210, 140],
  [130, 200, 300, 340, 310, 250, 170, 120],
  [160, 250, 370, 410, 360, 290, 200, 130],
  [90, 140, 220, 260, 230, 170, 110, 70],
];

// Words students type, mapped to skill tags. Powers the smart match search.
export const SYNONYMS = {
  pandas: ['python', 'pandas'], python: ['python'], numpy: ['python'], code: ['python'], coding: ['python'],
  ml: ['machine learning'], machine: ['machine learning'], scikit: ['machine learning'], sklearn: ['machine learning'], model: ['machine learning'],
  ai: ['ai tools'], chatgpt: ['ai tools'], claude: ['ai tools'], prompt: ['ai tools'], prompting: ['ai tools'],
  cv: ['cv writing'], resume: ['cv writing'], cover: ['cv writing'],
  interview: ['presenting', 'interviewing'], interviews: ['presenting', 'interviewing'], pitch: ['presenting'], presentation: ['presenting'], presenting: ['presenting'], speaking: ['presenting'],
  sql: ['sql'], join: ['sql'], joins: ['sql'], database: ['sql'], query: ['sql'],
  figma: ['ux design'], design: ['ux design'], ux: ['ux design'], prototype: ['ux design'], designer: ['ux design'],
  excel: ['excel'], spreadsheet: ['excel'], spreadsheets: ['excel'],
  tableau: ['data visualisation'], chart: ['data visualisation'], charts: ['data visualisation'], dashboard: ['data visualisation'], visualisation: ['data visualisation'], visualization: ['data visualisation'],
  cyber: ['cybersecurity'], security: ['cybersecurity'], phishing: ['cybersecurity'], cybersecurity: ['cybersecurity'],
  startup: ['business analysis'], business: ['business analysis'], analyst: ['business analysis'], team: ['business analysis', 'ux design'], hackathon: ['business analysis', 'ux design'],
  networking: ['networking'], meetup: ['networking'], network: ['networking'],
};

export const PROFILE = { course: 'MSc Information Systems, UCD' };

export function initialState() {
  return {
    credits: 2,
    held: 0,
    connections: 4,
    filter: 'all',
    classes: CLASSES,
    free: ['1-11', '1-12', '1-13', '3-11', '3-12', '4-14', '4-15'],
    have: ['SQL', 'Excel', 'Business analysis', 'Presenting'],
    want: ['Python', 'Machine learning', 'UX design', 'AI tools'],
    joined: {}, // requestId -> 'joined' | 'done'
    ratings: {}, // requestId -> { stars, comment } you gave after a session
    myPosts: [],
    passport: [
      { kind: 'taught', skill: 'Excel pivot tables', with: 'Taught Tomás, BA Economics', date: '20 Oct', note: '“Explained it better than my lecture notes.”', stars: 5 },
    ],
  };
}

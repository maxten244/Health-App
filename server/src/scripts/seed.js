import 'dotenv/config';
import mongoose from 'mongoose';
import { Resource } from '../models/Resource.js';
import { CrisisContact } from '../models/CrisisContact.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mental-health-checkin';

const crisisContacts = [
  { name: 'National Suicide Prevention Lifeline', phone: '988', description: '24/7 crisis support', availability: '24/7', order: 1 },
  { name: 'Crisis Text Line', phone: 'Text HOME to 741741', description: 'Free 24/7 support', availability: '24/7', order: 2 },
  { name: 'SAMHSA National Helpline', phone: '1-800-662-4357', description: 'Treatment referral and information', availability: '24/7', order: 3 },
];

const resources = [
  { name: 'National Suicide Prevention Lifeline', type: 'hotline', contactInfo: '988', description: '24/7 free and confidential support', hours: '24/7', cost: 'free', availability: '24/7', languages: ['English', 'Spanish'], isCrisis: true },
  { name: 'Crisis Text Line', type: 'hotline', contactInfo: 'Text HOME to 741741', description: 'Free 24/7 crisis support via text', hours: '24/7', cost: 'free', availability: '24/7', languages: ['English'], website: 'https://www.crisistextline.org', isCrisis: true },
  { name: 'SAMHSA National Helpline', type: 'hotline', contactInfo: '1-800-662-4357', description: 'Treatment referral and information', hours: '24/7', cost: 'free', availability: '24/7', languages: ['English', 'Spanish'], isCrisis: true },
  { name: 'Campus Counseling Center', type: 'campus', contactInfo: '(555) 123-4567', description: 'On-campus mental health services', hours: 'Mon-Fri 9am-5pm', cost: 'low', availability: 'weekdays', languages: ['English'], location: 'Student Union Bldg 2', isCrisis: false },
  { name: 'Student Health Mental Health', type: 'campus', contactInfo: '(555) 123-4568', description: 'Psychiatric and therapy referrals', hours: 'Mon-Fri 8am-4pm', cost: 'low', availability: 'weekdays', languages: ['English', 'Spanish'], isCrisis: false },
  { name: 'Headspace', type: 'app', description: 'Meditation and mindfulness app', cost: 'sliding', availability: '24/7', languages: ['English'], website: 'https://www.headspace.com', isCrisis: false },
  { name: 'Calm', type: 'app', description: 'Sleep and meditation app', cost: 'paid', availability: '24/7', languages: ['English'], website: 'https://www.calm.com', isCrisis: false },
  { name: 'BetterHelp', type: 'therapy', description: 'Online therapy platform', cost: 'paid', availability: 'varies', languages: ['English'], website: 'https://www.betterhelp.com', isCrisis: false },
  { name: 'Talkspace', type: 'therapy', description: 'Online therapy and psychiatry', cost: 'paid', availability: 'varies', languages: ['English'], website: 'https://www.talkspace.com', isCrisis: false },
  { name: 'NAMI Support Group - Local', type: 'support_group', contactInfo: '(555) 234-5678', description: 'Peer-led support group', hours: 'Tue 7pm', cost: 'free', availability: 'weekdays', languages: ['English'], location: 'Community Center', isCrisis: false },
  { name: 'Depression and Bipolar Support Alliance', type: 'support_group', description: 'Peer support for mood disorders', cost: 'free', availability: 'varies', languages: ['English'], website: 'https://www.dbsalliance.org', isCrisis: false },
  { name: 'Anxiety and Depression Association', type: 'support_group', description: 'Resources and support for anxiety and depression', cost: 'free', availability: 'varies', languages: ['English'], website: 'https://adaa.org', isCrisis: false },
  { name: 'Local Community Mental Health', type: 'local', contactInfo: '(555) 345-6789', description: 'Sliding-scale therapy and case management', hours: 'Mon-Fri 8am-6pm', cost: 'sliding', availability: 'weekdays', languages: ['English', 'Spanish'], location: '123 Main St', isCrisis: false },
  { name: 'YMCA Counseling', type: 'local', contactInfo: '(555) 345-6790', description: 'Low-cost counseling for youth and families', hours: 'Mon-Sat', cost: 'low', availability: 'varies', languages: ['English'], isCrisis: false },
  { name: '7 Cups', type: 'app', description: 'Free emotional support and counseling', cost: 'free', availability: '24/7', languages: ['English', 'Spanish'], website: 'https://www.7cups.com', isCrisis: false },
  { name: 'Woebot', type: 'app', description: 'AI-based mental health chatbot', cost: 'free', availability: '24/7', languages: ['English'], website: 'https://woebothealth.com', isCrisis: false },
  { name: 'Sanvello', type: 'app', description: 'Anxiety and depression self-care app', cost: 'sliding', availability: '24/7', languages: ['English'], website: 'https://www.sanvello.com', isCrisis: false },
  { name: 'Mindfulness Coach', type: 'app', description: 'Free mindfulness and PTSD support', cost: 'free', availability: '24/7', languages: ['English'], website: 'https://mobile.va.gov/app/mindfulness-coach', isCrisis: false },
  { name: 'Campus Peer Support Line', type: 'campus', contactInfo: '(555) 123-4570', description: 'Student-run listening line', hours: 'Mon-Thu 6pm-10pm', cost: 'free', availability: 'weekdays', languages: ['English'], isCrisis: false },
  { name: 'LGBTQ+ Campus Resource Center', type: 'campus', contactInfo: '(555) 123-4571', description: 'Support and resources for LGBTQ+ students', hours: 'Mon-Fri 10am-4pm', cost: 'free', availability: 'weekdays', languages: ['English'], isCrisis: false },
  { name: 'Veterans Crisis Line', type: 'hotline', contactInfo: '988, press 1', description: '24/7 support for veterans', hours: '24/7', cost: 'free', availability: '24/7', languages: ['English'], isCrisis: true },
  { name: 'Trevor Project', type: 'hotline', contactInfo: '1-866-488-7386', description: 'Crisis support for LGBTQ+ youth', hours: '24/7', cost: 'free', availability: '24/7', languages: ['English'], website: 'https://www.thetrevorproject.org', isCrisis: true },
  { name: 'National Domestic Violence Hotline', type: 'hotline', contactInfo: '1-800-799-7233', description: '24/7 support for domestic violence', hours: '24/7', cost: 'free', availability: '24/7', languages: ['English', 'Spanish'], isCrisis: true },
  { name: 'National Eating Disorders Association', type: 'hotline', contactInfo: '1-800-931-2237', description: 'Support for eating disorders', hours: 'Mon-Thu 11am-9pm ET', cost: 'free', availability: 'business', languages: ['English'], isCrisis: false },
  { name: 'International Association for Suicide Prevention', type: 'other', description: 'Global crisis resources by country', cost: 'free', availability: '24/7', languages: ['Multiple'], website: 'https://www.iasp.info/resources/Crisis_Centres/', isCrisis: false },
  { name: 'Psychology Today Therapist Finder', type: 'therapy', description: 'Find local therapists by insurance and specialty', cost: 'unknown', availability: 'varies', languages: ['English'], website: 'https://www.psychologytoday.com', isCrisis: false },
  { name: 'Open Path Collective', type: 'therapy', description: 'Sliding-scale therapy network', cost: 'sliding', availability: 'varies', languages: ['English'], website: 'https://openpathcollective.org', isCrisis: false },
  { name: 'Recovery International', type: 'support_group', description: 'Peer support for mental health recovery', cost: 'free', availability: 'varies', languages: ['English'], website: 'https://www.recoveryinternational.org', isCrisis: false },
  { name: 'Smart Recovery', type: 'support_group', description: 'Science-based addiction recovery support', cost: 'free', availability: 'varies', languages: ['English'], website: 'https://www.smartrecovery.org', isCrisis: false },
  { name: 'AA (Alcoholics Anonymous)', type: 'support_group', description: 'Peer support for alcohol recovery', cost: 'free', availability: 'varies', languages: ['English', 'Spanish'], website: 'https://www.aa.org', isCrisis: false },
  { name: 'NA (Narcotics Anonymous)', type: 'support_group', description: 'Peer support for substance recovery', cost: 'free', availability: 'varies', languages: ['English'], website: 'https://www.na.org', isCrisis: false },
  { name: 'Mental Health America', type: 'other', description: 'Resources and screening tools', cost: 'free', availability: '24/7', languages: ['English'], website: 'https://www.mhanational.org', isCrisis: false },
  { name: 'Active Minds', type: 'campus', description: 'Student mental health advocacy', cost: 'free', availability: 'varies', languages: ['English'], website: 'https://www.activeminds.org', isCrisis: false },
  { name: 'Jed Foundation', type: 'other', description: 'Emotional health and suicide prevention for teens and young adults', cost: 'free', availability: '24/7', languages: ['English'], website: 'https://jedfoundation.org', isCrisis: false },
  { name: 'Boys Town National Hotline', type: 'hotline', contactInfo: '1-800-448-3000', description: '24/7 support for youth and parents', hours: '24/7', cost: 'free', availability: '24/7', languages: ['English'], isCrisis: true },
  { name: 'National Alliance on Mental Illness (NAMI)', type: 'other', contactInfo: '1-800-950-6264', description: 'Information and support', hours: 'Mon-Fri 10am-10pm ET', cost: 'free', availability: 'business', languages: ['English'], website: 'https://www.nami.org', isCrisis: false },
  { name: 'Substance Abuse and Mental Health Services Administration', type: 'other', description: 'Treatment locator and information', cost: 'free', availability: '24/7', languages: ['English'], website: 'https://www.samhsa.gov', isCrisis: false },
  { name: 'Wysa', type: 'app', description: 'AI mental wellness chatbot', cost: 'sliding', availability: '24/7', languages: ['English'], website: 'https://www.wysa.io', isCrisis: false },
  { name: 'Happify', type: 'app', description: 'Science-based activities for stress and anxiety', cost: 'sliding', availability: '24/7', languages: ['English'], website: 'https://www.happify.com', isCrisis: false },
  { name: 'Insight Timer', type: 'app', description: 'Free meditation and sleep library', cost: 'free', availability: '24/7', languages: ['Multiple'], website: 'https://insighttimer.com', isCrisis: false },
  { name: 'What's Up?', type: 'app', description: 'Coping strategies and grounding', cost: 'free', availability: '24/7', languages: ['English'], isCrisis: false },
  { name: 'Moodpath', type: 'app', description: 'Mood tracking and mental health screening', cost: 'free', availability: '24/7', languages: ['English'], website: 'https://moodpath.app', isCrisis: false },
  { name: 'Daylio', type: 'app', description: 'Mood and activity diary', cost: 'free', availability: '24/7', languages: ['Multiple'], website: 'https://daylio.net', isCrisis: false },
  { name: 'Campus Mindfulness Program', type: 'campus', contactInfo: 'mindfulness@campus.edu', description: 'Free drop-in meditation and workshops', hours: 'Wed 12pm', cost: 'free', availability: 'weekdays', languages: ['English'], isCrisis: false },
  { name: 'Student Disability Services', type: 'campus', contactInfo: '(555) 123-4580', description: 'Accommodations and support', hours: 'Mon-Fri 9am-5pm', cost: 'free', availability: 'weekdays', languages: ['English'], isCrisis: false },
  { name: 'Local Free Clinic Mental Health', type: 'local', contactInfo: '(555) 456-7890', description: 'Free brief therapy and referrals', hours: 'Tue, Thu 5pm-8pm', cost: 'free', availability: 'weekdays', languages: ['English', 'Spanish'], location: '456 Oak Ave', isCrisis: false },
  { name: 'Church Counseling Referral', type: 'local', contactInfo: '(555) 456-7891', description: 'Faith-based counseling referrals', hours: 'By appointment', cost: 'sliding', availability: 'varies', languages: ['English'], isCrisis: false },
  { name: 'Employee Assistance Program (EAP)', type: 'other', description: 'Workplace mental health and counseling referrals', cost: 'free', availability: 'business', languages: ['English'], isCrisis: false },
  { name: '211 Helpline', type: 'hotline', contactInfo: 'Dial 211', description: 'Local resources and referral', hours: '24/7 in many areas', cost: 'free', availability: '24/7', languages: ['English', 'Spanish'], isCrisis: false },
  { name: 'National Runaway Safeline', type: 'hotline', contactInfo: '1-800-786-2929', description: 'Support for runaway and homeless youth', hours: '24/7', cost: 'free', availability: '24/7', languages: ['English'], isCrisis: true },
  { name: 'Childhelp National Child Abuse Hotline', type: 'hotline', contactInfo: '1-800-422-4453', description: '24/7 child abuse support', hours: '24/7', cost: 'free', availability: '24/7', languages: ['English'], isCrisis: true },
  { name: 'National Sexual Assault Hotline', type: 'hotline', contactInfo: '1-800-656-4673', description: '24/7 support for sexual assault', hours: '24/7', cost: 'free', availability: '24/7', languages: ['English'], isCrisis: true },
  { name: 'Trans Lifeline', type: 'hotline', contactInfo: '1-877-565-8860', description: 'Peer support by and for trans people', hours: '24/7', cost: 'free', availability: '24/7', languages: ['English'], isCrisis: true },
  { name: 'Asian American Pacific Islander Crisis Line', type: 'hotline', contactInfo: '1-800-273-8255', description: 'Crisis support for AAPI community', hours: '24/7', cost: 'free', availability: '24/7', languages: ['English', 'Asian languages'], isCrisis: true },
  { name: 'BlackLine', type: 'hotline', contactInfo: '1-800-604-5841', description: 'Crisis support by and for Black community', hours: '24/7', cost: 'free', availability: '24/7', languages: ['English'], isCrisis: true },
  { name: 'National Council for Behavioral Health', type: 'other', description: 'Find local mental health providers', cost: 'unknown', availability: 'varies', languages: ['English'], website: 'https://www.thenationalcouncil.org', isCrisis: false },
  { name: 'GoodTherapy', type: 'therapy', description: 'Find therapists and explore therapy types', cost: 'unknown', availability: 'varies', languages: ['English'], website: 'https://www.goodtherapy.org', isCrisis: false },
  { name: 'Inclusive Therapists', type: 'therapy', description: 'Find culturally responsive and LGBTQ+ affirming therapists', cost: 'varies', availability: 'varies', languages: ['English'], website: 'https://www.inclusivetherapists.com', isCrisis: false },
  { name: 'Therapy for Black Girls', type: 'therapy', description: 'Directory and podcast for Black women', cost: 'varies', availability: 'varies', languages: ['English'], website: 'https://therapyforblackgirls.com', isCrisis: false },
  { name: 'Latinx Therapy', type: 'therapy', description: 'Directory of Latinx therapists', cost: 'varies', availability: 'varies', languages: ['English', 'Spanish'], website: 'https://www.latinxtherapy.com', isCrisis: false },
  { name: 'Asian Mental Health Collective', type: 'other', description: 'Resources and directory for AAPI mental health', cost: 'free', availability: '24/7', languages: ['English'], website: 'https://www.asianmhc.org', isCrisis: false },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await CrisisContact.deleteMany({});
  await CrisisContact.insertMany(crisisContacts);
  await Resource.deleteMany({});
  await Resource.insertMany(resources);
  console.log('Seeded crisis contacts and', resources.length, 'resources.');
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

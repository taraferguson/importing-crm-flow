export interface ImportType {
  id: string;
  name: string;
  description: string;
  icon: string;
  template: {
    mandatory: string[];
    optional: string[];
  };
}

export const importOptions: ImportType[] = [
  {
    id: 'events',
    name: 'Past Events',
    description: 'Import historical events to build your speaker timeline',
    icon: '📅',
    template: {
      mandatory: ['Event Name', 'Start Date', 'End Date'],
      optional: ['Description', 'Location', 'Capacity', 'Event Type', 'Industry', 'Organizer']
    }
  },
  {
    id: 'speakers',
    name: 'Speaker Profiles',
    description: 'Build comprehensive profiles from past speaking engagements',
    icon: '🎤',
    template: {
      mandatory: ['First Name', 'Last Name', 'Email'],
      optional: ['Bio', 'Company', 'Title', 'Expertise Areas', 'LinkedIn', 'Photo URL', 'Speaker Fee', 'Availability']
    }
  },
  {
    id: 'sessions',
    name: 'Sessions and Webinars',
    description: 'Track every session to understand speaker performance and topics',
    icon: '💼',
    template: {
      mandatory: ['Session Title', 'Event ID', 'Speaker ID', 'Date'],
      optional: ['Description', 'Duration', 'Room', 'Track', 'Audience Size', 'Feedback Score', 'Topics']
    }
  },
  {
    id: 'users',
    name: 'Team Members',
    description: 'CRM users who manage speaker relationships and events',
    icon: '👥',
    template: {
      mandatory: ['First Name', 'Last Name', 'Email'],
      optional: ['Role', 'Department', 'Phone', 'Access Level', 'Managed Events']
    }
  }
]; 
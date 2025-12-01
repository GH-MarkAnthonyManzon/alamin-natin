import type { Candidate } from './types';

export const candidates: Candidate[] = [
  {
    id: 'juan-dela-cruz',
    fullName: 'Juan Dela Cruz',
    positionSought: 'President',
    politicalAffiliation: 'Partido ng Pagbabago',
    imageUrlId: 'candidate-1',
    education: [
      {
        degree: 'Bachelor of Science in Political Science',
        institution: 'University of the Philippines Diliman',
        year: '1990',
        source: { label: 'UP Registrar', url: '#' },
      },
      {
        degree: 'Juris Doctor',
        institution: 'Ateneo de Manila University Law School',
        year: '1994',
        source: { label: 'Ateneo Law', url: '#' },
      },
    ],
    careerTimeline: [
      {
        date: '2016-2022',
        title: 'Senator of the Philippines',
        description: 'Served a full term as a senator, focusing on economic and justice reform bills.',
        isMilestone: true,
        source: { label: 'Senate.gov.ph', url: '#' },
      },
      {
        date: '2010-2016',
        title: 'Congressman, 1st District of Quezon City',
        description: 'Represented the 1st District of Quezon City for two terms.',
        isMilestone: true,
        source: { label: 'Congress.gov.ph', url: '#' },
      },
      {
        date: '2001-2010',
        title: 'Private Law Practice',
        description: 'Worked as a human rights lawyer.',
        isMilestone: false,
        source: { label: 'IBP Records', url: '#' },
      },
    ],
    platforms: [
      {
        title: 'Economic Revitalization',
        description: 'Pledges to create 5 million jobs through infrastructure projects and support for small businesses.',
        source: { label: 'Campaign Website', url: '#' },
      },
      {
        title: 'Anti-Corruption Drive',
        description: 'Proposes the creation of a special task force to investigate and prosecute corrupt officials.',
        source: { label: 'TV Interview', url: '#' },
      },
    ],
    controversies: [
      {
        title: 'Pork Barrel Fund Allegation',
        summary: 'In 2013, was named in a report related to the misuse of Priority Development Assistance Fund (PDAF).',
        outcome: 'The Ombudsman cleared him of all charges in 2015 due to lack of evidence.',
        source: { label: 'COA Report 2014', url: '#' },
      },
    ],
    promises: [
        {
            promise: 'Will pass a Freedom of Information Bill within the first 100 days.',
            relatedActions: [
                {
                    description: 'As a senator, co-authored and voted for the FOI Bill in 2018, which did not pass the lower house.',
                    source: { label: 'Senate Records 2018', url: '#' }
                }
            ]
        }
    ]
  },
  {
    id: 'maria-clara',
    fullName: 'Maria Clara',
    positionSought: 'Vice President',
    politicalAffiliation: 'Alyansa ng Mamamayan',
    imageUrlId: 'candidate-2',
    education: [
      {
        degree: 'Bachelor of Arts in Economics',
        institution: 'De La Salle University',
        year: '1995',
        source: { label: 'DLSU Records', url: '#' },
      },
    ],
    careerTimeline: [
      {
        date: '2019-Present',
        title: 'Mayor of Cebu City',
        description: 'Currently serving as the mayor of Cebu City, focusing on urban development and social services.',
        isMilestone: true,
        source: { label: 'Cebu City LGU', url: '#' },
      },
      {
        date: '2012-2018',
        title: 'Social Entrepreneur',
        description: 'Founded a successful non-profit organization focused on providing micro-loans to women in rural areas.',
        isMilestone: true,
        source: { label: 'SEC Registration', url: '#' },
      },
    ],
    platforms: [
      {
        title: 'Agricultural Modernization',
        description: 'Aims to improve farmer incomes by investing in modern farming technologies and direct market access.',
        source: { label: 'Agri Summit Speech', url: '#' },
      },
      {
        title: 'Healthcare for All',
        description: 'Wants to expand the national health insurance program to cover all Filipinos, including free check-ups.',
        source: { label: 'Campaign Rally', url: '#' },
      },
    ],
    controversies: [],
    promises: [
        {
            promise: 'Increase the budget for state universities and colleges (SUCs).',
            relatedActions: [
                {
                    description: 'As mayor, increased the city\'s scholarship fund for public university students by 50%.',
                    source: { label: 'Cebu City Ordinance No. 123', url: '#' }
                }
            ]
        }
    ]
  },
   {
    id: 'jose-rizal',
    fullName: 'Jose "Pepe" Rizal',
    positionSought: 'President',
    politicalAffiliation: 'Independent',
    imageUrlId: 'candidate-3',
    education: [
      {
        degree: 'Bachelor of Science in Business Administration',
        institution: 'University of Santo Tomas',
        year: '1985',
        source: { label: 'UST Registrar', url: '#' },
      },
    ],
    careerTimeline: [
      {
        date: '2010-2016',
        title: 'Governor of Laguna',
        description: 'Served one term as Governor, focusing on environmental protection and tourism.',
        isMilestone: true,
        source: { label: 'Laguna Provincial Records', url: '#' },
      },
      {
        date: '1990-2009',
        title: 'CEO, Rizal Development Corporation',
        description: 'Led a major real estate company with projects across Luzon.',
        isMilestone: true,
        source: { label: 'Company Website', url: '#' },
      },
    ],
    platforms: [
      {
        title: 'Digital Transformation',
        description: 'Advocates for a national digitalization program for government services to reduce red tape.',
        source: { label: 'Tech Summit 2023', url: '#' },
      },
    ],
    controversies: [
         {
        title: 'Land Use Controversy',
        summary: 'His development company faced a lawsuit in 2005 regarding the conversion of agricultural land for a commercial project.',
        outcome: 'The case was settled out of court, with the company providing relocation and livelihood programs for affected farmers.',
        source: { label: 'Supreme Court G.R. No. 12345', url: '#' },
      },
    ],
    promises: [
        {
            promise: 'Streamline business registration to 24 hours.',
            relatedActions: [
                {
                    description: 'As governor, implemented a "Business One-Stop Shop" that reduced permit processing from 2 weeks to 3 days.',
                    source: { label: 'Laguna Executive Order 2011-05', url: '#' }
                }
            ]
        }
    ]
  },
  {
    id: 'gabriela-silang',
    fullName: 'Gabriela Silang',
    positionSought: 'Senator',
    politicalAffiliation: 'Lakas ng Kababaihan',
    imageUrlId: 'candidate-4',
    education: [
      {
        degree: 'Bachelor of Science in Community Development',
        institution: 'University of the Philippines Los Baños',
        year: '2005',
        source: { label: 'UPLB Registrar', url: '#' },
      },
    ],
    careerTimeline: [
      {
        date: '2013-2022',
        title: 'Party-list Representative',
        description: 'Represented the women\'s sector, authoring bills on gender equality and rural development.',
        isMilestone: true,
        source: { label: 'Congress.gov.ph', url: '#' },
      },
      {
        date: '2006-2012',
        title: 'Community Organizer',
        description: 'Worked with various NGOs focusing on women\'s rights and empowerment.',
        isMilestone: false,
        source: { label: 'NGO Network Records', url: '#' },
      },
    ],
    platforms: [
      {
        title: 'Women\'s Economic Empowerment',
        description: 'Pushes for laws that provide greater economic opportunities for women, including access to capital and training.',
        source: { label: 'Campaign Website', url: '#' },
      },
    ],
    controversies: [],
    promises: [
      {
        promise: 'To establish a national hotline and support system for victims of domestic violence.',
        relatedActions: [
          {
            description: 'Filed a bill in 2019 to create a national domestic violence support system, which reached a second reading.',
            source: { label: 'House Bill No. 5432', url: '#' }
          }
        ]
      }
    ]
  },
  {
    id: 'andres-bonifacio',
    fullName: 'Andres "Andy" Bonifacio',
    positionSought: 'Vice President',
    politicalAffiliation: 'Katipunan Party',
    imageUrlId: 'candidate-5',
    education: [
      {
        degree: 'Bachelor of Arts in Public Administration',
        institution: 'National College of Public Administration and Governance',
        year: '2000',
        source: { label: 'NCPAG Records', url: '#' },
      },
    ],
    careerTimeline: [
      {
        date: '2016-2022',
        title: 'Congressman, Tondo District',
        description: 'Authored bills related to labor rights and urban poor housing.',
        isMilestone: true,
        source: { label: 'Congress Archives', url: '#' },
      },
      {
        date: '2005-2015',
        title: 'Labor Union President',
        description: 'Led a national union for factory workers, advocating for better wages and working conditions.',
        isMilestone: true,
        source: { label: 'DOLE Records', url: '#' },
      },
    ],
    platforms: [
      {
        title: 'Workers\' Rights and Welfare',
        description: 'Aims to end contractualization and increase the national minimum wage.',
        source: { label: 'Labor Day Speech', url: '#' },
      },
    ],
    controversies: [],
    promises: [
      {
        promise: 'To certify a bill on security of tenure as urgent within the first 100 days.',
        relatedActions: [
          {
            description: 'Consistently voted against measures seen as detrimental to labor interests during his time in Congress.',
            source: { label: 'Congressional Voting Record', url: '#' }
          }
        ]
      }
    ]
  },
  {
    id: 'apolinario-mabini',
    fullName: 'Apolinario "Pol" Mabini',
    positionSought: 'President',
    politicalAffiliation: 'Reporma Pilipinas',
    imageUrlId: 'candidate-6',
    education: [
      {
        degree: 'Bachelor of Laws',
        institution: 'University of Santo Tomas',
        year: '1988',
        source: { label: 'UST Law', url: '#' },
      },
      {
        degree: 'Master of Public Policy',
        institution: 'Harvard Kennedy School',
        year: '1992',
        source: { label: 'Harvard Records', url: '#' },
      },
    ],
    careerTimeline: [
      {
        date: '2013-2019',
        title: 'Secretary of Foreign Affairs',
        description: 'Served as the country\'s top diplomat, strengthening international relations.',
        isMilestone: true,
        source: { label: 'DFA Archives', url: '#' },
      },
      {
        date: '2001-2010',
        title: 'Legal Counsel',
        description: 'Worked as chief legal counsel for a multi-national technology firm.',
        isMilestone: false,
        source: { label: 'Company Profile', url: '#' },
      },
    ],
    platforms: [
      {
        title: 'Good Governance and Rule of Law',
        description: 'Advocates for judicial reform and strengthening of democratic institutions.',
        source: { label: 'IBP National Convention Speech', url: '#' },
      },
    ],
    controversies: [],
    promises: [
      {
        promise: 'To appoint a non-political, career professional to head the Department of Justice.',
        relatedActions: [
          {
            description: 'As DFA secretary, implemented a merit-based system for ambassadorial appointments.',
            source: { label: 'DFA Department Order', url: '#' }
          }
        ]
      }
    ]
  },
  {
    id: 'benhur-abalos',
    fullName: 'Benjamin "Benhur" Abalos Jr.',
    positionSought: 'Senator',
    politicalAffiliation: 'Unknown',
    imageUrlId: 'candidate-7',
    education: [],
    careerTimeline: [],
    platforms: [],
    controversies: [],
    promises: [],
  },
  {
    id: 'bam-aquino',
    fullName: 'Paolo Benigno "Bam" Aquino IV',
    positionSought: 'Senator',
    politicalAffiliation: 'Unknown',
    imageUrlId: 'candidate-8',
    education: [],
    careerTimeline: [],
    platforms: [],
    controversies: [],
    promises: [],
  },
  {
    id: 'abby-binay',
    fullName: 'Mar-len Abigail "Abby" Binay',
    positionSought: 'Senator',
    politicalAffiliation: 'Unknown',
    imageUrlId: 'candidate-9',
    education: [],
    careerTimeline: [],
    platforms: [],
    controversies: [],
    promises: [],
  },
  {
    id: 'pia-cayetano',
    fullName: 'Pia Cayetano',
    positionSought: 'Senator',
    politicalAffiliation: 'Unknown',
    imageUrlId: 'candidate-10',
    education: [],
    careerTimeline: [],
    platforms: [],
    controversies: [],
    promises: [],
  },
  {
    id: 'ronald-dela-rosa',
    fullName: 'Ronald "Bato" Dela Rosa',
    positionSought: 'Senator',
    politicalAffiliation: 'Unknown',
    imageUrlId: 'candidate-11',
    education: [],
    careerTimeline: [],
    platforms: [],
    controversies: [],
    promises: [],
  },
  {
    id: 'christopher-go',
    fullName: 'Christopher "Bong" Go',
    positionSought: 'Senator',
    politicalAffiliation: 'Unknown',
    imageUrlId: 'candidate-12',
    education: [],
    careerTimeline: [],
    platforms: [],
    controversies: [],
    promises: [],
  },
  {
    id: 'ping-lacson',
    fullName: 'Panfilo "Ping" Lacson',
    positionSought: 'Senator',
    politicalAffiliation: 'Unknown',
    imageUrlId: 'candidate-13',
    education: [],
    careerTimeline: [],
    platforms: [],
    controversies: [],
    promises: [],
  },
  {
    id: 'imee-marcos',
    fullName: 'Imee Marcos',
    positionSought: 'Senator',
    politicalAffiliation: 'Unknown',
    imageUrlId: 'candidate-14',
    education: [],
    careerTimeline: [],
    platforms: [],
    controversies: [],
    promises: [],
  },
  {
    id: 'manny-pacquiao',
    fullName: 'Emmanuel "Manny" Pacquiao',
    positionSought: 'Senator',
    politicalAffiliation: 'Unknown',
    imageUrlId: 'candidate-15',
    education: [],
    careerTimeline: [],
    platforms: [],
    controversies: [],
    promises: [],
  },
  {
    id: 'tito-sotto',
    fullName: 'Vicente "Tito" Sotto III',
    positionSought: 'Senator',
    politicalAffiliation: 'Unknown',
    imageUrlId: 'candidate-16',
    education: [],
    careerTimeline: [],
    platforms: [],
    controversies: [],
    promises: [],
  }
];

export const literacyTopics = [
  {
    id: 'role-comelec',
    title: 'What is the role of COMELEC?',
    content: 'The Commission on Elections (COMELEC) is the principal government agency tasked by the Constitution to enforce and administer all laws and regulations concerning the conduct of regular and special elections. Its primary role is to ensure free, orderly, honest, peaceful, and credible elections.',
  },
  {
    id: 'powers-executive',
    title: 'What are the powers of the President and Vice President?',
    content: 'The President is the head of state and government, and serves as the commander-in-chief of the Armed Forces. Key powers include executing laws, appointing officials, and conducting foreign policy. The Vice President\'s main role is to succeed the President in case of death, disability, or resignation. They may also be appointed to a cabinet position by the President.',
  },
  {
    id: 'how-elections-work',
    title: 'How do Philippine national elections work?',
    content: 'National elections are held every six years. Voters cast their ballots for President, Vice President, Senators, and local officials. The Philippines uses an automated election system, where votes are cast on ballots, fed into vote-counting machines, and electronically transmitted for canvassing.',
  },
  {
    id: 'read-records',
    title: 'How do I read a candidate\'s record critically?',
    content: 'When evaluating a candidate, look for consistency between their promises and past actions. Check the sources of information—are they from official government sites, reputable news organizations, or court records? Be aware of the difference between allegations and proven facts. A long track record in public service can provide more data points for evaluation.',
  },
];

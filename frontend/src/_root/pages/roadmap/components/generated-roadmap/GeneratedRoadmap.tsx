import RoadmapCard from "./RoadmapCard"
import axios from 'axios';
import { useState } from 'react';
const roadmapDetails = {
    /**
* Paste one or more documents here
*/

    "user_id": "663852ecd568222769540792",
    "resume_id": "663935f4c8f942beb66eaee4",
    "roadmap_name": "FullStack Roadmap PHP",
    "job_description": "About the job\n\nJob Description\nFull Stack PHP & ReactJS developer (Vietnam based)\n\nWe are looking for a team of Fullstack Developers to join us remotely from Vietnam. The main programming languages are PHP and ReactJS. Betting or financial services background is ideal.\n\nCompany overview \n \nOur company is a leading technology services provider with development centres in the UK and Vietnam. We specialize in delivering Betting & Gaming software solutions to global clients. \n \nWe offer business-to-business (B2B) technology solutions to the e-commerce, media, and entertainment sectors. We are proud to present our innovative B2B SaaS solutions that redefine the landscape of the sports betting industry. Our suite of powerful tools, including Esports, Sportsbook, and media is designed to empower operators and elevate their businesses to new heights. With a focus on enabling financial growth, optimising player acquisition and retention, and streamlining player life-cycle management, our state-of-the-art cloud-ready solution is the ultimate choice for forward- thinking operators. \n\nPosition overview \n\nWe are seeking a Fullstack focussed Backend developer to join our Sportsbook and Esports team. The core sportsbook product is a highly scalable backend engine that delivers markets and odds, accepts and results bets, and manages risk. You will be working in a team of Devs and QA’s that will operate as a unit within our agile system. \n\nResponsibilities:\n\nCreate, maintain and make improvements to our PHP applications. \nCreate, maintain and make improvements to our React JS applications. \nCreate, maintain and make improvements to our NodeJS Api's and serverless functions. \nIntegrate with third party APIs and other internal services. \nWrite clean, scalable, performant and self-documenting code. \nWrite appropriate unit/integration tests. \nCreation and maintenance of technical documentation where appropriate. \nPerform code reviews and provide mentoring for other team members, to uphold best practices and share knowledge across the team. \nTake product requirements and provide solutions, breakdown tasks and provide estimates. \nTroubleshoot and fix production issues.\nBuild reusable and responsive components for our desktop and mobile website. \nTranslate UI/UX mock ups into high quality and pixel perfect code. \nOptimise components for maximum performance across different browsers and devices.\n\nExperience and requirements \n\n3-5 Years Fullstack experiences focussing on PHP and ReactJS\nStrong spoken and written English \nFluent in Viatnamese \nExperience in gambling or betting is beneficial.\nExperience creating and maintaining Rest API's with Symfony or Laravel frameworks. Zend framework is also part of our stack. \nGood knowledge of HTTP status codes, JSON and error handling. \nStrong experience of object oriented programming and solid knowledge of design patterns and principles. \nStrong experience with a relational database like PostgreSQL/MySQL and NoSQL like MongoDB/ElasticSearch. \nExperience with services like Redis, RabbitMQ. \nExperience writing secure APIs with authentication, JWT's and general secure practices. \nExperience with web sockets. \nGit for Version Control. \nExperience working in an agile environment with tools like JIRA, Confluence and ceremonies like planning, retros, stand-ups etc. \nExperience of full stack development with ReactJS. \nExperience with Server-Side Rendering, (NextJS)\nExperience with ECMAScript 6, Typescript, React Hooks, Context API,\nRedux, RxJs, OOP design standards, functional components, and industry best-practices.\nExperience with the CSS pre-processor SCSS\nExperience creating responsive components.\nKnowledge of SEO best practices.\nWorking with Rest API's, JWT, GRPC, GraphQL, Websockets and video streams.\nExperience with Webpack.\nGood understanding of browser rendering behaviour and performance.",
    "roadmap": [
      [
        "level",
        "Beginner"
      ],
      [
        "list_of_roadmap",
        [
          [
            [
              "topic_name",
              "PHP Development"
            ],
            [
              "topic_description",
              "Learn the fundamentals of PHP, a server-side scripting language, including syntax, error handling, and object-oriented programming."
            ],
            [
              "resources",
              [
                "https://www.php.net/manual/en/getting-started.php",
                "https://www.udemy.com/course/php-for-complete-beginners-includes-msql-object-oriented/",
                "https://www.codecademy.com/learn/learn-php"
              ]
            ],
            [
              "knowledge_list",
              [
                "PHP syntax",
                "Error handling",
                "Object-oriented programming in PHP",
                "Working with Symfony or Laravel frameworks"
              ]
            ],
            [
              "is_done",
              false
            ]
          ],
          [
            [
              "topic_name",
              "ReactJS Development"
            ],
            [
              "topic_description",
              "Understand the core concepts of ReactJS, including components, state management, and lifecycle methods, along with modern features like hooks."
            ],
            [
              "resources",
              [
                "https://reactjs.org/tutorial/tutorial.html",
                "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
                "https://egghead.io/courses/the-beginner-s-guide-to-react"
              ]
            ],
            [
              "knowledge_list",
              [
                "ReactJS fundamentals",
                "State management",
                "Lifecycle methods",
                "Hooks",
                "Server-Side Rendering with NextJS",
                "Redux, RxJs"
              ]
            ],
            [
              "is_done",
              false
            ]
          ],
          [
            [
              "topic_name",
              "Database Management"
            ],
            [
              "topic_description",
              "Gain knowledge on relational databases like PostgreSQL/MySQL and NoSQL databases like MongoDB/ElasticSearch, including schema design and query optimization."
            ],
            [
              "resources",
              [
                "https://www.coursera.org/courses?query=postgresql",
                "https://www.mongodb.com/what-is-mongodb",
                "https://www.elastic.co/guide/index.html"
              ]
            ],
            [
              "knowledge_list",
              [
                "Database schema design",
                "Query optimization",
                "CRUD operations",
                "Working with PostgreSQL/MySQL",
                "NoSQL databases like MongoDB/ElasticSearch"
              ]
            ],
            [
              "is_done",
              false
            ]
          ],
          [
            [
              "topic_name",
              "API Development and Security"
            ],
            [
              "topic_description",
              "Learn to create secure RESTful APIs using NodeJS, focusing on authentication, JWTs, and secure practices."
            ],
            [
              "resources",
              [
                "https://nodejs.org/en/docs/guides/",
                "https://jwt.io/introduction/",
                "https://expressjs.com/en/advanced/best-practice-security.html"
              ]
            ],
            [
              "knowledge_list",
              [
                "REST API development",
                "Authentication and JWT",
                "Secure coding practices",
                "Error handling and HTTP status codes"
              ]
            ],
            [
              "is_done",
              false
            ]
          ],
          [
            [
              "topic_name",
              "Agile Methodologies"
            ],
            [
              "topic_description",
              "Understand the principles of agile software development, including working with tools like JIRA and Confluence, and participating in agile ceremonies."
            ],
            [
              "resources",
              [
                "https://www.atlassian.com/agile",
                "https://www.scrum.org/resources/what-is-scrum",
                "https://www.udemy.com/course/agile-crash-course/"
              ]
            ],
            [
              "knowledge_list",
              [
                "Agile principles",
                "Scrum framework",
                "Using JIRA and Confluence",
                "Participating in agile ceremonies"
              ]
            ],
            [
              "is_done",
              false
            ]
          ]
        ]
      ],
      [
        "summary",
        "Based on your resume, you're starting as a beginner in the field of Full Stack PHP & ReactJS development. Your roadmap includes learning PHP and ReactJS fundamentals, database management for both SQL and NoSQL databases, developing secure APIs, and understanding agile methodologies. You'll need to focus on practical applications of these technologies, such as creating and maintaining applications, integrating third-party APIs, and writing clean, scalable code. Resources provided will guide you through each topic, from beginner to advanced levels. To match the job description, you'll also need to familiarize yourself with specific frameworks like Symfony or Laravel for PHP, and NextJS for React. Additionally, gaining experience in betting or financial services could be beneficial. This roadmap is designed to equip you with the necessary skills and knowledge to progress towards your goal of becoming a Full Stack PHP & ReactJS developer."
      ],
      [
        "progress",
        0
      ]
    ],
    "created_at": {
      "$date": "2024-05-12T08:41:05.417Z"
    }

}


const GeneratedRoadmap = () => {
    const [roadmap, setRoadmap] = useState([]);
const userId = localStorage.getItem('userId') || '663852ecd568222769540792';
const resumeId = localStorage.getItem('resumeId');
// const roadmap_name = 'FullStack Roadmap PHP'

// const getRoadmap = async (roadmapName: string) => {
//     try {
//         const response = await axios.get(`http://localhost:8000/api/aceresume/resume/${userId}/${resumeId}/get_roadmap`,
//         {
//             params: {
//                 roadmap_name: roadmapName
//             }
//         });

//         console.log('Roadmap:', response.data);
//         setRoadmap(response.data);

//     }catch (error) {
//         console.error('Error getting roadmap:', error);
//         alert('Error getting roadmap');
//     }
// }

const getAllRoadmaps = async () => {
    try {
        const response = await axios.get(`http://localhost:8000/api/aceresume/resume/${userId}/get_all_roadmaps`);
        console.log('Roadmaps:', response.data);
    }catch (error) {
        console.error('Error getting roadmaps:', error);
        alert('Error getting roadmaps');
    }
}
    return (<>

    <div className="w-full bg-white h-full rounded-lg  flex flex-col items-center p-10">
        <RoadmapCard roadmap={roadmap} />
    </div>
    </>)
}
export default GeneratedRoadmap

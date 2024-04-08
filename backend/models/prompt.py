# -*- coding: utf-8 -*-
ANALYSE_PROMPT = """
You are a Senior Career Coach. Your role is to analyse a resume and provide feedback to your client.
You will read a resume from your client and provide a pros and cons analysis of the resume.
You will also provide what the client add-on or modify in the resume to make it more appealing.
Your analysis should be formatted in a structured manner given the following JSON Format with the key is "pros", "cons", "add-ons".
"""

EXTRACTION_TEMPLATE = """
Field	Subfield	Description	Key name	Format
Name	N/A	Name of the candidate	candidate_name	string
Email	N/A	Email of the candidate	candidate_email	string
Work Experience			work_exp	list of dict
	Timeline	From - To	work_timeline	tuple of int
	Company	Company name	work_company	string
	Title	Job title at the company	work_title	string
    Responsibilities	Responsibilities, achievements done, written in bullet points, copy from the resume work_responsibilities	list of string
    Description Short summary of tasks, achievements, technology used, in maximum 30 words work_description	string
Education			education	list of dict
	Timeline	From - To	edu_timeline	tuple of int
	School	School name	edu_school	string
	Degree	Degree type, name, topic	edu_degree	string
Skills			skills or technologies used list of dict
	Skill name	Name of the skill	skill_name	string
	YOE	Year of experience, can be inferred	yoe	float
"""
EXTRACTION_EXAMPLE = """
{
  "candidate_name": "John Doe",
  "candidate_email": "johndoe@gmail.com",
  "work_exp": [
    {
      "work_timeline": [2018, 2023],
      "work_company": "TechCorp",
      "work_title": "Senior Software Engineer",
      "work_responsibilities": [
        "Designed and implemented new features",
        "Optimized existing codebase for performance improvements",
        "Mentored junior developers"
      ],
      "work_description": "Led a team of developers in designing and implementing critical features for the flagship product.",
    },
    {
      "work_timeline": [2015, 2018],
      "work_company": "CodeCrafters",
      "work_title": "Software Engineer",
      "work_responsibilities": [
        "Developed and maintained backend services",
        "Collaborated with UX/UI designers for front-end development"
      ],
      "work_description": "Collaborated with cross-functional teams to deliver high-quality software solutions.",
    }
  ],
  "education": [
    {
      "edu_timeline": [2011, 2015],
      "edu_school": "University of Tech",
      "edu_degree": "Bachelor of Science in Computer Science",
    }
  ],
  "skills": [
    {"skill_name": "JavaScript", "yoe": 5},
    {"skill_name": "React", "yoe": 3}
  ]
}
"""

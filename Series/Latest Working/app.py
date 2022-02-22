# -*- coding: utf-8 -*-
# Author: Murtadha Marzouq
# Description: This is the Person Class File

import html
import json
import requests
from bs4 import BeautifulSoup
import re
import json
from pandasql import sqldf 
import pandas as pd

people = []


urls =  pd.read_csv('links_data_filtered.csv')['links'].dropna().tolist()

class Person :
    UNCC = {'Belk College of Business': {}, 'College of Arts & Architecture': {}, 'College of Computing & Informatics': {}, 'College of Education': {}, 'College of Health & Human Services': {}, 'College of Liberal Arts & Sciences': {}, 'Lee College of Engineering': {}, 'School of Data Science (SDS)':{}}
    UNCC['Belk College of Business'] = {'Business Info Systems/Operations': {}, 'Economics ': {}, 'Finance ': {}, 'Management ': {}, 'Marketing ': {}, 'Turner School of Accountancy':{}}
    UNCC['College of Arts & Architecture'] = {'Art & Art History': {}, 'Dance': {}, 'Music': {}, 'Performing Arts Services': {}, 'School of Architecture': {}, 'TheatreBrook Muller':{}}
    UNCC['College of Computing & Informatics'] = {'Bioinformatics and Genomics' : {}, 'Bioinformatics Research Center ': {}, 'Computer Science ': {}, 'Software & Information Systems':{}}
    UNCC['College of Education'] = {'Counseling': {}, 'Ctr For STEM Education': {}, 'Educational Leadership': {}, 'Middle Grades Secondary & K-12': {}, 'Reading & Elementary ED': {}, 'School & Community Partnerships': {}, 'Special Ed & Child Dev':{}}
    UNCC['College of Health & Human Services'] = {'Kinesiology': {}, 'Public Health Sciences': {}, 'School of Nursing': {}, 'School of Social Work':{}}
    UNCC['College of Liberal Arts & Sciences'] = {'Africana Studies': {}, 'Anthropology': {}, 'Biological Sciences': {}, 'Chemistry': {}, 'Communication Studies': {}, 'Criminal Justice and Criminology': {}, 'English': {}, 'Geography and Earth Sciences': {}, 'Global Studies': {}, 'History': {}, 'Languages and Culture Studies': {}, 'Mathematics and Statistics': {}, 'Philosophy': {}, 'Physics and Optical Science': {}, 'Political Science and Public Administration': {}, 'Psychological Science': {}, 'Religious Studies': {}, 'Sociology': {}, 'Writing, Rhetoric, and Digital Studies':{}}
    UNCC['Lee College of Engineering'] = {'Civil and Environmental Engr': {}, 'Electrical & Computer Engineering': {}, 'Engineering Tech & Constr Mgmt': {}, 'EPIC': {}, 'Mech Engineering & Engineering Sci': {}, 'Student Dev & Success': {}, 'Systems Engin & Engin Management':{}}
    UNCC['School of Data Science (SDS)'] = {}
    def __init__(self, link):
        self.name = " "
        self.department = " "
        self.academic_interests = " "
        self.college = " "
        self.bio = " "
        self.link = link
        
        # fetching the information from the website
        self.get_info()
    
    def __str__(self):
        try:
            return json.dumps(self.__dict__)
        except Exception as e:
            print(e)
    
    
    # @param: the department of the staff member
    # @return: the college of the staff member
    def get_college(self, department):
        
        for key in self.UNCC:
            for key2 in self.UNCC[key]:
                if department == key2:
                    return  department
        return " "
    
    
    def get_info(self):
        url = self.link
        # making a request to the website
        response = requests.get(url)
        # saving the log file
        soup = BeautifulSoup(response.text , 'html.parser')
        department = soup.find('div', class_='connection-groups').text.strip().split('\n')[0]
        academic_interests = soup.find('div', class_='connection-links columns-2')
        name = soup.find('div', class_='page-title').text.strip()
        bio = soup.find('div', class_='post-contents').text
        link = url
        
        # assigning the values to the class variables
        self.name = name
        self.department = department
        self.academic_interests = academic_interests.text.split('\n')
        self.college = self.get_college(department)
        self.link = link
        # CASTING THE BIO TO STRING
        self.bio = bio.replace('\n', ' ').replace('\u00a0', '').replace('\u201c', '')
         
        

def query_csv(csv_file, query):
    pysqldf = lambda q: sqldf(q, globals())
    output = pysqldf(query)
    return output



def visited_update(url): 
    # remove the url from the file
     
    for link in  pd.read_csv('links_data_filtered.csv')['links'].dropna().tolist():
        if link == url:
            #print(link)
            urls.pop(urls.index(link))
            
         
    
    return urls
    

def get_json():
    return json.dumps([person.__dict__ for person in people])


def get_all_links(links , limit):
    for i in range(limit):
        print(links[i])
        visited_update(links[i])
        person_added = Person(links[i]) 
        print(person_added)   
        people.append(person_added) 
    #removing the entries that are already added    
    export = pd.DataFrame(urls , columns = ['links'], index = None).to_csv('links_data_filtered.csv', index = None)
    


#I will do 50 at a time to avoid overloading UNCC Servers
staff_links = pd.read_csv('links_data_filtered.csv').drop_duplicates()['links'].dropna().tolist()

get_all_links(staff_links, 5)
print(get_json())



# Save the data to a json file
with open('staff_data.json', 'w') as f:
    f.write(get_json())

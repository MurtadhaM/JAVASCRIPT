#!/usr/bin/env python3.10
# -*- coding: utf-8 -*-
# Author: Murtadha Marzouq
# Description: This is the main file for the program that will be used to scrape the website and save the data in a json file or csv

import html
import json
import requests
from bs4 import BeautifulSoup
import re
import json
from pandasql import sqldf 
import pandas as pd

# FLAGS:

# Tor Setup
TOR_FLAG = False

visited_urls = open('Production/links.csv', 'r').read().split('\n')

def visited(url):

        with open('Production/visited', 'a') as file:
            file.write(url + '\n')


# TODO
# support sessions by checking for stored staff info and if they don't exist then get them from the website --Completed
# For each web request, save the outputed HTML file for future use and mining and to also reduce network traffic
# Tor connection option for the program to anonymize the traffic and avoid detection -- Completed
# setting up the session (visited urls )  -- Completed

# visited_urls = open('log/visited_urls', 'r').read().split('\n')


# a master array to store all the staff members
All_STAFF_INFOMATION = []

# first start tor service on port 9050 by running the command:
# tor SocksPort 9050
def get_tor_session():
    import requests
    if TOR_FLAG:
        
        print('enabling tor')
        # check if tor is running
        try:
            
            session = requests.session()
            
            # Tor uses the 9050 port as the default socks port
            session.proxies = {'http':  'socks5://127.0.0.1:9050',
                            'https': 'socks5://127.0.0.1:9050'}
            
            current_ip = session.request('GET', 'http://httpbin.org/ip').text
            print('tor session established with IP ' + current_ip.split('origin')[1])
            
            return session 
        except Exception as e:
            print(e)
            print('Error getting tor session')
            print('Please make sure tor is running or disable the TOR_FLAG')
            print('Exiting program')
            exit()   
        return session
    else:
        print('tor not enabled')
        return requests


departments = {'Belk College of Business': {}, 'College of Arts & Architecture': {}, 'College of Computing & Informatics': {}, 'College of Education': {}, 'College of Health & Human Services': {}, 'College of Liberal Arts & Sciences': {}, 'Lee College of Engineering': {}, 'School of Data Science (SDS)':{}}
# = ['Belk College of Business','College of Arts & Architecture','College of Computing & Informatics','College of Education','College of Health & Human Services','College of Liberal Arts & Sciences','Lee College of Engineering','School of Data Science (SDS)']
departments['Belk College of Business'] = {'Business Info Systems/Operations': {}, 'Economics ': {}, 'Finance ': {}, 'Management ': {}, 'Marketing ': {}, 'Turner School of Accountancy':{}}
departments['College of Arts & Architecture'] = {'Art & Art History': {}, 'Dance': {}, 'Music': {}, 'Performing Arts Services': {}, 'School of Architecture': {}, 'TheatreBrook Muller':{}}
departments['College of Computing & Informatics'] = {'Bioinformatics and Genomics' : {}, 'Bioinformatics Research Center ': {}, 'Computer Science ': {}, 'Software & Information Systems':{}}
departments['College of Education'] = {'Counseling': {}, 'Ctr For STEM Education': {}, 'Educational Leadership': {}, 'Middle Grades Secondary & K-12': {}, 'Reading & Elementary ED': {}, 'School & Community Partnerships': {}, 'Special Ed & Child Dev':{}}
departments['College of Health & Human Services'] = {'Kinesiology': {}, 'Public Health Sciences': {}, 'School of Nursing': {}, 'School of Social Work':{}}
departments['College of Liberal Arts & Sciences'] = {'Africana Studies': {}, 'Anthropology': {}, 'Biological Sciences': {}, 'Chemistry': {}, 'Communication Studies': {}, 'Criminal Justice and Criminology': {}, 'English': {}, 'Geography and Earth Sciences': {}, 'Global Studies': {}, 'History': {}, 'Languages and Culture Studies': {}, 'Mathematics and Statistics': {}, 'Philosophy': {}, 'Physics and Optical Science': {}, 'Political Science and Public Administration': {}, 'Psychological Science': {}, 'Religious Studies': {}, 'Sociology': {}, 'Writing, Rhetoric, and Digital Studies':{}}
departments['Lee College of Engineering'] = {'Civil and Environmental Engr': {}, 'Electrical & Computer Engineering': {}, 'Engineering Tech & Constr Mgmt': {}, 'EPIC': {}, 'Mech Engineering & Engineering Sci': {}, 'Student Dev & Success': {}, 'Systems Engin & Engin Management':{}}
departments['School of Data Science (SDS)'] = {}



def departments_fetch():
    print('Setting up links links')
    url = 'https://pages.charlotte.edu/connections/'
    response = requests.get(url)
    soup = BeautifulSoup(response.content , 'lxml')
    print('parsing elements to extract links')
    colleges = soup.find_all('div', {'id' : 'collapscat-2'})
    print(colleges)
    links = {
        
    }
    
    for value in departments:
        for tag in value.get('a'):   
            # print(value.find_all('a')[0].text)
            if 'group' in tag.get('href'):
                links[tag.text] = tag.get('href')
                # Appending the links to the dictionary
                for t in ['Belk College of Business', 'College of Arts & Architecture', 'College of Computing & Informatics', 'College of Education', 'College of Health & Human Services', 'College of Liberal Arts & Sciences', 'Lee College of Engineering', 'School of Data Science (SDS)']:
                    for p in departments[t].keys():
                        if str(p).strip() in tag.text:
                            departments[t][p]['links'] = tag.get('href')
    return departments                        
    
    
# Checking for tor connection 
requests = get_tor_session()




# To retrieve the staff members's information from the website
def get_information(url):
    # making a request to the website
    response = requests.get(url)
    # saving the log file
    soup = BeautifulSoup(response.text , 'lxml')
    department = soup.find('div', class_='connection-groups').text.strip()
    academic_interests = soup.find('div', class_='connection-links columns-2').text.strip()
    name = soup.find('div', class_='page-title').text.strip()
    bio = soup.find('div', class_='post-contents').text.strip()
    link = url
    staff_member = {}
    staff_member['link'] = link
    staff_member['name'] = name
    staff_member['department'] = department
    staff_member['college'] =  departments.get(department)
    print(staff_member)
    staff_member['academic_interests'] = academic_interests.replace('\n', ' ')
    staff_member['bio'] = bio.replace('\n', ' ')
    return staff_member

    
                       



def query_csv(csv_file, query):
    pysqldf = lambda q: sqldf(q, globals())
    output = pysqldf(query)
    return output
        ## TESTIING: 
    #csv = pd.read_csv('Prototype/Data/staff_info.csv')
    #csv2 = pd.read_csv('Prototype/log/staff_links.csv')
    #print(query_csv(csv, 'select * from csv where bio is not null'))
    #print(query_csv(csv2, 'select * from csv2 '))



    

# departments = departments_fetch()    

# setup_initial_links()
# to print the links in the json file
# print(json.dumps(departments))


# fetching the departments            
#department_per_college = setup_crawing()
#print(department_per_college)


# to add the staff members to the an array to be written to a csv or a json file
def add_staff(url):
    try:
        print('Adding staff')
        new_staff = get_information(url)
        All_STAFF_INFOMATION.append(new_staff)
        print(new_staff['name'] +  ' added successfully')
        
        
    except Exception as e:
        print('error adding staff')
        print(e)
        
# fetching the script for each staff member

def start():
    links = pd.read_csv('Production/links.csv').head(5)    
    
    for link in links['links'] :
        print(link)
        if  'people' in  link :
            print(link)
            staff = get_information(link)
            print(staff)
    return links


def filter_visited():
    links = pd.read_csv('Production/links.csv').get('links').astype(str).tolist()
    #print(links)
    
    for link in str(links).split('\n'):
        if   link not in visited_urls:
            filtered_links.append(link)
        
    return filtered_links

def get_all_links(links, limit):
    original_df = pd.read_csv('Production/staff_info.csv')
    for i in range(0, limit):
        url = links[i]
        visited(url)    
        add_staff(url)
        
                  
        
            
        staff_info_df = pd.DataFrame(All_STAFF_INFOMATION)    
        staff_info_df =staff_info_df.append(original_df)
        staff_info_df.to_csv('Production/staff_info.csv', index=False)

        print(str(All_STAFF_INFOMATION.__len__() )+ ' staff members added for a total of ' + str(len(staff_info_df) ))

#filtered_links = filter_visited()
# to query information from the website with a stop condition
links = pd.read_csv('Production/links.csv').head(100)    
filtered_links =  links['links'].tolist()
get_all_links(filtered_links, 5)


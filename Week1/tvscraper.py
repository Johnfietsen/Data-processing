#!/usr/bin/env python
# Name: Luc Stefelmanns
# Student number: 10669124
# https://github.com/Johnfietsen/Data-processing.git
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''

import csv
import unicodedata

from pattern.web import URL, DOM, plaintext

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'
NR_SERIES = 50


def plain(text):
    '''
    Formats text as plaintext with utf-8.
    '''
    return unicodedata.normalize('NFKD', plaintext(text.encode('utf-8'))).encode('ascii', 'ignore')


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''
    # initialize list of all series
    tvseries = []

    # iterate over series
    for i in range(NR_SERIES):

        # initialize dict with info of series
        series = {}

        # extract all information of series
        info = dom.by_tag('div.lister-item-content')[i]

        # extract title
        h3_title = info.by_tag('h3.lister-item-header')[0]
        series['title'] = plain(h3_title.by_tag('a.')[0].content)

        # extract rating
        series['rating'] = plain(info.by_tag('div.inline-block ratings-imdb-rating')[0].content)

        # extract genres
        series['genres'] = plain(info.by_tag('span.genre')[0].content)

        # extract actors/actresses
        actors = []
        for actor in info.by_tag('p.')[2].by_tag('a.'):
            actors.append(plain(actor.content))
        series['actors'] = ', '.join(actors)

        # extract runtime
        series['runtime'] = plain(info.by_tag('span.runtime')[0].content).strip(' min')

        # act series dict to list
        tvseries.append(series)

    return tvseries


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''

    # initialize writer
    writer = csv.writer(f)

    # place headers
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # fill rows with info of series
    for i in range(NR_SERIES):
        writer.writerow([tvseries[i]['title'], tvseries[i]['rating'], tvseries[i]['genres'],
                         tvseries[i]['actors'], tvseries[i]['runtime']])

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
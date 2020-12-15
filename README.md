# Smash Upset Distance - Frontend

## Introduction

This is the front-end of a web app. The app goal is to allow any Super Smash Bros Ultimate competitive player to calculate what I call his 'upset distance' to the best player in the world at this day, MkLeo. This is better known as 'the MkLeo Number'.

Read more about that on [the backend repo](https://github.com/leopons/smash-upset-distance__backend).

This is the prod app : https://upsets.ssbapps.com/

## Code Structure

This is a fully static frontend using [Vue.js](https://vuejs.org/).
There is no build pipeline, we just serve the files with html inline imports.

## Production Environnement

The website is hosted on GCP, more precisely on a public GCS bucket using a pretty standard GCP Load Balancer and CDN config.

Update the files :

`gsutil -m cp -r * gs://upsets.ssbapps.com`

No caching :

`gsutil -h "Cache-Control:no-cache,max-age=0" -m cp -r * gs://upsets.ssbapps.com`

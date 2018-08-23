# Preview Environment for SOGMI Website

Web app that let's content managers preview pages before publishing them.

HTML Markup generated using Hugo. All information is fetched using Javascript using URL parameters to define the Contentful Entry ID. Contentful API keys are defined as environment variables in Netlify (SOGMI staff wishing to experiment can contact Josh to get the API keys)

Currently Articles are the only content type that can be previewed.

## Getting Started

Download and Install Hugo on your computer. [See Hugo docs](https://gohugo.io).

Declare the following environment variables:
- CONTENTFUL_SPACE
- CONTENTFUL_TOKEN

This is done in your terminal like so: `$env:CONTENTFUL_SPACE = "<space-id-here>"`

Launch hugo dev environment `hugo server` which will host the site at http://localhost:1313

## URL Structure

Each content type gets it's own subdirectory named after the content type. For example the article preview will be found at http://localhost:1313/article

From there you simply specify the Entry ID as a url parameter to preview the entry. http://localhost:1313/article?id=ENTRY-ID-HERE.
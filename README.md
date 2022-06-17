# Manga-Releases-API

_by: Adrien Deveaux and Begonia Calzado_

## What is it?

This is a scrapper API that allows the user to search all relevant informations of a specific manga series or volume, and have the dates of the official english releases. 

## Models Specifications

We have 4 models with one to many and many to many relationships.

* Manga Series
 + name
 + authors
 + synopsis
 + genres
 + publisher
 

* Manga Volumes
  + series
  + title
  + ISBN
  + number
  + releaseDate
  + cover
  

* User
  + username
  + password
  + timestamps
  
  

* Favorite
  + user
  + series



## Postman Documentation

To learn how to use the API you can do so at: [Manga Releases Api Documentation](https://documenter.getpostman.com/view/21225621/UzBjs8Hf "Documentation")


## Where to find us
[Adrien Deveaux](https://github.com/Adriendev "Adrien Deveaux")\
[Begonia Calzado](https://github.com/begoczb "Begonia Calzado")
